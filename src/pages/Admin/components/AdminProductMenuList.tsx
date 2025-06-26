import React from 'react';
import './styles/AdminProductMenuList.css';
import ProductModel from '../../../models/Product';
import AdminProductMenuListItem from './AdminProductMenuListItem';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartPlus, faFire, faHamburger, faKey, faList, faPhone, faWarning } from '@fortawesome/free-solid-svg-icons';

interface AdminProductMenuListProps {
  isSuperAdmin: boolean,
  removeItemFromList: (item: ProductModel) => boolean,
  productMenuItems: ProductModel[],
  children?: React.ReactNode;
}

function AdminProductMenuList({ isSuperAdmin, removeItemFromList, productMenuItems, children }: AdminProductMenuListProps) {

  return (
    <div className='ProductMenuListContainer'>
      <div className='pageTabs'>
        <a href='/admin?action=list&collection=additionalProduct#'>{`Ir para adicionais. `}<FontAwesomeIcon icon={faCartPlus} /></a>
        <a href='/admin?action=list&collection=productType#'>{`Ir para tipos de produtos. `}<FontAwesomeIcon icon={faList} /></a>
        <a href='/admin?action=list&collection=order&filter=today#'>{`Ir para lista de pedidos de HOJE. `}<FontAwesomeIcon icon={faFire} /><FontAwesomeIcon icon={faHamburger} /></a>
        <a href='/admin?action=list&collection=order#'>{`Ir para todos os pedidos. `}<FontAwesomeIcon icon={faFire} /><FontAwesomeIcon icon={faHamburger} /></a>
        <a href='/admin/access-code?action=requestAccessCode'>{`Acessar como outro usuário. `}<FontAwesomeIcon icon={faKey} /></a>
        {isSuperAdmin ?
          <>
            <a href='/admin?action=edit&collection=company&id=company#'>{`Alterar dados da empresa. `}<FontAwesomeIcon icon={faWarning} /></a>
            <a href='/admin?action=list&collection=user#'>{`Gerenciar administradores. `}<FontAwesomeIcon icon={faPhone} /></a>
          </>
          :
          <></>}
      </div>
      <h2 className='listTitle linkUnavailable'>🔥 Produtos do estabelecimento 🔥</h2>
      {children}
      <div className='ProductMenuListContainerScroll'>
        <div className="ProductMenuList">
          {
            productMenuItems.length === 0 ?
              <p style={{ alignSelf: 'center', justifySelf: 'center', width: '100%' }}>Nenhum produto encontrado. Verifique sua pesquisa</p>
              :
              productMenuItems.map(productMenuItem => {
                return (
                  <AdminProductMenuListItem removeItemFromList={removeItemFromList} key={productMenuItem.id} item={productMenuItem} />
                )
              })
          }
        </div>
      </div>
    </div>
  );
}

export default AdminProductMenuList;
