const express = require('express');
const path = require('path');
const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

let posts = [
  { id: 1, title: 'Getting Started with Express', body: 'Express is a minimal Node.js framework that makes building web servers simple and fast.', author: 'Alice', date: '2024-01-10' },
  { id: 2, title: 'Understanding Middleware', body: 'Middleware functions run between the request and response cycle. They can modify req and res objects.', author: 'Bob', date: '2024-01-15' },
  { id: 3, title: 'EJS Templating Basics', body: 'EJS lets you write JavaScript directly inside HTML. Use <%= %> to output values and <% %> for logic.', author: 'Charlie', date: '2024-01-20' }
];

let nextId = 4;

app.get('/', (req, res) => {
  res.render('index', { posts: posts });
});

app.get('/posts/new', (req, res) => {
  res.render('new_post', { error: null });
});

app.post('/posts', (req, res) => {
  const { title, body, author } = req.body;

  if (!title || !body || !author) {
    return res.render('new_post', { error: 'All fields are required' });
  }

  const newPost = {
    id: nextId++,
    title,
    body,
    author,
    date: new Date().toISOString().split('T')[0]
  };

  posts.push(newPost);
  res.redirect('/');
});

app.get('/posts/:id', (req, res) => {
  const post = posts.find(p => p.id === parseInt(req.params.id));

  if (!post) {
    return res.status(404).render('404');
  }

  res.render('post', { post: post });
});

app.use((req, res) => {
  res.status(404).render('404');
});

app.listen(3005, () => {
  console.log('Exercise 6 running on port 3005');
});
