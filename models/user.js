import NotFound from '../errors/not-found';

const createModel = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,

        async unique(value) {
          const count = await User.count({ where: { email: value }});

          if (count > 0) {
            throw new Error('email has already been taken');
          }
        }
      }
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,

        async unique(value) {
          const count = await User.count({ where: { username: value }});

          if (count > 0) {
            throw new Error('username has already been taken');
          }
        }
      }
    },
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: false
    },

    password: {
      type: DataTypes.VIRTUAL,
      validate: {
        notEmpty: true,
        confirm(value) {
          if (value !== this.passwordConfirmation) {
            throw new Error(`password doesn't match confirmation`);
          }
        }
      }
    },

    passwordConfirmation: {
      type: DataTypes.VIRTUAL,
      validate: {
        notEmpty: true
      }
    },
  }, {});
  User.associate = function(models) {
    // associations can be defined here
  };

  User.findByEmail = async (email) => {
    const user = await User.findOne({
      where: { email }
    });

    if (user === null) {
      throw new NotFound();
    }

    return user;
  };

  return User;
};
export default createModel;
