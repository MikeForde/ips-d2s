// server/controllers/updateIPSByUUID.js
const { IPSModel, Medication, Allergy, Condition, Observation, Immunization } = require('../models/IPSModel');
const { updateSQL }    = require('./MySQLHelpers/updateSQL');
const { SQLToMongoSingle } = require('./MySQLHelpers/SQLToMongo');

async function updateIPSByUUID(req, res) {
  const { uuid } = req.params;
  const updatedData = req.body;

  if (!uuid) {
    return res.status(400).send("Missing UUID");
  }

  try {
    // 1) Find the existing row
    const existing = await IPSModel.findOne({ where: { packageUUID: uuid } });
    if (!existing) {
      return res.status(404).send("IPS not found.");
    }

    // 2) Delegate to your SQL‑helper to handle field transforms + assoc updates
    await updateSQL(existing, updatedData, existing.id);

    // 3) Reload with associations
    const reloaded = await IPSModel.findByPk(existing.id, {
      include: [
        { model: Medication,     as: 'medications'   },
        { model: Allergy,        as: 'allergies'     },
        { model: Condition,      as: 'conditions'    },
        { model: Observation,    as: 'observations'  },
        { model: Immunization,   as: 'immunizations' }
      ]
    });

    // 4) Convert back to Mongo‑format and return
    const mongoFormattedIPS = await SQLToMongoSingle(reloaded);
    res.json(mongoFormattedIPS);

  } catch (err) {
    console.error("updateIPSByUUID error:", err);
    res.status(400).send(err.message || err);
  }
}

module.exports = { updateIPSByUUID };
