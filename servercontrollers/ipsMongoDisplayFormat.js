const { resolveId } = require('../utils/resolveId');

async function getMongoFormatted(req, res) {
  const {id} = req.params;

  try {
    // Resolve the ID and fetch the IPS record
    const ips = await resolveId(id);

    // If the record is not found, return a 404 error
    if (!ips) {
        return res.status(404).send('IPS record not found');
    }

    // Format the response data
    const formattedData = {
      packageUUID: ips.packageUUID,
      timeStamp: ips.timeStamp,
      patient: {
        name: ips.patient.name,
        given: ips.patient.given,
        dob: ips.patient.dob,
        gender: ips.patient.gender,
        practitioner: ips.patient.practitioner,
        nation: ips.patient.nation,
        organization: ips.patient.organization
      },
      medication: ips.medication.map(med => ({
        name: med.name,
        date: med.date,
        dosage: med.dosage,
        system: med.system,
        code: med.code,
        status: med.status
      })),
      allergies: ips.allergies.map(allergy => ({
        name: allergy.name,
        criticality: allergy.criticality, 
        date: allergy.date,
        code: allergy.code,
        system: allergy.system
      })),
      conditions: ips.conditions.map(condition => ({
        name: condition.name,
        date: condition.date,
        code: condition.code,
        system: condition.system
      })),
      observations: ips.observations.map(observation => ({
        name: observation.name,
        date: observation.date,
        value: observation.value,
        system: observation.system,
        code: observation.code,
        valueCode: observation.valueCode,
        bodySite: observation.bodySite
      })),
      immunizations: ips.immunizations.map(immunization => ({
        name: immunization.name,
        system: immunization.system,
        date: immunization.date,
        code: immunization.code,
        status: immunization.status
      }))
    };

    if (req.query.pretty === 'true') {
      // Return formatted JSON with indentation for readability
      const formattedJson = JSON.stringify(formattedData, null, "\t");
      res.send(formattedJson);
    } else {
      // Return JSON without formatting
      res.json(formattedData);
    }
  } catch (err) {
    console.error('Error fetching Mongo formatted record:', err);
    res.status(400).send(err);
  }
}

module.exports = { getMongoFormatted };
