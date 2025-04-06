import React from 'react';
import './styles/ProductMenuList.css';
import ProductModel from '../../../models/Product';
import ProductMenuListItem from './ProductMenuListItem';

interface ProductMenuListProps {
  productMenuItems: ProductModel[],
  children?: React.ReactNode;
}

function ProductMenuList({ productMenuItems }: ProductMenuListProps) {

  return (
    <div className='ProductMenuListContainer'>
      <h2 className='listTitle linkUnavailable'>🔥 Cardápio 🔥</h2>
      <div className='ProductMenuListContainerScroll'>
        <div className="ProductMenuList">
          {
            productMenuItems.map(productMenuItem => {
              return (
                <ProductMenuListItem item={productMenuItem} />
              )
            })
          }
        </div>
      </div>
    </div>
  );
}

export default ProductMenuList;
