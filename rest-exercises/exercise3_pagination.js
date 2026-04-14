const express = require('express');
const app = express();

app.use(express.json());

let books = [
  { id: 1, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', year: 1925 },
  { id: 2, title: '1984', author: 'George Orwell', year: 1949 },
  { id: 3, title: 'To Kill a Mockingbird', author: 'Harper Lee', year: 1960 },
  { id: 4, title: 'Brave New World', author: 'Aldous Huxley', year: 1932 },
  { id: 5, title: 'The Hobbit', author: 'J.R.R. Tolkien', year: 1937 },
  { id: 6, title: 'Fahrenheit 451', author: 'Ray Bradbury', year: 1953 },
  { id: 7, title: 'The Alchemist', author: 'Paulo Coelho', year: 1988 }
];

app.get('/api/books', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 3;

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

  const paginated = books.slice(startIndex, endIndex);

  res.json({
    total: books.length,
    page: page,
    limit: limit,
    totalPages: Math.ceil(books.length / limit),
    books: paginated
  });
});

app.listen(3002, () => {
  console.log('Exercise 3 running on port 3002');
});
