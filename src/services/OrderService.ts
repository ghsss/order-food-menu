import OrderModel from "../models/Order";
import AccessCodeServiceInstance from "./AccessCodeService";

const productEndpoint =
  process.env.REACT_APP_PRODUCT_ENDPOINT || "http://localhost:3000";

const accessCodeSHA512Hash =
  AccessCodeServiceInstance.getStoredAccessCode() || ``;

class OrderService {
  async getTodayOrders(): Promise<OrderModel[] | undefined> {
    try {
      const response = await fetch(productEndpoint + "/api/order/today", {
        method: `GET`,
        headers: {
          "Content-Type": "application/json",
          accessCodeSHA512Hash: accessCodeSHA512Hash,
          'ngrok-skip-browser-warning': 'true'
        },
      });
      if (response.status === 200) {
        const jsonResponse = await response.json();
        console.log("getOrders.jsonResponse: ", jsonResponse);
        return jsonResponse;
      } else {
        window.alert("Erro de conexão ao servidor.");
      }
    } catch (error) {
      window.alert("Erro de conexão ao servidor.");
    }
  }
  async getOrders(): Promise<OrderModel[] | undefined> {
    try {
      const response = await fetch(productEndpoint + "/api/order", {
        method: `GET`,
        headers: {
          "Content-Type": "application/json",
          accessCodeSHA512Hash: accessCodeSHA512Hash,
          'ngrok-skip-browser-warning': 'true'
        },
      });
      if (response.status === 200) {
        const jsonResponse = await response.json();
        console.log("getOrders.jsonResponse: ", jsonResponse);
        return jsonResponse;
      } else {
        window.alert("Erro de conexão ao servidor.");
      }
    } catch (error) {
      window.alert("Erro de conexão ao servidor.");
    }
  }
  async finishOrder(orderId: string) {
    try {
      const response = await fetch(productEndpoint + "/api/order/finish", {
        method: `PATCH`,
        headers: {
          "Content-Type": "application/json",
          accessCodeSHA512Hash: accessCodeSHA512Hash,
          orderId: orderId,
          'ngrok-skip-browser-warning': 'true'
        },
      });
      if (response.status === 200) {
        const txtResponse = await response.text();
        console.log("finishOrder.txtResponse: ", txtResponse);
        return txtResponse;
      } else {
        window.alert("Erro de conexão ao servidor.");
      }
    } catch (error) {
      window.alert("Erro de conexão ao servidor.");
    }
  }
  async confirmPayment(orderId: string) {
    try {
      const response = await fetch(productEndpoint + "/api/order/confirmPayment", {
        method: `PATCH`,
        headers: {
          "Content-Type": "application/json",
          accessCodeSHA512Hash: accessCodeSHA512Hash,
          orderId: orderId,
          'ngrok-skip-browser-warning': 'true'
        },
      });
      if (response.status === 200) {
        const txtResponse = await response.text();
        console.log("finishOrder.txtResponse: ", txtResponse);
        return txtResponse;
      } else {
        window.alert("Erro de conexão ao servidor.");
      }
    } catch (error) {
      window.alert("Erro de conexão ao servidor.");
    }
  }
}

const OrderServiceInstance = new OrderService();

export default OrderServiceInstance as OrderService;
