const express = require("express");
const { getAllTasks, createTask } = require("./task.controller");

const router = express.Router();

router.route("/").get(getAllTasks).post(createTask);

module.exports = router;
