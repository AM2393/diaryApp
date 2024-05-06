const express = require("express");
const router = express.Router();

const GetTodoListAbl = require("../Abl/todolist/gettodoListAbl");
const CreateTodoListAbl = require("../Abl/todolist/createtodoListAbl");
const UpdateTodoListAbl = require("../Abl/todolist/updateTodoListAbl");
const DeleteTodoListAbl = require("../Abl/todolist/deleteTodoListAbl");

// Získání seznamu všech úkolů
router.get("/todolist", GetTodoListAbl);

// Vytvoření nového úkolu
router.post("/todolist", CreateTodoListAbl);

// Aktualizace úkolu
router.put("/todolist/:id", UpdateTodoListAbl);

// Smazání úkolu
router.delete("/todolist/:id", DeleteTodoListAbl);

module.exports = router; 
