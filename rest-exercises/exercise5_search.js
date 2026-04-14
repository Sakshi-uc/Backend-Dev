const express = require('express');
const app = express();

app.use(express.json());

let books = [
  { id: 1, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', year: 1925 },
  { id: 2, title: '1984', author: 'George Orwell', year: 1949 },
  { id: 3, title: 'To Kill a Mockingbird', author: 'Harper Lee', year: 1960 },
  { id: 4, title: 'Brave New World', author: 'Aldous Huxley', year: 1932 },
  { id: 5, title: 'The Hobbit', author: 'J.R.R. Tolkien', year: 1937 }
];

app.get('/api/books/search', (req, res) => {
  const title = req.query.title;

  if (!title) {
    return res.status(400).json({ error: 'Please provide a title query parameter' });
  }

  const found = books.filter(b => b.title.toLowerCase().includes(title.toLowerCase()));

  if (found.length === 0) {
    return res.status(404).json({ error: 'No books found matching that title' });
  }

  res.json(found);
});

app.listen(3004, () => {
  console.log('Exercise 5 running on port 3004');
});
