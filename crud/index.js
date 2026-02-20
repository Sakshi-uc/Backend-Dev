const express = require('express');
const app = express();
const users = require('./MOCK_DATA.json');
const port = 8000;

/*app.get('/users' , (req,res) =>{
    res.json(users);
})*/


app.get('//api/users' , (req,res) =>{
    res.json(users);
})

app.get((req,res) =>{
    const id = req.params.id;
    const user = user.find((u) => u.id == id );
    return res.json(user);
})

app.listen(8000, () =>{
    console.log('server is started on port $(port');
})




