// servercontrollers/ipsCRUD_UD.js
const { IPSModel, Medication, Allergy, Condition, Observation } = require('../models/IPSModel');
const { MongoToSQL } = require('./MySQLHelpers/MongoToSQL');
const { SQLToMongoSingle } = require('./MySQLHelpers/SQLToMongo');
const { Op } = require('sequelize');

async function updateIPS(req, res) {
    const { id } = req.params;
    const updatedData = req.body;

    if (id) {
        try {
            const ips = await IPSModel.findByPk(id, {
                include: [
                    { model: Medication, as: 'medications' },
                    { model: Allergy, as: 'allergies' },
                    { model: Condition, as: 'conditions' },
                    { model: Observation, as: 'observations' }
                ]
            });

            if (!ips) {
                return res.status(404).send("IPS not found.");
            }

            // Transform updated data to MySQL format
            const transformedData = await MongoToSQL(updatedData);

            // Update patient details
            Object.assign(ips, transformedData);

            // Delete existing associated records
            await Medication.destroy({ where: { IPSModelId: id } });
            await Allergy.destroy({ where: { IPSModelId: id } });
            await Condition.destroy({ where: { IPSModelId: id } });
            await Observation.destroy({ where: { IPSModelId: id } });

            // Recreate associated records if they exist in the transformed data
            if (transformedData.medications) {
                await Medication.bulkCreate(transformedData.medications.map(med => ({
                    ...med,
                    IPSModelId: id
                })));
            }

            if (transformedData.allergies) {
                await Allergy.bulkCreate(transformedData.allergies.map(allergy => ({
                    ...allergy,
                    IPSModelId: id
                })));
            }

            if (transformedData.conditions) {
                await Condition.bulkCreate(transformedData.conditions.map(condition => ({
                    ...condition,
                    IPSModelId: id
                })));
            }

            if (transformedData.observations) {
                await Observation.bulkCreate(transformedData.observations.map(observation => ({
                    ...observation,
                    IPSModelId: id
                })));
            }

            // Save the updated IPS
            const updatedIPS = await ips.save();

            // Convert back to Mongo format for response
            const mongoFormattedIPS = await SQLToMongoSingle(updatedIPS);

            res.json(mongoFormattedIPS);
        } catch (err) {
            console.log(err);
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
