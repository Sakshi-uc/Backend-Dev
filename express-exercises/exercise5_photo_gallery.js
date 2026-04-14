const express = require('express')
const path = require('path')
const app = express()

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

const photos = [
  { id: 1, title: 'Mountain', description: 'A big mountain' },
  { id: 2, title: 'Ocean', description: 'Blue waves' },
  { id: 3, title: 'Forest', description: 'Tall trees' }
]

app.get('/', (req, res) => {
  res.render('gallery', { photos: photos })
})

app.get('/photo/:id', (req, res) => {
  const photo = photos.find(p => p.id === parseInt(req.params.id))
  if (!photo) {
    return res.status(404).send('Photo not found')
  }
  res.render('photo', { photo: photo })
})

app.listen(3004, () => {
  console.log('exercise5 running on port 3004')
})
