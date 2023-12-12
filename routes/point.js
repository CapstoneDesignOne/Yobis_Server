
const express = require('express');
const router = express.Router();
const { sequelize } = require('../models');
const session = require('express-session');

const YogaPro = require('../models/yogapro');

let pose_names = ['right_arm_score', 'left_arm_score', 'right_armpit_score', 'left_armpit_score', 'right_side_score', 'left_side_score', 'right_knee_score', 'left_knee_score'];
router.post('/get_yoga_point', async (req, res)=>{
    let user_num = req.body.user_num;
    let pose_name = req.body.pose_name;
    let pose_array = [0, 0, 0, 0, 0, 0, 0, 0 ];
    try{
        const [pose_num, metadata] = await sequelize.query(`SELECT id FROM yogaposes WHERE yoga_name = '${pose_name}'`);
        const [pose_point, metadata2] = await sequelize.query(
            `SELECT right_arm_score, left_arm_score, right_armpit_score, left_armpit_score, 
            right_side_score, left_side_score, right_knee_score, left_knee_score, time_score 
            FROM yogapros WHERE yogapro_id = '${user_num}' and yogapose_id = '${pose_num[0]['id']}'`);
        if(pose_point[0]!=null){
            for(let i = 0; i<pose_array.length; i++) {
                pose_array[i] = pose_point[0][pose_names[i]];
            }

            res.json({
                /*
                right_arm_score : pose_point[0]['right_arm_score'],
                left_arm_score : pose_point[0]['left_arm_score'],
                right_armpit_score: pose_point[0]['right_armpit_score'],
                left_armpit_score : pose_point[0]['left_armpit_score'], 
                right_side_score : pose_point[0]['right_side_score'], 
                left_side_score : pose_point[0]['left_side_score'],
                right_knee_score : pose_point[0]['right_knee_score'], 
                left_knee_score : pose_point[0]['left_knee_score'], 
                */
                pose_score : pose_array,
                time_score : pose_point[0]['time_score']});
        }else{
            res.json({
                pose_score : pose_array,
                time_score : 0
            });
        }
    }catch(e){
        console.log(e);
    }
});

router.post('/send_yoga_point', async (req, res)=>{
    let user_num = req.body.user_num;
    let pose_name = req.body.pose_name;

    let pose_score = JSON.parse(req.body.pose_score);
    console.log(req.body.pose_score);
    try{
        const [pose_num, metadata] = await sequelize.query(`SELECT id FROM yogaposes WHERE yoga_name = '${pose_name}'`);
        if(pose_num[0]){
            const [is_user, metadata2] = await sequelize.query(`SELECT COUNT(*) FROM yogapros WHERE yogapro_id = '${user_num}' and yogapose_id = '${pose_num[0]['id']}'`);
            if(is_user[0]['COUNT(*)']!='0'){
                await YogaPro.update({ 
                    right_arm_score : pose_score[0],
                    left_arm_score : pose_score[1],
                    right_armpit_score: pose_score[2],
                    left_armpit_score : pose_score[3], 
                    right_side_score : pose_score[4], 
                    left_side_score : pose_score[5],
                    right_knee_score : pose_score[6], 
                    left_knee_score : pose_score[7], 
                    time_score : 0}, 
                    {where : {yogapro_id : user_num, yogapose_id : pose_num[0]['id']}});
            }else{
                await YogaPro.create({
                    yogapro_id : user_num, 
                    yogapose_id : req.body.pose_num, 
                    right_arm_score : pose_score[0],
                    left_arm_score : pose_score[1],
                    right_armpit_score: pose_score[2],
                    left_armpit_score : pose_score[3], 
                    right_side_score : pose_score[4], 
                    left_side_score : pose_score[5],
                    right_knee_score : pose_score[6], 
                    left_knee_score : pose_score[7], 
                    time_score : req.body.time_score,
                    yogapose_id : pose_num[0]['id']});
            }
        }
    }catch(e){
        console.log(e);
    }
});

module.exports = router;  