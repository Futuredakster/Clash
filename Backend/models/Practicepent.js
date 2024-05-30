const Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
  const Practicepent = sequelize.define('Practicepent', {
    id: {
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
        name: 'fk_practicepent_division_id' // Explicitly name the foreign key constraint
      }
    },
    email: { // Add the email field here
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'practicepent',
    timestamps: false,
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
  Practicepent.associate = function(models) {
    Practicepent.belongsTo(models.Divisions, { foreignKey: 'division_id' });
  };

  return Practicepent;
};
