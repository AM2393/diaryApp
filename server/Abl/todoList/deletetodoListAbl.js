const todoDao = require("../../DAO/todo-dao.js");

async function deleteTodoListAbl(req, res) {
    try {
        const { id } = req.params;

        const deletedTodo = await todoDAO.delete(id);
        if (!deletedTodo) {
            return res.status(404).json({
                code: "todoNotFound",
                message: `Todo ${id} not found`,
            });
        }

        res.sendStatus(204);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = deleteTodoListAbl;
