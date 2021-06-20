"use strict";

import { Response, Request, NextFunction } from "express";
import axios from "axios";
import {
  DEVICES_URL,
  ENTITIES_URL,
  REGISTRATION_URL,
} from "../../utils/constants";
import { io } from "../../../src/app";
import { Device, DeviceType } from "../../types";
import { getLastID } from "../../utils/common";

/**
 * Get devices.
 * @route GET /api/device
 */

export const getDevices = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const fetchRes = await axios
      .get(`${ENTITIES_URL}?type=Lamp,Lock,Temperature&options=keyValues`, {
        headers: {
          "X-Auth-Token": `${req.headers["x-auth-token"]}`,
          "fiware-service": "openiot",
          "fiware-servicepath": "/",
        },
      })
      .then((response) => response.data);

    res.status(200).send(fetchRes);
  } catch (err) {
    next(err);
  }
};

/**
 * Get deviceDetail.
 * @route GET /api/device/:id
 */

export const getDeviceDetail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const fetchRes = await axios
      .get(
        `${ENTITIES_URL}?type=Lamp,Lock,Temperature&options=keyValues&id=${req.params.id}`,
        {
          headers: {
            "X-Auth-Token": `${req.headers["x-auth-token"]}`,
            "fiware-service": "openiot",
            "fiware-servicepath": "/",
          },
        }
      )
      .then((response) => response.data);

    res.status(200).send(fetchRes);
  } catch (err) {
    next(err);
  }
};

/**
 * Post switch device state.
 * @route POST /api/device/switch
 */

export const postSwitchDevice = async (
  req: Request<{ id: string }, {}, { state: boolean }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const fetchRes = await axios
      .patch(
        `${ENTITIES_URL}/${req.params.id}/attrs`,
        req.body.state
          ? {
              on: {
                type: "command",
                value: "",
              },
              state: {
                value: "on",
              },
            }
          : {
              off: {
                type: "command",
                value: "",
              },
              state: {
                value: "off",
              },
            },
        {
          headers: {
            "X-Auth-Token": `${req.headers["x-auth-token"]}`,
            "fiware-service": "openiot",
            "fiware-servicepath": "/",
          },
        }
      )
      .then((response) => {
        io.emit("switch", {
          id: req.params.id,
          state: req.body.state,
        });
        return response.data;
      });
    res.status(200).send(fetchRes);
  } catch (err) {
    next(err);
  }
};

/**
 * Create device.
 * @route POST /api/device
 */

export const postCreateDevice = async (
  req: Request<{}, {}, { roomId: string; type: DeviceType }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const fetchDevices = await axios
      .get<Device[]>(
        `${ENTITIES_URL}?type=${req.body.type}&options=keyValues`,
        {
          headers: {
            "X-Auth-Token": `${req.headers["x-auth-token"]}`,
            "fiware-service": "openiot",
            "fiware-servicepath": "/",
          },
        }
      )
      .then((response) => response.data);

    const deviceId = fetchDevices.length > 0 ? getLastID(fetchDevices) : "001";

    const fetchRes = await axios
      .post(
        DEVICES_URL,
        {
          devices: [
            {
              entity_name: `urn:ngsi-ld:${req.body.type}:${deviceId}`,
              device_id: `${req.body.type.toLowerCase()}${deviceId}`,
              entity_type: req.body.type,
              protocol: "PDI-IoTA-UltraLight",
              transport: "HTTP",
              endpoint: `http://206.189.149.121:3001/iot/${req.body.type.toLowerCase()}${deviceId}`,
              commands: [
                {
                  name: "on",
                  type: "command",
                },
                {
                  name: "off",
                  type: "command",
                },
              ],
              attributes: [
                {
                  object_id: "s",
                  name: "state",
                  type: "Text",
                },
                {
                  object_id: "p",
                  name: "power",
                  type: "Integer",
                },
                {
                  object_id: "m",
                  name: "monthly_usage",
                  type: "Integer",
                },
              ],
              static_attributes: [
                {
                  name: "refRoom",
                  type: "Relationship",
                  value: req.body.roomId,
                },
              ],
            },
          ],
        },
        {
          headers: {
            "X-Auth-Token": `${req.headers["x-auth-token"]}`,
            "fiware-service": "openiot",
            "fiware-servicepath": "/",
          },
        }
      )
      .then((response) => response.data);

    await axios.post(
      REGISTRATION_URL,
      {
        description: `${req.body.type} Commands`,
        dataProvided: {
          entities: [
            {
              id: `urn:ngsi-ld:${req.body.type}:${deviceId}`,
              type: req.body.type,
            },
          ],
          attrs: ["on", "off"],
        },
        provider: {
          http: { url: "http://orion:1026/v1" },
          legacyForwarding: true,
        },
      },
      {
        headers: {
          "X-Auth-Token": `${req.headers["x-auth-token"]}`,
          "fiware-service": "openiot",
          "fiware-servicepath": "/",
        },
      }
    );
    res.status(200).send(fetchRes);
  } catch (err) {
    next(err);
  }
};

/**
 * Delete device.
 * @route DELETE /api/device
 */

export const deleteDevice = async (
  req: Request<{ id: string }, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const iotDeviceId = req.params.id.substr(12).replace(":", "").toLowerCase();

    await axios
      .delete(`${ENTITIES_URL}/${req.params.id}`, {
        headers: {
          "X-Auth-Token": `${req.headers["x-auth-token"]}`,
          "fiware-service": "openiot",
          "fiware-servicepath": "/",
        },
      })
      .then((response) => response.data);

    await axios
      .delete(`${DEVICES_URL}/${iotDeviceId}`, {
        headers: {
          "X-Auth-Token": `${req.headers["x-auth-token"]}`,
          "fiware-service": "openiot",
          "fiware-servicepath": "/",
        },
      })
      .then((response) => response.data);

    res.status(200).send();
  } catch (err) {
    next(err);
  }
};
