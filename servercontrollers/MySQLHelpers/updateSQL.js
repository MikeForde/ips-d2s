// MySQLHelpers/updateSQL.js

const { MongoToSQL } = require('./MongoToSQL');
const { Medication, Allergy, Condition, Observation, Immunization, Procedure } = require('../../models/IPSModel');

async function updateSQL(ips, updatedData, id) {
    // Transform updated data to MySQL format
    const transformedData = await MongoToSQL(updatedData);

    // Update patient details
    Object.assign(ips, transformedData);

    // Delete existing associated records
    await Medication.destroy({ where: { IPSModelId: id } });
    await Allergy.destroy({ where: { IPSModelId: id } });
    await Condition.destroy({ where: { IPSModelId: id } });
    await Observation.destroy({ where: { IPSModelId: id } });
    await Immunization.destroy({ where: { IPSModelId: id } });
    await Procedure.destroy({ where: { IPSModelId: id } });


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

    if (transformedData.immunizations) {
        await Immunization.bulkCreate(transformedData.immunizations.map(immunization => ({
            ...immunization,
            IPSModelId: id
        })));
    }

    if (transformedData.procedures) {
        await Procedure.bulkCreate(transformedData.procedures.map(procedure => ({
            ...procedure,
            IPSModelId: id
        })));
    }

    // Save the updated IPS
    const updatedIPS = await ips.save();

    return updatedIPS;
}

module.exports = { updateSQL };
