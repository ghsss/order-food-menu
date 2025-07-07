import OrderModel from "../models/Order";

class CartService {
  getStoredCart(): OrderModel | undefined {
    if (document.cookie) {
      console.log("document.cookie", document.cookie);
      if (document.cookie.includes("cart=")) {
        const cart = document?.cookie?.split(`cart=`)[1].split(`;`)[0];
        console.log("document.cookie cart", cart);
        return JSON.parse(cart);
      } else {
        const newCart = this.newCart();
        // document.cookie = "cart=;expires=;path=/;";
        const now = new Date();
        now.setTime(now.getTime() + 1000 * 60 * 60 * 24);
        document.cookie =
          "cart=" + newCart + ";expires=" + now.getUTCDate() + ";path=/;";
        return this.getStoredCart();
      }
    } else {
      const newCart = this.newCart();
      const newCartStr = JSON.stringify(newCart);
      //   document.cookie = "cart=;expires=;path=/;";
      const now = new Date();
      now.setTime(now.getTime() + 1000 * 60 * 60 * 24);
      document.cookie +=
        "cart=" + newCartStr + ";expires=" + now.getUTCDate() + ";path=/;";
      return this.getStoredCart();
    }
  }

  updateStoredCart(cartUpdated: OrderModel) {
    if (document.cookie) {
      console.log("document.cookie", document.cookie);
      if (document.cookie.includes("cart=")) {
        const cart = document?.cookie?.split(`cart=`)[1].split(`;`)[0];
        console.log("document.cookie cart", cart);
        // return JSON.parse(cart);
        const newCart = cartUpdated;
        const newCartStr = JSON.stringify(newCart);
        const now = new Date();
        now.setTime(now.getTime() + 1000 * 60 * 60 * 24);
        document.cookie =
          "cart=" + newCartStr + ";expires=" + now.getUTCDate() + ";path=/;";
      } else {
        const newCart = cartUpdated;
        const newCartStr = JSON.stringify(newCart);

        // document.cookie = "cart=;expires=;path=/;";
        const now = new Date();
        now.setTime(now.getTime() + 1000 * 60 * 60 * 24);
        document.cookie +=
          "cart=" + newCartStr + ";expires=" + now.getUTCDate() + ";path=/;";
        // return this.getStoredCart();
      }
    } else {
      const newCart = cartUpdated;
      const newCartStr = JSON.stringify(newCart);
      //   document.cookie = "cart=;expires=;path=/;";
      const now = new Date();
      now.setTime(now.getTime() + 1000 * 60 * 60 * 24);
      document.cookie =
        "cart=" + newCartStr + ";expires=" + now.getUTCDate() + ";path=/;";
      // return this.getStoredCart();
    }
  }

  newCart(): OrderModel {

    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 30);
    expiresAt.setSeconds(expiresAt.getSeconds() + 1);

    const newCartRef: OrderModel = {
      orderNumber: 0,
      paymentId: crypto.randomUUID(),
      paymentStatus: "pending",
      receivedPaymentInLocal: false,
      paymentGateway: "Retirada",
      chatId: "",
      //   customerFormattedNumber: "+55 54 9695-3402",
      customerFormattedNumber: "",
      paymentAmount: 74.97,
      companyNotified: false,
      customerNotified: false,
      paymentMethod: {
        id: "PIX",
        name: "PIX",
        isOnlinePayment: true,
      },
      items: [
        // {
        //     "id": "Cachorro Quente Grande",
        //     "name": "Cachorro Quente Grande 🌭😋",
        //     "qty": 2,
        //     "price": 22.99,
        //     "additionalProducts": [
        //         {
        //             "id": "Cheddar 🧀",
        //             "name": "Cheddar 🧀",
        //             "qty": 2,
        //             "price": 2,
        //             "_id": "685cb75f071e986c48460625"
        //         }
        //     ],
        //     "obs": "N",
        //     "_id": "685cb75f071e986c48460624"
        // },
      ],
      pixRequest: {
        transaction_amount: 0,
        description: "Pagamento de lanche",
        payment_method_id: "pix",
        date_of_expiration: expiresAt.toISOString(),
        payer: {
          identification: {
            type: "CPF",
            number: "",
          },
          email: ".",
        },
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    return newCartRef;
  }
}

const CartServiceInstance = new CartService();

export default CartServiceInstance;
