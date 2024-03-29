/**
 * Constants declaration.
 */

export const isProduction = process.env.NODE_ENV === "production";

export const KEYROCK_URL = `${
  isProduction ? process.env.KEYROCK_URL : "http://localhost:3005"
}`;
export const ORION_URL = `${
  isProduction ? process.env.ORION_URL : "http://localhost:1027"
}`;
export const ORION_BYPASS_URL = `${
  isProduction ? process.env.ORION_BYPASS_URL : "http://localhost:1026"
}`;
export const IOT_AGENT_URL = `${
  isProduction ? process.env.IOT_AGENT_URL : "http://localhost:4041"
}`;

export const REGISTRATION_URL = `${ORION_URL}/v2/registrations`;
export const ENTITIES_URL = `${ORION_URL}/v2/entities`;
export const ENTITIES_BYPASS_URL = `${ORION_BYPASS_URL}/v2/entities`;
export const DEVICES_URL = `${IOT_AGENT_URL}/iot/devices`;
export const LOGIN_KEYROCK_URL = `${KEYROCK_URL}/v1/auth/tokens`;
export const LOGIN_URL = `${KEYROCK_URL}/oauth2/token`;
export const USER_URL = `${KEYROCK_URL}/v1/users`;
