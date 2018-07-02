const createModel = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false
    },
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: false
    },

    password: {
      type: DataTypes.VIRTUAL
    },

    passwordConfirmation: {
      type: DataTypes.VIRTUAL
    },
  }, {});
  User.associate = function(models) {
    // associations can be defined here
  };
  return User;
};
export default createModel;
