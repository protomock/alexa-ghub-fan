const HOSTNAME = 'api.github.com';
const USER_AGENT = process.env.USER_AGENT;
const GET = "GET";
const POST = "POST";

require('dependency-binder')({
    https: require('https')
});
var http = binder.resolve('https');

function createQueryString(data, accessToken) {
    var qs = "?";
    for (var key in data) {
        qs += key + "=" + data[key] + "&";
    }
    return qs += "access_token=" + accessToken;
}

module.exports = {
    makeRequest: function(method, path, data, accessToken, onSuccess, onError) {
        var options = {
            hostname: HOSTNAME,
            port: 443,
            path: path,
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': USER_AGENT
            }
        };

        options.path += method === GET ?
            createQueryString(data, accessToken) :
            createQueryString({}, accessToken)

        var req = http.request(options, function(res) {
            res.body = "";
            res.setEncoding('utf8');
            res.on('data', function(chunk) {
                res.body += chunk;
            });
            res.on('end', function() {
                var body = JSON.parse(res.body);
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    onSuccess(body);
                } else {
                    console.log(body);
                    onError(body);
                }
            });
        });

        if (method !== GET) {
            req.write(JSON.stringify(data));
        }
        req.end();
    }
}
