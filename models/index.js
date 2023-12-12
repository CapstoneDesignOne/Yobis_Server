const Sequelize = require('sequelize');
const Member = require('./member');
const Challenger = require('./challenger');
const YogaPro = require('./yogapro');

const YogaPose = require('./yogapose');
const ExUP = require('./pose/excellent_upper');
const ExLO = require('./pose/excellent_lower');
const GoUP = require('./pose/good_upper');
const GoLO = require('./pose/good_lower');
const NoUP = require('./pose/nomal_upper');
const NoLO = require('./pose/nomal_lower');

const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const db = {};

const sequelize = new Sequelize(config.dadtabase, config.username, config.password, config);

db.sequelize = sequelize;
db.Member = Member;
db.Challenger = Challenger;
db.YogaPro = YogaPro;

db.YogaPose = YogaPose;
db.ExUP = ExUP;
db.ExLO = ExLO;
db.GoUP = GoUP;
db.GoLO = GoLO;
db.NoUP = NoUP;
db.NoLO = NoLO;

Member.init(sequelize);
Challenger.init(sequelize);
YogaPro.init(sequelize);

YogaPose.init(sequelize);
ExUP.init(sequelize);
ExLO.init(sequelize);
GoUP.init(sequelize);
GoLO.init(sequelize);
NoUP.init(sequelize);
NoLO.init(sequelize);

Member.associate(db);
Challenger.associate(db);
YogaPro.associate(db);

YogaPose.associate(db);
ExUP.associate(db);
ExLO.associate(db);
GoUP.associate(db);
GoLO.associate(db);
NoUP.associate(db);
NoLO.associate(db);

module.exports = db;