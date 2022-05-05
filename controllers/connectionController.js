const connection_model = require('../models/connection');
const rsvp_model = require('../models/rsvp');

exports.index = (req, res, next) => {
    //sends all connections
    connection_model.find()
        .then(connections => {
            res.render('./connection/connections', { connections });
        })
        .catch(err => next(err));
};

exports.new = (req, res) => {
    res.render('./connection/new');
};

exports.create = (req, res, next) => {
    let connection = new connection_model(req.body);
    connection.host_name = req.session.user;
    connection.save()
        .then(connection => {
            req.flash('success', 'Connection has been created successfully!');
            res.redirect('/connections');
        })
        .catch(err => next(err));
};

exports.show = (req, res, next) => {
    let connection_id = req.params.id;
    connection_model.findById(connection_id).populate('host_name', 'firstName lastName')
        .then(connection => {
            rsvp_model.find({connection: connection_id, status: 'yes'})
                .then(rsvps => {
                    if (connection) {
                        return res.render('./connection/connection', { connection, rsvps });
                    } else {
                        let err = new Error('Cannot find a connection with id ' + connection_id);
                        err.status = 404;
                        next(err);
                    }
                })
                .catch(err => next(err));
        })
        .catch(err => next(err));
};

exports.edit = (req, res, next) => {
    let connection_id = req.params.id;
    connection_model.findById(connection_id)
        .then(connection => {
            return res.render('./connection/edit', { connection });
        })
        .catch(err => next(err));
};

exports.update = (req, res, next) => {
    let connection = req.body;
    let connection_id = req.params.id;

    connection_model.findByIdAndUpdate(connection_id, connection, { useFindAndModify: false, runValidators: true })
        .then(connection => {
            req.flash('success', 'Connection was updated successfully!');
            return res.redirect('/connections/' + connection_id);
        })
        .catch(err => next(err));
};

exports.delete = (req, res, next) => {
    let connection_id = req.params.id;
    rsvp_model.findAnd
    connection_model.findByIdAndDelete(connection_id, { useFindAndModify: false })
        .then(connection => {
            rsvp_model.deleteMany({connection: connection_id})
            .then(rsvp => {
                req.flash('success', 'Connection and RSVPs were deleted successfully!');
                res.redirect('/connections');
            })
            .catch(err => next(err));
        })
        .catch(err => next(err));
};

exports.rsvp = (req, res, next) => {
    let connection_id = req.params.id;

    rsvp_model.findOne({connection: connection_id, attendee: req.session.user})
        .then(result => {
            if (!result) {
                let rsvp = new rsvp_model(req.body);
                rsvp.connection = connection_id;
                rsvp.attendee = req.session.user;
                rsvp.save()
                    .then(rsvp => {
                        req.flash('success', 'RSVP has been created successfully!');
                        res.redirect('/users/profile');
                    })
                    .catch(err => next(err));
            } else {
                let rsvp = req.body;
                
                rsvp_model.findOneAndUpdate({connection: connection_id, attendee: req.session.user}, rsvp, { useFindAndModify: false, runValidators: true })
                    .then(connection => {
                        req.flash('success', 'RSVP was updated successfully!');
                        res.redirect('/users/profile');;
                    })
                    .catch(err => next(err));
            }
        })
        .catch(err => next(err))
}
