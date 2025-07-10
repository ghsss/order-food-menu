import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { paymentMethods } from "../../../consts/PaymentMethods";
import OrderModel, { OrderItemModel } from "../../../models/Order";
import { faArrowCircleLeft, faArrowRight, faCartShopping, faCopy, faPencil, faTrash } from "@fortawesome/free-solid-svg-icons";
import * as QRCode from 'qrcode';

import './styles/Cart.css'
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import OrderServiceInstance from "../../../services/OrderService";
import CartServiceInstance from "../../../services/CartService";
import { useEffect, useState } from "react";
import AccessCodeServiceInstance from "../../../services/AccessCodeService";
interface ProductMenuListItemProps {
    //   handleItemClick: (item: ProductModel, setshowingIcon: Dispatch<SetStateAction<IconDefinition>>) => void,
    //   item: ProductModel;
    cart: OrderModel;
    setCartSelectedItemIdx: (cartSelectedItemIdx: number) => void;
    setSelectedItem: (cart: OrderItemModel | null) => void;
    setCart: (cart: OrderModel) => void;
    setShowCartPage: (show: boolean) => void;
    children?: React.ReactNode;
}

export default function CartPage({ cart, setCart, setShowCartPage, setCartSelectedItemIdx, setSelectedItem }: ProductMenuListItemProps) {

    let paymentAmount = 0;

    for (const orderItem of cart.items) {

        let orderItemSum = 0;
        orderItemSum += orderItem.price * orderItem.qty;
        if (Array.isArray(orderItem.additionalProducts)) {
            for (const additionalProduct of orderItem.additionalProducts) {
                orderItemSum += additionalProduct.price * additionalProduct.qty;
            }
        }

        paymentAmount += orderItemSum;

    }
    paymentAmount = parseFloat(paymentAmount.toFixed(2));
    if (paymentAmount !== cart.paymentAmount)
        setCart({ ...cart, paymentAmount })

    function getOrderResume(order: OrderModel, itemToSum?: OrderItemModel) {

        let totalValue = 0;

        const orderItems = typeof order === 'undefined' ? [] : order.items;
        const customerFormattedNumber = typeof order === 'undefined' ? '' : '\nCLIENTE: ' + order.customerFormattedNumber;
        let paymentMethod = ``
        if (typeof order !== 'undefined') {
            paymentMethod = typeof order.paymentMethod === `undefined` ? '' : '\nForma de pagamento: ' + order.paymentMethod.name;
        }
        let itemsResumeTxt = ``;

        for (const orderItem of orderItems) {

            const orderItemIdx = orderItems.indexOf(orderItem);

            let additionalProductsTotal = 0;

            const additionalProductsSubtotals = (Array.isArray(orderItem?.additionalProducts) ?
                orderItem?.additionalProducts : []).map(additionalProduct => {
                    return additionalProduct.price * additionalProduct.qty;
                });

            for (const subtotal of additionalProductsSubtotals) {

                additionalProductsTotal += subtotal;

            }

            let itemMsg = (orderItemIdx === 0 ? `` : '\n\n') + `❤️‍🔥 Item ${orderItemIdx + 1}
${orderItem.name}
${orderItem.qty} unidade(s).
Preço/unidade: R$${(orderItem.price).toFixed(2)}
Subtotal do item: R$${((orderItem.price * orderItem.qty) + additionalProductsTotal).toFixed(2)}
OBS: ${orderItem.obs} ${Array.isArray(orderItem?.additionalProducts) ?
                    `
Adicionais: ${orderItem?.additionalProducts?.map((additionalProduct, additionalProductIdx) => {
                        return `(${additionalProduct.qty}x) ${additionalProduct.name} = R$${(additionalProduct.qty * additionalProduct.price).toFixed(2)}`;
                    }).join(`, `)}` : ``}`;

            itemsResumeTxt += itemMsg;

            totalValue += (orderItem.price * orderItem.qty) + additionalProductsTotal;

        }

        let additionalProductsTotal = 0;

        const additionalProductsSubtotals = (itemToSum && Array.isArray(itemToSum?.additionalProducts) ?
            itemToSum?.additionalProducts : []).map(additionalProduct => {
                return additionalProduct.price * additionalProduct.qty;
            });

        if (Array.isArray(additionalProductsSubtotals)) {

            for (const subtotal of additionalProductsSubtotals) {

                additionalProductsTotal += subtotal;

            }
        }

        totalValue = itemToSum ? totalValue + ((itemToSum.price * itemToSum.qty) + additionalProductsTotal) : totalValue;

        // totalValue += (orderItem.price * orderItem.qty) + additionalProductsTotal

        if (typeof order !== 'undefined') {

            order.paymentAmount = parseFloat((totalValue).toFixed(2));

        }

        let orderResumeTxt = `Resumo do pedido 📜👇🏻
    ${customerFormattedNumber}
Valor total: R$${(totalValue).toFixed(2)}`
            + paymentMethod + '\n\n' + itemsResumeTxt +
            (itemToSum ? (itemsResumeTxt.length === 0 ? '' : '\n\n') + `❤️‍🔥 Item ${orderItems.length + 1}
${itemToSum.name}
${itemToSum.qty} unidade(s).
Preço/unidade: R$${(itemToSum.price).toFixed(2)}
Subtotal do item: R$${((itemToSum.price * itemToSum.qty) + additionalProductsTotal).toFixed(2)}
OBS: ${itemToSum.obs} ${Array.isArray(itemToSum?.additionalProducts) ?
                    `
Adicionais: ${itemToSum?.additionalProducts?.map((additionalProduct, additionalProductIdx) => {
                        return `(${additionalProduct.qty}x) ${additionalProduct.name} = R$${(additionalProduct.qty * additionalProduct.price).toFixed(2)}`;
                    }).join(`, `)}` : ``}` : ``);

        return orderResumeTxt;

    }

    function getItemResume(item: OrderItemModel, itemIdx: number) {

        let additionalProductsTotal = 0;

        const additionalProductsSubtotals = (item && Array.isArray(item?.additionalProducts) ?
            item?.additionalProducts : []).map(additionalProduct => {
                return additionalProduct.price * additionalProduct.qty;
            });

        if (Array.isArray(additionalProductsSubtotals)) {

            for (const subtotal of additionalProductsSubtotals) {

                additionalProductsTotal += subtotal;

            }
        }

        return (
            item ?
                <>
                    <span style={{ textDecoration: 'none', color: '#000' }}>{`❤️‍🔥 Item ${itemIdx}`}</span><br />
                    <br /><span style={{ textDecoration: 'none', color: '#000' }}>{`${item.name}`}</span>
                    <br /><span style={{ textDecoration: 'none', color: '#000' }}>{`${item.qty} unidade(s).`}</span>
                    <br /><span style={{ textDecoration: 'none', color: '#000' }}>{`Preço/unidade: R$${(item.price).toFixed(2)}`}</span>
                    <br /><span style={{ textDecoration: 'none', color: '#000' }}>{`Subtotal do item: R$${((item.price * item.qty) + additionalProductsTotal).toFixed(2)}`}</span>
                    <br /><span style={{ textDecoration: 'none', color: '#000' }}>{`${item.qty} unidade(s).`}</span>
                    <br /><span style={{ textDecoration: 'none', color: '#000' }}>{`OBS: ${item.obs}`}</span>
                    <br /><span style={{ textDecoration: 'none', color: '#000' }}>{`${Array.isArray(item?.additionalProducts) ?
                        `
                    Adicionais: ${item?.additionalProducts?.map((additionalProduct, additionalProductIdx) => {
                            return `(${additionalProduct.qty}x) ${additionalProduct.name} = R$${(additionalProduct.qty * additionalProduct.price).toFixed(2)}`;
                        }).join(`, `)}` : ``}`}</span>
                </>
                :
                ``
        );
    }

    async function handleOrderSubmit() {

        if (cart.items.length === 0) {
            window.alert('É necessário ao menos um item para finalizar o pedido.');
            return;
        }

        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + 30);
        expiresAt.setSeconds(expiresAt.getSeconds() + 1);

        cart.pixRequest.date_of_expiration = expiresAt.toISOString();

        setCart({
            ...cart, pixRequest: {
                ...cart.pixRequest,
                date_of_expiration: expiresAt.toISOString()
            }
        });

        if (cart.paymentMethod.isOnlinePayment) {
            if (cart.pixRequest.payer.email.length < 5) {
                window.alert('E-mail é obrigatório para pagamento online.');
                return;
            } else if (cart.pixRequest.payer.identification.number.length < 11) {
                window.alert('CPF/CNPJ é obrigatório para pagamento online.');
                return;
            } else {

            }
        }

        if (cart.chatId.length < 17) {
            window.alert('WhatsApp é obrigatório.\n\nFormato do número: (555499991111)');
            return;
        }

        const confirmed = window.confirm(`Confirma o pedido?\n\n${getOrderResume(cart)}`)
        // setshowingIcon(faCheckCircle);
        if (confirmed) {

            const response = await OrderServiceInstance.newOrder(cart);
            if (typeof response === `object` && typeof response._id === `string`) {
                if (!cart.paymentMethod.isOnlinePayment) {

                    window.alert(`Pedido criado com sucesso!\nVocê será notificado sobre o status do pedido via WhatsApp.`);
                    CartServiceInstance.updateStoredCart(CartServiceInstance.newCart());
                    const newCart = CartServiceInstance.getStoredCart();
                    if (newCart) {
                        setCart(newCart);
                    }
                    await waitSeconds(.1);
                    window.location.href = '/?action=orders';

                } else {

                    // window.alert(`Pedido a com sucesso!\nVocê será notificado sobre o status do pedido via WhatsApp.`);

                    setOnlinePaymentData(response);

                    CartServiceInstance.updateStoredCart(CartServiceInstance.newCart());
                    const newCart = CartServiceInstance.getStoredCart();
                    if (newCart) {
                        setCart(newCart);
                    }

                }
                // {
                //     "_id": "686b392c85cc1ba0fde2d337",
                //         "paymentId": "1338750353",
                //             "payment_url": "https://www.mercadopago.com.br/sandbox/payments/1338750353/ticket?caller_id=1675987182&hash=dab277a0-153a-4dcb-b32e-c800e2e05ad2",
                //                 "qr_code": "00020126580014br.gov.bcb.pix0136b76aa9c2-2ec4-4110-954e-ebfe34f05b61520400005303986540544.005802BR5915SAksxkCCakCVCOM6009Sao Paulo62230519mpqrinter13387503536304927C",
                //                     "qr_code_base64": "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"
                // }
            }
        }

    }

    const [qrCodeBase64DataURL, setQrCodeBase64DataURL] = useState<string | undefined>(undefined);
    const [onlinePaymentData, setOnlinePaymentData] = useState<{
        _id: string,
        paymentId: string,
        payment_url: string,
        qr_code: string,
        qr_code_base64: string
    } | null>
        (null);
    // ({
    //     "_id": "686b392c85cc1ba0fde2d337",
    //     "paymentId": "1338750353",
    //     "payment_url": "https://www.mercadopago.com.br/sandbox/payments/1338750353/ticket?caller_id=1675987182&hash=dab277a0-153a-4dcb-b32e-c800e2e05ad2",
    //     "qr_code": "00020126580014br.gov.bcb.pix0136b76aa9c2-2ec4-4110-954e-ebfe34f05b61520400005303986540544.005802BR5915SAksxkCCakCVCOM6009Sao Paulo62230519mpqrinter13387503536304927C",
    //     "qr_code_base64": "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"
    // });

    const [_idsInSync, set_IdsInSync] = useState<string | null>()

    useEffect(() => {

        async function getStoredPhone() {
            const phone = AccessCodeServiceInstance.getStoredPhone();
            if (phone) {
                const customerFormattedNumber = `+${phone.substring(0, 2)} ${phone.substring(2, 4)} ${phone.substring(4, 8)}-${phone.substring(8, 12)}`;
                setCart({ ...cart, chatId: phone + "@c.us", customerFormattedNumber });
            }
        }
        getStoredPhone();

    }, []);

    useEffect(() => {

        console.log('onlinePaymentData: ', onlinePaymentData);

        if (onlinePaymentData) {

            stringToQRBase64(onlinePaymentData.qr_code)

            if (_idsInSync !== onlinePaymentData._id)
                syncNewOrderWithOnlinePayment(onlinePaymentData._id);

        }

    }, [onlinePaymentData, _idsInSync]);

    async function stringToQRBase64(qr: string) {
        let QRbase64 = await new Promise<string>((resolve, reject) => {
            QRCode.toDataURL(qr, function (err, code) {
                if (err) {
                    reject();
                    // setQRCodeBase64(undefined);
                    setQrCodeBase64DataURL('')
                    return;
                }
                // setQRCodeBase64(code);
                setQrCodeBase64DataURL(code)
                resolve(code);
            });
        });
        console.log(QRbase64);
        return QRbase64;
    }

    function waitSeconds(seconds: number) {
        return new Promise<void>((resolve, reject) => {
            setTimeout(() => {
                resolve();
            }, seconds * 1000);
        })
    }

    async function syncNewOrderWithOnlinePayment(_id: string) {

        set_IdsInSync(_id);

        if (cart.paymentStatus === 'pending') {

            const orderRecord = await OrderServiceInstance.getOrderBy_Id(_id);


            if (orderRecord.paymentStatus === `pending`) {

                await waitSeconds(60);
                syncNewOrderWithOnlinePayment(_id);

            } else {

                if (orderRecord.paymentStatus === `approved`) {
                    window.alert(`Pagamento confirmado! Seu pedido foi enviado para produção.`);

                }
                if (orderRecord.paymentStatus === `expired`) {
                    window.alert(`Pagamento expirou! Seu pedido foi cancelado.`);
                }

                setOnlinePaymentData(null);
                set_IdsInSync(null);
                CartServiceInstance.updateStoredCart(CartServiceInstance.newCart());
                const newCart = CartServiceInstance.getStoredCart();
                if (newCart) {
                    setCart(newCart);
                }

            }

        }

    }

    function showPaymentRequestQRCode(newOrderResponse: {
        _id: string,
        paymentId: string,
        payment_url: string,
        qr_code: string,
        qr_code_base64: string
    }) {

        const date_of_expirationFormatted = new Date(cart.pixRequest.date_of_expiration).toLocaleString('pt-BR');

        return (
            <div className='cartModal'>
                <div className="cartModalScroll">
                    <div className="cartContainer" style={{ width: '100vw', height: 'auto', padding: '1em', paddingBottom: '2em', marginTop: '1em', marginBottom: '1em' }}>
                        <span>Seu pedido será enviado para produção após o pagamento.</span>
                        <br />
                        <span>Caso o pagamento não seja realizado dentro do prazo abaixo o pedido será cancelado automaticamente.</span>
                        <br />
                        <span>Prazo para realizar o pagamento: </span>
                        <p style={{ fontSize: '1.125em' }}>30 minutos <br />({date_of_expirationFormatted.substring(0, date_of_expirationFormatted.length - 3).replace(`,`, ``)})</p>
                        <img src={qrCodeBase64DataURL} alt="Pix QRCode" style={{
                            maxWidth: '50vw',
                            alignSelf: 'center',
                            justifySelf: 'center',
                            marginTop: '1em'
                        }} />
                        <p onClick={async e => {
                            await navigator.clipboard.writeText(newOrderResponse.qr_code)
                                .then(async () => window.alert(`Pix QRCode copiado!\n\n${newOrderResponse.qr_code}`));
                        }} style={{ fontSize: '1.125em', padding: '.5em' }}>{newOrderResponse.qr_code}</p>
                        <button className='goBackButton'
                            style={{ fontSize: '1.125em', width: '50%', alignSelf: 'center' }}
                            onClick={async e => {
                                await navigator.clipboard.writeText(newOrderResponse.qr_code)
                                    .then(() => window.alert('Pix QRCode copiado!'));
                            }}>
                            <FontAwesomeIcon icon={faCopy} />
                            {' Clique aqui para copiar o Pix QR Code'}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (onlinePaymentData?._id) {
        return showPaymentRequestQRCode(onlinePaymentData);
    }

    return (
        <div className='cartModal'>
            <div className="cartModalScroll">
                <button className='goBackButton' style={{ borderWidth: `medium`, fontWeight: 'bold', fontSize: '1.125em', justifySelf: `flex-start`, alignSelf: `flex-start`, marginLeft: `1em`, marginBottom: '1em', marginTop: '1em' }}
                    onClick={e => { setShowCartPage(false); setSelectedItem(null); setCartSelectedItemIdx(-1) }}>
                    <FontAwesomeIcon icon={faArrowCircleLeft} /> {` Adicionar mais produtos`}
                </button>
                <div className='row' style={{ paddingBottom: `1em`, alignItems: `center`, justifyContent: `center`, zIndex: '100' }}>
                    <span style={{ fontSize: `1.25em`, background: '#fff', border: 'solid medium #000', borderRadius: '1em', color: '#000', padding: '.5em' }}>
                        <FontAwesomeIcon icon={faCartShopping} /> {` Carrinho`}
                    </span>
                </div>
                <div className="cartContainer" style={{ alignItems: 'center', }}>
                    <span style={{ marginTop: '1em', justifySelf: 'center', width: '90%', background: 'rgba(251, 0, 0, 1)', border: 'solid medium #000', borderRadius: '1em', color: '#fff', padding: '.5em' }}>
                        SOMENTE RETIRADA DE PEDIDOS, NÃO ESTAMOS REALIZANDO TELE-ENTREGA
                    </span>
                    {cart.items.length === 0 ?
                        <p style={{ textDecoration: `none`, color: `#fff`, padding: `1em`, alignSelf: `center`, justifySelf: `center` }}>Nenhum item no carrinho</p>
                        :
                        <div >
                            <div className="column">
                                <div className="row" style={{ width: `100%`, justifyContent: `center`, border: 'solid thin #000', borderTop: `none` }}>
                                    <p style={{ color: `#000`, textDecoration: 'none', background: '#fff', padding: '.25em', border: 'solid medium #000', borderRadius: '1em' }}>Total: R$ {cart.paymentAmount.toFixed(2).replace('.', ',')}</p>
                                </div>
                                {cart.items.map((orderItem, orderItemIdx) => {

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
                                            onClick={e => { setShowCartPage(false); setCartSelectedItemIdx(orderItemIdx); setSelectedItem(orderItem) }}
                                        >
                                            {/* <div className="row"
                                        style={{
                                            justifySelf: `flex-end`,
                                        }}
                                    > */}
                                            <div style={{ background: '#fff', border: 'solid medium #000', borderRadius: '1em', maxWidth: '90%', padding: '.125em', color: '#000', textDecoration: 'none', paddingBottom: `1.25em` }}>
                                                <div id='copyIcon' style={{
                                                    position: `absolute`,
                                                    color: (`#000`),
                                                    float: 'right',
                                                    justifySelf: 'flex-start',
                                                    transform: `scale(2)`,
                                                    // marginLeft: `50%`,  
                                                    width: 'auto',
                                                    height: 'auto',
                                                    margin: `1em`,
                                                    marginLeft: `1em`,
                                                    zIndex: `100`
                                                }}
                                                >
                                                    <FontAwesomeIcon
                                                        icon={faPencil}
                                                    />
                                                </div>
                                                <div id='deleteIcon' style={{
                                                    // position: `absolute`,
                                                    // color: (`rgba(251, 0, 0, 0.84)`),
                                                    color: (`rgba(200, 2, 2, 0.96)`),
                                                    // float: 'right',
                                                    justifySelf: 'flex-end',
                                                    transform: `scale(2) `,
                                                    // marginLeft: `50%`,
                                                    margin: `1em`,
                                                    marginBottom: `.5em`,
                                                    width: 'auto',
                                                    height: 'auto',
                                                    zIndex: `100`
                                                }}
                                                    onClick={async e => {
                                                        e.stopPropagation();
                                                        cart.items.splice(orderItemIdx, 1);
                                                        setCart({ ...cart })
                                                        // await handleDeleteItemCode(item);
                                                    }}
                                                >
                                                    <FontAwesomeIcon
                                                        icon={faTrash}
                                                    />
                                                </div>
                                                {/* </div> */}
                                                <p style={{ textDecoration: 'none', fontSize: `1em`, padding: '.25em', color: `#000` }}>
                                                    <span style={{ color: `#000` }}>
                                                        {getItemResume(orderItem, orderItemIdx + 1)}
                                                    </span>
                                                    {/* ({orderItem.qty}x) {orderItem.name} {orderItem.obs.length > 0 ? `| OBS: ${orderItem.obs}` : ''}{Array.isArray(orderItem?.additionalProducts) && orderItem?.additionalProducts?.length > 0 ?
                                                        ` | Adicionais: ${orderItem?.additionalProducts?.map((additionalProduct, additionalProductIdx) => {
                                                            return `(${additionalProduct.qty}x) ${additionalProduct.name} = R$${(additionalProduct.qty * additionalProduct.price).toFixed(2)}`;
                                                        }).join(`, `)}`
                                                        :
                                                        ''} | Valor: R$ {orderItem.price.toFixed(2).replace('.', ',')} (Uni) | Subtotal: R$ {((orderItem.qty * orderItem.price) + additionalProductsTotal).toFixed(2).replace('.', ',')} */}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="column" style={{ border: 'solid thin #000', paddingTop: '2em', paddingBottom: '2em' }}>
                                <div className="column" style={{ background: '#fff', border: 'solid medium #000', borderRadius: '1em', maxWidth: '90%', padding: '.125em', paddingBottom: `1em`, color: '#000', textDecoration: 'none' }}>
                                    <p style={{ background: '#fff', border: 'solid medium #000', borderRadius: '1em', maxWidth: '90%', padding: '.125em', color: '#000', textDecoration: 'none' }}>Método de pagamento: {cart.paymentMethod.name}</p>
                                    {paymentMethods.map((paymentMethod, paymentMethodIdx) => {
                                        return (
                                            <div className="row">
                                                <label
                                                    htmlFor={'paymentMethodCheckbox' + paymentMethodIdx}
                                                    style={{ color: '#000' }}
                                                >
                                                    {paymentMethod.name}
                                                </label>
                                                <input type="checkbox"
                                                    id={'paymentMethodCheckbox' + paymentMethodIdx}
                                                    name="paymentMethodCheckbox"
                                                    checked={paymentMethod.id === cart.paymentMethod.id}
                                                    value={paymentMethod.id}
                                                    placeholder={paymentMethod.name}
                                                    style={{ color: '#fff', transform: `scale(2)` }}
                                                    onChange={e => {
                                                        const selectedPaymentMethod = paymentMethods.find(item => item.id === e.target.value);
                                                        if (selectedPaymentMethod) {
                                                            cart.paymentMethod = selectedPaymentMethod;
                                                            if (!selectedPaymentMethod.isOnlinePayment) {
                                                                setCart({
                                                                    ...cart,
                                                                    pixRequest: {
                                                                        ...cart.pixRequest,
                                                                        payment_method_id: selectedPaymentMethod.id,
                                                                        payer: {
                                                                            ...cart.pixRequest.payer,
                                                                            identification: {
                                                                                type: 'PHONE',
                                                                                number: cart.chatId.split('@')[0]
                                                                            }
                                                                        }
                                                                    }
                                                                });
                                                                return;
                                                            }
                                                        }
                                                        setCart({ ...cart });
                                                    }}
                                                />
                                            </div>
                                        )

                                    })}
                                </div>
                            </div>
                            {cart.paymentMethod.isOnlinePayment ?
                                <div className="column" style={{ alignItems: 'center', justifyContent: 'center', border: 'solid thin #000', paddingTop: '1em', paddingBottom: '1em' }}>
                                    <div className="column" style={{ alignItems: 'center', justifyContent: 'center', background: '#fff', maxWidth: '80%', border: 'solid medium #000', borderRadius: '1em', padding: '.25em', paddingBottom: '.75em' }}>
                                        <label
                                            htmlFor="cpfCnpj"
                                            style={{ color: '#000' }}
                                        >Digite seu CPF ou CNPJ</label>

                                        <input type="text" id="cpfCnpj" name="cpfCnpj" placeholder="Digite seu CPF ou CNPJ"
                                            value={cart.pixRequest.payer.identification.number}
                                            style={{
                                                maxWidth: '90%',
                                                margin: '.25em',
                                                marginLeft: '.5em',
                                                marginRight: '.5em',
                                            }}
                                            onChange={e => {
                                                if (typeof cart === 'object') {
                                                    const value = e.target.value.replaceAll('.', '').replaceAll(',', '').replaceAll(' ', '');
                                                    if (!isNaN(Number(value))) {
                                                        const isCnpj = value.length > 11;
                                                        setCart({
                                                            ...cart,
                                                            pixRequest: {
                                                                ...cart.pixRequest,
                                                                payer: {
                                                                    ...cart.pixRequest.payer,
                                                                    identification: {
                                                                        type: isCnpj ? 'CNPJ' : 'CPF',
                                                                        number: value
                                                                    }
                                                                }
                                                            }
                                                        });
                                                    }
                                                }
                                            }}
                                        />
                                    </div>
                                </div>
                                :
                                <></>
                            }
                            {cart.paymentMethod.isOnlinePayment ?
                                <div className="column" style={{ alignItems: 'center', justifyContent: 'center', border: 'solid thin #000', paddingTop: '1em', paddingBottom: '1em' }}>
                                    <div className="column" style={{ alignItems: 'center', justifyContent: 'center', background: '#fff', maxWidth: '80%', border: 'solid medium #000', borderRadius: '1em', padding: '.25em', paddingBottom: '.75em' }}>
                                        <label
                                            htmlFor="email"
                                            style={{ color: '#000' }}
                                        >Digite seu e-mail</label>

                                        <input type="email" id="email" name="email" placeholder="exemplo@gmail.com"
                                            value={cart.pixRequest.payer.email}
                                            style={{
                                                maxWidth: '90%',
                                                margin: '.25em',
                                                marginLeft: '.5em',
                                                marginRight: '.5em',
                                            }}
                                            onChange={e => {
                                                if (typeof cart === 'object') {
                                                    const value = e.target.value;
                                                    // if (!isNaN(Number(value))) {
                                                    // const isCnpj = value.length > 11;
                                                    setCart({
                                                        ...cart,
                                                        pixRequest: {
                                                            ...cart.pixRequest,
                                                            payer: {
                                                                ...cart.pixRequest.payer,
                                                                email: value
                                                            }
                                                        }
                                                    });
                                                }
                                            }}
                                        />
                                    </div>
                                </div>
                                :
                                <></>
                            }
                            <div className="column" style={{ alignItems: 'center', justifyContent: 'center', border: 'solid thin #000', borderBottomRightRadius: '1em', borderBottomLeftRadius: '1em', paddingTop: '1em', paddingBottom: '1em' }}>
                                <div className="column" style={{ alignItems: 'center', justifyContent: 'center', background: '#fff', maxWidth: '80%', border: 'solid medium #000', borderRadius: '1em', padding: '.25em', paddingBottom: '.75em' }}>
                                    <label
                                        htmlFor="phone"
                                        style={{ color: '#000' }}
                                    >Digite seu WhatsApp <FontAwesomeIcon icon={faWhatsapp} color="green" style={{ transform: `scale(1.5)`, marginLeft: '.25em' }} /></label>
                                    <input id="phone" name="phone" type="tel" pattern="[0-9]{12}" placeholder='555499999999'
                                        value={cart?.chatId.split('@c.us')[0]}
                                        style={{
                                            maxWidth: '90%',
                                            margin: '.25em',
                                            marginLeft: '.5em',
                                            marginRight: '.5em',
                                        }}
                                        onChange={e => {
                                            if (typeof cart === 'object') {
                                                const value = e.target.value.replaceAll(' ', '').replace('+', '').replace('-', '') || '';
                                                if (!isNaN(Number(value))) {
                                                    // +55 54 9695-3402
                                                    const customerFormattedNumber = `+${value.substring(0, 2)} ${value.substring(2, 4)} ${value.substring(4, 8)}-${value.substring(8, 12)}`;
                                                    setCart({ ...cart, chatId: value + '@c.us', customerFormattedNumber });
                                                    if (!cart.paymentMethod.isOnlinePayment) {
                                                        setCart({
                                                            ...cart,
                                                            chatId: value + '@c.us', customerFormattedNumber,
                                                            pixRequest: {
                                                                ...cart.pixRequest,
                                                                payer: {
                                                                    ...cart.pixRequest.payer,
                                                                    identification: {
                                                                        type: 'PHONE',
                                                                        number: value
                                                                    }
                                                                }
                                                            }
                                                        });
                                                    }
                                                }
                                            }
                                        }}

                                    />
                                </div>
                            </div>
                        </div>
                    }
                </div>
                <div className="fixedAddToCartContainer"
                    onClick={e => handleOrderSubmit()}
                >
                    <p><FontAwesomeIcon icon={faArrowRight} /> Enviar pedido</p>
                </div>
            </div>
        </div >
    )
}