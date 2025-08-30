/* eslint-disable react-hooks/exhaustive-deps */
import React, { JSX, useEffect, useState } from 'react';
import './styles/ProductMenu.css';
import ProductMenuList from './components/ProductMenuList';
import ProductModel from '../../models/Product';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { faArrowCircleLeft, faCartPlus, faCartShopping, faCheck, faCheckCircle, faClock, faCopy, faFilter, faGlobe, faHeadphones, faList, faMap, faMapLocation, faMapLocationDot, faMinusCircle, faPencil, faPlusCircle, faSearch, faX, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import ProductServiceInstance from '../../services/ProductService';
import ProductTypeModel from '../../models/ProductType';
import ProductTypeServiceInstance from '../../services/ProductTypeService';
import RobotServiceInstance from '../../services/RobotService';
import RobotModel from '../../models/Robot';
import CompanyModel from '../../models/Company';
import CompanyServiceInstance from '../../services/CompanyService';
import OrderModel, { OrderItemModel } from '../../models/Order';
import CartServiceInstance from '../../services/CartService';
import AdditionalProductServiceInstance from '../../services/AdditionalProductService';
import AdditionalProductModel from '../../models/AdditionalProduct';
import CartPage from './components/Cart';
import MyOrdersPage from './components/MyOrders';
import AccessCodeServiceInstance from '../../services/AccessCodeService';
// import CustomerAccessCodePage from '../Admin/CustomerAccessCode/CustomerAccessCode';
import LoadingPage from '../Loading';
import Login from './components/Login/Login';
import AcceptTermsPage from '../AcceptTerms';

const whatsAppQueryParams = encodeURIComponent('Olá! Gostaria de fazer um pedido.');

interface ProductMenuProps {
  isAdmin: boolean;
  action: string;
  prefilledOrderChannel?: string;
}

function ProductMenu({ isAdmin, action, prefilledOrderChannel }: ProductMenuProps) {

  const [companyNameAnimatedDisplay, setCompanyNameAnimatedDisplay] = useState<string>('');
  const [logoClass, setLogoClass] = useState<string>('');
  const [acceptedTerms, setAcceptedTerms] = useState<boolean | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [accessCodeIsSet, setAccessCodeIsSet] = useState<boolean>(false);
  const [showOrdersPage, setShowOrdersPage] = useState<boolean>(false);
  const [showCartPage, setShowCartPage] = useState<boolean>(false);
  const [cart, setCart] = useState<OrderModel>();
  const [selectedItem, setSelectedItem] = useState<OrderItemModel | null>(null);
  const [additionalProductMenuOptions, setAdditionalProductMenuOptions] = useState<AdditionalProductModel[]>();
  const [cartSelectedItemIdx, setCartSelectedItemIdx] = useState<number>(-1);

  const [customerPhone, setCustomerPhone] = useState<string | null>(null);

  const [orderChannel, setOrderChannel] = useState<string>(prefilledOrderChannel || 'WhatsApp');

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [productTypeSearchTerm, setProductTypeSearchTerm] = useState<string>('');
  const [filteredProductMenuOptions, setFilteredProductMenuOptions] = useState<ProductModel[]>([]);
  // const [productMenuOptions, setProductMenuOptions] = useState<ProductModel[]>([{
  //   id: 'C1',
  //   name: 'Cachorro Quente Grande 🌭😋',
  //   price: 22.50,
  //   image_url: `./hotdog2.jpg`,
  //   description: 'Pão grande, molho de tomate, milho, ervilha, 2 salsicha, maionese, ketchup, mostarda e batata palha.',
  //   productType: {
  //     id: 'CACHORRO QUENTE',
  //     name: 'Cachorro Quente',
  //   }
  // }, {
  //   id: 'C2',
  //   name: 'Cachorro Quente Pequeno 🌭😋',
  //   price: 18.50,
  //   image_url: `./hotdog2.jpg`,
  //   description: 'Pão pequeno, molho de tomate, milho, ervilha, 1 salsicha, maionese, ketchup, mostarda e batata palha.',
  //   productType: {
  //     id: 'CACHORRO QUENTE',
  //     name: 'Cachorro Quente',
  //   },
  // }, {
  //   id: 'H1',
  //   name: 'Hamburguer Salada 🍔😋',
  //   price: 20.00,
  //   image_url: `./hamburguer.jpg`,
  //   description: 'Pão de hamburguer, maionese, ketchup, mostarda, bife pequeno, queijo, alface e tomate.',
  //   productType: {
  //     id: 'HAMBURGUER',
  //     name: 'Hamburguer',
  //   },
  // }, {
  //   id: 'X1',
  //   name: 'Xis Salada 🍔😋',
  //   price: 24.00,
  //   // image_url: `./hamburguer.jpg`,
  //   description: 'Pão de xis, maionese, ketchup, mostarda, bife grande, queijo, alface e tomate.',
  //   productType: {
  //     id: 'XIS',
  //     name: 'Xis',
  //   },
  // }]);
  const [company, setCompany] = useState<CompanyModel | undefined>();
  const [companyInfoDropdownOpen, setCompanyInfoDropdownOpen] = useState<boolean>(false);
  const [robot, setRobot] = useState<RobotModel | undefined>();
  const [productMenuOptions, setProductMenuOptions] = useState<ProductModel[]>([]);
  const [productTypeSelectOptions, setProductTypeSelectOptions] = useState<ProductTypeModel[]>([]);

  const [processingOrderSubmit, setProcessingOrderSubmit] = useState<boolean>(false);

  useEffect(() => {

    console.log('processingOrderSubmit: ' + processingOrderSubmit);

  }, [processingOrderSubmit]);

  useEffect(() => {

    const getProducts = async () => {

      setLoading(true);

      const getProductTypesResponse = await ProductTypeServiceInstance.getProductTypes();
      getProductTypesResponse.sort((a: ProductTypeModel, b: ProductTypeModel) => {
        // s1.toLowerCase().localeCompare(s2.toLowerCase()));
        return b.name.toLowerCase().localeCompare(a.name.toLowerCase());
      });
      console.log('getProductTypesResponse: ', getProductTypesResponse);
      setProductTypeSelectOptions(getProductTypesResponse);

      const getProductsResponse = await ProductServiceInstance.getProducts();
      getProductsResponse.sort((a: ProductTypeModel, b: ProductTypeModel) => {
        // s1.toLowerCase().localeCompare(s2.toLowerCase()));
        return b.name.toLowerCase().localeCompare(a.name.toLowerCase());
      });
      console.log('getProductsResponse: ', getProductsResponse);
      setProductMenuOptions(getProductsResponse);

      const robotRef = await RobotServiceInstance.getRobot();

      if (robotRef && robotRef.phone) {
        setRobot(robotRef);
      }

      const companyRef = await CompanyServiceInstance.getCompany();

      setCompany(companyRef);

      const storedCartRef = CartServiceInstance.getStoredCart();

      setCart(storedCartRef);

      console.log(`storedCartRef: ${JSON.stringify(storedCartRef)}`);

      const getAdditionalProductsResponse = await AdditionalProductServiceInstance.getAdditionalProducts();
      getAdditionalProductsResponse.sort((a: ProductModel, b: ProductModel) => {
        // s1.toLowerCase().localeCompare(s2.toLowerCase()));
        return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
      });
      console.log('getAdditionalProductsResponse: ', getAdditionalProductsResponse);
      setAdditionalProductMenuOptions(getAdditionalProductsResponse);

      await waitSeconds(1.45)

      setLoading(false);

      syncAccessToken()

    }

    getProducts();

    document.querySelector('#orderChannelsDiv')?.scrollIntoView();

  }, []);

  useEffect(() => {

    if (!loading) {

      showCompanyNameAnimatedDisplay();

    }

  }, [loading]);

  useEffect(() => {

    if (acceptedTerms !== null) {
      if (acceptedTerms === false && company) {
        // showCompanyNameAnimatedDisplay();
        // showAcceptTermsModal();
        const msgTxt = `Você será redirecionado para o WhatsApp da empresa para realizar seu pedido.`;
        alert(msgTxt);
        const wppTxt = `Olá, gostaria de fazer um pedido.`;
        window.location.href = `https://wa.me/${company.phoneNumber}?text=${wppTxt}`;
      } else {
        AccessCodeServiceInstance.storeAcceptTerms(acceptedTerms);
      }
    }

  }, [acceptedTerms]);

  function waitSeconds(seconds: number) {
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, seconds * 1000);
    })
  }

  async function syncAccessToken() {


    const isSet = typeof AccessCodeServiceInstance.getStoredAccessCode() !== 'undefined';
    setAcceptedTerms(AccessCodeServiceInstance.getStoredAcceptedTerms());

    setAccessCodeIsSet(isSet);

    await waitSeconds(3);

    if (!accessCodeIsSet) {
      syncAccessToken();
    }

  }

  useEffect(() => {

    console.log('company: ', company);
    console.log('robot: ', robot);
    console.log('selectedItem: ', selectedItem);
    console.log('cartSelectedItemIdx: ', cartSelectedItemIdx);

  }, [company, robot, selectedItem, cartSelectedItemIdx]);

  useEffect(() => {

    console.log('showCartPage: ', showCartPage);

  }, [showCartPage]);

  useEffect(() => {

    console.log('companyNameAnimatedDisplay: ', companyNameAnimatedDisplay);

  }, [companyNameAnimatedDisplay]);

  useEffect(() => {

    console.log('prefilledOrderChannel: ', orderChannel);
    if (prefilledOrderChannel && orderChannel !== prefilledOrderChannel) {
      setOrderChannel(prefilledOrderChannel);
    }

  }, [prefilledOrderChannel]);

  useEffect(() => {

    console.log('orderChannel: ', orderChannel);

  }, [orderChannel]);

  useEffect(() => {

    console.log('cart: ', cart);
    if (typeof cart === 'object' && JSON.stringify(cart) !== JSON.stringify(CartServiceInstance.getStoredCart())) {
      CartServiceInstance.updateStoredCart(cart);
    }

  }, [cart]);

  useEffect(() => {

    console.log('showOrdersPage: ', showOrdersPage);
    console.log('showCartPage: ', showCartPage);
    if (showCartPage) {
      setShowOrdersPage(false);
    } else {
      if (showOrdersPage) {
        setShowCartPage(false);
      }
    }

  }, [showCartPage, showOrdersPage]);

  useEffect(() => {

    console.log('productMenuOptions: ', productMenuOptions);
    console.log('filteredProductMenuOptions: ', filteredProductMenuOptions);

  }, [productMenuOptions, filteredProductMenuOptions]);

  useEffect(() => {

    console.log('action: ', action);
    if (action === 'orders') {
      setShowOrdersPage(true);
      setShowCartPage(false);
      setOrderChannel(`WebSite`);
    } else if (action === 'cart') {
      setShowCartPage(true);
      setShowOrdersPage(false);
      setOrderChannel(`WebSite`);
    }
  }, [action]);

  useEffect(() => {

    console.log('logoClass: ', logoClass);

  }, [logoClass]);

  useEffect(() => {

    console.log('searchTerm: ', searchTerm);
    applyFilters();

  }, [searchTerm]);

  useEffect(() => {

    console.log('productTypeSearchTerm: ', productTypeSearchTerm);
    applyFilters();

  }, [productTypeSearchTerm]);

  const getRobotIsConnected: () => boolean = () => {
    return robot?.state === 'CONNECTED';
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {

    const searchTermRefreshed = e.target.value;

    if (searchTermRefreshed !== searchTerm) {

      setSearchTerm(searchTermRefreshed);
      applyFilters();

    }

  }

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {

    const productTypeSearchTermRefreshed = e.target.value;

    if (productTypeSearchTermRefreshed !== productTypeSearchTerm) {

      setProductTypeSearchTerm(productTypeSearchTermRefreshed);

    }

  }

  function applyFilters() {

    let filteredList = [];

    if (productTypeSearchTerm !== `all`) {

      filteredList = productMenuOptions.filter(item => item.productType.id.toLowerCase().includes(productTypeSearchTerm.toLowerCase()));

      console.log('refreshed filteredList by current selected product type (' + productTypeSearchTerm + '): ', filteredList);

    } else {

      filteredList = productMenuOptions;

    }

    if (searchTerm.length > 0) {

      filteredList = filteredList.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));

      console.log('refreshed filteredList by current searchTerm (' + searchTerm + '): ', filteredList);

      setFilteredProductMenuOptions(filteredList);

    } else {

      setFilteredProductMenuOptions(filteredList);

    }

  }

  //   if (!companyIsOpenToday) {
  //     await this.replyToMessage(msg, `O estabelecimento está fechado hoje.

  // Horários de funcionamento: 
  // ${company.workingDays.map(workingDay => {
  //       return `
  // ${workingDay.dayLabel}:
  // ${workingDay.startHour} até ${workingDay.endHour}.
  // `
  //     }).join('')}`);
  //     return;
  //   }

  function companyIsOpenNow(): boolean {

    const now = new Date();

    if (company) {

      const [timezoneHour, timezoneMinute] = company.timezone.replace('UTC', '').split(':', 2);

      const timezoneIsNegative = timezoneHour.indexOf('-') === 0;

      console.log('timezoneHour', timezoneHour);
      console.log('timezoneMinute', timezoneMinute);
      console.log('timezoneIsNegative', timezoneIsNegative);

      const offsetToUTCInMinutes = new Date().getTimezoneOffset();

      const timeToAddInMs = (((parseInt(timezoneHour) * 60) + (timezoneIsNegative ? parseInt(`-` + timezoneMinute) : parseInt(timezoneMinute))) + offsetToUTCInMinutes) * 60 * 1000;

      // now.setTime(now.getTime() + (offsetToUTCInMinutes === 0 ? -timeToAddInMs : timeToAddInMs));
      now.setTime(now.getTime() + timeToAddInMs);

      const dayOfWeek = now.getDay();

      const verifyHours = (startTime: string, endTime: string) => {

        // const [startHour, startMinute] = startTime.split(':', 2);
        // const [endHour, endMinute] = endTime.split(':', 2);

        const startString = `${now.getFullYear()}-${now.getMonth() + 1 < 10 ? `0${now.getMonth() + 1}` : now.getMonth() + 1}-${now.getDate() < 10 ? `0${now.getDate()}` : now.getDate()}T${startTime}:00`;
        const startTimeDate = new Date(startString);

        console.log('timeToAddInMs', timeToAddInMs);

        console.log('startTimeDate', startTimeDate.toLocaleString(`pt-BR`));

        const endString = `${now.getFullYear()}-${now.getMonth() + 1 < 10 ? `0${now.getMonth() + 1}` : now.getMonth() + 1}-${now.getDate() < 10 ? `0${now.getDate()}` : now.getDate()}T${endTime}:00`;
        const endTimeDate = new Date(endString);

        console.log('now', now.toLocaleString(`pt-BR`));

        console.log('endTimeDate', endTimeDate.toLocaleString(`pt-BR`));

        if (now.getTime() >= startTimeDate.getTime() && now.getTime() <= endTimeDate.getTime()) {
          return true;
        }
        return false;

      }

      const companyIsOpenToday = company.workingDays.some(workingDay => workingDay.day === dayOfWeek);
      const companyIsOpenNow = company.workingDays.some(workingDay => workingDay.day === dayOfWeek &&
        (workingDay.alwaysOpen === true || verifyHours(workingDay.startHour, workingDay.endHour) === true));
      return companyIsOpenNow;
    }
    return false;
  }

  function handleItemClick(item: ProductModel, setshowingIcon: React.Dispatch<React.SetStateAction<IconDefinition>>) {

    // Copy the text inside the text field
    try {

      if (orderChannel === 'WhatsApp' && robot && robot.phone) {

        navigator.clipboard.writeText(item.id);
        setshowingIcon(faCheckCircle);
        setTimeout(() => {
          window.location.href = `https://wa.me/${robot.phone}?text=${item.id}`;
        }, 100);
        setTimeout(() => {
          setshowingIcon(faCopy);
        }, 1000);

      } else {

        if (orderChannel === 'WebSite' && robot && robot.phone) {

          setshowingIcon(faCheckCircle);
          setTimeout(() => {
            setSelectedItem({ ...item, qty: 1, obs: '.', additionalProducts: [] });
            setCartSelectedItemIdx(-1);
          }, 100);
          setTimeout(() => {
            setshowingIcon(faCartPlus);
          }, 1000);

        }

      }

    } catch (error) {

      setshowingIcon(faX);

    }

  }

  function handleCartItemChange(item: OrderItemModel, cartSelectedItemIdx: number) {

    try {

      if (item.qty < 1) {

        window.alert('Quantidade do produto precisa ser maior que 0 para adicionar no carrinho.');
        return;

      }

      if (orderChannel === 'WebSite' && robot && robot.phone) {

        if (cartSelectedItemIdx === -1) {
          cart?.items.push(item);
        } else {
          cart?.items.splice(cartSelectedItemIdx, 1, item);
        }

        if (cart) {
          setCart(JSON.parse(JSON.stringify(cart)));
        }

        if (isAdmin) {

          // window.location.href = '/?orderChannel=WebSite'
          setSelectedItem(null);

        } else {

          goToCartPage();

        }

      }

      //   }

    } catch (error) {

      // setshowingIcon(faX);

    }

  }

  function showSelectedProductDetails(): JSX.Element {
    if (selectedItem) {

      const selectedItemProduct = productMenuOptions.find(item => item.id === selectedItem.id);

      if (selectedItemProduct) {


        return (
          <div className='cartModal'>
            <div className="cartModalScroll">

              <button className='goBackButton' style={{ fontSize: '1.25em', justifySelf: `flex-start`, alignSelf: `flex-start`, marginLeft: `1em`, marginBottom: '1em', marginTop: '1em' }}
                onClick={e => { setSelectedItem(null); window.location.href = '/?orderChannel=WebSite#orderChannelsDiv' }}>
                <FontAwesomeIcon icon={faArrowCircleLeft} /> {` Voltar`}
              </button>
              {cartSelectedItemIdx === -1 ?
                <></>
                :
                <div className='row' style={{ paddingBottom: `1em`, alignItems: `center`, justifyContent: `center`, zIndex: '100' }}>
                  <span style={{ fontSize: `1.25em`, background: '#fff', border: 'solid medium #000', borderRadius: '1em', color: '#000', padding: '.5em' }}>
                    {`🔥 Item ${cartSelectedItemIdx + 1}`}
                  </span>
                </div>}
              <div className="column" style={{ alignItems: 'center', justifyContent: 'center', marginBottom: '0' }}>
                <div className="CartProductMenuListItemContainer glowBox"
                // onClick={event => handleCartItemChange(selectedItem)}
                >
                  <div id='cartIcon' style={{ color: `#000`, marginLeft: `.75em`, marginTop: `2.5em` }} >
                    <FontAwesomeIcon
                      icon={faCartShopping}
                    />
                  </div>
                  <br /><br />
                  <p id='cartItemName' className='cartItemName scalingAnimation'
                    style={{ marginTop: '2em' }}>
                    <span>⭐ </span>
                    {selectedItem.name}
                  </p>
                  <div className='cartItemImageContainer'>
                    {typeof selectedItemProduct.image_url !== 'undefined' ? 'Imagem ilustrativa' : 'Sem imagem'}
                    <img draggable={false} className='cartItemImage' src={selectedItemProduct.image_url || './no-image.png'} about={typeof selectedItemProduct.image_url !== 'undefined' ? 'Imagem ilustrativa' : 'Sem imagem'} title={typeof selectedItemProduct.image_url !== 'undefined' ? 'Imagem ilustrativa' : 'Sem imagem'} alt={typeof selectedItemProduct.image_url !== 'undefined' ? 'Imagem ilustrativa' : 'Sem imagem'} />
                  </div>
                  <div className='row'>
                    <div className='column'>
                      <div>
                        <p id='itemPrice' className=''>
                          {/* <span>Promoção por tempo limitado!</span>
                        <br/> */}
                          {` R$ ` + selectedItem.price.toFixed(2).replace('.', ',')}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className='row' style={{ width: `100%`, transform: 'scale(0.95)' }}>
                    <div>
                      <p id='itemDescription' className='itemDescription'>
                        <span>Descrição: </span>
                        {selectedItemProduct.description}
                      </p>
                    </div>
                  </div>
                  <div className='row' style={{ width: `100%`, padding: '1em' }}>
                    <div>
                      <span>Observação (Ex: "sem milho e ervilha"): </span>
                      <textarea id='itemDescription' className='itemDescription' value={selectedItem.obs}
                        onChange={e => { setSelectedItem({ ...selectedItem, obs: e.target.value }) }} />
                      {/* {selectedItem.obs} */}
                    </div>
                  </div>
                  {
                    additionalProductMenuOptions && additionalProductMenuOptions?.length > 0
                      && additionalProductMenuOptions.some(additionalProductMenuOption => additionalProductMenuOption.availableProductType.some(availableProductType => availableProductType.id === selectedItemProduct.productType.id)) ?
                      <>
                        <div className='row' style={{ maxWidth: `100%`, width: `100%`, paddingTop: '.5em', paddingBottom: '1em', alignItems: `center`, justifyContent: 'center', alignContent: 'center', border: 'solid thin #fff' }}>
                          <div className='column'
                            style={{
                              maxWidth: '80%', alignItems: 'center', justifyContent: 'center'
                            }}
                          >
                            <span>Adicionais: </span>
                            {additionalProductMenuOptions?.map(additionalProductMenuOption => {

                              const replaceEmojis = (str: string) => {
                                return str.replace(
                                  /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g,
                                  ''
                                )
                              }

                              if (Array.isArray(selectedItem.additionalProducts) && additionalProductMenuOption.availableProductType.some(availableProductType => availableProductType.id === selectedItemProduct.productType.id)) {
                                const selectedAdditionalProductIdx = selectedItem.additionalProducts?.findIndex(selectedAdditionalProduct => replaceEmojis(selectedAdditionalProduct.id) === replaceEmojis(additionalProductMenuOption.id));
                                const selectedAdditionalProductQty = selectedItem.additionalProducts?.find(selectedAdditionalProduct => replaceEmojis(selectedAdditionalProduct.id) === replaceEmojis(additionalProductMenuOption.id))?.qty || 0;
                                return (
                                  <div className='row' style={{ alignItems: 'center', justifyContent: 'center', width: `100%`, marginTop: '1em', border: 'solid thin #fff', background: 'rgba(93, 0, 0, 0.248)', borderRadius: '.5em' }}>
                                    <div className='column'
                                      style={{
                                        margin: '.25em'
                                      }}
                                    >
                                      <span>{additionalProductMenuOption.name} (R$ {parseFloat(additionalProductMenuOption.price.toFixed(2)).toFixed(2).replace('.', ',')}/Uni): {selectedAdditionalProductQty}</span>
                                      <div className="row"
                                        style={
                                          { alignItems: 'center', justifyContent: 'center' }
                                        }
                                      >
                                        <FontAwesomeIcon
                                          className='backface'
                                          icon={faMinusCircle} color='red' fontSize={`1.5em`}
                                          style={{ background: '#fff', zIndex: `101`, marginRight: '.1em', border: `solid thin #fff`, borderRadius: `50%` }}
                                          onClick={e => {
                                            e.stopPropagation();
                                            e.preventDefault();
                                            if (selectedAdditionalProductQty > 0 && Array.isArray(selectedItem.additionalProducts)) {
                                              // if ( selectedAdditionalProductIdx === -1 ) {
                                              //   selectedItem.additionalProducts?.push({...additionalProductMenuOption, qty: selectedAdditionalProductQty });
                                              // }
                                              selectedItem.additionalProducts[selectedAdditionalProductIdx].qty = selectedAdditionalProductQty - 1;
                                              // setSelectedItem({ ...selectedItem, qty: selectedAdditionalProductQty - 1 })

                                              if (selectedItem.additionalProducts[selectedAdditionalProductIdx].qty === 0) {
                                                selectedItem.additionalProducts.splice(selectedAdditionalProductIdx, 1);
                                              }

                                              setSelectedItem(JSON.parse(JSON.stringify(selectedItem)));

                                            }
                                          }}
                                        />
                                        <input type="number" step={1} id='itemDescription' className='itemDescription' value={selectedAdditionalProductQty}
                                          onChange={e => {
                                            // e.stopPropagation();
                                            // e.preventDefault();
                                            console.log(`Qty input change.`)
                                            if (selectedAdditionalProductQty > 0 && Array.isArray(selectedItem.additionalProducts)) {

                                              // selectedAdditionalProductQty
                                              if (selectedAdditionalProductIdx === -1) {

                                                selectedItem.additionalProducts.push({ ...additionalProductMenuOption, qty: Number(e.target.value) });

                                              } else {

                                                selectedItem.additionalProducts[selectedAdditionalProductIdx].qty = Number(e.target.value);

                                                if (selectedItem.additionalProducts[selectedAdditionalProductIdx].qty === 0) {
                                                  selectedItem.additionalProducts.splice(selectedAdditionalProductIdx, 1);
                                                }

                                              }

                                              setSelectedItem(JSON.parse(JSON.stringify(selectedItem)));

                                              // setSelectedItem({ ...selectedItem, qty: Number(e.target.value) })
                                            }
                                          }
                                          } />
                                        {/* {selectedItem.obs} */}
                                        <FontAwesomeIcon
                                          className='backface'
                                          icon={faPlusCircle} color='green' fontSize={`1.5em`}
                                          style={{ background: '#fff', zIndex: `101`, marginLeft: '.1em', border: `solid thin #fff`, borderRadius: `50%` }}
                                          onClick={e => {
                                            e.stopPropagation();
                                            e.preventDefault();
                                            console.log(`Qty increase click.`)
                                            if (Array.isArray(selectedItem.additionalProducts)) {

                                              if (selectedAdditionalProductIdx === -1) {

                                                selectedItem.additionalProducts.push({ ...additionalProductMenuOption, qty: selectedAdditionalProductQty + 1 });

                                              } else {

                                                selectedItem.additionalProducts[selectedAdditionalProductIdx].qty = selectedAdditionalProductQty + 1;

                                              }

                                              setSelectedItem(JSON.parse(JSON.stringify(selectedItem)));

                                            }
                                          }
                                          } />
                                      </div>
                                    </div>
                                  </div>
                                );
                              } else {
                                return (<></>);
                              }
                            })}
                          </div>
                        </div>
                      </>
                      :
                      <></>
                  }
                  <div className='row' style={{
                    width: `100%`, justifyContent: 'center', paddingTop: '1em', paddingBottom: '1em'
                    , background: `rgba(93, 0, 0, 0.248)`
                  }}>
                    <div>
                      <span>Quantidade: {selectedItem.qty}</span>
                      <div className="row"
                        style={{
                          alignItems: 'center', justifyContent: 'center',
                          margin: '.5em'
                        }}
                      >
                        <FontAwesomeIcon
                          className='backface'
                          icon={faMinusCircle} color='red' fontSize={`2.5em`}
                          style={{ background: '#fff', zIndex: `101`, marginRight: '.1em', border: `solid thin #fff`, borderRadius: `50%` }}
                          onClick={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            if (selectedItem.qty > 1) {
                              setSelectedItem({ ...selectedItem, qty: selectedItem.qty -= 1 })
                            }
                          }}
                        />
                        <input type="number" step={1} id='itemDescription' className='itemDescription' value={selectedItem.qty}
                          onChange={e => {
                            // e.stopPropagation();
                            // e.preventDefault();
                            console.log(`Qty decrease click.`)
                            if (selectedItem.qty > 0) {
                              setSelectedItem({ ...selectedItem, qty: Number(e.target.value) })
                            }
                          }} />
                        {/* {selectedItem.obs} */}
                        <FontAwesomeIcon
                          className='backface'
                          icon={faPlusCircle} color='green' fontSize={`2.5em`}
                          style={{ background: '#fff', zIndex: `101`, marginLeft: '.1em', border: `solid thin #fff`, borderRadius: `50%` }}
                          onClick={e => {
                            // e.stopPropagation();
                            // e.preventDefault();
                            console.log(`Qty increase click.`)
                            setSelectedItem({
                              ...selectedItem, qty: selectedItem.qty += 1

                            })
                          }} />
                      </div>
                    </div>
                  </div>
                </div>
                <div className='row' style={{ width: '100%', height: 'auto', marginTop: '7em', }}></div>
              </div>
              <div className="fixedAddToCartContainer"
                onClick={e => handleCartItemChange(selectedItem, cartSelectedItemIdx)}
              >
                <p><FontAwesomeIcon icon={faCartPlus} /> {cartSelectedItemIdx === -1 ? `Adicionar no carrinho` : `Salvar item`}</p>
              </div>

            </div>
          </div>
        )
      }
    }
    return (<></>)
  }

  function goToCartPage() {
    // setShowCartPage(true);
    window.location.href = '/?action=cart'
  }

  function goToMyOrdersPage() {
    // setShowOrdersPage(true);
    window.location.href = '/?action=orders'
  }

  async function showCompanyNameAnimatedDisplay() {
    console.log('showCompanyNameAnimatedDisplay');
    if (typeof company === 'object') {
      let companyName = '';
      for await (const letter of company.name) {
        await waitSeconds(.075);
        companyName += letter;
        setCompanyNameAnimatedDisplay(companyName);
      }
      companyName += ` 🔥`;
      await waitSeconds(.5);
      setCompanyNameAnimatedDisplay(companyName);
      companyName = `🔥 ` + companyName;
      await waitSeconds(.5);
      setCompanyNameAnimatedDisplay(companyName);
      if (companyIsOpenNow()) {
        await waitSeconds(.125);
        document.querySelector('#orderChannelsDiv')?.scrollIntoView();
        // await waitSeconds(.125);
      }
      if (!isAdmin && !getRobotIsConnected()) {
        const msgTxt = `O site está indisponível temporariamente, você será redirecionado para o WhatsApp da empresa.`;
        alert(msgTxt);
        const wppTxt = `Olá, gostaria de fazer um pedido.`;
        window.location.href = `https://wa.me/${company.phoneNumber}?text=${wppTxt}`;
        // window.location.href = 'https://wa.me/';
      }
    }
  }

  // function showAcceptTermsModal()

  if (loading) {

    return (<LoadingPage action={action} />)

  }

  if (acceptedTerms === null) {

    return (<AcceptTermsPage setAcceptedTerms={setAcceptedTerms} />)

  }

  if ((selectedItem === null && !showCartPage && !showOrdersPage) ||
    (!showOrdersPage && !companyIsOpenNow())) {

    return (
      <div className="ProductMenuContainer">
        <div style={{ width: '100%', display: 'flex', marginTop: '1em', marginBottom: '2em' }} className='titles'>
          <a style={{ justifySelf: 'flex-end', alignSelf: 'flex-end', marginRight: '1em', marginTop: '1em' }} href='/admin?action=menu'>
            {`Sou um administrador `}
            <FontAwesomeIcon icon={faHeadphones} />
          </a>
        </div>
        <div className='row'
          style={{
            transform: `scale(.95)`,
            width: '95%'
          }}
        >
          {/* <h1 id='instruction1' style={{ color: '#000' }} className='scalingAnimation linkUnavailable'>Clique em um item do cardápio para copiar o código do produto! ❤️‍🔥😍
        </h1> */}
          {/* <h1 style={{ color: '#000' }} className='scalingAnimation linkUnavailable'>
          <span style={{ color: 'green' }}>Redirecionamento automático <FontAwesomeIcon fontSize={`1.25em`} color='green' icon={faWhatsapp} /></span>
        </h1> */}
          <div className='column glowBox' style={{
            justifyContent: 'center',
            alignItems: 'center',
            background: 'rgb(255, 246, 148)',
            width: '100%',
            border: 'solid thin #000',
            borderRadius: '1em',
            overflow: 'hidden',
            marginBottom: `1em`,
            padding: '.25em',
            transformStyle: `preserve-3d`,
          }}>
            <div className='column' style={{
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgb(231, 77, 0)',
              width: '100%',
              border: 'solid thin #000',
              borderRadius: '1em',
              overflow: 'hidden',
              transformStyle: `preserve-3d`,
            }}>
              <span
                className='scalingAnimation'
                style={
                  {
                    fontSize: `1.5em`,
                    marginTop: '.5em',
                    padding: `.25em`,
                    fontFamily: 'fantasy',
                    color: '#fff',
                    textDecoration: `underline rgba(93, 0, 0, 0.248)`,
                    WebkitTextStroke: `.025em #000`,
                    WebkitTextStrokeColor: `#000`,
                    WebkitTextStrokeWidth: `.05em`,
                    textShadow: '.1em .1em .5em #000'
                  }
                }
              >{companyNameAnimatedDisplay}</span>
              <a href='/#'
                className='glow'
                style={{
                  display: 'flex',
                  background: 'rgba(93, 0, 0, 0.248)',
                  marginTop: '.5em',
                  width: '80%',
                  alignItems: `center`,
                  justifyContent: 'center',
                }}
              >⭐⭐⭐⭐⭐</a>
              <div style={{
                display: `flex`,
                alignItems: `center`,
                justifyContent: 'center',
                flexDirection: `column`,
                margin: '1em',
                marginTop: '.5em',
                width: `75%`,
                padding: `1em`,
                border: `solid thin #000`,
                borderRadius: '1em',
                background: 'rgba(93, 0, 0, 0.248)',
                // borderTopLeftRadius: '1em',
                // borderTopRightRadius: '1em',
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
                    }}
                    onClick={async e => {
                      setLogoClass('logoClass');
                      await waitSeconds(1);
                      setLogoClass('');
                    }}>
                    <img
                      className={logoClass.length > 0 ? logoClass : ''}
                      // className={'logoClass'}                    
                      src="./logo1.jpg" alt=""
                      style={{
                        position: `relative`,
                        // margin: '1em',
                        // maxWidth: '70%',
                        width: '75%',
                        height: '11em',
                        border: 'solid medium gold',
                        borderRadius: '50%',
                        padding: `.125em`,
                        background: `#fff`,
                        // borderRadius: '2em',
                        animationDuration: '2s',
                        // transform: `translateZ(2.5em)`,
                        transformStyle: `preserve-3d`,
                        // backfaceVisibility: 'hidden',
                        zIndex: `100`
                      }}
                    />
                  </div>
                </div>
                <div className='row'
                  style={{ justifyContent: 'center' }}
                >
                  <h1 style={{ marginTop: '1.5em', marginBottom: '.5em', fontSize: '1em', width: 'fit-content', padding: '.5em' }} className={companyIsOpenNow() === true ? 'scalingAnimation glowBox ' : ''}>
                    <span style={{ color: '#000' }} className={companyIsOpenNow() === true ? 'scalingAnimation ' : ''} >
                      {companyIsOpenNow() === true ? 'ABERTO' : 'FECHADO'} <FontAwesomeIcon fontSize={`1.25em`} color={companyIsOpenNow() === true ? 'green' : 'red'} icon={companyIsOpenNow() === true ? faCheckCircle : faX} />
                    </span>
                  </h1>
                </div>
                <div className='row'
                  style={{ justifyContent: 'center' }}
                >
                  <h1 style={{ marginBottom: '.5em', fontSize: '1em', width: 'fit-content', padding: '.5em' }} className={company?.haveDelivery === true ? 'scalingAnimation ' : ''}>
                    <span style={{ color: '#000' }} className={company?.haveDelivery === true ? 'scalingAnimation ' : ''} >
                      {company?.haveDelivery === true ? 'TELE-ENTREGA ' : 'TELE-ENTREGA '} <FontAwesomeIcon fontSize={`1.25em`} color={company?.haveDelivery === true ? 'green' : 'red'} icon={company?.haveDelivery === true ? faCheckCircle : faX} />
                      <br />
                      <span style={{ color: '#000' }} className={company?.haveDelivery === true ? 'scalingAnimation ' : ''} >
                        {company?.haveDelivery === true ?
                          `${company?.deliveryCost === 0 ? `GRÁTIS` : `R$ ${company?.deliveryCost?.toFixed(2).replace(`.`, `,`)}`}`
                          :
                          ``}
                      </span>
                    </span>
                  </h1>
                </div>
              </div>
              {company ?
                <div
                  className='row'
                  style={{
                    justifyContent: `center`,
                    width: '100%',
                    borderTop: 'solid thin #000'
                  }}
                >
                  <a style={{
                    margin: '1em',
                    textDecoration: 'none', color: '#000'
                  }}
                    target='_blank'
                    rel='noreferrer'
                    href={`https://www.google.com/maps/search/"${company.street}, ${company.addressNumber}, bairro ${company.neighborhood}, ${company.city}-${company.state}/${company.country}"`.replaceAll(' ', '+')}
                  // onClick={e => {
                  //   window.location.href = ;
                  // }}
                  >
                    <span style={{ color: '#000' }}>
                      <FontAwesomeIcon icon={faMapLocationDot}
                        fontSize={'1.5em'}
                      />
                      {`  Localização: ${company.street}, ${company.addressNumber}, bairro ${company.neighborhood}, ${company.city}-${company.state}/${company.country}`}
                    </span>
                  </a>
                </div>
                :
                <></>
              }
            </div>
          </div>
        </div>
        <div style={{ fontSize: '.75em', maxWidth: '60%', marginBottom: '1em', }} className='column'>
          <h1 style={{ color: '#000', cursor: `pointer` }} onClick={e => {
            setCompanyInfoDropdownOpen(!companyInfoDropdownOpen);
          }}>
            <div className='column'>
              <span style={{ color: '#000', padding: '.25em' }}><FontAwesomeIcon fontSize={`1.25em`} color='rgb(231, 77, 0)' icon={companyInfoDropdownOpen === true ? faMinusCircle : faPlusCircle} /> Horários de atendimento</span>
              <p style={{
                fontSize: '1em', color: '#000', background: '#fff', overflowY: 'hidden', height: companyInfoDropdownOpen ? 'auto' : '0', display: companyInfoDropdownOpen ? 'flex' : 'none',
                flexWrap: 'wrap',
                justifyContent: 'center',
                alignItems: 'center',
                textDecoration: 'none'
              }}>
                {company?.workingDays.map((workingDay, workingDayIdx) => {
                  return <>
                    {
                      workingDayIdx !== 0 ?
                        <>
                          <br key={`workingDayIdx${workingDayIdx}br`} />
                          <br key={`workingDayIdx${workingDayIdx}br2`} />
                        </>
                        :
                        <></>
                    }
                    <span key={`workingDayIdx${workingDayIdx}`} style={{ fontSize: '.75em', display: 'block', padding: '.5em', margin: '.5em', color: '#000', border: 'solid thin #000', borderRadius: '1em' }}>
                      <span style={{ color: 'rgb(231, 77, 0)' }}>
                        {<FontAwesomeIcon color='#000' icon={faClock} />} {workingDay.dayLabel}
                      </span>
                      <br />
                      {workingDay.alwaysOpen ? `Aberto 24h` : `${workingDay.startHour} até ${workingDay.endHour}.`}
                    </span>
                  </>
                })}
              </p>

            </div>
          </h1>
        </div >
        <div id='orderChannelsDiv' className='row linksRow' style={{ zIndex: '100' }}>
          <button
            style={{ fontWeight: `bold`, zIndex: '101', cursor: 'pointer', background: orderChannel === `WebSite` ? '#fff' : 'grey' }}
            // href={"/#"} 
            className={!companyIsOpenNow() ? 'linkUnavailable' : orderChannel === `WebSite` ? 'glowBox' : ''}
            onClick={e => {
              console.log(`clicked`);
              setOrderChannel('WebSite');
            }}
          >
            {'Pedir pelo site '}
            <FontAwesomeIcon fontSize={`2.5em`} color='blue' icon={faGlobe} />
          </button>
          <button
            style={{ fontWeight: `bold`, zIndex: '101', cursor: 'pointer', background: orderChannel === `WhatsApp` ? '#fff' : 'grey' }}
            onClick={e => { setOrderChannel('WhatsApp') }}
            className={!companyIsOpenNow() ? 'linkUnavailable' : robot?.phone ? orderChannel === `WhatsApp` ? 'goToWhatsAppLink glowBox' : 'goToWhatsAppLink' : 'linkUnavailable'} rel='noreferrer'
          >
            {'Pedir pelo WhatsApp '}
            <FontAwesomeIcon fontSize={`2.5em`} color='green' icon={faWhatsapp} />
          </button>
        </div>
        <div className='row linksRow' style={{ zIndex: '100' }}>
          <button
            style={{
              fontWeight: `bold`, zIndex: '101', cursor: 'pointer',
              // background: orderChannel === `WhatsApp` ? '#fff' : 'grey'
              background: '#fff'
            }}
            onClick={e => { goToMyOrdersPage() }}
            className={``} rel='noreferrer'
          >
            {'Meus pedidos '}
            <FontAwesomeIcon fontSize={`1.75em`} color='#000' icon={faList} />
          </button>

        </div>
        {
          robot ?
            <ProductMenuList orderChannel={orderChannel} handleItemClick={handleItemClick} companyIsOpenNow={companyIsOpenNow()} robot={robot} productMenuItems={filteredProductMenuOptions.length > 0 || searchTerm.length > 0 ? filteredProductMenuOptions : productMenuOptions}
            >
              <div className='filterInputsContainer'>
                <label htmlFor="searchTermInput"><FontAwesomeIcon icon={faSearch} /></label>
                <input id='searchTermInput' className='searchTermInput' type="text" value={searchTerm} placeholder='Pesquisar produto/sabor' onChange={e => handleSearch(e)} />
                <div className='filterByProductTypeContainer'>
                  <label style={{ color: `#000` }} htmlFor="filterByProductType">{`Filtrar por tipo `}
                    <FontAwesomeIcon icon={faFilter} />
                  </label>
                  <select className='filterByProductType' name="filterByProductType" id="filterByProductType"
                    onChange={e => handleSelect(e)}
                  >
                    <option value="all" defaultChecked={true} >Todos</option>
                    {productTypeSelectOptions.map(productTypeSelectOption => {
                      return (
                        <option key={productTypeSelectOption.id} value={productTypeSelectOption.id}>{productTypeSelectOption.name}</option>
                      );
                    })}
                  </select>
                </div>
              </div>
            </ProductMenuList>
            :
            <></>
        }
        {
          orderChannel === 'WebSite' ?
            <div className="fixedAddToCartContainer"
              onClick={e => goToCartPage()}
            >
              <p>({cart?.items.length || 0}) <FontAwesomeIcon icon={faCartPlus} /> Carrinho</p>
            </div>
            :
            <></>
        }
      </div >
    );
  } else if ((showCartPage === true) && typeof cart === 'object' && companyIsOpenNow() === true) {

    if (!accessCodeIsSet && robot) {
      // return <CustomerAccessCodePage showCartPage={showCartPage} showOrdersPage={showOrdersPage} setShowCartPage={setShowCartPage} setShowOrdersPage={setShowOrdersPage} />;
      return <Login robot={robot} showCartPage={showCartPage} showOrdersPage={showOrdersPage} setShowCartPage={setShowCartPage} setShowOrdersPage={setShowOrdersPage} />;
    }

    return (
      <CartPage cart={cart} setCart={setCart} setShowCartPage={setShowCartPage}
        processingOrderSubmit={processingOrderSubmit}
        setProcessingOrderSubmit={setProcessingOrderSubmit}
        setSelectedItem={setSelectedItem}
        setCartSelectedItemIdx={setCartSelectedItemIdx}
      />
    );
  } else if ((showOrdersPage === true) && typeof cart === 'object') {

    if (!accessCodeIsSet && robot) {
      // return <CustomerAccessCodePage showCartPage={showCartPage} showOrdersPage={showOrdersPage} setShowCartPage={setShowCartPage} setShowOrdersPage={setShowOrdersPage} />;
      return <Login robot={robot} showCartPage={showCartPage} showOrdersPage={showOrdersPage} setShowCartPage={setShowCartPage} setShowOrdersPage={setShowOrdersPage} />;
    }

    return (
      <MyOrdersPage
        // orders={orders} setOrders={setOrders}
        isAdmin={isAdmin}
        setShowOrdersPage={setShowOrdersPage}
        setSelectedItem={setSelectedItem}
        setCartSelectedItemIdx={setCartSelectedItemIdx}
      />
    );

  } else {
    return showSelectedProductDetails();
  }
}

export default ProductMenu;
