/**
 * Created by rmolodyko on 30.01.2016.
 */
var fs = require('fs'),
    cheerio = require('cheerio'),
    Class = require('./../generate_keys/class.js');

/**
 * Generate new view(html file) with defined translates
 */
module.exports = Class.create(function() {

    /**
     * Init class
     * @param config
     */
    this.constructor = function(config) {

        // Init data
        this.source = config.source;
        this.output = config.output;
        this.prefix = config.prefix;

        // Find text expressions
        this.patternTag = /(>)([\w\W]*?)(<)/gmi;

        // Match to translated words
        this.patternTranslte = /[\w\W]*?\{\{[\w\W]*?\|\s*translate\s*\}\}[\s\S]*/m;

        // Prefix for expression
        this.wrapperPrefix = '{{ "';

        // Suffix for expression
        this.wrapperSuffix = '"|translate }}';

        // Default selector which will be use if local selector not passed
        this.defaultSelector = 'html';
    };

    /**
     * Start generation
     */
    this.start = function() {

        // Iterate all path which was defined in config and generate translate
        for (var path in this.source) {
            // Get source
            var source = this.source[path],
                selectors = source != null && source.selectors ? source.selectors : [this.defaultSelector];

            // Get file and do next operations
            this.getFile(path, selectors, this.handleContent.bind(this));
        }
    };

    /**
     * Get content from file and generate new content of file and save result
     * @param path
     * @param selectors
     * @param content
     */
    this.handleContent = function(path, selectors, content) {

        var $ = cheerio.load(content, {
                decodeEntities: false // Disallow decoding
            }),
            // Get new path with prefix
            newPath = path.replace(/(.*\/)(.*)$/g, '$1/' + this.prefix + '$2');

        // If selector is one then surround it to the array
        if (typeof selectors === 'String') {
            selectors = [selectors];
        }

        // Iterate all selectors and generate content for them
        selectors.forEach(function(selector) {

            // Get content of page by selector(some specific part of page)
            var content = $(selector).html();

            // If selector has no any tags only text
            if (!content.match(/[<>]/g)) {
                content = this
                    .handleOneMatch('>' + content + '<') // Wrap content to brackets for emulate tag
                    .replace(/^>([\w\W]*?)<$/g, '$1'); // Remove brackets from result string
            } else {

                // Fill all content
                content = this.fill(content)
            }

            // Set new content to the page
            $(selector).html(content);
        }.bind(this));

        // Save result to the file
        this.saveFile(newPath, $.html());
    };

    /**
     * Save file with generated translate
     * @param path
     * @param content
     */
    this.saveFile = function(path, content) {
        fs.writeFile(path, content, function(err) {
            console.log('File [' + path + '] was generated');
        });
    };

    /**
     * Read file
     * @param path
     */
    this.getFile = function(path, selector, cb) {

        // Get content of file
        fs.readFile(path, 'utf8', function(err, content) {

            // Check error
            if (err) {
                throw new Error('There is error when attempt to read file [' + path + ']');
            }

            // Do next action
            cb(path, selector, content);
        }.bind(this));
    };

    /**
     * Insert new tags
     * @param content
     * @returns {XML|*|void|string}
     */
    this.fill = function(content) {

        // Replace word expression to the translate wrapper
        return content.replace(this.patternTag, this.handleOneMatch.bind(this));
    };

    /**
     *
     */
    this.handleOneMatch = function(match) {

        var expression = match.replace(this.patternTag, '$2'), // Get word expression without tags
            // If expression is already translated
            isAlreadyTranslate = !!expression.match(this.patternTranslte), // Check if this words have not translate
            // If expression has brackets
            isWrongExpression = expression.match(/[<>]/g),
            // If expression is empty
            isEmpty = !expression.replace(/[\r\n\t\s]*/g, '');

        // If wrong expression get the save string
        if (isAlreadyTranslate || isWrongExpression || isEmpty) {
            return match;
            // Or get handled string
        } else {
            return match.replace(
                this.patternTag,
                '$1' + this.wrapperKey(
                    expression
                        .replace(/[\r\n\t]*/g, '') // Remove new line
                        .replace(/[\s]+/g, ' ') // Remove many of spaces left only one
                        .replace(/(^\s)|(\s$)/, '') // Remove spaces before and after string
                        .replace(/\"+/g, '\\"') // Escape symbol
                ) + '$3'
            );
        }
    };

    /**
     * Get content of translate tag
     * @param key
     * @returns {*}
     */
    this.wrapperKey = function(key) {
        return this.wrapperPrefix + key + this.wrapperSuffix;
    }
});
