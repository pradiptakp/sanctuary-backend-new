"use strict";

import { Response, Request, NextFunction } from "express";
import axios from "axios";
import { ENTITIES_URL } from "../../utils/constants";
import { getLastID } from "../../utils/common";
import { Device, Room } from "../../types";

/**
 * Get rooms.
 * @route GET /api/room
 */

export const getRooms = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const fetchDevices = await axios
      .get<Device[]>(
        `${ENTITIES_URL}?type=Lamp,Lock,Temperature&options=keyValues`,
        {
          headers: {
            "X-Auth-Token": `${req.headers["x-auth-token"]}`,
            "fiware-service": "openiot",
            "fiware-servicepath": "/",
          },
        }
      )
      .then((response) => response.data);

    const fetchRooms = await axios
      .get<Room[]>(`${ENTITIES_URL}?type=Room&options=keyValues`, {
        headers: { "X-Auth-Token": `${req.headers["x-auth-token"]}` },
      })
      .then((response) => response.data);

    const response = fetchRooms.map((v) => {
      const devices = fetchDevices.filter((_v) => {
        return _v.refRoom === v.id;
      });
      return {
        ...v,
        devices,
      };
    });

    res.status(200).send(response);
  } catch (err) {
    next(err);
  }
};

/**
 * Get room detail.
 * @route GET /api/room/:id
 */

export const getRoomDetail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const fetchRes = await axios
      .get(`${ENTITIES_URL}?type=Room&options=keyValues&id=${req.params.id}`, {
        headers: { "X-Auth-Token": `${req.headers["x-auth-token"]}` },
      })
      .then((response) => response.data);

    if (fetchRes.length === 0) {
      res.status(500).send("Room not found");
      return;
    }

    res.status(200).send(fetchRes[0]);
  } catch (err) {
    next(err);
  }
};

/**
 * Create room.
 * @route POST /api/room
 */

export const postCreateRoom = async (
  req: Request<
    {},
    {},
    {
      name: string;
      description?: string;
    }
  >,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.body.name) {
      throw "Request invalid";
    }

    const fetchRooms = await axios
      .get<{ id: string }[]>(
        `${ENTITIES_URL}?type=Room&options=keyValues&attrs=id`,
        {
          headers: { "X-Auth-Token": `${req.headers["x-auth-token"]}` },
        }
      )
      .then((response) => response.data);

    const roomId = fetchRooms.length > 0 ? getLastID(fetchRooms) : "001";

    const fetchRes = await axios
      .post(
        ENTITIES_URL,
        {
          id: "urn:ngsi-ld:Room:" + roomId,
          type: "Room",
          name: {
            type: "Text",
            value: req.body.name,
          },
          description: {
            type: "Text",
            value: req.body.description,
          },
          powerUsage: {
            type: "Integer",
            value: 0,
          },
          temperature: {
            type: "Integer",
            value: 0,
          },
          totalDevice: {
            type: "Integer",
            value: 0,
          },
          refHouse: {
            type: "Text",
            value: "urn:ngsi-ld:House:1",
          },
        },
        {
          headers: { "X-Auth-Token": `${req.headers["x-auth-token"]}` },
        }
      )
      .then((response) => response.data);

    res.status(200).send(fetchRes);
  } catch (err) {
    next(err);
  }
};

/**
 * Get rooms.
 * @route PUT /api/room
 */

export const putUpdateRoom = async (
  req: Request<{ id: string }, {}, { name: string; description: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const fetchRes = await axios
      .put(
        `${ENTITIES_URL}/${req.params.id}/attrs`,
        {
          name: {
            type: "Text",
            value: req.body.name,
          },
          description: {
            type: "Text",
            value: req.body.description,
          },
        },
        {
          headers: { "X-Auth-Token": `${req.headers["x-auth-token"]}` },
        }
      )
      .then((response) => response.data);

    res.status(200).send(fetchRes);
  } catch (err) {
    next(err);
  }
};

/**
 * Get rooms.
 * @route DELETE /api/room
 */

export const deleteRoom = async (
  req: Request<{ id: string }, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const fetchDevices = await axios
      .get<Device[]>(
        `${ENTITIES_URL}?type=Lamp,Lock,Temperature&options=keyValues`,
        {
          headers: {
            "X-Auth-Token": `${req.headers["x-auth-token"]}`,
            "fiware-service": "openiot",
            "fiware-servicepath": "/",
          },
        }
      )
      .then((response) => response.data);

    if (fetchDevices.filter((v) => v.refRoom === req.params.id).length > 0) {
      res.status(500).send("Please delete the devices in this room first");
      return;
    }
    const fetchRes = await axios
      .delete(`${ENTITIES_URL}/${req.params.id}`, {
        headers: { "X-Auth-Token": `${req.headers["x-auth-token"]}` },
      })
      .then((response) => response.data);

    res.status(200).send(fetchRes);
  } catch (err) {
    next(err);
  }
};
