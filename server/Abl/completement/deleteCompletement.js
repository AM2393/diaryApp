const todoDao = require("../../DAO/todo-dao.js");
const sendMail = require("../../helpers/sendMail.js");
const { userOnTask } = require("../../helpers/taskFunctions.js");

async function DeleteAbl(req, res) {
    try {
        const { todoId, userId } = req.params;

        const deletedTodo = todoDao.get(todoId);

        // check if user can delete todo
        const canDeleteTodo = userOnTask(userId, deletedTodo.projectId);
        if (!canDeleteTodo) {
            res.status(400).json({
                code: "userCantDeleteTodo",
                message: `User ${userId} cant delete todo`,
            });
            return;
        }

        // 
        todoDao.remove(todoId);

        // 
        if (userId === deletedTodo.assigneeUser) {
            res.json(todo);
        }

        // send email notification to assignee user
        const deleterName = userDao.get(userId).name;
        const assignedUserName = userDao.get(deletedTodo.assigneeUser).name;
        const assignedUserEmail = userDao.get(deletedTodo.assigneeUser).email;

        const sendReq = {
            sender: deleterName,
            recipient: assignedUserName,
            recipientMail: assignedUserEmail,
            todoName: deletedTodo.name,
        };

        sendMail(sendReq, "deletedTodoNotification");

        res.json({});
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
}

module.exports = DeleteAbl;
