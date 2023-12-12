
const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const session = require('express-session');

const { sequelize } = require('../models');
const YogaPose = require('../models/yogapose');
const ExUP = require('../models/pose/excellent_upper');
const ExLO = require('../models/pose/excellent_lower');
const GoUP = require('../models/pose/good_upper');
const GoLO = require('../models/pose/good_lower');
const NoUP = require('../models/pose/nomal_upper');
const NoLO = require('../models/pose/nomal_lower');

const spawn = require('child_process').spawn;


let dir = "";

router.use(session({
    secret: 'yobis',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));

try{
    fs.readdirSync('./data/pose_image');
}catch(error){
    console.error('create pose_image folder');
    fs.mkdirSync('./data/pose_image');
}

const upload = multer({
    storage : multer.diskStorage({
        destination(req, file, done){
            done(null, dir);
        },
        filename(req, file, done){
            console.log(req.body.pose_name);
            const ext = path.extname(file.originalname);
            done(null, path.basename(file.originalname, ext) + Date.now() + ext);
        }
    }),
    limits : {fileSize : 5*1024*1024}
});

router.get('/', (req, res)=>{
    res.sendFile(path.join(__dirname, 'pose_name_upload.html'));
});

router.post('/send_name', async (req, res)=>{
    dir = `./data/pose_image/${req.body.pose_name}`;
    try{
        fs.readdirSync(dir);
    }catch(error){
        console.error(`create ${req.body.pose_name} folder`);
        fs.mkdirSync(dir);
    }

    try{
        const [poseCount, metadata] = await sequelize.query(`SELECT COUNT(*) FROM yogaposes WHERE yoga_name = '${req.body.pose_name}'`);
        if(Number(poseCount[0]['COUNT(*)']) == 0){
            await YogaPose.create({yoga_name : req.body.pose_name});
        }
    }catch(error){
        console.log(error);
    }
    
    req.session.pose_name = req.body.pose_name;
    res.sendFile(path.join(__dirname, 'pose_upload.html'));
});

router.post('/send_images', upload.array('pose_images'), async(req, res)=>{
    const pose_range = spawn('python3', ['./routes/get_angle/pose_calculate.py', req.session.pose_name]);
    
    let pose_id;
    try{
        const [poseId, metadata] = await sequelize.query(`SELECT id FROM yogaposes WHERE yoga_name = '${req.session.pose_name}'`);
        pose_id = Number(poseId[0]['id']);
    }catch(error){
        console.log(error);
    }

    pose_range.stdout.on('data', async(result)=>{
        let angles = JSON.parse(result.toString());
        try{
            const [poseCount, metadata] = await sequelize.query(`SELECT COUNT(*) FROM exups WHERE yogapose_id = '${pose_id}'`);
            if(Number(poseCount[0]['COUNT(*)']) != 0){
                await ExLO.update(angles['excellent_lower'],{where : {yogapose_id : pose_id}});
                await ExUP.update(angles['excellent_upper'],{where : {yogapose_id : pose_id}});

                await GoLO.update(angles['good_lower'],{where : {yogapose_id : pose_id}});
                await GoUP.update(angles['good_upper'],{where : {yogapose_id : pose_id}});

                await NoLO.update(angles['nomal_lower'],{where : {yogapose_id : pose_id}});
                await NoUP.update(angles['nomal_upper'],{where : {yogapose_id : pose_id}});
            }else{
                await ExLO.create({yogapose_id : pose_id, ...angles['excellent_lower']});
                await ExUP.create({yogapose_id : pose_id, ...angles['excellent_upper']});

                await GoLO.create({yogapose_id : pose_id, ...angles['good_lower']});
                await GoUP.create({yogapose_id : pose_id, ...angles['good_upper']});

                await NoLO.create({yogapose_id : pose_id, ...angles['nomal_lower']});
                await NoUP.create({yogapose_id : pose_id, ...angles['nomal_upper']});
            }
            res.send(`sucessfully make ${req.session.pose_name} pose`);
        }catch(error){
            console.log(error);
            res.send(`fail to make ${req.session.pose_name} pose\n${error}`);
        }
    }); 
});

module.exports = router;