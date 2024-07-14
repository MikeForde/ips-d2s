// servercontrollers/ipsCRUD_UD.js
const { IPSModel } = require('../models/IPSModel');
const { MongoToSQL } = require('./MySQLHelpers/MongoToSQL');
const { SQLToMongoSingle } = require('./MySQLHelpers/SQLToMongo');
const { Op } = require('sequelize');

async function updateIPS(req, res) {
    const { id } = req.params;
    const updatedData = req.body;

    if (id) {
        try {
            const ips = await IPSModel.findByPk(id);

            if (!ips) {
                return res.status(404).send("IPS not found.");
            }

            // Transform updated data to MySQL format
            const transformedData = await MongoToSQL(updatedData);

            // Update IPS with new data
            Object.assign(ips, transformedData);

            // Save the updated IPS
            const updatedIPS = await ips.save();

            // Convert back to Mongo format for response
            const mongoFormattedIPS = await SQLToMongoSingle(updatedIPS);

            res.json(mongoFormattedIPS);
        } catch (err) {
            res.status(400).send(err);
        }
    } else {
        res.status(404).send("IPS not found.");
    }
}

async function deleteIPS(req, res) {
    const { id } = req.params;

    if (id) {
        try {
            const ips = await IPSModel.findByPk(id);

            if (!ips) {
                return res.status(404).send("IPS not found.");
            }

            await ips.destroy();
            res.json({ message: "IPS record deleted.", id: ips.id });
        } catch (err) {
            res.status(400).send(err);
        }
    } else {
        res.status(400).send("ID parameter is missing.");
    }
}

async function deleteIPSbyPractitioner(req, res) {
    const { practitioner } = req.params;

    if (practitioner) {
        try {
            // Perform case-insensitive deletion of records matching the practitioner's name
            const result = await IPSModel.destroy({
                where: {
                    patientPractitioner: { [Op.iLike]: practitioner }
                }
            });

            res.json({ message: `${result} IPS record(s) deleted.` });
        } catch (err) {
            res.status(400).send(err);
        }
    } else {
        res.status(400).send("Practitioner parameter is missing.");
    }
}

module.exports = { updateIPS, deleteIPS, deleteIPSbyPractitioner };
