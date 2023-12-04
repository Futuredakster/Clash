const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
 const brackets= sequelize.define('brackets', {
    bracket_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    tournament_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'tournaments',
        key: 'tournament_id'
      }
    },
    bracket_type: {
      type: DataTypes.STRING(50),
      allowNull: true
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
        name: "tournament_id",
        using: "BTREE",
        fields: [
          { name: "tournament_id" },
        ]
      },
    ]
  });
  return brackets;
};
