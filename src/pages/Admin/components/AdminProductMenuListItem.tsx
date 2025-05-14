import React, { useState } from 'react';
import './styles/AdminProductMenuListItem.css';
import ProductModel from '../../../models/Product';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { icon,  } from '@fortawesome/fontawesome-svg-core';
import { faCheckCircle, faPencil, faTrash, faX, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import ProductServiceInstance from '../../../services/ProductService';

interface AdminProductMenuListItemProps {
  removeItemFromList: (item: ProductModel) => boolean;
  item: ProductModel;
  children?: React.ReactNode;
}

function AdminProductMenuListItem({
  removeItemFromList,
  item,
}: AdminProductMenuListItemProps) {

  const [showingIcon, setshowingIcon] = useState<IconDefinition>(faPencil);
  const [showingDeleteIcon, setShowingDeleteIcon] = useState<IconDefinition>(faTrash);

  async function handleDeleteItemCode(item: ProductModel) {

    // Copy the text inside the text field
    try {

      setTimeout(async () => {

        const confirmed = window.confirm(`Confirma a exclusão do tipo de produto "${item.name}"?`)
        // setshowingIcon(faCheckCircle);
        if (confirmed) {

          const deleted = await ProductServiceInstance.deleteProduct(item);

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

  function handleCopyItemCode() {

    // Copy the text inside the text field
    try {

      // setshowingIcon(faCheckCircle);
      setTimeout(() => {
        window.location.href = '/admin?action=edit&collection=product&id=' + item.id;
      }, 100);
      setTimeout(() => {
        setshowingIcon(faPencil);
      }, 1000);

    } catch (error) {

      setshowingIcon(faX);

    }

  }

  return (
    <div className="AdminProductMenuListItemContainer glowBox" onClick={event => handleCopyItemCode()}>
      <div id='copyIcon' style={{ color: (showingIcon === faPencil ? `inherit` : (showingIcon === faX ? `red` : `green`)), justifySelf: `flex-end`, marginRight: `2em`, marginTop: `2em` }} >
        <FontAwesomeIcon
          icon={showingIcon}
        />
      </div>
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
      {/* <p id='item.id'>
        <span>Código do produto: </span>
        {item.id}
      </p> */}
      <div className='row'>
        <div className='itemImageContainer'>
          {typeof item.image_url !== 'undefined' ? 'Imagem ilustrativa' : 'Sem imagem'}
          <img draggable={false} className='itemImage' src={item.image_url || './no-image.png'} about={typeof item.image_url !== 'undefined' ? 'Imagem ilustrativa' : 'Sem imagem'} title={typeof item.image_url !== 'undefined' ? 'Imagem ilustrativa' : 'Sem imagem'} alt={typeof item.image_url !== 'undefined' ? 'Imagem ilustrativa' : 'Sem imagem'} />
        </div>
        <div className='column'>
          <div>
            <p id='itemPrice' className='itemPrice'>
              {/* <span>Promoção por tempo limitado!</span>
              <br/> */}
              {` R$ ` + item.price.toFixed(2).replace('.', ',')}
            </p>
          </div>
        </div>
      </div>
      <div className='row' style={{ width: `100%` }}>
        <div>
          <p id='itemDescription' className='itemDescription'>
            <span>Descrição: </span>
            {item.description}
          </p>
        </div>
      </div>
    </div>
  );
}

export default AdminProductMenuListItem;
