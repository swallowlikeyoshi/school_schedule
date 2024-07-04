const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const db = new sqlite3.Database(':memory:');

// SQLite 데이터베이스 설정
db.serialize(() => {
  db.run("CREATE TABLE schedules (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, writer TEXT, password TEXT, content TEXT, deadline DATE)");
});

// EJS 설정
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 미들웨어 설정
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));


// 루트 라우트
app.get('/', (req, res) => {
  db.all("SELECT * FROM schedules", [], (err, rows) => {
    if (err) {
      return console.error(err.message);
    }
    res.render('index', { schedules: rows });
  });
});

// 일정 JSON으로 반환하는 메소드
app.get('/schedules', (req, res) => {
  db.all("SELECT * FROM schedules", [], (err, rows) => {
      if (err) {
          console.error(err.message);
          res.status(500).send('Internal Server Error');
          return;
      }
      res.json(rows);
  });
});

// 일정 등록 페이지
app.get('/new', (req, res) => {
  res.render('new');
});

// 일정 등록 처리
app.post('/new', (req, res) => {
  const { title, writer, password, content, deadline } = req.body;
  db.run(`INSERT INTO schedules (title, writer, password, content, deadline) VALUES (?, ?, ?, ?, ?)`, [title, writer, password, content, deadline], function(err) {
    if (err) {
      return console.log(err.message);
    }
    res.redirect('/');
  });
});

// 일정 삭제 처리
app.post('/delete', async (req, res) => {
  const id = req.body.id;
  db.run(`DELETE FROM schedules WHERE id = ?`, [id], function(err) {
    if (err) {
      return console.error(err.message);
    }
    res.redirect('/');
  });
});

// 서버 시작
const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  db.run(`INSERT INTO schedules (title, writer, password, content, deadline) VALUES (?, ?, ?, ?, ?)`, ['테스트', '김도현', '1234', '내용', '2020-11-11'], (err) => {
    if (err) {
      console.log(err);
    }
  })
});
