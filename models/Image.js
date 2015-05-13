var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ImageSchema = new Schema({
    image: String,
    demandId: { type: String },
    commentId: { type: String },
    created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Image', ImageSchema);