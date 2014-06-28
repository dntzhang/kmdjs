/* KMD.js Kill AMD and CMD
 * By 当耐特 http://weibo.com/iamleizhang
 * KMD.js http://kmdjs.github.io/
 * blog: http://www.cnblogs.com/iamzhanglei/
 * My website:http://htmlcssjs.duapp.com/
 * MIT Licensed.
 */
!function (JSON, global, undefined) {
    (function () {
        'use strict';

        function f(n) {
            return n < 10 ? '0' + n : n;
        }

        if (typeof Date.prototype.toJSON !== 'function') {

            Date.prototype.toJSON = function () {

                return isFinite(this.valueOf())
                    ? this.getUTCFullYear() + '-' +
                        f(this.getUTCMonth() + 1) + '-' +
                        f(this.getUTCDate()) + 'T' +
                        f(this.getUTCHours()) + ':' +
                        f(this.getUTCMinutes()) + ':' +
                        f(this.getUTCSeconds()) + 'Z'
                    : null;
            };

            String.prototype.toJSON =
                Number.prototype.toJSON =
                Boolean.prototype.toJSON = function () {
                    return this.valueOf();
                };
        }

        var cx,
            escapable,
            gap,
            indent,
            meta,
            rep;


        function quote(string) {


            escapable.lastIndex = 0;
            return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
                var c = meta[a];
                return typeof c === 'string'
                    ? c
                    : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
            }) + '"' : '"' + string + '"';
        }


        function str(key, holder) {


            var i,
                k,
                v,
                length,
                mind = gap,
                partial,
                value = holder[key];


            if (value && typeof value === 'object' &&
                    typeof value.toJSON === 'function') {
                value = value.toJSON(key);
            }


            if (typeof rep === 'function') {
                value = rep.call(holder, key, value);
            }


            switch (typeof value) {
                case 'string':
                    return quote(value);

                case 'number':


                    return isFinite(value) ? String(value) : 'null';

                case 'boolean':
                case 'null':


                    return String(value);


                case 'object':


                    if (!value) {
                        return 'null';
                    }


                    gap += indent;
                    partial = [];


                    if (Object.prototype.toString.apply(value) === '[object Array]') {


                        length = value.length;
                        for (i = 0; i < length; i += 1) {
                            partial[i] = str(i, value) || 'null';
                        }


                        v = partial.length === 0
                            ? '[]'
                            : gap
                            ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']'
                            : '[' + partial.join(',') + ']';
                        gap = mind;
                        return v;
                    }


                    if (rep && typeof rep === 'object') {
                        length = rep.length;
                        for (i = 0; i < length; i += 1) {
                            if (typeof rep[i] === 'string') {
                                k = rep[i];
                                v = str(k, value);
                                if (v) {
                                    partial.push(quote(k) + (gap ? ': ' : ':') + v);
                                }
                            }
                        }
                    } else {


                        for (k in value) {
                            if (Object.prototype.hasOwnProperty.call(value, k)) {
                                v = str(k, value);
                                if (v) {
                                    partial.push(quote(k) + (gap ? ': ' : ':') + v);
                                }
                            }
                        }
                    }


                    v = partial.length === 0
                        ? '{}'
                        : gap
                        ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}'
                        : '{' + partial.join(',') + '}';
                    gap = mind;
                    return v;
            }
        }


        if (typeof JSON.stringify !== 'function') {
            escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
            meta = {
                '\b': '\\b',
                '\t': '\\t',
                '\n': '\\n',
                '\f': '\\f',
                '\r': '\\r',
                '"': '\\"',
                '\\': '\\\\'
            };
            JSON.stringify = function (value, replacer, space) {


                var i;
                gap = '';
                indent = '';


                if (typeof space === 'number') {
                    for (i = 0; i < space; i += 1) {
                        indent += ' ';
                    }


                } else if (typeof space === 'string') {
                    indent = space;
                }


                rep = replacer;
                if (replacer && typeof replacer !== 'function' &&
                        (typeof replacer !== 'object' ||
                        typeof replacer.length !== 'number')) {
                    throw new Error('JSON.stringify');
                }


                return str('', { '': value });
            };
        }



        if (typeof JSON.parse !== 'function') {
            cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
            JSON.parse = function (text, reviver) {


                var j;

                function walk(holder, key) {


                    var k, v, value = holder[key];
                    if (value && typeof value === 'object') {
                        for (k in value) {
                            if (Object.prototype.hasOwnProperty.call(value, k)) {
                                v = walk(value, k);
                                if (v !== undefined) {
                                    value[k] = v;
                                } else {
                                    delete value[k];
                                }
                            }
                        }
                    }
                    return reviver.call(holder, key, value);
                }



                text = String(text);
                cx.lastIndex = 0;
                if (cx.test(text)) {
                    text = text.replace(cx, function (a) {
                        return '\\u' +
                            ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                    });
                }



                if (/^[\],:{}\s]*$/
                        .test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
                            .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
                            .replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {


                    j = eval('(' + text + ')');


                    return typeof reviver === 'function'
                        ? walk({ '': j }, '')
                        : j;
                }


                throw new SyntaxError('JSON.parse');
            };
        }
    }());


    if (!Array.prototype.map) {
        Array.prototype.map = function (callback, thisArg) {

            var T, A, k;

            if (this == null) {
                throw new TypeError(" this is null or not defined");
            }

            var O = Object(this);

            var len = O.length >>> 0;

            if ({}.toString.call(callback) != "[object Function]") {
                throw new TypeError(callback + " is not a function");
            }

            if (thisArg) {
                T = thisArg;
            }

            A = new Array(len);

            k = 0;

            while (k < len) {

                var kValue, mappedValue;

                if (k in O) {

                    kValue = O[k];

                    mappedValue = callback.call(T, kValue, k, O);

                    A[k] = mappedValue;
                }
                k++;
            }

            return A;
        };
    }
    if (!Array.prototype.indexOf) {
        Array.prototype.indexOf = function (searchElement, fromIndex) {
            if (this === undefined || this === null) {
                throw new TypeError('"this" is null or not defined');
            }

            var length = this.length >>> 0;

            fromIndex = +fromIndex || 0;

            if (Math.abs(fromIndex) === Infinity) {
                fromIndex = 0;
            }

            if (fromIndex < 0) {
                fromIndex += length;
                if (fromIndex < 0) {
                    fromIndex = 0;
                }
            }

            for (; fromIndex < length; fromIndex++) {
                if (this[fromIndex] === searchElement) {
                    return fromIndex;
                }
            }

            return -1;
        };
    }

    if (!Array.prototype.forEach) {

        Array.prototype.forEach = function (callback, thisArg) {

            var T, k;

            if (this == null) {
                throw new TypeError(" this is null or not defined");
            }

            var O = Object(this);

            var len = O.length >>> 0;

            if (typeof callback !== "function") {
                throw new TypeError(callback + " is not a function");
            }

            if (thisArg) {
                T = thisArg;
            }

            k = 0;

            while (k < len) {

                var kValue;

                if (k in O) {

                    kValue = O[k];

                    callback.call(T, kValue, k, O);
                }
                k++;
            }
        };
    }
    if (typeof Object.create != 'function') {
        (function () {
            var F = function () { };
            Object.create = function (o) {
                if (arguments.length > 1) {
                    throw Error('Second argument not supported');
                }
                if (o === null) {
                    throw Error('Cannot set a null [[Prototype]]');
                }
                if (typeof o != 'object') {
                    throw TypeError('Argument must be an object');
                }
                F.prototype = o;
                return new F();
            };
        })();
    }

    var UglifyJS = (function () {



        var UglifyJS = {};
        "use strict";

        function array_to_hash(a) {
            var ret = {};
            for (var i = 0; i < a.length; ++i)
                ret[a[i]] = true;
            return ret;
        };

        function slice(a, start) {
            return Array.prototype.slice.call(a, start || 0);
        };

        function characters(str) {
            return str.split("");
        };

        function member(name, array) {
            for (var i = array.length; --i >= 0;)
                if (array[i] == name)
                    return true;
            return false;
        };

        function find_if(func, array) {
            for (var i = 0, n = array.length; i < n; ++i) {
                if (func(array[i]))
                    return array[i];
            }
        };

        function repeat_string(str, i) {
            if (i <= 0) return "";
            if (i == 1) return str;
            var d = repeat_string(str, i >> 1);
            d += d;
            if (i & 1) d += str;
            return d;
        };

        function DefaultsError(msg, defs) {
            Error.call(this, msg);
            this.msg = msg;
            this.defs = defs;
        };
        DefaultsError.prototype = Object.create(Error.prototype);
        DefaultsError.prototype.constructor = DefaultsError;

        DefaultsError.croak = function (msg, defs) {
            throw new DefaultsError(msg, defs);
        };

        function defaults(args, defs, croak) {
            if (args === true)
                args = {};
            var ret = args || {};
            if (croak) for (var i in ret) if (ret.hasOwnProperty(i) && !defs.hasOwnProperty(i))
                DefaultsError.croak("`" + i + "` is not a supported option", defs);
            for (var i in defs) if (defs.hasOwnProperty(i)) {
                ret[i] = (args && args.hasOwnProperty(i)) ? args[i] : defs[i];
            }
            return ret;
        };

        function merge(obj, ext) {
            for (var i in ext) if (ext.hasOwnProperty(i)) {
                obj[i] = ext[i];
            }
            return obj;
        };

        function noop() { };

        var MAP = (function () {
            function MAP(a, f, backwards) {
                var ret = [], top = [], i;
                function doit() {
                    var val = f(a[i], i);
                    var is_last = val instanceof Last;
                    if (is_last) val = val.v;
                    if (val instanceof AtTop) {
                        val = val.v;
                        if (val instanceof Splice) {
                            top.push.apply(top, backwards ? val.v.slice().reverse() : val.v);
                        } else {
                            top.push(val);
                        }
                    }
                    else if (val !== skip) {
                        if (val instanceof Splice) {
                            ret.push.apply(ret, backwards ? val.v.slice().reverse() : val.v);
                        } else {
                            ret.push(val);
                        }
                    }
                    return is_last;
                };
                if (a instanceof Array) {
                    if (backwards) {
                        for (i = a.length; --i >= 0;) if (doit()) break;
                        ret.reverse();
                        top.reverse();
                    } else {
                        for (i = 0; i < a.length; ++i) if (doit()) break;
                    }
                }
                else {
                    for (i in a) if (a.hasOwnProperty(i)) if (doit()) break;
                }
                return top.concat(ret);
            };
            MAP.at_top = function (val) { return new AtTop(val) };
            MAP.splice = function (val) { return new Splice(val) };
            MAP.last = function (val) { return new Last(val) };
            var skip = MAP.skip = {};
            function AtTop(val) { this.v = val };
            function Splice(val) { this.v = val };
            function Last(val) { this.v = val };
            return MAP;
        })();

        function push_uniq(array, el) {
            if (array.indexOf(el) < 0)
                array.push(el);
        };

        function string_template(text, props) {
            return text.replace(/\{(.+?)\}/g, function (str, p) {
                return props[p];
            });
        };

        function remove(array, el) {
            for (var i = array.length; --i >= 0;) {
                if (array[i] === el) array.splice(i, 1);
            }
        };

        function mergeSort(array, cmp) {
            if (array.length < 2) return array.slice();
            function merge(a, b) {
                var r = [], ai = 0, bi = 0, i = 0;
                while (ai < a.length && bi < b.length) {
                    cmp(a[ai], b[bi]) <= 0
                        ? r[i++] = a[ai++]
                        : r[i++] = b[bi++];
                }
                if (ai < a.length) r.push.apply(r, a.slice(ai));
                if (bi < b.length) r.push.apply(r, b.slice(bi));
                return r;
            };
            function _ms(a) {
                if (a.length <= 1)
                    return a;
                var m = Math.floor(a.length / 2), left = a.slice(0, m), right = a.slice(m);
                left = _ms(left);
                right = _ms(right);
                return merge(left, right);
            };
            return _ms(array);
        };

        function set_difference(a, b) {
            return a.filter(function (el) {
                return b.indexOf(el) < 0;
            });
        };

        function set_intersection(a, b) {
            return a.filter(function (el) {
                return b.indexOf(el) >= 0;
            });
        };

        // this function is taken from Acorn [1], written by Marijn Haverbeke
        // [1] https://github.com/marijnh/acorn
        function makePredicate(words) {
            if (!(words instanceof Array)) words = words.split(" ");
            var f = "", cats = [];
            out: for (var i = 0; i < words.length; ++i) {
                for (var j = 0; j < cats.length; ++j)
                    if (cats[j][0].length == words[i].length) {
                        cats[j].push(words[i]);
                        continue out;
                    }
                cats.push([words[i]]);
            }
            function compareTo(arr) {
                if (arr.length == 1) return f += "return str === " + JSON.stringify(arr[0]) + ";";
                f += "switch(str){";
                for (var i = 0; i < arr.length; ++i) f += "case " + JSON.stringify(arr[i]) + ":";
                f += "return true}return false;";
            }
            // When there are more than three length categories, an outer
            // switch first dispatches on the lengths, to save on comparisons.
            if (cats.length > 3) {
                cats.sort(function (a, b) { return b.length - a.length; });
                f += "switch(str.length){";
                for (var i = 0; i < cats.length; ++i) {
                    var cat = cats[i];
                    f += "case " + cat[0].length + ":";
                    compareTo(cat);
                }
                f += "}";
                // Otherwise, simply generate a flat `switch` statement.
            } else {
                compareTo(words);
            }
            return new Function("str", f);
        };

        function all(array, predicate) {
            for (var i = array.length; --i >= 0;)
                if (!predicate(array[i]))
                    return false;
            return true;
        };

        function Dictionary() {
            //this._values = Object.create(null);
            this._values = {};
            this._size = 0;
        };
        Dictionary.prototype = {
            set: function (key, val) {
                if (!this.has(key))++this._size;
                this._values["$" + key] = val;
                return this;
            },
            add: function (key, val) {
                if (this.has(key)) {
                    this.get(key).push(val);
                } else {
                    this.set(key, [val]);
                }
                return this;
            },
            get: function (key) { return this._values["$" + key] },
            del: function (key) {
                if (this.has(key)) {
                    --this._size;
                    delete this._values["$" + key];
                }
                return this;
            },
            has: function (key) { return ("$" + key) in this._values },
            each: function (f) {
                for (var i in this._values)
                    f(this._values[i], i.substr(1));
            },
            size: function () {
                return this._size;
            },
            map: function (f) {
                var ret = [];
                for (var i in this._values)
                    ret.push(f(this._values[i], i.substr(1)));
                return ret;
            }
        };



        "use strict";

        function DEFNODE(type, props, methods, base) {
            if (arguments.length < 4) base = AST_Node;
            if (!props) props = [];
            else props = props.split(/\s+/);
            var self_props = props;
            if (base && base.PROPS)
                props = props.concat(base.PROPS);
            var code = "return function AST_" + type + "(props){ if (props) { ";
            for (var i = props.length; --i >= 0;) {
                code += "this." + props[i] + " = props." + props[i] + ";";
            }
            var proto = base && new base;
            if (proto && proto.initialize || (methods && methods.initialize))
                code += "this.initialize();";
            code += "}}";
            var ctor = new Function(code)();
            if (proto) {
                ctor.prototype = proto;
                ctor.BASE = base;
            }
            if (base) base.SUBCLASSES.push(ctor);
            ctor.prototype.CTOR = ctor;
            ctor.PROPS = props || null;
            ctor.SELF_PROPS = self_props;
            ctor.SUBCLASSES = [];
            if (type) {
                ctor.prototype.TYPE = ctor.TYPE = type;
            }
            if (methods) for (i in methods) if (methods.hasOwnProperty(i)) {
                if (/^\$/.test(i)) {
                    ctor[i.substr(1)] = methods[i];
                } else {
                    ctor.prototype[i] = methods[i];
                }
            }
            ctor.DEFMETHOD = function (name, method) {
                this.prototype[name] = method;
            };
            return ctor;
        };

        var AST_Token = DEFNODE("Token", "type value line col pos endpos nlb comments_before file", {
        }, null);

        var AST_Node = DEFNODE("Node", "start end", {
            clone: function () {
                return new this.CTOR(this);
            },
            $documentation: "Base class of all AST nodes",
            $propdoc: {
                start: "[AST_Token] The first token of this node",
                end: "[AST_Token] The last token of this node"
            },
            _walk: function (visitor) {
                return visitor._visit(this);
            },
            walk: function (visitor) {
                return this._walk(visitor); // not sure the indirection will be any help
            }
        }, null);

        AST_Node.warn_function = null;
        AST_Node.warn = function (txt, props) {
            if (AST_Node.warn_function)
                AST_Node.warn_function(string_template(txt, props));
        };

        /* -----[ statements ]----- */

        var AST_Statement = DEFNODE("Statement", null, {
            $documentation: "Base class of all statements"
        });

        var AST_Debugger = DEFNODE("Debugger", null, {
            $documentation: "Represents a debugger statement"
        }, AST_Statement);

        var AST_Directive = DEFNODE("Directive", "value scope", {
            $documentation: "Represents a directive, like \"use strict\";",
            $propdoc: {
                value: "[string] The value of this directive as a plain string (it's not an AST_String!)",
                scope: "[AST_Scope/S] The scope that this directive affects"
            }
        }, AST_Statement);

        var AST_SimpleStatement = DEFNODE("SimpleStatement", "body", {
            $documentation: "A statement consisting of an expression, i.e. a = 1 + 2",
            $propdoc: {
                body: "[AST_Node] an expression node (should not be instanceof AST_Statement)"
            },
            _walk: function (visitor) {
                return visitor._visit(this, function () {
                    this.body._walk(visitor);
                });
            }
        }, AST_Statement);

        function walk_body(node, visitor) {
            if (node.body instanceof AST_Statement) {
                node.body._walk(visitor);
            }
            else node.body.forEach(function (stat) {
                stat._walk(visitor);
            });
        };

        var AST_Block = DEFNODE("Block", "body", {
            $documentation: "A body of statements (usually bracketed)",
            $propdoc: {
                body: "[AST_Statement*] an array of statements"
            },
            _walk: function (visitor) {
                return visitor._visit(this, function () {
                    walk_body(this, visitor);
                });
            }
        }, AST_Statement);

        var AST_BlockStatement = DEFNODE("BlockStatement", null, {
            $documentation: "A block statement"
        }, AST_Block);

        var AST_EmptyStatement = DEFNODE("EmptyStatement", null, {
            $documentation: "The empty statement (empty block or simply a semicolon)",
            _walk: function (visitor) {
                return visitor._visit(this);
            }
        }, AST_Statement);

        var AST_StatementWithBody = DEFNODE("StatementWithBody", "body", {
            $documentation: "Base class for all statements that contain one nested body: `For`, `ForIn`, `Do`, `While`, `With`",
            $propdoc: {
                body: "[AST_Statement] the body; this should always be present, even if it's an AST_EmptyStatement"
            },
            _walk: function (visitor) {
                return visitor._visit(this, function () {
                    this.body._walk(visitor);
                });
            }
        }, AST_Statement);

        var AST_LabeledStatement = DEFNODE("LabeledStatement", "label", {
            $documentation: "Statement with a label",
            $propdoc: {
                label: "[AST_Label] a label definition"
            },
            _walk: function (visitor) {
                return visitor._visit(this, function () {
                    this.label._walk(visitor);
                    this.body._walk(visitor);
                });
            }
        }, AST_StatementWithBody);

        var AST_IterationStatement = DEFNODE("IterationStatement", null, {
            $documentation: "Internal class.  All loops inherit from it."
        }, AST_StatementWithBody);

        var AST_DWLoop = DEFNODE("DWLoop", "condition", {
            $documentation: "Base class for do/while statements",
            $propdoc: {
                condition: "[AST_Node] the loop condition.  Should not be instanceof AST_Statement"
            },
            _walk: function (visitor) {
                return visitor._visit(this, function () {
                    this.condition._walk(visitor);
                    this.body._walk(visitor);
                });
            }
        }, AST_IterationStatement);

        var AST_Do = DEFNODE("Do", null, {
            $documentation: "A `do` statement"
        }, AST_DWLoop);

        var AST_While = DEFNODE("While", null, {
            $documentation: "A `while` statement"
        }, AST_DWLoop);

        var AST_For = DEFNODE("For", "init condition step", {
            $documentation: "A `for` statement",
            $propdoc: {
                init: "[AST_Node?] the `for` initialization code, or null if empty",
                condition: "[AST_Node?] the `for` termination clause, or null if empty",
                step: "[AST_Node?] the `for` update clause, or null if empty"
            },
            _walk: function (visitor) {
                return visitor._visit(this, function () {
                    if (this.init) this.init._walk(visitor);
                    if (this.condition) this.condition._walk(visitor);
                    if (this.step) this.step._walk(visitor);
                    this.body._walk(visitor);
                });
            }
        }, AST_IterationStatement);

        var AST_ForIn = DEFNODE("ForIn", "init name object", {
            $documentation: "A `for ... in` statement",
            $propdoc: {
                init: "[AST_Node] the `for/in` initialization code",
                name: "[AST_SymbolRef?] the loop variable, only if `init` is AST_Var",
                object: "[AST_Node] the object that we're looping through"
            },
            _walk: function (visitor) {
                return visitor._visit(this, function () {
                    this.init._walk(visitor);
                    this.object._walk(visitor);
                    this.body._walk(visitor);
                });
            }
        }, AST_IterationStatement);

        var AST_With = DEFNODE("With", "expression", {
            $documentation: "A `with` statement",
            $propdoc: {
                expression: "[AST_Node] the `with` expression"
            },
            _walk: function (visitor) {
                return visitor._visit(this, function () {
                    this.expression._walk(visitor);
                    this.body._walk(visitor);
                });
            }
        }, AST_StatementWithBody);

        /* -----[ scope and functions ]----- */

        var AST_Scope = DEFNODE("Scope", "directives variables functions uses_with uses_eval parent_scope enclosed cname", {
            $documentation: "Base class for all statements introducing a lexical scope",
            $propdoc: {
                directives: "[string*/S] an array of directives declared in this scope",
                variables: "[Object/S] a map of name -> SymbolDef for all variables/functions defined in this scope",
                functions: "[Object/S] like `variables`, but only lists function declarations",
                uses_with: "[boolean/S] tells whether this scope uses the `with` statement",
                uses_eval: "[boolean/S] tells whether this scope contains a direct call to the global `eval`",
                parent_scope: "[AST_Scope?/S] link to the parent scope",
                enclosed: "[SymbolDef*/S] a list of all symbol definitions that are accessed from this scope or any subscopes",
                cname: "[integer/S] current index for mangling variables (used internally by the mangler)"
            }
        }, AST_Block);

        var AST_Toplevel = DEFNODE("Toplevel", "globals", {
            $documentation: "The toplevel scope",
            $propdoc: {
                globals: "[Object/S] a map of name -> SymbolDef for all undeclared names"
            },
            wrap_enclose: function (arg_parameter_pairs) {
                var self = this;
                var args = [];
                var parameters = [];

                arg_parameter_pairs.forEach(function (pair) {
                    var splitAt = pair.lastIndexOf(":");

                    args.push(pair.substr(0, splitAt));
                    parameters.push(pair.substr(splitAt + 1));
                });

                var wrapped_tl = "(function(" + parameters.join(",") + "){ '$ORIG'; })(" + args.join(",") + ")";
                wrapped_tl = parse(wrapped_tl);
                wrapped_tl = wrapped_tl.transform(new TreeTransformer(function before(node) {
                    if (node instanceof AST_Directive && node.value == "$ORIG") {
                        return MAP.splice(self.body);
                    }
                }));
                return wrapped_tl;
            },
            wrap_commonjs: function (name, export_all) {
                var self = this;
                var to_export = [];
                if (export_all) {
                    self.figure_out_scope();
                    self.walk(new TreeWalker(function (node) {
                        if (node instanceof AST_SymbolDeclaration && node.definition().global) {
                            if (!find_if(function (n) { return n.name == node.name }, to_export))
                                to_export.push(node);
                        }
                    }));
                }
                var wrapped_tl = "(function(exports, global){ global['" + name + "'] = exports; '$ORIG'; '$EXPORTS'; }({}, (function(){return this}())))";
                wrapped_tl = parse(wrapped_tl);
                wrapped_tl = wrapped_tl.transform(new TreeTransformer(function before(node) {
                    if (node instanceof AST_SimpleStatement) {
                        node = node.body;
                        if (node instanceof AST_String) switch (node.getValue()) {
                            case "$ORIG":
                                return MAP.splice(self.body);
                            case "$EXPORTS":
                                var body = [];
                                to_export.forEach(function (sym) {
                                    body.push(new AST_SimpleStatement({
                                        body: new AST_Assign({
                                            left: new AST_Sub({
                                                expression: new AST_SymbolRef({ name: "exports" }),
                                                property: new AST_String({ value: sym.name })
                                            }),
                                            operator: "=",
                                            right: new AST_SymbolRef(sym)
                                        })
                                    }));
                                });
                                return MAP.splice(body);
                        }
                    }
                }));
                return wrapped_tl;
            }
        }, AST_Scope);

        var AST_Lambda = DEFNODE("Lambda", "name argnames uses_arguments", {
            $documentation: "Base class for functions",
            $propdoc: {
                name: "[AST_SymbolDeclaration?] the name of this function",
                argnames: "[AST_SymbolFunarg*] array of function arguments",
                uses_arguments: "[boolean/S] tells whether this function accesses the arguments array"
            },
            _walk: function (visitor) {
                return visitor._visit(this, function () {
                    if (this.name) this.name._walk(visitor);
                    this.argnames.forEach(function (arg) {
                        arg._walk(visitor);
                    });
                    walk_body(this, visitor);
                });
            }
        }, AST_Scope);

        var AST_Accessor = DEFNODE("Accessor", null, {
            $documentation: "A setter/getter function.  The `name` property is always null."
        }, AST_Lambda);

        var AST_Function = DEFNODE("Function", null, {
            $documentation: "A function expression"
        }, AST_Lambda);

        var AST_Defun = DEFNODE("Defun", null, {
            $documentation: "A function definition"
        }, AST_Lambda);

        /* -----[ JUMPS ]----- */

        var AST_Jump = DEFNODE("Jump", null, {
            $documentation: "Base class for “jumps” (for now that's `return`, `throw`, `break` and `continue`)"
        }, AST_Statement);

        var AST_Exit = DEFNODE("Exit", "value", {
            $documentation: "Base class for “exits” (`return` and `throw`)",
            $propdoc: {
                value: "[AST_Node?] the value returned or thrown by this statement; could be null for AST_Return"
            },
            _walk: function (visitor) {
                return visitor._visit(this, this.value && function () {
                    this.value._walk(visitor);
                });
            }
        }, AST_Jump);

        var AST_Return = DEFNODE("Return", null, {
            $documentation: "A `return` statement"
        }, AST_Exit);

        var AST_Throw = DEFNODE("Throw", null, {
            $documentation: "A `throw` statement"
        }, AST_Exit);

        var AST_LoopControl = DEFNODE("LoopControl", "label", {
            $documentation: "Base class for loop control statements (`break` and `continue`)",
            $propdoc: {
                label: "[AST_LabelRef?] the label, or null if none"
            },
            _walk: function (visitor) {
                return visitor._visit(this, this.label && function () {
                    this.label._walk(visitor);
                });
            }
        }, AST_Jump);

        var AST_Break = DEFNODE("Break", null, {
            $documentation: "A `break` statement"
        }, AST_LoopControl);

        var AST_Continue = DEFNODE("Continue", null, {
            $documentation: "A `continue` statement"
        }, AST_LoopControl);

        /* -----[ IF ]----- */

        var AST_If = DEFNODE("If", "condition alternative", {
            $documentation: "A `if` statement",
            $propdoc: {
                condition: "[AST_Node] the `if` condition",
                alternative: "[AST_Statement?] the `else` part, or null if not present"
            },
            _walk: function (visitor) {
                return visitor._visit(this, function () {
                    this.condition._walk(visitor);
                    this.body._walk(visitor);
                    if (this.alternative) this.alternative._walk(visitor);
                });
            }
        }, AST_StatementWithBody);

        /* -----[ SWITCH ]----- */

        var AST_Switch = DEFNODE("Switch", "expression", {
            $documentation: "A `switch` statement",
            $propdoc: {
                expression: "[AST_Node] the `switch` “discriminant”"
            },
            _walk: function (visitor) {
                return visitor._visit(this, function () {
                    this.expression._walk(visitor);
                    walk_body(this, visitor);
                });
            }
        }, AST_Block);

        var AST_SwitchBranch = DEFNODE("SwitchBranch", null, {
            $documentation: "Base class for `switch` branches"
        }, AST_Block);

        var AST_Default = DEFNODE("Default", null, {
            $documentation: "A `default` switch branch"
        }, AST_SwitchBranch);

        var AST_Case = DEFNODE("Case", "expression", {
            $documentation: "A `case` switch branch",
            $propdoc: {
                expression: "[AST_Node] the `case` expression"
            },
            _walk: function (visitor) {
                return visitor._visit(this, function () {
                    this.expression._walk(visitor);
                    walk_body(this, visitor);
                });
            }
        }, AST_SwitchBranch);

        /* -----[ EXCEPTIONS ]----- */

        var AST_Try = DEFNODE("Try", "bcatch bfinally", {
            $documentation: "A `try` statement",
            $propdoc: {
                bcatch: "[AST_Catch?] the catch block, or null if not present",
                bfinally: "[AST_Finally?] the finally block, or null if not present"
            },
            _walk: function (visitor) {
                return visitor._visit(this, function () {
                    walk_body(this, visitor);
                    if (this.bcatch) this.bcatch._walk(visitor);
                    if (this.bfinally) this.bfinally._walk(visitor);
                });
            }
        }, AST_Block);

        var AST_Catch = DEFNODE("Catch", "argname", {
            $documentation: "A `catch` node; only makes sense as part of a `try` statement",
            $propdoc: {
                argname: "[AST_SymbolCatch] symbol for the exception"
            },
            _walk: function (visitor) {
                return visitor._visit(this, function () {
                    this.argname._walk(visitor);
                    walk_body(this, visitor);
                });
            }
        }, AST_Block);

        var AST_Finally = DEFNODE("Finally", null, {
            $documentation: "A `finally` node; only makes sense as part of a `try` statement"
        }, AST_Block);

        /* -----[ VAR/CONST ]----- */

        var AST_Definitions = DEFNODE("Definitions", "definitions", {
            $documentation: "Base class for `var` or `const` nodes (variable declarations/initializations)",
            $propdoc: {
                definitions: "[AST_VarDef*] array of variable definitions"
            },
            _walk: function (visitor) {
                return visitor._visit(this, function () {
                    this.definitions.forEach(function (def) {
                        def._walk(visitor);
                    });
                });
            }
        }, AST_Statement);

        var AST_Var = DEFNODE("Var", null, {
            $documentation: "A `var` statement"
        }, AST_Definitions);

        var AST_Const = DEFNODE("Const", null, {
            $documentation: "A `const` statement"
        }, AST_Definitions);

        var AST_VarDef = DEFNODE("VarDef", "name value", {
            $documentation: "A variable declaration; only appears in a AST_Definitions node",
            $propdoc: {
                name: "[AST_SymbolVar|AST_SymbolConst] name of the variable",
                value: "[AST_Node?] initializer, or null of there's no initializer"
            },
            _walk: function (visitor) {
                return visitor._visit(this, function () {
                    this.name._walk(visitor);
                    if (this.value) this.value._walk(visitor);
                });
            }
        });

        /* -----[ OTHER ]----- */

        var AST_Call = DEFNODE("Call", "expression args", {
            $documentation: "A function call expression",
            $propdoc: {
                expression: "[AST_Node] expression to invoke as function",
                args: "[AST_Node*] array of arguments"
            },
            _walk: function (visitor) {
                return visitor._visit(this, function () {
                    this.expression._walk(visitor);
                    this.args.forEach(function (arg) {
                        arg._walk(visitor);
                    });
                });
            }
        });

        var AST_New = DEFNODE("New", null, {
            $documentation: "An object instantiation.  Derives from a function call since it has exactly the same properties"
        }, AST_Call);

        var AST_Seq = DEFNODE("Seq", "car cdr", {
            $documentation: "A sequence expression (two comma-separated expressions)",
            $propdoc: {
                car: "[AST_Node] first element in sequence",
                cdr: "[AST_Node] second element in sequence"
            },
            $cons: function (x, y) {
                var seq = new AST_Seq(x);
                seq.car = x;
                seq.cdr = y;
                return seq;
            },
            $from_array: function (array) {
                if (array.length == 0) return null;
                if (array.length == 1) return array[0].clone();
                var list = null;
                for (var i = array.length; --i >= 0;) {
                    list = AST_Seq.cons(array[i], list);
                }
                var p = list;
                while (p) {
                    if (p.cdr && !p.cdr.cdr) {
                        p.cdr = p.cdr.car;
                        break;
                    }
                    p = p.cdr;
                }
                return list;
            },
            to_array: function () {
                var p = this, a = [];
                while (p) {
                    a.push(p.car);
                    if (p.cdr && !(p.cdr instanceof AST_Seq)) {
                        a.push(p.cdr);
                        break;
                    }
                    p = p.cdr;
                }
                return a;
            },
            add: function (node) {
                var p = this;
                while (p) {
                    if (!(p.cdr instanceof AST_Seq)) {
                        var cell = AST_Seq.cons(p.cdr, node);
                        return p.cdr = cell;
                    }
                    p = p.cdr;
                }
            },
            _walk: function (visitor) {
                return visitor._visit(this, function () {
                    this.car._walk(visitor);
                    if (this.cdr) this.cdr._walk(visitor);
                });
            }
        });

        var AST_PropAccess = DEFNODE("PropAccess", "expression property", {
            $documentation: "Base class for property access expressions, i.e. `a.foo` or `a[\"foo\"]`",
            $propdoc: {
                expression: "[AST_Node] the “container” expression",
                property: "[AST_Node|string] the property to access.  For AST_Dot this is always a plain string, while for AST_Sub it's an arbitrary AST_Node"
            }
        });

        var AST_Dot = DEFNODE("Dot", null, {
            $documentation: "A dotted property access expression",
            _walk: function (visitor) {
                return visitor._visit(this, function () {
                    this.expression._walk(visitor);
                });
            }
        }, AST_PropAccess);

        var AST_Sub = DEFNODE("Sub", null, {
            $documentation: "Index-style property access, i.e. `a[\"foo\"]`",
            _walk: function (visitor) {
                return visitor._visit(this, function () {
                    this.expression._walk(visitor);
                    this.property._walk(visitor);
                });
            }
        }, AST_PropAccess);

        var AST_Unary = DEFNODE("Unary", "operator expression", {
            $documentation: "Base class for unary expressions",
            $propdoc: {
                operator: "[string] the operator",
                expression: "[AST_Node] expression that this unary operator applies to"
            },
            _walk: function (visitor) {
                return visitor._visit(this, function () {
                    this.expression._walk(visitor);
                });
            }
        });

        var AST_UnaryPrefix = DEFNODE("UnaryPrefix", null, {
            $documentation: "Unary prefix expression, i.e. `typeof i` or `++i`"
        }, AST_Unary);

        var AST_UnaryPostfix = DEFNODE("UnaryPostfix", null, {
            $documentation: "Unary postfix expression, i.e. `i++`"
        }, AST_Unary);

        var AST_Binary = DEFNODE("Binary", "left operator right", {
            $documentation: "Binary expression, i.e. `a + b`",
            $propdoc: {
                left: "[AST_Node] left-hand side expression",
                operator: "[string] the operator",
                right: "[AST_Node] right-hand side expression"
            },
            _walk: function (visitor) {
                return visitor._visit(this, function () {
                    this.left._walk(visitor);
                    this.right._walk(visitor);
                });
            }
        });

        var AST_Conditional = DEFNODE("Conditional", "condition consequent alternative", {
            $documentation: "Conditional expression using the ternary operator, i.e. `a ? b : c`",
            $propdoc: {
                condition: "[AST_Node]",
                consequent: "[AST_Node]",
                alternative: "[AST_Node]"
            },
            _walk: function (visitor) {
                return visitor._visit(this, function () {
                    this.condition._walk(visitor);
                    this.consequent._walk(visitor);
                    this.alternative._walk(visitor);
                });
            }
        });

        var AST_Assign = DEFNODE("Assign", null, {
            $documentation: "An assignment expression — `a = b + 5`"
        }, AST_Binary);


        var AST_Array = DEFNODE("Array", "elements", {
            $documentation: "An array literal",
            $propdoc: {
                elements: "[AST_Node*] array of elements"
            },
            _walk: function (visitor) {
                return visitor._visit(this, function () {
                    this.elements.forEach(function (el) {
                        el._walk(visitor);
                    });
                });
            }
        });

        var AST_Object = DEFNODE("Object", "properties", {
            $documentation: "An object literal",
            $propdoc: {
                properties: "[AST_ObjectProperty*] array of properties"
            },
            _walk: function (visitor) {
                return visitor._visit(this, function () {
                    this.properties.forEach(function (prop) {
                        prop._walk(visitor);
                    });
                });
            }
        });

        var AST_ObjectProperty = DEFNODE("ObjectProperty", "key value", {
            $documentation: "Base class for literal object properties",
            $propdoc: {
                key: "[string] the property name converted to a string for ObjectKeyVal.  For setters and getters this is an arbitrary AST_Node.",
                value: "[AST_Node] property value.  For setters and getters this is an AST_Function."
            },
            _walk: function (visitor) {
                return visitor._visit(this, function () {
                    this.value._walk(visitor);
                });
            }
        });

        var AST_ObjectKeyVal = DEFNODE("ObjectKeyVal", null, {
            $documentation: "A key: value object property"
        }, AST_ObjectProperty);

        var AST_ObjectSetter = DEFNODE("ObjectSetter", null, {
            $documentation: "An object setter property"
        }, AST_ObjectProperty);

        var AST_ObjectGetter = DEFNODE("ObjectGetter", null, {
            $documentation: "An object getter property"
        }, AST_ObjectProperty);

        var AST_Symbol = DEFNODE("Symbol", "scope name thedef", {
            $propdoc: {
                name: "[string] name of this symbol",
                scope: "[AST_Scope/S] the current scope (not necessarily the definition scope)",
                thedef: "[SymbolDef/S] the definition of this symbol"
            },
            $documentation: "Base class for all symbols"
        });

        var AST_SymbolAccessor = DEFNODE("SymbolAccessor", null, {
            $documentation: "The name of a property accessor (setter/getter function)"
        }, AST_Symbol);

        var AST_SymbolDeclaration = DEFNODE("SymbolDeclaration", "init", {
            $documentation: "A declaration symbol (symbol in var/const, function name or argument, symbol in catch)",
            $propdoc: {
                init: "[AST_Node*/S] array of initializers for this declaration."
            }
        }, AST_Symbol);

        var AST_SymbolVar = DEFNODE("SymbolVar", null, {
            $documentation: "Symbol defining a variable"
        }, AST_SymbolDeclaration);

        var AST_SymbolConst = DEFNODE("SymbolConst", null, {
            $documentation: "A constant declaration"
        }, AST_SymbolDeclaration);

        var AST_SymbolFunarg = DEFNODE("SymbolFunarg", null, {
            $documentation: "Symbol naming a function argument"
        }, AST_SymbolVar);

        var AST_SymbolDefun = DEFNODE("SymbolDefun", null, {
            $documentation: "Symbol defining a function"
        }, AST_SymbolDeclaration);

        var AST_SymbolLambda = DEFNODE("SymbolLambda", null, {
            $documentation: "Symbol naming a function expression"
        }, AST_SymbolDeclaration);

        var AST_SymbolCatch = DEFNODE("SymbolCatch", null, {
            $documentation: "Symbol naming the exception in catch"
        }, AST_SymbolDeclaration);

        var AST_Label = DEFNODE("Label", "references", {
            $documentation: "Symbol naming a label (declaration)",
            $propdoc: {
                references: "[AST_LoopControl*] a list of nodes referring to this label"
            },
            initialize: function () {
                this.references = [];
                this.thedef = this;
            }
        }, AST_Symbol);

        var AST_SymbolRef = DEFNODE("SymbolRef", null, {
            $documentation: "Reference to some symbol (not definition/declaration)"
        }, AST_Symbol);

        var AST_LabelRef = DEFNODE("LabelRef", null, {
            $documentation: "Reference to a label symbol"
        }, AST_Symbol);

        var AST_This = DEFNODE("This", null, {
            $documentation: "The `this` symbol"
        }, AST_Symbol);

        var AST_Constant = DEFNODE("Constant", null, {
            $documentation: "Base class for all constants",
            getValue: function () {
                return this.value;
            }
        });

        var AST_String = DEFNODE("String", "value", {
            $documentation: "A string literal",
            $propdoc: {
                value: "[string] the contents of this string"
            }
        }, AST_Constant);

        var AST_Number = DEFNODE("Number", "value", {
            $documentation: "A number literal",
            $propdoc: {
                value: "[number] the numeric value"
            }
        }, AST_Constant);

        var AST_RegExp = DEFNODE("RegExp", "value", {
            $documentation: "A regexp literal",
            $propdoc: {
                value: "[RegExp] the actual regexp"
            }
        }, AST_Constant);

        var AST_Atom = DEFNODE("Atom", null, {
            $documentation: "Base class for atoms"
        }, AST_Constant);

        var AST_Null = DEFNODE("Null", null, {
            $documentation: "The `null` atom",
            value: null
        }, AST_Atom);

        var AST_NaN = DEFNODE("NaN", null, {
            $documentation: "The impossible value",
            value: 0 / 0
        }, AST_Atom);

        var AST_Undefined = DEFNODE("Undefined", null, {
            $documentation: "The `undefined` value",
            value: (function () { }())
        }, AST_Atom);

        var AST_Hole = DEFNODE("Hole", null, {
            $documentation: "A hole in an array",
            value: (function () { }())
        }, AST_Atom);

        var AST_Infinity = DEFNODE("Infinity", null, {
            $documentation: "The `Infinity` value",
            value: 1 / 0
        }, AST_Atom);

        var AST_Boolean = DEFNODE("Boolean", null, {
            $documentation: "Base class for booleans"
        }, AST_Atom);

        var AST_False = DEFNODE("False", null, {
            $documentation: "The `false` atom",
            value: false
        }, AST_Boolean);

        var AST_True = DEFNODE("True", null, {
            $documentation: "The `true` atom",
            value: true
        }, AST_Boolean);


        function TreeWalker(callback) {
            this.visit = callback;
            this.stack = [];
        };
        TreeWalker.prototype = {
            _visit: function (node, descend) {
                this.stack.push(node);
                var ret = this.visit(node, descend ? function () {
                    descend.call(node);
                } : noop);
                if (!ret && descend) {
                    descend.call(node);
                }
                this.stack.pop();
                return ret;
            },
            parent: function (n) {
                return this.stack[this.stack.length - 2 - (n || 0)];
            },
            push: function (node) {
                this.stack.push(node);
            },
            pop: function () {
                return this.stack.pop();
            },
            self: function () {
                return this.stack[this.stack.length - 1];
            },
            find_parent: function (type) {
                var stack = this.stack;
                for (var i = stack.length; --i >= 0;) {
                    var x = stack[i];
                    if (x instanceof type) return x;
                }
            },
            has_directive: function (type) {
                return this.find_parent(AST_Scope).has_directive(type);
            },
            in_boolean_context: function () {
                var stack = this.stack;
                var i = stack.length, self = stack[--i];
                while (i > 0) {
                    var p = stack[--i];
                    if ((p instanceof AST_If && p.condition === self) ||
                        (p instanceof AST_Conditional && p.condition === self) ||
                        (p instanceof AST_DWLoop && p.condition === self) ||
                        (p instanceof AST_For && p.condition === self) ||
                        (p instanceof AST_UnaryPrefix && p.operator == "!" && p.expression === self)) {
                        return true;
                    }
                    if (!(p instanceof AST_Binary && (p.operator == "&&" || p.operator == "||")))
                        return false;
                    self = p;
                }
            },
            loopcontrol_target: function (label) {
                var stack = this.stack;
                if (label) for (var i = stack.length; --i >= 0;) {
                    var x = stack[i];
                    if (x instanceof AST_LabeledStatement && x.label.name == label.name) {
                        return x.body;
                    }
                } else for (var i = stack.length; --i >= 0;) {
                    var x = stack[i];
                    if (x instanceof AST_Switch || x instanceof AST_IterationStatement)
                        return x;
                }
            }
        };

        "use strict";

        var KEYWORDS = 'break case catch const continue debugger default delete do else finally for function if in instanceof new return switch throw try typeof var void while with';
        var KEYWORDS_ATOM = 'false null true';
        var RESERVED_WORDS = 'abstract boolean byte char class double enum export extends final float goto implements import int interface long native package private protected public short static super synchronized this throws transient volatile yield'
            + " " + KEYWORDS_ATOM + " " + KEYWORDS;
        var KEYWORDS_BEFORE_EXPRESSION = 'return new delete throw else case';

        KEYWORDS = makePredicate(KEYWORDS);
        RESERVED_WORDS = makePredicate(RESERVED_WORDS);
        KEYWORDS_BEFORE_EXPRESSION = makePredicate(KEYWORDS_BEFORE_EXPRESSION);
        KEYWORDS_ATOM = makePredicate(KEYWORDS_ATOM);

        var OPERATOR_CHARS = makePredicate(characters("+-*&%=<>!?|~^"));

        var RE_HEX_NUMBER = /^0x[0-9a-f]+$/i;
        var RE_OCT_NUMBER = /^0[0-7]+$/;
        var RE_DEC_NUMBER = /^\d*\.?\d*(?:e[+-]?\d*(?:\d\.?|\.?\d)\d*)?$/i;

        var OPERATORS = makePredicate([
            "in",
            "instanceof",
            "typeof",
            "new",
            "void",
            "delete",
            "++",
            "--",
            "+",
            "-",
            "!",
            "~",
            "&",
            "|",
            "^",
            "*",
            "/",
            "%",
            ">>",
            "<<",
            ">>>",
            "<",
            ">",
            "<=",
            ">=",
            "==",
            "===",
            "!=",
            "!==",
            "?",
            "=",
            "+=",
            "-=",
            "/=",
            "*=",
            "%=",
            ">>=",
            "<<=",
            ">>>=",
            "|=",
            "^=",
            "&=",
            "&&",
            "||"
        ]);

        var WHITESPACE_CHARS = makePredicate(characters(" \u00a0\n\r\t\f\u000b\u200b\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000"));

        var PUNC_BEFORE_EXPRESSION = makePredicate(characters("[{(,.;:"));

        var PUNC_CHARS = makePredicate(characters("[]{}(),;:"));

        var REGEXP_MODIFIERS = makePredicate(characters("gmsiy"));


        var UNICODE = {
            letter: new RegExp("[\\u0041-\\u005A\\u0061-\\u007A\\u00AA\\u00B5\\u00BA\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02C1\\u02C6-\\u02D1\\u02E0-\\u02E4\\u02EC\\u02EE\\u0370-\\u0374\\u0376\\u0377\\u037A-\\u037D\\u0386\\u0388-\\u038A\\u038C\\u038E-\\u03A1\\u03A3-\\u03F5\\u03F7-\\u0481\\u048A-\\u0523\\u0531-\\u0556\\u0559\\u0561-\\u0587\\u05D0-\\u05EA\\u05F0-\\u05F2\\u0621-\\u064A\\u066E\\u066F\\u0671-\\u06D3\\u06D5\\u06E5\\u06E6\\u06EE\\u06EF\\u06FA-\\u06FC\\u06FF\\u0710\\u0712-\\u072F\\u074D-\\u07A5\\u07B1\\u07CA-\\u07EA\\u07F4\\u07F5\\u07FA\\u0904-\\u0939\\u093D\\u0950\\u0958-\\u0961\\u0971\\u0972\\u097B-\\u097F\\u0985-\\u098C\\u098F\\u0990\\u0993-\\u09A8\\u09AA-\\u09B0\\u09B2\\u09B6-\\u09B9\\u09BD\\u09CE\\u09DC\\u09DD\\u09DF-\\u09E1\\u09F0\\u09F1\\u0A05-\\u0A0A\\u0A0F\\u0A10\\u0A13-\\u0A28\\u0A2A-\\u0A30\\u0A32\\u0A33\\u0A35\\u0A36\\u0A38\\u0A39\\u0A59-\\u0A5C\\u0A5E\\u0A72-\\u0A74\\u0A85-\\u0A8D\\u0A8F-\\u0A91\\u0A93-\\u0AA8\\u0AAA-\\u0AB0\\u0AB2\\u0AB3\\u0AB5-\\u0AB9\\u0ABD\\u0AD0\\u0AE0\\u0AE1\\u0B05-\\u0B0C\\u0B0F\\u0B10\\u0B13-\\u0B28\\u0B2A-\\u0B30\\u0B32\\u0B33\\u0B35-\\u0B39\\u0B3D\\u0B5C\\u0B5D\\u0B5F-\\u0B61\\u0B71\\u0B83\\u0B85-\\u0B8A\\u0B8E-\\u0B90\\u0B92-\\u0B95\\u0B99\\u0B9A\\u0B9C\\u0B9E\\u0B9F\\u0BA3\\u0BA4\\u0BA8-\\u0BAA\\u0BAE-\\u0BB9\\u0BD0\\u0C05-\\u0C0C\\u0C0E-\\u0C10\\u0C12-\\u0C28\\u0C2A-\\u0C33\\u0C35-\\u0C39\\u0C3D\\u0C58\\u0C59\\u0C60\\u0C61\\u0C85-\\u0C8C\\u0C8E-\\u0C90\\u0C92-\\u0CA8\\u0CAA-\\u0CB3\\u0CB5-\\u0CB9\\u0CBD\\u0CDE\\u0CE0\\u0CE1\\u0D05-\\u0D0C\\u0D0E-\\u0D10\\u0D12-\\u0D28\\u0D2A-\\u0D39\\u0D3D\\u0D60\\u0D61\\u0D7A-\\u0D7F\\u0D85-\\u0D96\\u0D9A-\\u0DB1\\u0DB3-\\u0DBB\\u0DBD\\u0DC0-\\u0DC6\\u0E01-\\u0E30\\u0E32\\u0E33\\u0E40-\\u0E46\\u0E81\\u0E82\\u0E84\\u0E87\\u0E88\\u0E8A\\u0E8D\\u0E94-\\u0E97\\u0E99-\\u0E9F\\u0EA1-\\u0EA3\\u0EA5\\u0EA7\\u0EAA\\u0EAB\\u0EAD-\\u0EB0\\u0EB2\\u0EB3\\u0EBD\\u0EC0-\\u0EC4\\u0EC6\\u0EDC\\u0EDD\\u0F00\\u0F40-\\u0F47\\u0F49-\\u0F6C\\u0F88-\\u0F8B\\u1000-\\u102A\\u103F\\u1050-\\u1055\\u105A-\\u105D\\u1061\\u1065\\u1066\\u106E-\\u1070\\u1075-\\u1081\\u108E\\u10A0-\\u10C5\\u10D0-\\u10FA\\u10FC\\u1100-\\u1159\\u115F-\\u11A2\\u11A8-\\u11F9\\u1200-\\u1248\\u124A-\\u124D\\u1250-\\u1256\\u1258\\u125A-\\u125D\\u1260-\\u1288\\u128A-\\u128D\\u1290-\\u12B0\\u12B2-\\u12B5\\u12B8-\\u12BE\\u12C0\\u12C2-\\u12C5\\u12C8-\\u12D6\\u12D8-\\u1310\\u1312-\\u1315\\u1318-\\u135A\\u1380-\\u138F\\u13A0-\\u13F4\\u1401-\\u166C\\u166F-\\u1676\\u1681-\\u169A\\u16A0-\\u16EA\\u1700-\\u170C\\u170E-\\u1711\\u1720-\\u1731\\u1740-\\u1751\\u1760-\\u176C\\u176E-\\u1770\\u1780-\\u17B3\\u17D7\\u17DC\\u1820-\\u1877\\u1880-\\u18A8\\u18AA\\u1900-\\u191C\\u1950-\\u196D\\u1970-\\u1974\\u1980-\\u19A9\\u19C1-\\u19C7\\u1A00-\\u1A16\\u1B05-\\u1B33\\u1B45-\\u1B4B\\u1B83-\\u1BA0\\u1BAE\\u1BAF\\u1C00-\\u1C23\\u1C4D-\\u1C4F\\u1C5A-\\u1C7D\\u1D00-\\u1DBF\\u1E00-\\u1F15\\u1F18-\\u1F1D\\u1F20-\\u1F45\\u1F48-\\u1F4D\\u1F50-\\u1F57\\u1F59\\u1F5B\\u1F5D\\u1F5F-\\u1F7D\\u1F80-\\u1FB4\\u1FB6-\\u1FBC\\u1FBE\\u1FC2-\\u1FC4\\u1FC6-\\u1FCC\\u1FD0-\\u1FD3\\u1FD6-\\u1FDB\\u1FE0-\\u1FEC\\u1FF2-\\u1FF4\\u1FF6-\\u1FFC\\u2071\\u207F\\u2090-\\u2094\\u2102\\u2107\\u210A-\\u2113\\u2115\\u2119-\\u211D\\u2124\\u2126\\u2128\\u212A-\\u212D\\u212F-\\u2139\\u213C-\\u213F\\u2145-\\u2149\\u214E\\u2183\\u2184\\u2C00-\\u2C2E\\u2C30-\\u2C5E\\u2C60-\\u2C6F\\u2C71-\\u2C7D\\u2C80-\\u2CE4\\u2D00-\\u2D25\\u2D30-\\u2D65\\u2D6F\\u2D80-\\u2D96\\u2DA0-\\u2DA6\\u2DA8-\\u2DAE\\u2DB0-\\u2DB6\\u2DB8-\\u2DBE\\u2DC0-\\u2DC6\\u2DC8-\\u2DCE\\u2DD0-\\u2DD6\\u2DD8-\\u2DDE\\u2E2F\\u3005\\u3006\\u3031-\\u3035\\u303B\\u303C\\u3041-\\u3096\\u309D-\\u309F\\u30A1-\\u30FA\\u30FC-\\u30FF\\u3105-\\u312D\\u3131-\\u318E\\u31A0-\\u31B7\\u31F0-\\u31FF\\u3400\\u4DB5\\u4E00\\u9FC3\\uA000-\\uA48C\\uA500-\\uA60C\\uA610-\\uA61F\\uA62A\\uA62B\\uA640-\\uA65F\\uA662-\\uA66E\\uA67F-\\uA697\\uA717-\\uA71F\\uA722-\\uA788\\uA78B\\uA78C\\uA7FB-\\uA801\\uA803-\\uA805\\uA807-\\uA80A\\uA80C-\\uA822\\uA840-\\uA873\\uA882-\\uA8B3\\uA90A-\\uA925\\uA930-\\uA946\\uAA00-\\uAA28\\uAA40-\\uAA42\\uAA44-\\uAA4B\\uAC00\\uD7A3\\uF900-\\uFA2D\\uFA30-\\uFA6A\\uFA70-\\uFAD9\\uFB00-\\uFB06\\uFB13-\\uFB17\\uFB1D\\uFB1F-\\uFB28\\uFB2A-\\uFB36\\uFB38-\\uFB3C\\uFB3E\\uFB40\\uFB41\\uFB43\\uFB44\\uFB46-\\uFBB1\\uFBD3-\\uFD3D\\uFD50-\\uFD8F\\uFD92-\\uFDC7\\uFDF0-\\uFDFB\\uFE70-\\uFE74\\uFE76-\\uFEFC\\uFF21-\\uFF3A\\uFF41-\\uFF5A\\uFF66-\\uFFBE\\uFFC2-\\uFFC7\\uFFCA-\\uFFCF\\uFFD2-\\uFFD7\\uFFDA-\\uFFDC]"),
            non_spacing_mark: new RegExp("[\\u0300-\\u036F\\u0483-\\u0487\\u0591-\\u05BD\\u05BF\\u05C1\\u05C2\\u05C4\\u05C5\\u05C7\\u0610-\\u061A\\u064B-\\u065E\\u0670\\u06D6-\\u06DC\\u06DF-\\u06E4\\u06E7\\u06E8\\u06EA-\\u06ED\\u0711\\u0730-\\u074A\\u07A6-\\u07B0\\u07EB-\\u07F3\\u0816-\\u0819\\u081B-\\u0823\\u0825-\\u0827\\u0829-\\u082D\\u0900-\\u0902\\u093C\\u0941-\\u0948\\u094D\\u0951-\\u0955\\u0962\\u0963\\u0981\\u09BC\\u09C1-\\u09C4\\u09CD\\u09E2\\u09E3\\u0A01\\u0A02\\u0A3C\\u0A41\\u0A42\\u0A47\\u0A48\\u0A4B-\\u0A4D\\u0A51\\u0A70\\u0A71\\u0A75\\u0A81\\u0A82\\u0ABC\\u0AC1-\\u0AC5\\u0AC7\\u0AC8\\u0ACD\\u0AE2\\u0AE3\\u0B01\\u0B3C\\u0B3F\\u0B41-\\u0B44\\u0B4D\\u0B56\\u0B62\\u0B63\\u0B82\\u0BC0\\u0BCD\\u0C3E-\\u0C40\\u0C46-\\u0C48\\u0C4A-\\u0C4D\\u0C55\\u0C56\\u0C62\\u0C63\\u0CBC\\u0CBF\\u0CC6\\u0CCC\\u0CCD\\u0CE2\\u0CE3\\u0D41-\\u0D44\\u0D4D\\u0D62\\u0D63\\u0DCA\\u0DD2-\\u0DD4\\u0DD6\\u0E31\\u0E34-\\u0E3A\\u0E47-\\u0E4E\\u0EB1\\u0EB4-\\u0EB9\\u0EBB\\u0EBC\\u0EC8-\\u0ECD\\u0F18\\u0F19\\u0F35\\u0F37\\u0F39\\u0F71-\\u0F7E\\u0F80-\\u0F84\\u0F86\\u0F87\\u0F90-\\u0F97\\u0F99-\\u0FBC\\u0FC6\\u102D-\\u1030\\u1032-\\u1037\\u1039\\u103A\\u103D\\u103E\\u1058\\u1059\\u105E-\\u1060\\u1071-\\u1074\\u1082\\u1085\\u1086\\u108D\\u109D\\u135F\\u1712-\\u1714\\u1732-\\u1734\\u1752\\u1753\\u1772\\u1773\\u17B7-\\u17BD\\u17C6\\u17C9-\\u17D3\\u17DD\\u180B-\\u180D\\u18A9\\u1920-\\u1922\\u1927\\u1928\\u1932\\u1939-\\u193B\\u1A17\\u1A18\\u1A56\\u1A58-\\u1A5E\\u1A60\\u1A62\\u1A65-\\u1A6C\\u1A73-\\u1A7C\\u1A7F\\u1B00-\\u1B03\\u1B34\\u1B36-\\u1B3A\\u1B3C\\u1B42\\u1B6B-\\u1B73\\u1B80\\u1B81\\u1BA2-\\u1BA5\\u1BA8\\u1BA9\\u1C2C-\\u1C33\\u1C36\\u1C37\\u1CD0-\\u1CD2\\u1CD4-\\u1CE0\\u1CE2-\\u1CE8\\u1CED\\u1DC0-\\u1DE6\\u1DFD-\\u1DFF\\u20D0-\\u20DC\\u20E1\\u20E5-\\u20F0\\u2CEF-\\u2CF1\\u2DE0-\\u2DFF\\u302A-\\u302F\\u3099\\u309A\\uA66F\\uA67C\\uA67D\\uA6F0\\uA6F1\\uA802\\uA806\\uA80B\\uA825\\uA826\\uA8C4\\uA8E0-\\uA8F1\\uA926-\\uA92D\\uA947-\\uA951\\uA980-\\uA982\\uA9B3\\uA9B6-\\uA9B9\\uA9BC\\uAA29-\\uAA2E\\uAA31\\uAA32\\uAA35\\uAA36\\uAA43\\uAA4C\\uAAB0\\uAAB2-\\uAAB4\\uAAB7\\uAAB8\\uAABE\\uAABF\\uAAC1\\uABE5\\uABE8\\uABED\\uFB1E\\uFE00-\\uFE0F\\uFE20-\\uFE26]"),
            space_combining_mark: new RegExp("[\\u0903\\u093E-\\u0940\\u0949-\\u094C\\u094E\\u0982\\u0983\\u09BE-\\u09C0\\u09C7\\u09C8\\u09CB\\u09CC\\u09D7\\u0A03\\u0A3E-\\u0A40\\u0A83\\u0ABE-\\u0AC0\\u0AC9\\u0ACB\\u0ACC\\u0B02\\u0B03\\u0B3E\\u0B40\\u0B47\\u0B48\\u0B4B\\u0B4C\\u0B57\\u0BBE\\u0BBF\\u0BC1\\u0BC2\\u0BC6-\\u0BC8\\u0BCA-\\u0BCC\\u0BD7\\u0C01-\\u0C03\\u0C41-\\u0C44\\u0C82\\u0C83\\u0CBE\\u0CC0-\\u0CC4\\u0CC7\\u0CC8\\u0CCA\\u0CCB\\u0CD5\\u0CD6\\u0D02\\u0D03\\u0D3E-\\u0D40\\u0D46-\\u0D48\\u0D4A-\\u0D4C\\u0D57\\u0D82\\u0D83\\u0DCF-\\u0DD1\\u0DD8-\\u0DDF\\u0DF2\\u0DF3\\u0F3E\\u0F3F\\u0F7F\\u102B\\u102C\\u1031\\u1038\\u103B\\u103C\\u1056\\u1057\\u1062-\\u1064\\u1067-\\u106D\\u1083\\u1084\\u1087-\\u108C\\u108F\\u109A-\\u109C\\u17B6\\u17BE-\\u17C5\\u17C7\\u17C8\\u1923-\\u1926\\u1929-\\u192B\\u1930\\u1931\\u1933-\\u1938\\u19B0-\\u19C0\\u19C8\\u19C9\\u1A19-\\u1A1B\\u1A55\\u1A57\\u1A61\\u1A63\\u1A64\\u1A6D-\\u1A72\\u1B04\\u1B35\\u1B3B\\u1B3D-\\u1B41\\u1B43\\u1B44\\u1B82\\u1BA1\\u1BA6\\u1BA7\\u1BAA\\u1C24-\\u1C2B\\u1C34\\u1C35\\u1CE1\\u1CF2\\uA823\\uA824\\uA827\\uA880\\uA881\\uA8B4-\\uA8C3\\uA952\\uA953\\uA983\\uA9B4\\uA9B5\\uA9BA\\uA9BB\\uA9BD-\\uA9C0\\uAA2F\\uAA30\\uAA33\\uAA34\\uAA4D\\uAA7B\\uABE3\\uABE4\\uABE6\\uABE7\\uABE9\\uABEA\\uABEC]"),
            connector_punctuation: new RegExp("[\\u005F\\u203F\\u2040\\u2054\\uFE33\\uFE34\\uFE4D-\\uFE4F\\uFF3F]")
        };

        function is_letter(code) {
            return (code >= 97 && code <= 122)
                || (code >= 65 && code <= 90)
                || (code >= 0xaa && UNICODE.letter.test(String.fromCharCode(code)));
        };

        function is_digit(code) {
            return code >= 48 && code <= 57;
        };

        function is_alphanumeric_char(code) {
            return is_digit(code) || is_letter(code);
        };

        function is_unicode_combining_mark(ch) {
            return UNICODE.non_spacing_mark.test(ch) || UNICODE.space_combining_mark.test(ch);
        };

        function is_unicode_connector_punctuation(ch) {
            return UNICODE.connector_punctuation.test(ch);
        };

        function is_identifier(name) {
            return !RESERVED_WORDS(name) && /^[a-z_$][a-z0-9_$]*$/i.test(name);
        };

        function is_identifier_start(code) {
            return code == 36 || code == 95 || is_letter(code);
        };

        function is_identifier_char(ch) {
            var code = ch.charCodeAt(0);
            return is_identifier_start(code)
                || is_digit(code)
                || code == 8204
                || code == 8205
                || is_unicode_combining_mark(ch)
                || is_unicode_connector_punctuation(ch)
            ;
        };

        function is_identifier_string(str) {
            return /^[a-z_$][a-z0-9_$]*$/i.test(str);
        };

        function parse_js_number(num) {
            if (RE_HEX_NUMBER.test(num)) {
                return parseInt(num.substr(2), 16);
            } else if (RE_OCT_NUMBER.test(num)) {
                return parseInt(num.substr(1), 8);
            } else if (RE_DEC_NUMBER.test(num)) {
                return parseFloat(num);
            }
        };

        function JS_Parse_Error(message, line, col, pos) {
            this.message = message;
            this.line = line;
            this.col = col;
            this.pos = pos;
            this.stack = new Error().stack;
        };

        JS_Parse_Error.prototype.toString = function () {
            return this.message + " (line: " + this.line + ", col: " + this.col + ", pos: " + this.pos + ")" + "\n\n" + this.stack;
        };

        function js_error(message, filename, line, col, pos) {
            throw new JS_Parse_Error(message, line, col, pos);
        };

        function is_token(token, type, val) {
            return token.type == type && (val == null || token.value == val);
        };

        var EX_EOF = {};

        function tokenizer($TEXT, filename, html5_comments) {

            var S = {
                text: $TEXT.replace(/\r\n?|[\n\u2028\u2029]/g, "\n").replace(/\uFEFF/g, ''),
                filename: filename,
                pos: 0,
                tokpos: 0,
                line: 1,
                tokline: 0,
                col: 0,
                tokcol: 0,
                newline_before: false,
                regex_allowed: false,
                comments_before: []
            };

            function peek() { return S.text.charAt(S.pos); };

            function next(signal_eof, in_string) {
                var ch = S.text.charAt(S.pos++);
                if (signal_eof && !ch)
                    throw EX_EOF;
                if (ch == "\n") {
                    S.newline_before = S.newline_before || !in_string;
                    ++S.line;
                    S.col = 0;
                } else {
                    ++S.col;
                }
                return ch;
            };

            function forward(i) {
                while (i-- > 0) next();
            };

            function looking_at(str) {
                return S.text.substr(S.pos, str.length) == str;
            };

            function find(what, signal_eof) {
                var pos = S.text.indexOf(what, S.pos);
                if (signal_eof && pos == -1) throw EX_EOF;
                return pos;
            };

            function start_token() {
                S.tokline = S.line;
                S.tokcol = S.col;
                S.tokpos = S.pos;
            };

            var prev_was_dot = false;
            function token(type, value, is_comment) {
                S.regex_allowed = ((type == "operator" && !UNARY_POSTFIX(value)) ||
                                   (type == "keyword" && KEYWORDS_BEFORE_EXPRESSION(value)) ||
                                   (type == "punc" && PUNC_BEFORE_EXPRESSION(value)));
                prev_was_dot = (type == "punc" && value == ".");
                var ret = {
                    type: type,
                    value: value,
                    line: S.tokline,
                    col: S.tokcol,
                    pos: S.tokpos,
                    endpos: S.pos,
                    nlb: S.newline_before,
                    file: filename
                };
                if (!is_comment) {
                    ret.comments_before = S.comments_before;
                    S.comments_before = [];
                    for (var i = 0, len = ret.comments_before.length; i < len; i++) {
                        ret.nlb = ret.nlb || ret.comments_before[i].nlb;
                    }
                }
                S.newline_before = false;
                return new AST_Token(ret);
            };

            function skip_whitespace() {
                while (WHITESPACE_CHARS(peek()))
                    next();
            };

            function read_while(pred) {
                var ret = "", ch, i = 0;
                while ((ch = peek()) && pred(ch, i++))
                    ret += next();
                return ret;
            };

            function parse_error(err) {
                js_error(err, filename, S.tokline, S.tokcol, S.tokpos);
            };

            function read_num(prefix) {
                var has_e = false, after_e = false, has_x = false, has_dot = prefix == ".";
                var num = read_while(function (ch, i) {
                    var code = ch.charCodeAt(0);
                    switch (code) {
                        case 120: case 88:
                            return has_x ? false : (has_x = true);
                        case 101: case 69:
                            return has_x ? true : has_e ? false : (has_e = after_e = true);
                        case 45:
                            return after_e || (i == 0 && !prefix);
                        case 43:
                            return after_e;
                        case (after_e = false, 46):
                            return (!has_dot && !has_x && !has_e) ? (has_dot = true) : false;
                    }
                    return is_alphanumeric_char(code);
                });
                if (prefix) num = prefix + num;
                var valid = parse_js_number(num);
                if (!isNaN(valid)) {
                    return token("num", valid);
                } else {
                    parse_error("Invalid syntax: " + num);
                }
            };

            function read_escaped_char(in_string) {
                var ch = next(true, in_string);
                switch (ch.charCodeAt(0)) {
                    case 110: return "\n";
                    case 114: return "\r";
                    case 116: return "\t";
                    case 98: return "\b";
                    case 118: return "\u000b";
                    case 102: return "\f";
                    case 48: return "\0";
                    case 120: return String.fromCharCode(hex_bytes(2));
                    case 117: return String.fromCharCode(hex_bytes(4));
                    case 10: return "";
                    default: return ch;
                }
            };

            function hex_bytes(n) {
                var num = 0;
                for (; n > 0; --n) {
                    var digit = parseInt(next(true), 16);
                    if (isNaN(digit))
                        parse_error("Invalid hex-character pattern in string");
                    num = (num << 4) | digit;
                }
                return num;
            };

            var read_string = with_eof_error("Unterminated string constant", function () {
                var quote = next(), ret = "";
                for (; ;) {
                    var ch = next(true);
                    if (ch == "\\") {
                        var octal_len = 0, first = null;
                        ch = read_while(function (ch) {
                            if (ch >= "0" && ch <= "7") {
                                if (!first) {
                                    first = ch;
                                    return ++octal_len;
                                }
                                else if (first <= "3" && octal_len <= 2) return ++octal_len;
                                else if (first >= "4" && octal_len <= 1) return ++octal_len;
                            }
                            return false;
                        });
                        if (octal_len > 0) ch = String.fromCharCode(parseInt(ch, 8));
                        else ch = read_escaped_char(true);
                    }
                    else if (ch == quote) break;
                    ret += ch;
                }
                return token("string", ret);
            });

            function skip_line_comment(type) {
                var regex_allowed = S.regex_allowed;
                var i = find("\n"), ret;
                if (i == -1) {
                    ret = S.text.substr(S.pos);
                    S.pos = S.text.length;
                } else {
                    ret = S.text.substring(S.pos, i);
                    S.pos = i;
                }
                S.comments_before.push(token(type, ret, true));
                S.regex_allowed = regex_allowed;
                return next_token();
            };

            var skip_multiline_comment = with_eof_error("Unterminated multiline comment", function () {
                var regex_allowed = S.regex_allowed;
                var i = find("*/", true);
                var text = S.text.substring(S.pos, i);
                var a = text.split("\n"), n = a.length;
                S.pos = i + 2;
                S.line += n - 1;
                if (n > 1) S.col = a[n - 1].length;
                else S.col += a[n - 1].length;
                S.col += 2;
                var nlb = S.newline_before = S.newline_before || text.indexOf("\n") >= 0;
                S.comments_before.push(token("comment2", text, true));
                S.regex_allowed = regex_allowed;
                S.newline_before = nlb;
                return next_token();
            });

            function read_name() {
                var backslash = false, name = "", ch, escaped = false, hex;
                while ((ch = peek()) != null) {
                    if (!backslash) {
                        if (ch == "\\") escaped = backslash = true, next();
                        else if (is_identifier_char(ch)) name += next();
                        else break;
                    }
                    else {
                        if (ch != "u") parse_error("Expecting UnicodeEscapeSequence -- uXXXX");
                        ch = read_escaped_char();
                        if (!is_identifier_char(ch)) parse_error("Unicode char: " + ch.charCodeAt(0) + " is not valid in identifier");
                        name += ch;
                        backslash = false;
                    }
                }
                if (KEYWORDS(name) && escaped) {
                    hex = name.charCodeAt(0).toString(16).toUpperCase();
                    name = "\\u" + "0000".substr(hex.length) + hex + name.slice(1);
                }
                return name;
            };

            var read_regexp = with_eof_error("Unterminated regular expression", function (regexp) {
                var prev_backslash = false, ch, in_class = false;
                while ((ch = next(true))) if (prev_backslash) {
                    regexp += "\\" + ch;
                    prev_backslash = false;
                } else if (ch == "[") {
                    in_class = true;
                    regexp += ch;
                } else if (ch == "]" && in_class) {
                    in_class = false;
                    regexp += ch;
                } else if (ch == "/" && !in_class) {
                    break;
                } else if (ch == "\\") {
                    prev_backslash = true;
                } else {
                    regexp += ch;
                }
                var mods = read_name();
                return token("regexp", new RegExp(regexp, mods));
            });

            function read_operator(prefix) {
                function grow(op) {
                    if (!peek()) return op;
                    var bigger = op + peek();
                    if (OPERATORS(bigger)) {
                        next();
                        return grow(bigger);
                    } else {
                        return op;
                    }
                };
                return token("operator", grow(prefix || next()));
            };

            function handle_slash() {
                next();
                switch (peek()) {
                    case "/":
                        next();
                        return skip_line_comment("comment1");
                    case "*":
                        next();
                        return skip_multiline_comment();
                }
                return S.regex_allowed ? read_regexp("") : read_operator("/");
            };

            function handle_dot() {
                next();
                return is_digit(peek().charCodeAt(0))
                    ? read_num(".")
                    : token("punc", ".");
            };

            function read_word() {
                var word = read_name();
                if (prev_was_dot) return token("name", word);
                return KEYWORDS_ATOM(word) ? token("atom", word)
                    : !KEYWORDS(word) ? token("name", word)
                    : OPERATORS(word) ? token("operator", word)
                    : token("keyword", word);
            };

            function with_eof_error(eof_error, cont) {
                return function (x) {
                    try {
                        return cont(x);
                    } catch (ex) {
                        if (ex === EX_EOF) parse_error(eof_error);
                        else throw ex;
                    }
                };
            };

            function next_token(force_regexp) {
                if (force_regexp != null)
                    return read_regexp(force_regexp);
                skip_whitespace();
                start_token();
                if (html5_comments) {
                    if (looking_at("<!--")) {
                        forward(4);
                        return skip_line_comment("comment3");
                    }
                    if (looking_at("-->") && S.newline_before) {
                        forward(3);
                        return skip_line_comment("comment4");
                    }
                }
                var ch = peek();
                if (!ch) return token("eof");
                var code = ch.charCodeAt(0);
                switch (code) {
                    case 34: case 39: return read_string();
                    case 46: return handle_dot();
                    case 47: return handle_slash();
                }
                if (is_digit(code)) return read_num();
                if (PUNC_CHARS(ch)) return token("punc", next());
                if (OPERATOR_CHARS(ch)) return read_operator();
                if (code == 92 || is_identifier_start(code)) return read_word();
                parse_error("Unexpected character '" + ch + "'");
            };

            next_token.context = function (nc) {
                if (nc) S = nc;
                return S;
            };

            return next_token;

        };


        var UNARY_PREFIX = makePredicate([
            "typeof",
            "void",
            "delete",
            "--",
            "++",
            "!",
            "~",
            "-",
            "+"
        ]);

        var UNARY_POSTFIX = makePredicate(["--", "++"]);

        var ASSIGNMENT = makePredicate(["=", "+=", "-=", "/=", "*=", "%=", ">>=", "<<=", ">>>=", "|=", "^=", "&="]);

        var PRECEDENCE = (function (a, ret) {
            for (var i = 0; i < a.length; ++i) {
                var b = a[i];
                for (var j = 0; j < b.length; ++j) {
                    ret[b[j]] = i + 1;
                }
            }
            return ret;
        })(
            [
                ["||"],
                ["&&"],
                ["|"],
                ["^"],
                ["&"],
                ["==", "===", "!=", "!=="],
                ["<", ">", "<=", ">=", "in", "instanceof"],
                [">>", "<<", ">>>"],
                ["+", "-"],
                ["*", "/", "%"]
            ],
            {}
        );

        var STATEMENTS_WITH_LABELS = array_to_hash(["for", "do", "while", "switch"]);

        var ATOMIC_START_TOKEN = array_to_hash(["atom", "num", "string", "regexp", "name"]);


        function parse($TEXT, options) {

            options = defaults(options, {
                strict: false,
                filename: null,
                toplevel: null,
                expression: false,
                html5_comments: true
            });

            var S = {
                input: (typeof $TEXT == "string"
                                 ? tokenizer($TEXT, options.filename,
                                             options.html5_comments)
                                 : $TEXT),
                token: null,
                prev: null,
                peeked: null,
                in_function: 0,
                in_directives: true,
                in_loop: 0,
                labels: []
            };

            S.token = next();

            function is(type, value) {
                return is_token(S.token, type, value);
            };

            function peek() { return S.peeked || (S.peeked = S.input()); };

            function next() {
                S.prev = S.token;
                if (S.peeked) {
                    S.token = S.peeked;
                    S.peeked = null;
                } else {
                    S.token = S.input();
                }
                S.in_directives = S.in_directives && (
                    S.token.type == "string" || is("punc", ";")
                );
                return S.token;
            };

            function prev() {
                return S.prev;
            };

            function croak(msg, line, col, pos) {
                var ctx = S.input.context();
                js_error(msg,
                         ctx.filename,
                         line != null ? line : ctx.tokline,
                         col != null ? col : ctx.tokcol,
                         pos != null ? pos : ctx.tokpos);
            };

            function token_error(token, msg) {
                croak(msg, token.line, token.col);
            };

            function unexpected(token) {
                if (token == null)
                    token = S.token;
                token_error(token, "Unexpected token: " + token.type + " (" + token.value + ")");
            };

            function expect_token(type, val) {
                if (is(type, val)) {
                    return next();
                }
                token_error(S.token, "Unexpected token " + S.token.type + " «" + S.token.value + "»" + ", expected " + type + " «" + val + "»");
            };

            function expect(punc) { return expect_token("punc", punc); };

            function can_insert_semicolon() {
                return !options.strict && (
                    S.token.nlb || is("eof") || is("punc", "}")
                );
            };

            function semicolon() {
                if (is("punc", ";")) next();
                else if (!can_insert_semicolon()) unexpected();
            };

            function parenthesised() {
                expect("(");
                var exp = expression(true);
                expect(")");
                return exp;
            };

            function embed_tokens(parser) {
                return function () {
                    var start = S.token;
                    var expr = parser();
                    var end = prev();
                    expr.start = start;
                    expr.end = end;
                    return expr;
                };
            };

            function handle_regexp() {
                if (is("operator", "/") || is("operator", "/=")) {
                    S.peeked = null;
                    S.token = S.input(S.token.value.substr(1));
                }
            };

            var statement = embed_tokens(function () {
                var tmp;
                handle_regexp();
                switch (S.token.type) {
                    case "string":
                        var dir = S.in_directives, stat = simple_statement();
                        if (dir && stat.body instanceof AST_String && !is("punc", ","))
                            return new AST_Directive({ value: stat.body.value });
                        return stat;
                    case "num":
                    case "regexp":
                    case "operator":
                    case "atom":
                        return simple_statement();

                    case "name":
                        return is_token(peek(), "punc", ":")
                            ? labeled_statement()
                            : simple_statement();

                    case "punc":
                        switch (S.token.value) {
                            case "{":
                                return new AST_BlockStatement({
                                    start: S.token,
                                    body: block_(),
                                    end: prev()
                                });
                            case "[":
                            case "(":
                                return simple_statement();
                            case ";":
                                next();
                                return new AST_EmptyStatement();
                            default:
                                unexpected();
                        }

                    case "keyword":
                        switch (tmp = S.token.value, next(), tmp) {
                            case "break":
                                return break_cont(AST_Break);

                            case "continue":
                                return break_cont(AST_Continue);

                            case "debugger":
                                semicolon();
                                return new AST_Debugger();

                            case "do":
                                return new AST_Do({
                                    body: in_loop(statement),
                                    condition: (expect_token("keyword", "while"), tmp = parenthesised(), semicolon(), tmp)
                                });

                            case "while":
                                return new AST_While({
                                    condition: parenthesised(),
                                    body: in_loop(statement)
                                });

                            case "for":
                                return for_();

                            case "function":
                                return function_(AST_Defun);

                            case "if":
                                return if_();

                            case "return":
                                if (S.in_function == 0)
                                    croak("'return' outside of function");
                                return new AST_Return({
                                    value: (is("punc", ";")
                                             ? (next(), null)
                                             : can_insert_semicolon()
                                             ? null
                                             : (tmp = expression(true), semicolon(), tmp))
                                });

                            case "switch":
                                return new AST_Switch({
                                    expression: parenthesised(),
                                    body: in_loop(switch_body_)
                                });

                            case "throw":
                                if (S.token.nlb)
                                    croak("Illegal newline after 'throw'");
                                return new AST_Throw({
                                    value: (tmp = expression(true), semicolon(), tmp)
                                });

                            case "try":
                                return try_();

                            case "var":
                                return tmp = var_(), semicolon(), tmp;

                            case "const":
                                return tmp = const_(), semicolon(), tmp;

                            case "with":
                                return new AST_With({
                                    expression: parenthesised(),
                                    body: statement()
                                });

                            default:
                                unexpected();
                        }
                }
            });

            function labeled_statement() {
                var label = as_symbol(AST_Label);
                if (find_if(function (l) { return l.name == label.name }, S.labels)) {
                    croak("Label " + label.name + " defined twice");
                }
                expect(":");
                S.labels.push(label);
                var stat = statement();
                S.labels.pop();
                if (!(stat instanceof AST_IterationStatement)) {
                    label.references.forEach(function (ref) {
                        if (ref instanceof AST_Continue) {
                            ref = ref.label.start;
                            croak("Continue label `" + label.name + "` refers to non-IterationStatement.",
                                  ref.line, ref.col, ref.pos);
                        }
                    });
                }
                return new AST_LabeledStatement({ body: stat, label: label });
            };

            function simple_statement(tmp) {
                return new AST_SimpleStatement({ body: (tmp = expression(true), semicolon(), tmp) });
            };

            function break_cont(type) {
                var label = null, ldef;
                if (!can_insert_semicolon()) {
                    label = as_symbol(AST_LabelRef, true);
                }
                if (label != null) {
                    ldef = find_if(function (l) { return l.name == label.name }, S.labels);
                    if (!ldef)
                        croak("Undefined label " + label.name);
                    label.thedef = ldef;
                }
                else if (S.in_loop == 0)
                    croak(type.TYPE + " not inside a loop or switch");
                semicolon();
                var stat = new type({ label: label });
                if (ldef) ldef.references.push(stat);
                return stat;
            };

            function for_() {
                expect("(");
                var init = null;
                if (!is("punc", ";")) {
                    init = is("keyword", "var")
                        ? (next(), var_(true))
                        : expression(true, true);
                    if (is("operator", "in")) {
                        if (init instanceof AST_Var && init.definitions.length > 1)
                            croak("Only one variable declaration allowed in for..in loop");
                        next();
                        return for_in(init);
                    }
                }
                return regular_for(init);
            };

            function regular_for(init) {
                expect(";");
                var test = is("punc", ";") ? null : expression(true);
                expect(";");
                var step = is("punc", ")") ? null : expression(true);
                expect(")");
                return new AST_For({
                    init: init,
                    condition: test,
                    step: step,
                    body: in_loop(statement)
                });
            };

            function for_in(init) {
                var lhs = init instanceof AST_Var ? init.definitions[0].name : null;
                var obj = expression(true);
                expect(")");
                return new AST_ForIn({
                    init: init,
                    name: lhs,
                    object: obj,
                    body: in_loop(statement)
                });
            };

            var function_ = function (ctor) {
                var in_statement = ctor === AST_Defun;
                var name = is("name") ? as_symbol(in_statement ? AST_SymbolDefun : AST_SymbolLambda) : null;
                if (in_statement && !name)
                    unexpected();
                expect("(");
                return new ctor({
                    name: name,
                    argnames: (function (first, a) {
                        while (!is("punc", ")")) {
                            if (first) first = false; else expect(",");
                            a.push(as_symbol(AST_SymbolFunarg));
                        }
                        next();
                        return a;
                    })(true, []),
                    body: (function (loop, labels) {
                        ++S.in_function;
                        S.in_directives = true;
                        S.in_loop = 0;
                        S.labels = [];
                        var a = block_();
                        --S.in_function;
                        S.in_loop = loop;
                        S.labels = labels;
                        return a;
                    })(S.in_loop, S.labels)
                });
            };

            function if_() {
                var cond = parenthesised(), body = statement(), belse = null;
                if (is("keyword", "else")) {
                    next();
                    belse = statement();
                }
                return new AST_If({
                    condition: cond,
                    body: body,
                    alternative: belse
                });
            };

            function block_() {
                expect("{");
                var a = [];
                while (!is("punc", "}")) {
                    if (is("eof")) unexpected();
                    a.push(statement());
                }
                next();
                return a;
            };

            function switch_body_() {
                expect("{");
                var a = [], cur = null, branch = null, tmp;
                while (!is("punc", "}")) {
                    if (is("eof")) unexpected();
                    if (is("keyword", "case")) {
                        if (branch) branch.end = prev();
                        cur = [];
                        branch = new AST_Case({
                            start: (tmp = S.token, next(), tmp),
                            expression: expression(true),
                            body: cur
                        });
                        a.push(branch);
                        expect(":");
                    }
                    else if (is("keyword", "default")) {
                        if (branch) branch.end = prev();
                        cur = [];
                        branch = new AST_Default({
                            start: (tmp = S.token, next(), expect(":"), tmp),
                            body: cur
                        });
                        a.push(branch);
                    }
                    else {
                        if (!cur) unexpected();
                        cur.push(statement());
                    }
                }
                if (branch) branch.end = prev();
                next();
                return a;
            };

            function try_() {
                var body = block_(), bcatch = null, bfinally = null;
                if (is("keyword", "catch")) {
                    var start = S.token;
                    next();
                    expect("(");
                    var name = as_symbol(AST_SymbolCatch);
                    expect(")");
                    bcatch = new AST_Catch({
                        start: start,
                        argname: name,
                        body: block_(),
                        end: prev()
                    });
                }
                if (is("keyword", "finally")) {
                    var start = S.token;
                    next();
                    bfinally = new AST_Finally({
                        start: start,
                        body: block_(),
                        end: prev()
                    });
                }
                if (!bcatch && !bfinally)
                    croak("Missing catch/finally blocks");
                return new AST_Try({
                    body: body,
                    bcatch: bcatch,
                    bfinally: bfinally
                });
            };

            function vardefs(no_in, in_const) {
                var a = [];
                for (; ;) {
                    a.push(new AST_VarDef({
                        start: S.token,
                        name: as_symbol(in_const ? AST_SymbolConst : AST_SymbolVar),
                        value: is("operator", "=") ? (next(), expression(false, no_in)) : null,
                        end: prev()
                    }));
                    if (!is("punc", ","))
                        break;
                    next();
                }
                return a;
            };

            var var_ = function (no_in) {
                return new AST_Var({
                    start: prev(),
                    definitions: vardefs(no_in, false),
                    end: prev()
                });
            };

            var const_ = function () {
                return new AST_Const({
                    start: prev(),
                    definitions: vardefs(false, true),
                    end: prev()
                });
            };

            var new_ = function () {
                var start = S.token;
                expect_token("operator", "new");
                var newexp = expr_atom(false), args;
                if (is("punc", "(")) {
                    next();
                    args = expr_list(")");
                } else {
                    args = [];
                }
                return subscripts(new AST_New({
                    start: start,
                    expression: newexp,
                    args: args,
                    end: prev()
                }), true);
            };

            function as_atom_node() {
                var tok = S.token, ret;
                switch (tok.type) {
                    case "name":
                    case "keyword":
                        ret = _make_symbol(AST_SymbolRef);
                        break;
                    case "num":
                        ret = new AST_Number({ start: tok, end: tok, value: tok.value });
                        break;
                    case "string":
                        ret = new AST_String({ start: tok, end: tok, value: tok.value });
                        break;
                    case "regexp":
                        ret = new AST_RegExp({ start: tok, end: tok, value: tok.value });
                        break;
                    case "atom":
                        switch (tok.value) {
                            case "false":
                                ret = new AST_False({ start: tok, end: tok });
                                break;
                            case "true":
                                ret = new AST_True({ start: tok, end: tok });
                                break;
                            case "null":
                                ret = new AST_Null({ start: tok, end: tok });
                                break;
                        }
                        break;
                }
                next();
                return ret;
            };

            var expr_atom = function (allow_calls) {
                if (is("operator", "new")) {
                    return new_();
                }
                var start = S.token;
                if (is("punc")) {
                    switch (start.value) {
                        case "(":
                            next();
                            var ex = expression(true);
                            ex.start = start;
                            ex.end = S.token;
                            expect(")");
                            return subscripts(ex, allow_calls);
                        case "[":
                            return subscripts(array_(), allow_calls);
                        case "{":
                            return subscripts(object_(), allow_calls);
                    }
                    unexpected();
                }
                if (is("keyword", "function")) {
                    next();
                    var func = function_(AST_Function);
                    func.start = start;
                    func.end = prev();
                    return subscripts(func, allow_calls);
                }
                if (ATOMIC_START_TOKEN[S.token.type]) {
                    return subscripts(as_atom_node(), allow_calls);
                }
                unexpected();
            };

            function expr_list(closing, allow_trailing_comma, allow_empty) {
                var first = true, a = [];
                while (!is("punc", closing)) {
                    if (first) first = false; else expect(",");
                    if (allow_trailing_comma && is("punc", closing)) break;
                    if (is("punc", ",") && allow_empty) {
                        a.push(new AST_Hole({ start: S.token, end: S.token }));
                    } else {
                        a.push(expression(false));
                    }
                }
                next();
                return a;
            };

            var array_ = embed_tokens(function () {
                expect("[");
                return new AST_Array({
                    elements: expr_list("]", !options.strict, true)
                });
            });

            var object_ = embed_tokens(function () {
                expect("{");
                var first = true, a = [];
                while (!is("punc", "}")) {
                    if (first) first = false; else expect(",");
                    if (!options.strict && is("punc", "}"))
                        break;
                    var start = S.token;
                    var type = start.type;
                    var name = as_property_name();
                    if (type == "name" && !is("punc", ":")) {
                        if (name == "get") {
                            a.push(new AST_ObjectGetter({
                                start: start,
                                key: as_atom_node(),
                                value: function_(AST_Accessor),
                                end: prev()
                            }));
                            continue;
                        }
                        if (name == "set") {
                            a.push(new AST_ObjectSetter({
                                start: start,
                                key: as_atom_node(),
                                value: function_(AST_Accessor),
                                end: prev()
                            }));
                            continue;
                        }
                    }
                    expect(":");
                    a.push(new AST_ObjectKeyVal({
                        start: start,
                        key: name,
                        value: expression(false),
                        end: prev()
                    }));
                }
                next();
                return new AST_Object({ properties: a });
            });

            function as_property_name() {
                var tmp = S.token;
                next();
                switch (tmp.type) {
                    case "num":
                    case "string":
                    case "name":
                    case "operator":
                    case "keyword":
                    case "atom":
                        return tmp.value;
                    default:
                        unexpected();
                }
            };

            function as_name() {
                var tmp = S.token;
                next();
                switch (tmp.type) {
                    case "name":
                    case "operator":
                    case "keyword":
                    case "atom":
                        return tmp.value;
                    default:
                        unexpected();
                }
            };

            function _make_symbol(type) {
                var name = S.token.value;
                return new (name == "this" ? AST_This : type)({
                    name: String(name),
                    start: S.token,
                    end: S.token
                });
            };

            function as_symbol(type, noerror) {
                if (!is("name")) {
                    if (!noerror) croak("Name expected");
                    return null;
                }
                var sym = _make_symbol(type);
                next();
                return sym;
            };

            var subscripts = function (expr, allow_calls) {
                var start = expr.start;
                if (is("punc", ".")) {
                    next();
                    return subscripts(new AST_Dot({
                        start: start,
                        expression: expr,
                        property: as_name(),
                        end: prev()
                    }), allow_calls);
                }
                if (is("punc", "[")) {
                    next();
                    var prop = expression(true);
                    expect("]");
                    return subscripts(new AST_Sub({
                        start: start,
                        expression: expr,
                        property: prop,
                        end: prev()
                    }), allow_calls);
                }
                if (allow_calls && is("punc", "(")) {
                    next();
                    return subscripts(new AST_Call({
                        start: start,
                        expression: expr,
                        args: expr_list(")"),
                        end: prev()
                    }), true);
                }
                return expr;
            };

            var maybe_unary = function (allow_calls) {
                var start = S.token;
                if (is("operator") && UNARY_PREFIX(start.value)) {
                    next();
                    handle_regexp();
                    var ex = make_unary(AST_UnaryPrefix, start.value, maybe_unary(allow_calls));
                    ex.start = start;
                    ex.end = prev();
                    return ex;
                }
                var val = expr_atom(allow_calls);
                while (is("operator") && UNARY_POSTFIX(S.token.value) && !S.token.nlb) {
                    val = make_unary(AST_UnaryPostfix, S.token.value, val);
                    val.start = start;
                    val.end = S.token;
                    next();
                }
                return val;
            };

            function make_unary(ctor, op, expr) {
                if ((op == "++" || op == "--") && !is_assignable(expr))
                    croak("Invalid use of " + op + " operator");
                return new ctor({ operator: op, expression: expr });
            };

            var expr_op = function (left, min_prec, no_in) {
                var op = is("operator") ? S.token.value : null;
                if (op == "in" && no_in) op = null;
                var prec = op != null ? PRECEDENCE[op] : null;
                if (prec != null && prec > min_prec) {
                    next();
                    var right = expr_op(maybe_unary(true), prec, no_in);
                    return expr_op(new AST_Binary({
                        start: left.start,
                        left: left,
                        operator: op,
                        right: right,
                        end: right.end
                    }), min_prec, no_in);
                }
                return left;
            };

            function expr_ops(no_in) {
                return expr_op(maybe_unary(true), 0, no_in);
            };

            var maybe_conditional = function (no_in) {
                var start = S.token;
                var expr = expr_ops(no_in);
                if (is("operator", "?")) {
                    next();
                    var yes = expression(false);
                    expect(":");
                    return new AST_Conditional({
                        start: start,
                        condition: expr,
                        consequent: yes,
                        alternative: expression(false, no_in),
                        end: prev()
                    });
                }
                return expr;
            };

            function is_assignable(expr) {
                if (!options.strict) return true;
                if (expr instanceof AST_This) return false;
                return (expr instanceof AST_PropAccess || expr instanceof AST_Symbol);
            };

            var maybe_assign = function (no_in) {
                var start = S.token;
                var left = maybe_conditional(no_in), val = S.token.value;
                if (is("operator") && ASSIGNMENT(val)) {
                    if (is_assignable(left)) {
                        next();
                        return new AST_Assign({
                            start: start,
                            left: left,
                            operator: val,
                            right: maybe_assign(no_in),
                            end: prev()
                        });
                    }
                    croak("Invalid assignment");
                }
                return left;
            };

            var expression = function (commas, no_in) {
                var start = S.token;
                var expr = maybe_assign(no_in);
                if (commas && is("punc", ",")) {
                    next();
                    return new AST_Seq({
                        start: start,
                        car: expr,
                        cdr: expression(true, no_in),
                        end: peek()
                    });
                }
                return expr;
            };

            function in_loop(cont) {
                ++S.in_loop;
                var ret = cont();
                --S.in_loop;
                return ret;
            };

            if (options.expression) {
                return expression(true);
            }

            return (function () {
                var start = S.token;
                var body = [];
                while (!is("eof"))
                    body.push(statement());
                var end = prev();
                var toplevel = options.toplevel;
                if (toplevel) {
                    toplevel.body = toplevel.body.concat(body);
                    toplevel.end = end;
                } else {
                    toplevel = new AST_Toplevel({ start: start, body: body, end: end });
                }
                return toplevel;
            })();

        };


        "use strict";

        function SymbolDef(scope, index, orig) {
            this.name = orig.name;
            this.orig = [orig];
            this.scope = scope;
            this.references = [];
            this.global = false;
            this.mangled_name = null;
            this.undeclared = false;
            this.constant = false;
            this.index = index;
        };

        SymbolDef.prototype = {
            unmangleable: function (options) {
                return (this.global && !(options && options.toplevel))
                    || this.undeclared
                    || (!(options && options.eval) && (this.scope.uses_eval || this.scope.uses_with));
            },
            mangle: function (options) {
                if (!this.mangled_name && !this.unmangleable(options)) {
                    var s = this.scope;
                    if (!options.screw_ie8 && this.orig[0] instanceof AST_SymbolLambda)
                        s = s.parent_scope;
                    this.mangled_name = s.next_mangled(options, this);
                }
            }
        };

        AST_Toplevel.DEFMETHOD("figure_out_scope", function (options) {
            options = defaults(options, {
                screw_ie8: false
            });

            var self = this;
            var scope = self.parent_scope = null;
            var defun = null;
            var nesting = 0;
            var tw = new TreeWalker(function (node, descend) {
                if (options.screw_ie8 && node instanceof AST_Catch) {
                    var save_scope = scope;
                    scope = new AST_Scope(node);
                    scope.init_scope_vars(nesting);
                    scope.parent_scope = save_scope;
                    descend();
                    scope = save_scope;
                    return true;
                }
                if (node instanceof AST_Scope) {
                    node.init_scope_vars(nesting);
                    var save_scope = node.parent_scope = scope;
                    var save_defun = defun;
                    defun = scope = node;
                    ++nesting; descend(); --nesting;
                    scope = save_scope;
                    defun = save_defun;
                    return true;
                }
                if (node instanceof AST_Directive) {
                    node.scope = scope;
                    push_uniq(scope.directives, node.value);
                    return true;
                }
                if (node instanceof AST_With) {
                    for (var s = scope; s; s = s.parent_scope)
                        s.uses_with = true;
                    return;
                }
                if (node instanceof AST_Symbol) {
                    node.scope = scope;
                }
                if (node instanceof AST_SymbolLambda) {
                    defun.def_function(node);
                }
                else if (node instanceof AST_SymbolDefun) {
                    (node.scope = defun.parent_scope).def_function(node);
                }
                else if (node instanceof AST_SymbolVar
                         || node instanceof AST_SymbolConst) {
                    var def = defun.def_variable(node);
                    def.constant = node instanceof AST_SymbolConst;
                    def.init = tw.parent().value;
                }
                else if (node instanceof AST_SymbolCatch) {
                    (options.screw_ie8 ? scope : defun)
                        .def_variable(node);
                }
            });
            self.walk(tw);

            var func = null;
            var globals = self.globals = new Dictionary();
            var tw = new TreeWalker(function (node, descend) {
                if (node instanceof AST_Lambda) {
                    var prev_func = func;
                    func = node;
                    descend();
                    func = prev_func;
                    return true;
                }
                if (node instanceof AST_SymbolRef) {
                    var name = node.name;
                    var sym = node.scope.find_variable(name);
                    if (!sym) {
                        var g;
                        if (globals.has(name)) {
                            g = globals.get(name);
                        } else {
                            g = new SymbolDef(self, globals.size(), node);
                            g.undeclared = true;
                            g.global = true;
                            globals.set(name, g);
                        }
                        node.thedef = g;
                        if (name == "eval" && tw.parent() instanceof AST_Call) {
                            for (var s = node.scope; s && !s.uses_eval; s = s.parent_scope)
                                s.uses_eval = true;
                        }
                        if (func && name == "arguments") {
                            func.uses_arguments = true;
                        }
                    } else {
                        node.thedef = sym;
                    }
                    node.reference();
                    return true;
                }
            });
            self.walk(tw);
        });

        AST_Scope.DEFMETHOD("init_scope_vars", function (nesting) {
            this.directives = [];
            this.variables = new Dictionary();
            this.functions = new Dictionary();
            this.uses_with = false;
            this.uses_eval = false;
            this.parent_scope = null;
            this.enclosed = [];
            this.cname = -1;
            this.nesting = nesting;
        });

        AST_Scope.DEFMETHOD("strict", function () {
            return this.has_directive("use strict");
        });

        AST_Lambda.DEFMETHOD("init_scope_vars", function () {
            AST_Scope.prototype.init_scope_vars.apply(this, arguments);
            this.uses_arguments = false;
        });

        AST_SymbolRef.DEFMETHOD("reference", function () {
            var def = this.definition();
            def.references.push(this);
            var s = this.scope;
            while (s) {
                push_uniq(s.enclosed, def);
                if (s === def.scope) break;
                s = s.parent_scope;
            }
            this.frame = this.scope.nesting - def.scope.nesting;
        });

        AST_Scope.DEFMETHOD("find_variable", function (name) {
            if (name instanceof AST_Symbol) name = name.name;
            return this.variables.get(name)
                || (this.parent_scope && this.parent_scope.find_variable(name));
        });

        AST_Scope.DEFMETHOD("has_directive", function (value) {
            return this.parent_scope && this.parent_scope.has_directive(value)
                || (this.directives.indexOf(value) >= 0 ? this : null);
        });

        AST_Scope.DEFMETHOD("def_function", function (symbol) {
            this.functions.set(symbol.name, this.def_variable(symbol));
        });

        AST_Scope.DEFMETHOD("def_variable", function (symbol) {
            var def;
            if (!this.variables.has(symbol.name)) {
                def = new SymbolDef(this, this.variables.size(), symbol);
                this.variables.set(symbol.name, def);
                def.global = !this.parent_scope;
            } else {
                def = this.variables.get(symbol.name);
                def.orig.push(symbol);
            }
            return symbol.thedef = def;
        });

        AST_Scope.DEFMETHOD("next_mangled", function (options) {
            var ext = this.enclosed;
            out: while (true) {
                var m = base54(++this.cname);
                if (!is_identifier(m)) continue;

                if (options.except.indexOf(m) >= 0) continue;

                for (var i = ext.length; --i >= 0;) {
                    var sym = ext[i];
                    var name = sym.mangled_name || (sym.unmangleable(options) && sym.name);
                    if (m == name) continue out;
                }
                return m;
            }
        });

        AST_Function.DEFMETHOD("next_mangled", function (options, def) {

            var tricky_def = def.orig[0] instanceof AST_SymbolFunarg && this.name && this.name.definition();
            while (true) {
                var name = AST_Lambda.prototype.next_mangled.call(this, options, def);
                if (!(tricky_def && tricky_def.mangled_name == name))
                    return name;
            }
        });

        AST_Scope.DEFMETHOD("references", function (sym) {
            if (sym instanceof AST_Symbol) sym = sym.definition();
            return this.enclosed.indexOf(sym) < 0 ? null : sym;
        });

        AST_Symbol.DEFMETHOD("unmangleable", function (options) {
            return this.definition().unmangleable(options);
        });

        AST_SymbolAccessor.DEFMETHOD("unmangleable", function () {
            return true;
        });

        AST_Label.DEFMETHOD("unmangleable", function () {
            return false;
        });

        AST_Symbol.DEFMETHOD("unreferenced", function () {
            return this.definition().references.length == 0
                && !(this.scope.uses_eval || this.scope.uses_with);
        });

        AST_Symbol.DEFMETHOD("undeclared", function () {
            return this.definition().undeclared;
        });

        AST_LabelRef.DEFMETHOD("undeclared", function () {
            return false;
        });

        AST_Label.DEFMETHOD("undeclared", function () {
            return false;
        });

        AST_Symbol.DEFMETHOD("definition", function () {
            return this.thedef;
        });

        AST_Symbol.DEFMETHOD("global", function () {
            return this.definition().global;
        });

        AST_Toplevel.DEFMETHOD("_default_mangler_options", function (options) {
            return defaults(options, {
                except: [],
                eval: false,
                sort: false,
                toplevel: false,
                screw_ie8: false
            });
        });

        AST_Toplevel.DEFMETHOD("mangle_names", function (options) {
            options = this._default_mangler_options(options);
            var lname = -1;
            var to_mangle = [];
            var tw = new TreeWalker(function (node, descend) {
                if (node instanceof AST_LabeledStatement) {
                    var save_nesting = lname;
                    descend();
                    lname = save_nesting;
                    return true;
                }
                if (node instanceof AST_Scope) {
                    var p = tw.parent(), a = [];
                    node.variables.each(function (symbol) {
                        if (options.except.indexOf(symbol.name) < 0) {
                            a.push(symbol);
                        }
                    });
                    if (options.sort) a.sort(function (a, b) {
                        return b.references.length - a.references.length;
                    });
                    to_mangle.push.apply(to_mangle, a);
                    return;
                }
                if (node instanceof AST_Label) {
                    var name;
                    do name = base54(++lname); while (!is_identifier(name));
                    node.mangled_name = name;
                    return true;
                }
                if (options.screw_ie8 && node instanceof AST_SymbolCatch) {
                    to_mangle.push(node.definition());
                    return;
                }
            });
            this.walk(tw);
            to_mangle.forEach(function (def) { def.mangle(options) });
        });

        AST_Toplevel.DEFMETHOD("compute_char_frequency", function (options) {
            options = this._default_mangler_options(options);
            var tw = new TreeWalker(function (node) {
                if (node instanceof AST_Constant)
                    base54.consider(node.print_to_string());
                else if (node instanceof AST_Return)
                    base54.consider("return");
                else if (node instanceof AST_Throw)
                    base54.consider("throw");
                else if (node instanceof AST_Continue)
                    base54.consider("continue");
                else if (node instanceof AST_Break)
                    base54.consider("break");
                else if (node instanceof AST_Debugger)
                    base54.consider("debugger");
                else if (node instanceof AST_Directive)
                    base54.consider(node.value);
                else if (node instanceof AST_While)
                    base54.consider("while");
                else if (node instanceof AST_Do)
                    base54.consider("do while");
                else if (node instanceof AST_If) {
                    base54.consider("if");
                    if (node.alternative) base54.consider("else");
                }
                else if (node instanceof AST_Var)
                    base54.consider("var");
                else if (node instanceof AST_Const)
                    base54.consider("const");
                else if (node instanceof AST_Lambda)
                    base54.consider("function");
                else if (node instanceof AST_For)
                    base54.consider("for");
                else if (node instanceof AST_ForIn)
                    base54.consider("for in");
                else if (node instanceof AST_Switch)
                    base54.consider("switch");
                else if (node instanceof AST_Case)
                    base54.consider("case");
                else if (node instanceof AST_Default)
                    base54.consider("default");
                else if (node instanceof AST_With)
                    base54.consider("with");
                else if (node instanceof AST_ObjectSetter)
                    base54.consider("set" + node.key);
                else if (node instanceof AST_ObjectGetter)
                    base54.consider("get" + node.key);
                else if (node instanceof AST_ObjectKeyVal)
                    base54.consider(node.key);
                else if (node instanceof AST_New)
                    base54.consider("new");
                else if (node instanceof AST_This)
                    base54.consider("this");
                else if (node instanceof AST_Try)
                    base54.consider("try");
                else if (node instanceof AST_Catch)
                    base54.consider("catch");
                else if (node instanceof AST_Finally)
                    base54.consider("finally");
                else if (node instanceof AST_Symbol && node.unmangleable(options))
                    base54.consider(node.name);
                else if (node instanceof AST_Unary || node instanceof AST_Binary)
                    base54.consider(node.operator);
                else if (node instanceof AST_Dot)
                    base54.consider(node.property);
            });
            this.walk(tw);
            base54.sort();
        });

        var base54 = (function () {
            var string = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$_0123456789";
            var chars, frequency;
            function reset() {
                frequency = {};
                chars = string.split("").map(function (ch) { return ch.charCodeAt(0) });
                chars.forEach(function (ch) { frequency[ch] = 0 });
            }
            base54.consider = function (str) {
                for (var i = str.length; --i >= 0;) {
                    var code = str.charCodeAt(i);
                    if (code in frequency)++frequency[code];
                }
            };
            base54.sort = function () {
                chars = mergeSort(chars, function (a, b) {
                    if (is_digit(a) && !is_digit(b)) return 1;
                    if (is_digit(b) && !is_digit(a)) return -1;
                    return frequency[b] - frequency[a];
                });
            };
            base54.reset = reset;
            reset();
            base54.get = function () { return chars };
            base54.freq = function () { return frequency };
            function base54(num) {
                var ret = "", base = 54;
                do {
                    ret += String.fromCharCode(chars[num % base]);
                    num = Math.floor(num / base);
                    base = 64;
                } while (num > 0);
                return ret;
            };
            return base54;
        })();

        AST_Toplevel.DEFMETHOD("scope_warnings", function (options) {
            options = defaults(options, {
                undeclared: false, // this makes a lot of noise
                unreferenced: true,
                assign_to_global: true,
                func_arguments: true,
                nested_defuns: true,
                eval: true
            });
            var tw = new TreeWalker(function (node) {
                if (options.undeclared
                    && node instanceof AST_SymbolRef
                    && node.undeclared()) {
                    // XXX: this also warns about JS standard names,
                    // i.e. Object, Array, parseInt etc.  Should add a list of
                    // exceptions.
                    AST_Node.warn("Undeclared symbol: {name} [{file}:{line},{col}]", {
                        name: node.name,
                        file: node.start.file,
                        line: node.start.line,
                        col: node.start.col
                    });
                }
                if (options.assign_to_global) {
                    var sym = null;
                    if (node instanceof AST_Assign && node.left instanceof AST_SymbolRef)
                        sym = node.left;
                    else if (node instanceof AST_ForIn && node.init instanceof AST_SymbolRef)
                        sym = node.init;
                    if (sym
                        && (sym.undeclared()
                            || (sym.global() && sym.scope !== sym.definition().scope))) {
                        AST_Node.warn("{msg}: {name} [{file}:{line},{col}]", {
                            msg: sym.undeclared() ? "Accidental global?" : "Assignment to global",
                            name: sym.name,
                            file: sym.start.file,
                            line: sym.start.line,
                            col: sym.start.col
                        });
                    }
                }
                if (options.eval
                    && node instanceof AST_SymbolRef
                    && node.undeclared()
                    && node.name == "eval") {
                    AST_Node.warn("Eval is used [{file}:{line},{col}]", node.start);
                }
                if (options.unreferenced
                    && (node instanceof AST_SymbolDeclaration || node instanceof AST_Label)
                    && node.unreferenced()) {
                    AST_Node.warn("{type} {name} is declared but not referenced [{file}:{line},{col}]", {
                        type: node instanceof AST_Label ? "Label" : "Symbol",
                        name: node.name,
                        file: node.start.file,
                        line: node.start.line,
                        col: node.start.col
                    });
                }
                if (options.func_arguments
                    && node instanceof AST_Lambda
                    && node.uses_arguments) {
                    AST_Node.warn("arguments used in function {name} [{file}:{line},{col}]", {
                        name: node.name ? node.name.name : "anonymous",
                        file: node.start.file,
                        line: node.start.line,
                        col: node.start.col
                    });
                }
                if (options.nested_defuns
                    && node instanceof AST_Defun
                    && !(tw.parent() instanceof AST_Scope)) {
                    AST_Node.warn("Function {name} declared in nested statement \"{type}\" [{file}:{line},{col}]", {
                        name: node.name.name,
                        type: tw.parent().TYPE,
                        file: node.start.file,
                        line: node.start.line,
                        col: node.start.col
                    });
                }
            });
            this.walk(tw);
        });

        UglifyJS.parse = parse;
        UglifyJS.TreeWalker = TreeWalker;
        UglifyJS.AST_VarDef = AST_VarDef;
        UglifyJS.AST_New = AST_New;
        UglifyJS.AST_Dot = AST_Dot;
        UglifyJS.AST_Defun = AST_Defun;
        UglifyJS.AST_Function = AST_Function;
        UglifyJS.AST_SymbolDefun = AST_SymbolDefun;
        UglifyJS.AST_SymbolVar = AST_SymbolVar;
        UglifyJS.AST_SymbolFunarg = AST_SymbolFunarg;
        UglifyJS.AST_Call = AST_Call;
        return UglifyJS;
    })();
    function request(url, callback, charset) {
        var node = doc.createElement("script");
        if (charset) {
            var cs = isFunction(charset) ? charset(url) : charset;
            cs && (node.charset = cs);
        }
        addOnload(node, callback, url), node.async = !0, node.src = url, currentlyAddingScript = node,
        baseElement ? head.insertBefore(node, baseElement) : head.appendChild(node), currentlyAddingScript = null;
    }
    function addOnload(node, callback, url) {
        function onload(error) {
            node.onload = node.onerror = node.onreadystatechange = null, data.debug || head.removeChild(node),
            node = null, callback(error);
        }
        var supportOnload = "onload" in node;
        supportOnload ? (node.onload = onload, node.onerror = function () {
            throw "bad request!__" + url + "  404 (Not Found) ";
        }) : node.onreadystatechange = function () {
            /loaded|complete/.test(node.readyState) && onload();
        };
    }
    function isType(type) {
        return function (obj) {
            return Object.prototype.toString.call(obj) === "[object " + type + "]";
        };
    }
    function refrence2(className, deps, foctory, fullname) {
        var body = foctory.replace(/"function[\s\S]*?\}"/g, function (str) {
            return str.substr(1, str.length - 2);
        }).replace(/\/\/[\s\S]*?\\r\\n/g, "").replace(/(\/\*[\s\S]*\*\/)/g, "").replace(/\\r\\n/g, "").replace(/\\n/g, "").replace(/\\t/g, "").replace(/\\/g, "");
        body = js_beautify(body), isDebug && log(body + "\n//@ sourceURL=" + (className || "anonymous") + ".js");
        var fn = Function(body), ref = getRef(fn);
        if (remove(ref, "__class"), rLen = ref.length, pendingModules.push({
            id: fullname,
            deps: []
        }), 0 == rLen) {
            var isPush = !1;
            return each(kmdmdinfo, function (item) {
                return item.c == fullname ? (isPush = !0, !1) : undefined;
            }), isPush || kmdmdinfo.push({
                a: [],
                b: body,
                c: fullname,
                d: []
            }), checkModules[fullname] = 1, checkCpt(), undefined;
        }
        for (var newArr = [], i = 0, len = deps.length; len > i; i++) for (var k = 0; rLen > k; k++) isInArray(classList, deps[i] + "." + ref[k]) && newArr.push(deps[i] + "." + ref[k]);
        pendingModules.push({
            id: fullname,
            deps: newArr
        });
        var moduleNameArr = [];
        for (i = 0; i < newArr.length; i++) {
            var xx = newArr[i].split(".");
            moduleNameArr.push(xx[xx.length - 1]);
        }
        var isPush = !1;
        each(kmdmdinfo, function (item) {
            return item.c == fullname ? (isPush = !0, !1) : undefined;
        }), isPush || kmdmdinfo.push({
            a: moduleNameArr,
            b: body,
            c: fullname,
            d: newArr
        }), checkModules[fullname] = 1;
        for (var k = 0; rLen > k; k++) {
            var ns = nsmp[ref[k]];
            request(mapping[ns], function () { });
        }
        window.kmdmdinfo = kmdmdinfo;
    }
    function checkCpt() {
        function catchAllDep(md) {
            pendingCount++, isInArray(arr, md.c) && remove(arr, md.c), arr.push(md.c), md && md.d.length > 0 ? (each(md.d, function (item) {
                isInArray(arr, item) && remove(arr, item), arr.push(item);
                var next;
                each(kmdmdinfo, function (item2) {
                    return item2.c == item ? (next = item2, !1) : undefined;
                }), catchAllDep(next);
            }), pendingCount--) : pendingCount--;
        }
        for (var i = 0; i < pendingModules.length; i++) for (var j = 0; j < pendingModules[i].deps.length; j++) if (!checkModules.hasOwnProperty(pendingModules[i].deps[j])) return !1;
        if (!kmdmaincpt) {
            kmdmaincpt = !0;
            var mainDep;
            each(kmdmdinfo, function (item) {
                item.c == ProjName + ".Main" && (mainDep = item);
            });
            var arr = [], pendingCount = 0;
            catchAllDep(mainDep, 0);
            var buildArr = [];
            if (each(arr, function (item2) {
                each(kmdmdinfo, function (item) {
                    if (item.c == item2) {
                        buildArr.push(item);
                        var moduleArr = [], fnResult = Function(item.a, item.b);
                        for (i = 0; i < item.d.length; i++) moduleArr.push(modules[item.d[i]]);
                        var obj = fnResult.apply(null, moduleArr);
                        modules[item.c] = obj;
            }
            });
            }), setTimeout(function () {
                new modules[ProjName + ".Main"]();
            }, 0), isBuild) {
                var codePanel = doc.createElement("textarea");
                codePanel.setAttribute("rows", "25"), codePanel.setAttribute("cols", "45"), codePanel.style.position = "absolute",
                codePanel.style.left = "0px", codePanel.style.top = "0px", codePanel.style.zIndex = 1e4,
                doc.body.appendChild(codePanel);
                var cpCode = '(function (n) { var f = !1, l = /xyz/.test(function () { xyz }) ? /\b_super\b/ : /.*/, o = function () { }, t, r, s, u, c, e; for (o.extend = function (n) { function i() { !f && this.init && this.init.apply(this, arguments) } var o = this.prototype, e, t, r, u; f = !0, e = new this, f = !1; for (t in n) t != "statics" && (e[t] = typeof n[t] == "function" && typeof o[t] == "function" && l.test(n[t]) ? function (n, t) { return function () { var r = this._super, i; return this._super = o[n], i = t.apply(this, arguments), this._super = r, i } }(t, n[t]) : n[t]); for (r in this) this.hasOwnProperty(r) && r != "extend" && (i[r] = this[r]); if (n.statics) for (u in n.statics) n.statics.hasOwnProperty(u) && (i[u] = n.statics[u]); return i.prototype = e, i.prototype.constructor = i, i.extend = arguments.callee, i }, n.__class = o, t = {}, t.modules = {}, t.all =' + JSON.stringify(buildArr).replace(/\s+/g, " ") + ', r = 0, s = t.all.length; r < s; r++) { var i = t.all[r], h = [], a = new Function(i.a, i.b); for (u = 0, c = i.d.length; u < c; u++) h.push(t.modules[i.d[u]]); e = a.apply(null, h),t.modules[i.c] = e } new t.modules["' + ProjName + '.Main"] })(this)';
                codePanel.value = cpCode, codePanel.focus(), codePanel.select();
            }
            if (isView) {
                var holder = document.createElement("div");
                holder.setAttribute("id", "holder"), document.body.appendChild(holder), request(baseUrl + "DepTree.js", function () {
                    for (var DepTree = kmdjs.get(ProjName + ".DepTree"), data = [], i = 0, len = buildArr.length; len > i; i++) {
                        var item = buildArr[i];
                        data.push({
                            name: item.c,
                            deps: item.d
                        });
                    }
                    new DepTree({
                        renderTo: "holder",
                        width: "820",
                        height: "580",
                        data: data
                    });
                });
            }
        }
    }
    function remove(arr, item) {
        for (var i = arr.length - 1; i > -1; i--) arr[i] == item && arr.splice(i, 1);
    }
    function each(arry, action) {
        for (var i = arry.length - 1; i > -1; i--) {
            var result = action(arry[i]);
            if (isBoolean(result) && !result) break;
        }
    }
    function stringifyWithFuncs(obj) {
        Object.prototype.toJSON = function () {
            var i, sobj = {};
            for (i in this) this.hasOwnProperty(i) && (sobj[i] = "function" == typeof this[i] ? "" + this[i] : this[i]);
            return sobj;
        };
        var str = JSON.stringify(obj);
        return delete Object.prototype.toJSON, str;
    }
    function lastIndexOf(str, word) {
        if (str.lastIndexOf) return str.lastIndexOf(word);
        for (var len = word.length, i = str.length - 1 - len; i > -1; i--) if (word === str.substr(i, len)) return i;
        return -1;
    }
    function isInArray(arr, item) {
        for (var i = 0, j = arr.length; j > i; i++) if (arr[i] == item) return !0;
        return !1;
    }
    function isInScopeChainVariables(scope, name) {
        var vars = scope.variables._values;
        return vars.hasOwnProperty("$" + name) ? !0 : scope.parent_scope ? isInScopeChainVariables(scope.parent_scope, name) : !1;
    }
    function getRef(fn) {
        var U2 = UglifyJS, ast = U2.parse("" + fn);
        ast.figure_out_scope();
        var result = [];
        return ast.walk(new U2.TreeWalker(function (node) {
            if (node instanceof U2.AST_New) {
                var ex = node.expression, name = ex.name, scope = ex.scope;
                !name || "this" == name || name in window || isInScopeChainVariables(scope, name) || result.push(name);
            }
            if (node instanceof U2.AST_Dot) {
                var ex = node.expression, name = ex.name, scope = ex.scope;
                !name || "this" == name || name in window || isInScopeChainVariables(scope, name) || result.push(name);
            }
        })), result;
    }
    function log(msg) {
        try {
            console.log(msg);
        } catch (ex) { }
    }
    function getBaseUrl() {
        for (var baseUrl, scripts = doc.getElementsByTagName("script"), i = 0, len = scripts.length; len > i; i++) {
            var scrp = scripts[i], src = scrp.getAttribute("src").toUpperCase(), arr = src.match(/\bKMD\b/g);
            if (arr) {
                var m2 = src.match(/DEBUG/g);
                m2 && (isDebug = !0);
                var arr = src.split("/");
                arr.pop(), baseUrl = arr.length ? arr.join("/") + "/" : "./";
                var dm = scrp.getAttribute("data-main"), arr2 = dm.split("?");
                dataMain = arr2[0], arr2.length > 1 && ("build" == arr2[1] ? isBuild = !0 : isView = !0);
                break;
            }
        }
        return baseUrl;
    }
    function js_beautify(js_source_text, options) {
        function trim_output() {
            for (; output.length && (" " === output[output.length - 1] || output[output.length - 1] === indent_string) ;) output.pop();
        }
        function print_newline(ignore_repeated) {
            if (flags.eat_next_space = !1, (!opt_keep_array_indentation || !is_array(flags.mode)) && (ignore_repeated = undefined === ignore_repeated ? !0 : ignore_repeated,
            flags.if_line = !1, trim_output(), output.length)) {
                "\n" === output[output.length - 1] && ignore_repeated || (just_added_newline = !0,
                output.push("\n"));
                for (var i = 0; i < flags.indentation_level; i += 1) output.push(indent_string);
            }
        }
        function print_single_space() {
            if (flags.eat_next_space) return flags.eat_next_space = !1, undefined;
            var last_output = " ";
            output.length && (last_output = output[output.length - 1]), " " !== last_output && "\n" !== last_output && last_output !== indent_string && output.push(" ");
        }
        function print_token() {
            just_added_newline = !1, flags.eat_next_space = !1, output.push(token_text);
        }
        function indent() {
            flags.indentation_level += 1;
        }
        function remove_indent() {
            output.length && output[output.length - 1] === indent_string && output.pop();
        }
        function set_mode(mode) {
            flags && flag_store.push(flags), flags = {
                mode: mode,
                var_line: !1,
                var_line_tainted: !1,
                var_line_reindented: !1,
                in_html_comment: !1,
                if_line: !1,
                in_case: !1,
                eat_next_space: !1,
                indentation_baseline: -1,
                indentation_level: flags ? flags.indentation_level + (flags.var_line && flags.var_line_reindented ? 1 : 0) : opt_indent_level
            };
        }
        function is_expression(mode) {
            return "[EXPRESSION]" === mode || "[INDENTED-EXPRESSION]" === mode || "(EXPRESSION)" === mode;
        }
        function is_array(mode) {
            return "[EXPRESSION]" === mode || "[INDENTED-EXPRESSION]" === mode;
        }
        function restore_mode() {
            do_block_just_closed = "DO_BLOCK" === flags.mode, flag_store.length > 0 && (flags = flag_store.pop());
        }
        function in_array(what, arr) {
            for (var i = 0; i < arr.length; i += 1) if (arr[i] === what) return !0;
            return !1;
        }
        function is_ternary_op() {
            for (var level = 0, colon_count = 0, i = output.length - 1; i >= 0; i--) switch (output[i]) {
                case ":":
                    0 === level && colon_count++;
                    break;

                case "?":
                    if (0 === level) {
                        if (0 === colon_count) return !0;
                        colon_count--;
                    }
                    break;

                case "{":
                    if (0 === level) return !1;
                    level--;
                    break;

                case "(":
                case "[":
                    level--;
                    break;

                case ")":
                case "]":
                case "}":
                    level++;
            }
        }
        function get_next_token() {
            if (n_newlines = 0, parser_pos >= input_length) return ["", "TK_EOF"];
            wanted_newline = !1;
            var c = input.charAt(parser_pos);
            parser_pos += 1;
            var keep_whitespace = opt_keep_array_indentation && is_array(flags.mode);
            if (keep_whitespace) {
                for (var whitespace_count = 0; in_array(c, whitespace) ;) {
                    if ("\n" === c ? (trim_output(), output.push("\n"), just_added_newline = !0, whitespace_count = 0) : whitespace_count += "	" === c ? 4 : 1,
                    parser_pos >= input_length) return ["", "TK_EOF"];
                    c = input.charAt(parser_pos), parser_pos += 1;
                }
                if (-1 === flags.indentation_baseline && (flags.indentation_baseline = whitespace_count),
                just_added_newline) {
                    for (var i = 0; i < flags.indentation_level + 1; i += 1) output.push(indent_string);
                    if (-1 !== flags.indentation_baseline) for (var i = 0; i < whitespace_count - flags.indentation_baseline; i++) output.push(" ");
                }
            } else {
                for (; in_array(c, whitespace) ;) {
                    if ("\n" === c && (n_newlines += 1), parser_pos >= input_length) return ["", "TK_EOF"];
                    c = input.charAt(parser_pos), parser_pos += 1;
                }
                if (opt_preserve_newlines && n_newlines > 1) for (var i = 0; n_newlines > i; i += 1) print_newline(0 === i),
                just_added_newline = !0;
                wanted_newline = n_newlines > 0;
            }
            if (in_array(c, wordchar)) {
                if (input_length > parser_pos) for (; in_array(input.charAt(parser_pos), wordchar) && (c += input.charAt(parser_pos),
                parser_pos += 1, parser_pos !== input_length) ;);
                if (parser_pos !== input_length && c.match(/^[0-9]+[Ee]$/) && ("-" === input.charAt(parser_pos) || "+" === input.charAt(parser_pos))) {
                    var sign = input.charAt(parser_pos);
                    parser_pos += 1;
                    var t = get_next_token(parser_pos);
                    return c += sign + t[0], [c, "TK_WORD"];
                }
                return "in" === c ? [c, "TK_OPERATOR"] : (!wanted_newline || "TK_OPERATOR" === last_type || flags.if_line || !opt_preserve_newlines && "var" === last_text || print_newline(),
                [c, "TK_WORD"]);
            }
            if ("(" === c || "[" === c) return [c, "TK_START_EXPR"];
            if (")" === c || "]" === c) return [c, "TK_END_EXPR"];
            if ("{" === c) return [c, "TK_START_BLOCK"];
            if ("}" === c) return [c, "TK_END_BLOCK"];
            if (";" === c) return [c, "TK_SEMICOLON"];
            if ("/" === c) {
                var comment = "", inline_comment = !0;
                if ("*" === input.charAt(parser_pos)) {
                    if (parser_pos += 1, input_length > parser_pos) for (; ("*" !== input.charAt(parser_pos) || !input.charAt(parser_pos + 1) || "/" !== input.charAt(parser_pos + 1)) && input_length > parser_pos && (c = input.charAt(parser_pos),
                    comment += c, ("\r" === c || "\n" === c) && (inline_comment = !1), parser_pos += 1,
                    !(parser_pos >= input_length)) ;);
                    return parser_pos += 2, inline_comment ? ["/*" + comment + "*/", "TK_INLINE_COMMENT"] : ["/*" + comment + "*/", "TK_BLOCK_COMMENT"];
                }
                if ("/" === input.charAt(parser_pos)) {
                    for (comment = c; "\r" !== input.charAt(parser_pos) && "\n" !== input.charAt(parser_pos) && (comment += input.charAt(parser_pos),
                    parser_pos += 1, !(parser_pos >= input_length)) ;);
                    return parser_pos += 1, wanted_newline && print_newline(), [comment, "TK_COMMENT"];
                }
            }
            if ("'" === c || '"' === c || "/" === c && ("TK_WORD" === last_type && in_array(last_text, ["return", "do"]) || "TK_START_EXPR" === last_type || "TK_START_BLOCK" === last_type || "TK_END_BLOCK" === last_type || "TK_OPERATOR" === last_type || "TK_EQUALS" === last_type || "TK_EOF" === last_type || "TK_SEMICOLON" === last_type)) {
                var sep = c, esc = !1, resulting_string = c;
                if (input_length > parser_pos) if ("/" === sep) {
                    for (var in_char_class = !1; esc || in_char_class || input.charAt(parser_pos) !== sep;) if (resulting_string += input.charAt(parser_pos),
                    esc ? esc = !1 : (esc = "\\" === input.charAt(parser_pos), "[" === input.charAt(parser_pos) ? in_char_class = !0 : "]" === input.charAt(parser_pos) && (in_char_class = !1)),
                    parser_pos += 1, parser_pos >= input_length) return [resulting_string, "TK_STRING"];
                } else for (; esc || input.charAt(parser_pos) !== sep;) if (resulting_string += input.charAt(parser_pos),
                esc = esc ? !1 : "\\" === input.charAt(parser_pos), parser_pos += 1, parser_pos >= input_length) return [resulting_string, "TK_STRING"];
                if (parser_pos += 1, resulting_string += sep, "/" === sep) for (; input_length > parser_pos && in_array(input.charAt(parser_pos), wordchar) ;) resulting_string += input.charAt(parser_pos),
                parser_pos += 1;
                return [resulting_string, "TK_STRING"];
            }
            if ("#" === c) {
                var sharp = "#";
                if (input_length > parser_pos && in_array(input.charAt(parser_pos), digits)) {
                    do c = input.charAt(parser_pos), sharp += c, parser_pos += 1; while (input_length > parser_pos && "#" !== c && "=" !== c);
                    return "#" === c || ("[" == input.charAt(parser_pos) && "]" === input.charAt(parser_pos + 1) ? (sharp += "[]",
                    parser_pos += 2) : "{" == input.charAt(parser_pos) && "}" === input.charAt(parser_pos + 1) && (sharp += "{}",
                    parser_pos += 2)), [sharp, "TK_WORD"];
                }
            }
            if ("<" === c && "<!--" === input.substring(parser_pos - 1, parser_pos + 3)) return parser_pos += 3,
            flags.in_html_comment = !0, ["<!--", "TK_COMMENT"];
            if ("-" === c && flags.in_html_comment && "-->" === input.substring(parser_pos - 1, parser_pos + 2)) return flags.in_html_comment = !1,
            parser_pos += 2, wanted_newline && print_newline(), ["-->", "TK_COMMENT"];
            if (in_array(c, punct)) {
                for (; input_length > parser_pos && in_array(c + input.charAt(parser_pos), punct) && (c += input.charAt(parser_pos),
                parser_pos += 1, !(parser_pos >= input_length)) ;);
                return "=" === c ? [c, "TK_EQUALS"] : [c, "TK_OPERATOR"];
            }
            return [c, "TK_UNKNOWN"];
        }
        var input, output, token_text, last_type, last_text, last_last_text, last_word, flags, flag_store, indent_string, whitespace, wordchar, punct, parser_pos, line_starters, digits, prefix, token_type, do_block_just_closed, wanted_newline, just_added_newline, n_newlines;
        options = options ? options : {};
        var opt_braces_on_own_line = options.braces_on_own_line ? options.braces_on_own_line : !1, opt_indent_size = options.indent_size ? options.indent_size : 4, opt_indent_char = options.indent_char ? options.indent_char : " ", opt_preserve_newlines = undefined === options.preserve_newlines ? !0 : options.preserve_newlines, opt_indent_level = options.indent_level ? options.indent_level : 0, opt_space_after_anon_function = "undefined" === options.space_after_anon_function ? !1 : options.space_after_anon_function, opt_keep_array_indentation = undefined === options.keep_array_indentation ? !0 : options.keep_array_indentation;
        just_added_newline = !1;
        var input_length = js_source_text.length;
        for (indent_string = ""; opt_indent_size > 0;) indent_string += opt_indent_char,
        opt_indent_size -= 1;
        for (input = js_source_text, last_word = "", last_type = "TK_START_EXPR", last_text = "",
        last_last_text = "", output = [], do_block_just_closed = !1, whitespace = "\n\r	 ".split(""),
        wordchar = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_$".split(""),
        digits = "0123456789".split(""), punct = "+ - * / % & ++ -- = += -= *= /= %= == === != !== > < >= <= >> << >>> >>>= >>= <<= && &= | || ! !! , : ? ^ ^= |= ::".split(" "),
        line_starters = "continue,try,throw,return,var,if,switch,case,default,for,while,break,function".split(","),
        flag_store = [], set_mode("BLOCK"), parser_pos = 0; ;) {
            var t = get_next_token(parser_pos);
            if (token_text = t[0], token_type = t[1], "TK_EOF" === token_type) break;
            switch (token_type) {
                case "TK_START_EXPR":
                    if ("[" === token_text) {
                        if ("TK_WORD" === last_type || ")" === last_text) {
                            in_array(last_text, line_starters) && print_single_space(), set_mode("(EXPRESSION)"),
                            print_token();
                            break;
                        }
                        "[EXPRESSION]" === flags.mode || "[INDENTED-EXPRESSION]" === flags.mode ? "]" === last_last_text && "," === last_text ? ("[EXPRESSION]" === flags.mode && (flags.mode = "[INDENTED-EXPRESSION]",
                        opt_keep_array_indentation || indent()), set_mode("[EXPRESSION]"), opt_keep_array_indentation || print_newline()) : "[" === last_text ? ("[EXPRESSION]" === flags.mode && (flags.mode = "[INDENTED-EXPRESSION]",
                        opt_keep_array_indentation || indent()), set_mode("[EXPRESSION]"), opt_keep_array_indentation || print_newline()) : set_mode("[EXPRESSION]") : set_mode("[EXPRESSION]");
                    } else set_mode("(EXPRESSION)");
                    ";" === last_text || "TK_START_BLOCK" === last_type ? print_newline() : "TK_END_EXPR" === last_type || "TK_START_EXPR" === last_type || "TK_END_BLOCK" === last_type || ("TK_WORD" !== last_type && "TK_OPERATOR" !== last_type ? print_single_space() : "function" === last_word ? opt_space_after_anon_function && print_single_space() : (in_array(last_text, line_starters) || "catch" === last_text) && print_single_space()),
                    print_token();
                    break;

                case "TK_END_EXPR":
                    if ("]" === token_text) if (opt_keep_array_indentation) {
                        if ("}" === last_text) {
                            remove_indent(), print_token(), restore_mode();
                            break;
                        }
                    } else if ("[INDENTED-EXPRESSION]" === flags.mode && "]" === last_text) {
                        restore_mode(), print_newline(), print_token();
                        break;
                    }
                    restore_mode(), print_token();
                    break;

                case "TK_START_BLOCK":
                    set_mode("do" === last_word ? "DO_BLOCK" : "BLOCK"), opt_braces_on_own_line ? ("TK_OPERATOR" !== last_type && print_newline(!0),
                    print_token(), indent()) : ("TK_OPERATOR" !== last_type && "TK_START_EXPR" !== last_type && ("TK_START_BLOCK" === last_type ? print_newline() : print_single_space()),
                    indent(), print_token());
                    break;

                case "TK_END_BLOCK":
                    restore_mode(), opt_braces_on_own_line ? (print_newline(), flags.var_line_reindented && output.push(indent_string),
                    print_token()) : ("TK_START_BLOCK" === last_type ? just_added_newline ? remove_indent() : trim_output() : (print_newline(),
                    flags.var_line_reindented && output.push(indent_string)), print_token());
                    break;

                case "TK_WORD":
                    if (do_block_just_closed) {
                        print_single_space(), print_token(), print_single_space(), do_block_just_closed = !1;
                        break;
                    }
                    if ("function" === token_text && (just_added_newline || ";" == last_text) && "{" !== last_text) {
                        n_newlines = just_added_newline ? n_newlines : 0;
                        for (var i = 0; 2 - n_newlines > i; i++) print_newline(!1);
                    }
                    if ("case" === token_text || "default" === token_text) {
                        ":" === last_text ? remove_indent() : (flags.indentation_level--, print_newline(),
                        flags.indentation_level++), print_token(), flags.in_case = !0;
                        break;
                    }
                    prefix = "NONE", "TK_END_BLOCK" === last_type ? in_array(token_text.toLowerCase(), ["else", "catch", "finally"]) ? opt_braces_on_own_line ? prefix = "NEWLINE" : (prefix = "SPACE",
                    print_single_space()) : prefix = "NEWLINE" : "TK_SEMICOLON" !== last_type || "BLOCK" !== flags.mode && "DO_BLOCK" !== flags.mode ? "TK_SEMICOLON" === last_type && is_expression(flags.mode) ? prefix = "SPACE" : "TK_STRING" === last_type ? prefix = "NEWLINE" : "TK_WORD" === last_type ? prefix = "SPACE" : "TK_START_BLOCK" === last_type ? prefix = "NEWLINE" : "TK_END_EXPR" === last_type && (print_single_space(),
                    prefix = "NEWLINE") : prefix = "NEWLINE", "TK_END_BLOCK" !== last_type && in_array(token_text.toLowerCase(), ["else", "catch", "finally"]) ? print_newline() : in_array(token_text, line_starters) || "NEWLINE" === prefix ? "else" === last_text ? print_single_space() : ("TK_START_EXPR" !== last_type && "=" !== last_text && "," !== last_text || "function" !== token_text) && ("return" === last_text || "throw" === last_text ? print_single_space() : "TK_END_EXPR" !== last_type ? "TK_START_EXPR" === last_type && "var" === token_text || ":" === last_text || ("if" === token_text && "else" === last_word && "{" !== last_text ? print_single_space() : print_newline()) : in_array(token_text, line_starters) && ")" !== last_text && print_newline()) : "SPACE" === prefix && print_single_space(),
                    print_token(), last_word = token_text, "var" === token_text && (flags.var_line = !0,
                    flags.var_line_reindented = !1, flags.var_line_tainted = !1), ("if" === token_text || "else" === token_text) && (flags.if_line = !0);
                    break;

                case "TK_SEMICOLON":
                    print_token(), flags.var_line = !1, flags.var_line_reindented = !1;
                    break;

                case "TK_STRING":
                    "TK_START_BLOCK" === last_type || "TK_END_BLOCK" === last_type || "TK_SEMICOLON" === last_type ? print_newline() : "TK_WORD" === last_type && print_single_space(),
                    print_token();
                    break;

                case "TK_EQUALS":
                    flags.var_line && (flags.var_line_tainted = !0), print_single_space(), print_token(),
                    print_single_space();
                    break;

                case "TK_OPERATOR":
                    var space_before = !0, space_after = !0;
                    if (flags.var_line && "," === token_text && is_expression(flags.mode) && (flags.var_line_tainted = !1),
                    flags.var_line && "," === token_text) {
                        if (flags.var_line_tainted) {
                            print_token(), print_newline(), output.push(indent_string), flags.var_line_reindented = !0,
                            flags.var_line_tainted = !1;
                            break;
                        }
                        flags.var_line_tainted = !1;
                    }
                    if ("return" === last_text || "throw" === last_text) {
                        print_single_space(), print_token();
                        break;
                    }
                    if (":" === token_text && flags.in_case) {
                        print_token(), print_newline(), flags.in_case = !1;
                        break;
                    }
                    if ("::" === token_text) {
                        print_token();
                        break;
                    }
                    if ("," === token_text) {
                        flags.var_line ? flags.var_line_tainted ? (print_token(), print_newline(), flags.var_line_tainted = !1) : (print_token(),
                        print_single_space()) : "TK_END_BLOCK" === last_type && "(EXPRESSION)" !== flags.mode ? (print_token(),
                        print_newline()) : "BLOCK" === flags.mode ? (print_token(), print_newline()) : (print_token(),
                        print_single_space());
                        break;
                    }
                    in_array(token_text, ["--", "++", "!"]) || in_array(token_text, ["-", "+"]) && (in_array(last_type, ["TK_START_BLOCK", "TK_START_EXPR", "TK_EQUALS", "TK_OPERATOR"]) || in_array(last_text, line_starters)) ? (space_before = !1,
                    space_after = !1, ";" === last_text && is_expression(flags.mode) && (space_before = !0),
                    "TK_WORD" === last_type && in_array(last_text, line_starters) && (space_before = !0),
                    "BLOCK" !== flags.mode || "{" !== last_text && ";" !== last_text || print_newline()) : "." === token_text ? space_before = !1 : ":" === token_text && (is_ternary_op() || (space_before = !1)),
                    space_before && print_single_space(), print_token(), space_after && print_single_space();
                    break;

                case "TK_BLOCK_COMMENT":
                    var lines = token_text.split(/\x0a|\x0d\x0a/);
                    if (/^\/\*\*/.test(token_text)) {
                        print_newline(), output.push(lines[0]);
                        for (var i = 1; i < lines.length; i++) print_newline(), output.push(" "), output.push(lines[i].replace(/^\s\s*|\s\s*$/, ""));
                    } else {
                        lines.length > 1 ? (print_newline(), trim_output()) : print_single_space();
                        for (var i = 0; i < lines.length; i++) output.push(lines[i]), output.push("\n");
                    }
                    print_newline();
                    break;

                case "TK_INLINE_COMMENT":
                    print_single_space(), print_token(), is_expression(flags.mode) ? print_single_space() : print_newline();
                    break;

                case "TK_COMMENT":
                    wanted_newline ? print_newline() : print_single_space(), print_token(), print_newline();
                    break;

                case "TK_UNKNOWN":
                    print_token();
            }
            last_last_text = last_text, last_type = token_type, last_text = token_text;
        }
        return output.join("").replace(/[\n ]+$/, "");
    }
    var define, kmdjs = {}, initializing = !1, fnTest = /xyz/.test(function () { }) ? /\b_super\b/ : /.*/, __class = function () { };
    __class.extend = function (prop) {
        function __class() {
            !initializing && this.init && this.init.apply(this, arguments);
        }
        var _super = this.prototype;
        initializing = !0;
        var prototype = new this();
        initializing = !1;
        for (var name in prop) "statics" != name && (prototype[name] = "function" == typeof prop[name] && "function" == typeof _super[name] && fnTest.test(prop[name]) ? function (name, fn) {
            return function () {
                var tmp = this._super;
                this._super = _super[name];
                var ret = fn.apply(this, arguments);
                return this._super = tmp, ret;
            };
        }(name, prop[name]) : prop[name]);
        for (var key in this) this.hasOwnProperty(key) && "extend" != key && (__class[key] = this[key]);
        if (prop.statics) for (var item in prop.statics) prop.statics.hasOwnProperty(item) && (__class[item] = prop.statics[item]);
        return __class.prototype = prototype, __class.prototype.constructor = __class, __class.extend = arguments.callee,
        __class;
    };
    var currentlyAddingScript, cBaseUrl, dataMain, ProjName, doc = document, data = {}, head = doc.head || doc.getElementsByTagName("head")[0] || doc.documentElement, baseElement = head.getElementsByTagName("base")[0], isView = !1, isDebug = !1, isBuild = !1, modules = {}, classList = [], baseUrl = getBaseUrl(), mapping = {}, nsmp = {}, pendingModules = (!("undefined" == typeof window || "undefined" == typeof navigator || !window.document),
    []), kmdmdinfo = [], checkModules = {}, isString = (isType("Object"), isType("String")), isFunction = (Array.isArray || isType("Array"),
    isType("Function")), isBoolean = isType("Boolean");
    define = function (name, deps, foctory) {
        var argc = arguments.length;
        if (1 == argc) throw "the class must take a name";
        2 == argc ? (foctory = deps, deps = []) : isString(deps) && (deps = [deps]);
        var mda = name.split(":"), fullname = mda[0], lastIndex = lastIndexOf(fullname, ".");
        -1 == lastIndex && (fullname = ProjName + "." + fullname, lastIndex = lastIndexOf(fullname, "."));
        var baseClass = 1 == mda.length ? "__class" : ' __modules["' + mda[1] + '"]', className = fullname.substring(lastIndex + 1, fullname.length);
        deps.unshift(fullname.substring(0, lastIndex)), isInArray(deps, ProjName) || deps.unshift(ProjName),
        refrence2(className, deps, "var " + className + "=" + baseClass + ".extend(" + stringifyWithFuncs(foctory) + ");return " + className + ";", fullname);
    }, define.build = function () {
        isBuild = !0, define.apply(null, arguments);
    }, define.view = function () {
        isView = !0, define.apply(null, arguments);
    }, kmdjs.get = function (fullname) {
        function catchAllDep(md) {
            md && md.d && each(md.d, function (item) {
                isInArray(arr, item) && remove(arr, item), arr.push(item);
                var next;
                each(kmdmdinfo, function (item2) {
                    item2.c == item && (next = item2);
                }), catchAllDep(next);
            });
        }
        var result;
        if (each(kmdmdinfo, function (item) {
            return item.c == fullname ? (result = item, !1) : undefined;
        }), !result) return null;
        var arr = [];
        arr.push(result.c), catchAllDep(result);
        var buildArr = [];
        return each(arr, function (item2) {
            each(kmdmdinfo, function (item) {
                if (item.c == item2) {
                    buildArr.push(item);
                    var moduleArr = [], fnResult = Function(item.a, item.b);
                    for (i = 0; i < item.d.length; i++) moduleArr.push(modules[item.d[i]]);
                    var obj = fnResult.apply(null, moduleArr);
                    modules[item.c] = obj;
                }
            });
        }), modules[fullname];
    };
    var kmdmaincpt = !1;
    define.pendingModules = pendingModules, request(baseUrl + dataMain + ".js", function () { }),
    kmdjs.config = function (option) {
        ProjName = option.name, cBaseUrl = option.baseUrl;
        for (var i = 0; i < option.classes.length; i++) {
            var item = option.classes[i];
            classList.push(item.name);
            var arr = item.name.split(".");
            mapping[item.name] = cBaseUrl + "/" + (item.url ? item.url + "/" : "") + arr[arr.length - 1] + ".js",
            nsmp[arr[arr.length - 1]] = item.name;
        }
    }, global.__class = __class, define.modules = global.__modules = modules, global.define = define,
    global.kmdjs = kmdjs;
}("object" != typeof JSON ? {} : JSON, this);
