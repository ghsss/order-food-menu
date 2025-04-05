import React, { useState } from 'react';
import './styles/ProductMenu.css';
import ProductMenuList from './components/ProductMenuList';
import ProductModel from '../../models/Product';

function ProductMenu() {

  const [productMenuOptions, setProductMenuOptions] = useState<ProductModel[]>([{
    id: 'C1',
    name: 'Cachorro Quente Grande 🌭😋',
    price: 22.50,
    image_url: `./hotdog2.jpg`,
    description: 'Pão, molho de tomate, salsicha e batata palha.'
  }, {
    id: 'C2',
    name: 'Cachorro Quente Pequeno 🌭😋',
    price: 18.50,
    image_url: `./hotdog2.jpg`,
    description: 'Pão, molho de tomate, salsicha e batata palha.'
  }, {
    id: 'H1',
    name: 'Hamburguer salada 🍔😋',
    price: 20.00,
    image_url: `./hamburguer.jpg`,
    description: 'Pão, bife, queijo, alface, tomate.'
  }, {
    id: 'X1',
    name: 'Xis salada 🍔😋',
    price: 24.00,
    image_url: `./hamburguer.jpg`,
    description: 'Pão, bife, queijo, alface, tomate.'
  }]);

  return (
    <div className="ProductMenuContainer">
      <h1>Clique no item para copiar o código do produto</h1>
      <ProductMenuList productMenuItems={productMenuOptions} />
    </div>
  );
}

export default ProductMenu;
