import { CommonRoutesConfig } from "./utils/common.routes.config";
import { SalariesRoutes } from "./app/salaries/salaries.routes.config";
class RouteList {
   private routes: Array<CommonRoutesConfig> = [];
   public getRoutes(app: any): CommonRoutesConfig[] {
      // here we are adding the OurRoutes to our array,
      // after sending the Express.js application object to have the routes added to our app!
      this.routes.push(new SalariesRoutes(app));

      return this.routes;
   }
}

export default new RouteList();