const express = require('express');
const app = express();

app.use(express.json());

let books = [
  { id: 1, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', year: 1925 },
  { id: 2, title: '1984', author: 'George Orwell', year: 1949 },
  { id: 3, title: 'To Kill a Mockingbird', author: 'Harper Lee', year: 1960 }
];

let nextId = 4;

const validateYear = (req, res, next) => {
  const year = req.body.year;

  if (year === undefined) {
    return res.status(400).json({ error: 'Year is required' });
  }

  const y = Number(year);

  if (isNaN(y)) {
    return res.status(400).json({ error: 'Year must be a number' });
  }

  if (y < 1000 || y > new Date().getFullYear()) {
    return res.status(400).json({ error: 'Year must be between 1000 and ' + new Date().getFullYear() });
  }

  next();
};

app.post('/api/books', validateYear, (req, res) => {
  const { title, author, year } = req.body;

  if (!title || !author) {
    return res.status(400).json({ error: 'Title and author are required' });
  }

  const newBook = { id: nextId++, title, author, year: Number(year) };
  books.push(newBook);
  res.status(201).json(newBook);
});

app.listen(3001, () => {
  console.log('Exercise 2 running on port 3001');
});
