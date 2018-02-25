var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
 
var KeySchema = new Schema({
    key: String,
    paired: Boolean,
    Lfound: Boolean,
    Vfound: Boolean
});

module.exports = mongoose.model('KeySet', KeySchema);