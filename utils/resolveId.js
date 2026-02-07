const { validate: isValidUUID } = require('uuid');
const { IPSModel } = require('../models/IPSModel');
const { SQLToMongoSingle } = require('../servercontrollers/MySQLHelpers/SQLToMongo');

/**
 * Resolves an ID to an IPSModel record based on the following logic:
 * 1. If the ID is a valid UUID, search by `packageUUID`.
 * 2. If the ID is not a UUID, search by `packageUUID`.
 * 3. If no record is found in step 2, search by the primary key (`id`).
 *
 * @param {string} id - The ID to resolve.
 * @returns {Promise} - A promise resolving to the record or `null`.
 */
async function resolveId(id) {
    if (isValidUUID(id)) {
        console.log("Valid UUID, searching by packageUUID...");
        return await IPSModel.findOne({ where: { packageUUID: id } });
    }

    console.log("Not a valid UUID, searching by packageUUID...");
    var record = await IPSModel.findOne({ where: { packageUUID: id } });

    // Fallback to search by primary key (`id`) if no record is found.
    if (!record) {
        console.log("Searching by primary key (id)...");
        record = await IPSModel.findByPk(id);
    }

    // Transform to MongoDb
    if (record) {
        record = SQLToMongoSingle(record);
    }

    return record;
}

module.exports = { resolveId };
