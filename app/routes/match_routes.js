var KeySet     = require('../../models/KeySet');
var Message     = require('../../models/message');
const sysvars             = require('../../config/db');
const bodyParser     = require('body-parser');
const crypto = require('crypto');

module.exports = function(app, db) {

    /**
     * generates random string of characters i.e salt
     * @function
     * @param {number} length - Length of the random string.
     */
    var genRandomString = function (length) {
        return crypto.randomBytes(Math.ceil(length / 2))
            .toString('hex') /** convert to hexadecimal format */
            .slice(0, length);
        /** return required number of characters */
    };

    /**
     * hash password with sha512.
     * @function
     * @param {string} password - List of required fields.
     * @param {string} salt - Data to be validated.
     */
    var sha512 = function (password, salt) {
        var hash = crypto.createHmac('sha512', salt);
        /** Hashing algorithm sha512 */
        hash.update(password);
        var value = hash.digest('hex');
        return {
            salt: salt,
            passwordHash: value
        };
    };

    // the function used to get session info and ensure user is authorized
    function ensureAuthorized(req, res, next) {
        var bearerToken;
        var bearerHeader = req.headers["authorization"];
        if (typeof bearerHeader !== 'undefined') {
            var bearer = bearerHeader.split(" ");
            bearerToken = bearer[1];
            req.token = bearerToken;
            next();// user is authorized, move along frand
        } else {
            res.send(403);// tell them they r nutt allowed in here
        }
    }


    app.get('/match/listener', function (req, res) {
        KeySet.findOne({paired: false, Lfound: false, Vfound: true}, function (err, keyset) {
            if (err) {
                res.json({
                    type: false,
                    data: "Error occured: " + err
                });
            } else {
                console.log(keyset);
                if (keyset == undefined || keyset == null) { // means no one waiting, create a session and tell them to wait
                    console.log("in the creation set");
                    keygen = new KeySet();
                    keygen.key = genRandomString(12);
                    keygen.paired = false;
                    keygen.Lfound = true;
                    keygen.Vfound = false;
                    keygen.save(function (err, user1) {
                        res.json({
                            key: keygen.key,
                            wait: true
                        });
                    });
                } else { // means that one was found
                    console.log(keyset);
                    keyset.paired = true;
                    keyset.Lfound = true;
                    keyset.save(function (err, user1) {
                        res.json({
                            key: keyset.key,
                            wait: false
                        });
                    });
                }
            }
        });
    });


    app.get('/match/venter', function (req, res) {
        KeySet.findOne({paired: false, Lfound: true, Vfound: false}, function (err, keyset) {
            if (err) {
                res.json({
                    type: false,
                    data: "Error occured: " + err
                });
            } else {
                if (keyset == undefined || keyset == null) { // means no one waiting, create a session and tell them to wait
                    keygen = new KeySet();
                    keygen.key = genRandomString(12);
                    keygen.paired = false;
                    keygen.Lfound = false;
                    keygen.Vfound = true;
                    keygen.save(function (err, user1) {
                        res.json({
                            key: keygen.key,
                            wait: true
                        });
                    });
                } else { // means that one was found
                    console.log(keyset);
                    keyset.paired = true;
                    keyset.Vfound = true;
                    keyset.save(function (err, user1) {
                        res.json({
                            key: keyset.key,
                            wait: false
                        });
                    });
                }
            }
        });
    });

    app.post('/match/checkstatus', function (req, res) {
        KeySet.findOne({key: req.body.key}, function (err, keyset) {
            if (err) {
                res.json({
                    type: false,
                    data: "Error occured: " + err
                });
            } else {
                console.log(keyset);
                if (keyset.paired) { // if this transitioned to true, means someone connected
                    res.json({
                        wait: false
                    });
                } else {
                    res.json({
                        wait: true
                    });
                }
            }
        });
    });

    app.post('/getMssg', function (req, res) {
        Message.find({key: req.body.key}, function (err, messagesRetrieved) {
            if (err) {
                res.json({
                    type: false,
                    data: "Error occured: " + err
                });
            } else {
                console.log(messagesRetrieved);
                res.json({
                    type: true,
                    data: messagesRetrieved
                });
            }
        });
    });

    app.post('/sendMssg', function (req, res) {
        let mymssg = Message();
        mymssg.mssg = req.body.mssg;
        mymssg.key = req.body.key;
        mymssg.save((err, message) => {
            if (err) {
                res.json({
                    type: false,
                    data: "Error occured: " + err
                });
            } else {
                console.log(message);
                    res.json({
                        type: true,
                        data: message
                    });

            }
        });
    });



    process.on('uncaughtException', function (err) {
        console.log(err);
    });
}