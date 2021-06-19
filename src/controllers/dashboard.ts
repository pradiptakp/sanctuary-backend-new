"use strict";

import { Response, Request, NextFunction } from "express";
import axios from "axios";
import {
  ENTITIES_URL,
  LOGIN_KEYROCK_URL,
  LOGIN_URL,
  USER_URL,
} from "../utils/constants";
import { Room, User } from "../types";

/**
 * Login API.
 * @route POST /api/auth/login
 */
export const getDashboardInfo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const fetchRooms = await axios
      .get<Room[]>(`${ENTITIES_URL}?type=Room&options=keyValues`, {
        headers: { "X-Auth-Token": `${req.headers["x-auth-token"]}` },
      })
      .then((response) => response.data);

    const fetchDevices = await axios
      .get<Room[]>(`${ENTITIES_URL}?type=Room&options=keyValues`, {
        headers: { "X-Auth-Token": `${req.headers["x-auth-token"]}` },
      })
      .then((response) => response.data);

    const fetchUser = await axios
      .get<{ users: User[] }>(`${USER_URL}`, {
        headers: { "X-Auth-Token": `${req.headers["x-keyrock-token"]}` },
      })
      .then((response) => response.data.users);

    res.status(200).send({
      roomsTotal: fetchRooms.length,
      devicesTotal: fetchDevices.length,
      usersTotal: fetchUser.length,
    });
  } catch (err) {
    next(err);
  }
};
