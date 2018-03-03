const express = require("express");

const constants = require("./configs/constants");
const Middleware = require("./configs/middleware");
const userRoutes = require("./Routes/userRoutes");
const postRoutes = require("./Routes/postRoutes");

const app = express();
const db = require("./configs/db");
const middleware = Middleware(app);
const { authJWT } = require("./services/auth.services");

app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);

app.get("/*", authJWT, (req, res) => {
  res.send("Express Boilerplate");
});

const { PORT } = constants;
app.listen(PORT, () => console.log(`serving is running on port ${PORT}`));
