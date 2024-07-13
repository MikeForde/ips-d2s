const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('test', 'root', 'password', {
    host: '172.17.0.2',
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
}, {
    tableName: 'ipsAlt'
});

const Medication = sequelize.define('Medication', {
    name: DataTypes.STRING,
    date: DataTypes.DATE,
    dosage: DataTypes.STRING,
});

const Allergy = sequelize.define('Allergy', {
    name: DataTypes.STRING,
    criticality: DataTypes.STRING,
    date: DataTypes.DATE
});

const Condition = sequelize.define('Condition', {
    name: DataTypes.STRING,
    date: DataTypes.DATE
});

const Observation = sequelize.define('Observation', {
    name: DataTypes.STRING,
    date: DataTypes.DATE,
    value: DataTypes.STRING
});

IPSModel.hasMany(Medication, { as: 'medications' });
Medication.belongsTo(IPSModel);

IPSModel.hasMany(Allergy, { as: 'allergies' });
Allergy.belongsTo(IPSModel);

IPSModel.hasMany(Condition, { as: 'conditions' });
Condition.belongsTo(IPSModel);

IPSModel.hasMany(Observation, { as: 'observations' });
Observation.belongsTo(IPSModel);

sequelize.sync({ force: false }).then(() => {
    console.log('Database & tables created!');
});

module.exports = { IPSModel, Medication, Allergy, Condition, Observation };
