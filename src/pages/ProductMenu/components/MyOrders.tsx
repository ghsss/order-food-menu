import { faArrowCircleLeft, faCopy, faList } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import OrderModel, { OrderItemModel } from "../../../models/Order";
import OrderServiceInstance from "../../../services/OrderService";
import AccessCodeServiceInstance from "../../../services/AccessCodeService";
import * as QRCode from 'qrcode';

interface MyOrdersPageProps {
    setCartSelectedItemIdx: (cartSelectedItemIdx: number) => void;
    setSelectedItem: (cart: OrderItemModel | null) => void;
    setShowOrdersPage: (show: boolean) => void;
}

export default function MyOrdersPage({ setShowOrdersPage, setCartSelectedItemIdx, setSelectedItem }: MyOrdersPageProps) {

    const [myOrders, setMyOrders] = useState<OrderModel[]>([]);
    // const [qrCodeBase64DataURL, setQrCodeBase64DataURL] = useState<string | undefined>(undefined);


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
                    onClick={e => { setShowOrdersPage(false); setSelectedItem(null); setCartSelectedItemIdx(-1) }}>
                    <FontAwesomeIcon icon={faArrowCircleLeft} /> {` Voltar`}
                </button>
                <div className='row' style={{ paddingBottom: `1em`, alignItems: `center`, justifyContent: `center`, zIndex: '100' }}>
                    <span style={{ fontSize: `1.25em`, background: '#fff', border: 'solid medium #000', borderRadius: '1em', color: '#000', padding: '.5em' }}>
                        <FontAwesomeIcon icon={faList} /> {` Meus Pedidos`}
                    </span>
                </div>
                <div className="cartContainer" style={{ flexWrap: `wrap`, width: '100vw', height: 'auto', padding: '1em', paddingBottom: '2em', marginTop: '1em', marginBottom: '1em' }}>
                    {/* <span>Meus pedidos</span> */}
                    {myOrders.map(order => {

                        const date_of_expirationFormatted = new Date(order.pixRequest.date_of_expiration).toLocaleString('pt-BR');

                        return (
                            <div className="column">
                                <div className="column" style={{ margin: `.5em`, paddingBottom: '1.5em', minHeight: `10vh`, background: '#fff', border: 'solid medium #000', borderRadius: '1em', maxWidth: '85%', padding: '.125em', color: '#000', textDecoration: 'none' }}>
                                    <span style={{ fontSize: `1.25em`, color: `#000` }}>{`Pedido #${order.orderNumber}`}</span>
                                    <br />
                                    <span style={{ color: `#000` }}>{`Status: ${getOrderStatusLabel(order.paymentStatus)}`}</span>
                                    <div className="column">
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
                                                <div className="row" style={{ display: 'flex', alignItems: `center`, justifyContent: `center`, border: 'solid thin #000', width: `100%`, paddingTop: '1em', paddingBottom: '1em' }}
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
            </div>
        </div >
    );

}