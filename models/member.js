const Sequelize = require('sequelize');

module.exports = class Member extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            user_id : {
                type : Sequelize.STRING(20),
                allowNull : false,
                comment : "사용자 지정 아이디"
            },
            user_pw : {
                type : Sequelize.STRING(150),
                allowNull : false,
                comment : "사용자 비밀번호"
            }
        },
        {
            sequelize,
            timestamps : true,
            underscored : true,
            modelName : 'Member',
            tableName : 'members',
            paranoid : true,
            charset : 'utf8',
            collate : 'utf8_general_ci'
        });
    }
    static associate(db){
        db.Member.hasOne(db.Challenger, {foreignKey : 'member_id', sourceKey : 'id'});
        db.Member.hasMany(db.YogaPro, {foreignKey : 'yogapro_id', sourceKey : 'id'});
    }
};