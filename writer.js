/**
 * Created by rmolodyko on 30.01.2016.
 */
var fs = require('fs'),
    Class = require('./class.js');

/**
 * Class for saving content of translation to the file
 */
module.exports = Class.create(function() {

    /**
     * Init class
     * @param output
     * @param prefixFileName
     * @param suffixFileName
     */
    this.constructor = function(output, prefixFileName, suffixFileName) {

        // If output doesn't have last slash(/) then concatenate it
        this.output = output.match(/\/$/) ? output : output + '/';
        this.prefixFileName = prefixFileName || 'locale-';
        this.suffixFileName = suffixFileName || '.json';
    };

    /**
     * Save translate to the file
     * @param langName
     * @param data
     */
    this.write = function(langName, data) {

        var content = JSON.stringify(data),
            fileName = this.output + this.prefixFileName + langName + this.suffixFileName;

        // Save content to the file
        fs.writeFile(fileName, this.formatContent(content), function(err) {

            // Check error
            if(err) {
                throw new Error('Error when create lang file [' + fileName + ']');
            }

            // Display success message
            console.log("The [" + fileName + "] file was saved");
        });
    };

    /**
     * Beautify content for comfortable using
     * @param content
     * @returns {XML|*|void|string}
     */
    this.formatContent = function(content) {

        // Add new line symbol
        return content.replace(/\",/g, '",\r\n');
    };
});
