import CompanyModel from "../models/Company";
import AccessCodeServiceInstance from "./AccessCodeService";

const CompanyEndpoint =
  process.env.REACT_APP_Company_ENDPOINT || "http://localhost:3000";

const accessCodeSHA512Hash =
  AccessCodeServiceInstance.getStoredAccessCode() || ``;

class CompanyService {
  async getCompany(): Promise<CompanyModel | undefined> {
    try {
      const response = await fetch(CompanyEndpoint + "/api/company", {
        method: `GET`,
        headers: {
          "Content-Type": "application/json",
          accessCodeSHA512Hash: accessCodeSHA512Hash,
          'ngrok-skip-browser-warning': 'true'
        },
      });
      if (response.status === 200) {
        const jsonResponse = await response.json();
        console.log("getCompanys.jsonResponse: ", jsonResponse);
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

  async upsertCompany(Company: CompanyModel) {
    try {
      const response = await fetch(CompanyEndpoint + "/api/company", {
        method: `PUT`,
        headers: {
          "Content-Type": "application/json",
          accessCodeSHA512Hash: accessCodeSHA512Hash,
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify(Company),
      });
      if (response.status === 200) {
        const Company_Id = await response.text();
        console.log("upsertCompany.Company_Id: ", Company_Id);
        return Company_Id;
      } else {
        if (response.status === 400) {
          // Company type does not exists.
          // const CompanyTypeDoesntExist =
          //   (await response.json()).message.indexOf(
          //     `Company type does not exists.`
          //   ) === 0;
          // if (CompanyTypeDoesntExist) {
          //   window.alert("Tipo de produto selecionado não existe.");
          //   return;
          // } else {
          window.alert("Erro ao alterar dados da empresa.");
          return;
          // }
        }
      }
    } catch (error) {
      window.alert("Erro de conexão ao servidor.");
    }
  }
}

const CompanyServiceInstance = new CompanyService();

export default CompanyServiceInstance as CompanyService;
