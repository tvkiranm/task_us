const express = require("express");
const appData = require("./src/app");

const app = express();

app.use(appData);

app.listen(3004, () => {
  console.log("Hello there 3004  ssaa");
});
