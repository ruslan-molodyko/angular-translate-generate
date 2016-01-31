/**
 * Created by rmolodyko on 30.01.2016.
 * molot1393
 */
var key = 'trnsl.1.1.20160130T163723Z.194841daa5de2be9.120de7908004dd6c396767a4e59b9c35b1592f26',
    translate = require('yandex-translate')(key),
    convertLang = {
        'ua_UK': 'uk',
        'ru_RU': 'ru'
    };

/**
 * Translate values
 * @param keys
 * @param cb
 * @param lang
 */
module.exports = function(keys, cb, lang) {

    var result = {};

    for (var key in keys) {
        // Use closure for storing keys
        (function(key) {

            // Do translate
            translate.translate(keys[key], {to: convertLang[lang]}, function(err, res) {

                // Check valid
                if (res == null || res.text == null || res.text[0] == null) {
                    throw new Error('Translate word was wrong [' + key + ']');
                }

                // Get translate
                result[key] = res.text[0];

                // If all words was translated then call callback
                if (Object.keys(result).length == Object.keys(keys).length) {
                    cb(result);
                }
            });
        })(key);
    }
};
