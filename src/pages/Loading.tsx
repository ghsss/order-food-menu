export default function LoadingPage() {
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
                <div className="cartContainer" style={{ background: `#fff`, margin: '1em', alignContent: `center`, alignItems: `center`, flexWrap: `wrap`, width: '15em', height: 'auto', padding: '1em', paddingBottom: '2em', marginTop: '1em', marginBottom: '1em' }}>
                    <img className="rotateAnimation" src="./logo192.png" alt="" />
                    <p style={{ fontWeight: `bold`, textDecoration: `none`, color: '#000' }}>{'Baixando cardápio ...'}</p>
                    {/* <p style={{ fontWeight: `bold`, textDecoration: `none`, color: '#000' }}></p> */}
                </div>
            </div>
        </div>
    )
}