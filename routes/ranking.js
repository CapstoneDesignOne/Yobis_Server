
const express = require('express');
const router = express.Router();
const { sequelize } = require('../models');
const session = require('express-session');

const Challenger = require('../models/challenger');


router.post('/', async(req, res)=>{
    let user_num = req.body.user_num;
    try{
        const [user_cnt, metadata] = await sequelize.query(`SELECT COUNT(*) FROM members;`);
        const [total_score, metadata2] = await sequelize.query(`SELECT total_score FROM challengers WHERE member_id = '${user_num}';`);
        if(total_score[0] == null){
            res.json({user_cnt : user_cnt[0]['COUNT(*)']});
        }else{
            const [user_rank, metadata3] = await sequelize.query(`SELECT (SELECT COUNT(*) FROM challengers WHERE total_score > (SELECT total_score FROM challengers WHERE member_id = '${user_num}')) + 1 AS ranking;`);
            const [yoga_num, metadata4] = await sequelize.query(`SELECT COUNT(*) FROM yogapros WHERE yogapro_id = '${user_num}';`);
            res.json({
                total_score : total_score[0]['total_score'], 
                user_rank : user_rank[0]['ranking'], 
                user_cnt : user_cnt[0]['COUNT(*)'], 
                yoga_num : yoga_num[0]['COUNT(*)']});
        }
    }catch(e){
        console.log(e);
    }
});

let pose_names = ['right_arm_score', 'left_arm_score', 'right_armpit_score', 'left_armpit_score', 'right_side_score', 'left_side_score', 'right_knee_score', 'left_knee_score'];
router.post('/update_totalscore', async (req, res)=>{
    console.log(req.body.total_score);
    let user_num = req.body.user_num;
    let get_score = req.body.total_score;
    let get_name = req.body.pose_name;
    try{
        const [score, metadata] = await sequelize.query(`SELECT total_score FROM challengers WHERE member_id = '${user_num}'`);
        if(score[0] == null){
            await Challenger.create({
                member_id : user_num,
                total_score : parseInt(get_score)
            });
        }else{
            const [pose_num, metadata] = await sequelize.query(`SELECT id FROM yogaposes WHERE yoga_name = '${get_name}'`);
            const [pre_score, metadata2] = await sequelize.query(
            `SELECT right_arm_score, left_arm_score, right_armpit_score, left_armpit_score, 
            right_side_score, left_side_score, right_knee_score, left_knee_score, time_score 
            FROM yogapros WHERE yogapro_id = '${user_num}' and yogapose_id = '${pose_num[0]['id']}'`);

            let avg = 0;

            for(let i=0; i<pose_names.length; i++)
                avg += pre_score[0][pose_names[i]];
            avg /= pose_names.length;
            get_score = parseInt(score[0]['total_score']) + parseInt(get_score)-parseInt(avg);
            await Challenger.update({total_score : get_score}, {where : {member_id : user_num}});
        }
    }catch(e){
        console.log(e);
    }
});


module.exports = router;  