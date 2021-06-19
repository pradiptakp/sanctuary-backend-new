"use strict";

import { Response, Request, NextFunction } from "express";
import axios from "axios";
import { ENTITIES_URL, USER_URL } from "../utils/constants";
import { User } from "../types";

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
      .get<{ users: User[] }>(`${USER_URL}`, {
        headers: { "X-Auth-Token": `${req.headers["x-keyrock-token"]}` },
      })
      .then((response) => response.data.users);
    res.status(200).send(fetchRes);
  } catch (err) {
    if (err.response?.data?.error?.message === "Token has expired") {
      res.status(401).send({
        message: "Token has expired, please re-login",
      });
    } else {
      next(err);
    }
  }
};

/**
 * Get users.
 * @route GET /api/user
 */

export const getUserDetail = async (
  req: Request<{ id: string }, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const fetchRes = await axios
      .get<{ user: User }>(`${USER_URL}/${req.params.id}`, {
        headers: { "X-Auth-Token": `${req.headers["x-keyrock-token"]}` },
      })
      .then((response) => response.data.user);
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
  req: Request<{}, {}, { username: string; email: string; password: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const fetchRes = await axios
      .post<{ user: User }>(
        `${USER_URL}`,
        { user: req.body },
        {
          headers: { "X-Auth-Token": `${req.headers["x-keyrock-token"]}` },
        }
      )
      .then((response) => response.data.user);

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
  req: Request<{ id: string }, {}, { username: string; password: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const fetchRes = await axios
      .patch<{ user: User }>(
        `${USER_URL}/${req.params.id}`,
        { user: req.body },
        {
          headers: { "X-Auth-Token": `${req.headers["x-keyrock-token"]}` },
        }
      )
      .then((response) => response.data.user);

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
  req: Request<{ id: string }, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    await axios.delete(`${USER_URL}/${req.params.id}`, {
      headers: { "X-Auth-Token": `${req.headers["x-keyrock-token"]}` },
    });
    res.status(200).send();
  } catch (err) {
    next(err);
  }
};
