# Express Framework Exercises

## Setup
```
npm install
```

---

## Exercise 1 - Filter users by name (port 3000)
```
npm run ex1
```
```bash
curl "http://localhost:3000/users"
curl "http://localhost:3000/users?name=alice"
curl "http://localhost:3000/users?name=bob"
```

---

## Exercise 2 - Response time logger middleware (port 3001)
```
npm run ex2
```
```bash
curl http://localhost:3001/
curl http://localhost:3001/about
curl http://localhost:3001/slow
# Check terminal - response time will be printed for each request
```

---

## Exercise 3 - Contact form with EJS (port 3002)
```
npm run ex3
```
Open browser: http://localhost:3002/contact
- Fill the form and submit to see confirmation
- Leave fields empty to see validation error

---

## Exercise 4 - Custom 404 page with EJS (port 3003)
```
npm run ex4
```
Open browser:
- http://localhost:3003/ (valid)
- http://localhost:3003/about (valid)
- http://localhost:3003/anything-else (custom 404 page)

---

## Exercise 5 - Photo gallery (port 3004)
```
npm run ex5
```
Open browser:
- http://localhost:3004/ (gallery grid)
- http://localhost:3004/photo/1 (single photo view)
- http://localhost:3004/photo/3

---

## Exercise 6 - Blog (port 3005)
```
npm run ex6
```
Open browser:
- http://localhost:3005/ (all posts)
- http://localhost:3005/posts/1 (view one post)
- http://localhost:3005/posts/new (create new post - fill form and submit)
- http://localhost:3005/blah (custom 404)
