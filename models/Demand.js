var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DemandSchema = new Schema({
    description: String,
    longitude: Number,
    latitude: Number,
    comments : [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
    images : [{ type: Schema.Types.ObjectId, ref: 'Image' }],
    created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Demand', DemandSchema);