const todoDao = require("../../DAO/todo-dao.js");

async function getTodoListAbl(req, res) {
    try {
        const todoList = await todoDAO.getAll();
        res.json(todoList);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = getTodoListAbl;
const todoDao = require("../../DAO/todo-dao.js");


const Ajv = require("ajv");

const ajv = new Ajv();


const schema = {
    type: "object",
    properties: {
        name: { type: "string" },
        createdBy: { type: "string", minLength: 32, maxLength: 32 },
        assigneeUser: { type: "string", minLength: 32, maxLength: 32 },
        deadline: { type: "string", format: "date-time" },
        description: { type: "string", maxLength: 500 },
    },
    required: [
        "name",
        "deadline",
        "createdBy",
        "description",
    ],
    additionalProperties: false,
};

async function updateTodoListAbl(req, res) {
    try {
        const { id } = req.params;
        const updatedTodo = req.body;

        // Validate input
        const valid = ajv.validate(schema, updatedTodo);
        if (!valid) {
            return res.status(400).json({
                code: "invalidInput",
                message: "Invalid input data",
                validationError: ajv.errors,
            });
        }

        // Update the todo in the database
        const existingTodo = await todoDAO.get(id);
        if (!existingTodo) {
            return res.status(404).json({
                code: "todoNotFound",
                message: `Todo ${id} not found`,
            });
        }

        const updated = await todoDAO.update(id, updatedTodo);
        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = updateTodoListAbl;
