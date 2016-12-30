require('dependency-binder')();

module.exports = {
    convertSpacesToDashes: function(text) {
        return text.replace(/ /g, '-');
    }
}
