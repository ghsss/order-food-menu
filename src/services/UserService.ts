import UserModel from "../models/User";
import AccessCodeServiceInstance from "./AccessCodeService";

const productEndpoint =
  process.env.REACT_APP_PRODUCT_ENDPOINT || "http://localhost:3000";

class UserService {
  
  static accessCodeSHA512Hash =
    AccessCodeServiceInstance.getStoredAccessCode() || ``;

  async getUsers() {
    try {
      const response = await fetch(productEndpoint + "/api/user", {
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      });
      if (response.status === 200) {
        const jsonResponse = await response.json();
        console.log("getUsers.jsonResponse: ", jsonResponse);
        return jsonResponse;
      } else {
        window.alert("Erro de conexão ao servidor.");
        window.close();
      }
    } catch (error) {
      window.alert("Erro de conexão ao servidor.");
      window.close();
    }
  }

  async upsertUser(user: UserModel) {
    try {
      const response = await fetch(productEndpoint + "/api/user", {
        method: `PUT`,
        headers: {
          "Content-Type": "application/json",
          accessCodeSHA512Hash: UserService.accessCodeSHA512Hash,
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify(user),
      });
      if (response.status === 200) {
        const user_Id = await response.text();
        // console.log("getUsers.User_Id: ", user_Id);
        return user_Id;
      } else {
        window.alert("Erro de conexão ao servidor.");
        window.close();
      }
    } catch (error) {
      window.alert("Erro de conexão ao servidor.");
      window.close();
    }
  }

  async deleteUser(user: UserModel, retries?: number): Promise<boolean> {
    if (!retries) {
      retries = 0;
    }
    try {
      const response = await fetch(productEndpoint + "/api/user", {
        method: `DELETE`,
        headers: {
          "Content-Type": "application/json",
          userId: retries === 0 ? user.phoneNumber : user._id || ``,
          accessCodeSHA512Hash: UserService.accessCodeSHA512Hash,
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify(user),
      }).catch((err) => {
        return err.response;
      });
      // console.log("response.status: ", response.status);
      if (response.status === 200) {
        const booleanTxt = await response.text();
        console.log("deleteUser.booleanTxt: ", booleanTxt);
        return booleanTxt === "true";
      } else {
        if (retries === 1) {
          const isLinkedToProduct =
            (await response.json()).message.indexOf(
              `Product type is linked to a product.`
            ) === 0;
          console.log("isLinkedToProduct: ", isLinkedToProduct);
          if (response.status === 400 && isLinkedToProduct) {
            window.alert(
              "Tipo de produto está vinculado a um ou mais produtos. Não é possível deletar. Delete os produtos vinculados primeiro."
            );
            // return;
            return false;
          }
          window.alert("Erro de conexão ao servidor.");
          return false;
        }
        retries += 1;
        return await this.deleteUser(user, retries);
      }
    } catch (error) {
      if (retries === 1) {
        window.alert("Erro de conexão ao servidor.");
        return false;
        // return;
      }
      retries += 1;
      return await this.deleteUser(user, retries);
    }
  }
}

const UserServiceInstance = new UserService();

export default UserServiceInstance as UserService;
