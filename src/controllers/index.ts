import { entitiesController } from "./entities";
import * as authController from "./auth";
import * as userController from "./users";
import * as dashboardController from "./dashboard";

export const controllers = {
  ...entitiesController,
  ...authController,
  ...userController,
  ...dashboardController,
};
