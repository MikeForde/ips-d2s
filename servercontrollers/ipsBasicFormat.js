const { IPSModel } = require('../models/IPSModel');
const { validate: isValidUUID } = require('uuid');
const { SQLToMongoSingle } = require('./MySQLHelpers/SQLToMongo');

// Define the getIPSBasic function
const getIPSBasic = async (req, res) => {
    const id = req.params.id;
    let query;

    // Check if the provided ID is a valid UUID
    if (isValidUUID(id)) {
        // Search using packageUUID if it is a valid UUID
        query = IPSModel.findOne({ where: { packageUUID: id } });
    } else {
        // Otherwise, search by primary key (id)
        query = IPSModel.findByPk(id);
    }

    try {
        const ipsRecord = await query;

        // If the record is not found, return a 404 error
        if (!ipsRecord) {
            return res.status(404).send('IPS record not found');
        }

        // Transform the IPS record to the desired format
        const transformedIpsRecord = await SQLToMongoSingle(ipsRecord);

        // Construct the plain text response format
        let basicInfo = '';
        basicInfo += `${transformedIpsRecord.packageUUID}\r\n`;
        basicInfo += `${transformedIpsRecord.timeStamp.toISOString()}\r\n`;
        basicInfo += `${transformedIpsRecord.patient.name}\r\n`;
        basicInfo += `${transformedIpsRecord.patient.given}\r\n`;

        // Format date of birth to yyyy-mm-dd
        const dob = transformedIpsRecord.patient.dob.toISOString().substring(0, 10);
        basicInfo += `${dob}\r\n`;

        basicInfo += `${transformedIpsRecord.patient.gender}\r\n`;
        basicInfo += `${transformedIpsRecord.patient.nation}\r\n`;
        basicInfo += `${transformedIpsRecord.patient.practitioner}\r\n`;
        basicInfo += `${transformedIpsRecord.patient.organization}\r\n`;

        // Append medication information
        transformedIpsRecord.medication.forEach((med) => {
            // Format medication date to yyyy-mm-dd
            const medDate = med.date.toISOString().substring(0, 10);
            basicInfo += `M:\r\n${med.name}\r\n${medDate}\r\n${med.dosage}\r\n`;
        });

        // Append allergy information
        transformedIpsRecord.allergies.forEach((allergy) => {
            // Format allergy date to yyyy-mm-dd
            const allergyDate = allergy.date.toISOString().substring(0, 10);
            basicInfo += `A:\r\n${allergy.name}\r\n${allergy.criticality}\r\n${allergyDate}\r\n`;
        });

        // Append condition information
        transformedIpsRecord.conditions.forEach((condition) => {
            // Format condition date to yyyy-mm-dd
            const conditionDate = condition.date.toISOString().substring(0, 10);
            basicInfo += `C:\r\n${condition.name}\r\n${conditionDate}\r\n`;
        });

        // Append observation information
        transformedIpsRecord.observations.forEach((observation) => {
            // Format observation date to yyyy-mm-dd
            const observationDate = observation.date.toISOString().substring(0, 10);
            basicInfo += `O:\r\n${observation.name}\r\n${observationDate}\r\n${observation.value}\r\n`;
        });

        // Send the plain text response
        res.set('Content-Type', 'text/plain');
        res.send(basicInfo);
    } catch (error) {
        console.error('Error fetching IPS record:', error);
        res.status(500).send('Internal Server Error');
    }
};

// Export the getIPSBasic function
module.exports = getIPSBasic;
