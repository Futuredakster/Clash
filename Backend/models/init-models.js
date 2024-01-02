var DataTypes = require("sequelize").DataTypes;
var _accounts = require("./accounts");
var _attendees = require("./attendees");
var _brackets = require("./brackets");
var _participants = require("./participants");
var _schedule = require("./schedule");
var _tournaments = require("./tournaments");
var _users = require("./users");


function initModels(sequelize) {
  var accounts = _accounts(sequelize, DataTypes);
  var attendees = _attendees(sequelize, DataTypes);
  var brackets = _brackets(sequelize, DataTypes);
  var participants = _participants(sequelize, DataTypes);
  var schedule = _schedule(sequelize, DataTypes);
  var tournaments = _tournaments(sequelize, DataTypes);
  var users = _users(sequelize, DataTypes);
 

  attendees.belongsTo(accounts, { as: "account", foreignKey: "account_id"});
  accounts.hasMany(attendees, { as: "attendees", foreignKey: "account_id"});
  participants.belongsTo(accounts, { as: "account", foreignKey: "account_id"});
  accounts.hasMany(participants, { as: "participants", foreignKey: "account_id"});
  tournaments.belongsTo(accounts, { as: "account", foreignKey: "account_id"});
  accounts.hasMany(tournaments, { as: "tournaments", foreignKey: "account_id"});
  attendees.belongsTo(tournaments, { as: "tournament", foreignKey: "tournament_id"});
  tournaments.hasMany(attendees, { as: "attendees", foreignKey: "tournament_id"});
  brackets.belongsTo(tournaments, { as: "tournament", foreignKey: "tournament_id"});
  tournaments.hasMany(brackets, { as: "brackets", foreignKey: "tournament_id"});
  participants.belongsTo(tournaments, { as: "tournament", foreignKey: "tournament_id"});
  tournaments.hasMany(participants, { as: "participants", foreignKey: "tournament_id"});
  schedule.belongsTo(tournaments, { as: "tournament", foreignKey: "tournament_id"});
  tournaments.hasMany(schedule, { as: "schedules", foreignKey: "tournament_id"});
  attendees.belongsTo(users, { as: "user", foreignKey: "user_id"});
  users.hasMany(attendees, { as: "attendees", foreignKey: "user_id"});
  participants.belongsTo(users, { as: "user", foreignKey: "user_id"});
  users.hasMany(participants, { as: "participants", foreignKey: "user_id"});


  return {
    accounts,
    attendees,
    brackets,
    participants,
    schedule,
    tournaments,
    users,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
