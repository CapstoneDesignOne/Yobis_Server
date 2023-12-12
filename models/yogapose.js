const Sequelize = require('sequelize');

module.exports = class YogaPose extends Sequelize.Model {
    static init(sequelize) {
        return super.init({    
            yoga_name : {
                type : Sequelize.STRING,
                allowNull : false,
                comment : "요가 포즈 명칭"
            }
        },
        {
            sequelize,
            timestamps : false,
            underscored : true,
            modelName : 'YogaPose',
            tableName : 'yogaposes',
            paranoid : false,
            charset : 'utf8',
            collate : 'utf8_general_ci',
        });
    }
    static associate(db){
        db.YogaPose.hasMany(db.YogaPro, {foreignKey : 'yogapose_id', sourceKey : 'id'});
        db.YogaPose.hasOne(db.ExUP, {foreignKey : 'yogapose_id', sourceKey : 'id'});
    }
};