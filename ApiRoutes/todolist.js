const express = require("express");
const jwt = require("jsonwebtoken");

const router = express.Router();
const key = "my-secret-key";

// 判斷 token
router.get("/islogin", async (req, res) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(401).json({
      message: "未登入",
    });
  }

  // 驗證
  jwt.verify(token, key, (err, user) => {
    if (err) {
      return res.status(403).json({
        meassge: "驗證錯誤",
        err,
      });
    }

    res.status(200).json({
      meassge: "成功",
      user,
    });
  });
});

module.exports = router;
