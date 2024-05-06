const complementDao = require("../../DAO/complementDAO.js");
const sendMail = require("../../helpers/sendMail.js");
const { userOnTask } = require("../../helpers/taskFunctions.js");

async function CreateComplementAbl(req, res) {
    try {
        const { todoId, userId } = req.params;
        const complement = req.body;

        // kontrola oprávnění uživatele k vytvoření doplňku
        const canCreateComplement = userOnTask(userId, complement.projectId);
        if (!canCreateComplement) {
            res.status(400).json({
                code: "userCantCreateComplement",
                message: `User ${userId} nemůže vytvořit doplněk`,
            });
            return;
        }

        // přidání doplňku do databáze
        const createdComplement = complementDao.create(complement);

        // odeslání emailové notifikace příjemci doplňku
        const recipientName = userDao.get(complement.recipient).name;
        const senderName = userDao.get(userId).name;
        const recipientEmail = userDao.get(complement.recipient).email;

        const sendReq = {
            sender: senderName,
            recipient: recipientName,
            recipientMail: recipientEmail,
            complementName: createdComplement.name,
        };

        sendMail(sendReq, "createdComplementNotification");

        res.json(createdComplement);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
}

module.exports = CreateComplementAbl;
