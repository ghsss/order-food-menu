import React, { useState } from 'react';
import './styles/ProductMenuListItem.css';
import ProductModel from '../../../models/Product';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { icon,  } from '@fortawesome/fontawesome-svg-core';
import { faCheckCircle, faCopy, faX, IconDefinition } from '@fortawesome/free-solid-svg-icons';

interface ProductMenuListItemProps {
  item: ProductModel
  children?: React.ReactNode;
}

function ProductMenuListItem({
  item,
}: ProductMenuListItemProps) {
  
  const [showingIcon, setshowingIcon] = useState<IconDefinition>(faCopy);

  function handleCopyItemCode() {

    // Copy the text inside the text field
    try {

      navigator.clipboard.writeText(item.id);
      setshowingIcon(faCheckCircle);
      setTimeout(() => {
        setshowingIcon(faCopy);
      }, 1000);
      
    } catch (error) {
      
      setshowingIcon(faX);

    }

  }

  return (
    <div className="ProductMenuListItemContainer" onClick={event => handleCopyItemCode()}>
      <div id='copyIcon' style={{ color: (showingIcon === faCopy? `inherit` : (showingIcon === faX? `red` : `green`)), justifySelf: `flex-end`, marginRight: `2em`, marginTop: `2em` }} >
        <FontAwesomeIcon
          icon={showingIcon}
        />
      </div>
      <p id='item.name'>
        <span>⭐ </span>
        {item.name}
      </p>
      <p id='item.id'>
        <span>Código do produto: </span>
        {item.id}
      </p>
      <div className='row'>
        <div className='itemImageContainer'>
          Imagem ilustrativa
          <img className='itemImage' src={item.image_url} about='Imagem ilustrativa' title='Imagem ilustrativa' alt="Imagem ilustrativa" />
        </div>
        <div className='column'>
          <div>
            <p id='itemPrice' className='itemPrice'>
              <span>R$ </span>
              {item.price.toFixed(2).replace('.', ',')}
            </p>
          </div>
          <div>
            <p id='itemDescription' className='itemDescription'>
              <span>Descrição: </span>
              {item.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductMenuListItem;
