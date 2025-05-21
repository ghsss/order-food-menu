/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import './styles/ProductMenu.css';
import ProductMenuList from './components/ProductMenuList';
import ProductModel from '../../models/Product';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { faCheck, faClock, faFilter, faGlobe, faHeadphones, faMinusCircle, faPlusCircle, faSearch, faX } from '@fortawesome/free-solid-svg-icons';
import ProductServiceInstance from '../../services/ProductService';
import ProductTypeModel from '../../models/ProductType';
import ProductTypeServiceInstance from '../../services/ProductTypeService';
import RobotServiceInstance from '../../services/RobotService';
import RobotModel from '../../models/Robot';
import CompanyModel from '../../models/Company';
import CompanyServiceInstance from '../../services/CompanyService';

const whatsAppQueryParams = encodeURIComponent('Olá! Gostaria de fazer um pedido.');

function ProductMenu() {

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

  useEffect(() => {

    const getProducts = async () => {

      const getProductTypesResponse = await ProductTypeServiceInstance.getProductTypes();
      getProductTypesResponse.sort((a: ProductTypeModel, b: ProductTypeModel) => {
        // s1.toLowerCase().localeCompare(s2.toLowerCase()));
        return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
      });
      console.log('getProductTypesResponse: ', getProductTypesResponse);
      setProductTypeSelectOptions(getProductTypesResponse);

      const getProductsResponse = await ProductServiceInstance.getProducts();
      getProductsResponse.sort((a: ProductTypeModel, b: ProductTypeModel) => {
        // s1.toLowerCase().localeCompare(s2.toLowerCase()));
        return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
      });
      console.log('getProductsResponse: ', getProductsResponse);
      setProductMenuOptions(getProductsResponse);

      const robotRef = await RobotServiceInstance.getRobot();

      if (robotRef && robotRef.phone) {
        setRobot(robotRef);
      }

      const companyRef = await CompanyServiceInstance.getCompany();

      setCompany(companyRef);

    }

    getProducts();

  }, []);

  useEffect(() => {

    console.log('company: ', company);
    console.log('robot: ', robot);

  }, [company, robot]);

  useEffect(() => {

    console.log('productMenuOptions: ', productMenuOptions);
    console.log('filteredProductMenuOptions: ', filteredProductMenuOptions);

  }, [productMenuOptions, filteredProductMenuOptions]);

  useEffect(() => {

    console.log('searchTerm: ', searchTerm);
    applyFilters();

  }, [searchTerm]);

  useEffect(() => {

    console.log('productTypeSearchTerm: ', productTypeSearchTerm);
    applyFilters();

  }, [productTypeSearchTerm]);

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

  return (
    <div className="ProductMenuContainer">
      <div style={{ width: '100%', display: 'flex', marginBottom: '2em' }} className='titles'>
        <a style={{ justifySelf: 'flex-end', alignSelf: 'flex-end', marginRight: '1em', marginTop: '1em' }} href='/admin?action=menu'>
          {`Sou um administrador `}
          <FontAwesomeIcon icon={faHeadphones} />
        </a>
      </div>
      <div className='titles'>
        {/* <h1 id='instruction1' style={{ color: '#000' }} className='scalingAnimation linkUnavailable'>Clique em um item do cardápio para copiar o código do produto! ❤️‍🔥😍
        </h1> */}
        {/* <h1 style={{ color: '#000' }} className='scalingAnimation linkUnavailable'>
          <span style={{ color: 'green' }}>Redirecionamento automático <FontAwesomeIcon fontSize={`1.25em`} color='green' icon={faWhatsapp} /></span>
        </h1> */}
      </div>
      <div style={{ fontSize: '.75em',maxWidth: '60%'}} className='column'>
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
      <div className='row linksRow'>
        <a className={robot?.phone ? 'goToWhatsAppLink' : 'linkUnavailable'} rel='noreferrer' target='_blank' href={`https://wa.me/${robot?.phone}?text=${whatsAppQueryParams}`}>
          {'Pedir pelo WhatsApp '}
          <FontAwesomeIcon fontSize={`2.5em`} color='green' icon={faWhatsapp} />
        </a>
        <a href={"/#"} className='linkUnavailable'>
          {'Pedir pelo site '}
          <FontAwesomeIcon fontSize={`2.5em`} color='blue' icon={faGlobe} />
        </a>
      </div>
      {
        robot ?
          <ProductMenuList companyIsOpenNow={companyIsOpenNow()} robot={robot} productMenuItems={filteredProductMenuOptions.length > 0 || searchTerm.length > 0 ? filteredProductMenuOptions : productMenuOptions}
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
    </div >
  );
}

export default ProductMenu;
