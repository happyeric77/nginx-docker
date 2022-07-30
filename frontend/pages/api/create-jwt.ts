// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

type Data = {
  Authorization: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const secrete = req.body.pwd;
  const token = jwt.sign(
    {
      username: "frontend-admin",
      role: "admin",
    },
    secrete
  );
  const payload = {
    Authorization: token,
  };
  res.status(200).json(payload);
}
