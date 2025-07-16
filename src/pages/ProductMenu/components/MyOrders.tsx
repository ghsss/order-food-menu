import { faArrowCircleLeft, faCheckCircle, faCopy, faList, faPrint, faX, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import OrderModel, { OrderItemModel } from "../../../models/Order";
import OrderServiceInstance from "../../../services/OrderService";
import AccessCodeServiceInstance from "../../../services/AccessCodeService";
import * as QRCode from 'qrcode';
import CompanyServiceInstance from "../../../services/CompanyService";

interface MyOrdersPageProps {
    isAdmin: boolean;
    setCartSelectedItemIdx: (cartSelectedItemIdx: number) => void;
    setSelectedItem: (cart: OrderItemModel | null) => void;
    setShowOrdersPage: (show: boolean) => void;
}

export default function MyOrdersPage({ isAdmin, setShowOrdersPage, setCartSelectedItemIdx, setSelectedItem }: MyOrdersPageProps) {

    const [myOrders, setMyOrders] = useState<OrderModel[]>([]);
    const [showingPrintIcon, setshowingPrintIcon] = useState<IconDefinition>(faPrint);
    const [printerDevice, setPrinterDevice] = useState<BluetoothDevice | null>(null);

    // const [qrCodeBase64DataURL, setQrCodeBase64DataURL] = useState<string | undefined>(undefined);

    async function printOrderReceipt(order: OrderModel) {

        try { // Request Bluetooth Device 

            const getAvailability = await navigator.bluetooth.getAvailability();

            console.log('getAvailability: ', getAvailability);

            if (!getAvailability) {
                alert('Bluetooth indisponível, verifique se o bluetooth do dispositivo está ligado.');
            }

            console.log('printerDevice?.gatt?.connected: ', printerDevice?.gatt?.connected);

            if (!printerDevice?.gatt?.connected) {

                if (!printerDevice?.gatt) {

                    const device = await navigator.bluetooth.requestDevice({ filters: [{ services: ['e7810a71-73ae-499d-8c15-faa9aef0c3f2'] }], optionalServices: ['e7810a71-73ae-499d-8c15-faa9aef0c3f2'] });
                    setPrinterDevice(device);
                    const confirmed = window.confirm(`Confirma a impressão do pedido "${order.orderNumber}" ? `)

                    if (!confirmed) {
                        alert('Impressão cancelada.');
                        return;
                    }

                }

                await printerDevice?.gatt?.connect().catch(err => {
                    // alert();
                    setPrinterDevice(null);
                    throw Error(`Erro ao conectar a impressora.

Por favor tente novamente.`);
                });

            }

            if (printerDevice === null || !printerDevice.gatt?.connected) {
                throw Error(`Erro ao conectar a impressora.

Por favor tente novamente.`);
            }

            const server = printerDevice.gatt;

            // Connect to the device
            const service = await server?.getPrimaryService('e7810a71-73ae-499d-8c15-faa9aef0c3f2');

            const characteristic = await service?.getCharacteristic('bef8d6c9-9c21-4c9e-b632-bd58c1009f9f');

            // Receipt data (ESC/POS Commands)
            const encoder = new TextEncoder();

            const printHeader = async () => {

                function displayCNPJ(cnpj: string) {
                    return cnpj.substring(0, 2) + '.' + cnpj.substring(2, 5) + '.' + + cnpj.substring(5, 8) + '/' + cnpj.substring(8, 12) + '-' + cnpj.substring(12, 14);
                }

                const company = await CompanyServiceInstance.getCompany();

                const headerData = encoder.encode(`\x1B\x61\x01 - INICIO -

\x1B\x40${company?.name}
${company?.cnpj ? `\x1B\x40CNPJ: ${displayCNPJ(company?.cnpj)}` : '\r'}
${company?.phoneNumber ? `\x1B\x40TELEFONE: ${company?.phoneNumber}` : '\r'}

\x1B\x40PEDIDO:
\x1B\x61\x01\x1B\x4D\x02${order.orderNumber}
TOTAL: \x1B\x61\x01R$ ${order.paymentAmount.toFixed(2).replace(`.`, `, `)}
\x1B\x40FORMA DE PAGAMENTO: ${order.paymentMethod.name}
\x1B\x40PAGO: ${(order.paymentMethod.isOnlinePayment ? (order.paymentStatus === 'approved' || order.paymentStatus === 'finished')
                        :
                        order.receivedPaymentInLocal === true) === true ? 'SIM' : 'NAO'
                    }
\x1B\x40ITENS:`);
                await characteristic?.writeValue(headerData);

            }

            const printBody = async () => {

                for await (const orderItem of order.items) {

                    const orderItemIdx = order.items.indexOf(orderItem);

                    let additionalProductsTotal = 0;

                    const additionalProductsSubtotals = (Array.isArray(orderItem?.additionalProducts) ?
                        orderItem?.additionalProducts : []).map(additionalProduct => {
                            return additionalProduct.price * additionalProduct.qty;
                        });

                    for (const subtotal of additionalProductsSubtotals) {

                        additionalProductsTotal += subtotal;

                    }

                    const orderItemTxt = orderItemIdx === 0 ? `
\x1B\x61\x01\x1B\x4D\x00-------------------------------
\x1B\x40\x1B\x4D\x00${orderItem.qty}x ${orderItem.name.replace(
                        /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g,
                        ''
                    )
                            .replace(/\s+/g, ' ')
                            .trim()} | OBS: ${orderItem.obs} | Adicionais: ${orderItem?.additionalProducts?.map((additionalProduct, additionalProductIdx) => {
                                return `(${additionalProduct.qty}x) ${additionalProduct.name} = R$${(additionalProduct.qty * additionalProduct.price).toFixed(2)}`;
                            }).join(`, `)} | Valor: R$ ${orderItem.price.toFixed(2).replace('.', ',')} (Uni) | Subtotal: R$ ${((orderItem.qty * orderItem.price) + additionalProductsTotal).toFixed(2).replace('.', ',')}
\x1B\x61\x01\x1B\x4D\x00-------------------------------`
                        :
                        `\x1B\x40\x1B\x4D\x00${orderItem.qty}x ${orderItem.name.replace(
                            /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g,
                            ''
                        )
                            .replace(/\s+/g, ' ')
                            .trim()} | OBS: ${orderItem.obs} | Adicionais: ${orderItem?.additionalProducts?.map((additionalProduct, additionalProductIdx) => {
                                return `(${additionalProduct.qty}x) ${additionalProduct.name} = R$${(additionalProduct.qty * additionalProduct.price).toFixed(2)}`;
                            }).join(`, `)} | Valor: R$ ${orderItem.price.toFixed(2).replace('.', ',')} (Uni) | Subtotal: R$ ${((orderItem.qty * orderItem.price) + additionalProductsTotal).toFixed(2).replace('.', ',')}
\x1B\x61\x01\x1B\x4D\x00-------------------------------`
                    // return orderItemTxt;
                    const orderItemData = encoder.encode(orderItemTxt);
                    await characteristic?.writeValue(orderItemData);
                }
            }
            const printFooter = async () => {

                const footerData = encoder.encode(`
\x1B\x61\x01${new Date().toLocaleString('pt-BR')}
\n\x1B\x61\x01 - FIM -
\n\x1B\x64\x02`);
                await characteristic?.writeValue(footerData);

            }

            await printHeader();
            await printBody();
            await printFooter();

            // const receiptDate = encoder.encode("\x1B" + new Date().toLocaleString('pt-BR') + "\n\x1B\x64\x02\x1D\x56\x41");

        } catch (error) {
            console.error('Error:', error);
            if (error instanceof Error) {
                console.error('Failed to print receipt: ' + error.message);
                throw Error(error.message);
            }
        }

    }

    async function handlePrintItem(item: OrderModel) {

        // Copy the text inside the text field
        try {

            setTimeout(async () => {

                const confirmed = window.confirm(`Confirma a impressão do pedido "${item.orderNumber}" ? `)
                // setshowingIcon(faCheckCircle);
                if (confirmed) {

                    await printOrderReceipt(item)
                        .then(() => {

                            setshowingPrintIcon(faCheckCircle);
                            setTimeout(() => {
                                // removeItemFromList(item);
                                window.alert('Impressão finalizada com sucesso.');
                                setshowingPrintIcon(showingPrintIcon);
                                // window.location.href = '/admin?action=list&collection=Order';
                            }, 50);

                        }).catch(err => {
                            alert('Erro ao imprimir pedido: ' + err.toString());
                        });

                }

            }, 50);

        } catch (error) {

            setshowingPrintIcon(faX);

        }

    }

    useEffect(() => {

        syncMyOrders();

    }, []);

    async function syncMyOrders() {

        const waitSeconds = (seconds: number) => {
            return new Promise<void>((resolve, reject) => {
                setTimeout(() => {
                    resolve();
                }, seconds * 1000);
            })
        }
        if (typeof AccessCodeServiceInstance.getStoredAccessCode() !== 'undefined') {

            const myOrdersRef = await OrderServiceInstance.getCustomerOrders();
            if (myOrdersRef) {
                for (const myOrder of myOrdersRef) {
                    if (myOrder.paymentQRCode) {

                        myOrder.paymentQRCodeBase64DataURL = await stringToQRBase64(myOrder.paymentQRCode);

                    }
                }
                setMyOrders([...myOrdersRef]);
            }

            await waitSeconds(60);

        } else {

            await waitSeconds(1);

        }


        await syncMyOrders();

    }

    function getOrderStatusLabel(paymentStatus: string): string {
        const labels: { [index: string]: any } = { "pending": 'AGUARDANDO PAGAMENTO ...', 'approved': 'EM PRODUÇÃO 🔥', 'finished': 'CONCLUÍDO ✅', 'expired': 'CANCELADO ❌' };
        return labels[paymentStatus];
    }

    async function stringToQRBase64(qr: string) {
        let QRbase64 = await new Promise<string>((resolve, reject) => {
            QRCode.toDataURL(qr, function (err, code) {
                if (err) {
                    reject();
                    // setQRCodeBase64(undefined);
                    // setQrCodeBase64DataURL('')
                    return;
                }
                // setQRCodeBase64(code);
                // setQrCodeBase64DataURL(code)
                resolve(code);
            });
        });
        console.log(QRbase64);
        return QRbase64;
    }

    return (
        <div className='cartModal'>
            <div className="cartModalScroll">
                <button className='goBackButton' style={{ borderWidth: `medium`, fontWeight: 'bold', fontSize: '1.125em', justifySelf: `flex-start`, alignSelf: `flex-start`, marginLeft: `1em`, marginBottom: '1em', marginTop: '1em' }}
                    onClick={e => {
                        // setShowOrdersPage(false); setSelectedItem(null); setCartSelectedItemIdx(-1)
                        window.location.href = `/`;
                    }
                    }>
                    <FontAwesomeIcon icon={faArrowCircleLeft} /> {` Voltar`}
                </button>
                <div className='row' style={{ paddingBottom: `1em`, alignItems: `center`, justifyContent: `center`, zIndex: '100' }}>
                    <span style={{ fontSize: `1.25em`, background: '#fff', border: 'solid medium #000', borderRadius: '1em', color: '#000', padding: '.5em' }}>
                        <FontAwesomeIcon icon={faList} /> {` Meus Pedidos`}
                    </span>
                </div>
                <div className="cartContainer" style={{ alignItems: `center`, justifyContent: `center`, flexWrap: `wrap`, width: '100vw', minHeight: '20%', padding: '1em', paddingTop: '1.5em', paddingBottom: '1.5em', marginTop: '1em', marginBottom: '6em' }}>
                    {/* <span>Meus pedidos</span> */}
                    {myOrders.length === 0 ?
                        <span>Nenhum pedido encontrado</span>
                        :
                        <></>}
                    {myOrders.map((order, orderIdx) => {

                        const date_of_expirationFormatted = new Date(order.pixRequest.date_of_expiration).toLocaleString('pt-BR');

                        return (
                            <div key={`order-${orderIdx}`} className="column">
                                <div className="column" style={{ margin: `.5em`, paddingBottom: '1.5em', minHeight: `10vh`, background: '#fff', border: 'solid medium #000', borderRadius: '1em', maxWidth: '85%', padding: '.125em', color: '#000', textDecoration: 'none' }}>
                                    {
                                        isAdmin ?
                                            <div id='printIcon' style={{
                                                color: (showingPrintIcon === faPrint ? `${printerDevice?.gatt?.connected ? `blue` : `grey`}` : (showingPrintIcon === faX ? `red` : `grey`)),
                                                justifySelf: `flex-end`, marginRight: `2em`, marginTop: `2em`,
                                                zIndex: `100`
                                            }}
                                                onClick={async e => {
                                                    e.stopPropagation();
                                                    await handlePrintItem(order);
                                                }}
                                            >
                                                <FontAwesomeIcon
                                                    icon={showingPrintIcon}
                                                />
                                            </div>
                                            :
                                            <></>
                                    }
                                    <span style={{ margin: `.25em`, fontSize: `1.5em`, color: `#000` }}>{`Pedido #${order.orderNumber}`}</span>
                                    {/* <br /> */}
                                    <span style={{ color: `#000` }}>{`Data: ${new Date(order.createdAt).toLocaleString('pt-BR').substring(0, new Date(order.createdAt).toLocaleString('pt-BR').length - 3).replace(',', ' às')}`}</span>
                                    <br />
                                    <span style={{ color: `#000` }}>{`Status: ${getOrderStatusLabel(order.paymentStatus)}`}</span>
                                    <div className="column" style={{ marginTop: '.5em' }}>
                                        <div className="row" style={{ width: `100%`, justifyContent: `center`, border: 'solid thin #000' }}>
                                            <p style={{ fontSize: `1.25em`, color: `#000`, textDecoration: 'none', background: '#fff', padding: '.125em', border: 'solid medium #000', borderRadius: '1em' }}>Total: R$ {order.paymentAmount.toFixed(2).replace('.', ',')}</p>
                                        </div>
                                        {order.items.map((orderItem, orderItemIdx) => {

                                            let additionalProductsTotal = 0;

                                            const additionalProductsSubtotals = (Array.isArray(orderItem?.additionalProducts) ?
                                                orderItem?.additionalProducts : []).map(additionalProduct => {
                                                    return additionalProduct.price * additionalProduct.qty;
                                                });

                                            for (const subtotal of additionalProductsSubtotals) {

                                                additionalProductsTotal += subtotal;

                                            }

                                            return (
                                                <div key={`order-${orderIdx}-item-${orderItemIdx}`} className="row" style={{ display: 'flex', alignItems: `center`, justifyContent: `center`, border: 'solid thin #000', width: `100%`, paddingTop: '1em', paddingBottom: '1em' }}
                                                // onClick={e => { setShowCartPage(false); setCartSelectedItemIdx(orderItemIdx); setSelectedItem(orderItem) }}
                                                >
                                                    {/* <div className="row"
                                                                            style={{
                                                                                justifySelf: `flex-end`,
                                                                            }}
                                                                        > */}
                                                    <div style={{ paddingBottom: '1.5em', background: '#fff', border: 'solid medium #000', borderRadius: '1em', maxWidth: '90%', padding: '.125em', color: '#000', textDecoration: 'none' }}>

                                                        {/* </div> */}
                                                        <span style={{ padding: '1.5em', color: `#000` }}>
                                                            ({orderItem.qty}x) {orderItem.name} {orderItem.obs.length > 0 ? `| OBS: ${orderItem.obs}` : ''}{Array.isArray(orderItem?.additionalProducts) && orderItem?.additionalProducts?.length > 0 ?
                                                                ` | Adicionais: ${orderItem?.additionalProducts?.map((additionalProduct, additionalProductIdx) => {
                                                                    return `(${additionalProduct.qty}x) ${additionalProduct.name} = R$${(additionalProduct.qty * additionalProduct.price).toFixed(2)}`;
                                                                }).join(`, `)}`
                                                                :
                                                                ''} | Valor: R$ {orderItem.price.toFixed(2).replace('.', ',')} (Uni) | Subtotal: R$ {((orderItem.qty * orderItem.price) + additionalProductsTotal).toFixed(2).replace('.', ',')}
                                                        </span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    {
                                        order.paymentStatus === `pending` && order.paymentMethod.isOnlinePayment && order.paymentMethod.id === `PIX` && typeof order.paymentQRCode === `string` ?
                                            <>
                                                <p style={{ color: `#000`, fontSize: '1.125em' }}><span style={{ color: `#000`, fontSize: '1em' }}>Prazo para realizar o pagamento: </span><br />30 minutos <br />({date_of_expirationFormatted.substring(0, date_of_expirationFormatted.length - 3).replace(`,`, ``)})</p>
                                                <button className='goBackButton'
                                                    style={{ marginTop: `.5em`, fontSize: '1.125em', maxWidth: '90%', alignSelf: 'center' }}
                                                    onClick={async e => {
                                                        if (order.paymentQRCode)
                                                            await navigator.clipboard.writeText(order.paymentQRCode)
                                                                .then(() => window.alert('Pix QRCode copiado!'));
                                                    }}>
                                                    <FontAwesomeIcon icon={faCopy} />
                                                    {' Clique aqui para copiar o Pix QR Code'}
                                                </button>
                                                <img src={order.paymentQRCodeBase64DataURL} alt="Pix QRCode" style={{
                                                    maxWidth: '80%',
                                                    alignSelf: 'center',
                                                    justifySelf: 'center',
                                                    marginTop: '.25em'
                                                }} />
                                            </>
                                            :
                                            <></>
                                    }
                                </div>
                            </div>
                        )
                    })}
                </div>
                <div className="row"
                    style={{ marginTop: '1em' }}
                ></div>
            </div>
        </div >
    );

}