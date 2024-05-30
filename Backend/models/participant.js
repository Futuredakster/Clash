const Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
  const participant = sequelize.define('participant', {
    participant_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    date_of_birth: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    belt_color: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    division_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Divisions',
        key: 'division_id',
        name: 'fk_participant_division_id' // Explicitly name the foreign key constraint
      }
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    created_at: { // Add the created_at field
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.NOW
    },
    modified_at: { // Add the modified_at field
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.NOW
    }
  }, {
    sequelize,
    tableName: 'participant',
    timestamps: true, // Enable automatic timestamps
    createdAt: 'created_at', // Specify the name of the createdAt field
    updatedAt: 'modified_at', // Specify the name of the updatedAt field
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "division_id",
        using: "BTREE",
        fields: [
          { name: "division_id" },
        ]
      }
    ]
  });

  // Set up the association with Divisions
  participant.associate = function(models) {
    participant.belongsTo(models.Divisions, { foreignKey: 'division_id' });
  };

  return participant;
};

