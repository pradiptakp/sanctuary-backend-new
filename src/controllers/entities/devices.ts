"use strict";

import { Response, Request, NextFunction } from "express";
import axios from "axios";
import {
  DEVICES_URL,
  ENTITIES_URL,
  REGISTRATION_URL,
} from "../../utils/constants";
import { io } from "../../../src/app";

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
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const fetchRes = await axios
      .patch(
        `${ENTITIES_URL}/${req.body.id}/attrs`,
        req.body.on
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
          id: req.body.id,
          on: req.body.on,
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
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const fetchRes = await axios
      .post(
        DEVICES_URL,
        {
          devices: [req.body],
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
        description: `${req.body.entity_type} Commands`,
        dataProvided: {
          entities: [
            {
              id: req.body.entity_name,
              type: req.body.entity_type,
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
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const fetchRes = await axios
      .delete(`${DEVICES_URL}/${req.params.id}`, {
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
