app.use((req,res,next)=>{
    console.log("Request url:",req.url);
    console.log("Request method:",req.method);
    next(); // Call the next middleware function in the stack
});
app.get("/home",(req,res)=>{
    res.send("Welcome to the home page!");
});
app.listen(8000,()=>console.log("Server started on port 8000"));  