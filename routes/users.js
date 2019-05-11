const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const router = express.Router();

//Load user model
require('../models/User');
const User = mongoose.model('users');

//User Login route
router.get('/login', (req, res) => {
    res.render('users/login');
});

//User register route
router.get('/register', (req, res) => {
    res.render('users/register');
});

//user login post
router.post('/login', (req, res, next) =>{
    passport.authenticate('local', {
        successRedirect: '/ideas',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});

//user register post
router.post('/register', (req, res) => {
    let errors = [];
    if (req.body.password != req.body.password2) {
        errors.push({ text: "Passwords do not match." });
    }

    if (req.body.password.length < 8) {
        errors.push({ text: "Password must be at least 8 characters" });
    }

    if (errors.length > 0) {
        res.render('users/register', {
            errors: errors,
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            password2: req.body.password2
        });
    } else {
        User.findOne({ email: req.body.email })
            .then(user => {
                if (user) {
                    req.flash('error_msg', 'Email already in use');
                    res.redirect('/users/register');
                } else {
                    const newUser = new User({
                        username: req.body.username,
                        email: req.body.email,
                        password: req.body.password
                    });
                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if (err) throw err;
                            newUser.password = hash;
                            newUser.save()
                                .then(user => {
                                    req.flash('success_msg', 'Successfully registered! You can log in.');
                                    res.redirect('/users/login')
                                })
                                .catch(err => {
                                    connsole.log(err);
                                    return;
                                });
                        });
                    });
                }
            })

    }
});

//Loggout user
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login')
});


module.exports = router;
