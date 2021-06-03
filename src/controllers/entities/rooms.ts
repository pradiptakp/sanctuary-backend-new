"use strict";

import { Response, Request, NextFunction } from "express";
import axios from "axios";
import { ENTITIES_URL } from "../../utils/constants";

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
    const fetchRes = await axios
      .get(`${ENTITIES_URL}?type=Room&options=keyValues`, {
        headers: { "X-Auth-Token": `${req.headers["x-auth-token"]}` },
      })
      .then((response) => response.data);
    res.status(200).send(fetchRes);
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
    res.status(200).send(fetchRes);
  } catch (err) {
    next(err);
  }
};

/**
 * Create room.
 * @route POST /api/room
 */

export const postCreateRoom = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const fetchRes = await axios
      .post(ENTITIES_URL, req.body, {
        headers: { "X-Auth-Token": `${req.headers["x-auth-token"]}` },
      })
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
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const fetchRes = await axios
      .put(`${ENTITIES_URL}/${req.params.id}/attrs`, req.body, {
        headers: { "X-Auth-Token": `${req.headers["x-auth-token"]}` },
      })
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
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
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
