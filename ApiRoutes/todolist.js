const express = require("express");
const jwt = require("jsonwebtoken");
const Todo = require("../models/Todolist.js");
require("dotenv").config();

const router = express.Router();
const key = process.env.SECRET;

const checkAuth = (req, res) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(401).json({
      message: "未登入",
    });
  }
  // 驗證
  jwt.verify(token, key, (error, user) => {
    if (error) {
      return res.status(403).json({
        meassge: "驗證錯誤",
        error,
      });
    }
  });
};

// 發送待辦事項
router.post("/", async (req, res, next) => {
  try {
    checkAuth(req, res);
    const todoList = new Todo(req.body);
    await todoList.save();

    return res.status(200).json({
      meassge: "上傳成功",
    });
  } catch (error) {
    next(error);
  }
});

// 取得所有待辦事項
router.get("/", async (req, res) => {
  try {
    checkAuth(req, res);
    const todos = await Todo.find();
    return res.status(200).json(todos);
  } catch (error) {
    next(error);
  }
});

// 切換待辦事項狀態
router.post("/isdone", async (req, res) => {
  try {
    checkAuth(req, res);
    const { id } = req.body;
    const todoId = await Todo.findById(id);
    if (!todoId) {
      return res.status(401).json({
        message: "todoId 發生錯誤",
      });
    }

    await todoId.changeStatus();
    return res.status(200).json({ message: todoId.isDone });
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    checkAuth(req, res);
    await Todo.deleteOne({ _id: id });

    return res.status(200).json({
      message: "刪除成功",
    });
  } catch (error) {
    next(error);
  }
});

// 判斷 token
router.get("/islogin", async (req, res) => {
  checkAuth(req, res);
  return res.status(200).json({
    meassge: "is login",
  });
});

module.exports = router;
