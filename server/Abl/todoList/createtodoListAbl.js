const Ajv = require("ajv");
const ajv = new Ajv();

const todoDao = require("../../DAO/todo-dao.js");




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

async function createTodoListAbl(req, res) {
    try {
        let todo = req.body;
        let createdByName, assignedUserName, assignedUserEmail;

        // validate input
        const valid = ajv.validate(schema, todo);
        if (!valid) {
            res.status(400).json({
                code: "dtoInIsNotValid",
                message: "dtoIn is not valid",
                validationError: ajv.errors,
            });
            return;
        }

        todo.createdAt = new Date().toISOString();

        todo = todoDAO.create(todo);

        if (todo.createdBy === todo.assigneeUser) {
            res.json(todo);
            return;
        }

        createdByName = userDao.get(todo.createdBy).name;
        assignedUserName = userDao.get(todo.assigneeUser).name;
        assignedUserEmail = userDao.get(todo.assigneeUser).email;

        let sendReq = {
            sender: createdByName,
            recipient: assignedUserName,
            recipientMail: assignedUserEmail,
            todoId: todo.id,
        };

        sendMail(sendReq, "createTodoNotification");

        res.json(todo);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = createTodoListAbl;
