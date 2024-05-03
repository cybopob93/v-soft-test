const express = require("express");
const path = require("path");
const cors = require("cors");

const applyRoutes = require("./routes/index");

const app = express();
const router = express.Router();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", applyRoutes);

app.listen(3000, "0.0.0.0", function () {
  console.info("Server started on port 3000");
});
