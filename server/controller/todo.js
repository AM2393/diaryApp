const express = require("express");
const router = express.Router();
const createtodoAbl = require("../Abl/todo/createtodoAbl")
const deletetodoAbl = require("../Abl/todo/deletetodoAbl")
const getTodoAbl = require("../Abl/todo/getTodoAbl")
const updatetodoAbl = require("../Abl/todo/updatetodoAbl")

// Získání seznamu všech úkolů
//router.get("/todos", todoController.getAllTodos);

// Vytvoření nového úkolu
router.post("/todos", createtodoAbl);

// Získání konkrétního úkolu podle ID
router.get("/todos/:id", getTodoAbl);

// Aktualizace úkolu podle ID
router.put("/todos/:id", updatetodoAbl);

// Smazání úkolu podle ID
router.delete("/todos/:id", deletetodoAbl);

module.exports = router;
