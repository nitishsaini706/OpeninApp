// TaskRoutes.js
const express = require('express');
const task = require("./taskRoutes")
const router = express();

router.use("/task", task);

module.exports = router;
