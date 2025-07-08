// import * as crypto from `crypto`;

import { createHash } from "crypto";
import { OperationCanceledException } from "typescript";
import UserModel from "../models/User";

const productEndpoint =
  process.env.REACT_APP_PRODUCT_ENDPOINT || "http://localhost:3000";

function sha512(str: string) {
  return crypto.subtle
    .digest("SHA-512", new TextEncoder().encode(str))
    .then((buf) => {
      return Array.prototype.map
        .call(new Uint8Array(buf), (x) => ("00" + x.toString(16)).slice(-2))
        .join("");
    });
}

class AccessCodeService {
  getStoredAccessCode(): string | undefined {
    if (document.cookie) {
      console.log("document.cookie", document.cookie);
      if (document.cookie.includes("accessCodeSHA512Hash=")) {
        const accessCode = document?.cookie
          ?.split(`accessCodeSHA512Hash=`)[1]
          .split(`;`)[0];
        console.log("document.cookie accessCode", accessCode);
        return accessCode;
      }
    }
  }

  getStoredPhone(): string | undefined {
    if (document.cookie) {
      console.log("document.cookie", document.cookie);
      if (document.cookie.includes("phone=")) {
        const phone = document?.cookie?.split(`phone=`)[1].split(`;`)[0];
        console.log("document.cookie phone", phone);
        return phone;
      }
    }
  }

  async getAdmins(): Promise<UserModel[]> {
    try {
      const accessCode = this.getStoredAccessCode();
      if (typeof accessCode === `undefined`) {
        window.location.href = `/`;
        return [];
      }
      const accessCodeSHA512Hash =
        accessCode.length > 100 ? accessCode : await sha512(accessCode);
      const response = await fetch(productEndpoint + "/api/user", {
        method: "GET",
        headers: {
          accessCodeSHA512Hash: accessCodeSHA512Hash,
          "ngrok-skip-browser-warning": "true",
        },
      });
      if (response.status === 200) {
        const jsonResponse = await response.json();
        console.log("grantSuperAdmin.jsonResponse: ", jsonResponse);
        return jsonResponse;
      } else {
        if (response.status === 401 || response.status === 403) {
          window.alert("Você não é um super-administrador.");
          return [];
        }
        window.alert("Erro de conexão ao servidor.");
        return [];
      }
    } catch (error) {
      window.alert("Erro de conexão ao servidor.");
      return [];
    }
  }
  async isSuperAdmin(): Promise<boolean> {
    try {
      const accessCode = this.getStoredAccessCode();
      if (typeof accessCode === `undefined`) {
        window.location.href = `/`;
        return false;
      }
      const accessCodeSHA512Hash =
        accessCode.length > 100 ? accessCode : await sha512(accessCode);
      const response = await fetch(productEndpoint + "/api/isSuperAdmin", {
        method: "GET",
        headers: {
          accessCodeSHA512Hash: accessCodeSHA512Hash,
          "ngrok-skip-browser-warning": "true",
        },
      });
      if (response.status === 200) {
        const boolResponse = await response.text();
        console.log("grantSuperAdmin.boolResponse: ", boolResponse);
        return boolResponse === `true`;
      } else {
        if (response.status === 401 || response.status === 403) {
          // window.alert("Você não é um super-administrador.");
          return false;
        }
        window.alert("Erro de conexão ao servidor.");
        return false;
      }
    } catch (error) {
      window.alert("Erro de conexão ao servidor.");
      return false;
    }
  }
  async createAdmin(
    phone: string,
    email: string | undefined
  ): Promise<boolean> {
    try {
      const accessCode = this.getStoredAccessCode();
      if (typeof accessCode === `undefined`) {
        window.location.href = `/`;
        return false;
      }
      const accessCodeSHA512Hash =
        accessCode.length > 100 ? accessCode : await sha512(accessCode);
      const headers: any = {
        phoneNumber: phone,
        accessCodeSHA512Hash: accessCodeSHA512Hash,
        "ngrok-skip-browser-warning": "true",
      };
      if (email) {
        headers.email = email;
      }
      const response = await fetch(productEndpoint + "/api/createAdmin", {
        method: "GET",
        headers,
      });
      if (response.status === 200) {
        const boolResponse = await response.text();
        console.log("grantSuperAdmin.boolResponse: ", boolResponse);
        return boolResponse === `true`;
      } else {
        if (response.status === 401 || response.status === 403) {
          window.alert("Você não é um super-administrador.");
          return false;
        }
        window.alert("Erro de conexão ao servidor.");
        return false;
      }
    } catch (error) {
      window.alert("Erro de conexão ao servidor.");
      return false;
    }
  }
  async updateEmail(phone: string, email: string): Promise<boolean> {
    try {
      const accessCode = this.getStoredAccessCode();
      if (typeof accessCode === `undefined`) {
        window.location.href = `/`;
        return false;
      }
      const accessCodeSHA512Hash =
        accessCode.length > 100 ? accessCode : await sha512(accessCode);
      const response = await fetch(productEndpoint + "/api/updateEmail", {
        method: "PATCH",
        headers: {
          phoneNumber: phone,
          email: email,
          accessCodeSHA512Hash: accessCodeSHA512Hash,
          "ngrok-skip-browser-warning": "true",
        },
      });
      if (response.status === 200) {
        const boolResponse = await response.text();
        console.log("grantSuperAdmin.boolResponse: ", boolResponse);
        return boolResponse === `true`;
      } else {
        if (response.status === 401 || response.status === 403) {
          window.alert("Você não é um super-administrador.");
          return false;
        }
        window.alert("Erro de conexão ao servidor.");
        return false;
      }
    } catch (error) {
      window.alert("Erro de conexão ao servidor.");
      return false;
    }
  }
  async grantSuperAdmin(phone: string): Promise<boolean> {
    try {
      const accessCode = this.getStoredAccessCode();
      if (typeof accessCode === `undefined`) {
        window.location.href = `/`;
        return false;
      }
      const accessCodeSHA512Hash =
        accessCode.length > 100 ? accessCode : await sha512(accessCode);
      const response = await fetch(productEndpoint + "/api/grantSuperAdmin", {
        method: "PATCH",
        headers: {
          phoneNumber: phone,
          accessCodeSHA512Hash: accessCodeSHA512Hash,
          "ngrok-skip-browser-warning": "true",
        },
      });
      if (response.status === 200) {
        const boolResponse = await response.text();
        console.log("grantSuperAdmin.boolResponse: ", boolResponse);
        return boolResponse === `true`;
      } else {
        if (response.status === 401 || response.status === 403) {
          window.alert("Você não é um super-administrador.");
          return false;
        }
        window.alert("Erro de conexão ao servidor.");
        return false;
      }
    } catch (error) {
      window.alert("Erro de conexão ao servidor.");
      return false;
    }
  }
  async revokeSuperAdmin(phone: string): Promise<boolean> {
    try {
      const accessCode = this.getStoredAccessCode();
      if (typeof accessCode === `undefined`) {
        window.location.href = `/`;
        return false;
      }
      const accessCodeSHA512Hash =
        accessCode.length > 100 ? accessCode : await sha512(accessCode);
      const response = await fetch(productEndpoint + "/api/revokeSuperAdmin", {
        method: "PATCH",
        headers: {
          phoneNumber: phone,
          accessCodeSHA512Hash: accessCodeSHA512Hash,
          "ngrok-skip-browser-warning": "true",
        },
      });
      if (response.status === 200) {
        const boolResponse = await response.text();
        console.log("revokeSuperAdmin.boolResponse: ", boolResponse);
        return boolResponse === `true`;
      } else {
        if (response.status === 401 || response.status === 403) {
          window.alert("Você não é um super-administrador.");
          return false;
        }
        window.alert("Erro de conexão ao servidor.");
        return false;
      }
    } catch (error) {
      window.alert("Erro de conexão ao servidor.");
      return false;
    }
  }
  async deleteAdmin(phone: string): Promise<boolean> {
    try {
      const accessCode = this.getStoredAccessCode();
      if (typeof accessCode === `undefined`) {
        window.location.href = `/`;
        return false;
      }
      const accessCodeSHA512Hash =
        accessCode.length > 100 ? accessCode : await sha512(accessCode);
      const response = await fetch(productEndpoint + "/api/deleteAdmin", {
        method: "DELETE",
        headers: {
          phoneNumber: phone,
          accessCodeSHA512Hash: accessCodeSHA512Hash,
          "ngrok-skip-browser-warning": "true",
        },
      });
      if (response.status === 200) {
        const boolResponse = await response.text();
        console.log("revokeSuperAdmin.boolResponse: ", boolResponse);
        return boolResponse === `true`;
      } else {
        if (response.status === 401 || response.status === 403) {
          window.alert("Você não é um super-administrador.");
          return false;
        }
        window.alert("Erro de conexão ao servidor.");
        return false;
      }
    } catch (error) {
      window.alert("Erro de conexão ao servidor.");
      return false;
    }
  }
  async requestAdminAccessCode(phone: string): Promise<boolean> {
    try {
      const response = await fetch(productEndpoint + "/api/requestAdminAccessCode", {
        method: "GET",
        headers: {
          [isNaN(parseInt(phone)) ? `email` : `phoneNumber`]: phone,
          "ngrok-skip-browser-warning": "true",
        },
      });
      if (response.status === 200) {
        const boolResponse = await response.text();
        console.log("getProducts.jsonResponse: ", boolResponse);
        return boolResponse === `true`;
      } else {
        if (response.status === 401) {
          window.alert("Solicitação de código de acesso não autorizada.");
          // window.alert("Você não é um administrador.");
          window.close();
          return false;
        }
        window.alert("Erro de conexão ao servidor.");
        window.close();
        return false;
      }
    } catch (error) {
      window.alert("Erro de conexão ao servidor.");
      window.close();
      return false;
    }
  }
  async requestAccessCode(phone: string): Promise<boolean> {
    try {
      const response = await fetch(productEndpoint + "/api/requestAccessCode", {
        method: "GET",
        headers: {
          [isNaN(parseInt(phone)) ? `email` : `phoneNumber`]: phone,
          "ngrok-skip-browser-warning": "true",
        },
      });
      if (response.status === 200) {
        const boolResponse = await response.text();
        console.log("getProducts.jsonResponse: ", boolResponse);
        return boolResponse === `true`;
      } else {
        if (response.status === 401) {
          window.alert("Solicitação de código de acesso não autorizada.");
          // window.alert("Você não é um administrador.");
          window.close();
          return false;
        }
        window.alert("Erro de conexão ao servidor.");
        window.close();
        return false;
      }
    } catch (error) {
      window.alert("Erro de conexão ao servidor.");
      window.close();
      return false;
    }
  }
  async accessCodeIsValid(accessCode: string): Promise<boolean> {
    try {
      const accessCodeSHA512Hash =
        accessCode.length > 100 ? accessCode : await sha512(accessCode);
      const response = await fetch(productEndpoint + "/api/accessCodeIsValid", {
        method: "GET",
        headers: {
          accessCodeSHA512Hash: accessCodeSHA512Hash,
          "ngrok-skip-browser-warning": "true",
        },
      });
      if (response.status === 200) {
        const txtResponse = await response.text();
        console.log("accessCodeIsValid.txtResponse: ", txtResponse);
        if (txtResponse.length > 11) {
          // document.cookie = "accessCodeSHA512Hash=;expires=;path=/admin;";
          const now = new Date();
          now.setTime(now.getTime() + 1000 * 60 * 60 * 24);
          document.cookie =
            "accessCodeSHA512Hash=" +
            accessCodeSHA512Hash +
            ";expires=" +
            now.getUTCDate() +
            ";path=/admin;";
          document.cookie =
            "phone=" +
            txtResponse +
            ";expires=" +
            now.getUTCDate() +
            ";path=/;";
          return txtResponse.length > 11;
        } else {
          return false;
        }
      } else {
        window.alert("Erro de conexão ao servidor.");
        window.close();
        return false;
      }
    } catch (error) {
      window.alert("Erro de conexão ao servidor.");
      window.close();
      return false;
    }
  }
  async customerAccessCodeIsValid(accessCode: string): Promise<boolean> {
    try {
      const accessCodeSHA512Hash =
        accessCode.length > 100 ? accessCode : await sha512(accessCode);
      const response = await fetch(productEndpoint + "/api/customerAccessCodeIsValid", {
        method: "GET",
        headers: {
          accessCodeSHA512Hash: accessCodeSHA512Hash,
          "ngrok-skip-browser-warning": "true",
        },
      });
      if (response.status === 200) {
        const txtResponse = await response.text();
        console.log("accessCodeIsValid.txtResponse: ", txtResponse);
        if (txtResponse.length > 11) {
          document.cookie = "accessCodeSHA512Hash=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/";
          const now = new Date();
          now.setTime(now.getTime() + 1000 * 60 * 60 * 24);
          document.cookie =
            "accessCodeSHA512Hash=" +
            accessCodeSHA512Hash +
            ";expires=" +
            now.getUTCDate() +
            ";path=/;";
          document.cookie =
            "phone=" +
            txtResponse +
            ";expires=" +
            now.getUTCDate() +
            ";path=/;";
          return txtResponse.length > 11;
        } else {
          return false;
        }
      } else {
        window.alert("Erro de conexão ao servidor.");
        window.close();
        return false;
      }
    } catch (error) {
      window.alert("Erro de conexão ao servidor.");
      window.close();
      return false;
    }
  }
}

const AccessCodeServiceInstance = new AccessCodeService();

export default AccessCodeServiceInstance as AccessCodeService;
