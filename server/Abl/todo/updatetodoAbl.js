const todoDAO = require("../../DAO/todo-dao");

async function updateTodoAbl(req, res) {
    try {
        const { id } = req.params;
        const updatedTodo = req.body;

        const existingTodo = await todoDAO.get(id);
        if (!existingTodo) {
            return res.status(404).json({
                code: "todoNotFound",
                message: `Todo ${id} not found`,
            });
        }

        const todo = await todoDAO.update(id, updatedTodo);
        res.json(todo);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = updateTodoAbl;
