require('dependency-binder')();

//Iterative Levenshtein distance
function distanceBetween(s, t) {
    if (s == t) return 0;
    if (s.length == 0) return t.length;
    if (t.length == 0) return s.length;

    var v0 = [];
    var v1 = [];
    var length = t.length + 1;

    for (var i = 0; i < length; i++) {
        v0[i] = i;
    }

    for (var i = 0; i < s.length; i++) {
        v1[0] = i + 1;
        for (var j = 0; j < t.length; j++) {
            var cost = (s[i] == t[j]) ? 0 : 1;
            v1[j + 1] = Math.min(v1[j] + 1, v0[j + 1] + 1, v0[j] + cost);
        }

        for (var j = 0; j < length; j++) {
            v0[j] = v1[j];
        }
    }

    return v1[t.length];
}

module.exports = {
    distanceBetween: distanceBetween,
    match: function(objects, key, target) {
        var distances = [],
            i = 0,
            exact = false,
            exactIndex = -1;
        while (i < objects.length && exact == false) {
            var distance = distanceBetween(objects[i][key], target);
            if (distance != 0) {
                distances.push(distance);
                i++;
            } else {
                exact = true;
                exactIndex = i;
            }
        }

        return exact ? objects[exactIndex][key] :
            objects[distances.indexOf(Math.min.apply(null, distances))][key];
    }
}
