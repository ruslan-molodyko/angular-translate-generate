/**
 * Created by rmolodyko on 30.01.2016.
 */

var fs = require('fs'),
    Class = require('./class.js');

/**
 * Work with keys of translate
 */
var Parser = Class.create(function() {

    /**
     * Init parser
     * @param source
     */
    this.constructor = function(source) {

        // Path to file
        this.source = source;

        // Pattern for getting translate expression
        this.$patternTranslate = /\{\{\s*\"([\w\W]*?)\"\s*\|\s*translate\s*\}\}/gmi;
    };

    /**
     * Get keys from file
     */
    this.getKeys = function(cb) {

        // Pass content of file to the callback
        fs.readFile(this.source, 'utf8', function(err, content) {

            // Handle error
            if (err) {
                throw new Error('Error when read file [' + this.source + ']');
            }

            // Parse content and get keys
            var keys = this.parse(content);

            // Call callback
            cb(keys, this.source);
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

var Trans = Class.create(function() {
    this.constructor = function(config) {

        this.source = config.source;
        this.output = config.output;

        this.eachSource(function(item) {

            var parser = new Parser(item, this.output);
            parser.getKeys(this.handleKeys.bind(this));

        }.bind(this));

    };

    this.handleKeys = function(keys, source) {

        // Check keys
        if (keys == null) {
            throw new Error('Keys not found in [' + source + ']');
        }

        // Format keys
        keys.forEach(function(item, key) {
            keys[key] = this.formatKeys(item, key);
        }.bind(this));

        console.log(keys);
    };

    /**
     * Iteraet all sources
     * @param cb
     */
    this.eachSource = function(cb) {
        this.source.forEach(cb);
    };

    /**
     * Format keys to some format
     * @param value
     * @param key
     * @returns {*}
     */
    this.formatKeys = function(value, key) {
        return value.replace(/\s+/g, '_').toLowerCase();
    };
});

//new Parser();

module.exports = Trans;
