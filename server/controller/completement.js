const express = require("express");
const router = express.Router();

const todoUpdateAbl = require("../Abl/todo/updatetodoAbl");
const todoCreateAbl = require("../Abl/todo/createtodoAbl");

router.post("/todos/update", todoUpdateAbl);
router.post("/todos/create", todoCreateAbl);

module.exports = router;


