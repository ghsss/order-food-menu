import ProductModel from "../models/Product";
import AccessCodeServiceInstance from "./AccessCodeService";

const productEndpoint =
  process.env.REACT_APP_PRODUCT_ENDPOINT || "http://localhost:3000";

  
  class ProductService {
  static accessCodeSHA512Hash =
    AccessCodeServiceInstance.getStoredAccessCode() || ``;
  async getProducts() {
    try {
      const response = await fetch(productEndpoint + "/api/product", {
        headers: {
          'ngrok-skip-browser-warning': 'true'
        }
      });
      if (response.status === 200) {
        const jsonResponse = await response.json();
        console.log("getProducts.jsonResponse: ", jsonResponse);
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

  async upsertProduct(product: ProductModel) {
    try {
      const response = await fetch(productEndpoint + "/api/product", {
        method: `PUT`,
        headers: {
          "Content-Type": "application/json",
          accessCodeSHA512Hash: ProductService.accessCodeSHA512Hash,
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify(product),
      });
      if (response.status === 200) {
        const product_Id = await response.text();
        console.log("upsertProduct.product_Id: ", product_Id);
        return product_Id;
      } else {
        if (response.status === 400) {
          // Product type does not exists.
          const productTypeDoesntExist =
            (await response.json()).message.indexOf(
              `Product type does not exists.`
            ) === 0;
          if (productTypeDoesntExist) {
            window.alert("Tipo de produto selecionado não existe.");
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

  async deleteProduct(
    product: ProductModel,
    retries?: number
  ): Promise<boolean> {
    if (!retries) {
      retries = 0;
    }
    try {
      const response = await fetch(productEndpoint + "/api/product", {
        method: `DELETE`,
        headers: {
          "Content-Type": "application/json",
          productId: retries === 0 ? product.id : product._id || ``,
          accessCodeSHA512Hash: ProductService.accessCodeSHA512Hash,
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify(product),
      }).catch((err) => {
        return err.response;
      });
      console.log("response.status: ", response.status);
      if (response.status === 200) {
        const booleanTxt = await response.text();
        console.log("deleteProduct.booleanTxt: ", booleanTxt);
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
        return await this.deleteProduct(product, retries);
      }
    } catch (error) {
      if (retries === 1) {
        window.alert("Erro de conexão ao servidor.");
        return false;
        // return;
      }
      retries += 1;
      return await this.deleteProduct(product, retries);
    }
  }
}

const ProductServiceInstance = new ProductService();

export default ProductServiceInstance as ProductService;
