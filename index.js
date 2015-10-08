var _ = require('lodash'),
    request = require('request');
module.exports = {
    run: function(step, dexter) {
    },
    fetchUrl: function(url, callback) {
        var req = request(url);
        req.on('error', callback);
        req.on('response', function(resp) {
            if(resp.statusCode != 200) {
                return callback(new Error(
                    'Bad status code ' + resp.statusCode + ' for ' + url
                ));
            }
            return callback(null, this);
        });
    }
};
