//application level middleware-1
const express=require("express");
const app=express();

//BUild in middleware-2
app.use(express.json()); //name email in the body then it will convert it into json format
app.use(express.urlencoded({extended:true})); //for form data it will convert into key value pair

//custom middleware
app.use((req,res,next)=>{
    console.log("Request url:",req.url);
    console.log("request Method:",req.method);
    
    next(); //next middleware can excess route 
});

app.get("/home",(req,res)=>{
    res.send("welcome to home page");
});

//route level middleware-3
const checkLogin=(req,res,next)=>{
    const isLoggedIn=true;
    if(!isLoggedIn){
        return res.status(400).send("You are not logged in");
    }
    next(); 
};

app.get("/dashboard",checkLogin,(req,res)=>{
    res.send("welcome to dashboard");
});

//JWT authentication middleware-4
 // Authentication middleware

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(403).json({ message: "Token required" });
  }

  if (token !== "akku") {
    return res.status(401).json({ message: "Invalid token" });
  }

  next();
};

app.get("/profile", authMiddleware, (req, res) => {
  res.json({ message: "Profile data" });
});

// Error-Handling Middleware
app.get("/error", (req, res) => {
  throw new Error("Something went wrong!");
});

app.use((err, req, res, next) => {
  console.error("Error Middleware:", err.message);
  res.status(500).json({
    message: "Internal Server Error",
  });
});








app.listen(9000,()=>console.log("server started "));