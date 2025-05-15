import React, { useEffect, useState } from 'react';
import './styles/AdminOrderMenuListItem.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { icon,  } from '@fortawesome/fontawesome-svg-core';
import { faCheckCircle, faCheckSquare, faPrint, faRefresh, faTruck, faX, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import OrderModel from '../../../models/Order';
import OrderServiceInstance from '../../../services/OrderService';
import CompanyServiceInstance from '../../../services/CompanyService';
// import OrderServiceInstance from '../../../services/OrderService';

interface AdminOrderMenuListItemProps {
  // removeItemFromList: (item: OrderModel) => boolean,
  item: OrderModel;
  children?: React.ReactNode;
}

function AdminOrderMenuListItem({
  item,
  children
}: AdminOrderMenuListItemProps) {


  async function printOrderReceipt(order: OrderModel) {

    try { // Request Bluetooth Device 

      const getAvailability = await navigator.bluetooth.getAvailability();

      console.log('getAvailability: ', getAvailability);

      if (!getAvailability) {
        alert('Bluetooth indisponível, verifique se o bluetooth do dispositivo está ligado.');
      }

      console.log('printerDevice?.gatt?.connected: ', printerDevice?.gatt?.connected);

      if (!printerDevice?.gatt?.connected) {

        if (!printerDevice?.gatt) {

          const device = await navigator.bluetooth.requestDevice({ filters: [{ services: ['e7810a71-73ae-499d-8c15-faa9aef0c3f2'] }], optionalServices: ['e7810a71-73ae-499d-8c15-faa9aef0c3f2'] });
          setPrinterDevice(device);
          const confirmed = window.confirm(`Confirma a impressão do pedido "${item.orderNumber}" ? `)

          if (!confirmed) {
            alert('Impressão cancelada.');
            return;
          }

        }

        await printerDevice?.gatt?.connect().catch(err => {
          // alert();
          setPrinterDevice(null);
          throw Error(`Erro ao conectar a impressora.

Por favor tente novamente.`);
        });

      }

      if (printerDevice === null || !printerDevice.gatt?.connected) {
        throw Error(`Erro ao conectar a impressora.

Por favor tente novamente.`);
      }

      const server = printerDevice.gatt;

      // Connect to the device
      const service = await server?.getPrimaryService('e7810a71-73ae-499d-8c15-faa9aef0c3f2');

      const characteristic = await service?.getCharacteristic('bef8d6c9-9c21-4c9e-b632-bd58c1009f9f');

      // Receipt data (ESC/POS Commands)
      const encoder = new TextEncoder();

      const printHeader = async () => {

        function displayCNPJ(cnpj: string) {
          return cnpj.substring(0, 2) + '.' + cnpj.substring(2, 5) + '.' + + cnpj.substring(5, 8) + '/' + cnpj.substring(8, 12) + '-' + cnpj.substring(12, 14);
        }

        const company = await CompanyServiceInstance.getCompany();

        const headerData = encoder.encode(`\x1B\x61\x01 - INICIO -

\x1B\x40${company?.name}
${company?.cnpj ? `\x1B\x40CNPJ: ${displayCNPJ(company?.cnpj)}` : '\r'}
${company?.phoneNumber ? `\x1B\x40TELEFONE: ${company?.phoneNumber}` : '\r'}

\x1B\x40PEDIDO:
\x1B\x61\x01\x1B\x4D\x02${item.orderNumber}
TOTAL: \x1B\x61\x01R$ ${item.paymentAmount}
\x1B\x40ITENS:`);
        await characteristic?.writeValue(headerData);

      }
      const printBody = async () => {
        for await (const orderItem of item.items) {
          const orderItemIdx = item.items.indexOf(orderItem);
          const orderItemTxt = orderItemIdx === 0 ? `
\x1B\x61\x01\x1B\x4D\x00-------------------------------
\x1B\x40\x1B\x4D\x01${orderItem.qty}x ${orderItem.name.replace(
            /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g,
            ''
          )
              .replace(/\s+/g, ' ')
              .trim()} | OBS: ${orderItem.obs} | Valor: R$ ${orderItem.price.toFixed(2).replace('.', ',')} (Uni) | Subtotal: R$ ${(orderItem.qty * orderItem.price).toFixed(2).replace('.', ',')}
\x1B\x61\x01\x1B\x4D\x00-------------------------------`
            :
            `\x1B\x40\x1B\x4D\x01${orderItem.qty}x ${orderItem.name.replace(
              /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g,
              ''
            )
              .replace(/\s+/g, ' ')
              .trim()} | OBS: ${orderItem.obs} | Valor: R$ ${orderItem.price.toFixed(2).replace('.', ',')} (Uni) | Subtotal: R$ ${(orderItem.qty * orderItem.price).toFixed(2).replace('.', ',')}
\x1B\x61\x01\x1B\x4D\x00-------------------------------`
          // return orderItemTxt;
          const orderItemData = encoder.encode(orderItemTxt);
          await characteristic?.writeValue(orderItemData);
        }
      }
      const printFooter = async () => {

        const footerData = encoder.encode(`
\x1B\x61\x01${new Date().toLocaleString('pt-BR')}
\n\x1B\x61\x01 - FIM -
\n\x1B\x64\x02`);
        await characteristic?.writeValue(footerData);

      }

      await printHeader();
      await printBody();
      await printFooter();

      // const receiptDate = encoder.encode("\x1B" + new Date().toLocaleString('pt-BR') + "\n\x1B\x64\x02\x1D\x56\x41");

    } catch (error) {
      console.error('Error:', error);
      if (error instanceof Error) {
        console.error('Failed to print receipt: ' + error.message);
        throw Error(error.message);
      }
    }

  }

  function getIconByPaymentStatus(paymentStatus: string): IconDefinition {
    return paymentStatus === 'approved' ? faTruck : paymentStatus === 'finished' ? faCheckCircle : paymentStatus === 'pending' ? faRefresh : faX;
  }

  const [showingIcon, setshowingIcon] = useState<IconDefinition>(getIconByPaymentStatus(item.paymentStatus));
  const [showingPrintIcon, setshowingPrintIcon] = useState<IconDefinition>(faPrint);
  const [printerDevice, setPrinterDevice] = useState<BluetoothDevice | null>(null);

  useEffect(() => {

    console.log('Printer device: ', printerDevice);

  }, [printerDevice]);

  useEffect(() => {

    setshowingIcon(getIconByPaymentStatus(item.paymentStatus));

  }, [item.paymentStatus, item.customerNotified]);

  async function handleCopyItemCode(item: OrderModel) {

    // Copy the text inside the text field
    try {

      setTimeout(async () => {

        if (item.paymentStatus !== 'approved') {
          window.alert('Só é possível finalizar pedidos em produção, onde o pagamento foi aprovado.');
          return;
        }

        const confirmed = window.confirm(`Confirma a finalização do pedido N°: "${item.orderNumber}" ? `)
        // setshowingIcon(faCheckCircle);
        if (confirmed && item.orderNumber && item._id && item.paymentStatus === 'approved') {

          const finishedOrderId = await OrderServiceInstance.finishOrder(item._id);

          if (finishedOrderId === item._id) {

            setshowingIcon(faCheckCircle);
            setTimeout(() => {

              window.alert('Pedido finalizado com sucesso.');

              item.paymentStatus = 'finished';
              item.customerNotified = false;
              item.companyNotified = false;

              setshowingIcon(getIconByPaymentStatus(item.paymentStatus));
              // window.location.href = '/admin?action=list&collection=productType';
            }, 50);
            // REMOVE ITEM FROM LIST

            // window.location.href = '/admin?action=list&collection=productType';
          }
          else {
            // window.alert(`Erro ao excluir tipo de produto.`);
          }

        } else {
          if (confirmed) {
            window.alert('Só é possível finalizar pedidos em produção, onde o pagamento foi aprovado.');
          }
        }

      }, 50);

    } catch (error) {

      setshowingIcon(faX);

    }

  }

  async function handlePrintItem(item: OrderModel) {

    // Copy the text inside the text field
    try {

      setTimeout(async () => {

        const confirmed = window.confirm(`Confirma a impressão do pedido "${item.orderNumber}" ? `)
        // setshowingIcon(faCheckCircle);
        if (confirmed) {

          await printOrderReceipt(item)
            .then(() => {

              setshowingPrintIcon(faCheckCircle);
              setTimeout(() => {
                // removeItemFromList(item);
                window.alert('Impressão finalizada com sucesso.');
                setshowingPrintIcon(showingPrintIcon);
                // window.location.href = '/admin?action=list&collection=Order';
              }, 50);

            }).catch(err => {
              alert('Erro ao imprimir pedido: ' + err.toString());
            });

        }

      }, 50);

    } catch (error) {

      setshowingPrintIcon(faX);

    }

  }

  function getPaymentStatusLabel(paymentStatus: string): string {
    const labels: { [index: string]: any } = { "pending": 'PAGAMENTO PENDENTE ❌', 'approved': 'PAGAMENTO APROVADO! ✅', 'finished': 'PAGAMENTO APROVADO! ✅ (PEDIDO FINALIZADO)', 'expired': 'PAGAMENTO EXPIROU ❌' };
    return labels[paymentStatus];
  }

  function getOrderStatusLabel(paymentStatus: string): string {
    const labels: { [index: string]: any } = { "pending": 'AGUARDANDO PAGAMENTO ...', 'approved': 'EM PRODUÇÃO 🔥', 'finished': 'CONCLUÍDO ✅', 'expired': 'CANCELADO ❌' };
    return labels[paymentStatus];
  }

  function getCustomerNotifiedIcon(customerNotified: boolean): IconDefinition {
    return customerNotified === true ? faCheckSquare : faRefresh;
  }
  function getCustomerNotifiedIconClassName(customerNotified: boolean): string {
    return customerNotified === true ? `` : 'rotateRefresh';
  }
  function getCustomerNotifiedIconColor(customerNotified: boolean): string {
    return customerNotified === true ? `green` : 'rgb(182, 182, 182)';
  }

  return (
    <div className="OrderMenuListItemContainer glowBox" onClick={event => handleCopyItemCode(item)}>
      <div className={showingIcon === faTruck ? 'moveCar copyIcon' : showingIcon === faRefresh ? `rotateRefreshBig copyIcon` : 'copyIcon'} style={{ color: (showingIcon === faTruck || showingIcon === faRefresh ? `inherit` : (showingIcon === faX ? `red` : `green`)), justifySelf: `flex - end`, marginRight: `2em`, marginTop: `2em` }} >
        <FontAwesomeIcon
          icon={showingIcon}
        />
      </div>
      {/* {children} */}
      <div id='printIcon' style={{
        color: (showingPrintIcon === faPrint ? `${printerDevice?.gatt?.connected ? `blue` : `grey`}` : (showingPrintIcon === faX ? `red` : `grey`)),
        justifySelf: `flex-end`, marginRight: `2em`, marginTop: `2em`,
        zIndex: `100`
      }}
        onClick={async e => {
          e.stopPropagation();
          await handlePrintItem(item);
        }}
      >
        <FontAwesomeIcon
          icon={showingPrintIcon}
        />
      </div>
      <p id='itemName' className='itemName scalingAnimation'>
        <span>⭐ Pedido N°: </span>
        {item.orderNumber}
      </p>
      <div className='orderHeader'>
        <p id='itemCustomer'>
          <span>Cliente: </span>
          {item.customerFormattedNumber}
        </p>
        <p id='itemStatus'>
          <span>Status do pedido: </span>
          {getOrderStatusLabel(item.paymentStatus)}
          {item.paymentStatus === 'pending' ?
            <FontAwesomeIcon className='rotateRefresh' color='rgb(182, 182, 182)' icon={faRefresh} />
            :
            <></>}
        </p>
        <p id='itemStatus'>
          <span>Valor total: </span>
          {`R$` + item.paymentAmount.toFixed(2).replace(`.`, `, `)}
        </p>
        <p id='itemPaymentMethod'>
          <span>Forma de pagamento: </span>
          {item.paymentMethod.name}
        </p>
        {
          item.paymentMethod.isOnlinePayment ?
            <p id='itemPaymentStatus'>
              <span>Status do pagamento: </span>
              {getPaymentStatusLabel(item.paymentStatus)}
            </p>
            :
            <></>
        }
        {
          item.paymentStatus === 'finished' || item.paymentStatus === 'approved' || item.paymentStatus === 'expired' ?
            <p id='itemCustomerNotified'>
              <span>Cliente avisado sobre status do pedido: </span>
              <FontAwesomeIcon icon={getCustomerNotifiedIcon(item.customerNotified)} color={getCustomerNotifiedIconColor(item.customerNotified)} className={getCustomerNotifiedIconClassName(item.customerNotified)} />
            </p>
            :
            <></>
        }
      </div>
      <div className="orderItemsContainer">
        <p className='orderItemsContainerHeader'>⭐ Produtos do pedido (<span>R$ {item.paymentAmount.toFixed(2).replace(`.`, `, `)}</span>)</p>
        <div className="orderItemsTableContainer">
          <table className='orderItemsTable'>
            <thead>
              <tr>
                <th colSpan={1}>
                  Unidades
                </th>
                <th colSpan={3}>
                  Produto
                </th>
                <th colSpan={2}>
                  Observação
                </th>
                <th colSpan={1}>
                  Preço unitário
                </th>
                <th colSpan={1}>
                  Subtotal
                </th>
              </tr>
            </thead>
            <tbody>
              {
                item.items.map((orderItem, orderItemIdx) => {
                  return (
                    // <div className="orderItemContainer">
                    //   <p style={{width: 'min-content'}}>{orderItem.qty} unidades</p>
                    //   <p>{orderItem.name}</p>
                    //   <p>OBS: {orderItem.obs}</p>
                    // </div>
                    <tr key={orderItemIdx}>
                      <td colSpan={1}>{orderItem.qty}</td>
                      <td colSpan={3}>{orderItem.name}</td>
                      <td colSpan={2}>{orderItem.obs}</td>
                      <td colSpan={1}>R$ {orderItem.price.toFixed(2).replace('.', ',')}</td>
                      <td colSpan={1}>R$ {(orderItem.qty * orderItem.price).toFixed(2).replace('.', ',')}</td>
                    </tr>
                  );
                })
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminOrderMenuListItem;
