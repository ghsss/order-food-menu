interface AcceptTermsPageProps {
    setAcceptedTerms: (accept: boolean) => void;
}

export default function AcceptTermsPage({ setAcceptedTerms }: AcceptTermsPageProps) {
    return (
        <div className='cartModal'>
            <div className="cartModalScroll" style={{ display: 'flex', alignItems: `center`, justifyContent: 'center' }}>
                {/* <button className='goBackButton' style={{ borderWidth: `medium`, fontWeight: 'bold', fontSize: '1.125em', justifySelf: `flex-start`, alignSelf: `flex-start`, marginLeft: `1em`, marginBottom: '1em', marginTop: '1em' }}
                    onClick={e => { setShowOrdersPage(false); setSelectedItem(null); setCartSelectedItemIdx(-1) }}>
                    <FontAwesomeIcon icon={faArrowCircleLeft} /> {` Voltar`}
                </button>
                <div className='row' style={{ paddingBottom: `1em`, alignItems: `center`, justifyContent: `center`, zIndex: '100' }}>
                    <span style={{ fontSize: `1.25em`, background: '#fff', border: 'solid medium #000', borderRadius: '1em', color: '#000', padding: '.5em' }}>
                        <FontAwesomeIcon icon={faList} /> {` Meus Pedidos`}
                    </span>
                </div> */}
                <div className="cartContainer scaleAnimation" style={{
                    background: `#fff`,
                    margin: '1em',
                    alignContent: `center`,
                    alignItems: `center`,
                    flexWrap: `wrap`,
                    minWidth: '30vw',
                    width: '15em',
                    maxWidth: '75vw',
                    height: 'auto', 
                    padding: '1em', 
                    paddingBottom: '2em', 
                    marginTop: '0', 
                    marginBottom: '1em',
                    justifyContent: 'center',
                    backgroundColor: 'rgb(231, 77, 0)',
                    // width: '100%',
                    border: 'solid thin #000',
                    borderRadius: '1em',
                    overflow: 'hidden',

                }}>
                    {/* <div className="spinAnimationY" style={{ borderRadius: `50%` }}>
                        <div className="glowBox" style={{ borderRadius: `50%` }}>
                            <img className="spinAnimationY backface" src="./logo192.jpg" alt=""
                                style={{
                                    border: 'solid medium gold',
                                    borderRadius: '50%',
                                    transformStyle: `preserve-3d`,
                                    // backfaceVisibility: 'hidden',
                                    zIndex: `100`
                                }}
                            />
                        </div>
                    </div> */}
                    <div style={{
                        justifyContent: 'center',
                        padding: `1em`,
                    }}>
                        <div style={{
                            width: 'fit-content',
                            // justifyContent: 'center',
                            // maxWidth: '70%',
                            // overflow: 'hidden',
                            borderRadius: '50%',
                            // background: '#000'
                            transform: `translateZ(1em)`,
                            transformStyle: `preserve-3d`,
                            background: 'rgba(93, 0, 0, 0.248)'
                        }}>
                            <div
                                className='glowBox'
                                style={{
                                    width: 'fit-content',
                                    justifyContent: 'center',
                                    overflow: 'hidden',
                                    // maxWidth: '70%',
                                    paddingTop: `.25em`,
                                    border: 'solid medium gold',
                                    borderRadius: '50%',
                                }}>
                                <img
                                    className="spinAnimationY"
                                    src="./logo1.jpg" alt=""
                                    style={{
                                        // margin: '1em',
                                        // maxWidth: '70%',
                                        width: '70%',
                                        height: '10em',
                                        border: 'solid medium gold',
                                        borderRadius: '50%',
                                        padding: `.125em`,
                                        background: `#fff`,
                                        transformStyle: `preserve-3d`,
                                        zIndex: `100`
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                    {/* <a href="/#" style={{ fontWeight: `bold`, textDecoration: `none`, color: '#000' }}>
                        {action === 'order-bot'? 'Baixando cardápio ...' : action === 'cart'? 'Baixando dados do carrinho ...' : action === 'orders'? 'Baixando pedidos ...' : 'Baixando cardápio ...' }
                    </a> */}
                    <p style={{ fontSize: `1.25em`, color: '#fff', textDecoration: `none` }}>Termos de uso</p>
                    <p style={{ fontSize: `1em`, maxHeight: '25vh', color: '#000', textDecoration: `none`, overflowY: `scroll` }}>É necessário informar seu número de WhatsApp para realizar pedidos, para pedidos com opção de pagamento online é obrigatório informar seu CPF/CNPJ e e-mail que serão utilizado apenas pelo MercadoPago para processar seu pagamento. Não compartilhamos dados de nossos clientes com terceiros, seus dados são utilizados exclusivamente para processar o pagamento do seu pedido através do MercadoPago e para entrarmos em contato para informar mudanças no status do pedido.</p>
                    <div className="row" style={{ width: '80%', justifyContent: 'space-around' }}>
                        <button className="goBackButton" style={{ fontWeight: `bold`, textDecoration: `none`, color: '#fff', background: 'red' }}
                            onClick={(e) => { setAcceptedTerms(false) }}
                        >
                            Declinar
                            {/* {action === 'order-bot'? 'Baixando cardápio ...' : action === 'cart'? 'Baixando dados do carrinho ...' : action === 'orders'? 'Baixando pedidos ...' : 'Baixando cardápio ...' } */}
                        </button>
                        <button className="goBackButton" style={{ fontWeight: `bold`, textDecoration: `none`, color: '#fff', background: 'green' }}
                            onClick={(e) => { setAcceptedTerms(true) }}
                        >
                            Aceitar
                            {/* {action === 'order-bot'? 'Baixando cardápio ...' : action === 'cart'? 'Baixando dados do carrinho ...' : action === 'orders'? 'Baixando pedidos ...' : 'Baixando cardápio ...' } */}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}