# REST Exercises

## Setup
```
npm install
```

---

## Exercise 1 - Filter by author or year
```
npm run ex1
```
```bash
curl "http://localhost:3000/api/books?author=Orwell"
curl "http://localhost:3000/api/books?year=1949"
curl "http://localhost:3000/api/books?author=Harper&year=1960"
```

---

## Exercise 2 - Year validation middleware
```
npm run ex2
```
```bash
# invalid year
curl -X POST http://localhost:3001/api/books \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","author":"Someone","year":"abcd"}'

# out of range
curl -X POST http://localhost:3001/api/books \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","author":"Someone","year":500}'

# valid
curl -X POST http://localhost:3001/api/books \
  -H "Content-Type: application/json" \
  -d '{"title":"The Catcher in the Rye","author":"J.D. Salinger","year":1951}'
```

---

## Exercise 3 - Pagination
```
npm run ex3
```
```bash
curl "http://localhost:3002/api/books?page=1&limit=3"
curl "http://localhost:3002/api/books?page=2&limit=3"
```

---

## Exercise 4 - Authors CRUD
```
npm run ex4
```
```bash
curl http://localhost:3003/api/authors
curl http://localhost:3003/api/authors/1

curl -X POST http://localhost:3003/api/authors \
  -H "Content-Type: application/json" \
  -d '{"name":"Aldous Huxley","country":"UK","born":1894}'

curl -X PUT http://localhost:3003/api/authors/1 \
  -H "Content-Type: application/json" \
  -d '{"name":"F. Scott Fitzgerald","country":"USA","born":1896}'

curl -X PATCH http://localhost:3003/api/authors/1 \
  -H "Content-Type: application/json" \
  -d '{"country":"United States"}'

curl -X DELETE http://localhost:3003/api/authors/2
```

---

## Exercise 5 - Search by title
```
npm run ex5
```
```bash
curl "http://localhost:3004/api/books/search?title=great"
curl "http://localhost:3004/api/books/search?title=hobbit"
curl "http://localhost:3004/api/books/search?title=xyz"
```
