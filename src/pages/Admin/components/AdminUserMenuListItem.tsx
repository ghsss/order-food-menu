import React, { useState } from 'react';
import './styles/AdminUserMenuListItem.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { icon,  } from '@fortawesome/fontawesome-svg-core';
import { faCheckCircle, faPencil, faTrash, faX, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import UserModel from '../../../models/User';
import UserServiceInstance from '../../../services/UserService';
import AccessCodeServiceInstance from '../../../services/AccessCodeService';

interface AdminUserMenuListItemProps {
  removeItemFromList: (item: UserModel) => boolean,
  item: UserModel;
  children?: React.ReactNode;
}

function AdminUserMenuListItem({
  removeItemFromList,
  item,
  children
}: AdminUserMenuListItemProps) {

  const [showingIcon, setshowingIcon] = useState<IconDefinition>(faPencil);
  const [showingDeleteIcon, setShowingDeleteIcon] = useState<IconDefinition>(faTrash);

  function handleCopyItemCode(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {

    // Copy the text inside the text field
    try {
      setTimeout(() => {
        window.location.href = '/admin?action=edit&collection=user&id=' + item.phoneNumber;
      }, 100);
      setTimeout(() => {
        setshowingIcon(faPencil);
      }, 1000);

    } catch (error) {

      setshowingIcon(faX);

    }

  }

  async function handleDeleteItemCode(item: UserModel) {

    // Copy the text inside the text field
    try {

      setTimeout(async () => {

        const confirmed = window.confirm(`Confirma a exclusão do usuário "${item.phoneNumber}"?`)
        // setshowingIcon(faCheckCircle);
        if (confirmed) {

          const deleted = await AccessCodeServiceInstance.deleteAdmin(item.phoneNumber);

          if (deleted) {

            setShowingDeleteIcon(faCheckCircle);
            setTimeout(() => {
              removeItemFromList(item);
              window.alert('Registro deletado com sucesso.');
              setShowingDeleteIcon(showingDeleteIcon);
              // window.location.href = '/admin?action=list&collection=User';
            }, 50);
            // REMOVE ITEM FROM LIST

            // window.location.href = '/admin?action=list&collection=User';
          }
          else {
            // window.alert(`Erro ao excluir usuário.`);
          }

        }

      }, 50);

    } catch (error) {

      setShowingDeleteIcon(faX);

    }

  }

  return (
    <div className="UserMenuListItemContainer glowBox" onClick={event => handleCopyItemCode(event)}>
      <div id={'copyIcon'} style={{ color: (showingIcon === faPencil ? `inherit` : (showingIcon === faX ? `red` : `green`)), justifySelf: `flex-end`, marginRight: `2em`, marginTop: `2em` }} >
        <FontAwesomeIcon
          icon={showingIcon}
        />
      </div>
      {/* {children} */}
      <div id='deleteIcon' style={{
        color: (showingDeleteIcon === faTrash ? `` : (showingDeleteIcon === faX ? `red` : `green`)),
        justifySelf: `flex-end`, marginRight: `2em`, marginTop: `2em`,
        zIndex: `100`
      }}
        onClick={async e => {
          e.stopPropagation();
          await handleDeleteItemCode(item);
        }}
      >
        <FontAwesomeIcon
          icon={showingDeleteIcon}
        />
      </div>
      <p id='itemName' className='itemName scalingAnimation'>
        <span>⭐ </span>
        {item.isSuperAdmin? ' Super-Administrador' : ' Administrador'}
      </p>
      <p id='item.id'>
        <span>Número do WhatsApp: </span>
        {item.phoneNumber}
      </p>
    </div>
  );
}

export default AdminUserMenuListItem;
