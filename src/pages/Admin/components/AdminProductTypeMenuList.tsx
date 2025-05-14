import React from 'react';
import './styles/AdminProductTypeMenuList.css';
import AdminProductTypeMenuListItem from './AdminProductTypeMenuListItem';
import ProductTypeModel from '../../../models/ProductType';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowCircleLeft, faCartShopping, faKey, faPhone } from '@fortawesome/free-solid-svg-icons';

interface AdminProductTypeMenuListProps {
  removeItemFromList: (item: ProductTypeModel) => boolean,
  productTypeMenuItems: ProductTypeModel[],
  children?: React.ReactNode;
}

function AdminProductTypeMenuList({ removeItemFromList, productTypeMenuItems, children }: AdminProductTypeMenuListProps) {

  return (
    <div className='ProductTypeMenuListContainer'>
      <div className='pageTabs'>
        <a href='/admin?action=list&collection=product#'>{`Voltar para produtos. `}<FontAwesomeIcon icon={faArrowCircleLeft} /><FontAwesomeIcon icon={faCartShopping} /></a>
      </div>
      <h2 className='listTitle linkUnavailable'>🔥 Tipos de produtos do estabelecimento 🔥</h2>
      {children}
      <div className='ProductTypeMenuListContainerScroll'>
        <div className="ProductTypeMenuList">
          {
            productTypeMenuItems.length === 0 ?
              <p style={{ alignSelf: 'center', justifySelf: 'center', width: '100%' }}>Nenhum tipo de produto encontrado. Verifique sua pesquisa ou crie novos tipos de produto</p>
              :
              productTypeMenuItems.map(ProductTypeMenuItem => {
                return (
                  <AdminProductTypeMenuListItem removeItemFromList={removeItemFromList} key={ProductTypeMenuItem.id} item={ProductTypeMenuItem} />
                )
              })
          }
        </div>
      </div>
    </div>
  );
}

export default AdminProductTypeMenuList;
