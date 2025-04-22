// server/controllers/MySQLHelpers/upsertIPSRecord.js

const { IPSModel } = require('../../models/IPSModel');
const { addIPSRecord } = require('./addIPSRecord');
const { updateSQL }    = require('./updateSQL');
const { SQLToMongoSingle } = require('./SQLToMongo');

/**
 * Create or update an IPS record in MySQL, then return it in Mongo format.
 * @param {Object} ipsData  JSON payload in Mongo shape
 * @returns {Promise<Object>}  Mongo‑formatted record
 */
async function upsertIPSRecord(ipsData) {
  // 1) look for an existing record by UUID
  const existing = await IPSModel.findOne({
    where: { packageUUID: ipsData.packageUUID },
    include: [
      'medications','allergies','conditions','observations','immunizations'
    ]
  });

  let result;

  if (existing) {
    // 2a) update path
    const updated = await updateSQL(existing, ipsData, existing.id);
    // reload with associations & convert back to Mongo shape
    result = await SQLToMongoSingle(
      await IPSModel.findByPk(existing.id, {
        include: [
          'medications','allergies','conditions','observations','immunizations'
        ]
      })
    );
  } else {
    // 2b) create path
    result = await addIPSRecord(ipsData);
  }

  return result;
}

module.exports = { upsertIPSRecord };
