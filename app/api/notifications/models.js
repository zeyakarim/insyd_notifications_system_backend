const { DataTypes } = require('sequelize');
const sequelize = require('../../../config/database');
const isParanoid = true;

const Notifications = sequelize.define('Notifications', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    type: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    text: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    is_read: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: 'is_read'
    },
    session_id: {
        type: DataTypes.STRING,  // Changed from INTEGER to STRING to match Session
        allowNull: false
    }
}, {
    tableName: 'notifications',
    freezeTableName: true,
    underscored: true,
    paranoid: isParanoid
});

module.exports = {
    Notifications
};