export default (sequelize, DataTypes) => {
  const Author = sequelize.define('Author', {
    first: DataTypes.STRING,
    last: DataTypes.STRING
  });

  Author.associate = function(models) {
    Author.hasMany(models.Book);
    Author.belongsTo(models.User);
  };

  return Author;
}
