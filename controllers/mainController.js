const {render} = require('ejs');

exports.index = (req, res) => {
    //sends all connections
        res.render('index');
};

exports.about = (req, res) => {
        res.render('about');
}

exports.contact = (req, res) => {
        res.render('contact');
}

exports.error = (req, res, next) => {
        res.render('error');
}