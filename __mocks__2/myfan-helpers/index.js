var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var Navigation = require('./lib/url');
var Url = jest.fn().mockImplementation(function () {
    return { query: { redirect_uri: "/dummy", "account_link[email]": true } };
});
module.exports = __assign({}, Navigation, { Url: Url });
