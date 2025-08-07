import { faArrowCircleLeft, faCheckCircle, faCopy, faList, faPrint, faRefresh, faTruck, faX, IconDefinition } from "@fortawesome/free-solid-svg-icons";
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
    const [showingIcons, setshowingIcons] = useState<{ [index: string]: IconDefinition }>({});
    const [showingPrintIcon, setshowingPrintIcon] = useState<IconDefinition>(faPrint);
    const [printerDevice, setPrinterDevice] = useState<BluetoothDevice | null>(null);

    // const [qrCodeBase64DataURL, setQrCodeBase64DataURL] = useState<string | undefined>(undefined);

    function sortOrders(ordersToSort: OrderModel[]) {
        ordersToSort.sort((a: OrderModel, b: OrderModel) => {
            if (a.orderNumber && b.orderNumber)
                return a.orderNumber - b.orderNumber;
            else
                return 0;
        });
        const statusOrderBy: { [index: string]: number } = { 'approved': 1, 'pending': 2, 'finished': 3, 'expired': 4 };
        ordersToSort.sort((a: OrderModel, b: OrderModel) => {
            return statusOrderBy[a.paymentStatus] - statusOrderBy[b.paymentStatus];
        });
        ordersToSort.sort((a: OrderModel, b: OrderModel) => {
            const descStatus = ['finished', 'expired'];
            if (descStatus.includes(a.paymentStatus) && descStatus.includes(b.paymentStatus) && a.paymentStatus === b.paymentStatus) {
                if (a.orderNumber && b.orderNumber)
                    return b.orderNumber - a.orderNumber;
                else
                    return 0;
            }
            return 0;
        });
    }

    function updateOrderPaymentReceived(itemToUpdate: OrderModel): boolean {

        if (itemToUpdate._id) {

            const idxToUpdate = myOrders.findIndex(item =>
                (itemToUpdate._id && item._id?.toLowerCase().includes(itemToUpdate._id.toLowerCase()))
                || item?.orderNumber === itemToUpdate?.orderNumber
            )

            if (idxToUpdate > -1) {

                myOrders[idxToUpdate].receivedPaymentInLocal = true;

                console.log('Updated ' + idxToUpdate + ' receivedPaymentInLocal from order list.');

                sortOrders(myOrders);

                setMyOrders(JSON.parse(JSON.stringify(myOrders)));

                // setFilteredProductMenuOptions(productMenuOptions);

                return true

            }

        }

        return false

    }

    function updateOrderFinished(itemToUpdate: OrderModel): boolean {

        if (itemToUpdate._id) {

            const idxToUpdate = myOrders.findIndex(item =>
                (itemToUpdate._id && item._id?.toLowerCase().includes(itemToUpdate._id.toLowerCase()))
                || item?.orderNumber === itemToUpdate?.orderNumber
            )

            if (idxToUpdate > -1) {

                myOrders[idxToUpdate].paymentStatus = 'finished';
                myOrders[idxToUpdate].companyNotified = false;
                myOrders[idxToUpdate].customerNotified = false;

                console.log('Updated ' + idxToUpdate + ' from order list.');

                sortOrders(myOrders);

                setMyOrders(JSON.parse(JSON.stringify(myOrders)));

                return true

            }

        }

        return false

    }

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

    async function handleCopyItemCode(event: React.MouseEvent<HTMLDivElement, MouseEvent>, item: OrderModel) {

        // Copy the text inside the text field
        try {

            setTimeout(async () => {

                if (item.paymentStatus !== 'approved') {
                    window.alert('Só é possível finalizar pedidos em produção, onde o pagamento foi aprovado.');
                    return;
                }

                const confirmed = window.confirm(`Confirma a finalização do pedido N°: "${item.orderNumber}" ? `)
                // setshowingIcon(faCheckCircle);
                if (confirmed && item.orderNumber && item._id && item.paymentStatus === 'approved') {

                    const finishedOrderId = await OrderServiceInstance.finishOrder(item._id);

                    if (finishedOrderId === item._id && item.orderNumber) {

                        updateOrderFinished(item);

                        setshowingIcons({ ...showingIcons, [item.orderNumber.toString()]: faCheckCircle });
                        setTimeout(() => {

                            window.alert('Pedido finalizado com sucesso.');

                            item.paymentStatus = 'finished';
                            item.customerNotified = false;
                            item.companyNotified = false;

                            if (item.orderNumber)
                                // setshowingIcon(getIconByPaymentStatus(item.paymentStatus));
                                setshowingIcons({ ...showingIcons, [item.orderNumber.toString()]: getIconByPaymentStatus(item.paymentStatus) });
                            // window.location.href = '/admin?action=list&collection=productType';
                        }, 50);
                        // REMOVE ITEM FROM LIST

                        // window.location.href = '/admin?action=list&collection=productType';
                    }
                    else {
                        // window.alert(`Erro ao excluir tipo de produto.`);
                    }

                } else {
                    if (confirmed) {
                        window.alert('Só é possível finalizar pedidos em produção, onde o pagamento foi aprovado.');
                    }
                }

            }, 50);

        } catch (error) {

            if (item.orderNumber)
                setshowingIcons({ ...showingIcons, [item.orderNumber.toString()]: faX });
            // setshowingIcon(faX);

        }

    }

    async function handleReceivedOrderPayment(event: React.MouseEvent<HTMLDivElement, MouseEvent>, item: OrderModel) {

        // Copy the text inside the text field
        try {
            setTimeout(async () => {

                if (item.paymentMethod.isOnlinePayment === true) {
                    window.alert('Só é possível confirmar pagamentos de pedidos com a forma de pagamento na retirada.');
                    return;
                }

                const confirmed = window.confirm(`Confirma ter recebido o pagamento do pedido N°: "${item.orderNumber}" ? `)
                // setshowingIcon(faCheckCircle);
                if (confirmed && item.orderNumber && item._id && item.receivedPaymentInLocal === false) {

                    const confirmedOrderPaymentId = await OrderServiceInstance.confirmPayment(item._id);

                    if (confirmedOrderPaymentId === item._id) {

                        updateOrderPaymentReceived(item);
                        setshowingIcons({ ...showingIcons, [item.orderNumber.toString()]: faCheckCircle });
                        setTimeout(() => {

                            window.alert('Pagamento do pedido atualizado com sucesso.');

                            // item.customerNotified = false;
                            // item.companyNotified = false;
                            if (item.orderNumber)
                                setshowingIcons({ ...showingIcons, [item.orderNumber.toString()]: getIconByPaymentStatus(item.paymentStatus) });
                            // setshowingIcon(getIconByPaymentStatus(item.paymentStatus));
                            // window.location.href = '/admin?action=list&collection=productType';
                        }, 50);
                        // REMOVE ITEM FROM LIST

                        // window.location.href = '/admin?action=list&collection=productType';
                    }
                    else {
                        // window.alert(`Erro ao excluir tipo de produto.`);
                    }

                } else {
                    if (confirmed) {
                        window.alert('Pagamento do pedido já foi confirmado.');
                    }
                }

            }, 50);

        } catch (error) {

            if (item.orderNumber)
                setshowingIcons({ ...showingIcons, [item.orderNumber.toString()]: faX });

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
                for (const order of myOrdersRef) {
                    if (order.orderNumber && !Object.keys(showingIcons).includes(order.orderNumber.toString())) {
                        setshowingIcons({ ...showingIcons, [order.orderNumber.toString()]: getIconByPaymentStatus(order.paymentStatus) });
                    }
                }
            }

            await waitSeconds(60);

        } else {

            await waitSeconds(1);

        }


        await syncMyOrders();

    }

    function getIconByPaymentStatus(paymentStatus: string): IconDefinition {
        return paymentStatus === 'approved' ? faTruck : paymentStatus === 'finished' ? faCheckCircle : paymentStatus === 'pending' ? faRefresh : faX;
    }
    function getPaymentStatusLabel(paymentStatus: string): string {
        const labels: { [index: string]: any } = { "pending": 'PAGAMENTO PENDENTE ❌', 'approved': 'PAGAMENTO APROVADO! ✅', 'finished': 'PAGAMENTO APROVADO! ✅ (PEDIDO FINALIZADO)', 'expired': 'PAGAMENTO EXPIROU ❌', 'canceled': 'PAGAMENTO EXPIROU ❌', 'cancelled': 'PAGAMENTO EXPIROU ❌' };
        return labels[paymentStatus];
    }
    function getOrderStatusLabel(paymentStatus: string): string {
        const labels: { [index: string]: any } = { "pending": 'AGUARDANDO PAGAMENTO ...', 'approved': 'EM PRODUÇÃO 🔥', 'finished': 'CONCLUÍDO ✅', 'expired': 'CANCELADO ❌', 'canceled': 'CANCELADO ❌', 'cancelled': 'CANCELADO ❌' };
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

    useEffect(() => {

        console.log(`isAdmin? ${isAdmin}`);

    }, [isAdmin]);

    useEffect(() => {

        console.log('showingIcons', showingIcons);

    }, [showingIcons]);

    useEffect(() => {

        console.log(`myOrders? ${myOrders}`);

        for (const order of myOrders) {
            if (order.orderNumber && !Object.keys(showingIcons).includes(order.orderNumber.toString())) {
                setshowingIcons({ ...showingIcons, [order.orderNumber.toString()]: getIconByPaymentStatus(order.paymentStatus) });
            }
        }

    }, [myOrders]);

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
                <div className='row' style={{ paddingBottom: `1em`, alignItems: `center`, justifyContent: `center`, zIndex: '100' }}>
                    <span style={{ fontSize: `1.25em`, background: '#fff', border: 'solid medium #000', borderRadius: '1em', color: '#000', padding: '.5em' }}>
                        {`Tempo de preparo do pedido: 15 à 30 minutos`}
                    </span>
                </div>
                <div className="cartContainer" style={{ alignItems: `center`, justifyContent: `center`, flexWrap: `wrap`, width: '100vw', minHeight: '20%', padding: '1em', paddingTop: '1.5em', paddingBottom: '1.5em', marginTop: '1em', marginBottom: '6em' }}
                >
                    {/* <span>Meus pedidos</span> */}
                    {myOrders.length === 0 ?
                        <span>Nenhum pedido encontrado</span>
                        :
                        <></>}
                    {myOrders.map((order, orderIdx) => {

                        const date_of_expirationFormatted = new Date(order.pixRequest.date_of_expiration).toLocaleString('pt-BR');

                        return (
                            <div key={`order-${orderIdx}`} className="column"
                                onClick={async event => {
                                    if (isAdmin)
                                        await handleCopyItemCode(event, order)
                                }}>
                                <div className="column" style={{ margin: `.5em`, paddingBottom: '1.5em', minHeight: `10vh`, background: '#fff', border: 'solid medium #000', borderRadius: '1em', maxWidth: '85%', padding: '.125em', color: '#000', textDecoration: 'none' }}>
                                    {
                                        isAdmin && order.orderNumber ?
                                            <div className="row" style={{ width: '92.5%' }}>
                                                <div className={showingIcons[order.orderNumber.toString()] === faTruck ? 'moveCar copyIcon' : showingIcons[order.orderNumber.toString()] === faRefresh ? `rotateRefreshBig copyIcon` : 'copyIcon'} style={{
                                                    color: (showingIcons[order.orderNumber.toString()] === faTruck || showingIcons[order.orderNumber.toString()] === faRefresh ? `inherit` : (showingIcons[order.orderNumber.toString()] === faX ? `red` : `green`)),
                                                    justifySelf: `flex-start`, marginLeft: `1em`, marginTop: `2em`,
                                                    zIndex: `100`,
                                                    transform: 'scale(3) translateY(-.25em)'
                                                }} >
                                                    <FontAwesomeIcon
                                                        icon={showingIcons[order.orderNumber.toString()]}
                                                    />
                                                </div>
                                                <div id='printIcon' style={{
                                                    color: (showingPrintIcon === faPrint ? `${printerDevice?.gatt?.connected ? `blue` : `grey`}` : (showingPrintIcon === faX ? `red` : `grey`)),
                                                    justifySelf: `flex-end`, marginRight: `1em`, marginTop: `2em`,
                                                    zIndex: `100`,
                                                    transform: 'scale(3)translateY(-.25em)'
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
                                        <div className="column" style={{ width: `100%`, justifyContent: `center`, border: 'solid thin #000' }}>
                                            <p style={{ fontSize: `1.25em`, color: `#000`, textDecoration: 'none', background: '#fff', padding: '.125em', border: 'solid medium #000', borderRadius: '1em' }}>Total: R$ {order.paymentAmount.toFixed(2).replace('.', ',')}</p>
                                            {
                                                !isAdmin ?
                                                    <></>
                                                    :
                                                    order.paymentMethod.isOnlinePayment ?
                                                        <p id='itemPaymentStatus' style={{ zIndex: 100, textDecoration: `none`, color: `#000`, width: `33%`, fontSize: `1em`, border: `solid thin #000`, borderRadius: `1em`, padding: `.5em` }}>
                                                            <span style={{ color: '#000' }}>Status do pagamento: </span>
                                                            {getPaymentStatusLabel(order.paymentStatus)}
                                                        </p>
                                                        :
                                                        <p style={{ zIndex: 100, textDecoration: `none`, color: `#000`, width: `33%`, fontSize: `1em`, border: `solid thin #000`, borderRadius: `1em` }} id='itemReceivedPaymentInLocal' className='itemReceivedPaymentInLocal' onClick={async e => {
                                                            e.stopPropagation();
                                                            if (!order.receivedPaymentInLocal) {
                                                                console.log('itemReceivedPaymentInLocal click');
                                                                await handleReceivedOrderPayment(e, order);
                                                            } else {
                                                                window.alert('Pagamento do pedido já foi confirmado.');
                                                            }
                                                        }}>
                                                            <span style={{ color: `#000` }}>{order.receivedPaymentInLocal ? `Status do pagamento: ` : `Recebeu o pagamento? Clique aqui 👇🏻`}</span>
                                                            {order.receivedPaymentInLocal ? 'PAGO' : 'AGUARDANDO PAGAMENTO ...'}
                                                            {order.receivedPaymentInLocal ?
                                                                <FontAwesomeIcon color='green' icon={faCheckCircle} />
                                                                :
                                                                <FontAwesomeIcon className='rotateRefresh' color='rgb(182, 182, 182)' icon={faRefresh} />
                                                            }
                                                        </p>
                                            }
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