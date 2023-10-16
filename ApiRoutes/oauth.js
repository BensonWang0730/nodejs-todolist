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
  redirectUri: "http://127.0.0.1:5173/", // google develooer console 設定的要一樣
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

// 回傳路由
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

    // 創建 JWT
    const token = jwt.sign(userInfo.data, JWT_SECRET);
    // 將 JWT 儲存在 Cookie，前端可從 Cookie 中讀取值
    res.cookie("token", token);
    res.redirect("/"); // 跳轉回前端頁面
  } catch (error) {
    next(error);
  }
});

// 驗證 JWT
function authenticateJWT(req, res, next) {
  const token = req.header("Authorization");

  if (token) {
    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
}

router.get("/user", authenticateJWT, async (req, res) => {
  try {
    const userInfo = await client.request({
      url: "https://www.googleapis.com/oauth2/v3/userinfo",
    });
    res.json(userInfo.data); // 回傳用戶資訊
  } catch (error) {
    next(error);
  }
});

module.exports = router;
