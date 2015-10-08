var _ = require('lodash'),
    request = require('request'),
    FeedParser = require('feedparser');
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
    },
    fetchItems: function(stream, callback) {
        var parser = new FeedParser()
            , items = [];
        parser.on('error', callback);
        parser.on('end', function(err) {
            if(err) {
                return callback(err);
            }
            return callback(null, items);
        });
        parser.on('readable', function() {
            var item;
            while((item = this.read())) {
                items.push(item);
            }
        });
        stream.pipe(parser);
    }
};
