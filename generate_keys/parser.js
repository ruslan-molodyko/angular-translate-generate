/**
 * Created by rmolodyko on 30.01.2016.
 */

var fs = require('fs'),
    Class = require('./class.js');

/**
 * Work with keys of translate
 */
module.exports = Class.create(function() {

    /**
     * Init parser
     * @param source
     */
    this.constructor = function() {

        // Pattern for getting translate expression
        this.$patternTranslate = /\{\{\s*\"([\w\W]*?)\"\s*\|\s*translate\s*\}\}/gmi;
    };

    /**
     * Get keys from file
     */
    this.getKeys = function(path, cb) {

        // Pass content of file to the callback
        fs.readFile(path, 'utf8', function(err, content) {

            // Handle error
            if (err) {
                throw new Error('Error when read file [' + path + ']');
            }

            // Parse content and get keys
            var keys = this.parse(content);

            // Call callback
            cb(keys, path);
        }.bind(this));
    };

    /**
     * Get keys
     * @param content
     * @returns {Array}
     */
    this.parse = function(content) {

        var matches = content.match(this.$patternTranslate),
            result = [];

        // Check if matches is exists
        if (matches != null) {

            // Get key from translate expression
            matches.forEach(function(item) {
                result.push(item.replace(this.$patternTranslate, '$1'));
            }.bind(this));
        }

        return result;
    };
});
