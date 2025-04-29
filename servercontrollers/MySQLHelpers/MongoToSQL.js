// MongoToSQL.js
const { Medication, Allergy, Condition, Observation, Immunization } = require('../../models/IPSModel');

function transformPatientData(patient) {
  return {
    patientName: patient.name,
    patientGiven: patient.given,
    patientDob: patient.dob,
    patientGender: patient.gender,
    patientNation: patient.nation,
    patientPractitioner: patient.practitioner,
    patientOrganization: patient.organization,
    patientIdentifier: patient.identifier,
  };
}

async function MongoToSQL(data) {
  const transformedData = {
    packageUUID: data.packageUUID,
    timeStamp: data.timeStamp,
    ...transformPatientData(data.patient),
    medications: data.medication,
    allergies: data.allergies,
    conditions: data.conditions,
    observations: data.observations,
    immunizations: data.immunizations
  };

  // Create associations if necessary
  if (data.medication && data.medication.length > 0) {
    transformedData.medications = data.medication.map(med => ({
      name: med.name,
      date: med.date,
      dosage: med.dosage,
      system: med.system,
      code: med.code,
      status: med.status
    }));
  }

  if (data.allergies && data.allergies.length > 0) {
    transformedData.allergies = data.allergies.map(allergy => ({
      name: allergy.name,
      criticality: allergy.criticality,
      date: allergy.date,
      system: allergy.system,
      code: allergy.code
    }));
  }

  if (data.conditions && data.conditions.length > 0) {
    transformedData.conditions = data.conditions.map(condition => ({
      name: condition.name,
      date: condition.date,
      system: condition.system,
      code: condition.code
    }));
  }

  if (data.observations && data.observations.length > 0) {
    transformedData.observations = data.observations.map(observation => ({
      name: observation.name,
      date: observation.date,
      value: observation.value,
      system: observation.system,
      code: observation.code,
      valueCode: observation.valueCode,
      bodySite: observation.bodySite,
    }));
  }

  if (data.immunizations && data.immunizations.length > 0) {
    transformedData.immunizations = data.immunizations.map(immunization => ({
      name: immunization.name,
      system: immunization.system,
      date: immunization.date,
      code: immunization.code,
      status: immunization.status
    }));
  }

  return transformedData;
}

async function MongoToSQLMany(dataArray) {
  return Promise.all(dataArray.map(data => MongoToSQL(data)));
}

module.exports = { MongoToSQL, MongoToSQLMany };
