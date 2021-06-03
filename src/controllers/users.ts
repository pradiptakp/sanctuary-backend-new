"use strict";

import { Response, Request, NextFunction } from "express";
import axios from "axios";
import { ENTITIES_URL, USER_URL } from "../utils/constants";

/**
 * Get users.
 * @route GET /api/user
 */

export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const fetchRes = await axios
      .get(`${USER_URL}`, {
        headers: { "X-Auth-Token": `${req.headers["x-auth-token"]}` },
      })
      .then((response) => response.data);
    res.status(200).send(fetchRes);
  } catch (err) {
    next(err);
  }
};

/**
 * Create user.
 * @route POST /api/user
 */

export const postCreateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const fetchRes = await axios
      .post(
        `${USER_URL}`,
        { user: req.body },
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
 * Get users.
 * @route PUT /api/user
 */

export const putUpdateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const fetchRes = await axios
      .patch(
        `${USER_URL}/${req.params.id}`,
        { user: req.body },
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
 * Get users.
 * @route DELETE /api/user
 */

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const fetchRes = await axios
      .delete(`${USER_URL}/${req.params.id}`, {
        headers: { "X-Auth-Token": `${req.headers["x-auth-token"]}` },
      })
      .then((response) => response);
    res.status(200).send(fetchRes);
  } catch (err) {
    next(err);
  }
};
