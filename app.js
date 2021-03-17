const express = require("express");
const hbs = require("express-handlebars");
const mongoose = require('mongoose');


const session = require("express-session");

// User router
const user = require("./routes");

const app = express();

// connect db
mongoose.connect("mongodb://localhost:27017/auth", {
    useUnifiedTopology: true,
    useCreateIndex: true,
    useNewUrlParser: true
});

mongoose.connection.on("error", console.error);
mongoose.connection.on("open", function() {
    console.log("Database connected ...");
})

app.use(express.urlencoded({extended: true}));
app.use(session({secret: "secrets", saveUninitialized: false, resave: false}));

// Serve static resources
app.use("/public", express.static("public"));

//set hbs engine 
app.engine('hbs', hbs({extname: 'hbs', defaultLayout: null}));
app.set("views", __dirname + "/views");
app.set('view engine', 'hbs');

// Initiate API
app.use("/", user);

const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log("Connected to port " + port);
});