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
    },
    participant_id1: {
      type: DataTypes.INTEGER, // Assuming participant IDs are integers
      allowNull: false, // Set to true if this can be nullable
      references: {
        model: 'Participants', // Ensure the model name matches the actual Participants model
        key: 'participant_id'
      }
    },
    participant_id2: {
      type: DataTypes.INTEGER, // Assuming participant IDs are integers
      allowNull: false, // Set to true if this can be nullable
      references: {
        model: 'Participants', // Ensure the model name matches the actual Participants model
        key: 'participant_id'
      }
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

