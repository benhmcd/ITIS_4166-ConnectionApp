const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const connectionSchema = new Schema({
    name: {type: String, required: [true, "a name is required"]},
    topic: {type: String, required: [true, "a topic is required"]},
    details: {type: String, required: [true, "event details are required"]},
    date: {type: String, required: [true, "event's date is required"]},
    start_time: {type: String, required: [true, "start time is required"]},
    end_time: {type: String, required: [true, "end time is required"]},
    location: {type: String, required: [true, "location is required"]},
    host_name: {type: Schema.Types.ObjectId, ref: 'User'},
    image: {type: String, required: [true, "image url is required"]}
});

//collection name is connections in the database
module.exports = mongoose.model('Connection', connectionSchema);