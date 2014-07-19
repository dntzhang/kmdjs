define("Ket.Base.Http", {
    statics: {
        ajax: function (option) {
            var encodeUriComponent = function (sStr) {
                sStr = encodeURIComponent(sStr);
                sStr = sStr.replace(/~/g, "%7E");
                sStr = sStr.replace(/!/g, "%21");
                sStr = sStr.replace(/\*/g, "%2A");
                sStr = sStr.replace(/\(/g, "%28");
                sStr = sStr.replace(/\)/g, "%29");
                sStr = sStr.replace(/'/g, "%27");
                sStr = sStr.replace(/\?/g, "%3F");
                sStr = sStr.replace(/;/g, "%3B");
                return sStr;
            };
            var toQueryPair = function (key, value) {
                return encodeURIComponent(String(key)) + "=" + encodeURIComponent(String(value));
            };
            var toQueryString = function (obj) {
                var result = [];
                for (var key in obj) {
                    result.push(toQueryPair(key, obj[key]));
                }
                return result.join("&");
            };
            if (typeof window.XMLHttpRequest === "undefined") {
                window.XMLHttpRequest = function () {
                    return new window.ActiveXObject(navigator.userAgent.indexOf("MSIE 5") >= 0 ? "Microsoft.XMLHTTP" : "Msxml2.XMLHTTP");
                };
            }
            var httpRequest, httpSuccess, timeout, isTimeout = false,
                isComplete = false;
            option = {
                url: option.url,
                method: (option.method || "GET").toUpperCase(),
                data: option.data || null,
                arguments: option.arguments || null,
                success: option.success ||
                function () { },
                onError: option.onError ||
                function () { },
                onComplete: option.onComplete ||
                function () { },
                onTimeout: option.onTimeout ||
                function () { },
                isAsync: option.isAsync || true,
                timeout: option.timeout || 30000,
                contentType: option.contentType,
                type: option.type || "xml"
            };
            if (option.data && typeof option.data === "object") {
                option.data = toQueryString(option.data);
            }
            var url = option.url || "";
            timeout = option.timeout;
            httpRequest = new window.XMLHttpRequest();
            httpSuccess = function (r) {
                try {
                    return (!r.status && location.protocol == "file:") || (r.status >= 200 && r.status < 300) || (r.status == 304) || (navigator.userAgent.indexOf("Safari") > -1 && typeof r.status == "undefined");
                } catch (e) { }
                return false;
            }
            httpRequest.onreadystatechange = function () {
                if (httpRequest.readyState == 4) {
                    if (!isTimeout) {
                        var o = {};
                        o.responseText = httpRequest.responseText;
                        o.responseXML = httpRequest.responseXML;
                        o.data = option.data;
                        o.status = httpRequest.status;
                        o.url = url;
                        o.arguments = option.arguments;
                        if (option.type === 'json') {
                            try {
                                if ("object" != typeof JSON) {
                                    kmdjs.get("Ket.Util.JSON", function () {
                                        o.responseJSON = JSON.parse(httpRequest.responseText);
                                        if (httpSuccess(httpRequest)) {
                                            option.success(o);
                                        } else {
                                            option.onError(o);
                                        }
                                        option.onComplete(o);
                                        isComplete = true;
                                        httpRequest = null;
                                    });
                                    return;
                                } else {
                                    o.responseJSON = JSON.parse(httpRequest.responseText);
                                }
                            } catch (e) { }
                        }
                        if (httpSuccess(httpRequest)) {
                            option.success(o);
                        } else {
                            option.onError(o);
                        }
                        option.onComplete(o);
                    }
                    isComplete = true;
                    httpRequest = null;
                }
            };
            if (option.method === "GET") {
                if (option.data) {
                    url += (url.indexOf("?") > -1 ? "&" : "?") + option.data;
                    option.data = null;
                }
                httpRequest.open("GET", url, option.isAsync);
                httpRequest.setRequestHeader("Content-Type", option.contentType || "text/plain;charset=UTF-8");
                httpRequest.send();
            } else if (option.method === "POST") {
                httpRequest.open("POST", url, option.isAsync);
                httpRequest.setRequestHeader("Content-Type", option.contentType || "application/x-www-form-urlencoded;charset=UTF-8");
                httpRequest.send(option.data);
            } else {
                httpRequest.open(option.method, url, option.isAsync);
                httpRequest.send();
            }
            window.setTimeout(function () {
                var o;
                if (!isComplete) {
                    isTimeout = true;
                    o = {};
                    o.url = url;
                    o.arguments = option.arguments;
                    option.onTimeout(o);
                    option.onComplete(o);
                }
            }, timeout);
            return httpRequest;
        },
        loadScript: function (option) {
            var doc = document;
            var head = doc.head || doc.getElementsByTagName("head")[0] || doc.documentElement;
            var baseElement = head.getElementsByTagName("base")[0];
            request(option.url, option.callback, option.charset);

            function request(url, callback, charset) {
                var node = doc.createElement("script");
                if (charset) {
                    var cs = (Object.prototype.toString.call(charset) == "[object Function]") ? charset(url) : charset;
                    if (cs) {
                        node.charset = cs;
                    }
                }
                addOnload(node, callback, url);
                node.async = true;
                node.src = url;
                baseElement ? head.insertBefore(node, baseElement) : head.appendChild(node);
            }
            function addOnload(node, callback, url) {
                var supportOnload = "onload" in node;
                if (supportOnload) {
                    node.onload = onload;
                    node.onerror = function () {
                        emit("error", {
                            uri: url,
                            node: node
                        });
                        onload(true);
                    };
                } else {
                    node.onreadystatechange = function () {
                        if (/loaded|complete/.test(node.readyState)) {
                            onload();
                        }
                    };
                }
                function onload(error) {
                    node.onload = node.onerror = node.onreadystatechange = null;
                    head.removeChild(node);
                    node = null;
                    if (callback) callback(error)
                }
            }
        },
        jsonp: function (option) {
            var uuid = guid();
            var functionName = "KetJsonpCallback_" + uuid;
            window[functionName] = function (data) {
                if (option.success) option.success(data);
                window[functionName] = null;
            }
            option.url = option.url.replace(/callback=\?/g, "callback=" + functionName);
            this.loadScript(option);

            function s4() {
                return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
            };

            function guid() {
                return s4() + s4() + s4() + s4() + s4() + s4() + s4() + s4();
            }
        }
    }
})