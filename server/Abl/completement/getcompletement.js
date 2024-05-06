const complementDao = require("../../DAO/complementDAO.js");

async function GetComplementAbl(req, res) {
    try {
        const { complementId } = req.params;

        // získání doplňku z databáze
        const complement = complementDao.get(complementId);

        // kontrola, zda byl doplněk nalezen
        if (!complement) {
            res.status(404).json({
                code: "complementNotFound",
                message: `Doplněk s ID ${complementId} nebyl nalezen.`,
            });
            return;
        }

        // odešle doplněk klientovi
        res.json(complement);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
}

module.exports = GetComplementAbl;
