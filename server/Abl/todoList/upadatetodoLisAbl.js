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

        // validate input
        const valid = ajv.validate(schema, updatedTodo);
        if (!valid) {
            return res.status(400).json({
                code: "dtoInIsNotValid",
                message: "dtoIn is not valid",
                validationError: ajv.errors,
            });
        }

        const existingTodo = await todoDAO.get(id);
        if (!existingTodo) {
            return res.status(404).json({
                code: "todoNotFound",
                message: `Todo ${id} not found`,
            });
        }

        const todo = await todoDAO.update(id, updatedTodo);

        if (todo.createdBy !== todo.assigneeUser) {
            const createdByName = userDao.get(todo.createdBy).name;
            const assignedUserName = userDao.get(todo.assigneeUser).name;
            const assignedUserEmail = userDao.get(todo.assigneeUser).email;

            const sendReq = {
                sender: createdByName,
                recipient: assignedUserName,
                recipientMail: assignedUserEmail,
                todoId: todo.id,
            };

            sendMail(sendReq, "updateTodoNotification");
        }

        res.json(todo);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = updateTodoListAbl;
