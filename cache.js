define(['jquery', 'underscore', 'jquery.cookie'], function ($, _) {

    var cache = {};

    function Cache () {}

    Cache.setObject = function (name, object) {
        cache[name] = object;
    }

    Cache.getObject = function (name) {
        return cache[name];
    }

    Cache.deleteObject = function (name) {
        delete cache[name];
    }

    Cache.setCookie = function (key, jsonData, options) {
        $.cookie.json = true;
        $.cookie(key, jsonData, options);
        $.cookie.json = false;
    }

    Cache.getCookie = function (key) {
        $.cookie.json = true;
        var val = $.cookie(key);
        $.cookie.json = false;
        return val;
    }

    Cache.getRawCookie = function (key) {
        var prevState = $.cookie.json;
        $.cookie.json = false;
        var val = $.cookie(key);
        $.cookie.json = prevState;
        return val;
    }

    Cache.deleteCookie = function (key) {
        Cache.setCookie(key, null, {expires: -1});
    }

    Cache.saveInLocalStorage = function (key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    }

    Cache.getFromLocalStorage = function (key) {
        return JSON.parse(localStorage.getItem(key));
    }
    Cache.removeFromLocalStorage = function (key) {
        localStorage.removeItem(key);
    }

    Cache.set = function (key, data, extend) {
        var wrapper = {d: null};
        if (extend) {
            var exData = Cache.get(key);
            if (exData) {
                wrapper.d = _.extend(exData, data);
            } else {
                wrapper.d = data;
            }
        } else {
            wrapper.d = data;
        }
        if (localStorage && localStorage.setItem)
            Cache.saveInLocalStorage(key, wrapper);
        else if ($.cookie)
            Cache.setCookie(key, wrapper);
        else
            Cache.setObject(key, wrapper);
    }

    Cache.get = function (key) {
        var wrapper = null;
        if (localStorage && localStorage.getItem)
            wrapper = Cache.getFromLocalStorage(key);
        else if ($.cookie)
            wrapper = Cache.getCookie(key);
        else
            wrapper = Cache.getObject(key);
        if (wrapper && wrapper.d)
            return wrapper.d;
    }

    Cache.getOnce = function (key) {
        var _val = Cache.get(key);
        if (localStorage && localStorage.removeItem)
            Cache.removeFromLocalStorage(key);
        else if ($.cookie)
            Cache.deleteCookie(key);
        else
            Cache.deleteObject(key);
        return _val;
    }

    return Cache;

});
