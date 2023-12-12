const Sequelize = require('sequelize');

module.exports = class GoLO extends Sequelize.Model {
    static init(sequelize) {
        return super.init({    
            right_arm : {
                type : Sequelize.FLOAT,
                allowNull : false,
                defaultValue : 0,
                comment : "오른쪽 팔 각도"
            },
            left_arm : {
                type : Sequelize.FLOAT,
                allowNull : false,
                defaultValue : 0,
                comment : "왼쪽 팔 각도"
            },
            right_armpit : {
                type : Sequelize.FLOAT,
                allowNull : false,
                defaultValue : 0,
                comment : "오른쪽 겨드랑이 각도"
            },
            left_armpit : {
                type : Sequelize.FLOAT,
                allowNull : false,
                defaultValue : 0,
                comment : "왼쪽 겨드랑이 각도"
            },
            right_side : {
                type : Sequelize.FLOAT,
                allowNull : false,
                defaultValue : 0,
                comment : "오른쪽 고관절 각도"
            },
            left_side : {
                type : Sequelize.FLOAT,
                allowNull : false,
                defaultValue : 0,
                comment : "왼쪽 고관절 각도"
            },
            right_knee : {
                type : Sequelize.FLOAT,
                allowNull : false,
                defaultValue : 0,
                comment : "오른쪽 무릎 각도"
            },
            left_knee : {
                type : Sequelize.FLOAT,
                allowNull : false,
                defaultValue : 0,
                comment : "왼쪽 무릎 각도"
            },
            neck : {
                type : Sequelize.FLOAT,
                allowNull : false,
                defaultValue : 0,
                comment : "목 각도"
            },
            crotch : {
                type : Sequelize.FLOAT,
                allowNull : false,
                defaultValue : 0,
                comment : "가랑이 각도"
            },
        },
        {
            sequelize,
            timestamps : false,
            underscored : true,
            modelName : 'GoLO',
            tableName : 'golos',
            paranoid : false,
            charset : 'utf8',
            collate : 'utf8_general_ci',
            autoIncrement: false,
            primaryKey: false
        });
    }
    static associate(db){
        db.GoLO.belongsTo(db.YogaPose, {foreignKey : 'yogapose_id', targetKey : 'id'});
    }
};