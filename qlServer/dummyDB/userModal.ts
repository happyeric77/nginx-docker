interface IUser {
  username: string;
  email: string;
}

type Users = IUser[];

export var users: Users = [
  {
    username: "Eric",
    email: "contact@dev-eric.ml",
  },
  { username: "Alice", email: "Alice@gamil.com" },
  { username: "Yuko", email: "yuko@gamil.com" },
];
