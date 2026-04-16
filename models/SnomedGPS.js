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
      { fields: ['term_clean'] },
      { fields: ['semantic_tag'] },
      { fields: ['semantic_tag', 'term_clean'] },
    ],
  }
);

module.exports = SnomedGPS;
