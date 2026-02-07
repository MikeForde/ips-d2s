// servercontrollers/ipsCRUD_UD.js
const { IPSModel, Medication, Allergy, Condition, Observation, Immunization, Procedure } = require('../models/IPSModel');
const { SQLToMongoSingle } = require('./MySQLHelpers/SQLToMongo');
const { updateSQL } = require('./MySQLHelpers/updateSQL');
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
                    { model: Observation, as: 'observations' },
                    { model: Immunization, as: 'immunizations' },
                    { model: Procedure, as: 'procedures' }
                      // Include immunizations
                ]
            });

            if (!ips) {
                return res.status(404).send("IPS not found.");
            }

            // Use the helper function to update the IPS record
            const updatedIPS = await updateSQL(ips, updatedData, id);

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
            const ips = await IPSModel.findByPk(id, {
                include: [
                    { model: Medication, as: 'medications' },
                    { model: Allergy, as: 'allergies' },
                    { model: Condition, as: 'conditions' },
                    { model: Observation, as: 'observations' },
                    { model: Immunization, as: 'immunizations' },
                    { model: Procedure, as: 'procedures' }
                ]
            });

            if (!ips) {
                return res.status(404).send("IPS not found.");
            }

            // Delete associated records
            await Medication.destroy({ where: { IPSModelId: id } });
            await Allergy.destroy({ where: { IPSModelId: id } });
            await Condition.destroy({ where: { IPSModelId: id } });
            await Observation.destroy({ where: { IPSModelId: id } });
            await Immunization.destroy({ where: { IPSModelId: id } });
            await Procedure.destroy({ where: { IPSModelId: id } });

            // Delete the IPS record
            await ips.destroy();

            res.json(ips.id);
        } catch (err) {
            console.log(err);
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
            // Find all IPS records that match the practitioner's name
            const ipsRecords = await IPSModel.findAll({
                where: {
                    patientPractitioner: { [Op.iLike]: practitioner }
                },
                include: [
                    { model: Medication, as: 'medications' },
                    { model: Allergy, as: 'allergies' },
                    { model: Condition, as: 'conditions' },
                    { model: Observation, as: 'observations' },
                    { model: Immunization, as: 'immunizations' },
                    { model: Procedure, as: 'procedures' }
                ]
            });

            if (!ipsRecords.length) {
                return res.status(404).send("No IPS records found for the specified practitioner.");
            }

            // Collect all IPS record IDs
            const ipsIds = ipsRecords.map(ips => ips.id);

            // Delete associated records
            await Medication.destroy({ where: { IPSModelId: ipsIds } });
            await Allergy.destroy({ where: { IPSModelId: ipsIds } });
            await Condition.destroy({ where: { IPSModelId: ipsIds } });
            await Observation.destroy({ where: { IPSModelId: ipsIds } });
            await Immunization.destroy({ where: { IPSModelId: ipsIds } });
            await Procedure.destroy({ where: { IPSModelId: ipsIds } });

            // Delete the IPS records
            await IPSModel.destroy({ where: { id: ipsIds } });

            res.json({ message: `${ipsRecords.length} IPS record(s) and associated records deleted.` });
        } catch (err) {
            console.log(err);
            res.status(400).send(err);
        }
    } else {
        res.status(400).send("Practitioner parameter is missing.");
    }
}


module.exports = { updateIPS, deleteIPS, deleteIPSbyPractitioner };
