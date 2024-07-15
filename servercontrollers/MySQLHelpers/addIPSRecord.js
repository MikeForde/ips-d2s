const { IPSModel, Medication, Allergy, Condition, Observation } = require('../../models/IPSModel');
const { MongoToSQL } = require('./MongoToSQL');
const { SQLToMongoSingle } = require('./SQLToMongo');

async function addIPSRecord(ipsData) {
    // Transform data to MySQL format
    const transformedData = await MongoToSQL(ipsData);

    // Create the IPS record
    const newIPS = await IPSModel.create(transformedData);

    // Create associated records
    if (transformedData.medications && transformedData.medications.length) {
        await Medication.bulkCreate(transformedData.medications.map(med => ({
            ...med,
            IPSModelId: newIPS.id
        })));
    }

    if (transformedData.allergies && transformedData.allergies.length) {
        await Allergy.bulkCreate(transformedData.allergies.map(allergy => ({
            ...allergy,
            IPSModelId: newIPS.id
        })));
    }

    if (transformedData.conditions && transformedData.conditions.length) {
        await Condition.bulkCreate(transformedData.conditions.map(condition => ({
            ...condition,
            IPSModelId: newIPS.id
        })));
    }

    if (transformedData.observations && transformedData.observations.length) {
        await Observation.bulkCreate(transformedData.observations.map(observation => ({
            ...observation,
            IPSModelId: newIPS.id
        })));
    }

    // Reload the newIPS to include the associated records
    const reloadedIPS = await IPSModel.findByPk(newIPS.id, {
        include: [
            { model: Medication, as: 'medications' },
            { model: Allergy, as: 'allergies' },
            { model: Condition, as: 'conditions' },
            { model: Observation, as: 'observations' }
        ]
    });

    // Convert back to Mongo format for response
    const mongoFormattedIPS = await SQLToMongoSingle(reloadedIPS);

    return mongoFormattedIPS;
}

module.exports = { addIPSRecord };
