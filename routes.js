const express = require('express');
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("./models/user");  // path to file user.js

const { check, validationResult } = require('express-validator');


router.post('/create-user', [
    check('name').notEmpty().withMessage('Name is required').trim().escape(),
    check('email', 'Email is required').isEmail().normalizeEmail(),
    check('password', 'Password is required').isLength({ min: 4 }).custom((val, { req }) => {
        if (val !== req.body.confirm_password) {
            throw new Error(`Password don't match!`);
        } else {
            return val;
        }
    })
], (req, res) => {
    const errors = validationResult(req).array();

    if (errors.length) {
        req.session.errors = errors;
        res.redirect('/user');
    } else {
        // res.redirect('/create-user')
        // part to avoid doubled email registrations
        User.find({email: req.body.email}).exec().then(user => {
            if(user.length >= 1) {
                return res.status(409).json({  // test without return
                    message: "Mail exists" // {"message":"Mail exists"} if user mail is already in database
                })
            } else {
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
                            // res.json({
                                // error: err
                                res.status(500).json({error:err})
                            // })
                        })
                    }
                })
            }
        })
    }
});

router.get('/user', function (req, res) {
    res.render('user', { errors: req.session.errors });
});

router.get('/create-user', function (req, res) {
    res.render('user');
});

module.exports = router;