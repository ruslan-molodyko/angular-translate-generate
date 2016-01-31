/**
 * Created by rmolodyko on 30.01.2016.
 */
/**
 * Values as keys
 * @param keys
 * @param cb
 * @param lang
 */
module.exports = function(keys, cb, lang) {

    var result = {},
        value;

    for (var key in keys) {
        value = keys[key];
        result[key] = value;
    }

    cb(result);
};
