const express = require("express");
const cors = require("cors");
const connectDB = require("./db.js");
const authApiRoute = require("./ApiRoutes/auth.js");
const oauthApiRoute = require("./ApiRoutes/oauth.js");
const todosApiRoute = require("./ApiRoutes/todolist.js");

const app = express();
const PORT = process.env.Port || 8080;

app.listen(PORT, async () => {
  await connectDB();
  console.log(`http://localhost:${PORT}`);
});

app.use(cors());
app.use(express.json());
app.use("/api/v1/auth", authApiRoute);
app.use("/api/v1/oauth", oauthApiRoute);
app.use("/api/v1/todos", todosApiRoute);

app.use((error, req, res, next) => {
  const errorStatus = error.status || 500;
  const errorMessage = error.errorMessage;
  return res.status(errorStatus).json({
    status: errorStatus,
    message: errorMessage,
    error,
  });
});
