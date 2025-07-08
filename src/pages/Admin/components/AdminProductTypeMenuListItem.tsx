import React, { useState } from 'react';
import './styles/AdminProductTypeMenuListItem.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { icon,  } from '@fortawesome/fontawesome-svg-core';
import { faCheckCircle, faPencil, faTrash, faX, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import ProductTypeModel from '../../../models/ProductType';
import ProductTypeServiceInstance from '../../../services/ProductTypeService';

interface AdminProductTypeMenuListItemProps {
  removeItemFromList: (item: ProductTypeModel) => boolean,
  item: ProductTypeModel;
  children?: React.ReactNode;
}

function AdminProductTypeMenuListItem({
  removeItemFromList,
  item,
  children
}: AdminProductTypeMenuListItemProps) {

  const [showingIcon, setshowingIcon] = useState<IconDefinition>(faPencil);
  const [showingDeleteIcon, setShowingDeleteIcon] = useState<IconDefinition>(faTrash);

  function handleCopyItemCode(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {

    // Copy the text inside the text field
    try {
      setTimeout(() => {
        window.location.href = '/admin?action=edit&collection=productType&id=' + item.id;
      }, 100);
      setTimeout(() => {
        setshowingIcon(faPencil);
      }, 1000);

    } catch (error) {

      setshowingIcon(faX);

    }

  }

  async function handleDeleteItemCode(item: ProductTypeModel) {

    // Copy the text inside the text field
    try {

      setTimeout(async () => {

        const confirmed = window.confirm(`Confirma a exclusão do tipo de produto "${item.name}"?`)
        // setshowingIcon(faCheckCircle);
        if (confirmed) {

          const deleted = await ProductTypeServiceInstance.deleteProductType(item);

          if (deleted) {

            setShowingDeleteIcon(faCheckCircle);
            setTimeout(() => {
              removeItemFromList(item);
              window.alert('Registro deletado com sucesso.');
              setShowingDeleteIcon(showingDeleteIcon);
              // window.location.href = '/admin?action=list&collection=productType';
            }, 50);
            // REMOVE ITEM FROM LIST

            // window.location.href = '/admin?action=list&collection=productType';
          }
          else {
            // window.alert(`Erro ao excluir tipo de produto.`);
          }

        }

      }, 50);

    } catch (error) {

      setShowingDeleteIcon(faX);

    }

  }

  return (
    <div className="ProductTypeMenuListItemContainer glowBox" onClick={event => handleCopyItemCode(event)}>
      <div id={'copyIcon'} style={{ color: (showingIcon === faPencil ? `inherit` : (showingIcon === faX ? `red` : `green`)), marginRight: `2em`, marginTop: `2em` }} >
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
        {item.name}
      </p>
      <p id='item.id'>
        <span>Código do tipo de produto: </span>
        {item.id}
      </p>
    </div>
  );
}

export default AdminProductTypeMenuListItem;
