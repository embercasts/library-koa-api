export default (sequelize, DataTypes) => {
  const Author = sequelize.define('Author', {
    first: DataTypes.STRING,
    last: DataTypes.STRING
  });

  return Author;
}
