import React from 'react';
import './styles/AdminOrderMenuList.css';
import AdminOrderMenuListItem from './AdminOrderMenuListItem';
import OrderModel from '../../../models/Order';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowCircleLeft, faCartShopping, faKey, faPhone } from '@fortawesome/free-solid-svg-icons';

interface AdminOrderMenuListProps {
  updateOrderFinished: (item: OrderModel) => boolean,
  updateOrderPaymentReceived: (item: OrderModel) => boolean,
  orderMenuItems: OrderModel[],
  children?: React.ReactNode;
}

// navigator.bluetooth.requestDevice({ filters: [{ services: ['battery_service'] }] })
// .then(device => device.gatt.connect())
// .then(server => {
//   // Getting Battery Service…
//   return server.getPrimaryService('battery_service');
// })
// .then(service => {
//   // Getting Battery Level Characteristic…
//   return service.getCharacteristic('battery_level');
// })
// .then(characteristic => {
//   // Reading Battery Level…
//   return characteristic.readValue();
// })
// .then(value => {
//   console.log(`Battery percentage is ${value.getUint8(0)}`);
// })
// .catch(error => { console.error(error); });

function AdminOrderMenuList({ updateOrderFinished, updateOrderPaymentReceived, orderMenuItems, children }: AdminOrderMenuListProps) {

  const totalSoldList = orderMenuItems.map(order => {
    return (order.paymentMethod.isOnlinePayment ? (order.paymentStatus === 'approved' || order.paymentStatus === 'finished')
      :
      order.receivedPaymentInLocal === true) === true ? order.paymentAmount : 0
    // return order.paymentAmount
  });

  const sumListItems = () => {
    let sum = 0;
    for (const totalSoldListItem of totalSoldList) {
      sum += totalSoldListItem;
    }
    return sum;
  }

  const totalSold = sumListItems();

  return (
    <div className='OrderMenuListContainer'>
      <div className='pageTabs'>
        <a href='/admin?action=list&collection=product#'>{`Voltar para produtos. `}<FontAwesomeIcon icon={faArrowCircleLeft} /><FontAwesomeIcon icon={faCartShopping} /></a>
      </div>
      <h2 className='listTitle linkUnavailable'>🔥 Pedidos do estabelecimento 🔥</h2>
      <h2 className='listTitle linkUnavailable'>Total em vendas: <span style={{ color: 'green' }}>R$ {totalSold.toFixed(2).replace('.', ',')}</span></h2>
      {children}
      <div className='OrderMenuListContainerScroll'>
        <div className="OrderMenuList">
          {
            orderMenuItems.length === 0 ?
              <p style={{ alignSelf: 'center', justifySelf: 'center', width: '100%' }}>Nenhum pedido encontrado. Verifique sua pesquisa.</p>
              :
              orderMenuItems.map(orderMenuItem => {
                return (
                  <AdminOrderMenuListItem key={orderMenuItem._id} updateOrderFinished={updateOrderFinished} updateOrderPaymentReceived={updateOrderPaymentReceived} item={orderMenuItem} />
                )
              })
          }
        </div>
      </div>
    </div>
  );
}

export default AdminOrderMenuList;
