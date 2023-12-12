const express = require('express');
const path = require('path');
const morgan = require('morgan');
const nunjucks = require('nunjucks');
const {sequelize} = require('./models');

//라우터
const pose_image_router = require('./routes/pose_upload.js');
const pose_router = require('./routes/pose_detect.js');
const point_router = require('./routes/point.js');
const login_router = require('./routes/login.js');
const rank_router = require('./routes/ranking.js');

const app = express();

app.set('view engine', 'html'); 
app.set('port', process.env.PORT || 3000);

nunjucks.configure('views', {
    express : app,
    watch : true
});

sequelize.sync({force : false})
    .then(()=>{
        console.log('데이테베이스 연결 성공');
    })
    .catch((err)=>{
        console.error(err);
    })

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({extended :false}));

app.use('/pose_upload', pose_image_router);
app.use('/pose_detect', pose_router);
app.use('/pose_point', point_router);
app.use('/login', login_router);
app.use('/rank', rank_router);

app.use((req, res, next)=>{
    res.status(404).send('404 Not Found');
});

app.use((err, req, res, next)=>{
    res.send(`${req.status}`);
});

app.listen(app.get('port'), ()=>{
    console.log(app.get('port'), '번 포트에서 대기 중');
});