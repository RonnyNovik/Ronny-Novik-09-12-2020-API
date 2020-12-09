"use strict";
const User = use("App/Models/User");
const Hash = use("Hash");
const { validate } = use('Validator')

class UserController {
  async signUp({ request, response }) {
    const rules = {
      userName: "required|string|max:20",
      password: "required|string|min:6|max:40",
    };
    const { userName, password } = request.all();
    const validateInfo = await validate(request.all(), rules);
    if (validateInfo) {
      const existingUser = await User.findBy("username", userName);
      if (!existingUser) {
        const user = await User.create({
          username: userName,
          password,
        });
        return response
          .status(200)
          .json({ id: user.id, username: user.username });
      } else {
        return response.status(403).send("Username Exists");
      }
    } else {
      return response.status(406).send("Invalid Forms");
    }
  }
  async signIn({ request, auth, response }) {
    const rules = {
      userName: "required|string|max:20",
      password: "required|string|min:6|max:40",
    };
    const { userName, password } = request.all();
    const validateInfo = await validate(request.all(), rules);
    if (validateInfo) {
      const user = await User.findBy("username", userName);
      if (user) {
        const passwordValid = await Hash.verify(password, user.password);
        if (!passwordValid) {
          return response.status(401).send("Invalid Password");
        }

        const token = await auth.generate(user);
        return response.status(200).json({
          token,
          user: { id: user.id, username: user.username },
        });
      } else {
        return response.status(404).send("Invalid username");
      }
    } else {
      return response.status(406).send("Invalid Forms");
    }
  }
}

module.exports = UserController;
