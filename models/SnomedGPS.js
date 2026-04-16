const { Sequelize, DataTypes } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'mysql',
  logging: false,
});

const SnomedGPS = sequelize.define(
  'SnomedGPS',
  {
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    term: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    term_clean: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    semantic_tag: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: 'snomedgps',
    timestamps: false,
    indexes: [
      { unique: true, fields: ['code'] },
      { fields: [{ name: 'term_clean', length: 191 }] },
      { fields: ['semantic_tag'] },
      { fields: ['semantic_tag', { name: 'term_clean', length: 191 }] },
    ],
  }
);

const dbSync = process.env.DB_SYNC === 'true' || process.env.DB_SYNC === true;

if (dbSync) {
  console.log('Syncing SNOMED GPS database table...');
  sequelize.sync({ alter: true }).then(() => {
    console.log('SNOMED GPS table created/synced.');
  });
} else {
  console.log('SNOMED GPS alter-sync disabled. Ensuring table exists without schema changes...');
  sequelize.sync({ force: false }).then(() => {
    console.log('SNOMED GPS table checked.');
  });
}

module.exports = SnomedGPS;
