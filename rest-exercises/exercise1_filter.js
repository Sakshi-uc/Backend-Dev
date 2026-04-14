const express = require('express');
const app = express();

app.use(express.json());

let books = [
  { id: 1, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', year: 1925 },
  { id: 2, title: '1984', author: 'George Orwell', year: 1949 },
  { id: 3, title: 'To Kill a Mockingbird', author: 'Harper Lee', year: 1960 },
  { id: 4, title: 'Brave New World', author: 'Aldous Huxley', year: 1932 }
];

app.get('/api/books', (req, res) => {
  let result = [...books];

  if (req.query.author) {
    result = result.filter(b => b.author.toLowerCase().includes(req.query.author.toLowerCase()));
  }

  if (req.query.year) {
    result = result.filter(b => b.year === parseInt(req.query.year));
  }

  res.json(result);
});

app.listen(3000, () => {
  console.log('Exercise 1 running on port 3000');
});
