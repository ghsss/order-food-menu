/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import './styles/AdminProductMenu.css';
import AdminProductMenuList from './components/AdminProductMenuList';
// import AdminProducTypetMenuList from './components/AdminProducTypetMenuList';
import ProductModel from '../../models/Product';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { faCheckCircle, faFilter, faGlobe, faPerson, faPlus, faPlusSquare, faSearch, faX } from '@fortawesome/free-solid-svg-icons';
import ProductServiceInstance from '../../services/ProductService';
import ProductTypeModel from '../../models/ProductType';
import ProductTypeServiceInstance from '../../services/ProductTypeService';
import AdminProductTypeMenuList from './components/AdminProductTypeMenuList';
import ProductTypePage from './ProductType/ProductType';
import ProductPage from './Product/Product';
import UserModel from '../../models/User';
import UserPage from './User/User';
import AccessCodeServiceInstance from '../../services/AccessCodeService';
import AdminUserMenuList from './components/AdminUserMenuList';
import CompanyPage from './Company/Company';
import OrderServiceInstance from '../../services/OrderService';
import OrderModel from '../../models/Order';
import AdminOrderMenuList from './components/AdminOrderMenuList';
import * as QRCode from 'qrcode';
import RobotModel from '../../models/Robot';
import RobotServiceInstance from '../../services/RobotService';
import AdminAdditionalProductMenuList from './components/AdminAdditionalProductMenuList';
import AdditionalProductModel from '../../models/AdditionalProduct';
import AdditionalProductPage from './AdditionalProduct/AdditionalProduct';
import AdditionalProductServiceInstance from '../../services/AdditionalProductService';
// import AccessCodeServiceInstance from '../../services/AccessCodeService';

const whatsAppQueryParams = encodeURIComponent('Olá! Preciso de suporte para o robô/aplicativo de pedidos.');

interface AdminMenuProps {
  isSuperAdmin: boolean,
  accessCodeSHA512Hash: string,
  action: string,
  collection?: string,
  filter?: string,
  id?: string
}

function AdminMenu({ isSuperAdmin, action, collection, filter, id }: AdminMenuProps) {

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [productTypeSearchTerm, setProductTypeSearchTerm] = useState<string>('');
  const [orderStatusSearchTerm, setOrderStatusSearchTerm] = useState<string>('all');
  const [userMenuOptions, setUserMenuOptions] = useState<UserModel[]>([]);
  const [filteredUserMenuOptions, setFilteredUserMenuOptions] = useState<UserModel[]>([]);

  const [productMenuOptions, setProductMenuOptions] = useState<ProductModel[]>([]);
  const [filteredProductMenuOptions, setFilteredProductMenuOptions] = useState<ProductModel[]>([]);

  const [additionalProductMenuOptions, setAdditionalProductMenuOptions] = useState<AdditionalProductModel[]>([]);
  const [filteredAdditionalProductMenuOptions, setFilteredAdditionalProductMenuOptions] = useState<AdditionalProductModel[]>([]);

  const [productTypeSelectOptions, setProductTypeSelectOptions] = useState<ProductTypeModel[]>([]);
  const [filteredProductTypeSelectOptions, setFilteredProductTypeSelectOptions] = useState<ProductTypeModel[]>([]);

  type OrderStatusSelect = {
    // selected: boolean
    value: string,
    label: string
  }

  const [orderStatusSelectOptions, setOrderStatusSelectOptions] = useState<OrderStatusSelect[]>([
    { value: 'approved', label: 'Em produção' },
    { value: 'pending', label: 'Pagamento pendente' },
    { value: 'expired', label: 'Pagamento expirou' },
    { value: 'finished', label: 'Pedidos finalizados' },
  ]);

  const [orderSelectOptions, setOrderSelectOptions] = useState<OrderModel[]>([]);
  const [filteredOrderSelectOptions, setFilteredOrderSelectOptions] = useState<OrderModel[]>([]);

  const [robot, setRobot] = useState<RobotModel | undefined>();
  const [QRCodeBase64, setQRCodeBase64] = useState<string | undefined>();

  async function stringToQRCBase64(qr: string) {
    let QRbase64 = await new Promise((resolve, reject) => {
      QRCode.toDataURL(qr, function (err, code) {
        if (err) {
          reject(reject);
          setQRCodeBase64(undefined);
          return;
        }
        setQRCodeBase64(code);
        resolve(code);
      });
    });
    console.log(QRbase64);
  }

  useEffect(() => {

    const getProducts = async () => {

      // const isSuperAdmin = await AccessCodeServiceInstance.isSuperAdmin();
      if (isSuperAdmin) {
        const getAllAdminsResponse = await AccessCodeServiceInstance.getAdmins();
        getAllAdminsResponse.sort((a: UserModel, b: UserModel) => {
          // s1.toLowerCase().localeCompare(s2.toLowerCase()));
          return a.phoneNumber.toLowerCase().localeCompare(b.phoneNumber.toLowerCase());
        });
        console.log('getProductTypesResponse: ', getAllAdminsResponse);
        setUserMenuOptions(getAllAdminsResponse);
      } else {
        if (collection === `user`) {
          window.alert(`Você não é um super-administrador. Para ter acesso ao gerenciamento de usuários é necessário ser um super-administrador.`)
          window.location.href = 'admin?action=menu';
          return;
        }
      }

      const getProductTypesResponse = await ProductTypeServiceInstance.getProductTypes();
      getProductTypesResponse.sort((a: ProductTypeModel, b: ProductTypeModel) => {
        // s1.toLowerCase().localeCompare(s2.toLowerCase()));
        return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
      });
      console.log('getProductTypesResponse: ', getProductTypesResponse);
      setProductTypeSelectOptions(getProductTypesResponse);

      const getProductsResponse = await ProductServiceInstance.getProducts();
      getProductsResponse.sort((a: ProductModel, b: ProductModel) => {
        // s1.toLowerCase().localeCompare(s2.toLowerCase()));
        return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
      });
      console.log('getProductsResponse: ', getProductsResponse);
      setProductMenuOptions(getProductsResponse);

      const getAdditionalProductsResponse = await AdditionalProductServiceInstance.getAdditionalProducts();
      getAdditionalProductsResponse.sort((a: ProductModel, b: ProductModel) => {
        // s1.toLowerCase().localeCompare(s2.toLowerCase()));
        return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
      });
      console.log('getAdditionalProductsResponse: ', getAdditionalProductsResponse);
      setAdditionalProductMenuOptions(getAdditionalProductsResponse);

      syncRobotState();

      syncOrders();

    }

    getProducts()

  }, []);

  async function syncRobotState() {

    const waitSeconds = (seconds: number) => {
      return new Promise<void>((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, seconds * 1000);
      })
    }

    const robotRef = await RobotServiceInstance.getRobot();

    if (robotRef) {
      setRobot(robotRef);
      if (robotRef.qr_code) {
        stringToQRCBase64(robotRef.qr_code);
      }
      await waitSeconds(robotRef?.state !== 'CONNECTED' ? 15 : 60 * 2.5);
      syncRobotState()
    } else {
      await waitSeconds(30);
      syncRobotState()
    }

    return;

  }

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

  async function syncOrders() {
    const getOrdersResponse = filter === 'today' ? await OrderServiceInstance.getTodayOrders() : await OrderServiceInstance.getOrders();
    if (getOrdersResponse) {
      // getOrdersResponse.sort((a: OrderModel, b: OrderModel) => {
      //   if (a.orderNumber && b.orderNumber)
      //     return a.orderNumber - b.orderNumber;
      //   else
      //     return 0;
      // });
      // const statusOrderBy: { [index: string]: number } = { 'approved': 1, 'pending': 2, 'finished': 3, 'expired': 4 };
      // getOrdersResponse.sort((a: OrderModel, b: OrderModel) => {
      //   return statusOrderBy[a.paymentStatus] - statusOrderBy[b.paymentStatus];
      // });
      // getOrdersResponse.sort((a: OrderModel, b: OrderModel) => {
      //   const descStatus = ['finished', 'expired'];
      //   if (descStatus.includes(a.paymentStatus) && descStatus.includes(b.paymentStatus) && a.paymentStatus === b.paymentStatus) {
      //     if (a.orderNumber && b.orderNumber)
      //       return b.orderNumber - a.orderNumber;
      //     else
      //       return 0;
      //   }
      //   return 0;
      // });
      sortOrders(getOrdersResponse);
      console.log('getOrdersResponse: ', getOrdersResponse);
      setOrderSelectOptions(getOrdersResponse);
    }
    const wait30Seconds = () => {
      return new Promise<void>((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, 30000);
      })
    }
    await wait30Seconds();
    syncOrders();
    return;
  }

  useEffect(() => {

    console.log('robot: ', robot);
    console.log('QRCodeBase64: ', QRCodeBase64);

  }, [robot, QRCodeBase64]);

  useEffect(() => {

    console.log('productMenuOptions: ', productMenuOptions);
    console.log('filteredProductMenuOptions: ', filteredProductMenuOptions);

  }, [productMenuOptions, filteredProductMenuOptions]);

  useEffect(() => {

    console.log('searchTerm: ', searchTerm);
    if (collection === `productType`) {
      applyProductTypeFilters();
      return;
    }
    if (collection === `order`) {
      applyOrderFilters();
      return;
    }
    if (collection === `additionalProduct`) {
      applyAdditionalProductsFilters();
    } else {
      applyFilters();
    }

  }, [searchTerm]);

  useEffect(() => {

    console.log('productTypeSearchTerm: ', productTypeSearchTerm);
    if (collection === `additionalProduct`) {
      applyAdditionalProductsFilters();
    } else {
      applyFilters();
    }

  }, [productTypeSearchTerm]);

  useEffect(() => {

    console.log('orderSelectOptions: ', orderSelectOptions);
    console.log('orderStatusSearchTerm: ', orderStatusSearchTerm);
    applyOrderFilters();

  }, [orderSelectOptions, orderStatusSearchTerm]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {

    const searchTermRefreshed = e.target.value;

    if (searchTermRefreshed !== searchTerm) {

      setSearchTerm(searchTermRefreshed);

      if (collection === `additionalProduct`) {

        applyAdditionalProductsFilters();

      } else {

        applyFilters();

      }

    }

  }

  const handleProductTypeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {

    const searchTermRefreshed = e.target.value;

    if (searchTermRefreshed !== searchTerm) {

      setSearchTerm(searchTermRefreshed);
      applyProductTypeFilters();

    }

  }

  const handleOrderSearch = (e: React.ChangeEvent<HTMLInputElement>) => {

    const searchTermRefreshed = e.target.value;

    if (searchTermRefreshed !== searchTerm) {

      setSearchTerm(searchTermRefreshed);
      applyOrderFilters();

    }

  }

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {

    const productTypeSearchTermRefreshed = e.target.value;

    if (productTypeSearchTermRefreshed !== productTypeSearchTerm) {

      setProductTypeSearchTerm(productTypeSearchTermRefreshed);

    }

  }

  const handleAdditionalProductSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {

    const productTypeSearchTermRefreshed = e.target.value;

    if (productTypeSearchTermRefreshed !== productTypeSearchTerm) {

      setProductTypeSearchTerm(productTypeSearchTermRefreshed);

    }

  }

  const handleOrderStatusFilterSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {

    const orderStatusSearchTermRefreshed = e.target.value;

    if (orderStatusSearchTermRefreshed !== orderStatusSearchTerm) {

      setOrderStatusSearchTerm(orderStatusSearchTermRefreshed);

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

  function applyAdditionalProductsFilters() {

    let filteredList = [];

    if (productTypeSearchTerm !== `all`) {

      filteredList = additionalProductMenuOptions.filter(item => item.availableProductType.some(it => it.id.toLowerCase().includes(productTypeSearchTerm.toLowerCase())));

      console.log('refreshed filteredList by current selected product type (' + productTypeSearchTerm + '): ', filteredList);

    } else {

      filteredList = additionalProductMenuOptions;

    }

    if (searchTerm.length > 0) {

      filteredList = filteredList.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));

      console.log('refreshed filteredList by current searchTerm (' + searchTerm + '): ', filteredList);

      setFilteredAdditionalProductMenuOptions(filteredList);

    } else {

      setFilteredAdditionalProductMenuOptions(filteredList);

    }

  }

  function applyProductTypeFilters() {

    let filteredList: React.SetStateAction<ProductTypeModel[]> = [];

    if (searchTerm.length > 0) {

      filteredList = productTypeSelectOptions.filter(item =>
        item.id.toLowerCase().includes(searchTerm.toLowerCase())
        || item.name.toLowerCase().includes(searchTerm.toLowerCase()));

      console.log('refreshed product types filteredList by current searchTerm (' + searchTerm + '): ', filteredList);

      setFilteredProductTypeSelectOptions(filteredList);

    } else {

      setFilteredProductTypeSelectOptions(filteredList);

    }

  }

  function applyOrderFilters() {

    let filteredList: React.SetStateAction<OrderModel[]> = [];

    if (orderStatusSearchTerm !== `all`) {

      const statusAbleToReceivePaymentInLocal = ['approved', 'finished'];

      filteredList = orderSelectOptions.filter(item =>
        item.paymentMethod.isOnlinePayment ?
          item.paymentStatus?.toString().includes(orderStatusSearchTerm.toLowerCase())
          :
          (orderStatusSearchTerm === 'pending' ?
            item.receivedPaymentInLocal === false
            && statusAbleToReceivePaymentInLocal.includes(item.paymentStatus?.toString())
            &&
            item.paymentMethod.isOnlinePayment === false
            :
            item.paymentStatus?.toString().includes(orderStatusSearchTerm.toLowerCase())
          )
      );
      console.log('refreshed filteredList by current selected order status (' + orderStatusSearchTerm + '): ', filteredList);

    } else {

      filteredList = orderSelectOptions;

    }

    if (searchTerm.length > 0) {

      filteredList = orderSelectOptions.filter(item =>
        item.orderNumber?.toString().includes(searchTerm.toLowerCase())
        || item.customerFormattedNumber.includes(searchTerm.toLowerCase())
        || item.chatId.includes(searchTerm.toLowerCase())
      );

      console.log('refreshed orders filteredList by current searchTerm (' + searchTerm + '): ', filteredList);

      setFilteredOrderSelectOptions(filteredList);

    } else {

      setFilteredOrderSelectOptions(filteredList);

    }

  }

  // removeProductTypeItemFromList: (item: ProductTypeModel) => boolean,
  function removeUserFromList(itemToDelete: UserModel): boolean {

    const idxToDelete = userMenuOptions.findIndex(item =>
      item.phoneNumber.toLowerCase().includes(itemToDelete.phoneNumber.toLowerCase())
      || item?._id === itemToDelete?._id
    )

    if (idxToDelete > -1) {

      userMenuOptions.splice(idxToDelete, 1);

      console.log('Removed ' + idxToDelete + ' from user list.');

      setUserMenuOptions(userMenuOptions);
      setFilteredUserMenuOptions(userMenuOptions);

      return true

    }

    return false

  }

  function removeProductTypeItemFromList(itemToDelete: ProductTypeModel): boolean {

    const idxToDelete = productTypeSelectOptions.findIndex(item =>
      item.id.toLowerCase().includes(itemToDelete.id.toLowerCase())
      || item?._id === itemToDelete?._id
    )

    if (idxToDelete > -1) {

      productTypeSelectOptions.splice(idxToDelete, 1);

      console.log('Removed ' + idxToDelete + ' from product type list.');

      setProductTypeSelectOptions(productTypeSelectOptions);
      setFilteredProductTypeSelectOptions(productTypeSelectOptions);

      return true

    }

    return false

  }

  function removeProductItemFromList(itemToDelete: ProductModel): boolean {

    const idxToDelete = productMenuOptions.findIndex(item =>
      item.id.toLowerCase().includes(itemToDelete.id.toLowerCase())
      || item?._id === itemToDelete?._id
    )

    if (idxToDelete > -1) {

      productMenuOptions.splice(idxToDelete, 1);

      console.log('Removed ' + idxToDelete + ' from product type list.');

      setProductMenuOptions(productMenuOptions);
      setFilteredProductMenuOptions(productMenuOptions);

      return true

    }

    return false

  }

  function removeAdditionalProductItemFromList(itemToDelete: AdditionalProductModel): boolean {

    const idxToDelete = additionalProductMenuOptions.findIndex(item =>
      item.id.toLowerCase().includes(itemToDelete.id.toLowerCase())
      || item?._id === itemToDelete?._id
    )

    if (idxToDelete > -1) {

      additionalProductMenuOptions.splice(idxToDelete, 1);

      console.log('Removed ' + idxToDelete + ' from product type list.');

      setAdditionalProductMenuOptions(additionalProductMenuOptions);
      setFilteredAdditionalProductMenuOptions(additionalProductMenuOptions);

      return true

    }

    return false

  }

  function updateOrderFinished(itemToUpdate: OrderModel): boolean {

    if (itemToUpdate._id) {

      const idxToUpdate = orderSelectOptions.findIndex(item =>
        (itemToUpdate._id && item._id?.toLowerCase().includes(itemToUpdate._id.toLowerCase()))
        || item?.orderNumber === itemToUpdate?.orderNumber
      )

      if (idxToUpdate > -1) {

        orderSelectOptions[idxToUpdate].paymentStatus = 'finished';
        orderSelectOptions[idxToUpdate].companyNotified = false;
        orderSelectOptions[idxToUpdate].customerNotified = false;

        console.log('Updated ' + idxToUpdate + ' from order list.');

        sortOrders(orderSelectOptions);

        setOrderSelectOptions(JSON.parse(JSON.stringify(orderSelectOptions)));

        return true

      }

    }

    return false

  }

  function updateOrderPaymentReceived(itemToUpdate: OrderModel): boolean {

    if (itemToUpdate._id) {

      const idxToUpdate = orderSelectOptions.findIndex(item =>
        (itemToUpdate._id && item._id?.toLowerCase().includes(itemToUpdate._id.toLowerCase()))
        || item?.orderNumber === itemToUpdate?.orderNumber
      )

      if (idxToUpdate > -1) {

        orderSelectOptions[idxToUpdate].receivedPaymentInLocal = true;

        console.log('Updated ' + idxToUpdate + ' receivedPaymentInLocal from order list.');

        sortOrders(orderSelectOptions);

        setOrderSelectOptions(JSON.parse(JSON.stringify(orderSelectOptions)));

        // setFilteredProductMenuOptions(productMenuOptions);

        return true

      }

    }

    return false

  }

  const getRobotIsConnected: () => boolean = () => {
    return robot?.state === 'CONNECTED';
  }

  const robotIsConnected = getRobotIsConnected();

  const getRobotHTML = () => {
    return robot?.state === 'UNPAIRED' && QRCodeBase64 ?
      < div className='column modal'>
        <h4 style={{ padding: '1em' }}>É necessário reconectar o WhatsApp Web ao robô. <br />Abra o WhatsApp do número de celular em que o robô deve funcionar e vá até a opção "Dispositivos conectados" para escanear o código QR abaixo<br />Último número conectado: {robot.phone || ''}</h4>
        <img src={QRCodeBase64} alt="WhatsApp Web QRCode" />
      </div>
      :
      <h1 style={{ fontSize: '1em', width: 'fit-content', marginLeft: '.75em', padding: '.5em' }} className={robotIsConnected === true ? 'scalingAnimation glowBox ' : ''}>
        <span style={{ color: '#000' }} className={robotIsConnected === true ? 'scalingAnimation ' : ''} >
          {robotIsConnected === true ? 'ROBÔ ONLINE ' : 'VERIFICAR STATUS DO ROBÔ MANUALMENTE'} <FontAwesomeIcon fontSize={`1.25em`} color={robotIsConnected === true ? 'green' : 'red'} icon={robotIsConnected === true ? faWhatsapp : faWhatsapp} />
          <br />
          {robotIsConnected === true ? robot?.phone : robot?.phone}
        </span>
      </h1>
  }

  const getDefaultMenu = () => {
    console.log(`Default menu.`);
    return (
      <div className="ProductMenuContainer">
        <div className='titles'>
          <h1 style={{ color: '#000' }} className='scalingAnimation linkUnavailable'>
            <span style={{ color: 'green' }}>Painel de administração de produtos</span>
          </h1>
          <h1 style={{ color: '#000' }} className='scalingAnimation linkUnavailable'>Clique no item para editar os produtos do estabelecimento 👇🏻
          </h1>
        </div>
        <div className='row linksRow'>
          <a className='goToWhatsAppLink' rel='noreferrer' target='_blank' href={"https://wa.me/555499026453?text=" + whatsAppQueryParams}>
            {'Falar com o suporte '}
            <FontAwesomeIcon fontSize={`2.5em`} color='green' icon={faWhatsapp} />
          </a>
          <a href={"/#"} className=''>
            {'Ir para visão do cliente '}
            <FontAwesomeIcon fontSize={`2.5em`} color='blue' icon={faPerson} />
          </a>
        </div>
        {getRobotHTML()}
        <AdminProductMenuList isSuperAdmin={isSuperAdmin} removeItemFromList={removeProductItemFromList} productMenuItems={filteredProductMenuOptions.length > 0 || searchTerm.length > 0 ? filteredProductMenuOptions : productMenuOptions}
        >
          <div className='newProductButtonContainer'>
            <a href='/admin?action=create&collection=product' style={{ width: `fit-content`, color: '#000' }}>Novo produto <FontAwesomeIcon color='rgb(231, 77, 0)' fontSize={`1.5em`} icon={faPlusSquare} /></a>
          </div>
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
        </AdminProductMenuList>
      </div >
    );
  }

  const getAdditionalProductsMenu = () => {
    console.log(`Additional products menu.`);
    return (
      <div className="ProductMenuContainer">
        <div className='titles'>
          <h1 style={{ color: '#000' }} className='scalingAnimation linkUnavailable'>
            <span style={{ color: 'green' }}>Painel de administração de adicionais</span>
          </h1>
          <h1 style={{ color: '#000' }} className='scalingAnimation linkUnavailable'>Clique no item para editar os adicionais do estabelecimento 👇🏻
          </h1>
        </div>
        <div className='row linksRow'>
          
        </div>
        {getRobotHTML()}
        <AdminAdditionalProductMenuList isSuperAdmin={isSuperAdmin} removeItemFromList={removeAdditionalProductItemFromList} additionalProductMenuItems={filteredAdditionalProductMenuOptions.length > 0 || searchTerm.length > 0 ? filteredAdditionalProductMenuOptions : additionalProductMenuOptions}
        >
          <div className='newProductButtonContainer'>
            <a href='/admin?action=create&collection=additionalProduct' style={{ width: `fit-content`, color: '#000' }}>Novo adicional <FontAwesomeIcon color='rgb(231, 77, 0)' fontSize={`1.5em`} icon={faPlusSquare} /></a>
          </div>
          <div className='filterInputsContainer'>
            <label htmlFor="searchTermInput"><FontAwesomeIcon icon={faSearch} /></label>
            <input id='searchTermInput' className='searchTermInput' type="text" value={searchTerm} placeholder='Pesquisar adicional' onChange={e => handleSearch(e)} />
            <div className='filterByAdditionalProductTypeContainer'>
              <label style={{ color: `#000` }} htmlFor="filterByProductType">{`Filtrar por tipo `}
                <FontAwesomeIcon icon={faFilter} />
              </label>
              <select className='filterByProductType' name="filterByProductType" id="filterByProductType"
                onChange={e => handleAdditionalProductSelect(e)}
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
        </AdminAdditionalProductMenuList>
      </div >
    );
  }

  const getProductTypesMenu = () => {
    console.log(`Product types menu.`);
    return (
      <div className="ProductMenuContainer">
        <div className='titles'>
          <h1 style={{ color: '#000' }} className='scalingAnimation linkUnavailable'>
            <span style={{ color: 'green' }}>Painel de administração de tipos de produtos</span>
          </h1>
          <h1 style={{ color: '#000' }} className='scalingAnimation linkUnavailable'>Clique no item para editar os tipos de produto do estabelecimento 👇🏻
          </h1>
        </div>
        {getRobotHTML()}
        <AdminProductTypeMenuList removeItemFromList={removeProductTypeItemFromList} productTypeMenuItems={filteredProductTypeSelectOptions.length > 0 || searchTerm.length > 0 ? filteredProductTypeSelectOptions : productTypeSelectOptions}
        >
          <div className='newProductButtonContainer'>
            <a href='/admin?action=create&collection=productType' style={{ width: `fit-content`, color: '#000' }}>Novo tipo de produto <FontAwesomeIcon color='rgb(231, 77, 0)' fontSize={`1.5em`} icon={faPlusSquare} /></a>
          </div>
          <div className='filterInputsContainer'>
            <label htmlFor="searchTermInput"><FontAwesomeIcon icon={faSearch} /></label>
            <input id='searchTermInput' className='searchTermInput' type="text" value={searchTerm} placeholder='Pesquisar tipo de produto' onChange={e => handleProductTypeSearch(e)} />
          </div>
        </AdminProductTypeMenuList>
      </div>
    );
  }

  const getOrdersMenu = () => {
    console.log(`Orders menu.`);
    return (
      <div className="ProductMenuContainer">
        <div className='titles'>
          <h1 style={{ color: '#000' }} className='scalingAnimation linkUnavailable'>
            <span style={{ color: 'green' }}>Painel de administração de pedidos</span>
          </h1>
          <h1 style={{ color: '#000' }} className='scalingAnimation linkUnavailable'>Clique no item para finalizar o pedido, o cliente é avisado automaticamente 👇🏻
          </h1>
        </div>
        {getRobotHTML()}
        <AdminOrderMenuList updateOrderFinished={updateOrderFinished} updateOrderPaymentReceived={updateOrderPaymentReceived} orderMenuItems={filteredOrderSelectOptions.length > 0 || searchTerm.length > 0 || orderStatusSearchTerm !== 'all' ? filteredOrderSelectOptions : orderSelectOptions}
        >
          {/* <div className='newProductButtonContainer'>
            <a href='/admin?action=create&collection=productType' style={{ width: `fit-content`, color: '#000' }}>Novo pedido <FontAwesomeIcon color='rgb(231, 77, 0)' fontSize={`1.5em`} icon={faPlusSquare} /></a>
          </div> */}
          <div className='filterInputsContainer'>
            <label htmlFor="searchTermInput"><FontAwesomeIcon icon={faSearch} /></label>
            <input id='searchTermInput' className='searchTermInput' type="text" value={searchTerm} placeholder='Pesquisar pedido' onChange={e => handleOrderSearch(e)} />
            <div className='filterByProductTypeContainer'>
              <label style={{ color: `#000` }} htmlFor="filterByProductType">{`Filtrar por status do pedido `}
                <FontAwesomeIcon icon={faFilter} />
              </label>
              <select className='filterByProductType' name="filterByProductType" id="filterByProductType"
                onChange={e => handleOrderStatusFilterSelect(e)}
              >
                <option value="all" defaultChecked={true} >Todos</option>
                {orderStatusSelectOptions.map(orderStatusSelectOption => {
                  return (
                    <option key={orderStatusSelectOption.value} value={orderStatusSelectOption.value}>{orderStatusSelectOption.label}</option>
                  );
                })}
              </select>
            </div>
          </div>
        </AdminOrderMenuList>
      </div>
    );
  }

  const getUsersMenu = () => {
    console.log(`Users menu.`);
    return (
      <div className="ProductMenuContainer">
        <div className='titles'>
          <h1 style={{ color: '#000' }} className='scalingAnimation linkUnavailable'>
            <span style={{ color: 'green' }}>Painel de administração de usuários</span>
          </h1>
          <h1 style={{ color: '#000' }} className='scalingAnimation linkUnavailable'>Clique no item para editar os usuários do estabelecimento 👇🏻
          </h1>
        </div>
        {getRobotHTML()}
        <AdminUserMenuList removeItemFromList={removeUserFromList} userMenuItems={filteredUserMenuOptions.length > 0 || searchTerm.length > 0 ? filteredUserMenuOptions : userMenuOptions}
        >
          <div className='newProductButtonContainer'>
            <a href='/admin?action=create&collection=user' style={{ width: `fit-content`, color: '#000' }}>Novo usuário <FontAwesomeIcon color='rgb(231, 77, 0)' fontSize={`1.5em`} icon={faPlusSquare} /></a>
          </div>
          <div className='filterInputsContainer'>
            <label htmlFor="searchTermInput"><FontAwesomeIcon icon={faSearch} /></label>
            <input id='searchTermInput' className='searchTermInput' type="text" value={searchTerm} placeholder='Pesquisar usuário' onChange={e => handleProductTypeSearch(e)} />
          </div>
        </AdminUserMenuList>
      </div>
    );
  }

  if (action === 'list') {
    if (collection === `product`) {
      return (getDefaultMenu());

    } else if (collection === `user`) {
      return (
        getUsersMenu()
      );
    } else if (collection === `additionalProduct`) {
      return (
        getAdditionalProductsMenu()
      );
    } else if (collection === `productType`) {
      return (
        // <div>
        //   Product types list
        // </div>
        getProductTypesMenu()
      );
    } else if (collection === `order`) {
      return (
        // <div>
        //   Product types list
        // </div>
        getOrdersMenu()
      );
    }

  } else if (action === 'create') {

    if (collection === `product`) {

      return (
        // <div>
        //   Create new product page
        // </div>
        <ProductPage productTypeSelectOptions={productTypeSelectOptions} />
      );

    } else if (collection === `additionalProduct`) {
      return (
        // <div>
        //   Create new product type page
        // </div>
        <AdditionalProductPage productTypeSelectOptions={productTypeSelectOptions} />
      );
    } else if (collection === `productType`) {
      return (
        // <div>
        //   Create new product type page
        // </div>
        <ProductTypePage />
      );
    } else if (collection === `user`) {
      return (
        // <div>
        //   Create new product type page
        // </div>
        <UserPage />
      );

    }

  } else if (action === 'edit') {

    if (collection === `product`) {

      const selectedProduct = productMenuOptions.find(item => item.id === id || item._id === id);
      console.log(`selectedProduct: `, selectedProduct);

      return (
        // <div>
        //   Edit product {id} page
        // </div>
        <ProductPage record={selectedProduct} productTypeSelectOptions={productTypeSelectOptions} />

      );

    } else if (collection === `additionalProduct`) {


      const selectedAdditionalProduct = additionalProductMenuOptions.find(item => item.id === id || item._id === id);
      console.log(`selectedAdditionalProduct: `, selectedAdditionalProduct);

      return (
        <AdditionalProductPage record={selectedAdditionalProduct} productTypeSelectOptions={productTypeSelectOptions} />
      );

    } else if (collection === `productType`) {


      const selectedProductType = productTypeSelectOptions.find(item => item.id === id || item._id === id);
      console.log(`selectedProductType: `, selectedProductType);

      return (
        // <div>
        //   Edit product type {id} page
        // </div>
        <ProductTypePage record={selectedProductType} />

      );

    } else if (collection === `user`) {

      const selectedUser = userMenuOptions.find(item => item.phoneNumber === id || item._id === id);
      console.log(`selectedUser: `, selectedUser);

      return (
        // <div>
        //   Edit product type {id} page
        // </div>
        <UserPage record={selectedUser} />

      );

    } else if (collection === `company`) {

      const selectedUser = userMenuOptions.find(item => item.phoneNumber === id || item._id === id);
      console.log(`selectedUser: `, selectedUser);

      return (

        <CompanyPage />

      );

    }

  }

  return (
    getDefaultMenu()
  )

}

export default AdminMenu;
