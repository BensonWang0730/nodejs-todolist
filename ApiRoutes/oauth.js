const express = require("express");
const router = express.Router();

const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// google 申請的（在 Google developer console）
const { GOOGLE_CLIENT_ID, GOOGLE_SECRET_KEY, JWT_SECRET, HOST } = process.env;
const client = new OAuth2Client({
  clientId: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_SECRET_KEY,
  redirectUri: "http://localhost:5500/todos/index.html", // google develooer console 設定的要一樣
  // `${
  //   process.env.Port || "http://localhost:8080"
  // } /api/v1/oauth/callback`,
});

// 授權路由
router.post("/login", (req, res) => {
  const authorizeUrl = client.generateAuthUrl({
    access_type: "offline",
    scope: [
      // 要取得用戶的資料
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ],
  });
  res.redirect(authorizeUrl); // 重定向至 Google 授權頁面
});

// 回傳路由，解析回傳的 token
router.get("/callback", async (req, res) => {
  const { code } = req.query;

  try {
    // 用授權碼換取 token
    const { tokens } = await client.getToken(code);
    client.setCredentials(tokens);

    // 透過 access token 在換取資料
    const userInfo = await client.request({
      url: "https://www.googleapis.com/oauth2/v3/userinfo",
    });

    const token = jwt.sign(userInfo.data, JWT_SECRET);
    res.cookie("token", token);
    res.redirect("/");
  } catch (error) {
    next(error);
  }
});

module.exports = router;
