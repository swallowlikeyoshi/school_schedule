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
    res.render('index', { schedules: rows.sort((a, b) => new Date(a.deadline).getDate() - new Date(b.deadline).getDate() ) });
  });
});

// 일정 JSON으로 반환하는 메소드
app.get('/new', (req, res) => {
  const date = new Date();
  res.render('new', {
    date: {
      year: date.getFullYear(),
      month: (date.getMonth() + 1).toLocaleString(), // 월은 0부터 시작하므로 1을 더해줍니다.
      day: date.getDate().toLocaleString() // getDay()가 아닌 getDate()를 사용해야 합니다.
    }
  });
});


// 일정 등록 페이지
app.get('/new', (req, res) => {
  const date = new Date();
  res.render('new', { date:  { year: date.getFullYear().toLocaleString(), month: date.getMonth().toLocaleString(), day: date.getDay().toLocaleString()}});
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
