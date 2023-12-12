
const express = require('express');
const router = express.Router();
const { sequelize } = require('../models');
const session = require('express-session');

router.use(session({
    secret: 'yobis',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));

/*
router.post('/', (req, res)=>{
   console.log(`현재 점수 : ${req.body.current_score}\n유지 시간 : ${req.body.time_score}`);
});
*/

router.post('/send_pose_name', async (req, res)=>{
    let pose_name = req.body.pose_name;
    try{
        const [pose_num, metadata] = await sequelize.query(`SELECT id FROM yogaposes WHERE yoga_name = '${pose_name}'`);
        if(pose_num[0]['id']!=null){
            pose_kind = ['excellent_upper', 'excellent_lower', 'good_upper', 'good_lower', 'nomal_upper', 'nomal_lower'];
            table_name = ['exups', 'exlos', 'goups', 'golos', 'noups', 'nolos'];
            pose_diction = {};
            
            pose_id = pose_num[0]['id'];
            for(let i = 0; i<6; i++){
                const [angles, metadata] = await sequelize.query(`SELECT * FROM ${table_name[i]} WHERE yogapose_id = '${pose_id}'`);
                pose_diction[pose_kind[i]] = [angles[0]['right_arm'],angles[0]['left_arm'],angles[0]['right_armpit'],angles[0]['left_armpit'],
                                                angles[0]['right_side'],angles[0]['left_side'],angles[0]['right_knee'],angles[0]['left_knee'],angles[0]['neck'],angles[0]['crotch']];
            }
            res.json({'state' : `1`, ...pose_diction});
        }else{
            res.json({'state' : `0`});
        }
    }catch(e){
        console.log(e);
    }
});

module.exports = router;  