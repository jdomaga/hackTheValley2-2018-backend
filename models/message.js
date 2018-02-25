var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var messageSchema = new Schema({
    key: String,
    mssg: String
});

module.exports = mongoose.model('Message', messageSchema);