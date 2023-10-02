const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  account: {
    type: String,
    required: true,
    // 有錯
    // validate: {
    //   validator: (value) => value.inculde("@"),
    //   message: (props) => `${props.value} 有錯誤`,
    // },
  },
  password: {
    type: String,
    required: true,
    set(val) {
      return require("bcryptjs").hashSync(val, 10);
    },
  },
  username: {
    type: String,
    default: "訪客",
  },
  createTime: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", userSchema);
