const Ajv = require("ajv");
const ajv = new Ajv();

const todoDao = require("../../DAO/todo-dao.js");


const schema = {
    type: "object",
    properties: {
        name: { type: "string" },
        assigneeUser: { type: "string", minLength: 32, maxLength: 32 },
    
        deadline: { type: "string", format: "date-time" },
        description: { type: "string", maxLength: 500 },
    },
    required: [
        "name",
        "assigneeUser",
        "deadline",
        "description",
    ],
    additionalProperties: false,
};

async function UpdateAbl(req, res) {
    try {
        const { todoId, userId } = req.params;
        let todo = req.body;
        let assignedUserName, assignedUserEmail, sendReq;

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

        todo.id = todoId;
        const oldTodo = todoDAO.get(todo.id);

        const canUpdateTodo = userOnTask(userId, oldTodo.projectId);

        if (!canUpdateTodo) {
            res.status(400).json({
                code: "userCantUpdateTodo",
                message: `User ${userId} cant update todo`,
            });
            return;
        }

        const updatedTodo = todoDAO.update(todo);

        if (updatedTodo.createdBy === updatedTodo.assigneeUser) {
            res.json(updatedTodo);
            return;
        }

        assignedUserName = userDao.get(oldTodo.assigneeUser).name;
        assignedUserEmail = userDao.get(oldTodo.assigneeUser).email;

        if (updatedTodo.name !== oldTodo.name) {
            sendReq = {
                recipient: assignedUserName,
                recipientMail: assignedUserEmail,
                todoId: oldTodo.id,
                todoName: oldTodo.name,
                todoNameNew: updatedTodo.name
            };

            sendMail(sendReq, "updateTodoNameNotification");
        } else {
            sendReq = {
                recipient: assignedUserName,
                recipientMail: assignedUserEmail,
                todoId: oldTodo.id,
                todoName: oldTodo.name
            };

            sendMail(sendReq, "updateTodoNotification");
        }

        res.json(updatedTodo);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
}

module.exports = UpdateAbl;
