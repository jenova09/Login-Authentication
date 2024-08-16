var express= require ("express"),
    mongoose = require("mongoose"),
    passport = require ("passport"),
    bodyParser =  require ("body-parser"),
    LocalStrategy = require("passport-local").Strategy,
    passportLocalMongoose = require ("passport-local-mongoose"),
    alert = require('alert'); 
    path = require('path');
     user = require ("./models/user");
     const port = 5000;
     const { body, validationResult } = require('express-validator');

const flash = require('connect-flash');
 // DB Connection    

 mongoose.connect("mongodb+srv://jenovasethu:jY4pYSA1IHwffT0r@cluster0.x5zcgcc.mongodb.net/userdata");

 var app =express();
 app.set("view engine",'ejs');
 app.set('views', path.join(__dirname, 'views'));

 app.use(bodyParser.urlencoded({extended:true}));

 app.use(require("express-session")({
    secret : "Rusty is a Dog" ,
    resave : false,
    saveUninitialized : true
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

passport.use(new LocalStrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

// Passport configuration
// passport.use(new LocalStrategy((username, password, done) => {
    app.get('/login/:username,:password',async(req,res) =>{

    const uname = req.params.username;
    const pword = req.params.password;
    const collection = db.collection('users');
    const user = await collection.findOne({ username: uname });
    const pass = await collection.findOne({ password:pword });
    // Replace this with your user validation logic
    if (username === 'uname' && password === 'pword') {
        return done(null, { id: 1, username: 'uname' });
    }
    return done(null, false, { message: 'Invalid credentials' });
});
// }));

// passport.serializeUser((user, done) => {
//     done(null, user.id);
// });

// passport.deserializeUser((id, done) => {
//     // Replace this with your user retrieval logic
//     done(null, { id: 1, username: 'user' });
// });


// Middleware to check if user is authenticated
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}


//ROUTERS

//showing home page
app.get("/",function(req,res)
{
    res.render("home");
});

//showing Secret Page
app.get("/secret",isLoggedIn, function(req,res)
{
    res.render("secret");
});

//showing Rgister page
app.get("/register",function(req,res)
{
    res.render("register");
});

//Handling User SignUp

app.post("/register",function(req,res)
{
    var username = req.body.username;
    var password = req.body.password;
    var cpassword = req.body.cpassword;
    var phno = req.body.phno;
    var email = req.body.email;
    var agree =req.body.agree;

    //verify new user
   user.register(new user({username:username,password:password,cpassword:cpassword,phno:phno,email:email}),
   password,function(err,user)
   {
    if(err) {
         console.log(err);
        const message = 'Username already exists';
        res.render('alert', { message });
   
       // return res.render("register");
         }
         else{
            const message = 'User registered successfully';
            res.render('alert1', { message });
          }
  
    //  passport.authenticate("local")(
    //     req, res, function()
    //     {
           
    //         res.render("home");

    //     });
    
   });

});

//showing Login form
// app.get("/login",function(req,res)
// {
//     res.render("login");
// });
app.get('/login', (req, res) => {
    res.render('login', { message: req.flash('error') });
});

//Handling User Login

app.post("/login",passport.authenticate("local",
  {
    successRedirect : "/secret",
    
  failureRedirect : "/login",

   failureFlash: true
    }),function(req,res)
  {});
    
  //Handling user Logout
  app.get("/logout",function(req,res)
  {
    req.logOut(function(err)
{
    if (err) { return next (err);}
    res.redirect("/");
});
  });


  
function isLoggedIn(req,res,next)
{
    if(req.isAuthenticated()) return next();
    res.redirect("/");

    
}

// var port =5000;
// app.listen(port,function()
// {
//     console.log("Server has started");
// });

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});









