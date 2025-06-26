import React from 'react';
import './styles/AdminAdditionalProductMenuList.css';
import AdditionalProductModel from '../../../models/AdditionalProduct';
import AdminAdditionalProductMenuListItem from './AdminAdditionalProductMenuListItem';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowCircleLeft, faCartShopping, faFire, faHamburger, faKey, faList, faPhone, faWarning } from '@fortawesome/free-solid-svg-icons';

interface AdminAdditionalProductMenuListProps {
  isSuperAdmin: boolean,
  removeItemFromList: (item: AdditionalProductModel) => boolean,
  additionalProductMenuItems: AdditionalProductModel[],
  children?: React.ReactNode;
}

function AdminAdditionalProductMenuList({ isSuperAdmin, removeItemFromList, additionalProductMenuItems, children }: AdminAdditionalProductMenuListProps) {

  return (
    <div className='AdditionalProductMenuListContainer'>
      <div className='pageTabs'>
        <a href='/admin?action=list&collection=product#'>{`Voltar para produtos. `}<FontAwesomeIcon icon={faArrowCircleLeft} /><FontAwesomeIcon icon={faCartShopping} /></a>
      </div>
      <h2 className='listTitle linkUnavailable'>🔥 Adicionais do estabelecimento 🔥</h2>
      {children}
      <div className='AdditionalProductMenuListContainerScroll'>
        <div className="AdditionalProductMenuList">
          {
            additionalProductMenuItems.length === 0 ?
              <p style={{ alignSelf: 'center', justifySelf: 'center', width: '100%' }}>Nenhum adicional encontrado. Verifique sua pesquisa</p>
              :
              additionalProductMenuItems.map(AdditionalProductMenuItem => {
                return (
                  <AdminAdditionalProductMenuListItem removeItemFromList={removeItemFromList} key={AdditionalProductMenuItem.id} item={AdditionalProductMenuItem} />
                )
              })
          }
        </div>
      </div>
    </div>
  );
}

export default AdminAdditionalProductMenuList;
