const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB);
    console.log("connected to mongodb");
  } catch (error) {
    console.log(error);
  }
};

// 取得資料庫連線狀態
const db = mongoose.connection;
// 連線異常
db.on("error", (err) => {
  console.log(err);
});
// 連線成功
db.once("open", (db) => {
  console.log("連線成功");
});

module.exports = connectDB;
