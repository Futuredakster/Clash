const Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
  const brackets = sequelize.define('brackets', {
    bracket_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    division_id: {
      type: DataTypes.INTEGER,
      allowNull: true, // Set to false if it should not be nullable
      references: {
        model: 'Divisions', // Ensure the model name matches the actual Divisions model
        key: 'division_id'
      }
    },
    user1: {
      type: DataTypes.STRING(255), // Adjust length as needed
      allowNull: true // Set to false if it should not be nullable
    },
    user2: {
      type: DataTypes.STRING(255), // Adjust length as needed
      allowNull: true // Set to false if it should not be nullable
    }
  }, {
    sequelize,
    tableName: 'brackets',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "bracket_id" },
        ]
      },
      {
        name: "division_id",
        using: "BTREE",
        fields: [
          { name: "division_id" },
        ]
      },
    ]
  });
  
  return brackets;
};
