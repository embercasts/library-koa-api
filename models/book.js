const createModel = (sequelize, DataTypes) => {
  const Book = sequelize.define('Book', {
    title: DataTypes.STRING,
    isbn: DataTypes.STRING,
    publishDate: DataTypes.DATE
  }, {});

  Book.associate = function(models) {
    Book.belongsTo(models.Author);
    Book.hasMany(models.Review);
    Book.belongsTo(models.User);
  };
  return Book;
};
export default createModel;
