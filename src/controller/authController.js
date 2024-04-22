import sha256 from "sha256";
import { ClientError } from "../utils/error.js";
import { launchToken } from "../utils/jwt.js";
import { USER_VALIDATOR } from "../utils/validator.js";
const authController = {
  REGISTER: function (req, res) {
    try {
      const users = req.getData("users");
      let userData = req.body;
      const {
        avatar: { name },
      } = req.files;
      req.toCheckNewUser(userData);
      const registerType = req.toCheckUser("register", userData);
      let avatarName = Date.now() + name;
      if (registerType) {
        userData = {
          ...userData,
          password: sha256(userData.password),
          userId: users.length ? users[users.length - 1].userId + 1 : 1,
          avatar: avatarName,
        };
        users.push(userData);
        req.writeData("users", users);
        req.saveAvatar(avatarName);
        return res
          .status(201)
          .json({
            message: "The user successfull created",
            user: userData,
            accessToken: launchToken.createToken({
              userId: userData.userId,
              userAgent: req.headers["user-agent"],
            }),
            statusCode: 201,
          });
      } else {
        throw new ClientError(409, "The user has ben created !");
      }
    } catch (error) {
      return res
        .status(error.status || 500)
        .json({ message: error.message, statusCode: error.status || 500 });
    }
  },
  LOGIN: function (req, res) {
    try {
      const users = req.getData("users");
      const userData = req.body;
      req.toCheckNewUser(userData);

      if (USER_VALIDATOR.validate(userData).value) {
        const loginType = req.toCheckUser("login", userData);
        if (loginType) {
          const findUser = users.find(
            (user) => user.username == userData.username
          );
          return res
            .status(200)
            .json({
              message: "The user successfull logined !",
              user: findUser,
              accessToken: launchToken.createToken({
                userId: findUser.userId,
                userAgent: req.headers["user-agent"],
              }),
              statusCode: 200,
            });
        } else {
          throw new ClientError(404, "User not found");
        }
      } else {
        throw new ClientError(
          400,
          USER_VALIDATOR.validate(userData).error.message
        );
      }
    } catch (error) {
      return res
        .status(error.status || 500)
        .json({ message: error.message, statusCode: error.status || 500 });
    }
    l;
  },
};

export default authController;
