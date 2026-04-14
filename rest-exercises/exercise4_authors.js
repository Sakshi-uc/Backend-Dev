const express = require('express');
const app = express();

app.use(express.json());

let authors = [
  { id: 1, name: 'F. Scott Fitzgerald', country: 'USA', born: 1896 },
  { id: 2, name: 'George Orwell', country: 'UK', born: 1903 },
  { id: 3, name: 'Harper Lee', country: 'USA', born: 1926 }
];

let nextId = 4;

app.get('/api/authors', (req, res) => {
  res.json(authors);
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

  const newAuthor = { id: nextId++, name, country, born: Number(born) };
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

app.listen(3003, () => {
  console.log('Exercise 4 running on port 3003');
});
