import React from 'react';
import './styles/AdminUserMenuList.css';
import UserModel from '../../../models/User';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowCircleLeft, faCartShopping, faKey } from '@fortawesome/free-solid-svg-icons';
import AdminUserMenuListItem from './AdminUserMenuListItem';

interface AdminUserMenuListProps {
  removeItemFromList: (item: UserModel) => boolean,
  userMenuItems: UserModel[],
  children?: React.ReactNode;
}

function AdminUserMenuList({ removeItemFromList, userMenuItems, children }: AdminUserMenuListProps) {

  return (
    <div className='UserMenuListContainer'>
      <div className='pageTabs'>
        <a href='/admin?action=list&collection=product#'>{`Voltar para produtos. `}<FontAwesomeIcon icon={faArrowCircleLeft} /><FontAwesomeIcon icon={faCartShopping} /></a>
        <a href='/admin/access-code?action=requestAccessCode'>{`Acessar como outro usuário. `}<FontAwesomeIcon icon={faKey} /></a>
      </div>
      <h2 className='listTitle linkUnavailable'>🔥 Usuários do estabelecimento 🔥</h2>
      {children}
      <div className='UserMenuListContainerScroll'>
        <div className="UserMenuList">
          {
            userMenuItems.length === 0 ?
              <p style={{ alignSelf: 'center', justifySelf: 'center', width: '100%' }}>Nenhum usuário encontrado. Verifique sua pesquisa ou crie novos usuários.</p>
              :
              userMenuItems.map(userMenuItem => {
                return (
                  <AdminUserMenuListItem removeItemFromList={removeItemFromList} key={userMenuItem.phoneNumber} item={userMenuItem} />
                )
              })
          }
        </div>
      </div>
    </div>
  );
}

export default AdminUserMenuList;
