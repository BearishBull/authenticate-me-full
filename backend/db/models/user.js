'use strict';
const {
  Model
} = require('sequelize');

const { Validator } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init({
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: [4, 30],
        isNotEmail(value) {
          if (Validator.isEmail(value)) {
            throw new Error('Cannot be an email');
          }
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: [3, 256],
        isEmail: true
      }
    },
    hashedPassword: {
      type: DataTypes.STRING.BINARY,
      allowNull: false,
      validate: {
        len: [60, 60]
      }
    }
  }, {
    sequelize,
    modelName: 'User',
    defaultScope: {
      attributes: {
        exclude: ['hashedPassword', 'email', 'createdAt', 'updatedAt']
      }
    },
    scopes: {
      currentUser: {
        attributes: { exclude: ['hashedPassword'] }
      },
      loginUser: {
        attributes: {}
      }
    }
  });

  // return safe object to save to JWT
  User.prototype.toSafeObject = function() {
    const {id, username, email} = this;
    return {id, username, email}
  };

  // Compare input vs saved passwords
  User.prototype.validatePassword = function(password) {
    return bcrypt.compareSync(password, this.hashedPassword.toString());
  }

  User.getCurrentUserById= async function (id) {
    return await User.scope('currentUser').findByPk(id);
  };

  // Find user and Compare passwords. If valid, return currentUser information
  User.login = async function ({ credential, password}){
    const {Op} = require('sequelize');
    const user = await User.scope('loginUser').findOne({
      where: {
        [Op.or]: {
          username: credential,
          email: credential
        }
      }
    });
    if (user && user.validatePassword(password)){
      return await User.scope('currentUser').findByPk(user.id)
    }
  };

  // Add user from sign up.... Duplication gets Validation Error
  User.signup = async function({username, email, password}) {
    const hashedPassword = bcrypt.hashSync(password);
    const user = await User.create({
      username,
      email,
      hashedPassword
    });
    return await User.scope('currentUser').findByPk(user.id);
  };

  return User;
};