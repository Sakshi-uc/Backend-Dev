const express = require('express');
const path = require('path');
const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

const photos = [
  { id: 1, title: 'Mountain Sunrise', filename: 'photo1.jpg', description: 'A beautiful sunrise over the mountains' },
  { id: 2, title: 'Ocean Waves', filename: 'photo2.jpg', description: 'Waves crashing on the shore' },
  { id: 3, title: 'Forest Path', filename: 'photo3.jpg', description: 'A quiet trail through the forest' },
  { id: 4, title: 'City Lights', filename: 'photo4.jpg', description: 'City skyline at night' }
];

app.get('/', (req, res) => {
  res.render('gallery', { photos: photos });
});

app.get('/photo/:id', (req, res) => {
  const photo = photos.find(p => p.id === parseInt(req.params.id));

  if (!photo) {
    return res.status(404).send('Photo not found');
  }

  res.render('photo', { photo: photo });
});

app.listen(3004, () => {
  console.log('Exercise 5 running on port 3004');
});
