var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CommentSchema = new Schema({
    creator: { type: Schema.Types.ObjectId, ref: 'User' },
    description: String,
    demandId: { type: Schema.Types.ObjectId, ref: 'Demand' },
    images : [String],
    created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Comment', CommentSchema);