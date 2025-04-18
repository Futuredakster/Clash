const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  const Divisions = sequelize.define('Divisions', {
    division_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    tournament_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'tournaments', // Ensure this matches the name of your Tournaments model
        key: 'tournament_id'
      },
      onDelete: 'CASCADE'
    },
    age_group: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    proficiency_level: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    gender: {
      type: DataTypes.STRING(10), // Adjust the length as needed
      allowNull: true // Set to false if this field is required
    },
    category: {
      type: DataTypes.STRING(20), // Adjust the length as needed
      allowNull: false // Set to true if this field is optional
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    modified_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      onUpdate: Sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    sequelize,
    tableName: 'Divisions',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "division_id" },
        ]
      },
      {
        name: "unique_division",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "tournament_id" },
          { name: "age_group" },
          { name: "proficiency_level" }
        ]
      },
      {
        name: "tournament_id",
        using: "BTREE",
        fields: [
          { name: "tournament_id" },
        ]
      }
    ]
  });


  // Hooks for updating timestamps
  Divisions.beforeCreate((division, options) => {
    division.created_at = new Date();
    division.modified_at = new Date();
  });

  Divisions.beforeUpdate((division, options) => {
    division.modified_at = new Date();
  });


  Divisions.associate = function(models) {
    // Define many-to-many association with Participant
    Divisions.belongsToMany(models.participant, {
      through: 'ParticipantDivision',
      foreignKey: 'division_id',
      otherKey: 'participant_id'
    });
  };

  Divisions.associate = (models) => {
    Divisions.hasMany(models.ParticipantDivision, {
      foreignKey: 'division_id',
      as: 'participantDivisions'
    });
  };

  return Divisions;
};
