import * as devicesController from "./devices";
import * as roomsController from "./rooms";

export const entitiesController = { ...devicesController, ...roomsController };
