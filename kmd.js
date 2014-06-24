/* KMD.js Kill AMD and CMD
 * By 当耐特 http://weibo.com/iamleizhang
 * KMD.js http://kmdjs.github.io/
 * blog: http://www.cnblogs.com/iamzhanglei/
 * My website:http://htmlcssjs.duapp.com/
 * MIT Licensed.
 */
(function (exports, global) {
    /**
     * @param {Object} path
     * @param {Function} callback
     * @param {string} test
     * @return {undefined}
     */
    function request(path, callback, test) {
        /** @type {Element} */
        var node = doc.createElement("script");
        var charset;
        if (test) {
            charset = isFunction(test) ? test(path) : test;
            if (charset) {
                node.charset = charset;
            }
        }
        addOnload(node, callback, path);
        /** @type {boolean} */
        node.async = true;
        /** @type {Object} */
        node.src = path;
        /** @type {Element} */
        targetNode = node;
        if (insertBeforeEl) {
            head.insertBefore(node, insertBeforeEl);
        } else {
            head.appendChild(node);
        }
        /** @type {null} */
        targetNode = null;
    }
    /**
     * @param {Element} node
     * @param {Function} callback
     * @return {undefined}
     */
    function addOnload(node, callback) {
        /**
         * @param {boolean} error
         * @return {undefined}
         */
        function onload(error) {
            /** @type {null} */
            node.onload = node.onerror = node.onreadystatechange = null;
            if (!utils.debug) {
                head.removeChild(node);
            }
            /** @type {null} */
            node = null;
            callback(error);
        }
        /** @type {boolean} */
        var useNative = "onload" in node;
        if (useNative) {
            /** @type {function (boolean): undefined} */
            node.onload = onload;
            /**
             * @return {undefined}
             */
            node.onerror = function () {
                onload(true);
            };
        } else {
            /**
             * @return {undefined}
             */
            node.onreadystatechange = function () {
                if (/loaded|complete/.test(node.readyState)) {
                    onload();
                }
            };
        }
    }
    /**
     * @param {string} type
     * @return {?}
     */
    function isType(type) {
        return function (next_scope) {
            return Object.prototype.toString.call(next_scope) === "[object " + type + "]";
        };
    }
    /**
     * @param {Array} values
     * @param {?} recursive
     * @param {boolean} dataAndEvents
     * @param {string} name
     * @param {boolean} deepDataAndEvents
     * @return {undefined}
     */
    function expand(values, recursive, dataAndEvents, name, deepDataAndEvents) {
        /** @type {number} */
        var i = 0;
        var valuesLen = values.length;
        /** @type {Array} */
        var k = [];
        /** @type {Array} */
        var obj = [];
        var id;
        var numbers;
        var code;
        var fn;
        var _i;
        var _len;
        var uncaughtException;
        var ri;
        var key;
        var v;
        for (; i < valuesLen; i++) {
            for (id in cache) {
                /** @type {number} */
                var index = id.lastIndexOf(".");
                /** @type {string} */
                key = id.substring(0, index);
                /** @type {string} */
                var predicate = id.substring(index + 1, id.length);
                if (key === values[i]) {
                    obj.push(predicate);
                    k.push(cache[id]);
                }
            }
        }
        if (numbers = recursive.toString().replace(/\/\/.*\r\n/g, "\r\n").replace(/"function[\s\S]*?\}"/g, function (headBuffer) {
          return headBuffer.substr(1, headBuffer.length - 2);
        }), code = numbers.slice(numbers.indexOf("{") + 1, numbers.lastIndexOf("}")) + (dataAndEvents ? "return " + name + ";" : ""), code = code.replace(/\/\/[\s\S]*?\\r\\n/g, "").replace(/(\/\*[\s\S]*\*\/)/g, "").replace(/\\r\\n/g, "").replace(/\\n/g, "").replace(/\\t/g, "").replace(/\\/g, ""), code = js_beautify(code, {
            indent_size: "4",
            indent_char: " ",
            max_preserve_newlines: "5",
            preserve_newlines: true,
            keep_array_indentation: false,
            break_chained_methods: false,
            indent_scripts: "normal",
            brace_style: "collapse",
            space_before_conditional: true,
            unescape_strings: false,
            wrap_line_length: "0",
            space_after_anon_function: true
        }), fn = new Function(obj, code), deepDataAndEvents) {
            var results = run(fn);
            var e = results.length;
            var prop = values[0] + "." + name;
            /** @type {Array} */
            var attrList = [];
            /** @type {number} */
            _i = 0;
            _len = values.length;
            for (; _i < _len; _i++) {
                /** @type {number} */
                ri = 0;
                for (; ri < e; ri++) {
                    if (next(t, values[_i] + "." + results[ri])) {
                        attrList.push(values[_i] + "." + results[ri]);
                    }
                }
            }
            list.push({
                id: prop,
                deps: attrList
            });
            /** @type {number} */
            uncaughtException = 0;
            /** @type {number} */
            ri = 0;
            for (; ri < e; ri++) {
                key = names[results[ri]];
                request(result[key], function () {
                    var elems;
                    var f;
                    var v;
                    if (uncaughtException++, uncaughtException == e) {
                        /** @type {Array} */
                        obj = [];
                        /** @type {Array} */
                        k = [];
                        /** @type {number} */
                        i = 0;
                        for (; i < attrList.length; i++) {
                            k.push(cache[attrList[i]]);
                            elems = attrList[i].split(".");
                            obj.push(elems[elems.length - 1]);
                        }
                        data.push({
                            a: obj,
                            b: code,
                            c: prop,
                            d: attrList
                        });
                        /** @type {Function} */
                        f = new Function(obj, code);
                        v = f.apply(null, k);
                        cache[prop] = v;
                    }
                    init();
                });
            }
        } else {
            list.push({
                id: values[0] + "." + name,
                deps: []
            });
            data.push({
                a: [],
                b: code,
                c: values[0] + "." + name,
                d: []
            });
            v = fn.apply(null, k);
            if (dataAndEvents) {
                cache[values[0] + "." + name] = v;
            }
        }
        if (val) {
            setTime(code + "\n//@ sourceURL=" + (name || "anonymous") + ".js");
        }
    }
    /**
     * @return {?}
     */
    function init() {
        /**
         * @param {?} event
         * @return {undefined}
         */
        function fn(event) {
            if (event) {
                if (event.d) {
                    map(event.d, function (key) {
                        if (next(results, key)) {
                            promote(results, key);
                        }
                        results.push(key);
                        var error;
                        map(data, function (e) {
                            if (e.c == key) {
                                error = e;
                            }
                        });
                        fn(error);
                    });
                }
            }
        }
        var i;
        var obj;
        var results;
        var r;
        var element;
        var value;
        /** @type {number} */
        var j = 0;
        for (; j < list.length; j++) {
            /** @type {number} */
            i = 0;
            for (; i < list[j].deps.length; i++) {
                if (!cache.hasOwnProperty(list[j].deps[i])) {
                    return false;
                }
            }
        }
        map(data, function (o) {
            if (o.c == a + ".Main") {
                obj = o;
            }
        });
        /** @type {Array} */
        results = [];
        results.push(a + ".Main");
        fn(obj);
        /** @type {Array} */
        r = [];
        map(results, function (element) {
            map(data, function (o) {
                var args;
                var callback;
                var value;
                if (o.c == element) {
                    r.push(o);
                    /** @type {Array} */
                    args = [];
                    /** @type {Function} */
                    callback = new Function(o.a, o.b);
                    /** @type {number} */
                    j = 0;
                    for (; j < o.d.length; j++) {
                        args.push(cache[o.d[j]]);
                    }
                    value = callback.apply(null, args);
                    cache[o.c] = value;
                }
            });
        });
        if (d) {
            /** @type {Element} */
            element = doc.createElement("textarea");
            element.setAttribute("rows", "25");
            element.setAttribute("cols", "45");
            /** @type {string} */
            element.style.position = "absolute";
            /** @type {string} */
            element.style.left = "0px";
            /** @type {string} */
            element.style.top = "0px";
            /** @type {number} */
            element.style.zIndex = 1E4;
            doc.body.appendChild(element);
            element.focus();
            /** @type {string} */
            value = '(function (n) { var f = !1, l = /xyz/.test(function () { xyz }) ? /\b_super\b/ : /.*/, o = function () { }, t, r, s, u, c, e; for (o.extend = function (n) { function i() { !f && this.init && this.init.apply(this, arguments) } var o = this.prototype, e, t, r, u; f = !0, e = new this, f = !1; for (t in n) t != "statics" && (e[t] = typeof n[t] == "function" && typeof o[t] == "function" && l.test(n[t]) ? function (n, t) { return function () { var r = this._super, i; return this._super = o[n], i = t.apply(this, arguments), this._super = r, i } }(t, n[t]) : n[t]); for (r in this) this.hasOwnProperty(r) && r != "extend" && (i[r] = this[r]); if (n.statics) for (u in n.statics) n.statics.hasOwnProperty(u) && (i[u] = n.statics[u]); return i.prototype = e, i.prototype.constructor = i, i.extend = arguments.callee, i }, n.__class = o, t = {}, t.modules = {}, t.all =' +
            exports.stringify(r).replace(/\s+/g, " ") + ', r = 0, s = t.all.length; r < s; r++) { var i = t.all[r], h = [], a = new Function(i.a, i.b); for (u = 0, c = i.d.length; u < c; u++) h.push(t.modules[i.d[u]]); e = a.apply(null, h),t.modules[i.c] = e } new t.modules["' + a + '.Main"] })(this)';
            /** @type {string} */
            element.value = value;
        }
        setTimeout(function () {
            new cache[a + ".Main"];
        }, 0);
    }
    /**
     * @param {Array} parent
     * @param {?} key
     * @return {undefined}
     */
    function promote(parent, key) {
        /** @type {number} */
        var index = parent.length - 1;
        for (; index > -1; index--) {
            if (parent[index] == key) {
                parent.splice(index, 1);
                break;
            }
        }
    }
    /**
     * @param {(Array|NodeList)} arr
     * @param {Function} callback
     * @return {undefined}
     */
    function map(arr, callback) {
        /** @type {number} */
        var i = arr.length - 1;
        for (; i > -1; i--) {
            callback(arr[i]);
        }
    }
    /**
     * @param {boolean} obj
     * @return {?}
     */
    function has(obj) {
        /**
         * @return {*}
         */
        Object.prototype.toJSON = function () {
            var json = {};
            var key;
            for (key in this) {
                if (this.hasOwnProperty(key)) {
                    json[key] = typeof this[key] == "function" ? this[key].toString() : this[key];
                }
            }
            return json;
        };
        /** @type {string} */
        var keys = exports.stringify(obj);
        return delete Object.prototype.toJSON, keys;
    }
    /**
     * @param {string} item
     * @param {string} value
     * @return {?}
     */
    function lastIndexOf(item, value) {
        var text;
        var fromIndex;
        if (item.lastIndexOf) {
            return item.lastIndexOf(value);
        }
        text = value.length;
        /** @type {number} */
        fromIndex = item.length - 1 - text;
        for (; fromIndex > -1; fromIndex--) {
            if (value === item.substr(fromIndex, text)) {
                return fromIndex;
            }
        }
        return -1;
    }
    /**
     * @param {Array} val
     * @param {?} elem
     * @return {?}
     */
    function next(val, elem) {
        /** @type {number} */
        var idx = 0;
        var len = val.length;
        for (; idx < len; idx++) {
            if (val[idx] == elem) {
                return true;
            }
        }
        return false;
    }
    /**
     * @param {?} fn
     * @return {?}
     */
    function run(fn) {
        var markdown = floor("(" + fn.toString() + ")").toString();
        /** @type {Array} */
        var pos = [];
        var indents;
        return markdown.replace(/new,name,\w*,?/gm, function (pair) {
            var cur = pair.split(",")[2];
            if (!next(pos, cur)) {
                pos.push(cur);
            }
        }), indents = [], markdown.replace(/var,\w*,?/gm, function (pair) {
            indents.push(pair.split(",")[1]);
        }), markdown.replace(/call,dot,name,\w*,?/gm, function (pair) {
            var cur = pair.split(",")[3];
            if (!next(indents, cur)) {
                if (!(cur in window)) {
                    if (!(cur == "this")) {
                        pos.push(cur);
                    }
                }
            }
        }), pos;
    }
    /**
     * @param {string} fmt
     * @return {undefined}
     */
    function setTime(fmt) {
        try {
            console.log(fmt);
        } catch (t) {
        }
    }
    /**
     * @return {?}
     */
    function process() {
        var matches;
        /** @type {NodeList} */
        var context = doc.getElementsByTagName("script");
        var match;
        var src;
        /** @type {number} */
        var i = 0;
        /** @type {number} */
        var j = context.length;
        for (; i < j; i++) {
            if (match = context[i].getAttribute("src").toUpperCase(), lastIndexOf(match, "KMD") != -1) {
                src = match.split("/");
                src.pop();
                matches = src.length ? src.join("/") + "/" : "./";
                break;
            }
        }
        return matches;
    }
    /**
     * @param {(number|string)} js_source_text
     * @param {Object} options
     * @return {?}
     */
    function js_beautify(js_source_text, options) {
        /**
         * @return {undefined}
         */
        function trim_output() {
            for (; output.length && (output[output.length - 1] === " " || output[output.length - 1] === indent_string) ;) {
                output.pop();
            }
        }
        /**
         * @param {boolean} deep
         * @return {undefined}
         */
        function print_newline(deep) {
            if ((flags.eat_next_space = false, !ontype || !is_array(flags.mode)) && (deep = typeof deep == "undefined" ? true : deep, flags.if_line = false, trim_output(), output.length)) {
                if (!(output[output.length - 1] === "\n" && deep)) {
                    /** @type {boolean} */
                    just_added_newline = true;
                    output.push("\n");
                }
                /** @type {number} */
                var i = 0;
                for (; i < flags.indentation_level; i += 1) {
                    output.push(indent_string);
                }
            }
        }
        /**
         * @return {undefined}
         */
        function print_single_space() {
            if (flags.eat_next_space) {
                /** @type {boolean} */
                flags.eat_next_space = false;
                return;
            }
            /** @type {string} */
            var last_output = " ";
            if (output.length) {
                last_output = output[output.length - 1];
            }
            if (last_output !== " ") {
                if (last_output !== "\n") {
                    if (last_output !== indent_string) {
                        output.push(" ");
                    }
                }
            }
        }
        /**
         * @return {undefined}
         */
        function print_token() {
            /** @type {boolean} */
            just_added_newline = false;
            /** @type {boolean} */
            flags.eat_next_space = false;
            output.push(token_text);
        }
        /**
         * @return {undefined}
         */
        function indent() {
            flags.indentation_level += 1;
        }
        /**
         * @return {undefined}
         */
        function remove_indent() {
            if (output.length) {
                if (output[output.length - 1] === indent_string) {
                    output.pop();
                }
            }
        }
        /**
         * @param {string} mode
         * @return {undefined}
         */
        function set_mode(mode) {
            if (flags) {
                eventPath.push(flags);
            }
            flags = {
                mode: mode,
                var_line: false,
                var_line_tainted: false,
                var_line_reindented: false,
                in_html_comment: false,
                if_line: false,
                in_case: false,
                eat_next_space: false,
                indentation_baseline: -1,
                indentation_level: flags ? flags.indentation_level + (flags.var_line && flags.var_line_reindented ? 1 : 0) : opt_indent_level
            };
        }
        /**
         * @param {string} mode
         * @return {?}
         */
        function is_expression(mode) {
            return mode === "[EXPRESSION]" || (mode === "[INDENTED-EXPRESSION]" || mode === "(EXPRESSION)");
        }
        /**
         * @param {string} mode
         * @return {?}
         */
        function is_array(mode) {
            return mode === "[EXPRESSION]" || mode === "[INDENTED-EXPRESSION]";
        }
        /**
         * @return {undefined}
         */
        function restore_mode() {
            /** @type {boolean} */
            do_block_just_closed = flags.mode === "DO_BLOCK";
            if (eventPath.length > 0) {
                flags = eventPath.pop();
            }
        }
        /**
         * @param {?} what
         * @param {?} arr
         * @return {?}
         */
        function in_array(what, arr) {
            /** @type {number} */
            var i = 0;
            for (; i < arr.length; i += 1) {
                if (arr[i] === what) {
                    return true;
                }
            }
            return false;
        }
        /**
         * @return {?}
         */
        function is_ternary_op() {
            /** @type {number} */
            var n = 0;
            /** @type {number} */
            var i = 0;
            /** @type {number} */
            var mainCollection = output.length - 1;
            for (; mainCollection >= 0; mainCollection--) {
                switch (output[mainCollection]) {
                    case ":":
                        if (n === 0) {
                            i++;
                        }
                        break;
                    case "?":
                        if (n === 0) {
                            if (i === 0) {
                                return true;
                            }
                            i--;
                        }
                        break;
                    case "{":
                        if (n === 0) {
                            return false;
                        }
                        n--;
                        break;
                    case "(":
                        ;
                    case "[":
                        n--;
                        break;
                    case ")":
                        ;
                    case "]":
                        ;
                    case "}":
                        n++;
                }
            }
        }
        /**
         * @return {?}
         */
        function get_next_token() {
            var c;
            var handle;
            var whitespace_count;
            var i;
            var sign;
            var t;
            var comment;
            var TK_INLINE_COMMENT;
            var callback;
            var tagName;
            if (n_newlines = 0, parser_pos >= input_length) {
                return ["", "TK_EOF"];
            }
            if (wanted_newline = false, c = input.charAt(parser_pos), parser_pos += 1, handle = ontype && is_array(flags.mode), handle) {
                /** @type {number} */
                whitespace_count = 0;
                for (; in_array(c, whitespace) ;) {
                    if (c === "\n" ? (trim_output(), output.push("\n"), just_added_newline = true, whitespace_count = 0) : whitespace_count += c === "\t" ? 4 : 1, parser_pos >= input_length) {
                        return ["", "TK_EOF"];
                    }
                    c = input.charAt(parser_pos);
                    parser_pos += 1;
                }
                if (flags.indentation_baseline === -1 && (flags.indentation_baseline = whitespace_count), just_added_newline) {
                    /** @type {number} */
                    i = 0;
                    for (; i < flags.indentation_level + 1; i += 1) {
                        output.push(indent_string);
                    }
                    if (flags.indentation_baseline !== -1) {
                        /** @type {number} */
                        i = 0;
                        for (; i < whitespace_count - flags.indentation_baseline; i++) {
                            output.push(" ");
                        }
                    }
                }
            } else {
                for (; in_array(c, whitespace) ;) {
                    if (c === "\n" && (n_newlines += 1), parser_pos >= input_length) {
                        return ["", "TK_EOF"];
                    }
                    c = input.charAt(parser_pos);
                    parser_pos += 1;
                }
                if (opt_preserve_newlines && n_newlines > 1) {
                    /** @type {number} */
                    i = 0;
                    for (; i < n_newlines; i += 1) {
                        print_newline(i === 0);
                        /** @type {boolean} */
                        just_added_newline = true;
                    }
                }
                /** @type {boolean} */
                wanted_newline = n_newlines > 0;
            }
            if (in_array(c, wordchar)) {
                if (parser_pos < input_length) {
                    for (; in_array(input.charAt(parser_pos), wordchar) ;) {
                        if (c += input.charAt(parser_pos), parser_pos += 1, parser_pos === input_length) {
                            break;
                        }
                    }
                }
                return parser_pos !== input_length && (c.match(/^[0-9]+[Ee]$/) && (input.charAt(parser_pos) === "-" || input.charAt(parser_pos) === "+")) ? (sign = input.charAt(parser_pos), parser_pos += 1, t = get_next_token(parser_pos), c += sign + t[0], [c, "TK_WORD"]) : c === "in" ? [c, "TK_OPERATOR"] : (wanted_newline && (last_type !== "TK_OPERATOR" && (!flags.if_line && ((opt_preserve_newlines || last_text !== "var") && print_newline()))), [c, "TK_WORD"]);
            }
            if (c === "(" || c === "[") {
                return [c, "TK_START_EXPR"];
            }
            if (c === ")" || c === "]") {
                return [c, "TK_END_EXPR"];
            }
            if (c === "{") {
                return [c, "TK_START_BLOCK"];
            }
            if (c === "}") {
                return [c, "TK_END_BLOCK"];
            }
            if (c === ";") {
                return [c, "TK_SEMICOLON"];
            }
            if (c === "/") {
                if (comment = "", TK_INLINE_COMMENT = true, input.charAt(parser_pos) === "*") {
                    if (parser_pos += 1, parser_pos < input_length) {
                        for (; !(input.charAt(parser_pos) === "*" && (input.charAt(parser_pos + 1) && input.charAt(parser_pos + 1) === "/")) && parser_pos < input_length;) {
                            if (c = input.charAt(parser_pos), comment += c, (c === "\r" || c === "\n") && (TK_INLINE_COMMENT = false), parser_pos += 1, parser_pos >= input_length) {
                                break;
                            }
                        }
                    }
                    return parser_pos += 2, TK_INLINE_COMMENT ? ["/*" + comment + "*/", "TK_INLINE_COMMENT"] : ["/*" + comment + "*/", "TK_BLOCK_COMMENT"];
                }
                if (input.charAt(parser_pos) === "/") {
                    comment = c;
                    for (; input.charAt(parser_pos) !== "\r" && input.charAt(parser_pos) !== "\n";) {
                        if (comment += input.charAt(parser_pos), parser_pos += 1, parser_pos >= input_length) {
                            break;
                        }
                    }
                    return parser_pos += 1, wanted_newline && print_newline(), [comment, "TK_COMMENT"];
                }
            }
            if (c === "'" || (c === '"' || c === "/" && (last_type === "TK_WORD" && in_array(last_text, ["return", "do"]) || (last_type === "TK_START_EXPR" || (last_type === "TK_START_BLOCK" || (last_type === "TK_END_BLOCK" || (last_type === "TK_OPERATOR" || (last_type === "TK_EQUALS" || (last_type === "TK_EOF" || last_type === "TK_SEMICOLON"))))))))) {
                var sep = c;
                /** @type {boolean} */
                var events = false;
                var resulting_string = c;
                if (parser_pos < input_length) {
                    if (sep === "/") {
                        /** @type {boolean} */
                        callback = false;
                        for (; events || (callback || input.charAt(parser_pos) !== sep) ;) {
                            if (resulting_string += input.charAt(parser_pos), events ? events = false : (events = input.charAt(parser_pos) === "\\", input.charAt(parser_pos) === "[" ? callback = true : input.charAt(parser_pos) === "]" && (callback = false)), parser_pos += 1, parser_pos >= input_length) {
                                return [resulting_string, "TK_STRING"];
                            }
                        }
                    } else {
                        for (; events || input.charAt(parser_pos) !== sep;) {
                            if (resulting_string += input.charAt(parser_pos), events = events ? false : input.charAt(parser_pos) === "\\", parser_pos += 1, parser_pos >= input_length) {
                                return [resulting_string, "TK_STRING"];
                            }
                        }
                    }
                }
                if (parser_pos += 1, resulting_string += sep, sep === "/") {
                    for (; parser_pos < input_length && in_array(input.charAt(parser_pos), wordchar) ;) {
                        resulting_string += input.charAt(parser_pos);
                        parser_pos += 1;
                    }
                }
                return [resulting_string, "TK_STRING"];
            }
            if (c === "#" && (tagName = "#", parser_pos < input_length && in_array(input.charAt(parser_pos), digits))) {
                do {
                    c = input.charAt(parser_pos);
                    tagName += c;
                    parser_pos += 1;
                } while (parser_pos < input_length && (c !== "#" && c !== "="));
                return c === "#" || (input.charAt(parser_pos) == "[" && input.charAt(parser_pos + 1) === "]" ? (tagName += "[]", parser_pos += 2) : input.charAt(parser_pos) == "{" && (input.charAt(parser_pos + 1) === "}" && (tagName += "{}", parser_pos += 2))), [tagName, "TK_WORD"];
            }
            if (c === "<" && input.substring(parser_pos - 1, parser_pos + 3) === "\x3c!--") {
                return parser_pos += 3, flags.in_html_comment = true, ["\x3c!--", "TK_COMMENT"];
            }
            if (c === "-" && (flags.in_html_comment && input.substring(parser_pos - 1, parser_pos + 2) === "--\x3e")) {
                return flags.in_html_comment = false, parser_pos += 2, wanted_newline && print_newline(), ["--\x3e", "TK_COMMENT"];
            }
            if (in_array(c, punct)) {
                for (; parser_pos < input_length && in_array(c + input.charAt(parser_pos), punct) ;) {
                    if (c += input.charAt(parser_pos), parser_pos += 1, parser_pos >= input_length) {
                        break;
                    }
                }
                return c === "=" ? [c, "TK_EQUALS"] : [c, "TK_OPERATOR"];
            }
            return [c, "TK_UNKNOWN"];
        }
        var input;
        var output;
        var token_text;
        var last_type;
        var last_text;
        var last_last_text;
        var last_word;
        var flags;
        var eventPath;
        var indent_string;
        var whitespace;
        var wordchar;
        var punct;
        var parser_pos;
        var line_starters;
        var digits;
        var prefix;
        var token_type;
        var do_block_just_closed;
        var wanted_newline;
        var just_added_newline;
        var n_newlines;
        var input_length;
        var t;
        var j;
        var x;
        var lines;
        var i;
        options = options ? options : {};
        var wt = options.braces_on_own_line ? options.braces_on_own_line : false;
        var ni = options.indent_size ? options.indent_size : 4;
        var opt_indent_char = options.indent_char ? options.indent_char : " ";
        var opt_preserve_newlines = typeof options.preserve_newlines == "undefined" ? true : options.preserve_newlines;
        var opt_indent_level = options.indent_level ? options.indent_level : 0;
        var ei = options.space_after_anon_function === "undefined" ? false : options.space_after_anon_function;
        var ontype = typeof options.keep_array_indentation == "undefined" ? true : options.keep_array_indentation;
        /** @type {boolean} */
        just_added_newline = false;
        input_length = js_source_text.length;
        /** @type {string} */
        indent_string = "";
        for (; ni > 0;) {
            indent_string += opt_indent_char;
            ni -= 1;
        }
        /** @type {(number|string)} */
        input = js_source_text;
        /** @type {string} */
        last_word = "";
        /** @type {string} */
        last_type = "TK_START_EXPR";
        /** @type {string} */
        last_text = "";
        /** @type {string} */
        last_last_text = "";
        /** @type {Array} */
        output = [];
        /** @type {boolean} */
        do_block_just_closed = false;
        /** @type {Array.<string>} */
        whitespace = "\n\r\t ".split("");
        /** @type {Array.<string>} */
        wordchar = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_$".split("");
        /** @type {Array.<string>} */
        digits = "0123456789".split("");
        /** @type {Array.<string>} */
        punct = "+ - * / % & ++ -- = += -= *= /= %= == === != !== > < >= <= >> << >>> >>>= >>= <<= && &= | || ! !! , : ? ^ ^= |= ::".split(" ");
        /** @type {Array.<string>} */
        line_starters = "continue,try,throw,return,var,if,switch,case,default,for,while,break,function".split(",");
        /** @type {Array} */
        eventPath = [];
        set_mode("BLOCK");
        /** @type {number} */
        parser_pos = 0;
        for (; ;) {
            if (t = get_next_token(parser_pos), token_text = t[0], token_type = t[1], token_type === "TK_EOF") {
                break;
            }
            switch (token_type) {
                case "TK_START_EXPR":
                    if (token_text === "[") {
                        if (last_type === "TK_WORD" || last_text === ")") {
                            if (in_array(last_text, line_starters)) {
                                print_single_space();
                            }
                            set_mode("(EXPRESSION)");
                            print_token();
                            break;
                        }
                        if (flags.mode === "[EXPRESSION]" || flags.mode === "[INDENTED-EXPRESSION]") {
                            if (last_last_text === "]" && last_text === ",") {
                                if (flags.mode === "[EXPRESSION]") {
                                    /** @type {string} */
                                    flags.mode = "[INDENTED-EXPRESSION]";
                                    if (!ontype) {
                                        indent();
                                    }
                                }
                                set_mode("[EXPRESSION]");
                                if (!ontype) {
                                    print_newline();
                                }
                            } else {
                                if (last_text === "[") {
                                    if (flags.mode === "[EXPRESSION]") {
                                        /** @type {string} */
                                        flags.mode = "[INDENTED-EXPRESSION]";
                                        if (!ontype) {
                                            indent();
                                        }
                                    }
                                    set_mode("[EXPRESSION]");
                                    if (!ontype) {
                                        print_newline();
                                    }
                                } else {
                                    set_mode("[EXPRESSION]");
                                }
                            }
                        } else {
                            set_mode("[EXPRESSION]");
                        }
                    } else {
                        set_mode("(EXPRESSION)");
                    }
                    if (last_text === ";" || last_type === "TK_START_BLOCK") {
                        print_newline();
                    } else {
                        if (!(last_type === "TK_END_EXPR")) {
                            if (!(last_type === "TK_START_EXPR")) {
                                if (!(last_type === "TK_END_BLOCK")) {
                                    if (last_type !== "TK_WORD" && last_type !== "TK_OPERATOR") {
                                        print_single_space();
                                    } else {
                                        if (last_word === "function") {
                                            if (ei) {
                                                print_single_space();
                                            }
                                        } else {
                                            if (in_array(last_text, line_starters) || last_text === "catch") {
                                                print_single_space();
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    print_token();
                    break;
                case "TK_END_EXPR":
                    if (token_text === "]") {
                        if (ontype) {
                            if (last_text === "}") {
                                remove_indent();
                                print_token();
                                restore_mode();
                                break;
                            }
                        } else {
                            if (flags.mode === "[INDENTED-EXPRESSION]" && last_text === "]") {
                                restore_mode();
                                print_newline();
                                print_token();
                                break;
                            }
                        }
                    }
                    restore_mode();
                    print_token();
                    break;
                case "TK_START_BLOCK":
                    if (last_word === "do") {
                        set_mode("DO_BLOCK");
                    } else {
                        set_mode("BLOCK");
                    }
                    if (wt) {
                        if (last_type !== "TK_OPERATOR") {
                            print_newline(true);
                        }
                        print_token();
                        indent();
                    } else {
                        if (last_type !== "TK_OPERATOR") {
                            if (last_type !== "TK_START_EXPR") {
                                if (last_type === "TK_START_BLOCK") {
                                    print_newline();
                                } else {
                                    print_single_space();
                                }
                            }
                        }
                        indent();
                        print_token();
                    }
                    break;
                case "TK_END_BLOCK":
                    restore_mode();
                    if (wt) {
                        print_newline();
                        if (flags.var_line_reindented) {
                            output.push(indent_string);
                        }
                        print_token();
                    } else {
                        if (last_type === "TK_START_BLOCK") {
                            if (just_added_newline) {
                                remove_indent();
                            } else {
                                trim_output();
                            }
                        } else {
                            print_newline();
                            if (flags.var_line_reindented) {
                                output.push(indent_string);
                            }
                        }
                        print_token();
                    }
                    break;
                case "TK_WORD":
                    if (do_block_just_closed) {
                        print_single_space();
                        print_token();
                        print_single_space();
                        /** @type {boolean} */
                        do_block_just_closed = false;
                        break;
                    }
                    if (token_text === "function" && ((just_added_newline || last_text == ";") && last_text !== "{")) {
                        n_newlines = just_added_newline ? n_newlines : 0;
                        /** @type {number} */
                        i = 0;
                        for (; i < 2 - n_newlines; i++) {
                            print_newline(false);
                        }
                    }
                    if (token_text === "case" || token_text === "default") {
                        if (last_text === ":") {
                            remove_indent();
                        } else {
                            flags.indentation_level--;
                            print_newline();
                            flags.indentation_level++;
                        }
                        print_token();
                        /** @type {boolean} */
                        flags.in_case = true;
                        break;
                    }
                    /** @type {string} */
                    prefix = "NONE";
                    if (last_type === "TK_END_BLOCK") {
                        if (in_array(token_text.toLowerCase(), ["else", "catch", "finally"])) {
                            if (wt) {
                                /** @type {string} */
                                prefix = "NEWLINE";
                            } else {
                                /** @type {string} */
                                prefix = "SPACE";
                                print_single_space();
                            }
                        } else {
                            /** @type {string} */
                            prefix = "NEWLINE";
                        }
                    } else {
                        if (last_type === "TK_SEMICOLON" && (flags.mode === "BLOCK" || flags.mode === "DO_BLOCK")) {
                            /** @type {string} */
                            prefix = "NEWLINE";
                        } else {
                            if (last_type === "TK_SEMICOLON" && is_expression(flags.mode)) {
                                /** @type {string} */
                                prefix = "SPACE";
                            } else {
                                if (last_type === "TK_STRING") {
                                    /** @type {string} */
                                    prefix = "NEWLINE";
                                } else {
                                    if (last_type === "TK_WORD") {
                                        /** @type {string} */
                                        prefix = "SPACE";
                                    } else {
                                        if (last_type === "TK_START_BLOCK") {
                                            /** @type {string} */
                                            prefix = "NEWLINE";
                                        } else {
                                            if (last_type === "TK_END_EXPR") {
                                                print_single_space();
                                                /** @type {string} */
                                                prefix = "NEWLINE";
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    if (last_type !== "TK_END_BLOCK" && in_array(token_text.toLowerCase(), ["else", "catch", "finally"])) {
                        print_newline();
                    } else {
                        if (in_array(token_text, line_starters) || prefix === "NEWLINE") {
                            if (last_text === "else") {
                                print_single_space();
                            } else {
                                if (!((last_type === "TK_START_EXPR" || (last_text === "=" || last_text === ",")) && token_text === "function")) {
                                    if (last_text === "return" || last_text === "throw") {
                                        print_single_space();
                                    } else {
                                        if (last_type !== "TK_END_EXPR") {
                                            if (last_type !== "TK_START_EXPR" || token_text !== "var") {
                                                if (last_text !== ":") {
                                                    if (token_text === "if" && (last_word === "else" && last_text !== "{")) {
                                                        print_single_space();
                                                    } else {
                                                        print_newline();
                                                    }
                                                }
                                            }
                                        } else {
                                            if (in_array(token_text, line_starters)) {
                                                if (last_text !== ")") {
                                                    print_newline();
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        } else {
                            if (prefix === "SPACE") {
                                print_single_space();
                            }
                        }
                    }
                    print_token();
                    last_word = token_text;
                    if (token_text === "var") {
                        /** @type {boolean} */
                        flags.var_line = true;
                        /** @type {boolean} */
                        flags.var_line_reindented = false;
                        /** @type {boolean} */
                        flags.var_line_tainted = false;
                    }
                    if (token_text === "if" || token_text === "else") {
                        /** @type {boolean} */
                        flags.if_line = true;
                    }
                    break;
                case "TK_SEMICOLON":
                    print_token();
                    /** @type {boolean} */
                    flags.var_line = false;
                    /** @type {boolean} */
                    flags.var_line_reindented = false;
                    break;
                case "TK_STRING":
                    if (last_type === "TK_START_BLOCK" || (last_type === "TK_END_BLOCK" || last_type === "TK_SEMICOLON")) {
                        print_newline();
                    } else {
                        if (last_type === "TK_WORD") {
                            print_single_space();
                        }
                    }
                    print_token();
                    break;
                case "TK_EQUALS":
                    if (flags.var_line) {
                        /** @type {boolean} */
                        flags.var_line_tainted = true;
                    }
                    print_single_space();
                    print_token();
                    print_single_space();
                    break;
                case "TK_OPERATOR":
                    if (j = true, x = true, flags.var_line && (token_text === "," && (is_expression(flags.mode) && (flags.var_line_tainted = false))), flags.var_line && token_text === ",") {
                        if (flags.var_line_tainted) {
                            print_token();
                            print_newline();
                            output.push(indent_string);
                            /** @type {boolean} */
                            flags.var_line_reindented = true;
                            /** @type {boolean} */
                            flags.var_line_tainted = false;
                            break;
                        } else {
                            /** @type {boolean} */
                            flags.var_line_tainted = false;
                        }
                    }
                    if (last_text === "return" || last_text === "throw") {
                        print_single_space();
                        print_token();
                        break;
                    }
                    if (token_text === ":" && flags.in_case) {
                        print_token();
                        print_newline();
                        /** @type {boolean} */
                        flags.in_case = false;
                        break;
                    }
                    if (token_text === "::") {
                        print_token();
                        break;
                    }
                    if (token_text === ",") {
                        if (flags.var_line) {
                            if (flags.var_line_tainted) {
                                print_token();
                                print_newline();
                                /** @type {boolean} */
                                flags.var_line_tainted = false;
                            } else {
                                print_token();
                                print_single_space();
                            }
                        } else {
                            if (last_type === "TK_END_BLOCK" && flags.mode !== "(EXPRESSION)") {
                                print_token();
                                print_newline();
                            } else {
                                if (flags.mode === "BLOCK") {
                                    print_token();
                                    print_newline();
                                } else {
                                    print_token();
                                    print_single_space();
                                }
                            }
                        }
                        break;
                    } else {
                        if (in_array(token_text, ["--", "++", "!"]) || in_array(token_text, ["-", "+"]) && (in_array(last_type, ["TK_START_BLOCK", "TK_START_EXPR", "TK_EQUALS", "TK_OPERATOR"]) || in_array(last_text, line_starters))) {
                            /** @type {boolean} */
                            j = false;
                            /** @type {boolean} */
                            x = false;
                            if (last_text === ";") {
                                if (is_expression(flags.mode)) {
                                    /** @type {boolean} */
                                    j = true;
                                }
                            }
                            if (last_type === "TK_WORD") {
                                if (in_array(last_text, line_starters)) {
                                    /** @type {boolean} */
                                    j = true;
                                }
                            }
                            if (flags.mode === "BLOCK") {
                                if (last_text === "{" || last_text === ";") {
                                    print_newline();
                                }
                            }
                        } else {
                            if (token_text === ".") {
                                /** @type {boolean} */
                                j = false;
                            } else {
                                if (token_text === ":") {
                                    if (!is_ternary_op()) {
                                        /** @type {boolean} */
                                        j = false;
                                    }
                                }
                            }
                        }
                    }
                    if (j) {
                        print_single_space();
                    }
                    print_token();
                    if (x) {
                        print_single_space();
                    }
                    token_text === "!";
                    break;
                case "TK_BLOCK_COMMENT":
                    if (lines = token_text.split(/\x0a|\x0d\x0a/), /^\/\*\*/.test(token_text)) {
                        print_newline();
                        output.push(lines[0]);
                        /** @type {number} */
                        i = 1;
                        for (; i < lines.length; i++) {
                            print_newline();
                            output.push(" ");
                            output.push(lines[i].replace(/^\s\s*|\s\s*$/, ""));
                        }
                    } else {
                        if (lines.length > 1) {
                            print_newline();
                            trim_output();
                        } else {
                            print_single_space();
                        }
                        /** @type {number} */
                        i = 0;
                        for (; i < lines.length; i++) {
                            output.push(lines[i]);
                            output.push("\n");
                        }
                    }
                    print_newline();
                    break;
                case "TK_INLINE_COMMENT":
                    print_single_space();
                    print_token();
                    if (is_expression(flags.mode)) {
                        print_single_space();
                    } else {
                        print_newline();
                    }
                    break;
                case "TK_COMMENT":
                    if (wanted_newline) {
                        print_newline();
                    } else {
                        print_single_space();
                    }
                    print_token();
                    print_newline();
                    break;
                case "TK_UNKNOWN":
                    print_token();
            }
            last_last_text = last_text;
            last_type = token_type;
            last_text = token_text;
        }
        return output.join("").replace(/[\n ]+$/, "");
    }
    var define;
    var main = {};
    var floor = function () {
        /**
         * @param {string} ch
         * @return {?}
         */
        function is_letter(ch) {
            return UNICODE.letter.test(ch);
        }
        /**
         * @param {string} ch
         * @return {?}
         */
        function is_digit(ch) {
            return ch = ch.charCodeAt(0), ch >= 48 && ch <= 57;
        }
        /**
         * @param {string} ch
         * @return {?}
         */
        function is_unicode_digit(ch) {
            return UNICODE.digit.test(ch);
        }
        /**
         * @param {string} ch
         * @return {?}
         */
        function is_alphanumeric_char(ch) {
            return is_digit(ch) || is_letter(ch);
        }
        /**
         * @param {string} ch
         * @return {?}
         */
        function is_unicode_combining_mark(ch) {
            return UNICODE.combining_mark.test(ch);
        }
        /**
         * @param {string} ch
         * @return {?}
         */
        function is_unicode_connector_punctuation(ch) {
            return UNICODE.connector_punctuation.test(ch);
        }
        /**
         * @param {string} ch
         * @return {?}
         */
        function is_identifier_start(ch) {
            return ch == "$" || (ch == "_" || is_letter(ch));
        }
        /**
         * @param {string} ch
         * @return {?}
         */
        function is_identifier_char(ch) {
            return is_identifier_start(ch) || (is_unicode_combining_mark(ch) || (is_unicode_digit(ch) || (is_unicode_connector_punctuation(ch) || (ch == "\u200c" || ch == "\u200d"))));
        }
        /**
         * @param {string} value
         * @return {?}
         */
        function parseDate(value) {
            return rchecked.test(value) ? parseInt(value.substr(2), 16) : spaceRe.test(value) ? parseInt(value.substr(1), 8) : exclude.test(value) ? parseFloat(value) : void 0;
        }
        /**
         * @param {string} message
         * @param {number} line
         * @param {number} col
         * @param {number} pos
         * @return {undefined}
         */
        function JS_Parse_Error(message, line, col, pos) {
            /** @type {string} */
            this.message = message;
            this.line = line + 1;
            this.col = col + 1;
            this.pos = pos + 1;
            /** @type {string} */
            this.stack = (new Error).stack;
        }
        /**
         * @param {string} message
         * @param {string} line
         * @param {string} col
         * @param {boolean} pos
         * @return {?}
         */
        function js_error(message, line, col, pos) {
            throw new JS_Parse_Error(message, line, col, pos);
        }
        /**
         * @param {Element} token
         * @param {string} type
         * @param {string} val
         * @return {?}
         */
        function is_token(token, type, val) {
            return token.type == type && (val == null || token.value == val);
        }
        /**
         * @param {string} $TEXT
         * @return {?}
         */
        function tokenizer($TEXT) {
            /**
             * @return {?}
             */
            function peek() {
                return S.text.charAt(S.pos);
            }
            /**
             * @param {boolean} signal_eof
             * @param {boolean} in_string
             * @return {?}
             */
            function next(signal_eof, in_string) {
                var ch = S.text.charAt(S.pos++);
                if (signal_eof && !ch) {
                    throw radio;
                }
                return ch == "\n" ? (S.newline_before = S.newline_before || !in_string, ++S.line, S.col = 0) : ++S.col, ch;
            }
            /**
             * @param {string} what
             * @param {boolean} signal_eof
             * @return {?}
             */
            function find(what, signal_eof) {
                var pos = S.text.indexOf(what, S.pos);
                if (signal_eof && pos == -1) {
                    throw radio;
                }
                return pos;
            }
            /**
             * @return {undefined}
             */
            function start_token() {
                S.tokline = S.line;
                S.tokcol = S.col;
                S.tokpos = S.pos;
            }
            /**
             * @param {string} type
             * @param {string} value
             * @param {boolean} is_comment
             * @return {?}
             */
            function token(type, value, is_comment) {
                var ret;
                var i;
                var valsLength;
                if (S.regex_allowed = type == "operator" && !HOP(PUNC_CHARS, value) || (type == "keyword" && HOP(KEYWORDS_BEFORE_EXPRESSION, value) || type == "punc" && HOP(PUNC_BEFORE_EXPRESSION, value)), ret = {
                    type: type,
                    value: value,
                    line: S.tokline,
                    col: S.tokcol,
                    pos: S.tokpos,
                    endpos: S.pos,
                    nlb: S.newline_before
                }, !is_comment) {
                    ret.comments_before = S.comments_before;
                    /** @type {Array} */
                    S.comments_before = [];
                    /** @type {number} */
                    i = 0;
                    valsLength = ret.comments_before.length;
                    for (; i < valsLength; i++) {
                        ret.nlb = ret.nlb || ret.comments_before[i].nlb;
                    }
                }
                return S.newline_before = false, ret;
            }
            /**
             * @return {undefined}
             */
            function skip_whitespace() {
                for (; HOP(STATEMENTS_WITH_LABELS, peek()) ;) {
                    next();
                }
            }
            /**
             * @param {Function} pred
             * @return {?}
             */
            function read_while(pred) {
                /** @type {string} */
                var ret = "";
                var ch = peek();
                /** @type {number} */
                var i = 0;
                for (; ch && pred(ch, i++) ;) {
                    ret += next();
                    ch = peek();
                }
                return ret;
            }
            /**
             * @param {string} err
             * @return {undefined}
             */
            function parse_error(err) {
                js_error(err, S.tokline, S.tokcol, S.tokpos);
            }
            /**
             * @param {string} prefix
             * @return {?}
             */
            function read_num(prefix) {
                /** @type {boolean} */
                var env = false;
                /** @type {boolean} */
                var type = false;
                /** @type {boolean} */
                var hasDecimal = false;
                /** @type {boolean} */
                var has_dot = prefix == ".";
                var num = read_while(function (ch, i) {
                    return ch == "x" || ch == "X" ? hasDecimal ? false : hasDecimal = true : !hasDecimal && (ch == "E" || ch == "e") ? env ? false : env = type = true : ch == "-" ? type || i == 0 && !prefix ? true : false : ch == "+" ? type : (type = false, ch == ".") ? !has_dot && (!hasDecimal && !env) ? has_dot = true : false : is_alphanumeric_char(ch);
                });
                var ret;
                if (prefix && (num = prefix + num), ret = parseDate(num), isNaN(ret)) {
                    parse_error("Invalid syntax: " + num);
                } else {
                    return token("num", ret);
                }
            }
            /**
             * @param {boolean} in_string
             * @return {?}
             */
            function read_escaped_char(in_string) {
                var ch = next(true, in_string);
                switch (ch) {
                    case "n":
                        return "\n";
                    case "r":
                        return "\r";
                    case "t":
                        return "\t";
                    case "b":
                        return "\b";
                    case "v":
                        return "\x0B";
                    case "f":
                        return "\f";
                    case "0":
                        return "\x00";
                    case "x":
                        return String.fromCharCode(hex_bytes(2));
                    case "u":
                        return String.fromCharCode(hex_bytes(4));
                    case "\n":
                        return "";
                    default:
                        return ch;
                }
            }
            /**
             * @param {number} opt_attributes
             * @return {?}
             */
            function hex_bytes(opt_attributes) {
                /** @type {number} */
                var num = 0;
                var digit;
                for (; opt_attributes > 0; --opt_attributes) {
                    /** @type {number} */
                    digit = parseInt(next(true), 16);
                    if (isNaN(digit)) {
                        parse_error("Invalid hex-character pattern in string");
                    }
                    /** @type {number} */
                    num = num << 4 | digit;
                }
                return num;
            }
            /**
             * @return {?}
             */
            function read_string() {
                return with_eof_error("Unterminated string constant", function () {
                    var quote = next();
                    /** @type {string} */
                    var ret = "";
                    var ch;
                    var octal_len;
                    var first;
                    for (; ;) {
                        if (ch = next(true), ch == "\\") {
                            /** @type {number} */
                            octal_len = 0;
                            /** @type {null} */
                            first = null;
                            ch = read_while(function (ch) {
                                if (ch >= "0" && ch <= "7") {
                                    if (first) {
                                        if (first <= "3" && octal_len <= 2 || first >= "4" && octal_len <= 1) {
                                            return ++octal_len;
                                        }
                                    } else {
                                        return first = ch, ++octal_len;
                                    }
                                }
                                return false;
                            });
                            ch = octal_len > 0 ? String.fromCharCode(parseInt(ch, 8)) : read_escaped_char(true);
                        } else {
                            if (ch == quote) {
                                break;
                            } else {
                                if (ch == "\n") {
                                    throw radio;
                                }
                            }
                        }
                        ret += ch;
                    }
                    return token("string", ret);
                });
            }
            /**
             * @return {?}
             */
            function read_line_comment() {
                next();
                var i = find("\n");
                var ret;
                return i == -1 ? (ret = S.text.substr(S.pos), S.pos = S.text.length) : (ret = S.text.substring(S.pos, i), S.pos = i), token("comment1", ret, true);
            }
            /**
             * @return {?}
             */
            function read_multiline_comment() {
                return next(), with_eof_error("Unterminated multiline comment", function () {
                    var i = find("*/", true);
                    var text = S.text.substring(S.pos, i);
                    return S.pos = i + 2, S.line += text.split("\n").length - 1, S.newline_before = S.newline_before || text.indexOf("\n") >= 0, /^@cc_on/i.test(text) && (warn("WARNING: at line " + S.line), warn('*** Found "conditional comment": ' + text), warn("*** UglifyJS DISCARDS ALL COMMENTS.  This means your code might no longer work properly in Internet Explorer.")), token("comment2", text, true);
                });
            }
            /**
             * @return {?}
             */
            function read_name() {
                /** @type {boolean} */
                var memory = false;
                /** @type {string} */
                var name = "";
                var ch;
                /** @type {boolean} */
                var stack = false;
                var hex;
                for (; (ch = peek()) != null;) {
                    if (memory) {
                        if (ch != "u") {
                            parse_error("Expecting UnicodeEscapeSequence -- uXXXX");
                        }
                        ch = read_escaped_char();
                        if (!is_identifier_char(ch)) {
                            parse_error("Unicode char: " + ch.charCodeAt(0) + " is not valid in identifier");
                        }
                        name += ch;
                        /** @type {boolean} */
                        memory = false;
                    } else {
                        if (ch == "\\") {
                            /** @type {boolean} */
                            stack = memory = true;
                            next();
                        } else {
                            if (is_identifier_char(ch)) {
                                name += next();
                            } else {
                                break;
                            }
                        }
                    }
                }
                return HOP(REGEXP_MODIFIERS, name) && (stack && (hex = name.charCodeAt(0).toString(16).toUpperCase(), name = "\\u" + "0000".substr(hex.length) + hex + name.slice(1))), name;
            }
            /**
             * @param {string} regexp
             * @return {?}
             */
            function read_regexp(regexp) {
                return with_eof_error("Unterminated regular expression", function () {
                    /** @type {boolean} */
                    var r = false;
                    var ch;
                    /** @type {boolean} */
                    var maybeNested = false;
                    var mods;
                    for (; ch = next(true) ;) {
                        if (r) {
                            regexp += "\\" + ch;
                            /** @type {boolean} */
                            r = false;
                        } else {
                            if (ch == "[") {
                                /** @type {boolean} */
                                maybeNested = true;
                                regexp += ch;
                            } else {
                                if (ch == "]" && maybeNested) {
                                    /** @type {boolean} */
                                    maybeNested = false;
                                    regexp += ch;
                                } else {
                                    if (ch != "/" || maybeNested) {
                                        if (ch == "\\") {
                                            /** @type {boolean} */
                                            r = true;
                                        } else {
                                            regexp += ch;
                                        }
                                    } else {
                                        break;
                                    }
                                }
                            }
                        }
                    }
                    return mods = read_name(), token("regexp", [regexp, mods]);
                });
            }
            /**
             * @param {(Object|boolean|number|string)} prefix
             * @return {?}
             */
            function read_operator(prefix) {
                /**
                 * @param {?} op
                 * @return {?}
                 */
                function grow(op) {
                    if (!peek()) {
                        return op;
                    }
                    var bigger = op + peek();
                    return HOP(OPERATORS, bigger) ? (next(), grow(bigger)) : op;
                }
                return token("operator", grow(prefix || next()));
            }
            /**
             * @return {?}
             */
            function handle_slash() {
                next();
                var regex_allowed = S.regex_allowed;
                switch (peek()) {
                    case "/":
                        return S.comments_before.push(read_line_comment()), S.regex_allowed = regex_allowed, next_token();
                    case "*":
                        return S.comments_before.push(read_multiline_comment()), S.regex_allowed = regex_allowed, next_token();
                }
                return S.regex_allowed ? read_regexp("") : read_operator("/");
            }
            /**
             * @return {?}
             */
            function handle_dot() {
                return next(), is_digit(peek()) ? read_num(".") : token("punc", ".");
            }
            /**
             * @return {?}
             */
            function read_word() {
                var word = read_name();
                return HOP(REGEXP_MODIFIERS, word) ? HOP(OPERATORS, word) ? token("operator", word) : HOP(KEYWORDS_ATOM, word) ? token("atom", word) : token("keyword", word) : token("name", word);
            }
            /**
             * @param {string} eof_error
             * @param {Function} cont
             * @return {?}
             */
            function with_eof_error(eof_error, cont) {
                try {
                    return cont();
                } catch (value) {
                    if (value === radio) {
                        parse_error(eof_error);
                    } else {
                        throw value;
                    }
                }
            }
            /**
             * @param {string} force_regexp
             * @return {?}
             */
            function next_token(force_regexp) {
                if (force_regexp != null) {
                    return read_regexp(force_regexp);
                }
                skip_whitespace();
                start_token();
                var ch = peek();
                if (!ch) {
                    return token("eof");
                }
                if (is_digit(ch)) {
                    return read_num();
                }
                if (ch == '"' || ch == "'") {
                    return read_string();
                }
                if (HOP(WHITESPACE_CHARS, ch)) {
                    return token("punc", next());
                }
                if (ch == ".") {
                    return handle_dot();
                }
                if (ch == "/") {
                    return handle_slash();
                }
                if (HOP(KEYWORDS, ch)) {
                    return read_operator();
                }
                if (ch == "\\" || is_identifier_start(ch)) {
                    return read_word();
                }
                parse_error("Unexpected character '" + ch + "'");
            }
            var S = {
                text: $TEXT.replace(/\r\n?|[\n\u2028\u2029]/g, "\n").replace(/^\uFEFF/, ""),
                pos: 0,
                tokpos: 0,
                line: 0,
                tokline: 0,
                col: 0,
                tokcol: 0,
                newline_before: false,
                regex_allowed: false,
                comments_before: []
            };
            return next_token.context = function (nc) {
                return nc && (S = nc), S;
            }, next_token;
        }
        /**
         * @param {string} str
         * @param {number} start
         * @param {number} end
         * @return {undefined}
         */
        function NodeWithToken(str, start, end) {
            /** @type {string} */
            this.name = str;
            /** @type {number} */
            this.start = start;
            /** @type {number} */
            this.end = end;
        }
        /**
         * @param {string} $TEXT
         * @param {Object} exigent_mode
         * @param {Object} execResult
         * @return {?}
         */
        function parse($TEXT, exigent_mode, execResult) {
            /**
             * @param {string} type
             * @param {string} value
             * @return {?}
             */
            function is(type, value) {
                return is_token(S.token, type, value);
            }
            /**
             * @return {?}
             */
            function peek() {
                return S.peeked || (S.peeked = S.input());
            }
            /**
             * @return {?}
             */
            function next() {
                return S.prev = S.token, S.peeked ? (S.token = S.peeked, S.peeked = null) : S.token = S.input(), S.in_directives = S.in_directives && (S.token.type == "string" || is("punc", ";")), S.token;
            }
            /**
             * @return {?}
             */
            function prev() {
                return S.prev;
            }
            /**
             * @param {string} msg
             * @param {string} line
             * @param {number} col
             * @param {Array} pos
             * @return {undefined}
             */
            function croak(msg, line, col, pos) {
                var ctx = S.input.context();
                js_error(msg, line != null ? line : ctx.tokline, col != null ? col : ctx.tokcol, pos != null ? pos : ctx.tokpos);
            }
            /**
             * @param {Object} token
             * @param {string} msg
             * @return {undefined}
             */
            function token_error(token, msg) {
                croak(msg, token.line, token.col);
            }
            /**
             * @param {Object} token
             * @return {undefined}
             */
            function unexpected(token) {
                if (token == null) {
                    token = S.token;
                }
                token_error(token, "Unexpected token: " + token.type + " (" + token.value + ")");
            }
            /**
             * @param {string} type
             * @param {string} val
             * @return {?}
             */
            function expect_token(type, val) {
                if (is(type, val)) {
                    return next();
                }
                token_error(S.token, "Unexpected token " + S.token.type + ", expected " + type);
            }
            /**
             * @param {string} punc
             * @return {?}
             */
            function expect(punc) {
                return expect_token("punc", punc);
            }
            /**
             * @return {?}
             */
            function can_insert_semicolon() {
                return !exigent_mode && (S.token.nlb || (is("eof") || is("punc", "}")));
            }
            /**
             * @return {undefined}
             */
            function semicolon() {
                if (is("punc", ";")) {
                    next();
                } else {
                    if (!can_insert_semicolon()) {
                        unexpected();
                    }
                }
            }
            /**
             * @return {?}
             */
            function as() {
                return slice(arguments);
            }
            /**
             * @return {?}
             */
            function parenthesised() {
                expect("(");
                var obj = expression();
                return expect(")"), obj;
            }
            /**
             * @param {Object} str
             * @param {boolean} start
             * @param {boolean} end
             * @return {?}
             */
            function add_tokens(str, start, end) {
                return str instanceof NodeWithToken ? str : new NodeWithToken(str, start, end);
            }
            /**
             * @param {Function} matcherFunction
             * @return {?}
             */
            function parse(matcherFunction) {
                return execResult ? function () {
                    var start = S.token;
                    var ast = matcherFunction.apply(this, arguments);
                    return ast[0] = add_tokens(ast[0], start, prev()), ast;
                } : matcherFunction;
            }
            /**
             * @param {?} label
             * @return {?}
             */
            function labeled_statement(label) {
                S.labels.push(label);
                var start = S.token;
                var stat = statement();
                return exigent_mode && (!HOP(UNARY_POSTFIX, stat[0]) && unexpected(start)), S.labels.pop(), as("label", label, stat);
            }
            /**
             * @return {?}
             */
            function simple_statement() {
                return as("stat", prog1(expression, semicolon));
            }
            /**
             * @param {string} type
             * @return {?}
             */
            function break_cont(type) {
                var name;
                return can_insert_semicolon() || (name = is("name") ? S.token.value : null), name != null ? (next(), member(name, S.labels) || croak("Label " + name + " without matching loop or statement")) : S.in_loop == 0 && croak(type + " not inside a loop or switch"), semicolon(), as(type, name);
            }
            /**
             * @return {?}
             */
            function for_() {
                expect("(");
                /** @type {null} */
                var init = null;
                return !is("punc", ";") && (init = is("keyword", "var") ? (next(), var_(true)) : expression(true, true), is("operator", "in")) ? (init[0] == "var" && (init[1].length > 1 && croak("Only one variable declaration allowed in for..in loop")), for_in(init)) : regular_for(init);
            }
            /**
             * @param {Array} init
             * @return {?}
             */
            function regular_for(init) {
                var test;
                var step;
                return expect(";"), test = is("punc", ";") ? null : expression(), expect(";"), step = is("punc", ")") ? null : expression(), expect(")"), as("for", init, test, step, in_loop(statement));
            }
            /**
             * @param {string} init
             * @return {?}
             */
            function for_in(init) {
                var lhs = init[0] == "var" ? as("name", init[1][0]) : init;
                var initialValue;
                return next(), initialValue = expression(), expect(")"), as("for-in", init, lhs, initialValue, in_loop(statement));
            }
            /**
             * @return {?}
             */
            function if_() {
                var cond = parenthesised();
                var body = statement();
                var belse;
                return is("keyword", "else") && (next(), belse = statement()), as("if", cond, body, belse);
            }
            /**
             * @return {?}
             */
            function block_() {
                expect("{");
                /** @type {Array} */
                var a = [];
                for (; !is("punc", "}") ;) {
                    if (is("eof")) {
                        unexpected();
                    }
                    a.push(statement());
                }
                return next(), a;
            }
            /**
             * @return {?}
             */
            function try_() {
                var body = block_();
                var name;
                var bfinally;
                var key;
                return is("keyword", "catch") && (next(), expect("("), is("name") || croak("Name expected"), key = S.token.value, next(), expect(")"), name = [key, block_()]), is("keyword", "finally") && (next(), bfinally = block_()), name || (bfinally || croak("Missing catch/finally blocks")), as("try", body, name, bfinally);
            }
            /**
             * @param {boolean} no_in
             * @return {?}
             */
            function vardefs(no_in) {
                /** @type {Array} */
                var a = [];
                var name;
                for (; ;) {
                    if (is("name") || unexpected(), name = S.token.value, next(), is("operator", "=") ? (next(), a.push([name, expression(false, no_in)])) : a.push([name]), !is("punc", ",")) {
                        break;
                    }
                    next();
                }
                return a;
            }
            /**
             * @param {boolean} no_in
             * @return {?}
             */
            function var_(no_in) {
                return as("var", vardefs(no_in));
            }
            /**
             * @return {?}
             */
            function const_() {
                return as("const", vardefs());
            }
            /**
             * @return {?}
             */
            function expr_atom() {
                var newexp = renderer(false);
                var args;
                return is("punc", "(") ? (next(), args = expr_list(")")) : args = [], subscripts(as("new", newexp, args), true);
            }
            /**
             * @param {string} closing
             * @param {boolean} allow_trailing_comma
             * @param {boolean} allow_empty
             * @return {?}
             */
            function expr_list(closing, allow_trailing_comma, allow_empty) {
                /** @type {boolean} */
                var u = true;
                /** @type {Array} */
                var a = [];
                for (; !is("punc", closing) ;) {
                    if (u ? u = false : expect(","), allow_trailing_comma && is("punc", closing)) {
                        break;
                    }
                    if (is("punc", ",") && allow_empty) {
                        a.push(["atom", "undefined"]);
                    } else {
                        a.push(expression(false));
                    }
                }
                return next(), a;
            }
            /**
             * @return {?}
             */
            function array_() {
                return as("array", expr_list("]", !exigent_mode, true));
            }
            /**
             * @return {?}
             */
            function object_() {
                /** @type {boolean} */
                var i = true;
                /** @type {Array} */
                var a = [];
                var type;
                var name;
                for (; !is("punc", "}") ;) {
                    if (i ? i = false : expect(","), !exigent_mode && is("punc", "}")) {
                        break;
                    }
                    type = S.token.type;
                    name = as_property_name();
                    if (type != "name" || (name != "get" && name != "set" || is("punc", ":"))) {
                        expect(":");
                        a.push([name, expression(false)]);
                    } else {
                        a.push([as_name(), function_(false), name]);
                    }
                }
                return next(), as("object", a);
            }
            /**
             * @return {?}
             */
            function as_property_name() {
                switch (S.token.type) {
                    case "num":
                        ;
                    case "string":
                        return prog1(S.token.value, next);
                }
                return as_name();
            }
            /**
             * @return {?}
             */
            function as_name() {
                switch (S.token.type) {
                    case "name":
                        ;
                    case "operator":
                        ;
                    case "keyword":
                        ;
                    case "atom":
                        return prog1(S.token.value, next);
                    default:
                        unexpected();
                }
            }
            /**
             * @param {?} expr
             * @param {boolean} allow_calls
             * @return {?}
             */
            function subscripts(expr, allow_calls) {
                return is("punc", ".") ? (next(), subscripts(as("dot", expr, as_name()), allow_calls)) : is("punc", "[") ? (next(), subscripts(as("sub", expr, prog1(expression, curry(expect, "]"))), allow_calls)) : allow_calls && is("punc", "(") ? (next(), subscripts(as("call", expr, expr_list(")")), true)) : expr;
            }
            /**
             * @param {boolean} allow_calls
             * @return {?}
             */
            function maybe_unary(allow_calls) {
                if (is("operator") && HOP(UNARY_PREFIX, S.token.value)) {
                    return make_unary("unary-prefix", prog1(S.token.value, next), maybe_unary(allow_calls));
                }
                var val = renderer(allow_calls);
                for (; is("operator") && (HOP(PUNC_CHARS, S.token.value) && !S.token.nlb) ;) {
                    val = make_unary("unary-postfix", S.token.value, val);
                    next();
                }
                return val;
            }
            /**
             * @param {string} tag
             * @param {string} op
             * @param {Object} expr
             * @return {?}
             */
            function make_unary(tag, op, expr) {
                return op != "++" && op != "--" || (is_assignable(expr) || croak("Invalid use of " + op + " operator")), as(tag, op, expr);
            }
            /**
             * @param {?} left
             * @param {number} min_prec
             * @param {?} no_in
             * @return {?}
             */
            function expr_op(left, min_prec, no_in) {
                var op = is("operator") ? S.token.value : null;
                var prec;
                var right;
                return (op && (op == "in" && (no_in && (op = null))), prec = op != null ? PRECEDENCE[op] : null, prec != null && prec > min_prec) ? (next(), right = expr_op(maybe_unary(true), prec, no_in), expr_op(as("binary", op, left, right), min_prec, no_in)) : left;
            }
            /**
             * @param {?} no_in
             * @return {?}
             */
            function expr_ops(no_in) {
                return expr_op(maybe_unary(true), 0, no_in);
            }
            /**
             * @param {?} no_in
             * @return {?}
             */
            function maybe_conditional(no_in) {
                var expr = expr_ops(no_in);
                var test;
                return is("operator", "?") ? (next(), test = expression(false), expect(":"), as("conditional", expr, test, expression(false, no_in))) : expr;
            }
            /**
             * @param {Array} expr
             * @return {?}
             */
            function is_assignable(expr) {
                if (!exigent_mode) {
                    return true;
                }
                switch (expr[0] + "") {
                    case "dot":
                        ;
                    case "sub":
                        ;
                    case "new":
                        ;
                    case "call":
                        return true;
                    case "name":
                        return expr[1] != "this";
                }
            }
            /**
             * @param {?} no_in
             * @return {?}
             */
            function maybe_assign(no_in) {
                var left = maybe_conditional(no_in);
                var val = S.token.value;
                if (is("operator") && HOP(ASSIGNMENT, val)) {
                    if (is_assignable(left)) {
                        return next(), as("assign", ASSIGNMENT[val], left, maybe_assign(no_in));
                    }
                    croak("Invalid assignment");
                }
                return left;
            }
            /**
             * @param {?} cont
             * @return {?}
             */
            function in_loop(cont) {
                try {
                    return ++S.in_loop, cont();
                } finally {
                    --S.in_loop;
                }
            }
            var S = {
                input: typeof $TEXT == "string" ? tokenizer($TEXT, true) : $TEXT,
                token: null,
                prev: null,
                peeked: null,
                in_function: 0,
                in_directives: true,
                in_loop: 0,
                labels: []
            };
            var statement;
            var function_;
            var switch_block_;
            var renderer;
            var expression;
            return S.token = next(), statement = parse(function () {
                if (is("operator", "/") || is("operator", "/=")) {
                    /** @type {null} */
                    S.peeked = null;
                    S.token = S.input(S.token.value.substr(1));
                }
                switch (S.token.type) {
                    case "string":
                        var dir = S.in_directives;
                        var stat = simple_statement();
                        return dir && (stat[1][0] == "string" && !is("punc", ",")) ? as("directive", stat[1][1]) : stat;
                    case "num":
                        ;
                    case "regexp":
                        ;
                    case "operator":
                        ;
                    case "atom":
                        return simple_statement();
                    case "name":
                        return is_token(peek(), "punc", ":") ? labeled_statement(prog1(S.token.value, next, next)) : simple_statement();
                    case "punc":
                        switch (S.token.value) {
                            case "{":
                                return as("block", block_());
                            case "[":
                                ;
                            case "(":
                                return simple_statement();
                            case ";":
                                return next(), as("block");
                            default:
                                unexpected();
                        }
                        ;
                    case "keyword":
                        switch (prog1(S.token.value, next)) {
                            case "break":
                                return break_cont("break");
                            case "continue":
                                return break_cont("continue");
                            case "debugger":
                                return semicolon(), as("debugger");
                            case "do":
                                return function (body) {
                                    return expect_token("keyword", "while"), as("do", prog1(parenthesised, semicolon), body);
                                }(in_loop(statement));
                            case "for":
                                return for_();
                            case "function":
                                return function_(true);
                            case "if":
                                return if_();
                            case "return":
                                return S.in_function == 0 && croak("'return' outside of function"), as("return", is("punc", ";") ? (next(), null) : can_insert_semicolon() ? null : prog1(expression, semicolon));
                            case "switch":
                                return as("switch", parenthesised(), switch_block_());
                            case "throw":
                                return S.token.nlb && croak("Illegal newline after 'throw'"), as("throw", prog1(expression, semicolon));
                            case "try":
                                return try_();
                            case "var":
                                return prog1(var_, semicolon);
                            case "const":
                                return prog1(const_, semicolon);
                            case "while":
                                return as("while", parenthesised(), in_loop(statement));
                            case "with":
                                return as("with", parenthesised(), statement());
                            default:
                                unexpected();
                        }
                        ;
                }
            }), function_ = function (in_statement) {
                var init = is("name") ? prog1(S.token.value, next) : null;
                return in_statement && (!init && unexpected()), expect("("), as(in_statement ? "defun" : "function", init, function (dataAndEvents, a) {
                    for (; !is("punc", ")") ;) {
                        if (dataAndEvents) {
                            /** @type {boolean} */
                            dataAndEvents = false;
                        } else {
                            expect(",");
                        }
                        if (!is("name")) {
                            unexpected();
                        }
                        a.push(S.token.value);
                        next();
                    }
                    return next(), a;
                }(true, []), function () {
                    var loop;
                    var bfinally;
                    return ++S.in_function, loop = S.in_loop, S.in_directives = true, S.in_loop = 0, bfinally = block_(), --S.in_function, S.in_loop = loop, bfinally;
                }());
            }, switch_block_ = curry(in_loop, function () {
                expect("{");
                /** @type {Array} */
                var a = [];
                /** @type {null} */
                var cur = null;
                for (; !is("punc", "}") ;) {
                    if (is("eof")) {
                        unexpected();
                    }
                    if (is("keyword", "case")) {
                        next();
                        /** @type {Array} */
                        cur = [];
                        a.push([expression(), cur]);
                        expect(":");
                    } else {
                        if (is("keyword", "default")) {
                            next();
                            expect(":");
                            /** @type {Array} */
                            cur = [];
                            a.push([null, cur]);
                        } else {
                            if (!cur) {
                                unexpected();
                            }
                            cur.push(statement());
                        }
                    }
                }
                return next(), a;
            }), renderer = parse(function (allow_calls) {
                if (is("operator", "new")) {
                    return next(), expr_atom();
                }
                if (is("punc")) {
                    switch (S.token.value) {
                        case "(":
                            return next(), subscripts(prog1(expression, curry(expect, ")")), allow_calls);
                        case "[":
                            return next(), subscripts(array_(), allow_calls);
                        case "{":
                            return next(), subscripts(object_(), allow_calls);
                    }
                    unexpected();
                }
                if (is("keyword", "function")) {
                    return next(), subscripts(function_(false), allow_calls);
                }
                if (HOP(OPERATOR_CHARS, S.token.type)) {
                    var atom = S.token.type == "regexp" ? as("regexp", S.token.value[0], S.token.value[1]) : as(S.token.type, S.token.value);
                    return subscripts(prog1(atom, next), allow_calls);
                }
                unexpected();
            }), expression = parse(function (commas, no_in) {
                if (arguments.length == 0) {
                    /** @type {boolean} */
                    commas = true;
                }
                var expr = maybe_assign(no_in);
                return commas && is("punc", ",") ? (next(), as("seq", expr, expression(true, no_in))) : expr;
            }), as("toplevel", function (a) {
                for (; !is("eof") ;) {
                    a.push(statement());
                }
                return a;
            }([]));
        }
        /**
         * @param {Function} f
         * @return {?}
         */
        function curry(f) {
            var args = slice(arguments, 1);
            return function () {
                return f.apply(this, args.concat(slice(arguments)));
            };
        }
        /**
         * @param {Object} ret
         * @return {?}
         */
        function prog1(ret) {
            if (ret instanceof Function) {
                ret = ret();
            }
            /** @type {number} */
            var elementArgumentPos = 1;
            /** @type {number} */
            var argLength = arguments.length;
            for (; --argLength > 0; ++elementArgumentPos) {
                arguments[elementArgumentPos]();
            }
            return ret;
        }
        /**
         * @param {Array} opt_attributes
         * @return {?}
         */
        function array_to_hash(opt_attributes) {
            var ret = {};
            /** @type {number} */
            var j = 0;
            for (; j < opt_attributes.length; ++j) {
                /** @type {boolean} */
                ret[opt_attributes[j]] = true;
            }
            return ret;
        }
        /**
         * @param {Object} a
         * @param {number} start
         * @return {?}
         */
        function slice(a, start) {
            return Array.prototype.slice.call(a, start || 0);
        }
        /**
         * @param {string} str
         * @return {?}
         */
        function characters(str) {
            return str.split("");
        }
        /**
         * @param {?} name
         * @param {Array} array
         * @return {?}
         */
        function member(name, array) {
            var i = array.length;
            for (; --i >= 0;) {
                if (array[i] == name) {
                    return true;
                }
            }
            return false;
        }
        /**
         * @param {?} obj
         * @param {?} prop
         * @return {?}
         */
        function HOP(obj, prop) {
            return Object.prototype.hasOwnProperty.call(obj, prop);
        }
        var REGEXP_MODIFIERS = array_to_hash(["break", "case", "catch", "const", "continue", "debugger", "default", "delete", "do", "else", "finally", "for", "function", "if", "in", "instanceof", "new", "return", "switch", "throw", "try", "typeof", "var", "void", "while", "with"]);
        var RESERVED_WORDS = array_to_hash(["abstract", "boolean", "byte", "char", "class", "double", "enum", "export", "extends", "final", "float", "goto", "implements", "import", "int", "interface", "long", "native", "package", "private", "protected", "public", "short", "static", "super", "synchronized", "throws", "transient", "volatile"]);
        var KEYWORDS_BEFORE_EXPRESSION = array_to_hash(["return", "new", "delete", "throw", "else", "case"]);
        var KEYWORDS_ATOM = array_to_hash(["false", "null", "true", "undefined"]);
        var KEYWORDS = array_to_hash(characters("+-*&%=<>!?|~^"));
        /** @type {RegExp} */
        var rchecked = /^0x[0-9a-f]+$/i;
        /** @type {RegExp} */
        var spaceRe = /^0[0-7]+$/;
        /** @type {RegExp} */
        var exclude = /^\d*\.?\d*(?:e[+-]?\d*(?:\d\.?|\.?\d)\d*)?$/i;
        var OPERATORS = array_to_hash(["in", "instanceof", "typeof", "new", "void", "delete", "++", "--", "+", "-", "!", "~", "&", "|", "^", "*", "/", "%", ">>", "<<", ">>>", "<", ">", "<=", ">=", "==", "===", "!=", "!==", "?", "=", "+=", "-=", "/=", "*=", "%=", ">>=", "<<=", ">>>=", "|=", "^=", "&=", "&&", "||"]);
        var STATEMENTS_WITH_LABELS = array_to_hash(characters(" \u00a0\n\r\t\f\x0B\u200b\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\ufeff"));
        var PUNC_BEFORE_EXPRESSION = array_to_hash(characters("[{(,.;:"));
        var WHITESPACE_CHARS = array_to_hash(characters("[]{}(),;:"));
        var ATOMIC_START_TOKEN = array_to_hash(characters("gmsiy"));
        var UNICODE = {
            letter: new RegExp("[\\u0041-\\u005A\\u0061-\\u007A\\u00AA\\u00B5\\u00BA\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02C1\\u02C6-\\u02D1\\u02E0-\\u02E4\\u02EC\\u02EE\\u0370-\\u0374\\u0376\\u0377\\u037A-\\u037D\\u0386\\u0388-\\u038A\\u038C\\u038E-\\u03A1\\u03A3-\\u03F5\\u03F7-\\u0481\\u048A-\\u0527\\u0531-\\u0556\\u0559\\u0561-\\u0587\\u05D0-\\u05EA\\u05F0-\\u05F2\\u0620-\\u064A\\u066E\\u066F\\u0671-\\u06D3\\u06D5\\u06E5\\u06E6\\u06EE\\u06EF\\u06FA-\\u06FC\\u06FF\\u0710\\u0712-\\u072F\\u074D-\\u07A5\\u07B1\\u07CA-\\u07EA\\u07F4\\u07F5\\u07FA\\u0800-\\u0815\\u081A\\u0824\\u0828\\u0840-\\u0858\\u08A0\\u08A2-\\u08AC\\u0904-\\u0939\\u093D\\u0950\\u0958-\\u0961\\u0971-\\u0977\\u0979-\\u097F\\u0985-\\u098C\\u098F\\u0990\\u0993-\\u09A8\\u09AA-\\u09B0\\u09B2\\u09B6-\\u09B9\\u09BD\\u09CE\\u09DC\\u09DD\\u09DF-\\u09E1\\u09F0\\u09F1\\u0A05-\\u0A0A\\u0A0F\\u0A10\\u0A13-\\u0A28\\u0A2A-\\u0A30\\u0A32\\u0A33\\u0A35\\u0A36\\u0A38\\u0A39\\u0A59-\\u0A5C\\u0A5E\\u0A72-\\u0A74\\u0A85-\\u0A8D\\u0A8F-\\u0A91\\u0A93-\\u0AA8\\u0AAA-\\u0AB0\\u0AB2\\u0AB3\\u0AB5-\\u0AB9\\u0ABD\\u0AD0\\u0AE0\\u0AE1\\u0B05-\\u0B0C\\u0B0F\\u0B10\\u0B13-\\u0B28\\u0B2A-\\u0B30\\u0B32\\u0B33\\u0B35-\\u0B39\\u0B3D\\u0B5C\\u0B5D\\u0B5F-\\u0B61\\u0B71\\u0B83\\u0B85-\\u0B8A\\u0B8E-\\u0B90\\u0B92-\\u0B95\\u0B99\\u0B9A\\u0B9C\\u0B9E\\u0B9F\\u0BA3\\u0BA4\\u0BA8-\\u0BAA\\u0BAE-\\u0BB9\\u0BD0\\u0C05-\\u0C0C\\u0C0E-\\u0C10\\u0C12-\\u0C28\\u0C2A-\\u0C33\\u0C35-\\u0C39\\u0C3D\\u0C58\\u0C59\\u0C60\\u0C61\\u0C85-\\u0C8C\\u0C8E-\\u0C90\\u0C92-\\u0CA8\\u0CAA-\\u0CB3\\u0CB5-\\u0CB9\\u0CBD\\u0CDE\\u0CE0\\u0CE1\\u0CF1\\u0CF2\\u0D05-\\u0D0C\\u0D0E-\\u0D10\\u0D12-\\u0D3A\\u0D3D\\u0D4E\\u0D60\\u0D61\\u0D7A-\\u0D7F\\u0D85-\\u0D96\\u0D9A-\\u0DB1\\u0DB3-\\u0DBB\\u0DBD\\u0DC0-\\u0DC6\\u0E01-\\u0E30\\u0E32\\u0E33\\u0E40-\\u0E46\\u0E81\\u0E82\\u0E84\\u0E87\\u0E88\\u0E8A\\u0E8D\\u0E94-\\u0E97\\u0E99-\\u0E9F\\u0EA1-\\u0EA3\\u0EA5\\u0EA7\\u0EAA\\u0EAB\\u0EAD-\\u0EB0\\u0EB2\\u0EB3\\u0EBD\\u0EC0-\\u0EC4\\u0EC6\\u0EDC-\\u0EDF\\u0F00\\u0F40-\\u0F47\\u0F49-\\u0F6C\\u0F88-\\u0F8C\\u1000-\\u102A\\u103F\\u1050-\\u1055\\u105A-\\u105D\\u1061\\u1065\\u1066\\u106E-\\u1070\\u1075-\\u1081\\u108E\\u10A0-\\u10C5\\u10C7\\u10CD\\u10D0-\\u10FA\\u10FC-\\u1248\\u124A-\\u124D\\u1250-\\u1256\\u1258\\u125A-\\u125D\\u1260-\\u1288\\u128A-\\u128D\\u1290-\\u12B0\\u12B2-\\u12B5\\u12B8-\\u12BE\\u12C0\\u12C2-\\u12C5\\u12C8-\\u12D6\\u12D8-\\u1310\\u1312-\\u1315\\u1318-\\u135A\\u1380-\\u138F\\u13A0-\\u13F4\\u1401-\\u166C\\u166F-\\u167F\\u1681-\\u169A\\u16A0-\\u16EA\\u16EE-\\u16F0\\u1700-\\u170C\\u170E-\\u1711\\u1720-\\u1731\\u1740-\\u1751\\u1760-\\u176C\\u176E-\\u1770\\u1780-\\u17B3\\u17D7\\u17DC\\u1820-\\u1877\\u1880-\\u18A8\\u18AA\\u18B0-\\u18F5\\u1900-\\u191C\\u1950-\\u196D\\u1970-\\u1974\\u1980-\\u19AB\\u19C1-\\u19C7\\u1A00-\\u1A16\\u1A20-\\u1A54\\u1AA7\\u1B05-\\u1B33\\u1B45-\\u1B4B\\u1B83-\\u1BA0\\u1BAE\\u1BAF\\u1BBA-\\u1BE5\\u1C00-\\u1C23\\u1C4D-\\u1C4F\\u1C5A-\\u1C7D\\u1CE9-\\u1CEC\\u1CEE-\\u1CF1\\u1CF5\\u1CF6\\u1D00-\\u1DBF\\u1E00-\\u1F15\\u1F18-\\u1F1D\\u1F20-\\u1F45\\u1F48-\\u1F4D\\u1F50-\\u1F57\\u1F59\\u1F5B\\u1F5D\\u1F5F-\\u1F7D\\u1F80-\\u1FB4\\u1FB6-\\u1FBC\\u1FBE\\u1FC2-\\u1FC4\\u1FC6-\\u1FCC\\u1FD0-\\u1FD3\\u1FD6-\\u1FDB\\u1FE0-\\u1FEC\\u1FF2-\\u1FF4\\u1FF6-\\u1FFC\\u2071\\u207F\\u2090-\\u209C\\u2102\\u2107\\u210A-\\u2113\\u2115\\u2119-\\u211D\\u2124\\u2126\\u2128\\u212A-\\u212D\\u212F-\\u2139\\u213C-\\u213F\\u2145-\\u2149\\u214E\\u2160-\\u2188\\u2C00-\\u2C2E\\u2C30-\\u2C5E\\u2C60-\\u2CE4\\u2CEB-\\u2CEE\\u2CF2\\u2CF3\\u2D00-\\u2D25\\u2D27\\u2D2D\\u2D30-\\u2D67\\u2D6F\\u2D80-\\u2D96\\u2DA0-\\u2DA6\\u2DA8-\\u2DAE\\u2DB0-\\u2DB6\\u2DB8-\\u2DBE\\u2DC0-\\u2DC6\\u2DC8-\\u2DCE\\u2DD0-\\u2DD6\\u2DD8-\\u2DDE\\u2E2F\\u3005-\\u3007\\u3021-\\u3029\\u3031-\\u3035\\u3038-\\u303C\\u3041-\\u3096\\u309D-\\u309F\\u30A1-\\u30FA\\u30FC-\\u30FF\\u3105-\\u312D\\u3131-\\u318E\\u31A0-\\u31BA\\u31F0-\\u31FF\\u3400-\\u4DB5\\u4E00-\\u9FCC\\uA000-\\uA48C\\uA4D0-\\uA4FD\\uA500-\\uA60C\\uA610-\\uA61F\\uA62A\\uA62B\\uA640-\\uA66E\\uA67F-\\uA697\\uA6A0-\\uA6EF\\uA717-\\uA71F\\uA722-\\uA788\\uA78B-\\uA78E\\uA790-\\uA793\\uA7A0-\\uA7AA\\uA7F8-\\uA801\\uA803-\\uA805\\uA807-\\uA80A\\uA80C-\\uA822\\uA840-\\uA873\\uA882-\\uA8B3\\uA8F2-\\uA8F7\\uA8FB\\uA90A-\\uA925\\uA930-\\uA946\\uA960-\\uA97C\\uA984-\\uA9B2\\uA9CF\\uAA00-\\uAA28\\uAA40-\\uAA42\\uAA44-\\uAA4B\\uAA60-\\uAA76\\uAA7A\\uAA80-\\uAAAF\\uAAB1\\uAAB5\\uAAB6\\uAAB9-\\uAABD\\uAAC0\\uAAC2\\uAADB-\\uAADD\\uAAE0-\\uAAEA\\uAAF2-\\uAAF4\\uAB01-\\uAB06\\uAB09-\\uAB0E\\uAB11-\\uAB16\\uAB20-\\uAB26\\uAB28-\\uAB2E\\uABC0-\\uABE2\\uAC00-\\uD7A3\\uD7B0-\\uD7C6\\uD7CB-\\uD7FB\\uF900-\\uFA6D\\uFA70-\\uFAD9\\uFB00-\\uFB06\\uFB13-\\uFB17\\uFB1D\\uFB1F-\\uFB28\\uFB2A-\\uFB36\\uFB38-\\uFB3C\\uFB3E\\uFB40\\uFB41\\uFB43\\uFB44\\uFB46-\\uFBB1\\uFBD3-\\uFD3D\\uFD50-\\uFD8F\\uFD92-\\uFDC7\\uFDF0-\\uFDFB\\uFE70-\\uFE74\\uFE76-\\uFEFC\\uFF21-\\uFF3A\\uFF41-\\uFF5A\\uFF66-\\uFFBE\\uFFC2-\\uFFC7\\uFFCA-\\uFFCF\\uFFD2-\\uFFD7\\uFFDA-\\uFFDC]"),
            combining_mark: new RegExp("[\\u0300-\\u036F\\u0483-\\u0487\\u0591-\\u05BD\\u05BF\\u05C1\\u05C2\\u05C4\\u05C5\\u05C7\\u0610-\\u061A\\u064B-\\u065F\\u0670\\u06D6-\\u06DC\\u06DF-\\u06E4\\u06E7\\u06E8\\u06EA-\\u06ED\\u0711\\u0730-\\u074A\\u07A6-\\u07B0\\u07EB-\\u07F3\\u0816-\\u0819\\u081B-\\u0823\\u0825-\\u0827\\u0829-\\u082D\\u0859-\\u085B\\u08E4-\\u08FE\\u0900-\\u0903\\u093A-\\u093C\\u093E-\\u094F\\u0951-\\u0957\\u0962\\u0963\\u0981-\\u0983\\u09BC\\u09BE-\\u09C4\\u09C7\\u09C8\\u09CB-\\u09CD\\u09D7\\u09E2\\u09E3\\u0A01-\\u0A03\\u0A3C\\u0A3E-\\u0A42\\u0A47\\u0A48\\u0A4B-\\u0A4D\\u0A51\\u0A70\\u0A71\\u0A75\\u0A81-\\u0A83\\u0ABC\\u0ABE-\\u0AC5\\u0AC7-\\u0AC9\\u0ACB-\\u0ACD\\u0AE2\\u0AE3\\u0B01-\\u0B03\\u0B3C\\u0B3E-\\u0B44\\u0B47\\u0B48\\u0B4B-\\u0B4D\\u0B56\\u0B57\\u0B62\\u0B63\\u0B82\\u0BBE-\\u0BC2\\u0BC6-\\u0BC8\\u0BCA-\\u0BCD\\u0BD7\\u0C01-\\u0C03\\u0C3E-\\u0C44\\u0C46-\\u0C48\\u0C4A-\\u0C4D\\u0C55\\u0C56\\u0C62\\u0C63\\u0C82\\u0C83\\u0CBC\\u0CBE-\\u0CC4\\u0CC6-\\u0CC8\\u0CCA-\\u0CCD\\u0CD5\\u0CD6\\u0CE2\\u0CE3\\u0D02\\u0D03\\u0D3E-\\u0D44\\u0D46-\\u0D48\\u0D4A-\\u0D4D\\u0D57\\u0D62\\u0D63\\u0D82\\u0D83\\u0DCA\\u0DCF-\\u0DD4\\u0DD6\\u0DD8-\\u0DDF\\u0DF2\\u0DF3\\u0E31\\u0E34-\\u0E3A\\u0E47-\\u0E4E\\u0EB1\\u0EB4-\\u0EB9\\u0EBB\\u0EBC\\u0EC8-\\u0ECD\\u0F18\\u0F19\\u0F35\\u0F37\\u0F39\\u0F3E\\u0F3F\\u0F71-\\u0F84\\u0F86\\u0F87\\u0F8D-\\u0F97\\u0F99-\\u0FBC\\u0FC6\\u102B-\\u103E\\u1056-\\u1059\\u105E-\\u1060\\u1062-\\u1064\\u1067-\\u106D\\u1071-\\u1074\\u1082-\\u108D\\u108F\\u109A-\\u109D\\u135D-\\u135F\\u1712-\\u1714\\u1732-\\u1734\\u1752\\u1753\\u1772\\u1773\\u17B4-\\u17D3\\u17DD\\u180B-\\u180D\\u18A9\\u1920-\\u192B\\u1930-\\u193B\\u19B0-\\u19C0\\u19C8\\u19C9\\u1A17-\\u1A1B\\u1A55-\\u1A5E\\u1A60-\\u1A7C\\u1A7F\\u1B00-\\u1B04\\u1B34-\\u1B44\\u1B6B-\\u1B73\\u1B80-\\u1B82\\u1BA1-\\u1BAD\\u1BE6-\\u1BF3\\u1C24-\\u1C37\\u1CD0-\\u1CD2\\u1CD4-\\u1CE8\\u1CED\\u1CF2-\\u1CF4\\u1DC0-\\u1DE6\\u1DFC-\\u1DFF\\u20D0-\\u20DC\\u20E1\\u20E5-\\u20F0\\u2CEF-\\u2CF1\\u2D7F\\u2DE0-\\u2DFF\\u302A-\\u302F\\u3099\\u309A\\uA66F\\uA674-\\uA67D\\uA69F\\uA6F0\\uA6F1\\uA802\\uA806\\uA80B\\uA823-\\uA827\\uA880\\uA881\\uA8B4-\\uA8C4\\uA8E0-\\uA8F1\\uA926-\\uA92D\\uA947-\\uA953\\uA980-\\uA983\\uA9B3-\\uA9C0\\uAA29-\\uAA36\\uAA43\\uAA4C\\uAA4D\\uAA7B\\uAAB0\\uAAB2-\\uAAB4\\uAAB7\\uAAB8\\uAABE\\uAABF\\uAAC1\\uAAEB-\\uAAEF\\uAAF5\\uAAF6\\uABE3-\\uABEA\\uABEC\\uABED\\uFB1E\\uFE00-\\uFE0F\\uFE20-\\uFE26]"),
            connector_punctuation: new RegExp("[\\u005F\\u203F\\u2040\\u2054\\uFE33\\uFE34\\uFE4D-\\uFE4F\\uFF3F]"),
            digit: new RegExp("[\\u0030-\\u0039\\u0660-\\u0669\\u06F0-\\u06F9\\u07C0-\\u07C9\\u0966-\\u096F\\u09E6-\\u09EF\\u0A66-\\u0A6F\\u0AE6-\\u0AEF\\u0B66-\\u0B6F\\u0BE6-\\u0BEF\\u0C66-\\u0C6F\\u0CE6-\\u0CEF\\u0D66-\\u0D6F\\u0E50-\\u0E59\\u0ED0-\\u0ED9\\u0F20-\\u0F29\\u1040-\\u1049\\u1090-\\u1099\\u17E0-\\u17E9\\u1810-\\u1819\\u1946-\\u194F\\u19D0-\\u19D9\\u1A80-\\u1A89\\u1A90-\\u1A99\\u1B50-\\u1B59\\u1BB0-\\u1BB9\\u1C40-\\u1C49\\u1C50-\\u1C59\\uA620-\\uA629\\uA8D0-\\uA8D9\\uA900-\\uA909\\uA9D0-\\uA9D9\\uAA50-\\uAA59\\uABF0-\\uABF9\\uFF10-\\uFF19]")
        };
        var radio;
        var warn;
        /**
         * @return {?}
         */
        JS_Parse_Error.prototype.toString = function () {
            return this.message + " (line: " + this.line + ", col: " + this.col + ", pos: " + this.pos + ")\n\n" + this.stack;
        };
        radio = {};
        var UNARY_PREFIX = array_to_hash(["typeof", "void", "delete", "--", "++", "!", "~", "-", "+"]);
        var PUNC_CHARS = array_to_hash(["--", "++"]);
        var ASSIGNMENT = function (a, ret, i) {
            for (; i < a.length;) {
                ret[a[i]] = a[i].substr(0, a[i].length - 1);
                i++;
            }
            return ret;
        }(["+=", "-=", "/=", "*=", "%=", ">>=", "<<=", ">>>=", "|=", "^=", "&="], {
            "=": true
        }, 0);
        var PRECEDENCE = function (_args, ret) {
            var b;
            var j;
            /** @type {number} */
            var i = 0;
            /** @type {number} */
            var n = 1;
            for (; i < _args.length; ++i, ++n) {
                b = _args[i];
                /** @type {number} */
                j = 0;
                for (; j < b.length; ++j) {
                    /** @type {number} */
                    ret[b[j]] = n;
                }
            }
            return ret;
        }([["||"], ["&&"], ["|"], ["^"], ["&"], ["==", "===", "!=", "!=="], ["<", ">", "<=", ">=", "in", "instanceof"], [">>", "<<", ">>>"], ["+", "-"], ["*", "/", "%"]], {});
        var UNARY_POSTFIX = array_to_hash(["for", "do", "while", "switch"]);
        var OPERATOR_CHARS = array_to_hash(["atom", "num", "string", "regexp", "name"]);
        return NodeWithToken.prototype.toString = function () {
            return this.name;
        }, warn = function () {
        }, parse;
    }();
    var data;
    var d;
    /** @type {function (this:JSONType, *, (Array.<string>|function (string, *): *|null)=, (number|string)=): string} */
    exports.stringify = exports.stringify || function (obj) {
        /** @type {string} */
        var t = typeof obj;
        var i;
        var v;
        var json;
        var arr;
        if (t != "object" || obj === null) {
            return t == "string" && (obj = '"' + obj + '"'), String(obj);
        }
        /** @type {Array} */
        json = [];
        arr = obj && obj.constructor == Array;
        for (i in obj) {
            v = obj[i];
            /** @type {string} */
            t = typeof v;
            if (t == "string") {
                /** @type {string} */
                v = '"' + v + '"';
            } else {
                if (t == "object") {
                    if (v !== null) {
                        /** @type {string} */
                        v = exports.stringify(v);
                    }
                }
            }
            json.push((arr ? "" : '"' + i + '":') + String(v));
        }
        return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");
    };
    /** @type {function (this:JSONType, string, function (string, *): *=): *} */
    exports.parse = exports.parse || function (url) {
        return url === "" && (url = '""'), eval("var p=" + url + ";"), p;
    };
    /** @type {boolean} */
    var b = false;
    /** @type {RegExp} */
    var fnTest = /xyz/.test(function () {
        xyz;
    }) ? /\b_super\b/ : /.*/;
    /**
     * @return {undefined}
     */
    var $$ = function () {
    };
    /**
     * @param {Object} prop
     * @return {?}
     */
    $$.extend = function (prop) {
        /**
         * @return {undefined}
         */
        function Class() {
            if (!b) {
                if (this.init) {
                    this.init.apply(this, arguments);
                }
            }
        }
        var _super = this.prototype;
        var prototype;
        var name;
        var key;
        var k;
        /** @type {boolean} */
        b = true;
        prototype = new this;
        /** @type {boolean} */
        b = false;
        for (name in prop) {
            if (name != "statics") {
                prototype[name] = typeof prop[name] == "function" && (typeof _super[name] == "function" && fnTest.test(prop[name])) ? function (name, matcherFunction) {
                    return function () {
                        var tmp = this._super;
                        var returnValue;
                        return this._super = _super[name], returnValue = matcherFunction.apply(this, arguments), this._super = tmp, returnValue;
                    };
                }(name, prop[name]) : prop[name];
            }
        }
        for (key in this) {
            if (this.hasOwnProperty(key)) {
                if (key != "extend") {
                    Class[key] = this[key];
                }
            }
        }
        if (prop.statics) {
            for (k in prop.statics) {
                if (prop.statics.hasOwnProperty(k)) {
                    Class[k] = prop.statics[k];
                }
            }
        }
        return Class.prototype = prototype, Class.prototype.constructor = Class, Class.extend = arguments.callee, Class;
    };
    /** @type {HTMLDocument} */
    var doc = document;
    var utils = {};
    var head = doc.head || (doc.getElementsByTagName("head")[0] || doc.documentElement);
    var insertBeforeEl = head.getElementsByTagName("base")[0];
    var targetNode;
    var h;
    var cache = {};
    /** @type {Array} */
    var t = [];
    var reported_date = process();
    var result = {};
    var scope;
    var names = {};
    /** @type {boolean} */
    var ti = !!(typeof window != "undefined" && (typeof navigator != "undefined" && window.document));
    /** @type {boolean} */
    var val = false;
    var a;
    /** @type {Array} */
    var list = [];
    var isObject = isType("Object");
    var dateString = isType("String");
    /** @type {function (*): boolean} */
    var ri = Array.isArray || isType("Array");
    var isFunction = isType("Function");
    var isString = isType("Boolean");
    /**
     * @param {Object} name
     * @param {boolean} value
     * @param {boolean} prop
     * @return {undefined}
     */
    define = function (name, value, prop) {
        var __class;
        var rvar;
        if (isString(prop) && (val = prop), isString(value) && (val = value), list.length == 0) {
            if (isObject(name)) {
                expand([a], "function(){ var Main=__class.extend(" + has(name) + ");}", true, "Main", true);
            } else {
                name.unshift(a);
                expand(name, "function(){ var Main=__class.extend(" + has(value) + ");}", true, "Main", true);
            }
            return;
        }
        if (arguments.length === 1) {
            throw "the module must take a name";
        }
        var ca = name.split(":");
        var c = ca[0];
        var i = lastIndexOf(c, ".");
        if (i == -1) {
            throw "the class must have a namespace";
        }
        /** @type {string} */
        __class = ca.length == 1 ? "__class" : ' __modules["' + ca[1] + '"]';
        rvar = c.substring(i + 1, c.length);
        if (arguments.length === 2) {
            expand([c.substring(0, i)], "function(){ var " + rvar + "=" + __class + ".extend(" + has(value) + ");}", true, rvar);
        } else {
            value.unshift(c.substring(0, i));
            expand(value, "function(){ var " + rvar + "=" + __class + ".extend(" + has(prop) + ");}", true, rvar, true);
        }
    };
    /** @type {Array} */
    data = [];
    /** @type {boolean} */
    d = false;
    /**
     * @return {undefined}
     */
    define.build = function () {
        /** @type {boolean} */
        d = true;
        define.apply(null, arguments);
    };
    /** @type {Array} */
    define.pendingModules = list;
    request(reported_date + "Main.js", function () {
    });
    /**
     * @param {Object} o
     * @return {undefined}
     */
    main.config = function (o) {
        var i;
        var entry;
        var codeSegments;
        a = o.name;
        scope = o.baseUrl;
        /** @type {number} */
        i = 0;
        for (; i < o.classes.length; i++) {
            entry = o.classes[i];
            t.push(entry.name);
            codeSegments = entry.name.split(".");
            /** @type {string} */
            result[entry.name] = scope + "/" + (entry.url ? entry.url + "/" : "") + codeSegments[codeSegments.length - 1] + ".js";
            names[codeSegments[codeSegments.length - 1]] = entry.name;
        }
    };
    /** @type {function (): undefined} */
    global.__class = $$;
    define.modules = global.__modules = cache;
    /** @type {function (Object, boolean, boolean): undefined} */
    global.define = define;
    global.kmdjs = main;
})(typeof JSON != "object" ? {} : JSON, this);
