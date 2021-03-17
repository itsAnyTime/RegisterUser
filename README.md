http://localhost:4000/user
using Robo3T GUI

added db connection in app.js (mongoose):

const mongoose = require('mongoose');

// connect db
mongoose.connect("mongodb://localhost:27017/auth", {
    useUnifiedTopology: true,
    useCreateIndex: true,
    useNewUrlParser: true
});

mongoose.connection.on("error", console.error);
mongoose.connection.on("open", function(){
    console.log("Database connected ...");
})

prepare DB

---

new file: user.js in new folder models/:

const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model("User", UserSchema);

---

New file welcome.hbs 

<h1>Welcome ...</h1>

add in routes.js

const bcrypt = require("bcrypt");
const User = require("./models/User"); 


in routes error handling: 

switch 

        if(errors){
            req.session.errors = errors;        
            res.redirect('/user');
        } else {
            res.redirect('/create-user')
        }
    });

to

        if (errors.length) {
            req.session.errors = errors;
            res.redirect('/user');
        } else {
            // res.redirect('/create-user')
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if (err) {
                    res.json({
                        error: err
                    })
                } else {
                    const user = new User({
                        name: req.body.name,
                        email: req.body.email,
                        password: hash
                    });
                    user.save().then(result => {
                        const userName = result.name;
                        res.render("welcome", {userName})
                    }).catch(err => {
                        res.json({
                            error: err
                        })
                    })
                }
            })
        }
    });

in welcome.hbs change stuff to:
<h1>Welcome {{userName}}</h1>



// debugging works with no .vscode file 
// mark some stop points in app.js and press F5 -> type node.js
// debug output in "debug console"
