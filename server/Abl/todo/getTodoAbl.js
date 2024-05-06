const Ajv = require("ajv");
const ajv = new Ajv();

const todoDAO = require("../../DAO/todo-dao");

// Definice schématu pro ověření
const schema = {
    type: "object",
    properties: {
        id: { type: "string", minLength: 32, maxLength: 32 }
    },
    required: ["id"],
    additionalProperties: false
};

async function GetAbl(req, res) {
    try {
        // Validace vstupních dat
        const valid = ajv.validate(schema, req.params);
        if (!valid) {
            res.status(400).json({
                code: "invalidInput",
                message: "Invalid input data",
                errors: ajv.errors
            });
            return;
        }

        const { id } = req.params;

        const task = todoDAO.get(id);

        if (task === null) {
            res.status(404).json({
                code: "todoNotFound",
                message: `Todo ${id} not found`,
            });
            return;
        }

        res.json(task);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
}

module.exports = GetAbl;
