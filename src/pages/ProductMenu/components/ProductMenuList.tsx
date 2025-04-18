import React from 'react';
import './styles/ProductMenuList.css';
import ProductModel from '../../../models/Product';
import ProductMenuListItem from './ProductMenuListItem';

interface ProductMenuListProps {
  productMenuItems: ProductModel[],
  children?: React.ReactNode;
}

function ProductMenuList({ productMenuItems, children }: ProductMenuListProps) {

  return (
    <div className='ProductMenuListContainer'>
      <h2 className='listTitle linkUnavailable'>🔥 Cardápio 🔥</h2>
      {children}
      <div className='ProductMenuListContainerScroll'>
        <div className="ProductMenuList">
          {
            productMenuItems.length === 0? 
            <p style={{alignSelf: 'center', justifySelf: 'center', width: '100%'}}>Nenhum produto encontrado. Verifique sua pesquisa</p>
            :
            productMenuItems.map(productMenuItem => {
              return (
                <ProductMenuListItem key={productMenuItem.id} item={productMenuItem} />
              )
            })
          }
        </div>
      </div>
    </div>
  );
}

export default ProductMenuList;
