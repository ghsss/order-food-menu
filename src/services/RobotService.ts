// import RobotModel from "../models/Robot";
import RobotModel from "../models/Robot";
import AccessCodeServiceInstance from "./AccessCodeService";
// import AccessCodeServiceInstance from "./AccessCodeService";

const productEndpoint =
  process.env.REACT_APP_PRODUCT_ENDPOINT || "http://localhost:3000";

class RobotService {
  static accessCodeSHA512Hash =
    AccessCodeServiceInstance.getStoredAccessCode() || ``;
  async getRobot(): Promise<RobotModel | undefined> {
    try {
      const response = await fetch(productEndpoint + "/api/robot", {
        headers: {
          accessCodeSHA512Hash: RobotService.accessCodeSHA512Hash,
          "ngrok-skip-browser-warning": "true",
        },
      });
      if (response.status === 200) {
        const jsonResponse = await response.json();
        console.log("getRobot.jsonResponse: ", jsonResponse);
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
}

const RobotServiceInstance = new RobotService();

export default RobotServiceInstance as RobotService;
