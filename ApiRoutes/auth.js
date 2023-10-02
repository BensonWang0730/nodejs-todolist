const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Auth = require("../models/Auth.js");

const router = express.Router();
const key = "my-secret-key";

// 註冊
router.post("/register", async (req, res, next) => {
  try {
    const user = await Auth.findOne({
      account: req.body.account,
    });
    if (user) {
      return res.status(401).json({ message: "用戶已存在" });
    }

    const registerData = new Auth(req.body);
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(registerData.password, salt);
    const newUser = new Auth({
      account: registerData.account,
      password: hash,
      nickname: registerData.nickname,
    });
    await newUser.save();

    res.status(200).json({ message: "註冊成功" });
  } catch (error) {
    next(error);
  }
});

// 登入
router.post("/login", async (req, res, next) => {
  const { account, password } = req.body;
  try {
    // 判斷用戶是否存在
    const user = await Auth.findOne({
      account,
    });
    if (!user) {
      return res.status(422).json({
        message: "用戶不存在",
      });
    }

    // 用戶存在後，判斷密碼
    const isPasswordValid = require("bcryptjs").compareSync(
      password,
      user.password
    );
    if (!isPasswordValid) {
      return res.status(422).json({
        message: "密碼錯誤",
      });
    }

    // JWT 簽章
    const token = jwt.sign({ account, username: Auth.username }, key);
    console.log(token);

    res.status(200).json({ message: "登入成功", token });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
