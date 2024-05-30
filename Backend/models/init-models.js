var DataTypes = require("sequelize").DataTypes;
var _accounts = require("./accounts");
var _attendees = require("./attendees");
var _brackets = require("./brackets");
var _participant = require("./participant");
var _schedule = require("./schedule");
var _tournaments = require("./tournaments");
var _users = require("./users");

function initModels(sequelize) {
  var accounts = _accounts(sequelize, DataTypes);
  var attendees = _attendees(sequelize, DataTypes);
  var brackets = _brackets(sequelize, DataTypes);
  var participant = _participant(sequelize, DataTypes);
  var schedule = _schedule(sequelize, DataTypes);
  var tournaments = _tournaments(sequelize, DataTypes);
  var users = _users(sequelize, DataTypes);
 
  // Define associations
  attendees.belongsTo(accounts, { as: "account", foreignKey: "account_id" });
  accounts.hasMany(attendees, { as: "attendees", foreignKey: "account_id" });

  participant.belongsTo(accounts, { as: "account", foreignKey: "account_id" });
  accounts.hasMany(participant, { as: "participants", foreignKey: "account_id" });

  tournaments.belongsTo(accounts, { as: "account", foreignKey: "account_id" });
  accounts.hasMany(tournaments, { as: "tournaments", foreignKey: "account_id" });

  attendees.belongsTo(tournaments, { as: "tournament", foreignKey: "tournament_id" });
  tournaments.hasMany(attendees, { as: "attendees", foreignKey: "tournament_id" });

  brackets.belongsTo(tournaments, { as: "tournament", foreignKey: "tournament_id" });
  tournaments.hasMany(brackets, { as: "brackets", foreignKey: "tournament_id" });

  participant.belongsTo(tournaments, { as: "tournament", foreignKey: "tournament_id" });
  tournaments.hasMany(participant, { as: "participants", foreignKey: "tournament_id" });

  schedule.belongsTo(tournaments, { as: "tournament", foreignKey: "tournament_id" });
  tournaments.hasMany(schedule, { as: "schedules", foreignKey: "tournament_id" });

  attendees.belongsTo(users, { as: "user", foreignKey: "user_id" });
  users.hasMany(attendees, { as: "attendees", foreignKey: "user_id" });

  participant.belongsTo(users, { as: "user", foreignKey: "user_id" });
  users.hasMany(participant, { as: "participants", foreignKey: "user_id" });

  return {
    accounts,
    attendees,
    brackets,
    participant,
    schedule,
    tournaments,
    users,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
