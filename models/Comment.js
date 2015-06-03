var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CommentSchema = new Schema({
    description: String,
    demandId: { type: String, ref: 'Demand' },
    images : [{ type: Schema.Types.ObjectId, ref: 'Image' }],
    created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Comment', CommentSchema);