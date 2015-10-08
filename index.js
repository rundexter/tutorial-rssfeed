var _ = require('lodash'),
    request = require('request'),
    FeedParser = require('feedparser');
module.exports = {
    run: function(step, dexter) {
        var url = step.input('url').first(),
            filter = step.input('filter').first(),
            self = this;
        if(!url) {
            this.log('No url provided, returing to App');
            //It's not really a critical failure to not have an 
            //  url to work with, so we'll roll on.
            return this.complete();
        }
        this.fetchUrl(url, function(err, stream) {
            if(err) {
                return self.fail(err);
            }
            //Let the parser grab the data
            self.fetchItems(stream, function(err, items) {
                var response = [];
                if(err) {
                    return self.fail(err);
                }
                //Extract dexter-friendly data from the items
                _.each(items, function(item) {
                    response.push({
                        url: item.link,
                        title: item.title,
                        summary: item.summary,
                        author: item.author
                    });
                });
                return self.complete(response);
            });
        });
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
