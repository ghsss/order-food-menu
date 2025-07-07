import React, { Dispatch, SetStateAction } from 'react';
import './styles/ProductMenuList.css';
import ProductModel from '../../../models/Product';
import ProductMenuListItem from './ProductMenuListItem';
import RobotModel from '../../../models/Robot';
import { faCheck, faCheckCircle, faX, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface ProductMenuListProps {
  handleItemClick: (item: ProductModel, setshowingIcon: Dispatch<SetStateAction<IconDefinition>>) => void,
  companyIsOpenNow: boolean,
  productMenuItems: ProductModel[],
  robot: RobotModel,
  children?: React.ReactNode;
}

function ProductMenuList({ handleItemClick, companyIsOpenNow, productMenuItems, robot, children }: ProductMenuListProps) {

  return (
    <div className='ProductMenuListContainer'>
      {/* <div className='titles'> */}
      <h1 style={{fontSize: '1em', width: 'fit-content', marginLeft: '.75em', padding: '.5em'}} className={companyIsOpenNow === true ? 'scalingAnimation glowBox ' : ''}>
        <span style={{ color: '#000' }} className={companyIsOpenNow === true ? 'scalingAnimation ' : ''} >
          {companyIsOpenNow === true ? 'ABERTO' : 'FECHADO'} <FontAwesomeIcon fontSize={`1.25em`} color={companyIsOpenNow === true ? 'green' : 'red'} icon={companyIsOpenNow === true ? faCheckCircle : faX} />
        </span>
      </h1>
      {/* </div> */}
      <h2 id='listTitle' className='listTitle linkUnavailable'>🔥 Cardápio 🔥</h2>
      {children}
      <div id='listScroll' className='ProductMenuListContainerScroll'>
        <div className="ProductMenuList">
          {
            productMenuItems.length === 0 ?
              <p style={{ alignSelf: 'center', justifySelf: 'center', width: '100%' }}>Nenhum produto encontrado. Verifique sua pesquisa</p>
              :
              productMenuItems.map((productMenuItem) => {
                if (productMenuItem.stock > 0) {
                  return (
                    <ProductMenuListItem key={productMenuItem.id} handleItemClick={handleItemClick} robot={robot} item={productMenuItem} />
                  )
                } else {
                  return <></>
                }
              })
          }
        </div>
      </div>
    </div>
  );
}

export default ProductMenuList;
