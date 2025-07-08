export type OrderItemModel = {
  _id?: string;
  id: string;
  name: string;
  qty: number;
  price: number;
  additionalProducts?: {
    _id?: string;
    id: string;
    name: string;
    qty: number;
    price: number;
  }[];
  obs: string;
};

type PaymentMethodModel = {
  id: string;
  name: string;
  isOnlinePayment: boolean;
};

export type IdentificationModel = {
  type: string;
  number: string;
};

// id: string;
// chatId: string;
// name?: string;
// customerFormattedNumber: string;

type PayerModel = {
  _id?: string;
  email: string;
  identification: IdentificationModel;
};

type PixRequestModel = {
  _id?: string;
  transaction_amount: number;
  description: string;
  payment_method_id: string;
  date_of_expiration: string;
  payer: PayerModel;
}

type OrderModel = {
  orderNumber?: number;
  _id?: string;
  paymentId: string;
  paymentQRCode?: string;
  paymentQRCodeBase64DataURL?: string;
  paymentStatus: string;
  receivedPaymentInLocal: boolean;
  paymentGateway: string;
  paymentMethod: PaymentMethodModel;
  chatId: string;
  customerFormattedNumber: string;
  paymentAmount: number;
  items: OrderItemModel[];
  pixRequest: PixRequestModel;
  companyNotified: boolean;
  customerNotified: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export default OrderModel;

// {
//   "_id": {
//     "$oid": "67f1ed6b2e3a698d65528aa9"
//   },
//   "paymentId": "1322911982",
//   "paymentStatus": "expired",
//   "paymentGateway": "Mercado Pago",
//   "chatId": "555496953402@c.us",
//   "customerFormattedNumber": "+55 54 9695-3402",
//   "paymentAmount": 48,
//   "companyNotified": true,
//   "customerNotified": true,
//   "paymentMethod": {
//     "id": "PIX",
//     "name": "Pix 📲 (Online)",
//     "isOnlinePayment": true,
//     "_id": {
//       "$oid": "67f1ed6b2e3a698d65528aaa"
//     }
//   },
//   "items": [
//     {
//       "id": "X1",
//       "name": "Xis salada 🍔😋",
//       "qty": 2,
//       "price": 24,
//       "obs": "N",
//       "_id": {
//         "$oid": "67f1ed6b2e3a698d65528aab"
//       }
//     }
//   ],
//   "pixRequest": {
//     "transaction_amount": 48,
//     "description": "Pagamento de lanche",
//     "payment_method_id": "pix",
//     "date_of_expiration": {
//       "$date": "2025-04-06T03:26:24.687Z"
//     },
//     "payer": {
//       "email": "gabrielhsaldanha@gmail.com",
//       "identification": {
//         "type": "CPF",
//         "number": "03283120021"
//       },
//       "_id": {
//         "$oid": "67f1ed6b2e3a698d65528aad"
//       }
//     },
//     "_id": {
//       "$oid": "67f1ed6b2e3a698d65528aac"
//     }
//   },
//   "__v": 0
// }
