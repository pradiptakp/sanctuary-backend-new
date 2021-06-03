import { entitiesController } from "./entities";
import * as authController from "./auth";
import * as userController from "./users";

export const controllers = {
  ...entitiesController,
  ...authController,
  ...userController,
};
