// const express = require('express');
// const app = express();

// app.use((req, res, next) => {
//     console.log('sign up form'  );
// });
// app.use((req, res, next) => {
//     //console.log('sign up form'  );
//     //res.send('sign up form'  );
// });

// app.use((req, res, next) => {
//     console.log('sign up form'  );
//     res.send('sign up form'  );
// });

// app.get('/user', (req, res) => {
//     //res.send('user page');
// });

// app.listen(3000, () => {
//     console.log('Server is running on port 3000');
// });
const express = require('express');
const app = express();

app.use((req, res, next) => {
    console.log('signup form ');
   next();
});


app.use((req, res, next) => {
    console.log('login form ');
   next();
});


app.get("/user",(req,res)=>{
    res.send("route executed successfully");
})

app.listen(9000,()=>{
    console.log("server is running on port 9000");
})