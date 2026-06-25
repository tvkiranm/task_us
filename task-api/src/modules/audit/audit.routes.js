const express = require("express");
const { register, login } = require("./audit.controller");

const router = express.Router();

router.post("/audit-log", register);


module.exports = router;
