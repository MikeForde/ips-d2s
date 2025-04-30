const { Sequelize, DataTypes } = require('sequelize');
const dotenv = require('dotenv');
const { status } = require('@grpc/grpc-js');

// Load environment variables from .env file
dotenv.config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'mysql'
});

const IPSModel = sequelize.define('IPSModel', {
    packageUUID: {
        type: DataTypes.STRING,
        allowNull: false
    },
    timeStamp: {
        type: DataTypes.DATE,
        allowNull: false
    },
    patientName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    patientGiven: {
        type: DataTypes.STRING,
        allowNull: false
    },
    patientDob: {
        type: DataTypes.DATE,
        allowNull: false
    },
    patientGender: {
        type: DataTypes.STRING,
        allowNull: true
    },
    patientNation: {
        type: DataTypes.STRING,
        allowNull: false
    },
    patientPractitioner: {
        type: DataTypes.STRING,
        allowNull: false
    },
    patientOrganization: {
        type: DataTypes.STRING,
        allowNull: true
    },
    patientIdentifier: {
        type: DataTypes.STRING,
        allowNull: true
    },
    patientIdentifier2: {
        type: DataTypes.STRING,
        allowNull: true
    },
}, {
    tableName: 'ipsAlt'
});

const Medication = sequelize.define('Medication', {
    name: DataTypes.STRING,
    date: DataTypes.DATE,
    dosage: DataTypes.STRING,
    system: DataTypes.STRING,
    code: DataTypes.STRING,
    status: DataTypes.STRING,
});

const Allergy = sequelize.define('Allergy', {
    name: DataTypes.STRING,
    criticality: DataTypes.STRING,
    date: DataTypes.DATE,
    system: DataTypes.STRING,
    code: DataTypes.STRING,
});

const Condition = sequelize.define('Condition', {
    name: DataTypes.STRING,
    date: DataTypes.DATE,
    system: DataTypes.STRING,
    code: DataTypes.STRING,
});

const Observation = sequelize.define('Observation', {
    name: DataTypes.STRING,
    date: DataTypes.DATE,
    value: DataTypes.STRING,
    system: DataTypes.STRING,
    code: DataTypes.STRING,
    valueCode: DataTypes.STRING,
    bodySite: DataTypes.STRING,
    status: DataTypes.STRING,
});

const Immunization = sequelize.define('Immunization', {
    name: DataTypes.STRING,
    system: DataTypes.STRING,
    date: DataTypes.DATE,
    code: DataTypes.STRING,
    status: DataTypes.STRING,
});

IPSModel.hasMany(Medication, { as: 'medications' });
Medication.belongsTo(IPSModel);

IPSModel.hasMany(Allergy, { as: 'allergies' });
Allergy.belongsTo(IPSModel);

IPSModel.hasMany(Condition, { as: 'conditions' });
Condition.belongsTo(IPSModel);

IPSModel.hasMany(Observation, { as: 'observations' });
Observation.belongsTo(IPSModel);

IPSModel.hasMany(Immunization, { as: 'immunizations'});
Immunization.belongsTo(IPSModel);

// Sync all models with the database 
// This will create the tables if they do not exist and add/remove fields if they have changed
// Note: This should be removed in production as it can lead to data loss = usual setting is force: false
// We'll control whether the setting is alter: true or force: false based on an environment variable called DB_SYNC, which will either be true vs (false or absent)

const dbSync = process.env.DB_SYNC === 'true' || process.env.DB_SYNC === true;

if (dbSync) {
    console.log('Syncing database...');
    sequelize.sync({ alter: true }).then(() => {
        console.log('Database & tables created!');
    });
}
else {
    console.log('Not syncing database...');
    sequelize.sync({ force: false }).then(() => {
        console.log('Database & tables created!');
    });
}

module.exports = { IPSModel, Medication, Allergy, Condition, Observation, Immunization };
