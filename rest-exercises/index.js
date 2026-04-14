const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let books = [
  { id: 1, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', year: 1925 },
  { id: 2, title: '1984', author: 'George Orwell', year: 1949 },
  { id: 3, title: 'To Kill a Mockingbird', author: 'Harper Lee', year: 1960 },
  { id: 4, title: 'Brave New World', author: 'Aldous Huxley', year: 1932 },
  { id: 5, title: 'The Hobbit', author: 'J.R.R. Tolkien', year: 1937 }
];

let authors = [
  { id: 1, name: 'F. Scott Fitzgerald', country: 'USA', born: 1896 },
  { id: 2, name: 'George Orwell', country: 'UK', born: 1903 }
];

let nextBookId = 6;
let nextAuthorId = 3;

const validateYear = (req, res, next) => {
  const year = req.body.year;
  if (year !== undefined) {
    const y = Number(year);
    if (isNaN(y)) {
      return res.status(400).json({ error: 'Year must be a number' });
    }
    if (y < 1000 || y > new Date().getFullYear()) {
      return res.status(400).json({ error: 'Year must be between 1000 and current year' });
    }
  }
  next();
};

app.get('/api/books', (req, res) => {
  let result = [...books];

  if (req.query.author) {
    result = result.filter(b => b.author.toLowerCase().includes(req.query.author.toLowerCase()));
  }

  if (req.query.year) {
    result = result.filter(b => b.year === parseInt(req.query.year));
  }

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || result.length;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginated = result.slice(startIndex, endIndex);

  res.json({
    total: result.length,
    page: page,
    limit: limit,
    totalPages: Math.ceil(result.length / limit),
    books: paginated
  });
});

app.get('/api/books/search', (req, res) => {
  const query = req.query.title;
  if (!query) {
    return res.status(400).json({ error: 'Please provide a title query parameter' });
  }
  const found = books.filter(b => b.title.toLowerCase().includes(query.toLowerCase()));
  if (found.length === 0) {
    return res.status(404).json({ error: 'No books found matching that title' });
  }
  res.json(found);
});

app.get('/api/books/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const book = books.find(b => b.id === id);
  if (!book) {
    return res.status(404).json({ error: 'Book not found' });
  }
  res.json(book);
});

app.post('/api/books', validateYear, (req, res) => {
  const { title, author, year } = req.body;
  if (!title || !author || !year) {
    return res.status(400).json({ error: 'Title, author, and year are required' });
  }
  const newBook = { id: nextBookId++, title, author, year: Number(year) };
  books.push(newBook);
  res.status(201).json(newBook);
});

app.put('/api/books/:id', validateYear, (req, res) => {
  const id = parseInt(req.params.id);
  const index = books.findIndex(b => b.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Book not found' });
  }
  const { title, author, year } = req.body;
  if (!title || !author || !year) {
    return res.status(400).json({ error: 'Title, author, and year are required' });
  }
  books[index] = { id, title, author, year: Number(year) };
  res.json(books[index]);
});

app.patch('/api/books/:id', validateYear, (req, res) => {
  const id = parseInt(req.params.id);
  const index = books.findIndex(b => b.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Book not found' });
  }
  const { title, author, year } = req.body;
  if (title) books[index].title = title;
  if (author) books[index].author = author;
  if (year) books[index].year = Number(year);
  res.json(books[index]);
});

app.delete('/api/books/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = books.findIndex(b => b.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Book not found' });
  }
  const deleted = books.splice(index, 1)[0];
  res.json({ message: 'Book deleted successfully', book: deleted });
});

app.get('/api/authors', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || authors.length;
  const startIndex = (page - 1) * limit;
  const paginated = authors.slice(startIndex, startIndex + limit);
  res.json({
    total: authors.length,
    page,
    limit,
    totalPages: Math.ceil(authors.length / limit),
    authors: paginated
  });
});

app.get('/api/authors/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const author = authors.find(a => a.id === id);
  if (!author) {
    return res.status(404).json({ error: 'Author not found' });
  }
  res.json(author);
});

app.post('/api/authors', (req, res) => {
  const { name, country, born } = req.body;
  if (!name || !country || !born) {
    return res.status(400).json({ error: 'Name, country, and born year are required' });
  }
  const bornYear = Number(born);
  if (isNaN(bornYear) || bornYear < 1000 || bornYear > new Date().getFullYear()) {
    return res.status(400).json({ error: 'Born must be a valid year' });
  }
  const newAuthor = { id: nextAuthorId++, name, country, born: bornYear };
  authors.push(newAuthor);
  res.status(201).json(newAuthor);
});

app.put('/api/authors/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = authors.findIndex(a => a.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Author not found' });
  }
  const { name, country, born } = req.body;
  if (!name || !country || !born) {
    return res.status(400).json({ error: 'Name, country, and born year are required' });
  }
  authors[index] = { id, name, country, born: Number(born) };
  res.json(authors[index]);
});

app.patch('/api/authors/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = authors.findIndex(a => a.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Author not found' });
  }
  const { name, country, born } = req.body;
  if (name) authors[index].name = name;
  if (country) authors[index].country = country;
  if (born) authors[index].born = Number(born);
  res.json(authors[index]);
});

app.delete('/api/authors/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = authors.findIndex(a => a.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Author not found' });
  }
  const deleted = authors.splice(index, 1)[0];
  res.json({ message: 'Author deleted successfully', author: deleted });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
