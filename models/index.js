import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';
import dbConfig from '../config/db';
import NotFoundError from '../errors/not-found';

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = dbConfig[env];
const db = {};
let sequelize;

if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  const Model = db[modelName];

  if (Model.associate) {
    Model.associate(db);
  }

  Model.findOrFail = async (id, options) => {
    let m = await Model.findById(id, options);

    if (m === null) {
      throw new NotFoundError(modelName, id);
    }

    return m;
  };
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
