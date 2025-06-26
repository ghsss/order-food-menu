import AdditionalProductModel from "../models/AdditionalProduct";
import AccessCodeServiceInstance from "./AccessCodeService";

const AdditionalProductEndpoint =
  process.env.REACT_APP_PRODUCT_ENDPOINT || "http://localhost:3000";

const accessCodeSHA512Hash =
  AccessCodeServiceInstance.getStoredAccessCode() || ``;

class AdditionalProductService {
  async getAdditionalProducts() {
    try {
      const response = await fetch(AdditionalProductEndpoint + "/api/additionalProduct", {
        headers: {
          'ngrok-skip-browser-warning': 'true'
        }
      });
      if (response.status === 200) {
        const jsonResponse = await response.json();
        console.log("getAdditionalProducts.jsonResponse: ", jsonResponse);
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

  async upsertAdditionalProduct(additionalProduct: AdditionalProductModel) {
    try {
      const response = await fetch(AdditionalProductEndpoint + "/api/additionalProduct", {
        method: `PUT`,
        headers: {
          "Content-Type": "application/json",
          accessCodeSHA512Hash: accessCodeSHA512Hash,
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify(additionalProduct),
      });
      if (response.status === 200) {
        const additionalProduct_Id = await response.text();
        console.log("upsertAdditionalProduct.additionalProduct_Id: ", additionalProduct_Id);
        return additionalProduct_Id;
      } else {
        if (response.status === 400) {
          // Product type does not exists.
          const productTypeDoesntExist =
            (await response.json()).message.indexOf(
              `Some product type does not exists.`
            ) === 0;
          if (productTypeDoesntExist) {
            window.alert("Algum tipo de produto selecionado não existe.");
            return;
          } else {
            window.alert("Erro ao criar produto.");
            return;
          }
        }
      }
    } catch (error) {
      window.alert("Erro de conexão ao servidor.");
    }
  }

  async deleteAdditionalProduct(
    additionalProduct: AdditionalProductModel,
    retries?: number
  ): Promise<boolean> {
    if (!retries) {
      retries = 0;
    }
    try {
      const response = await fetch(AdditionalProductEndpoint + "/api/additionalProduct", {
        method: `DELETE`,
        headers: {
          "Content-Type": "application/json",
          additionalProductId: retries === 0 ? additionalProduct.id : additionalProduct._id || ``,
          accessCodeSHA512Hash: accessCodeSHA512Hash,
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify(additionalProduct),
      }).catch((err) => {
        return err.response;
      });
      console.log("response.status: ", response.status);
      if (response.status === 200) {
        const booleanTxt = await response.text();
        console.log("deleteAdditionalProduct.booleanTxt: ", booleanTxt);
        return booleanTxt === "true";
      } else {
        if (retries === 1) {
          if (response.status === 400) {
            const errorMsg = (await response.json()).message;
            console.log("errorMsg: ", errorMsg);
            window.alert(
              "Erro ao deletar produto. Verifique os dados e tente novamente."
            );
            // return;
            return false;
          }
          window.alert("Erro de conexão ao servidor.");
          return false;
        }
        retries += 1;
        return await this.deleteAdditionalProduct(additionalProduct, retries);
      }
    } catch (error) {
      if (retries === 1) {
        window.alert("Erro de conexão ao servidor.");
        return false;
        // return;
      }
      retries += 1;
      return await this.deleteAdditionalProduct(additionalProduct, retries);
    }
  }
}

const AdditionalProductServiceInstance = new AdditionalProductService();

export default AdditionalProductServiceInstance as AdditionalProductService;
