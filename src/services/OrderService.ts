import OrderModel from "../models/Order";
import AccessCodeServiceInstance from "./AccessCodeService";

const productEndpoint =
  process.env.REACT_APP_PRODUCT_ENDPOINT || "http://localhost:3000";

class OrderService {
  
  static accessCodeSHA512Hash =
    AccessCodeServiceInstance.getStoredAccessCode() || ``;

  async getTodayOrders(): Promise<OrderModel[] | undefined> {
    try {
      const response = await fetch(productEndpoint + "/api/order/today", {
        method: `GET`,
        headers: {
          "Content-Type": "application/json",
          accessCodeSHA512Hash: OrderService.accessCodeSHA512Hash,
          "ngrok-skip-browser-warning": "true",
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
  async getCustomerOrders(): Promise<OrderModel[] | undefined> {
    try {
      const response = await fetch(productEndpoint + "/api/order/customer", {
        method: `GET`,
        headers: {
          "Content-Type": "application/json",
          accessCodeSHA512Hash: OrderService.accessCodeSHA512Hash,
          "ngrok-skip-browser-warning": "true",
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
          accessCodeSHA512Hash: OrderService.accessCodeSHA512Hash,
          "ngrok-skip-browser-warning": "true",
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
  async getOrderBy_Id(orderId: string) {
    try {
      const response = await fetch(productEndpoint + "/api/order/_id", {
        method: `GET`,
        headers: {
          "Content-Type": "application/json",
          accessCodeSHA512Hash: OrderService.accessCodeSHA512Hash,
          orderId: orderId,
          "ngrok-skip-browser-warning": "true",
        },
      });
      if (response.status === 200) {
        const jsonResponse = await response.json();
        console.log("getOrderBy_Id.jsonResponse: ", jsonResponse);
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
          accessCodeSHA512Hash: OrderService.accessCodeSHA512Hash,
          orderId: orderId,
          "ngrok-skip-browser-warning": "true",
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
      const response = await fetch(
        productEndpoint + "/api/order/confirmPayment",
        {
          method: `PATCH`,
          headers: {
            "Content-Type": "application/json",
            accessCodeSHA512Hash: OrderService.accessCodeSHA512Hash,
            orderId: orderId,
            "ngrok-skip-browser-warning": "true",
          },
        }
      );
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
  async newOrder(order: OrderModel) {
    try {
      for (const orderItem of order.items) {
        if (orderItem.obs.length === 0) {
          orderItem.obs = `COMPLETO`;
        }
      }
      const response = await fetch(productEndpoint + "/api/order", {
        method: `POST`,
        body: JSON.stringify(order),
        headers: {
          "Content-Type": "application/json",
          accessCodeSHA512Hash: OrderService.accessCodeSHA512Hash,
          "ngrok-skip-browser-warning": "true",
        },
      });
      if (response.status === 201) {
        const jsonResponse = await response.json();
        console.log("newOrder.jsonResponse: ", jsonResponse);
        return jsonResponse;
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
