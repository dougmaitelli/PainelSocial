var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RateSchema = new Schema({
    status: Number,
    creator: { type: Schema.Types.ObjectId, ref: 'User' },
    demandId: { type: Schema.Types.ObjectId, ref: 'Demand' },
    created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Rate', RateSchema);