const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const pool = require('./db')
const app = express();


// 设置中间件
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: 'your-secret-key', resave: true, saveUninitialized: true }));

// 模拟用户数据
const users = [
    { id: 1, username: 'user1', password: 'password1' },
    { id: 2, username: 'user2', password: 'password2' }
];

// 论坛帖子数据
let posts = [];

// 中间件：检查用户是否已登录
function checkLoggedIn(req, res, next) {
    if (!req.session.user) {
        res.redirect('/login');
    } else {
        next();
    }
}

// 主页
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// 登录页面
app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/public/login.html');
});



// 处理登录请求
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        req.session.user = user;
	req.session.isLoggedIn = true;
        res.redirect('/forum');
    } else {
        res.send('登录失败');
    }
});




// 首页路由处理
app.get('/', (req, res) => {
    // 根据登录状态发送不同的首页内容
    if (req.session.isLoggedIn) {
        res.sendFile(__dirname + '/public/index_loggedin.html');
    } else {
        res.sendFile(__dirname + '/public/index.html');
    }
});

// 论坛页面
app.get('/forum', (req, res) => {
    // 根据登录状态发送不同的页面内容
    if (req.session.isLoggedIn) {
        res.sendFile(__dirname + '/public/forum.html');
    } else {
        res.redirect('/login'); // 如果未登录，重定向到登录页面
    }
});

// 个人信息页面路由处理
app.get('/profile', (req, res) => {
    // 根据登录状态发送不同的页面内容
    if (req.session.isLoggedIn) {
        res.sendFile(__dirname + '/public/profile.html');
    } else {
        res.redirect('/login'); // 如果未登录，重定向到登录页面
    }
});




// 退出登录
app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        res.redirect('/');
    });
});

// 发帖页面
app.get('/post/new', checkLoggedIn, (req, res) => {
    res.sendFile(__dirname + '/public/post.html');
});

// 处理发帖请求
app.post('/post/new', checkLoggedIn, (req, res) => {
    const { title, content } = req.body;
    const newPost = { id: posts.length + 1, title, content, author: req.session.user.username };
    posts.push(newPost);
    res.redirect('/forum');
});

// 帖子详情页面
app.get('/post/:id', checkLoggedIn, (req, res) => {
    const postId = parseInt(req.params.id);
    const post = posts.find(p => p.id === postId);
    if (post) {
        res.sendFile(__dirname + '/public/post.html');
    } else {
        res.send('帖子不存在');
    }
});


// 注册页面
app.get('/register', (req, res) => {
    res.sendFile(__dirname + '/public/register.html');
});

// 处理注册请求
app.post('/register', (req, res) => {
    const { username, password } = req.body;

    // 检查用户名是否已存在
    if (users.some(u => u.username === username)) {
        res.send('用户名已存在');
    } else {
        // 将新用户添加到模拟的用户数据中
        const newUser = { id: users.length + 1, username, password };
        users.push(newUser);

        // 在这里可以添加将用户信息保存到数据库的逻辑（这是一个简化的例子）

        //注册成功后跳转到wait页面
	res.redirect('/register_succeed_wait.html');
    }
});

/*
// 处理注册请求
app.post('/register', (req, res) => {
    const { username, password } = req.body;

    // 检查用户名是否已存在
    pool.query('SELECT * FROM users WHERE username = ?', [username], (error, results) => {
        if (error) {
            res.send('注册失败');
        } else if (results.length > 0) {
            res.send('用户名已存在');
        } else {
            // 插入新用户到数据库
            pool.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, password], (error) => {
                if (error) {
                    res.send('注册失败');
                } else {
                    res.redirect('/register_succeed_wait.html');
                }
            });
        }
    });
});

*/

// 设置静态文件服务
app.use(express.static('public'));

// 启动服务器
const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
