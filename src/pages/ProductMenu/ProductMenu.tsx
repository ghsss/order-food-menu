import React, { useEffect, useState } from 'react';
import './styles/ProductMenu.css';
import ProductMenuList from './components/ProductMenuList';
import ProductModel from '../../models/Product';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { faFilter, faGlobe, faSearch } from '@fortawesome/free-solid-svg-icons';

const whatsAppQueryParams = encodeURIComponent('Olá! Gostaria de fazer um pedido.');

function ProductMenu() {

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [productTypeSearchTerm, setProductTypeSearchTerm] = useState<string>('');
  const [filteredProductMenuOptions, setFilteredProductMenuOptions] = useState<ProductModel[]>([]);
  const [productMenuOptions, setProductMenuOptions] = useState<ProductModel[]>([{
    id: 'C1',
    name: 'Cachorro Quente Grande 🌭😋',
    price: 22.50,
    image_url: `./hotdog2.jpg`,
    description: 'Pão grande, molho de tomate, milho, ervilha, 2 salsicha, maionese, ketchup, mostarda e batata palha.',
    product_type: {
      id: 'CACHORRO QUENTE',
      name: 'Cachorro Quente',
      subtype: {
        id: 'CACHORRO QUENTE GRANDE',
        name: 'Cachorro Quente Grande',
      }
    }
  }, {
    id: 'C2',
    name: 'Cachorro Quente Pequeno 🌭😋',
    price: 18.50,
    image_url: `./hotdog2.jpg`,
    description: 'Pão pequeno, molho de tomate, milho, ervilha, 1 salsicha, maionese, ketchup, mostarda e batata palha.',
    product_type: {
      id: 'CACHORRO QUENTE',
      name: 'Cachorro Quente',
      subtype: {
        id: 'CACHORRO QUENTE PEQUENO',
        name: 'Cachorro Quente Pequeno',
      }
    },
  }, {
    id: 'H1',
    name: 'Hamburguer Salada 🍔😋',
    price: 20.00,
    image_url: `./hamburguer.jpg`,
    description: 'Pão de hamburguer, maionese, ketchup, mostarda, bife pequeno, queijo, alface e tomate.',
    product_type: {
      id: 'HAMBURGUER',
      name: 'Hamburguer',
    },
  }, {
    id: 'X1',
    name: 'Xis Salada 🍔😋',
    price: 24.00,
    // image_url: `./hamburguer.jpg`,
    description: 'Pão de xis, maionese, ketchup, mostarda, bife grande, queijo, alface e tomate.',
    product_type: {
      id: 'XIS',
      name: 'Xis',
    },
  }]);

  useEffect(() => {

    console.log('productMenuOptions: ', productMenuOptions);
    console.log('filteredProductMenuOptions: ', filteredProductMenuOptions);

  }, [productMenuOptions, filteredProductMenuOptions]);

  useEffect(() => {

    // console.log('productMenuOptions: ', productMenuOptions);
    console.log('searchTerm: ', searchTerm);
    // if (searchTerm.length > 0) {

    //   const filteredList = filteredProductMenuOptions.length > 0 ?
    //     filteredProductMenuOptions.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
    //     :
    //     productMenuOptions.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));

    //   console.log('filteredList by name: ', filteredList);

    //   setFilteredProductMenuOptions(filteredList);

    // }

  }, [searchTerm]);

  useEffect(() => {

    // console.log('productMenuOptions: ', productMenuOptions);
    console.log('productTypeSearchTerm: ', productTypeSearchTerm);
    // if (productTypeSearchTerm !== `all`) {

    //   const filteredList = filteredProductMenuOptions.length > 0 ?
    //     filteredProductMenuOptions.filter(item => item.product_type.id.toLowerCase().includes(productTypeSearchTerm.toLowerCase()))
    //     :
    //     productMenuOptions.filter(item => item.product_type.id.toLowerCase().includes(productTypeSearchTerm.toLowerCase()));

    //   console.log('filteredList by product type: ', filteredList);

    //   setFilteredProductMenuOptions(filteredList);

    // }

  }, [productTypeSearchTerm]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {

    const searchTermRefreshed = e.target.value;

    if (searchTermRefreshed !== searchTerm) {

      setSearchTerm(searchTermRefreshed);

    }

    if (searchTermRefreshed.length > 0) {

      const filteredList = filteredProductMenuOptions.length > 0 ?
        filteredProductMenuOptions.filter(item => item.name.toLowerCase().includes(searchTermRefreshed.toLowerCase()))
        :
        productMenuOptions.filter(item => item.name.toLowerCase().includes(searchTermRefreshed.toLowerCase()));

      console.log('filteredList by name: ', filteredList);

      setFilteredProductMenuOptions(filteredList);

    } else {

      handleSearchTermInputClear();

    }

  }

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {

    const productTypeSearchTermRefreshed = e.target.value;

    if (productTypeSearchTermRefreshed !== productTypeSearchTerm) {

      setProductTypeSearchTerm(productTypeSearchTermRefreshed);

    }

    if (productTypeSearchTermRefreshed !== `all`) {

      const filteredList = filteredProductMenuOptions.length > 0 ?
        filteredProductMenuOptions.filter(item => item.product_type.id.toLowerCase().includes(productTypeSearchTermRefreshed.toLowerCase()))
        :
        productMenuOptions.filter(item => item.product_type.id.toLowerCase().includes(productTypeSearchTermRefreshed.toLowerCase()));

      console.log('filteredList by product type: ', filteredList);

      setFilteredProductMenuOptions(filteredList);

    } else {

      handleProductTypeInputClear();

    }

  }

  const handleSearchTermInputClear = () => {

    if (productTypeSearchTerm !== `all`) {

      const filteredList = productMenuOptions.filter(item => item.product_type.id.toLowerCase().includes(productTypeSearchTerm.toLowerCase()));

      console.log('refreshed filteredList by current selected product type (' + productTypeSearchTerm + '): ', filteredList);

      setFilteredProductMenuOptions(filteredList);

    } else {

      setFilteredProductMenuOptions(productMenuOptions);

    }

  }

  const handleProductTypeInputClear = () => {

    if (searchTerm.length > 0) {

      const filteredList = productMenuOptions.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));

      console.log('refreshed filteredList by current searchTerm (' + searchTerm + '): ', filteredList);

      setFilteredProductMenuOptions(filteredList);

    } else {

      setFilteredProductMenuOptions(productMenuOptions);

    }

  }

  return (
    <div className="ProductMenuContainer">
      <div className='titles'>
        <h1 style={{ color: '#000' }} className='scalingAnimation linkUnavailable'>Clique no item para copiar o código do produto! ❤️‍🔥😍
        </h1>
        <h1 style={{ color: '#000' }} className='scalingAnimation linkUnavailable'>
          <span style={{ color: 'green' }}>Redirecionamento automático <FontAwesomeIcon fontSize={`1.25em`} color='green' icon={faWhatsapp} /></span>
        </h1>
      </div>
      <div className='row linksRow'>
        <a className='goToWhatsAppLink' rel='noreferrer' target='_blank' href={"https://wa.me/555499026453?text=" + whatsAppQueryParams}>
          {'Pedir pelo WhatsApp '}
          <FontAwesomeIcon fontSize={`2.5em`} color='green' icon={faWhatsapp} />
        </a>
        <a href={"/#"} className='linkUnavailable'>
          {'Pedir pelo site '}
          <FontAwesomeIcon fontSize={`2.5em`} color='blue' icon={faGlobe} />
        </a>
      </div>
      <ProductMenuList productMenuItems={filteredProductMenuOptions.length > 0 || searchTerm.length > 0 ? filteredProductMenuOptions : productMenuOptions}
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
              <option value="Cachorro Quente">Cachorro Quente</option>
            </select>
          </div>
        </div>
      </ProductMenuList>
    </div>
  );
}

export default ProductMenu;
