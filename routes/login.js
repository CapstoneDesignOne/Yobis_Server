
const express = require('express');
const router = express.Router();
const { sequelize } = require('../models');
const session = require('express-session');

const Member = require('../models/member');

router.post('/', async(req, res)=>{
    let user_id = req.body.user_id;
    let password = req.body.password;

    try{
        const [user_num, metadata] = await sequelize.query(`SELECT id FROM members WHERE user_id = '${user_id}' and user_pw = '${password}'`);
        if(user_num != null){
            res.json({login : 1, user_num : user_num[0]['id']});
        }else{
            res.json({login : 0});
        }
    }catch(e){
        res.json({login : 0});
    }
});

router.post('/sign_up', async (req, res)=>{
    console.log("서버 접속은 정상적으로 잘 된다.");
    let user_name = req.body.user_name;
    let pass_word = req.body.pass_word;
    try{
        const [name_cnt, metadata] = await sequelize.query(`SELECT COUNT(*) FROM members WHERE user_id = '${user_name}'`);
        if(name_cnt[0]['COUNT(*)'] == 0){
            await Member.create({
                user_id : user_name,
                user_pw : pass_word
            });
            res.json({sing_up : 1});
        }else{
            res.json({sing_up : 0});
        }
    }catch(e){
        console.log(e);
    }
});


module.exports = router;  