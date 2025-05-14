import ProductTypeModel from "../models/ProductType";
import AccessCodeServiceInstance from "./AccessCodeService";

const productEndpoint =
  process.env.REACT_APP_PRODUCT_ENDPOINT || "http://localhost:3000";

const accessCodeSHA512Hash =
  AccessCodeServiceInstance.getStoredAccessCode() || ``;

class ProductTypeService {
  async getProductTypes() {
    try {
      const response = await fetch(productEndpoint + "/api/productType", {
        headers: {
          'ngrok-skip-browser-warning': 'true'
        }
      });
      if (response.status === 200) {
        const jsonResponse = await response.json();
        console.log("getProductTypes.jsonResponse: ", jsonResponse);
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

  async upsertProductType(productType: ProductTypeModel) {
    try {
      const response = await fetch(productEndpoint + "/api/productType", {
        method: `PUT`,
        headers: {
          "Content-Type": "application/json",
          accessCodeSHA512Hash: accessCodeSHA512Hash,
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify(productType),
      });
      if (response.status === 200) {
        const productType_Id = await response.text();
        console.log("getProductTypes.productType_Id: ", productType_Id);
        return productType_Id;
      } else {
        window.alert("Erro de conexão ao servidor.");
        window.close();
      }
    } catch (error) {
      window.alert("Erro de conexão ao servidor.");
      window.close();
    }
  }

  async deleteProductType(productType: ProductTypeModel, retries?: number): Promise<boolean> {
    if (!retries) {
      retries = 0;
    }
    try {
      const response = await fetch(productEndpoint + "/api/productType", {
        method: `DELETE`,
        headers: {
          "Content-Type": "application/json",
          productTypeId: retries === 0 ? productType.id : productType._id || ``,
          accessCodeSHA512Hash: accessCodeSHA512Hash,
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify(productType),
      }).catch(err => {
        return err.response;
      });
      console.log('response.status: ', response.status);
      if (response.status === 200) {
        const booleanTxt = await response.text();
        console.log("deleteProductType.booleanTxt: ", booleanTxt);
        return booleanTxt === 'true';
      } else {
        if (retries === 1) {
          const isLinkedToProduct = (await response.json()).message.indexOf(`Product type is linked to a product.`) === 0;
          console.log('isLinkedToProduct: ', isLinkedToProduct);
          if(response.status===400 && isLinkedToProduct){
            window.alert("Tipo de produto está vinculado a um ou mais produtos. Não é possível deletar. Delete os produtos vinculados primeiro.");
            // return;
            return false;
          } 
          window.alert("Erro de conexão ao servidor.");
          return false;
        }
        retries += 1;
        return await this.deleteProductType(productType, retries);
      }
    } catch (error) {
      if (retries === 1) {
        window.alert("Erro de conexão ao servidor.");
        return false;
        // return;
      }
      retries += 1;
      return await this.deleteProductType(productType, retries);
    }
  }
}

const ProductTypeServiceInstance = new ProductTypeService();

export default ProductTypeServiceInstance as ProductTypeService;
