/**
 * Created by rmolodyko on 30.01.2016.
 */
module.exports = function(keys) {

    var result = {},
        value;

    for (var key in keys) {
        value = keys[key];
        result[key] = value + 'translate';
    }

    return result;
};
