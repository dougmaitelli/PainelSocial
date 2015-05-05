var mongoose = require('mongoose');
var Schema = mongoose.Schema;
 
var DemandSchema = new Schema({
    description: String,
    longitude: Number,
    latitude: Number,
    images: [String],
    tags: [String],
    comments: [String],
    rate: [Boolean],
    created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Demand', DemandSchema);