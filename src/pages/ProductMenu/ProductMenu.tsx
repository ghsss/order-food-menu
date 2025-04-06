import React, { useEffect, useState } from 'react';
import './styles/ProductMenu.css';
import ProductMenuList from './components/ProductMenuList';
import ProductModel from '../../models/Product';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { faGlobe } from '@fortawesome/free-solid-svg-icons';

const whatsAppQueryParams = encodeURIComponent('Olá! Gostaria de fazer um pedido.');

function ProductMenu() {

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

  }, [productMenuOptions]);

  return (
    <div className="ProductMenuContainer">
      <div className='titles'>
        <h1 style={{ color: '#000' }} className='scalingAnimation linkUnavailable'>Clique no item para copiar o código do produto! ❤️‍🔥😍
        </h1>
        <h1 style={{ color: '#000' }} className='linkUnavailable'>
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
      <ProductMenuList productMenuItems={productMenuOptions} />
    </div>
  );
}

export default ProductMenu;
