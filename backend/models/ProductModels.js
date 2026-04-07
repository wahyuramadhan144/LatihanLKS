const Sequelize = require('sequelize');
const db = require('../config/database.js');
const User = require('../models/UserModels.js');

const { DataTypes } = Sequelize;
const Product = db.define('products', {
    uuid:{
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [3, 255]
        }
    },
    price: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
}, { freezeTableName: true });

Product.belongsTo(User, {foreignKey: 'userId'});
User.hasMany(Product);
module.exports = Product;