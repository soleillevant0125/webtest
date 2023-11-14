const mysql=require('mysql2')
// 创建 MySQL 连接池
const pool = mysql.createPool({
    host: 'localhost',
    user: 'your_username',
    password: 'your_password',
    database: 'forum_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});
