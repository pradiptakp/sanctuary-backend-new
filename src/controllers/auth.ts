"use strict";

import { Response, Request, NextFunction } from "express";
import axios from "axios";
import { LOGIN_KEYROCK_URL, LOGIN_URL } from "../utils/constants";

/**
 * Login API.
 * @route POST /api/auth/login
 */
export const postLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const loginRes = await axios
      .post<{
        access_token: string;
        token_type: string;
        expires_in: number;
        refresh_token: string;
        scope: string[];
      }>(
        LOGIN_URL,
        `username=${req.body.username}&password=${req.body.password}&grant_type=password&scope=permanent`,
        {
          headers: {
            Authorization:
              "Basic dHV0b3JpYWwtZGNrci1zaXRlLTAwMDAteHByZXNzd2ViYXBwOnR1dG9yaWFsLWRja3Itc2l0ZS0wMDAwLWNsaWVudHNlY3JldA==",
          },
        }
      )
      .then((response) => response.data);
    const loginKeyrockRes = await axios
      .post(
        LOGIN_KEYROCK_URL,
        {
          name: req.body.username,
          password: req.body.password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then(
        ({
          headers,
        }: {
          headers: {
            "x-subject-token": string;
          };
        }) => headers
      );

    const userDataRes = await axios
      .get<{
        access_token: string;
        expires: string;
        valid: boolean;
        User: {
          scope: string[];
          id: string;
          username: string;
          email: string;
          date_password: string;
          enabled: boolean;
          admin: boolean;
        };
      }>(LOGIN_KEYROCK_URL, {
        headers: {
          "Content-Type": "application/json",
          "X-Auth-token": loginKeyrockRes["x-subject-token"],
          "X-Subject-token": loginKeyrockRes["x-subject-token"],
        },
      })
      .then((response) => response.data);

    res.status(200).send({
      ...loginRes,
      keyrockToken: loginKeyrockRes["x-subject-token"],
      userData: userDataRes.User,
    });
  } catch (err) {
    next(err);
  }
};
