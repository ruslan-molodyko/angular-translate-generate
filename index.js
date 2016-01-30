/**
 * Created by rmolodyko on 30.01.2016.
 */

var fs = require('fs'),
    Class = require('./class.js'),
    Parser = require('./parser.js'),
    Writer = require('./writer.js');

module.exports = Class.create(function() {

    /**
     * Init class
     * @param config
     */
    this.constructor = function(config) {

        this.source = config.source;
        this.output = config.output;
        this.locales = config.locales;
        this.defaultFormat = config.defaultFormat || 'raw';

        // Init parser
        this.parser = new Parser();

        // Init writer
        this.writer = new Writer(this.output);

        // Path to format handlers
        this.$pathFormat = './format';
    };

    this.handleLocales = function(keys) {

        // Check if locales exists
        if (this.locales == null) {
            throw new Error('Locales not found');
        }

        // List of formatter
        var formatterList = {},
            values = keys;

        // Iterate all reserved locales and get content and write for each locale
        for (var localeKey in this.locales) {
            var locale = this.locales[localeKey];

            // Get formatter
            var formatKey = locale.format || this.defaultFormat;

            // Get formatter instance
            formatterList[formatKey] = formatterList[formatKey] || require(this.$pathFormat + '/' + formatKey);

            // Check existing
            if (formatterList[formatKey] == null) {
                throw new Error('Formatter not found [' + formatKey + ']');
            }

            // Format keys
            var newKeys = {};
            keys.forEach(function(item, key) {
                // Change keys and save valus
                newKeys[this.formatKeys(item, key)] = values[key];
            }.bind(this));

            // Handle keys and get content of locale file
            var data = formatterList[formatKey](newKeys),
                langName = this.getLangName(locale, localeKey);

            this.writer.write(langName, data);
        }
    };

    /**
     * Get right locale name for using in writer
     * @param locale
     * @param localeKey
     * @returns {*}
     */
    this.getLangName = function(locale, localeKey) {

        // If name is exists use it or use locale key
        if (locale.name != null) {
            return locale.name;
        } else {
            return localeKey;
        }
    };

    /**
     * Start handling
     */
    this.start = function() {

        // Iterate all sources(files with translates) and handle their
        this.eachSource(function(path) {

            // Get all keys of file
            this.parser.getKeys(path, this.handleKeys.bind(this));

        }.bind(this));
    };

    this.handleKeys = function(keys, source) {

        // Check keys
        if (keys == null) {
            throw new Error('Keys not found in [' + source + ']');
        }

        this.handleLocales(keys);
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
        return value
            //.replace(/\s+/g, '_')
            //.replace(/[\"\']/g, '')
            //.toLowerCase()
            ;
    };
});
