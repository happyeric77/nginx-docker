import express, { Request, Response } from "express";
import { graphqlHTTP } from "express-graphql";
import { buildSchema } from "graphql";
import { users } from "./dummyDB/userModal";
import jwt from "jsonwebtoken";

var app = express();

// Schema
var schema = buildSchema(`
  type Query {
    Users: [user]
  }  
  type Mutation {
    UpdateUsername(username: String!, newUsername: String!): [user]
  }
  type user {
    username: String
    email: String
  }
`);
interface IUpdateUsername {
  username: string;
  newUsername: string;
}
interface IHttpContext {
  req: Request;
  res: Response;
}
interface JwtUserPayload {
  username: string;
  role: "admin" | "viewer";
}
// Resolver
var root = {
  Users: () => users,
  UpdateUsername: async (data: IUpdateUsername, context: IHttpContext) => {
    //@ts-ignore
    const token = context.req.headers.authorization;
    let verifiedUser: JwtUserPayload | null = null;
    try {
      verifiedUser = (await jwt.verify(
        token || "",
        "colorfulLife"
      )) as JwtUserPayload;
    } catch (e) {
      console.log("Not able to verify the token,", e);
    }

    if (verifiedUser) {
      let user = users.find((u) => u.username === data.username);
      if (user) {
        user.username = data.newUsername;
      }
      const newUsers = users;
      return newUsers;
    }
    return users;
  },
};

app.use((_, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.removeHeader("x-powered-by");
  res.setHeader("Access-Control-Allow-Methods", "POST");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.options("*", function (req, res) {
  res.sendStatus(200);
});

app.use(
  "/graphql",
  graphqlHTTP((req, res) => ({
    schema: schema,
    rootValue: root,
    graphiql: true,
    context: { req, res },
  }))
);

app.use(express.json()).listen(3001, () => {
  console.log(`Server is listening on port ${3001}`);
  console.log(
    `Running a GraphQL API server at http://localhost:${3001}/graphql`
  );
});
