const Sequelize = require('sequelize');

module.exports = class YogaPro extends Sequelize.Model {
    static init(sequelize) {
        return super.init({    
            right_arm_score : {
                type : Sequelize.INTEGER.UNSIGNED,
                allowNull : false,
                defaultValue : 0,
                comment : "오른쪽 팔 점수"
            },
            left_arm_score : {
                type : Sequelize.INTEGER.UNSIGNED,
                allowNull : false,
                defaultValue : 0,
                comment : "왼쪽 팔 점수"
            },
            right_armpit_score : {
                type : Sequelize.INTEGER.UNSIGNED,
                allowNull : false,
                defaultValue : 0,
                comment : "오른쪽 겨드랑이 점수"
            },
            left_armpit_score : {
                type : Sequelize.INTEGER.UNSIGNED,
                allowNull : false,
                defaultValue : 0,
                comment : "왼쪽 겨드랑이 점수"
            },
            right_side_score : {
                type : Sequelize.INTEGER.UNSIGNED,
                allowNull : false,
                defaultValue : 0,
                comment : "오른쪽 고관절 점수"
            },
            left_side_score : {
                type : Sequelize.INTEGER.UNSIGNED,
                allowNull : false,
                defaultValue : 0,
                comment : "왼쪽 고관절 점수"
            },
            right_knee_score : {
                type : Sequelize.INTEGER.UNSIGNED,
                allowNull : false,
                defaultValue : 0,
                comment : "오른쪽 무릎 점수"
            },
            left_knee_score : {
                type : Sequelize.INTEGER.UNSIGNED,
                allowNull : false,
                defaultValue : 0,
                comment : "왼쪽 무릎 점수"
            },
            time_score : {
                type : Sequelize.INTEGER.UNSIGNED,
                allowNull : false,
                defaultValue : 0,
                comment : "자세에 대한 점수"
            }
        },
        {
            sequelize,
            timestamps : true,
            createdAt : false,
            underscored : true,
            modelName : 'YogaPro',
            tableName : 'yogapros',
            paranoid : false,
            charset : 'utf8',
            collate : 'utf8_general_ci',
            autoIncrement: false,
            primaryKey: false
        });
    }
    static associate(db){
        db.YogaPro.belongsTo(db.Member, {foreignKey : 'yogapro_id', targetKey : 'id'});
        db.YogaPro.belongsTo(db.YogaPose, {foreignKey : 'yogapose_id', targetKey : 'id'});
    }
};