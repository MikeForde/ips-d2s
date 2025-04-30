const { Medication, Allergy, Condition, Observation, Immunization } = require('../../models/IPSModel');

async function transformRecord(record) {
    const medications = await Medication.findAll({ where: { IPSModelId: record.id } });
    const allergies = await Allergy.findAll({ where: { IPSModelId: record.id } });
    const conditions = await Condition.findAll({ where: { IPSModelId: record.id } });
    const observations = await Observation.findAll({ where: { IPSModelId: record.id } });
    const immunizations = await Immunization.findAll({ where: { IPSModelId: record.id } });

    return {
        patient: {
            name: record.patientName,
            given: record.patientGiven,
            dob: record.patientDob,
            gender: record.patientGender,
            nation: record.patientNation,
            practitioner: record.patientPractitioner,
            organization: record.patientOrganization,
            identifier: record.patientIdentifier,
            identifier2: record.patientIdentifier2
        },
        _id: record.id,  // Using 'id' from MySQL as '_id'
        packageUUID: record.packageUUID,
        timeStamp: record.timeStamp,
        medication: medications.map(med => med.dataValues),
        allergies: allergies.map(allergy => allergy.dataValues),
        conditions: conditions.map(cond => cond.dataValues),
        observations: observations.map(obs => obs.dataValues),
        immunizations: immunizations.map(imm => imm.dataValues),
        __v: 0  // Default value for version
    };
}

async function SQLToMongo(ipss) {
    const transformedIpss = await Promise.all(ipss.map(record => transformRecord(record.dataValues)));
    return transformedIpss;
}

async function SQLToMongoSingle(record) {
    return await transformRecord(record.dataValues);
}

module.exports = { SQLToMongoSingle, SQLToMongo };
