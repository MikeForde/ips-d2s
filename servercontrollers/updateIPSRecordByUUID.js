// servercontrollers/ipsCRUD_UD.js
const { IPSModel } = require('../models/IPSModel');
const { MongoToSQL } = require('./MySQLHelpers/MongoToSQL');
const { SQLToMongoSingle } = require('./MySQLHelpers/SQLToMongo');

async function updateIPSByUUID(req, res) {
    const { uuid } = req.params;
    const updatedData = req.body;

    if (uuid) {
        try {
            const ips = await IPSModel.findOne({ where: { packageUUID: uuid } });

            if (!ips) {
                return res.status(404).send("IPS not found.");
            }

            // Update patient data
            if (updatedData.patient) {
                Object.assign(ips.dataValues, MongoToSQL({ patient: updatedData.patient }));
            }

            // Append new medication, allergies, conditions, and observations
            if (updatedData.medication) {
                ips.dataValues.medication = ips.dataValues.medication.concat(updatedData.medication);
            }
            if (updatedData.allergies) {
                ips.dataValues.allergies = ips.dataValues.allergies.concat(updatedData.allergies);
            }
            if (updatedData.conditions) {
                ips.dataValues.conditions = ips.dataValues.conditions.concat(updatedData.conditions);
            }
            if (updatedData.observations) {
                ips.dataValues.observations = ips.dataValues.observations.concat(updatedData.observations);
            }

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

module.exports = { updateIPSByUUID };
