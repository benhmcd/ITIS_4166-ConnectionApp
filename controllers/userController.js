const user_model = require('../models/user');
const connection_model = require('../models/connection');
const rsvp_model = require('../models/rsvp');

exports.new = (req, res) => {
    return res.render('./user/new');
};

exports.create = (req, res, next) => {
    let user = new user_model(req.body);
    if (user.email)
        user.email = user.email.toLowerCase();
    user.save()
        .then(user => {
            req.flash('success', 'Registration succeeded!');
            res.redirect('/users/login');
        })
        .catch(err => {
            if (err.name === 'ValidationError') {
                req.flash('error', err.message);
                return res.redirect('back');
            }

            if (err.code === 11000) {
                req.flash('error', 'Email has already been used.');
                return res.redirect('/users/new');
            }
            next(err);
        });
};

exports.getUserLogin = (req, res, next) => {
    return res.render('./user/login');
}

exports.login = (req, res, next) => {
    let email = req.body.email;
    if (email)
        email = email.toLowerCase();
    let password = req.body.password;
    user_model.findOne({ email: email })
        .then(user => {
            if (!user) {
                req.flash('error', 'Incorrect email address!');
                res.redirect('/users/login');
            } else {
                user.comparePassword(password)
                    .then(result => {
                        if (result) {
                            req.session.user = user._id;
                            req.session.username = user.firstName;
                            req.flash('success', 'Successfully logged in!');
                            res.redirect('/');
                        } else {
                            req.flash('error', 'Incorrect password!');
                            res.redirect('/users/login');
                        }
                    });
            }
        })
        .catch(err => next(err));
};

exports.profile = (req, res, next) => {
    let user_id = req.session.user;

    connection_model.find({ host_name: user_id })
        .then(connections => {
            rsvp_model.find({attendee: user_id}).populate("connection")
            .then(rsvps => {
                res.render('./user/profile', { connections, rsvps });      
            })
            .catch(err => next(err));
        })
        .catch(err => next(err));
};

exports.logout = (req, res, next) => {
    req.session.destroy(err => {
        if (err)
            return next(err);
        else
            res.redirect('/');
    });
};