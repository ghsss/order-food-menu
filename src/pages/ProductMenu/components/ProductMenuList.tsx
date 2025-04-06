import React from 'react';
import './styles/ProductMenuList.css';
import ProductModel from '../../../models/Product';
import ProductMenuListItem from './ProductMenuListItem';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface ProductMenuListProps {
  productMenuItems: ProductModel[],
  children?: React.ReactNode;
}

// const whatsAppQueryParams = encodeURIComponent('Olá!%20Gostaria%20de%20fazer%20um%20pedido.%20😁');;
const whatsAppQueryParams = encodeURIComponent('Olá! Gostaria de fazer um pedido.');;

function ProductMenuList({ productMenuItems }: ProductMenuListProps) {

  // const goToWhatsApp() {
  // href="https://api.whatsapp.com/send?phone=1111111111&text=Hi"
  // }

  // faWhatsapp

  return (
    <>
      <div className='row linksRow'>
        <a rel='noreferrer' target='_blank' href={"https://wa.me/555499026453?text=" + whatsAppQueryParams}>{`Ir para o WhatsApp`}
          <span style={{ marginLeft: `.5em` }}>
            <FontAwesomeIcon fontSize={`3em`} color='green' icon={faWhatsapp} />
          </span>
        </a>
        {/* <a href="https://wa.me/555499026453?text=Olá,%20Gostaria%20de%20fazer%20um%20pedido!">Fazer pedido pelo site</a> */}
      </div>
      <div className="ProductMenuListContainer">
        <h2 style={{color: `#000`, fontWeight: `bold`, fontSize: `2em`, textDecoration: 'underline', textDecorationColor: 'gold'}}>🔥 Cardápio Online 🔥</h2>
        {
          productMenuItems.map(productMenuItem => {
            return (
              <ProductMenuListItem item={productMenuItem} />
            )
          })
        }
      </div>
    </>
  );
}

export default ProductMenuList;
