import React, { Dispatch, SetStateAction, useState } from 'react';
import './styles/ProductMenuListItem.css';
import ProductModel from '../../../models/Product';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { icon,  } from '@fortawesome/fontawesome-svg-core';
import { faCheckCircle, faCopy, faX, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import RobotModel from '../../../models/Robot';

interface ProductMenuListItemProps {
  handleItemClick: (item: ProductModel, setshowingIcon: Dispatch<SetStateAction<IconDefinition>>) => void,
  item: ProductModel;
  robot: RobotModel;
  children?: React.ReactNode;
}

function ProductMenuListItem({
  handleItemClick,
  item,
  robot,
}: ProductMenuListItemProps) {

  const [showingIcon, setshowingIcon] = useState<IconDefinition>(faCopy);

  function handleCopyItemCode() {

    // Copy the text inside the text field
    try {

      navigator.clipboard.writeText(item.id);
      setshowingIcon(faCheckCircle);
      setTimeout(() => {
        window.location.href = `https://wa.me/${robot.phone}?text=${item.id}`;
      }, 100);
      setTimeout(() => {
        setshowingIcon(faCopy);
      }, 1000);

    } catch (error) {

      setshowingIcon(faX);

    }

  }

  return (
    <div className="ProductMenuListItemContainer glowBox" onClick={event => handleItemClick(item, setshowingIcon)}>
      <div id='copyIcon' style={{ color: (showingIcon === faCopy ? `inherit` : (showingIcon === faX ? `red` : `green`)), justifySelf: `flex-end`, marginRight: `2em`, marginTop: `2em` }} >
        <FontAwesomeIcon
          icon={showingIcon}
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

export default ProductMenuListItem;
