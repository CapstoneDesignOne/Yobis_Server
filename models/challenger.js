const Sequelize = require('sequelize');

module.exports = class Challenger extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            total_score : {
                type : Sequelize.INTEGER.UNSIGNED,
                allowNull : false,
                defaultValue : 0,
                comment : "기간 내 총합점수"
            }
        },
        {
            sequelize,
            timestamps : true,
            createdAt : false,
            underscored : true,
            modelName : 'Challenger',
            tableName : 'challengers',
            paranoid : false,
            charset : 'utf8',
            collate : 'utf8_general_ci'
        });
    }
    static associate(db){
        db.Challenger.belongsTo(db.Member, {foreignKey : 'member_id', targetKey : 'id'});
    }
};