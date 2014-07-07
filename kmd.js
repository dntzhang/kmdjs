/* KMD.js Kill AMD and CMD
 * By 当耐特 http://weibo.com/iamleizhang
 * KMD.js http://kmdjs.github.io/
 * blog: http://www.cnblogs.com/iamzhanglei/
 * My website:http://htmlcssjs.duapp.com/
 * Many thanks to https://github.com/mishoo/UglifyJS2 and http://raphaeljs.com/   
 * MIT Licensed.
 */
!function(JSON, global, undefined) {
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
        supportOnload ? (node.onload = onload, node.onerror = function() {
            throw "bad request!__" + url + "  404 (Not Found) ";
        }) : node.onreadystatechange = function() {
            /loaded|complete/.test(node.readyState) && onload();
        };
    }
    function getCurrentScript() {
        if (currentlyAddingScript) return currentlyAddingScript;
        if (interactiveScript && "interactive" === interactiveScript.readyState) return interactiveScript;
        for (var scripts = head.getElementsByTagName("script"), i = scripts.length - 1; i >= 0; i--) {
            var script = scripts[i];
            if ("interactive" === script.readyState) return interactiveScript = script;
        }
    }
    function isType(type) {
        return function(obj) {
            return Object.prototype.toString.call(obj) === "[object " + type + "]";
        };
    }
    function compressor(fn) {
        var ast = UglifyJS.parse("" + fn);
        ast.figure_out_scope();
        var sq = UglifyJS.Compressor(), compressed_ast = ast.transform(sq);
        compressed_ast.compute_char_frequency(), compressed_ast.mangle_names();
        var code = compressed_ast.print_to_string();
        return code;
    }
    function refrence(className, deps, foctory, fullname) {
        var body = foctory.replace(/"function[\s\S]*?\}"/g, function(str) {
            return str.substr(1, str.length - 2);
        }).replace(/(\\r)?\\n(\\t)?([\s]*?)\/\/([\s\S]*?)(?=(\\r)?\\n(\\t)?)/g, "").replace(/(\/\*[\s\S]*\*\/)/g, "").replace(/\\r\\n/g, "").replace(/\\n/g, "").replace(/\\t/g, "").replace(/\\/g, "");
        body = js_beautify(body), isDebug && log(body + "\n//@ sourceURL=" + (className || "anonymous") + ".js");
        var fn = Function(body);
        if (isBuild || isMDBuild) {
            var entire = compressor(fn);
            body = entire.substring(entire.indexOf("{") + 1, entire.lastIndexOf("}"));
        }
        var ref = getRef(fn);
        getLazyMd(fn), remove(ref, "__class"), rLen = ref.length;
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
        if (each(kmdmdinfo, function(item) {
            return item.c == fullname ? (isPush = !0, !1) : undefined;
        }), isPush || kmdmdinfo.push({
            a: moduleNameArr,
            b: body,
            c: fullname,
            d: newArr
        }), checkModules[fullname] = 1, 0 != rLen || isBuild) for (var k = 0; rLen > k; k++) {
            var ns = nsmp[ref[k]];
            allPending.push(ns), function(ns) {
                request(mapping[ns], function() {
                    remove(allPending, ns), currentPendingModuleFullName.length > 0 ? checkModuleCpt() : checkMainCpt();
                });
            }(ns);
        } else currentPendingModuleFullName.length > 0 ? checkModuleCpt() : checkMainCpt();
        window.allPending = allPending;
    }
    function getBuildArr(fns) {
        var buildArrs = [];
        return each(fns, function(currentFullname) {
            function catchAllDep(md) {
                pendingCount++, md && isInArray(arr, md.c) && remove(arr, md.c), md && arr.push(md.c), 
                md && md.d.length > 0 ? (each(md.d, function(item) {
                    isInArray(arr, item) && remove(arr, item), arr.push(item);
                    var next;
                    each(kmdmdinfo, function(item2) {
                        return item2.c == item ? (next = item2, !1) : undefined;
                    }), next && catchAllDep(next);
                }), pendingCount--) : pendingCount--;
            }
            var mainDep;
            each(kmdmdinfo, function(item) {
                item.c == currentFullname && (mainDep = item);
            });
            var arr = [], pendingCount = 0;
            catchAllDep(mainDep);
            var buildArr = [];
            each(arr, function(item2) {
                each(kmdmdinfo, function(item) {
                    if (item.c == item2) {
                        buildArr.push(item);
                        var moduleArr = [], fnResult = Function(item.a, item.b);
                        for (i = 0; i < item.d.length; i++) moduleArr.push(modules[item.d[i]]);
                        var obj = fnResult.apply(null, moduleArr);
                        modules[item.c] = obj;
                    }
                });
            }), buildArrs.push({
                name: currentFullname,
                buildArr: buildArr
            });
        }), buildArrs;
    }
    function checkModuleCpt() {
        if (!(allPending.length > 0) && 0 != currentPendingModuleFullName.length) {
            pendingModules.length = 0, checkModules = {};
            var buildArrs = [];
            each(currentPendingModuleFullName, function(currentFullname) {
                function catchAllDep(md) {
                    pendingCount++, md && isInArray(arr, md.c) && remove(arr, md.c), md && arr.push(md.c), 
                    md && md.d.length > 0 ? (each(md.d, function(item) {
                        isInArray(arr, item) && remove(arr, item), arr.push(item);
                        var next;
                        each(kmdmdinfo, function(item2) {
                            return item2.c == item ? (next = item2, !1) : undefined;
                        }), next && catchAllDep(next);
                    }), pendingCount--) : pendingCount--;
                }
                var mainDep;
                each(kmdmdinfo, function(item) {
                    item.c == currentFullname && (mainDep = item);
                });
                var arr = [], pendingCount = 0;
                catchAllDep(mainDep);
                var buildArr = [];
                each(arr, function(item2) {
                    each(kmdmdinfo, function(item) {
                        if (item.c == item2) {
                            buildArr.push(item);
                            var moduleArr = [], fnResult = Function(item.a, item.b);
                            for (i = 0; i < item.d.length; i++) moduleArr.push(modules[item.d[i]]);
                            var obj = fnResult.apply(null, moduleArr);
                            modules[item.c] = obj;
                        }
                    });
                }), buildArrs.push({
                    name: currentFullname,
                    buildArr: buildArr
                });
            }), setTimeout(function() {
                for (var mdArr = [], i = 0, len = currentPendingModuleFullName.length; len > i; i++) modules[currentPendingModuleFullName[i]] && mdArr.push(modules[currentPendingModuleFullName[i]]);
                currentPendingModuleFullName.length = 0, define.pendingCallback && define.pendingCallback.apply(null, mdArr);
            }, 0), isMDBuild && (each(buildArrs, function(item) {
                var ctt = doc.createElement("div"), msgDiv = doc.createElement("div"), titleDiv = doc.createElement("div");
                titleDiv.innerHTML = "Build Complete!", msgDiv.innerHTML = item.name + ".js";
                var codePanel = doc.createElement("textarea");
                ctt.appendChild(titleDiv), ctt.appendChild(codePanel), ctt.appendChild(msgDiv), 
                doc.body.appendChild(ctt), codePanel.setAttribute("rows", "25"), codePanel.setAttribute("cols", "45");
                var cpCode = "kmdjs.exec(" + JSON.stringify(item.buildArr).replace(/\s+/g, " ") + ")";
                codePanel.value = cpCode, codePanel.focus(), codePanel.select(), downloadFile(cpCode, item.name + ".js");
            }), isMDBuild = !1);
        }
    }
    function downloadFile(code, fileName) {
        if (window.URL.createObjectURL) {
            var fileParts = [ code ], bb = new Blob(fileParts, {
                type: "text/plain"
            }), dnlnk = window.URL.createObjectURL(bb), dlLink = document.createElement("a");
            dlLink.setAttribute("href", dnlnk), dlLink.setAttribute("download", fileName), dlLink.click();
        }
    }
    function checkMainCpt() {
        function catchAllDep(md) {
            pendingCount++, md && isInArray(arr, md.c) && remove(arr, md.c), md && arr.push(md.c), 
            md && md.d.length > 0 ? (each(md.d, function(item) {
                isInArray(arr, item) && remove(arr, item), arr.push(item);
                var next;
                each(kmdmdinfo, function(item2) {
                    return item2.c == item ? (next = item2, !1) : undefined;
                }), next && catchAllDep(next);
            }), pendingCount--) : pendingCount--;
        }
        if (!(allPending.length > 0 || kmdmaincpt)) {
            kmdmaincpt = !0, pendingModules.length = 0, checkModules = {};
            var mainDep;
            each(kmdmdinfo, function(item) {
                item.c == ProjName + ".Main" && (mainDep = item);
            });
            var arr = [], pendingCount = 0;
            catchAllDep(mainDep, 0);
            var buildArr = [];
            if (each(arr, function(item2) {
                each(kmdmdinfo, function(item) {
                    if (item.c == item2) {
                        buildArr.push(item);
                        var moduleArr = [], fnResult = Function(item.a, item.b);
                        for (i = 0; i < item.d.length; i++) moduleArr.push(modules[item.d[i]]);
                        var obj = fnResult.apply(null, moduleArr);
                        modules[item.c] = obj;
                    }
                });
            }), setTimeout(function() {
                new modules[ProjName + ".Main"]();
            }, 0), isBuild) {
                var ctt = doc.createElement("div"), msgDiv = doc.createElement("div"), titleDiv = doc.createElement("div");
                titleDiv.innerHTML = "Build Complete!", msgDiv.innerHTML = ProjName + ".js ";
                var codePanel = doc.createElement("textarea");
                ctt.appendChild(titleDiv), ctt.appendChild(codePanel), ctt.appendChild(msgDiv), 
                doc.body.appendChild(ctt), codePanel.setAttribute("rows", "8"), codePanel.setAttribute("cols", "55");
                var cpCode = '(function(n){function l(n,t,u){var f=i.createElement("script"),s;u&&(s=isFunction(u)?u(n):u,s&&(f.charset=s)),a(f,t,n),f.async=!0,f.src=n,o=f,e?r.insertBefore(f,e):r.appendChild(f),o=null}function a(n,t,i){function u(i){n.onload=n.onerror=n.onreadystatechange=null,c.debug||r.removeChild(n),n=null,t(i)}var f="onload"in n;f?(n.onload=u,n.onerror=function(){throw"bad request!__"+i+"  404 (Not Found) ";}):n.onreadystatechange=function(){/loaded|complete/.test(n.readyState)&&u()}}function v(n,t){var r,i;if(n.lastIndexOf)return n.lastIndexOf(t);for(r=t.length,i=n.length-1-r;i>-1;i--)if(t===n.substr(i,r))return i;return-1}var h="' + ProjName + '",i=document,c={},r=i.head||i.getElementsByTagName("head")[0]||i.documentElement,e=r.getElementsByTagName("base")[0],o,u={},t;u.get=function(n,i){var f,e,o,u,r,s;for(typeof n=="string"&&(n=[n]),r=0,u=n.length;r<u;r++)v(n[r],".")==-1&&(n[r]=h+"."+n[r]);for(f=!0,e=[],r=0,u=n.length;r<u;r++)t.modules[n[r]]?e.push(t.modules[n[r]]):f=!1;if(f)i.apply(null,e);else for(o=0,u=n.length,r=0;r<u;r++)s=[],l(n[r]+".js",function(){if(o++,o==u){for(var r=0;r<u;r++)t.modules[n[r]]&&s.push(t.modules[n[r]]);i.apply(null,s)}})},u.exec=function(n){for(var u,o,s,r=0,f=n.length;r<f;r++){var i=n[r],e=[],h=new Function(i.a,i.b);for(u=0,o=i.d.length;u<o;u++)e.push(t.modules[i.d[u]]);s=h.apply(null,e),t.modules[i.c]=s}},n.kmdjs=u;var f=!1,y=/xyz/.test(function(){xyz})?/\b_super\b/:/.*/,s=function(){};s.extend=function(n){function i(){!f&&this.init&&this.init.apply(this,arguments)}var o=this.prototype,e,t,r,u;f=!0,e=new this,f=!1;for(t in n)t!="statics"&&(e[t]=typeof n[t]=="function"&&typeof o[t]=="function"&&y.test(n[t])?function(n,t){return function(){var r=this._super,i;return this._super=o[n],i=t.apply(this,arguments),this._super=r,i}}(t,n[t]):n[t]);for(r in this)this.hasOwnProperty(r)&&r!="extend"&&(i[r]=this[r]);if(n.statics)for(u in n.statics)n.statics.hasOwnProperty(u)&&(i[u]=n.statics[u]);return i.prototype=e,i.prototype.constructor=i,i.extend=arguments.callee,i},n.__class=s,t={},t.modules={},t.all=' + JSON.stringify(buildArr).replace(/\s+/g, " ") + ',u.exec(t.all),new t.modules["' + ProjName + '.Main"]})(this)';
                codePanel.value = cpCode, codePanel.focus(), codePanel.select(), downloadFile(cpCode, ProjName + ".Main.js");
                var lmclone = [];
                each(lazyMdArr, function(item) {
                    lmclone.push(item);
                }), kmdjs.get(lazyMdArr, function() {
                    var lzBuildArrs = getBuildArr(lmclone);
                    each(lzBuildArrs, function(item) {
                        var ctt = doc.createElement("div"), msgDiv = doc.createElement("div");
                        msgDiv.innerHTML = item.name + ".js ";
                        var codePanel = doc.createElement("textarea");
                        ctt.appendChild(codePanel), ctt.appendChild(msgDiv), doc.body.appendChild(ctt), 
                        codePanel.setAttribute("rows", "8"), codePanel.setAttribute("cols", "55");
                        var cpCode = "kmdjs.exec(" + JSON.stringify(item.buildArr).replace(/\s+/g, " ") + ")";
                        codePanel.value = cpCode, downloadFile(cpCode, item.name + ".js");
                    });
                });
            }
            if (isView) {
                var holder = document.createElement("div");
                holder.setAttribute("id", "holder"), document.body.appendChild(holder);
                for (var data = [], i = 0, len = buildArr.length; len > i; i++) {
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
        Object.prototype.toJSON = function() {
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
        return Object.prototype.hasOwnProperty.call(vars, "$" + name) ? !0 : scope.parent_scope ? isInScopeChainVariables(scope.parent_scope, name) : !1;
    }
    function getLazyMd(fn) {
        var fnStr = "" + fn, aa = fnStr.match(/kmdjs.get\([\s\S]*?\)/g);
        if (aa) for (var i = 0, len = aa.length; len > i; i++) {
            var item = aa[i].replace(/\"|\'/g, ""), l2 = lastIndexOf(item, "]"), l1 = lastIndexOf(item, "[") + 1;
            if (-1 != l2) {
                var md = item.substring(l1, l2).split(",");
                each(md, function(item2) {
                    item2 = item2.trim(), -1 == lastIndexOf(item2, ".") && (item2 = ProjName + "." + item2), 
                    isInArray(lazyMdArr, item2) || lazyMdArr.push(item2);
                });
            } else {
                var matchMd = aa[i].match(/("\w*")|('\w*')/), md = matchMd[0].replace(/\"|\'/g, "");
                -1 == lastIndexOf(md, ",") && (md = ProjName + "." + md), isInArray(lazyMdArr, md) || lazyMdArr.push(md);
            }
        }
    }
    function getRef(fn) {
        var U2 = UglifyJS, ast = U2.parse("" + fn);
        ast.figure_out_scope();
        var result = [];
        return ast.walk(new U2.TreeWalker(function(node) {
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
        } catch (ex) {}
    }
    function getBaseUrl() {
        for (var baseUrl, scripts = doc.getElementsByTagName("script"), i = 0, len = scripts.length; len > i; i++) {
            var scrp = scripts[i], srcL = scrp.getAttribute("src");
            if (srcL) {
                var src = srcL.toUpperCase(), arr = src.match(/\bKMD\b/g);
                if (arr) {
                    var m2 = src.match(/DEBUG/g);
                    m2 && (isDebug = !0);
                    var arr = src.split("/");
                    arr.pop(), baseUrl = arr.length ? arr.join("/") + "/" : "./";
                    var dm = scrp.getAttribute("data-main"), arr2 = dm.split("?");
                    dataMain = arr2[0], dataMain = dataMain.replace(/.js/g, ""), arr2.length > 1 && ("build" == arr2[1] ? isBuild = !0 : isView = !0);
                    break;
                }
            }
        }
        return baseUrl;
    }
    function js_beautify(js_source_text, options) {
        function trim_output() {
            for (;output.length && (" " === output[output.length - 1] || output[output.length - 1] === indent_string); ) output.pop();
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
            if (n_newlines = 0, parser_pos >= input_length) return [ "", "TK_EOF" ];
            wanted_newline = !1;
            var c = input.charAt(parser_pos);
            parser_pos += 1;
            var keep_whitespace = opt_keep_array_indentation && is_array(flags.mode);
            if (keep_whitespace) {
                for (var whitespace_count = 0; in_array(c, whitespace); ) {
                    if ("\n" === c ? (trim_output(), output.push("\n"), just_added_newline = !0, whitespace_count = 0) : whitespace_count += "	" === c ? 4 : 1, 
                    parser_pos >= input_length) return [ "", "TK_EOF" ];
                    c = input.charAt(parser_pos), parser_pos += 1;
                }
                if (-1 === flags.indentation_baseline && (flags.indentation_baseline = whitespace_count), 
                just_added_newline) {
                    for (var i = 0; i < flags.indentation_level + 1; i += 1) output.push(indent_string);
                    if (-1 !== flags.indentation_baseline) for (var i = 0; i < whitespace_count - flags.indentation_baseline; i++) output.push(" ");
                }
            } else {
                for (;in_array(c, whitespace); ) {
                    if ("\n" === c && (n_newlines += 1), parser_pos >= input_length) return [ "", "TK_EOF" ];
                    c = input.charAt(parser_pos), parser_pos += 1;
                }
                if (opt_preserve_newlines && n_newlines > 1) for (var i = 0; n_newlines > i; i += 1) print_newline(0 === i), 
                just_added_newline = !0;
                wanted_newline = n_newlines > 0;
            }
            if (in_array(c, wordchar)) {
                if (input_length > parser_pos) for (;in_array(input.charAt(parser_pos), wordchar) && (c += input.charAt(parser_pos), 
                parser_pos += 1, parser_pos !== input_length); ) ;
                if (parser_pos !== input_length && c.match(/^[0-9]+[Ee]$/) && ("-" === input.charAt(parser_pos) || "+" === input.charAt(parser_pos))) {
                    var sign = input.charAt(parser_pos);
                    parser_pos += 1;
                    var t = get_next_token(parser_pos);
                    return c += sign + t[0], [ c, "TK_WORD" ];
                }
                return "in" === c ? [ c, "TK_OPERATOR" ] : (!wanted_newline || "TK_OPERATOR" === last_type || flags.if_line || !opt_preserve_newlines && "var" === last_text || print_newline(), 
                [ c, "TK_WORD" ]);
            }
            if ("(" === c || "[" === c) return [ c, "TK_START_EXPR" ];
            if (")" === c || "]" === c) return [ c, "TK_END_EXPR" ];
            if ("{" === c) return [ c, "TK_START_BLOCK" ];
            if ("}" === c) return [ c, "TK_END_BLOCK" ];
            if (";" === c) return [ c, "TK_SEMICOLON" ];
            if ("/" === c) {
                var comment = "", inline_comment = !0;
                if ("*" === input.charAt(parser_pos)) {
                    if (parser_pos += 1, input_length > parser_pos) for (;("*" !== input.charAt(parser_pos) || !input.charAt(parser_pos + 1) || "/" !== input.charAt(parser_pos + 1)) && input_length > parser_pos && (c = input.charAt(parser_pos), 
                    comment += c, ("\r" === c || "\n" === c) && (inline_comment = !1), parser_pos += 1, 
                    !(parser_pos >= input_length)); ) ;
                    return parser_pos += 2, inline_comment ? [ "/*" + comment + "*/", "TK_INLINE_COMMENT" ] : [ "/*" + comment + "*/", "TK_BLOCK_COMMENT" ];
                }
                if ("/" === input.charAt(parser_pos)) {
                    for (comment = c; "\r" !== input.charAt(parser_pos) && "\n" !== input.charAt(parser_pos) && (comment += input.charAt(parser_pos), 
                    parser_pos += 1, !(parser_pos >= input_length)); ) ;
                    return parser_pos += 1, wanted_newline && print_newline(), [ comment, "TK_COMMENT" ];
                }
            }
            if ("'" === c || '"' === c || "/" === c && ("TK_WORD" === last_type && in_array(last_text, [ "return", "do" ]) || "TK_START_EXPR" === last_type || "TK_START_BLOCK" === last_type || "TK_END_BLOCK" === last_type || "TK_OPERATOR" === last_type || "TK_EQUALS" === last_type || "TK_EOF" === last_type || "TK_SEMICOLON" === last_type)) {
                var sep = c, esc = !1, resulting_string = c;
                if (input_length > parser_pos) if ("/" === sep) {
                    for (var in_char_class = !1; esc || in_char_class || input.charAt(parser_pos) !== sep; ) if (resulting_string += input.charAt(parser_pos), 
                    esc ? esc = !1 : (esc = "\\" === input.charAt(parser_pos), "[" === input.charAt(parser_pos) ? in_char_class = !0 : "]" === input.charAt(parser_pos) && (in_char_class = !1)), 
                    parser_pos += 1, parser_pos >= input_length) return [ resulting_string, "TK_STRING" ];
                } else for (;esc || input.charAt(parser_pos) !== sep; ) if (resulting_string += input.charAt(parser_pos), 
                esc = esc ? !1 : "\\" === input.charAt(parser_pos), parser_pos += 1, parser_pos >= input_length) return [ resulting_string, "TK_STRING" ];
                if (parser_pos += 1, resulting_string += sep, "/" === sep) for (;input_length > parser_pos && in_array(input.charAt(parser_pos), wordchar); ) resulting_string += input.charAt(parser_pos), 
                parser_pos += 1;
                return [ resulting_string, "TK_STRING" ];
            }
            if ("#" === c) {
                var sharp = "#";
                if (input_length > parser_pos && in_array(input.charAt(parser_pos), digits)) {
                    do c = input.charAt(parser_pos), sharp += c, parser_pos += 1; while (input_length > parser_pos && "#" !== c && "=" !== c);
                    return "#" === c || ("[" == input.charAt(parser_pos) && "]" === input.charAt(parser_pos + 1) ? (sharp += "[]", 
                    parser_pos += 2) : "{" == input.charAt(parser_pos) && "}" === input.charAt(parser_pos + 1) && (sharp += "{}", 
                    parser_pos += 2)), [ sharp, "TK_WORD" ];
                }
            }
            if ("<" === c && "<!--" === input.substring(parser_pos - 1, parser_pos + 3)) return parser_pos += 3, 
            flags.in_html_comment = !0, [ "<!--", "TK_COMMENT" ];
            if ("-" === c && flags.in_html_comment && "-->" === input.substring(parser_pos - 1, parser_pos + 2)) return flags.in_html_comment = !1, 
            parser_pos += 2, wanted_newline && print_newline(), [ "-->", "TK_COMMENT" ];
            if (in_array(c, punct)) {
                for (;input_length > parser_pos && in_array(c + input.charAt(parser_pos), punct) && (c += input.charAt(parser_pos), 
                parser_pos += 1, !(parser_pos >= input_length)); ) ;
                return "=" === c ? [ c, "TK_EQUALS" ] : [ c, "TK_OPERATOR" ];
            }
            return [ c, "TK_UNKNOWN" ];
        }
        var input, output, token_text, last_type, last_text, last_last_text, last_word, flags, flag_store, indent_string, whitespace, wordchar, punct, parser_pos, line_starters, digits, prefix, token_type, do_block_just_closed, wanted_newline, just_added_newline, n_newlines;
        options = options ? options : {};
        var opt_braces_on_own_line = options.braces_on_own_line ? options.braces_on_own_line : !1, opt_indent_size = options.indent_size ? options.indent_size : 4, opt_indent_char = options.indent_char ? options.indent_char : " ", opt_preserve_newlines = undefined === options.preserve_newlines ? !0 : options.preserve_newlines, opt_indent_level = options.indent_level ? options.indent_level : 0, opt_space_after_anon_function = "undefined" === options.space_after_anon_function ? !1 : options.space_after_anon_function, opt_keep_array_indentation = undefined === options.keep_array_indentation ? !0 : options.keep_array_indentation;
        just_added_newline = !1;
        var input_length = js_source_text.length;
        for (indent_string = ""; opt_indent_size > 0; ) indent_string += opt_indent_char, 
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
                prefix = "NONE", "TK_END_BLOCK" === last_type ? in_array(token_text.toLowerCase(), [ "else", "catch", "finally" ]) ? opt_braces_on_own_line ? prefix = "NEWLINE" : (prefix = "SPACE", 
                print_single_space()) : prefix = "NEWLINE" : "TK_SEMICOLON" !== last_type || "BLOCK" !== flags.mode && "DO_BLOCK" !== flags.mode ? "TK_SEMICOLON" === last_type && is_expression(flags.mode) ? prefix = "SPACE" : "TK_STRING" === last_type ? prefix = "NEWLINE" : "TK_WORD" === last_type ? prefix = "SPACE" : "TK_START_BLOCK" === last_type ? prefix = "NEWLINE" : "TK_END_EXPR" === last_type && (print_single_space(), 
                prefix = "NEWLINE") : prefix = "NEWLINE", "TK_END_BLOCK" !== last_type && in_array(token_text.toLowerCase(), [ "else", "catch", "finally" ]) ? print_newline() : in_array(token_text, line_starters) || "NEWLINE" === prefix ? "else" === last_text ? print_single_space() : ("TK_START_EXPR" !== last_type && "=" !== last_text && "," !== last_text || "function" !== token_text) && ("return" === last_text || "throw" === last_text ? print_single_space() : "TK_END_EXPR" !== last_type ? "TK_START_EXPR" === last_type && "var" === token_text || ":" === last_text || ("if" === token_text && "else" === last_word && "{" !== last_text ? print_single_space() : print_newline()) : in_array(token_text, line_starters) && ")" !== last_text && print_newline()) : "SPACE" === prefix && print_single_space(), 
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
                in_array(token_text, [ "--", "++", "!" ]) || in_array(token_text, [ "-", "+" ]) && (in_array(last_type, [ "TK_START_BLOCK", "TK_START_EXPR", "TK_EQUALS", "TK_OPERATOR" ]) || in_array(last_text, line_starters)) ? (space_before = !1, 
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
    !function(view) {
        "use strict";
        if (view.URL = view.URL || view.webkitURL, view.Blob && view.URL) try {
            return new Blob(), undefined;
        } catch (e) {}
        var BlobBuilder = view.BlobBuilder || view.WebKitBlobBuilder || view.MozBlobBuilder || function(view) {
            var get_class = function(object) {
                return Object.prototype.toString.call(object).match(/^\[object\s(.*)\]$/)[1];
            }, FakeBlobBuilder = function() {
                this.data = [];
            }, FakeBlob = function(data, type, encoding) {
                this.data = data, this.size = data.length, this.type = type, this.encoding = encoding;
            }, FBB_proto = FakeBlobBuilder.prototype, FB_proto = FakeBlob.prototype, FileReaderSync = view.FileReaderSync, FileException = function(type) {
                this.code = this[this.name = type];
            }, file_ex_codes = "NOT_FOUND_ERR SECURITY_ERR ABORT_ERR NOT_READABLE_ERR ENCODING_ERR NO_MODIFICATION_ALLOWED_ERR INVALID_STATE_ERR SYNTAX_ERR".split(" "), file_ex_code = file_ex_codes.length, real_URL = view.URL || view.webkitURL || view, real_create_object_URL = real_URL.createObjectURL, real_revoke_object_URL = real_URL.revokeObjectURL, URL = real_URL, btoa = view.btoa, atob = view.atob, ArrayBuffer = view.ArrayBuffer, Uint8Array = view.Uint8Array;
            for (FakeBlob.fake = FB_proto.fake = !0; file_ex_code--; ) FileException.prototype[file_ex_codes[file_ex_code]] = file_ex_code + 1;
            return real_URL.createObjectURL || (URL = view.URL = {}), URL.createObjectURL = function(blob) {
                var data_URI_header, type = blob.type;
                return null === type && (type = "application/octet-stream"), blob instanceof FakeBlob ? (data_URI_header = "data:" + type, 
                "base64" === blob.encoding ? data_URI_header + ";base64," + blob.data : "URI" === blob.encoding ? data_URI_header + "," + decodeURIComponent(blob.data) : btoa ? data_URI_header + ";base64," + btoa(blob.data) : data_URI_header + "," + encodeURIComponent(blob.data)) : real_create_object_URL ? real_create_object_URL.call(real_URL, blob) : undefined;
            }, URL.revokeObjectURL = function(object_URL) {
                "data:" !== object_URL.substring(0, 5) && real_revoke_object_URL && real_revoke_object_URL.call(real_URL, object_URL);
            }, FBB_proto.append = function(data) {
                var bb = this.data;
                if (Uint8Array && (data instanceof ArrayBuffer || data instanceof Uint8Array)) {
                    for (var str = "", buf = new Uint8Array(data), i = 0, buf_len = buf.length; buf_len > i; i++) str += String.fromCharCode(buf[i]);
                    bb.push(str);
                } else if ("Blob" === get_class(data) || "File" === get_class(data)) {
                    if (!FileReaderSync) throw new FileException("NOT_READABLE_ERR");
                    var fr = new FileReaderSync();
                    bb.push(fr.readAsBinaryString(data));
                } else data instanceof FakeBlob ? "base64" === data.encoding && atob ? bb.push(atob(data.data)) : "URI" === data.encoding ? bb.push(decodeURIComponent(data.data)) : "raw" === data.encoding && bb.push(data.data) : ("string" != typeof data && (data += ""), 
                bb.push(unescape(encodeURIComponent(data))));
            }, FBB_proto.getBlob = function(type) {
                return arguments.length || (type = null), new FakeBlob(this.data.join(""), type, "raw");
            }, FBB_proto.toString = function() {
                return "[object BlobBuilder]";
            }, FB_proto.slice = function(start, end, type) {
                var args = arguments.length;
                return 3 > args && (type = null), new FakeBlob(this.data.slice(start, args > 1 ? end : this.data.length), type, this.encoding);
            }, FB_proto.toString = function() {
                return "[object Blob]";
            }, FB_proto.close = function() {
                this.size = 0, delete this.data;
            }, FakeBlobBuilder;
        }(view);
        view.Blob = function(blobParts, options) {
            var type = options ? options.type || "" : "", builder = new BlobBuilder();
            if (blobParts) for (var i = 0, len = blobParts.length; len > i; i++) builder.append(blobParts[i]);
            return builder.getBlob(type);
        };
    }("undefined" != typeof self && self || "undefined" != typeof window && window || this.content || this), 
    "function" != typeof Array.prototype.reduce && (Array.prototype.reduce = function(callback, opt_initialValue) {
        "use strict";
        if (null === this || undefined === this) throw new TypeError("Array.prototype.reduce called on null or undefined");
        if ("function" != typeof callback) throw new TypeError(callback + " is not a function");
        var index, value, length = this.length >>> 0, isValueSet = !1;
        for (1 < arguments.length && (value = opt_initialValue, isValueSet = !0), index = 0; length > index; ++index) this.hasOwnProperty(index) && (isValueSet ? value = callback(value, this[index], index, this) : (value = this[index], 
        isValueSet = !0));
        if (!isValueSet) throw new TypeError("Reduce of empty array with no initial value");
        return value;
    }), Array.prototype.filter || (Array.prototype.filter = function(fun) {
        "use strict";
        if (this === void 0 || null === this) throw new TypeError();
        var t = Object(this), len = t.length >>> 0;
        if ("function" != typeof fun) throw new TypeError();
        for (var res = [], thisArg = arguments.length >= 2 ? arguments[1] : void 0, i = 0; len > i; i++) if (i in t) {
            var val = t[i];
            fun.call(thisArg, val, i, t) && res.push(val);
        }
        return res;
    }), function(n) {
        var r, i, o = "0.4.2", e = "hasOwnProperty", f = /[\.\/]/, s = "*", h = function() {}, c = function(n, t) {
            return n - t;
        }, u = {
            n: {}
        }, t = function(n, f) {
            var o, p;
            n += "";
            var e, w = i, v = Array.prototype.slice.call(arguments, 2), s = t.listeners(n), a = 0, l = [], y = {}, h = [], b = r;
            for (r = n, i = 0, o = 0, p = s.length; p > o; o++) "zIndex" in s[o] && (l.push(s[o].zIndex), 
            s[o].zIndex < 0 && (y[s[o].zIndex] = s[o]));
            for (l.sort(c); l[a] < 0; ) if (e = y[l[a++]], h.push(e.apply(f, v)), i) return i = w, 
            h;
            for (o = 0; p > o; o++) if (e = s[o], "zIndex" in e) if (e.zIndex == l[a]) {
                if (h.push(e.apply(f, v)), i) break;
                do if (a++, e = y[l[a]], e && h.push(e.apply(f, v)), i) break; while (e);
            } else y[e.zIndex] = e; else if (h.push(e.apply(f, v)), i) break;
            return i = w, r = b, h.length ? h : null;
        };
        t._events = u, t.listeners = function(n) {
            for (var i, v, o, e, p, h, a = n.split(f), t = u, c = [ t ], l = [], r = 0, y = a.length; y > r; r++) {
                for (h = [], e = 0, p = c.length; p > e; e++) for (t = c[e].n, v = [ t[a[r]], t[s] ], 
                o = 2; o--; ) i = v[o], i && (h.push(i), l = l.concat(i.f || []));
                c = h;
            }
            return l;
        }, t.on = function(n, t) {
            var e, i, r, o;
            if (n += "", "function" != typeof t) return function() {};
            for (e = n.split(f), i = u, r = 0, o = e.length; o > r; r++) i = i.n, i = i.hasOwnProperty(e[r]) && i[e[r]] || (i[e[r]] = {
                n: {}
            });
            for (i.f = i.f || [], r = 0, o = i.f.length; o > r; r++) if (i.f[r] == t) return h;
            return i.f.push(t), function(n) {
                +n == +n && (t.zIndex = +n);
            };
        }, t.f = function(n) {
            var i = [].slice.call(arguments, 1);
            return function() {
                t.apply(null, [ n, null ].concat(i).concat([].slice.call(arguments, 0)));
            };
        }, t.stop = function() {
            i = 1;
        }, t.nt = function(n) {
            return n ? RegExp("(?:\\.|\\/|^)" + n + "(?:\\.|\\/|$)").test(r) : r;
        }, t.nts = function() {
            return r.split(f);
        }, t.off = t.unbind = function(n, i) {
            var a, r, h, v, c, p, o, w, l, y;
            if (!n) return t._events = u = {
                n: {}
            }, undefined;
            for (a = n.split(f), l = [ u ], c = 0, p = a.length; p > c; c++) for (o = 0; o < l.length; o += v.length - 2) {
                if (v = [ o, 1 ], r = l[o].n, a[c] != s) r[a[c]] && v.push(r[a[c]]); else for (h in r) r[e](h) && v.push(r[h]);
                l.splice.apply(l, v);
            }
            for (c = 0, p = l.length; p > c; c++) for (r = l[c]; r.n; ) {
                if (i) {
                    if (r.f) {
                        for (o = 0, w = r.f.length; w > o; o++) if (r.f[o] == i) {
                            r.f.splice(o, 1);
                            break;
                        }
                        r.f.length || delete r.f;
                    }
                    for (h in r.n) if (r.n[e](h) && r.n[h].f) {
                        for (y = r.n[h].f, o = 0, w = y.length; w > o; o++) if (y[o] == i) {
                            y.splice(o, 1);
                            break;
                        }
                        y.length || delete r.n[h].f;
                    }
                } else {
                    delete r.f;
                    for (h in r.n) r.n[e](h) && r.n[h].f && delete r.n[h].f;
                }
                r = r.n;
            }
        }, t.once = function(n, i) {
            var r = function() {
                return t.unbind(n, r), i.apply(this, arguments);
            };
            return t.on(n, r);
        }, t.version = o, t.toString = function() {
            return "You are running Eve " + o;
        }, "undefined" != typeof module && module.exports ? module.exports = t : undefined !== define ? define("eve", [], function() {
            return t;
        }) : n.eve = t;
    }(window || this), function(n, t) {
        "function" == typeof define && define.amd ? define([ "eve" ], function(i) {
            return t(n, i);
        }) : t(n, n.eve);
    }(this, function(n, t) {
        function i(n) {
            var r, u;
            return i.is(n, "function") ? ai ? n() : t.on("raphael.DOMload", n) : i.is(n, tt) ? i._engine.create[v](i, n.splice(0, 3 + i.is(n[0], p))).add(n) : (r = Array.prototype.slice.call(arguments, 0), 
            i.is(r[r.length - 1], "function") ? (u = r.pop(), ai ? u.call(i._engine.create[v](i, r)) : t.on("raphael.DOMload", function() {
                u.call(i._engine.create[v](i, r));
            })) : i._engine.create[v](i, arguments));
        }
        function pt(n) {
            var i, t;
            if ("function" == typeof n || Object(n) !== n) return n;
            i = new n.constructor();
            for (t in n) n[a](t) && (i[t] = pt(n[t]));
            return i;
        }
        function sf(n, t) {
            for (var i = 0, r = n.length; r > i; i++) if (n[i] === t) return n.push(n.splice(i, 1)[0]);
        }
        function it(n, t, i) {
            function r() {
                var o = Array.prototype.slice.call(arguments, 0), u = o.join("␀"), f = r.cache = r.cache || {}, e = r.count = r.count || [];
                return f[a](u) ? (sf(e, u), i ? i(f[u]) : f[u]) : (e.length >= 1e3 && delete f[e.shift()], 
                e.push(u), f[u] = n[v](t, o), i ? i(f[u]) : f[u]);
            }
            return r;
        }
        function oi() {
            return this.hex;
        }
        function br(n, t) {
            for (var i, f = [], r = 0, u = n.length; u - 2 * !t > r; r += 2) i = [ {
                x: +n[r - 2],
                y: +n[r - 1]
            }, {
                x: +n[r],
                y: +n[r + 1]
            }, {
                x: +n[r + 2],
                y: +n[r + 3]
            }, {
                x: +n[r + 4],
                y: +n[r + 5]
            } ], t ? r ? u - 4 == r ? i[3] = {
                x: +n[0],
                y: +n[1]
            } : u - 2 == r && (i[2] = {
                x: +n[0],
                y: +n[1]
            }, i[3] = {
                x: +n[2],
                y: +n[3]
            }) : i[0] = {
                x: +n[u - 2],
                y: +n[u - 1]
            } : u - 4 == r ? i[3] = i[2] : r || (i[0] = {
                x: +n[r],
                y: +n[r + 1]
            }), f.push([ "C", (-i[0].x + 6 * i[1].x + i[2].x) / 6, (-i[0].y + 6 * i[1].y + i[2].y) / 6, (i[1].x + 6 * i[2].x - i[3].x) / 6, (i[1].y + 6 * i[2].y - i[3].y) / 6, i[2].x, i[2].y ]);
            return f;
        }
        function kr(n, t, i, r, u) {
            var f = -3 * t + 9 * i - 9 * r + 3 * u, e = n * f + 6 * t - 12 * i + 6 * r;
            return n * e - 3 * t + 3 * i;
        }
        function vt(n, t, i, r, f, e, o, s, h) {
            var c;
            null == h && (h = 1), h = h > 1 ? 1 : 0 > h ? 0 : h;
            var l = h / 2, a = 0;
            for (c = 0; 12 > c; c++) {
                var v = l * [ -.1252, .1252, -.3678, .3678, -.5873, .5873, -.7699, .7699, -.9041, .9041, -.9816, .9816 ][c] + l, y = kr(v, n, i, f, o), p = kr(v, t, r, e, s), w = y * y + p * p;
                a += [ .2491, .2491, .2335, .2335, .2032, .2032, .1601, .1601, .1069, .1069, .0472, .0472 ][c] * u.sqrt(w);
            }
            return l * a;
        }
        function cf(n, t, i, r, u, f, e, o, s) {
            if (!(0 > s || vt(n, t, i, r, u, f, e, o) < s)) {
                for (var a = 1, l = a / 2, h = a - l, c = vt(n, t, i, r, u, f, e, o, h); y(c - s) > .01; ) l /= 2, 
                h += (s > c ? 1 : -1) * l, c = vt(n, t, i, r, u, f, e, o, h);
                return h;
            }
        }
        function lf(n, t, i, r, u, f, e, s) {
            if (!(o(n, i) < l(u, e) || l(n, i) > o(u, e) || o(t, r) < l(f, s) || l(t, r) > o(f, s))) {
                var p = (n * r - t * i) * (u - e) - (n - i) * (u * s - f * e), w = (n * r - t * i) * (f - s) - (t - r) * (u * s - f * e), a = (n - i) * (f - s) - (t - r) * (u - e);
                if (a) {
                    var v = p / a, y = w / a, h = +v.toFixed(2), c = +y.toFixed(2);
                    if (!(h < +l(n, i).toFixed(2) || h > +o(n, i).toFixed(2) || h < +l(u, e).toFixed(2) || h > +o(u, e).toFixed(2) || c < +l(t, r).toFixed(2) || c > +o(t, r).toFixed(2) || c < +l(f, s).toFixed(2) || c > +o(f, s).toFixed(2))) return {
                        x: v,
                        y: y
                    };
                }
            }
        }
        function di(n, t, r) {
            var u, h, c, d, g, ut = i.bezierBBox(n), ft = i.bezierBBox(t);
            if (!i.isBBoxIntersect(ut, ft)) return r ? 0 : [];
            var et = vt.apply(0, n), ot = vt.apply(0, t), p = o(~~(et / 5), 1), w = o(~~(ot / 5), 1), nt = [], tt = [], rt = {}, it = r ? 0 : [];
            for (u = 0; p + 1 > u; u++) h = i.findDotsAtSegment.apply(i, n.concat(u / p)), nt.push({
                x: h.x,
                y: h.y,
                t: u / p
            });
            for (u = 0; w + 1 > u; u++) h = i.findDotsAtSegment.apply(i, t.concat(u / w)), tt.push({
                x: h.x,
                y: h.y,
                t: u / w
            });
            for (u = 0; p > u; u++) for (c = 0; w > c; c++) {
                var e = nt[u], a = nt[u + 1], s = tt[c], v = tt[c + 1], b = y(a.x - e.x) < .001 ? "y" : "x", k = y(v.x - s.x) < .001 ? "y" : "x", f = lf(e.x, e.y, a.x, a.y, s.x, s.y, v.x, v.y);
                if (f) {
                    if (rt[f.x.toFixed(4)] == f.y.toFixed(4)) continue;
                    rt[f.x.toFixed(4)] = f.y.toFixed(4), d = e.t + y((f[b] - e[b]) / (a[b] - e[b])) * (a.t - e.t), 
                    g = s.t + y((f[k] - s[k]) / (v[k] - s[k])) * (v.t - s.t), d >= 0 && 1.001 >= d && g >= 0 && 1.001 >= g && (r ? it++ : it.push({
                        x: f.x,
                        y: f.y,
                        t1: l(d, 1),
                        t2: l(g, 1)
                    }));
                }
            }
            return it;
        }
        function gi(n, t, r) {
            var e, o, s, h, b, k, d, g, c, l, y, p, nt, a, w, tt, v, u, f, it;
            for (n = i._path2curve(n), t = i._path2curve(t), y = r ? 0 : [], p = 0, nt = n.length; nt > p; p++) if (a = n[p], 
            "M" == a[0]) e = b = a[1], o = k = a[2]; else for ("C" == a[0] ? (c = [ e, o ].concat(a.slice(1)), 
            e = c[6], o = c[7]) : (c = [ e, o, e, o, b, k, b, k ], e = b, o = k), w = 0, tt = t.length; tt > w; w++) if (v = t[w], 
            "M" == v[0]) s = d = v[1], h = g = v[2]; else if ("C" == v[0] ? (l = [ s, h ].concat(v.slice(1)), 
            s = l[6], h = l[7]) : (l = [ s, h, s, h, d, g, d, g ], s = d, h = g), u = di(c, l, r), 
            r) y += u; else {
                for (f = 0, it = u.length; it > f; f++) u[f].segment1 = p, u[f].segment2 = w, u[f].bez1 = c, 
                u[f].bez2 = l;
                y = y.concat(u);
            }
            return y;
        }
        function ht(n, t, i, r, u, f) {
            null != n ? (this.a = +n, this.b = +t, this.c = +i, this.d = +r, this.e = +u, this.f = +f) : (this.a = 1, 
            this.b = 0, this.c = 0, this.d = 1, this.e = 0, this.f = 0);
        }
        function eu() {
            return this.x + lt + this.y + lt + this.width + " × " + this.height;
        }
        function gf(n, t, i, r, u, f) {
            function l(n) {
                return ((h * n + o) * n + e) * n;
            }
            function v(n, t) {
                var i = p(n, t);
                return ((a * i + c) * i + s) * i;
            }
            function p(n, t) {
                for (var r, u, f, s, i = n, c = 0; 8 > c; c++) {
                    if (f = l(i) - n, y(f) < t) return i;
                    if (s = (3 * h * i + 2 * o) * i + e, y(s) < 1e-6) break;
                    i -= f / s;
                }
                if (r = 0, u = 1, i = n, r > i) return r;
                if (i > u) return u;
                for (;u > r; ) {
                    if (f = l(i), y(f - n) < t) return i;
                    n > f ? r = i : u = i, i = (u - r) / 2 + r;
                }
                return i;
            }
            var e = 3 * t, o = 3 * (r - t) - e, h = 1 - e - o, s = 3 * i, c = 3 * (u - i) - s, a = 1 - s - c;
            return v(n, 1 / (200 * f));
        }
        function ft(n, t) {
            var r, i = [], u = {};
            if (this.ms = t, this.times = 1, n) {
                for (r in n) n[a](r) && (u[h(r)] = n[r], i.push(h(r)));
                i.sort(tf);
            }
            this.anim = u, this.top = i[i.length - 1], this.percents = i;
        }
        function kt(n, r, u, e, o, c) {
            var nt, v, et, l, at, dt, ii, tt, vt, gt, yt, d, rt, st, ct, ni, ft, lt;
            u = h(u);
            var it, ot, pt, ti, bt, kt, w = n.ms, y = {}, g = {}, k = {};
            if (e) {
                for (v = 0, et = f.length; et > v; v++) if (nt = f[v], nt.el.id == r.id && nt.anim == n) {
                    nt.percent != u ? (f.splice(v, 1), pt = 1) : ot = nt, r.attr(nt.totalOrigin);
                    break;
                }
            } else e = +g;
            for (v = 0, et = n.percents.length; et > v; v++) {
                if (n.percents[v] == u || n.percents[v] > e * n.top) {
                    u = n.percents[v], bt = n.percents[v - 1] || 0, w = w / n.top * (u - bt), ti = n.percents[v + 1], 
                    it = n.anim[u];
                    break;
                }
                e && r.attr(n.anim[n.percents[v]]);
            }
            if (it) {
                if (ot) ot.initstatus = e, ot.start = new Date() - ot.ms * e; else {
                    for (l in it) if (it[a](l) && (wi[a](l) || r.paper.customAttributes[a](l))) switch (y[l] = r.attr(l), 
                    null == y[l] && (y[l] = bu[l]), g[l] = it[l], wi[l]) {
                      case p:
                        k[l] = (g[l] - y[l]) / w;
                        break;

                      case "colour":
                        y[l] = i.getRGB(y[l]), at = i.getRGB(g[l]), k[l] = {
                            r: (at.r - y[l].r) / w,
                            g: (at.g - y[l].g) / w,
                            b: (at.b - y[l].b) / w
                        };
                        break;

                      case "path":
                        for (dt = wt(y[l], g[l]), ii = dt[1], y[l] = dt[0], k[l] = [], v = 0, et = y[l].length; et > v; v++) for (k[l][v] = [ 0 ], 
                        tt = 1, vt = y[l][v].length; vt > tt; tt++) k[l][v][tt] = (ii[v][tt] - y[l][v][tt]) / w;
                        break;

                      case "transform":
                        if (gt = r._, yt = yf(gt[l], g[l])) for (y[l] = yt.from, g[l] = yt.to, k[l] = [], 
                        k[l].real = !0, v = 0, et = y[l].length; et > v; v++) for (k[l][v] = [ y[l][v][0] ], 
                        tt = 1, vt = y[l][v].length; vt > tt; tt++) k[l][v][tt] = (g[l][v][tt] - y[l][v][tt]) / w; else d = r.matrix || new ht(), 
                        rt = {
                            _: {
                                transform: gt.transform
                            },
                            getBBox: function() {
                                return r.getBBox(1);
                            }
                        }, y[l] = [ d.a, d.b, d.c, d.d, d.e, d.f ], iu(rt, g[l]), g[l] = rt._.transform, 
                        k[l] = [ (rt.matrix.a - d.a) / w, (rt.matrix.b - d.b) / w, (rt.matrix.c - d.c) / w, (rt.matrix.d - d.d) / w, (rt.matrix.e - d.e) / w, (rt.matrix.f - d.f) / w ];
                        break;

                      case "csv":
                        if (st = b(it[l])[ut](vi), ct = b(y[l])[ut](vi), "clip-rect" == l) for (y[l] = ct, 
                        k[l] = [], v = ct.length; v--; ) k[l][v] = (st[v] - y[l][v]) / w;
                        g[l] = st;
                        break;

                      default:
                        for (st = [][s](it[l]), ct = [][s](y[l]), k[l] = [], v = r.paper.customAttributes[l].length; v--; ) k[l][v] = ((st[v] || 0) - (ct[v] || 0)) / w;
                    }
                    if (ni = it.easing, ft = i.easing_formulas[ni], ft || (ft = b(ni).match(wu), ft && 5 == ft.length ? (lt = ft, 
                    ft = function(n) {
                        return gf(n, +lt[1], +lt[2], +lt[3], +lt[4], w);
                    }) : ft = uf), kt = it.start || n.start || +new Date(), nt = {
                        anim: n,
                        percent: u,
                        timestamp: kt,
                        start: kt + (n.del || 0),
                        status: 0,
                        initstatus: e || 0,
                        stop: !1,
                        ms: w,
                        easing: ft,
                        from: y,
                        diff: k,
                        to: g,
                        el: r,
                        callback: it.callback,
                        prev: bt,
                        next: ti,
                        repeat: c || n.times,
                        origin: r.attr(),
                        totalOrigin: o
                    }, f.push(nt), e && !ot && !pt && (nt.stop = !0, nt.start = new Date() - w * e, 
                    1 == f.length)) return or();
                    pt && (nt.start = new Date() - nt.ms * e), 1 == f.length && hu(or);
                }
                t("raphael.anim.start." + r.id, r, n);
            }
        }
        function cu(n) {
            for (var t = 0; t < f.length; t++) f[t].el.paper == n && f.splice(t--, 1);
        }
        var ui, fi, ff, hf, et, bt, rr, ct, fu, g, yt, w, li;
        i.version = "2.1.2", i.eve = t;
        var ai, c, vi = /[, ]+/, lu = {
            circle: 1,
            rect: 1,
            path: 1,
            ellipse: 1,
            text: 1,
            image: 1
        }, au = /\{(\d+)\}/g, a = "hasOwnProperty", r = {
            doc: document,
            win: n
        }, yi = {
            was: Object.prototype[a].call(r.win, "Raphael"),
            is: r.win.Raphael
        }, hr = function() {
            this.ca = this.customAttributes = {};
        }, v = "apply", s = "concat", dt = "ontouchstart" in r.win || r.win.DocumentTouch && r.doc instanceof DocumentTouch, d = "", lt = " ", b = String, ut = "split", cr = "click dblclick mousedown mousemove mouseout mouseover mouseup touchstart touchmove touchend touchcancel"[ut](lt), gt = {
            mousedown: "touchstart",
            mousemove: "touchmove",
            mouseup: "touchend"
        }, ni = b.prototype.toLowerCase, u = Math, o = u.max, l = u.min, y = u.abs, nt = u.pow, k = u.PI, p = "number", ti = "string", tt = "array", vu = Object.prototype.toString, yu = (i._ISURL = /^url\(['"]?([^\)]+?)['"]?\)$/i, 
        /^\s*((#[a-f\d]{6})|(#[a-f\d]{3})|rgba?\(\s*([\d\.]+%?\s*,\s*[\d\.]+%?\s*,\s*[\d\.]+%?(?:\s*,\s*[\d\.]+%?)?)\s*\)|hsba?\(\s*([\d\.]+(?:deg|\xb0|%)?\s*,\s*[\d\.]+%?\s*,\s*[\d\.]+(?:%?\s*,\s*[\d\.]+)?)%?\s*\)|hsla?\(\s*([\d\.]+(?:deg|\xb0|%)?\s*,\s*[\d\.]+%?\s*,\s*[\d\.]+(?:%?\s*,\s*[\d\.]+)?)%?\s*\))\s*$/i), pu = {
            NaN: 1,
            Infinity: 1,
            "-Infinity": 1
        }, wu = /^(?:cubic-)?bezier\(([^,]+),([^,]+),([^,]+),([^\)]+)\)/, pi = u.round, h = parseFloat, st = parseInt, lr = b.prototype.toUpperCase, bu = i._availableAttrs = {
            "arrow-end": "none",
            "arrow-start": "none",
            blur: 0,
            "clip-rect": "0 0 1e9 1e9",
            cursor: "default",
            cx: 0,
            cy: 0,
            fill: "#fff",
            "fill-opacity": 1,
            font: '10px "Arial"',
            "font-family": '"Arial"',
            "font-size": "10",
            "font-style": "normal",
            "font-weight": 400,
            gradient: 0,
            height: 0,
            href: "http://raphaeljs.com/",
            "letter-spacing": 0,
            opacity: 1,
            path: "M0,0",
            r: 0,
            rx: 0,
            ry: 0,
            src: "",
            stroke: "#000",
            "stroke-dasharray": "",
            "stroke-linecap": "butt",
            "stroke-linejoin": "butt",
            "stroke-miterlimit": 0,
            "stroke-opacity": 1,
            "stroke-width": 1,
            target: "_blank",
            "text-anchor": "middle",
            title: "Raphael",
            transform: "",
            width: 0,
            x: 0,
            y: 0
        }, wi = i._availableAnimAttrs = {
            blur: p,
            "clip-rect": "csv",
            cx: p,
            cy: p,
            fill: "colour",
            "fill-opacity": p,
            "font-size": p,
            height: p,
            opacity: p,
            path: "path",
            r: p,
            rx: p,
            ry: p,
            stroke: "colour",
            "stroke-opacity": p,
            "stroke-width": p,
            transform: "transform",
            width: p,
            x: p,
            y: p
        }, bi = /[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*,[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*/, ku = {
            hs: 1,
            rg: 1
        }, du = /,?([achlmqrstvxz]),?/gi, gu = /([achlmrqstvz])[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029,]*((-?\d*\.?\d*(?:e[\-+]?\d+)?[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*,?[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*)+)/gi, nf = /([rstm])[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029,]*((-?\d*\.?\d*(?:e[\-+]?\d+)?[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*,?[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*)+)/gi, ar = /(-?\d*\.?\d*(?:e[\-+]?\d+)?)[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*,?[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*/gi, at = (i._radial_gradient = /^r(?:\(([^,]+?)[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*,[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*([^\)]+?)\))?/, 
        {}), tf = function(n, t) {
            return h(n) - h(t);
        }, rf = function() {}, uf = function(n) {
            return n;
        }, ii = i._rectPath = function(n, t, i, r, u) {
            return u ? [ [ "M", n + u, t ], [ "l", i - 2 * u, 0 ], [ "a", u, u, 0, 0, 1, u, u ], [ "l", 0, r - 2 * u ], [ "a", u, u, 0, 0, 1, -u, u ], [ "l", 2 * u - i, 0 ], [ "a", u, u, 0, 0, 1, -u, -u ], [ "l", 0, 2 * u - r ], [ "a", u, u, 0, 0, 1, u, -u ], [ "z" ] ] : [ [ "M", n, t ], [ "l", i, 0 ], [ "l", 0, r ], [ "l", -i, 0 ], [ "z" ] ];
        }, vr = function(n, t, i, r) {
            return null == r && (r = i), [ [ "M", n, t ], [ "m", 0, -r ], [ "a", i, r, 0, 1, 1, 0, 2 * r ], [ "a", i, r, 0, 1, 1, 0, -2 * r ], [ "z" ] ];
        }, ri = i._getPath = {
            path: function(n) {
                return n.attr("path");
            },
            circle: function(n) {
                var t = n.attrs;
                return vr(t.cx, t.cy, t.r);
            },
            ellipse: function(n) {
                var t = n.attrs;
                return vr(t.cx, t.cy, t.rx, t.ry);
            },
            rect: function(n) {
                var t = n.attrs;
                return ii(t.x, t.y, t.width, t.height, t.r);
            },
            image: function(n) {
                var t = n.attrs;
                return ii(t.x, t.y, t.width, t.height);
            },
            text: function(n) {
                var t = n._getBBox();
                return ii(t.x, t.y, t.width, t.height);
            },
            set: function(n) {
                var t = n._getBBox();
                return ii(t.x, t.y, t.width, t.height);
            }
        }, ki = i.mapPath = function(n, t) {
            if (!t) return n;
            var f, e, u, i, o, s, r;
            for (n = wt(n), u = 0, o = n.length; o > u; u++) for (r = n[u], i = 1, s = r.length; s > i; i += 2) f = t.x(r[i], r[i + 1]), 
            e = t.y(r[i], r[i + 1]), r[i] = f, r[i + 1] = e;
            return n;
        };
        if (i._g = r, i.type = r.win.SVGAngle || r.doc.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1") ? "SVG" : "VML", 
        "VML" == i.type) {
            if (ui = r.doc.createElement("div"), ui.innerHTML = '<v:shape adj="1"/>', fi = ui.firstChild, 
            fi.style.behavior = "url(#default#VML)", !(fi && "object" == typeof fi.adj)) return i.type = d;
            ui = null;
        }
        i.svg = !(i.vml = "VML" == i.type), i._Paper = hr, i.fn = c = hr.prototype = i.prototype, 
        i._id = 0, i._oid = 0, i.is = function(n, t) {
            return t = ni.call(t), "finite" == t ? !pu[a](+n) : "array" == t ? n instanceof Array : "null" == t && null === n || t == typeof n && null !== n || "object" == t && n === Object(n) || "array" == t && Array.isArray && Array.isArray(n) || vu.call(n).slice(8, -1).toLowerCase() == t;
        }, i.angle = function(n, t, r, f, e, o) {
            if (null == e) {
                var s = n - r, h = t - f;
                return s || h ? (180 + 180 * u.atan2(-h, -s) / k + 360) % 360 : 0;
            }
            return i.angle(n, t, e, o) - i.angle(r, f, e, o);
        }, i.rad = function(n) {
            return n % 360 * k / 180;
        }, i.deg = function(n) {
            return 180 * n / k % 360;
        }, i.snapTo = function(n, t, r) {
            var f, u;
            if (r = i.is(r, "finite") ? r : 10, i.is(n, tt)) {
                for (f = n.length; f--; ) if (y(n[f] - t) <= r) return n[f];
            } else {
                if (n = +n, u = t % n, r > u) return t - u;
                if (u > n - r) return t - u + n;
            }
            return t;
        }, ff = i.createUUID = function(n, t) {
            return function() {
                return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(n, t).toUpperCase();
            };
        }(/[xy]/g, function(n) {
            var t = 16 * u.random() | 0, i = "x" == n ? t : 3 & t | 8;
            return i.toString(16);
        }), i.setWindow = function(n) {
            t("raphael.setWindow", i, r.win, n), r.win = n, r.doc = r.win.document, i._engine.initWin && i._engine.initWin(r.win);
        };
        var ei = function(n) {
            var e, u, f, o, t;
            if (i.vml) {
                e = /^\s+|\s+$/g;
                try {
                    f = new ActiveXObject("htmlfile"), f.write("<body>"), f.close(), u = f.body;
                } catch (s) {
                    u = createPopup().document.body;
                }
                o = u.createTextRange(), ei = it(function(n) {
                    try {
                        u.style.color = b(n).replace(e, d);
                        var t = o.queryCommandValue("ForeColor");
                        return t = (255 & t) << 16 | 65280 & t | (16711680 & t) >>> 16, "#" + ("000000" + t.toString(16)).slice(-6);
                    } catch (i) {
                        return "none";
                    }
                });
            } else t = r.doc.createElement("i"), t.title = "Raphaël Colour Picker", t.style.display = "none", 
            r.doc.body.appendChild(t), ei = it(function(n) {
                return t.style.color = n, r.doc.defaultView.getComputedStyle(t, d).getPropertyValue("color");
            });
            return ei(n);
        }, ef = function() {
            return "hsb(" + [ this.h, this.s, this.b ] + ")";
        }, of = function() {
            return "hsl(" + [ this.h, this.s, this.l ] + ")";
        }, yr = function() {
            return this.hex;
        }, pr = function(n, t, r) {
            if (null == t && i.is(n, "object") && "r" in n && "g" in n && "b" in n && (r = n.b, 
            t = n.g, n = n.r), null == t && i.is(n, ti)) {
                var u = i.getRGB(n);
                n = u.r, t = u.g, r = u.b;
            }
            return (n > 1 || t > 1 || r > 1) && (n /= 255, t /= 255, r /= 255), [ n, t, r ];
        }, wr = function(n, t, r, u) {
            n *= 255, t *= 255, r *= 255;
            var f = {
                r: n,
                g: t,
                b: r,
                hex: i.rgb(n, t, r),
                toString: yr
            };
            return i.is(u, "finite") && (f.opacity = u), f;
        };
        i.color = function(n) {
            var t;
            return i.is(n, "object") && "h" in n && "s" in n && "b" in n ? (t = i.hsb2rgb(n), 
            n.r = t.r, n.g = t.g, n.b = t.b, n.hex = t.hex) : i.is(n, "object") && "h" in n && "s" in n && "l" in n ? (t = i.hsl2rgb(n), 
            n.r = t.r, n.g = t.g, n.b = t.b, n.hex = t.hex) : (i.is(n, "string") && (n = i.getRGB(n)), 
            i.is(n, "object") && "r" in n && "g" in n && "b" in n ? (t = i.rgb2hsl(n), n.h = t.h, 
            n.s = t.s, n.l = t.l, t = i.rgb2hsb(n), n.v = t.b) : (n = {
                hex: "none"
            }, n.r = n.g = n.b = n.h = n.s = n.v = n.l = -1)), n.toString = yr, n;
        }, i.hsb2rgb = function(n, t, i, r) {
            this.is(n, "object") && "h" in n && "s" in n && "b" in n && (i = n.b, t = n.s, n = n.h, 
            r = n.o), n *= 360;
            var e, o, s, f, u;
            return n = n % 360 / 60, u = i * t, f = u * (1 - y(n % 2 - 1)), e = o = s = i - u, 
            n = ~~n, e += [ u, f, 0, 0, f, u ][n], o += [ f, u, u, f, 0, 0 ][n], s += [ 0, 0, f, u, u, f ][n], 
            wr(e, o, s, r);
        }, i.hsl2rgb = function(n, t, i, r) {
            this.is(n, "object") && "h" in n && "s" in n && "l" in n && (i = n.l, t = n.s, n = n.h), 
            (n > 1 || t > 1 || i > 1) && (n /= 360, t /= 100, i /= 100), n *= 360;
            var e, o, s, f, u;
            return n = n % 360 / 60, u = 2 * t * (.5 > i ? i : 1 - i), f = u * (1 - y(n % 2 - 1)), 
            e = o = s = i - u / 2, n = ~~n, e += [ u, f, 0, 0, f, u ][n], o += [ f, u, u, f, 0, 0 ][n], 
            s += [ 0, 0, f, u, u, f ][n], wr(e, o, s, r);
        }, i.rgb2hsb = function(n, t, i) {
            i = pr(n, t, i), n = i[0], t = i[1], i = i[2];
            var f, e, u, r;
            return u = o(n, t, i), r = u - l(n, t, i), f = 0 == r ? null : u == n ? (t - i) / r : u == t ? (i - n) / r + 2 : (n - t) / r + 4, 
            f = (f + 360) % 6 / 6, e = 0 == r ? 0 : r / u, {
                h: f,
                s: e,
                b: u,
                toString: ef
            };
        }, i.rgb2hsl = function(n, t, i) {
            i = pr(n, t, i), n = i[0], t = i[1], i = i[2];
            var e, h, u, f, s, r;
            return f = o(n, t, i), s = l(n, t, i), r = f - s, e = 0 == r ? null : f == n ? (t - i) / r : f == t ? (i - n) / r + 2 : (n - t) / r + 4, 
            e = (e + 360) % 6 / 6, u = (f + s) / 2, h = 0 == r ? 0 : .5 > u ? r / (2 * u) : r / (2 - 2 * u), 
            {
                h: e,
                s: h,
                l: u,
                toString: of
            };
        }, i._path2string = function() {
            return this.join(",").replace(du, "$1");
        }, hf = i._preload = function(n, t) {
            var i = r.doc.createElement("img");
            i.style.cssText = "position:absolute;left:-9999em;top:-9999em", i.onload = function() {
                t.call(this), this.onload = null, r.doc.body.removeChild(this);
            }, i.onerror = function() {
                r.doc.body.removeChild(this);
            }, r.doc.body.appendChild(i), i.src = n;
        }, i.getRGB = it(function(n) {
            if (!n || (n = b(n)).indexOf("-") + 1) return {
                r: -1,
                g: -1,
                b: -1,
                hex: "none",
                error: 1,
                toString: oi
            };
            if ("none" == n) return {
                r: -1,
                g: -1,
                b: -1,
                hex: "none",
                toString: oi
            };
            ku[a](n.toLowerCase().substring(0, 2)) || "#" == n.charAt() || (n = ei(n));
            var u, f, e, o, s, t, r = n.match(yu);
            return r ? (r[2] && (e = st(r[2].substring(5), 16), f = st(r[2].substring(3, 5), 16), 
            u = st(r[2].substring(1, 3), 16)), r[3] && (e = st((s = r[3].charAt(3)) + s, 16), 
            f = st((s = r[3].charAt(2)) + s, 16), u = st((s = r[3].charAt(1)) + s, 16)), r[4] && (t = r[4][ut](bi), 
            u = h(t[0]), "%" == t[0].slice(-1) && (u *= 2.55), f = h(t[1]), "%" == t[1].slice(-1) && (f *= 2.55), 
            e = h(t[2]), "%" == t[2].slice(-1) && (e *= 2.55), "rgba" == r[1].toLowerCase().slice(0, 4) && (o = h(t[3])), 
            t[3] && "%" == t[3].slice(-1) && (o /= 100)), r[5] ? (t = r[5][ut](bi), u = h(t[0]), 
            "%" == t[0].slice(-1) && (u *= 2.55), f = h(t[1]), "%" == t[1].slice(-1) && (f *= 2.55), 
            e = h(t[2]), "%" == t[2].slice(-1) && (e *= 2.55), ("deg" == t[0].slice(-3) || "°" == t[0].slice(-1)) && (u /= 360), 
            "hsba" == r[1].toLowerCase().slice(0, 4) && (o = h(t[3])), t[3] && "%" == t[3].slice(-1) && (o /= 100), 
            i.hsb2rgb(u, f, e, o)) : r[6] ? (t = r[6][ut](bi), u = h(t[0]), "%" == t[0].slice(-1) && (u *= 2.55), 
            f = h(t[1]), "%" == t[1].slice(-1) && (f *= 2.55), e = h(t[2]), "%" == t[2].slice(-1) && (e *= 2.55), 
            ("deg" == t[0].slice(-3) || "°" == t[0].slice(-1)) && (u /= 360), "hsla" == r[1].toLowerCase().slice(0, 4) && (o = h(t[3])), 
            t[3] && "%" == t[3].slice(-1) && (o /= 100), i.hsl2rgb(u, f, e, o)) : (r = {
                r: u,
                g: f,
                b: e,
                toString: oi
            }, r.hex = "#" + (16777216 | e | f << 8 | u << 16).toString(16).slice(1), i.is(o, "finite") && (r.opacity = o), 
            r)) : {
                r: -1,
                g: -1,
                b: -1,
                hex: "none",
                error: 1,
                toString: oi
            };
        }, i), i.hsb = it(function(n, t, r) {
            return i.hsb2rgb(n, t, r).hex;
        }), i.hsl = it(function(n, t, r) {
            return i.hsl2rgb(n, t, r).hex;
        }), i.rgb = it(function(n, t, i) {
            return "#" + (16777216 | i | t << 8 | n << 16).toString(16).slice(1);
        }), i.getColor = function(n) {
            var t = this.getColor.start = this.getColor.start || {
                h: 0,
                s: 1,
                b: n || .75
            }, i = this.hsb2rgb(t.h, t.s, t.b);
            return t.h += .075, t.h > 1 && (t.h = 0, t.s -= .2, t.s <= 0 && (this.getColor.start = {
                h: 0,
                s: 1,
                b: t.b
            })), i.hex;
        }, i.getColor.reset = function() {
            delete this.start;
        }, i.parsePathString = function(n) {
            var r, u, t;
            return n ? (r = et(n), r.arr ? rt(r.arr) : (u = {
                a: 7,
                c: 6,
                h: 1,
                l: 2,
                m: 2,
                r: 4,
                q: 4,
                s: 4,
                t: 2,
                v: 1,
                z: 0
            }, t = [], i.is(n, tt) && i.is(n[0], tt) && (t = rt(n)), t.length || b(n).replace(gu, function(n, i, r) {
                var f = [], e = i.toLowerCase();
                if (r.replace(ar, function(n, t) {
                    t && f.push(+t);
                }), "m" == e && f.length > 2 && (t.push([ i ][s](f.splice(0, 2))), e = "l", i = "m" == i ? "l" : "L"), 
                "r" == e) t.push([ i ][s](f)); else for (;f.length >= u[e] && (t.push([ i ][s](f.splice(0, u[e]))), 
                u[e]); ) ;
            }), t.toString = i._path2string, r.arr = rt(t), t)) : null;
        }, i.parseTransformString = it(function(n) {
            if (!n) return null;
            var t = [];
            return i.is(n, tt) && i.is(n[0], tt) && (t = rt(n)), t.length || b(n).replace(nf, function(n, i, r) {
                {
                    var u = [];
                    ni.call(i);
                }
                r.replace(ar, function(n, t) {
                    t && u.push(+t);
                }), t.push([ i ][s](u));
            }), t.toString = i._path2string, t;
        }), et = function(n) {
            var t = et.ps = et.ps || {};
            return t[n] ? t[n].sleep = 100 : t[n] = {
                sleep: 100
            }, setTimeout(function() {
                for (var i in t) t[a](i) && i != n && (t[i].sleep--, t[i].sleep || delete t[i]);
            }), t[n];
        }, i.findDotsAtSegment = function(n, t, i, r, f, e, o, s, h) {
            var c = 1 - h, w = nt(c, 3), b = nt(c, 2), l = h * h, d = l * h, tt = w * n + 3 * b * h * i + 3 * c * h * h * f + d * o, it = w * t + 3 * b * h * r + 3 * c * h * h * e + d * s, a = n + 2 * h * (i - n) + l * (f - 2 * i + n), v = t + 2 * h * (r - t) + l * (e - 2 * r + t), y = i + 2 * h * (f - i) + l * (o - 2 * f + i), p = r + 2 * h * (e - r) + l * (s - 2 * e + r), rt = c * n + h * i, ut = c * t + h * r, ft = c * f + h * o, et = c * e + h * s, g = 90 - 180 * u.atan2(a - y, v - p) / k;
            return (a > y || p > v) && (g += 180), {
                x: tt,
                y: it,
                m: {
                    x: a,
                    y: v
                },
                n: {
                    x: y,
                    y: p
                },
                start: {
                    x: rt,
                    y: ut
                },
                end: {
                    x: ft,
                    y: et
                },
                alpha: g
            };
        }, i.bezierBBox = function(n, t, r, u, f, e, o, s) {
            i.is(n, "array") || (n = [ n, t, r, u, f, e, o, s ]);
            var h = tu.apply(null, n);
            return {
                x: h.min.x,
                y: h.min.y,
                x2: h.max.x,
                y2: h.max.y,
                width: h.max.x - h.min.x,
                height: h.max.y - h.min.y
            };
        }, i.isPointInsideBBox = function(n, t, i) {
            return t >= n.x && t <= n.x2 && i >= n.y && i <= n.y2;
        }, i.isBBoxIntersect = function(n, t) {
            var r = i.isPointInsideBBox;
            return r(t, n.x, n.y) || r(t, n.x2, n.y) || r(t, n.x, n.y2) || r(t, n.x2, n.y2) || r(n, t.x, t.y) || r(n, t.x2, t.y) || r(n, t.x, t.y2) || r(n, t.x2, t.y2) || (n.x < t.x2 && n.x > t.x || t.x < n.x2 && t.x > n.x) && (n.y < t.y2 && n.y > t.y || t.y < n.y2 && t.y > n.y);
        }, i.pathIntersection = function(n, t) {
            return gi(n, t);
        }, i.pathIntersectionNumber = function(n, t) {
            return gi(n, t, 1);
        }, i.isPointInsidePath = function(n, t, r) {
            var u = i.pathBBox(n);
            return i.isPointInsideBBox(u, t, r) && gi(n, [ [ "M", t, r ], [ "H", u.x2 + 10 ] ], 1) % 2 == 1;
        }, i._removedFactory = function(n) {
            return function() {
                t("raphael.log", null, "Raphaël: you are calling to method “" + n + "” of removed object", n);
            };
        };
        var nr = i.pathBBox = function(n) {
            var h, p, u, c = et(n);
            if (c.bbox) return pt(c.bbox);
            if (!n) return {
                x: 0,
                y: 0,
                width: 0,
                height: 0,
                x2: 0,
                y2: 0
            };
            n = wt(n);
            var t, f = 0, e = 0, i = [], r = [];
            for (h = 0, p = n.length; p > h; h++) t = n[h], "M" == t[0] ? (f = t[1], e = t[2], 
            i.push(f), r.push(e)) : (u = tu(f, e, t[1], t[2], t[3], t[4], t[5], t[6]), i = i[s](u.min.x, u.max.x), 
            r = r[s](u.min.y, u.max.y), f = t[5], e = t[6]);
            var a = l[v](0, i), y = l[v](0, r), w = o[v](0, i), b = o[v](0, r), k = w - a, d = b - y, g = {
                x: a,
                y: y,
                x2: w,
                y2: b,
                width: k,
                height: d,
                cx: a + k / 2,
                cy: y + d / 2
            };
            return c.bbox = pt(g), g;
        }, rt = function(n) {
            var t = pt(n);
            return t.toString = i._path2string, t;
        }, af = i._pathToRelative = function(n) {
            var u, p, f, t, s, w, h, b, c, v = et(n);
            if (v.rel) return rt(v.rel);
            i.is(n, tt) && i.is(n && n[0], tt) || (n = i.parsePathString(n));
            var r = [], o = 0, e = 0, l = 0, a = 0, y = 0;
            for ("M" == n[0][0] && (o = n[0][1], e = n[0][2], l = o, a = e, y++, r.push([ "M", o, e ])), 
            u = y, p = n.length; p > u; u++) {
                if (f = r[u] = [], t = n[u], t[0] != ni.call(t[0])) switch (f[0] = ni.call(t[0]), 
                f[0]) {
                  case "a":
                    f[1] = t[1], f[2] = t[2], f[3] = t[3], f[4] = t[4], f[5] = t[5], f[6] = +(t[6] - o).toFixed(3), 
                    f[7] = +(t[7] - e).toFixed(3);
                    break;

                  case "v":
                    f[1] = +(t[1] - e).toFixed(3);
                    break;

                  case "m":
                    l = t[1], a = t[2];

                  default:
                    for (s = 1, w = t.length; w > s; s++) f[s] = +(t[s] - (s % 2 ? o : e)).toFixed(3);
                } else for (f = r[u] = [], "m" == t[0] && (l = t[1] + o, a = t[2] + e), h = 0, b = t.length; b > h; h++) r[u][h] = t[h];
                switch (c = r[u].length, r[u][0]) {
                  case "z":
                    o = l, e = a;
                    break;

                  case "h":
                    o += +r[u][c - 1];
                    break;

                  case "v":
                    e += +r[u][c - 1];
                    break;

                  default:
                    o += +r[u][c - 2], e += +r[u][c - 1];
                }
            }
            return r.toString = i._path2string, v.rel = rt(r), r;
        }, dr = i._pathToAbsolute = function(n) {
            var w, t, r, v, k, h, e, y, c, d, p = et(n);
            if (p.abs) return rt(p.abs);
            if (i.is(n, tt) && i.is(n && n[0], tt) || (n = i.parsePathString(n)), !n || !n.length) return [ [ "M", 0, 0 ] ];
            var o = [], u = 0, f = 0, l = 0, a = 0, b = 0;
            for ("M" == n[0][0] && (u = +n[0][1], f = +n[0][2], l = u, a = f, b++, o[0] = [ "M", u, f ]), 
            w = 3 == n.length && "M" == n[0][0] && "R" == n[1][0].toUpperCase() && "Z" == n[2][0].toUpperCase(), 
            v = b, k = n.length; k > v; v++) {
                if (o.push(t = []), r = n[v], r[0] != lr.call(r[0])) switch (t[0] = lr.call(r[0]), 
                t[0]) {
                  case "A":
                    t[1] = r[1], t[2] = r[2], t[3] = r[3], t[4] = r[4], t[5] = r[5], t[6] = +(r[6] + u), 
                    t[7] = +(r[7] + f);
                    break;

                  case "V":
                    t[1] = +r[1] + f;
                    break;

                  case "H":
                    t[1] = +r[1] + u;
                    break;

                  case "R":
                    for (h = [ u, f ][s](r.slice(1)), e = 2, y = h.length; y > e; e++) h[e] = +h[e] + u, 
                    h[++e] = +h[e] + f;
                    o.pop(), o = o[s](br(h, w));
                    break;

                  case "M":
                    l = +r[1] + u, a = +r[2] + f;

                  default:
                    for (e = 1, y = r.length; y > e; e++) t[e] = +r[e] + (e % 2 ? u : f);
                } else if ("R" == r[0]) h = [ u, f ][s](r.slice(1)), o.pop(), o = o[s](br(h, w)), 
                t = [ "R" ][s](r.slice(-2)); else for (c = 0, d = r.length; d > c; c++) t[c] = r[c];
                switch (t[0]) {
                  case "Z":
                    u = l, f = a;
                    break;

                  case "H":
                    u = t[1];
                    break;

                  case "V":
                    f = t[1];
                    break;

                  case "M":
                    l = t[t.length - 2], a = t[t.length - 1];

                  default:
                    u = t[t.length - 2], f = t[t.length - 1];
                }
            }
            return o.toString = i._path2string, p.abs = rt(o), o;
        }, si = function(n, t, i, r) {
            return [ n, t, i, r, i, r ];
        }, gr = function(n, t, i, r, u, f) {
            var e = 1 / 3, o = 2 / 3;
            return [ e * n + o * i, e * t + o * r, e * u + o * i, e * f + o * r, u, f ];
        }, nu = function(n, t, i, r, f, e, o, h, c, l) {
            var g, st, lt, w, gt, at = 120 * k / 180, et = k / 180 * (+f || 0), p = [], ot = it(function(n, t, i) {
                var r = n * u.cos(i) - t * u.sin(i), f = n * u.sin(i) + t * u.cos(i);
                return {
                    x: r,
                    y: f
                };
            });
            if (l) v = l[0], a = l[1], rt = l[2], ft = l[3]; else {
                g = ot(n, t, -et), n = g.x, t = g.y, g = ot(h, c, -et), h = g.x, c = g.y;
                var b = (u.cos(k / 180 * f), u.sin(k / 180 * f), (n - h) / 2), d = (t - c) / 2, tt = b * b / (i * i) + d * d / (r * r);
                tt > 1 && (tt = u.sqrt(tt), i = tt * i, r = tt * r);
                var ht = i * i, ct = r * r, vt = (e == o ? -1 : 1) * u.sqrt(y((ht * ct - ht * d * d - ct * b * b) / (ht * d * d + ct * b * b))), rt = vt * i * d / r + (n + h) / 2, ft = vt * -r * b / i + (t + c) / 2, v = u.asin(((t - ft) / r).toFixed(9)), a = u.asin(((c - ft) / r).toFixed(9));
                v = rt > n ? k - v : v, a = rt > h ? k - a : a, 0 > v && (v = 2 * k + v), 0 > a && (a = 2 * k + a), 
                o && v > a && (v -= 2 * k), !o && a > v && (a -= 2 * k);
            }
            if (st = a - v, y(st) > at) {
                var ni = a, ti = h, ii = c;
                a = v + at * (o && a > v ? 1 : -1), h = rt + i * u.cos(a), c = ft + r * u.sin(a), 
                p = nu(h, c, i, r, f, 0, o, ti, ii, [ a, ni, rt, ft ]);
            }
            st = a - v;
            var ri = u.cos(v), ui = u.sin(v), fi = u.cos(a), ei = u.sin(a), yt = u.tan(st / 4), pt = 4 / 3 * i * yt, wt = 4 / 3 * r * yt, bt = [ n, t ], nt = [ n + pt * ui, t - wt * ri ], kt = [ h + pt * ei, c - wt * fi ], dt = [ h, c ];
            if (nt[0] = 2 * bt[0] - nt[0], nt[1] = 2 * bt[1] - nt[1], l) return [ nt, kt, dt ][s](p);
            for (p = [ nt, kt, dt ][s](p).join()[ut](","), lt = [], w = 0, gt = p.length; gt > w; w++) lt[w] = w % 2 ? ot(p[w - 1], p[w], et).y : ot(p[w], p[w + 1], et).x;
            return lt;
        }, hi = function(n, t, i, r, u, f, e, o, s) {
            var h = 1 - s;
            return {
                x: nt(h, 3) * n + 3 * nt(h, 2) * s * i + 3 * h * s * s * u + nt(s, 3) * e,
                y: nt(h, 3) * t + 3 * nt(h, 2) * s * r + 3 * h * s * s * f + nt(s, 3) * o
            };
        }, tu = it(function(n, t, i, r, f, e, s, h) {
            var a, b = f - 2 * i + n - (s - 2 * f + i), c = 2 * (i - n) - 2 * (f - i), g = n - i, p = (-c + u.sqrt(c * c - 4 * b * g)) / 2 / b, w = (-c - u.sqrt(c * c - 4 * b * g)) / 2 / b, k = [ t, h ], d = [ n, s ];
            return y(p) > "1e12" && (p = .5), y(w) > "1e12" && (w = .5), p > 0 && 1 > p && (a = hi(n, t, i, r, f, e, s, h, p), 
            d.push(a.x), k.push(a.y)), w > 0 && 1 > w && (a = hi(n, t, i, r, f, e, s, h, w), 
            d.push(a.x), k.push(a.y)), b = e - 2 * r + t - (h - 2 * e + r), c = 2 * (r - t) - 2 * (e - r), 
            g = t - r, p = (-c + u.sqrt(c * c - 4 * b * g)) / 2 / b, w = (-c - u.sqrt(c * c - 4 * b * g)) / 2 / b, 
            y(p) > "1e12" && (p = .5), y(w) > "1e12" && (w = .5), p > 0 && 1 > p && (a = hi(n, t, i, r, f, e, s, h, p), 
            d.push(a.x), k.push(a.y)), w > 0 && 1 > w && (a = hi(n, t, i, r, f, e, s, h, w), 
            d.push(a.x), k.push(a.y)), {
                min: {
                    x: l[v](0, d),
                    y: l[v](0, k)
                },
                max: {
                    x: o[v](0, d),
                    y: o[v](0, k)
                }
            };
        }), wt = i._path2curve = it(function(n, t) {
            var r, a, w = !t && et(n);
            if (!t && w.curve) return rt(w.curve);
            var u = dr(n), i = t && dr(t), f = {
                x: 0,
                y: 0,
                bx: 0,
                by: 0,
                X: 0,
                Y: 0,
                qx: null,
                qy: null
            }, e = {
                x: 0,
                y: 0,
                bx: 0,
                by: 0,
                X: 0,
                Y: 0,
                qx: null,
                qy: null
            }, b = function(n, t, i) {
                var r, u;
                if (!n) return [ "C", t.x, t.y, t.x, t.y, t.x, t.y ];
                switch (n[0] in {
                    T: 1,
                    Q: 1
                } || (t.qx = t.qy = null), n[0]) {
                  case "M":
                    t.X = n[1], t.Y = n[2];
                    break;

                  case "A":
                    n = [ "C" ][s](nu[v](0, [ t.x, t.y ][s](n.slice(1))));
                    break;

                  case "S":
                    "C" == i || "S" == i ? (r = 2 * t.x - t.bx, u = 2 * t.y - t.by) : (r = t.x, u = t.y), 
                    n = [ "C", r, u ][s](n.slice(1));
                    break;

                  case "T":
                    "Q" == i || "T" == i ? (t.qx = 2 * t.x - t.qx, t.qy = 2 * t.y - t.qy) : (t.qx = t.x, 
                    t.qy = t.y), n = [ "C" ][s](gr(t.x, t.y, t.qx, t.qy, n[1], n[2]));
                    break;

                  case "Q":
                    t.qx = n[1], t.qy = n[2], n = [ "C" ][s](gr(t.x, t.y, n[1], n[2], n[3], n[4]));
                    break;

                  case "L":
                    n = [ "C" ][s](si(t.x, t.y, n[1], n[2]));
                    break;

                  case "H":
                    n = [ "C" ][s](si(t.x, t.y, n[1], t.y));
                    break;

                  case "V":
                    n = [ "C" ][s](si(t.x, t.y, t.x, n[1]));
                    break;

                  case "Z":
                    n = [ "C" ][s](si(t.x, t.y, t.X, t.Y));
                }
                return n;
            }, k = function(n, t) {
                if (n[t].length > 7) {
                    n[t].shift();
                    for (var r = n[t]; r.length; ) n.splice(t++, 0, [ "C" ][s](r.splice(0, 6)));
                    n.splice(t, 1), a = o(u.length, i && i.length || 0);
                }
            }, d = function(n, t, r, f, e) {
                n && t && "M" == n[e][0] && "M" != t[e][0] && (t.splice(e, 0, [ "M", f.x, f.y ]), 
                r.bx = 0, r.by = 0, r.x = n[e][1], r.y = n[e][2], a = o(u.length, i && i.length || 0));
            };
            for (r = 0, a = o(u.length, i && i.length || 0); a > r; r++) {
                u[r] = b(u[r], f), k(u, r), i && (i[r] = b(i[r], e)), i && k(i, r), d(u, i, f, e, r), 
                d(i, u, e, f, r);
                var c = u[r], l = i && i[r], y = c.length, p = i && l.length;
                f.x = c[y - 2], f.y = c[y - 1], f.bx = h(c[y - 4]) || f.x, f.by = h(c[y - 3]) || f.y, 
                e.bx = i && (h(l[p - 4]) || e.x), e.by = i && (h(l[p - 3]) || e.y), e.x = i && l[p - 2], 
                e.y = i && l[p - 1];
            }
            return i || (w.curve = rt(u)), i ? [ u, i ] : u;
        }, null, rt), ci = (i._parseDots = it(function(n) {
            for (var f, s, c, e, u, l, r = [], t = 0, o = n.length; o > t; t++) {
                if (f = {}, s = n[t].match(/^([^:]*):?([\d\.]*)/), f.color = i.getRGB(s[1]), f.color.error) return null;
                f.color = f.color.hex, s[2] && (f.offset = s[2] + "%"), r.push(f);
            }
            for (t = 1, o = r.length - 1; o > t; t++) if (!r[t].offset) {
                for (c = h(r[t - 1].offset || 0), e = 0, u = t + 1; o > u; u++) if (r[u].offset) {
                    e = r[u].offset;
                    break;
                }
                for (e || (e = 100, u = o), e = h(e), l = (e - c) / (u - t + 1); u > t; t++) c += l, 
                r[t].offset = c + "%";
            }
            return r;
        }), i._tear = function(n, t) {
            n == t.top && (t.top = n.prev), n == t.bottom && (t.bottom = n.next), n.next && (n.next.prev = n.prev), 
            n.prev && (n.prev.next = n.next);
        }), vf = (i._tofront = function(n, t) {
            t.top !== n && (ci(n, t), n.next = null, n.prev = t.top, t.top.next = n, t.top = n);
        }, i._toback = function(n, t) {
            t.bottom !== n && (ci(n, t), n.next = t.bottom, n.prev = null, t.bottom.prev = n, 
            t.bottom = n);
        }, i._insertafter = function(n, t, i) {
            ci(n, i), t == i.top && (i.top = n), t.next && (t.next.prev = n), n.next = t.next, 
            n.prev = t, t.next = n;
        }, i._insertbefore = function(n, t, i) {
            ci(n, i), t == i.bottom && (i.bottom = n), t.prev && (t.prev.next = n), n.prev = t.prev, 
            t.prev = n, n.next = t;
        }, i.toMatrix = function(n, t) {
            var r = nr(n), i = {
                _: {
                    transform: d
                },
                getBBox: function() {
                    return r;
                }
            };
            return iu(i, t), i.matrix;
        }), iu = (i.transformPath = function(n, t) {
            return ki(n, vf(n, t));
        }, i._extractTransform = function(n, t) {
            var w, tt;
            if (null == t) return n._.transform;
            t = b(t).replace(/\.{3}|\u2026/g, n._.transform || d);
            var a = i.parseTransformString(t), v = 0, g = 0, nt = 0, y = 1, p = 1, e = n._, u = new ht();
            if (e.transform = a || [], a) for (w = 0, tt = a.length; tt > w; w++) {
                var it, rt, h, c, f, r = a[w], o = r.length, l = b(r[0]).toLowerCase(), k = r[0] != l, s = k ? u.invert() : 0;
                "t" == l && 3 == o ? k ? (it = s.x(0, 0), rt = s.y(0, 0), h = s.x(r[1], r[2]), c = s.y(r[1], r[2]), 
                u.translate(h - it, c - rt)) : u.translate(r[1], r[2]) : "r" == l ? 2 == o ? (f = f || n.getBBox(1), 
                u.rotate(r[1], f.x + f.width / 2, f.y + f.height / 2), v += r[1]) : 4 == o && (k ? (h = s.x(r[2], r[3]), 
                c = s.y(r[2], r[3]), u.rotate(r[1], h, c)) : u.rotate(r[1], r[2], r[3]), v += r[1]) : "s" == l ? 2 == o || 3 == o ? (f = f || n.getBBox(1), 
                u.scale(r[1], r[o - 1], f.x + f.width / 2, f.y + f.height / 2), y *= r[1], p *= r[o - 1]) : 5 == o && (k ? (h = s.x(r[3], r[4]), 
                c = s.y(r[3], r[4]), u.scale(r[1], r[2], h, c)) : u.scale(r[1], r[2], r[3], r[4]), 
                y *= r[1], p *= r[2]) : "m" == l && 7 == o && u.add(r[1], r[2], r[3], r[4], r[5], r[6]), 
                e.dirtyT = 1, n.matrix = u;
            }
            n.matrix = u, e.sx = y, e.sy = p, e.deg = v, e.dx = g = u.e, e.dy = nt = u.f, 1 == y && 1 == p && !v && e.bbox ? (e.bbox.x += +g, 
            e.bbox.y += +nt) : e.dirtyT = 1;
        }), ru = function(n) {
            var t = n[0];
            switch (t.toLowerCase()) {
              case "t":
                return [ t, 0, 0 ];

              case "m":
                return [ t, 1, 0, 0, 1, 0, 0 ];

              case "r":
                return 4 == n.length ? [ t, 0, n[2], n[3] ] : [ t, 0 ];

              case "s":
                return 5 == n.length ? [ t, 1, 1, n[3], n[4] ] : 3 == n.length ? [ t, 1, 1 ] : [ t, 1 ];
            }
        }, yf = i._equaliseTransform = function(n, t) {
            t = b(t).replace(/\.{3}|\u2026/g, n), n = i.parseTransformString(n) || [], t = i.parseTransformString(t) || [];
            for (var f, c, r, e, l = o(n.length, t.length), s = [], h = [], u = 0; l > u; u++) {
                if (r = n[u] || ru(t[u]), e = t[u] || ru(r), r[0] != e[0] || "r" == r[0].toLowerCase() && (r[2] != e[2] || r[3] != e[3]) || "s" == r[0].toLowerCase() && (r[3] != e[3] || r[4] != e[4])) return;
                for (s[u] = [], h[u] = [], f = 0, c = o(r.length, e.length); c > f; f++) f in r && (s[u][f] = r[f]), 
                f in e && (h[u][f] = e[f]);
            }
            return {
                from: s,
                to: h
            };
        };
        i._getContainer = function(n, t, u, f) {
            var e;
            return e = null != f || i.is(n, "object") ? n : r.doc.getElementById(n), null != e ? e.tagName ? null == t ? {
                container: e,
                width: e.style.pixelWidth || e.offsetWidth,
                height: e.style.pixelHeight || e.offsetHeight
            } : {
                container: e,
                width: t,
                height: u
            } : {
                container: 1,
                x: n,
                y: t,
                width: u,
                height: f
            } : undefined;
        }, i.pathToRelative = af, i._engine = {}, i.path2curve = wt, i.matrix = function(n, t, i, r, u, f) {
            return new ht(n, t, i, r, u, f);
        }, function(n) {
            function t(n) {
                return n[0] * n[0] + n[1] * n[1];
            }
            function r(n) {
                var i = u.sqrt(t(n));
                n[0] && (n[0] /= i), n[1] && (n[1] /= i);
            }
            n.add = function(n, t, i, r, u, f) {
                var o, s, h, c, e = [ [], [], [] ], a = [ [ this.a, this.c, this.e ], [ this.b, this.d, this.f ], [ 0, 0, 1 ] ], l = [ [ n, i, u ], [ t, r, f ], [ 0, 0, 1 ] ];
                for (n && n instanceof ht && (l = [ [ n.a, n.c, n.e ], [ n.b, n.d, n.f ], [ 0, 0, 1 ] ]), 
                o = 0; 3 > o; o++) for (s = 0; 3 > s; s++) {
                    for (c = 0, h = 0; 3 > h; h++) c += a[o][h] * l[h][s];
                    e[o][s] = c;
                }
                this.a = e[0][0], this.b = e[1][0], this.c = e[0][1], this.d = e[1][1], this.e = e[0][2], 
                this.f = e[1][2];
            }, n.invert = function() {
                var n = this, t = n.a * n.d - n.b * n.c;
                return new ht(n.d / t, -n.b / t, -n.c / t, n.a / t, (n.c * n.f - n.d * n.e) / t, (n.b * n.e - n.a * n.f) / t);
            }, n.clone = function() {
                return new ht(this.a, this.b, this.c, this.d, this.e, this.f);
            }, n.translate = function(n, t) {
                this.add(1, 0, 0, 1, n, t);
            }, n.scale = function(n, t, i, r) {
                null == t && (t = n), (i || r) && this.add(1, 0, 0, 1, i, r), this.add(n, 0, 0, t, 0, 0), 
                (i || r) && this.add(1, 0, 0, 1, -i, -r);
            }, n.rotate = function(n, t, r) {
                n = i.rad(n), t = t || 0, r = r || 0;
                var f = +u.cos(n).toFixed(9), e = +u.sin(n).toFixed(9);
                this.add(f, e, -e, f, t, r), this.add(1, 0, 0, 1, -t, -r);
            }, n.x = function(n, t) {
                return n * this.a + t * this.c + this.e;
            }, n.y = function(n, t) {
                return n * this.b + t * this.d + this.f;
            }, n.get = function(n) {
                return +this[b.fromCharCode(97 + n)].toFixed(4);
            }, n.toString = function() {
                return i.svg ? "matrix(" + [ this.get(0), this.get(1), this.get(2), this.get(3), this.get(4), this.get(5) ].join() + ")" : [ this.get(0), this.get(2), this.get(1), this.get(3), 0, 0 ].join();
            }, n.toFilter = function() {
                return "progid:DXImageTransform.Microsoft.Matrix(M11=" + this.get(0) + ", M12=" + this.get(2) + ", M21=" + this.get(1) + ", M22=" + this.get(3) + ", Dx=" + this.get(4) + ", Dy=" + this.get(5) + ", sizingmethod='auto expand')";
            }, n.offset = function() {
                return [ this.e.toFixed(4), this.f.toFixed(4) ];
            }, n.split = function() {
                var f, e, o, n = {};
                return n.dx = this.e, n.dy = this.f, f = [ [ this.a, this.c ], [ this.b, this.d ] ], 
                n.scalex = u.sqrt(t(f[0])), r(f[0]), n.shear = f[0][0] * f[1][0] + f[0][1] * f[1][1], 
                f[1] = [ f[1][0] - f[0][0] * n.shear, f[1][1] - f[0][1] * n.shear ], n.scaley = u.sqrt(t(f[1])), 
                r(f[1]), n.shear /= n.scaley, e = -f[0][1], o = f[1][1], 0 > o ? (n.rotate = i.deg(u.acos(o)), 
                0 > e && (n.rotate = 360 - n.rotate)) : n.rotate = i.deg(u.asin(e)), n.isSimple = !(+n.shear.toFixed(9) || n.scalex.toFixed(9) != n.scaley.toFixed(9) && n.rotate), 
                n.isSuperSimple = !+n.shear.toFixed(9) && n.scalex.toFixed(9) == n.scaley.toFixed(9) && !n.rotate, 
                n.noRotation = !+n.shear.toFixed(9) && !n.rotate, n;
            }, n.toTransformString = function(n) {
                var t = n || this[ut]();
                return t.isSimple ? (t.scalex = +t.scalex.toFixed(4), t.scaley = +t.scaley.toFixed(4), 
                t.rotate = +t.rotate.toFixed(4), (t.dx || t.dy ? "t" + [ t.dx, t.dy ] : d) + (1 != t.scalex || 1 != t.scaley ? "s" + [ t.scalex, t.scaley, 0, 0 ] : d) + (t.rotate ? "r" + [ t.rotate, 0, 0 ] : d)) : "m" + [ this.get(0), this.get(1), this.get(2), this.get(3), this.get(4), this.get(5) ];
            };
        }(ht.prototype), bt = navigator.userAgent.match(/Version\/(.*?)\s/) || navigator.userAgent.match(/Chrome\/(\d+)/), 
        c.safari = "Apple Computer, Inc." == navigator.vendor && (bt && bt[1] < 4 || "iP" == navigator.platform.slice(0, 2)) || "Google Inc." == navigator.vendor && bt && bt[1] < 8 ? function() {
            var n = this.rect(-99, -99, this.width + 99, this.height + 99).attr({
                stroke: "none"
            });
            setTimeout(function() {
                n.remove();
            });
        } : rf;
        var pf = function() {
            this.returnValue = !1;
        }, wf = function() {
            return this.originalEvent.preventDefault();
        }, bf = function() {
            this.cancelBubble = !0;
        }, kf = function() {
            return this.originalEvent.stopPropagation();
        }, uu = function(n) {
            var t = r.doc.documentElement.scrollTop || r.doc.body.scrollTop, i = r.doc.documentElement.scrollLeft || r.doc.body.scrollLeft;
            return {
                x: n.clientX + i,
                y: n.clientY + t
            };
        }, df = function() {
            return r.doc.addEventListener ? function(n, t, i, r) {
                var f, u = function(n) {
                    var t = uu(n);
                    return i.call(r, n, t.x, t.y);
                };
                return n.addEventListener(t, u, !1), dt && gt[t] && (f = function(t) {
                    for (var f = uu(t), o = t, u = 0, e = t.targetTouches && t.targetTouches.length; e > u; u++) if (t.targetTouches[u].target == n) {
                        t = t.targetTouches[u], t.originalEvent = o, t.preventDefault = wf, t.stopPropagation = kf;
                        break;
                    }
                    return i.call(r, t, f.x, f.y);
                }, n.addEventListener(gt[t], f, !1)), function() {
                    return n.removeEventListener(t, u, !1), dt && gt[t] && n.removeEventListener(gt[t], u, !1), 
                    !0;
                };
            } : r.doc.attachEvent ? function(n, t, i, u) {
                var f = function(n) {
                    n = n || r.win.event;
                    var t = r.doc.documentElement.scrollTop || r.doc.body.scrollTop, f = r.doc.documentElement.scrollLeft || r.doc.body.scrollLeft, e = n.clientX + f, o = n.clientY + t;
                    return n.preventDefault = n.preventDefault || pf, n.stopPropagation = n.stopPropagation || bf, 
                    i.call(u, n, e, o);
                };
                return n.attachEvent("on" + t, f), function() {
                    return n.detachEvent("on" + t, f), !0;
                };
            } : void 0;
        }(), ot = [], tr = function(n) {
            for (var i, s, o, f = n.clientX, e = n.clientY, v = r.doc.documentElement.scrollTop || r.doc.body.scrollTop, y = r.doc.documentElement.scrollLeft || r.doc.body.scrollLeft, l = ot.length; l--; ) {
                if (i = ot[l], dt && n.touches) {
                    for (s = n.touches.length; s--; ) if (o = n.touches[s], o.identifier == i.el._drag.id) {
                        f = o.clientX, e = o.clientY, (n.originalEvent ? n.originalEvent : n).preventDefault();
                        break;
                    }
                } else n.preventDefault();
                var h, u = i.el.node, a = u.nextSibling, c = u.parentNode, p = u.style.display;
                r.win.opera && c.removeChild(u), u.style.display = "none", h = i.el.paper.getElementByPoint(f, e), 
                u.style.display = p, r.win.opera && (a ? c.insertBefore(u, a) : c.appendChild(u)), 
                h && t("raphael.drag.over." + i.el.id, i.el, h), f += y, e += v, t("raphael.drag.move." + i.el.id, i.move_scope || i.el, f - i.el._drag.x, e - i.el._drag.y, f, e, n);
            }
        }, ir = function(n) {
            i.unmousemove(tr).unmouseup(ir);
            for (var r, u = ot.length; u--; ) r = ot[u], r.el._drag = {}, t("raphael.drag.end." + r.el.id, r.end_scope || r.start_scope || r.move_scope || r.el, n);
            ot = [];
        }, e = i.el = {};
        for (rr = cr.length; rr--; ) (function(n) {
            i[n] = e[n] = function(t, u) {
                return i.is(t, "function") && (this.events = this.events || [], this.events.push({
                    name: n,
                    f: t,
                    unbind: df(this.shape || this.node || r.doc, n, t, u || this)
                })), this;
            }, i["un" + n] = e["un" + n] = function(t) {
                for (var r = this.events || [], u = r.length; u--; ) r[u].name == n && (i.is(t, "undefined") || r[u].f == t) && (r[u].unbind(), 
                r.splice(u, 1), r.length || delete this.events);
                return this;
            };
        })(cr[rr]);
        e.data = function(n, r) {
            var f, u = at[this.id] = at[this.id] || {};
            if (0 == arguments.length) return u;
            if (1 == arguments.length) {
                if (i.is(n, "object")) {
                    for (f in n) n[a](f) && this.data(f, n[f]);
                    return this;
                }
                return t("raphael.data.get." + this.id, this, u[n], n), u[n];
            }
            return u[n] = r, t("raphael.data.set." + this.id, this, r, n), this;
        }, e.removeData = function(n) {
            return null == n ? at[this.id] = {} : at[this.id] && delete at[this.id][n], this;
        }, e.getData = function() {
            return pt(at[this.id] || {});
        }, e.hover = function(n, t, i, r) {
            return this.mouseover(n, i).mouseout(t, r || i);
        }, e.unhover = function(n, t) {
            return this.unmouseover(n).unmouseout(t);
        }, ct = [], e.drag = function(n, u, f, e, o, s) {
            function h(h) {
                var l, c;
                (h.originalEvent || h).preventDefault();
                var a = h.clientX, v = h.clientY, y = r.doc.documentElement.scrollTop || r.doc.body.scrollTop, p = r.doc.documentElement.scrollLeft || r.doc.body.scrollLeft;
                if (this._drag.id = h.identifier, dt && h.touches) for (l = h.touches.length; l--; ) if (c = h.touches[l], 
                this._drag.id = c.identifier, c.identifier == this._drag.id) {
                    a = c.clientX, v = c.clientY;
                    break;
                }
                this._drag.x = a + p, this._drag.y = v + y, ot.length || i.mousemove(tr).mouseup(ir), 
                ot.push({
                    el: this,
                    move_scope: e,
                    start_scope: o,
                    end_scope: s
                }), u && t.on("raphael.drag.start." + this.id, u), n && t.on("raphael.drag.move." + this.id, n), 
                f && t.on("raphael.drag.end." + this.id, f), t("raphael.drag.start." + this.id, o || e || this, h.clientX + p, h.clientY + y, h);
            }
            return this._drag = {}, ct.push({
                el: this,
                start: h
            }), this.mousedown(h), this;
        }, e.onDragOver = function(n) {
            n ? t.on("raphael.drag.over." + this.id, n) : t.unbind("raphael.drag.over." + this.id);
        }, e.undrag = function() {
            for (var n = ct.length; n--; ) ct[n].el == this && (this.unmousedown(ct[n].start), 
            ct.splice(n, 1), t.unbind("raphael.drag.*." + this.id));
            ct.length || i.unmousemove(tr).unmouseup(ir), ot = [];
        }, c.circle = function(n, t, r) {
            var u = i._engine.circle(this, n || 0, t || 0, r || 0);
            return this.__set__ && this.__set__.push(u), u;
        }, c.rect = function(n, t, r, u, f) {
            var e = i._engine.rect(this, n || 0, t || 0, r || 0, u || 0, f || 0);
            return this.__set__ && this.__set__.push(e), e;
        }, c.ellipse = function(n, t, r, u) {
            var f = i._engine.ellipse(this, n || 0, t || 0, r || 0, u || 0);
            return this.__set__ && this.__set__.push(f), f;
        }, c.path = function(n) {
            !n || i.is(n, ti) || i.is(n[0], tt) || (n += d);
            var t = i._engine.path(i.format[v](i, arguments), this);
            return this.__set__ && this.__set__.push(t), t;
        }, c.image = function(n, t, r, u, f) {
            var e = i._engine.image(this, n || "about:blank", t || 0, r || 0, u || 0, f || 0);
            return this.__set__ && this.__set__.push(e), e;
        }, c.text = function(n, t, r) {
            var u = i._engine.text(this, n || 0, t || 0, b(r));
            return this.__set__ && this.__set__.push(u), u;
        }, c.set = function(n) {
            i.is(n, "array") || (n = Array.prototype.splice.call(arguments, 0, arguments.length));
            var t = new yt(n);
            return this.__set__ && this.__set__.push(t), t.paper = this, t.type = "set", t;
        }, c.setStart = function(n) {
            this.__set__ = n || this.set();
        }, c.setFinish = function() {
            var n = this.__set__;
            return delete this.__set__, n;
        }, c.setSize = function(n, t) {
            return i._engine.setSize.call(this, n, t);
        }, c.setViewBox = function(n, t, r, u, f) {
            return i._engine.setViewBox.call(this, n, t, r, u, f);
        }, c.top = c.bottom = null, c.raphael = i, fu = function(n) {
            var u = n.getBoundingClientRect(), f = n.ownerDocument, t = f.body, i = f.documentElement, e = i.clientTop || t.clientTop || 0, o = i.clientLeft || t.clientLeft || 0, s = u.top + (r.win.pageYOffset || i.scrollTop || t.scrollTop) - e, h = u.left + (r.win.pageXOffset || i.scrollLeft || t.scrollLeft) - o;
            return {
                y: s,
                x: h
            };
        }, c.getElementByPoint = function(n, t) {
            var s, u, e, o = this, f = o.canvas, i = r.doc.elementFromPoint(n, t);
            if (r.win.opera && "svg" == i.tagName && (s = fu(f), u = f.createSVGRect(), u.x = n - s.x, 
            u.y = t - s.y, u.width = u.height = 1, e = f.getIntersectionList(u, null), e.length && (i = e[e.length - 1])), 
            !i) return null;
            for (;i.parentNode && i != f.parentNode && !i.raphael; ) i = i.parentNode;
            return i == o.canvas.parentNode && (i = f), i && i.raphael ? o.getById(i.raphaelid) : null;
        }, c.getElementsByBBox = function(n) {
            var t = this.set();
            return this.forEach(function(r) {
                i.isBBoxIntersect(r.getBBox(), n) && t.push(r);
            }), t;
        }, c.getById = function(n) {
            for (var t = this.bottom; t; ) {
                if (t.id == n) return t;
                t = t.next;
            }
            return null;
        }, c.forEach = function(n, t) {
            for (var i = this.bottom; i; ) {
                if (n.call(t, i) === !1) return this;
                i = i.next;
            }
            return this;
        }, c.getElementsByPoint = function(n, t) {
            var i = this.set();
            return this.forEach(function(r) {
                r.isPointInside(n, t) && i.push(r);
            }), i;
        }, e.isPointInside = function(n, t) {
            var r = this.realPath = ri[this.type](this);
            return this.attr("transform") && this.attr("transform").length && (r = i.transformPath(r, this.attr("transform"))), 
            i.isPointInsidePath(r, n, t);
        }, e.getBBox = function(n) {
            if (this.removed) return {};
            var t = this._;
            return n ? ((t.dirty || !t.bboxwt) && (this.realPath = ri[this.type](this), t.bboxwt = nr(this.realPath), 
            t.bboxwt.toString = eu, t.dirty = 0), t.bboxwt) : ((t.dirty || t.dirtyT || !t.bbox) && ((t.dirty || !this.realPath) && (t.bboxwt = 0, 
            this.realPath = ri[this.type](this)), t.bbox = nr(ki(this.realPath, this.matrix)), 
            t.bbox.toString = eu, t.dirty = t.dirtyT = 0), t.bbox);
        }, e.clone = function() {
            if (this.removed) return null;
            var n = this.paper[this.type]().attr(this.attr());
            return this.__set__ && this.__set__.push(n), n;
        }, e.glow = function(n) {
            var r;
            if ("text" == this.type) return null;
            n = n || {};
            var t = {
                width: (n.width || 10) + (+this.attr("stroke-width") || 1),
                fill: n.fill || !1,
                opacity: n.opacity || .5,
                offsetx: n.offsetx || 0,
                offsety: n.offsety || 0,
                color: n.color || "#000"
            }, u = t.width / 2, f = this.paper, e = f.set(), i = this.realPath || ri[this.type](this);
            for (i = this.matrix ? ki(i, this.matrix) : i, r = 1; u + 1 > r; r++) e.push(f.path(i).attr({
                stroke: t.color,
                fill: t.fill ? t.color : "none",
                "stroke-linejoin": "round",
                "stroke-linecap": "round",
                "stroke-width": +(t.width / u * r).toFixed(3),
                opacity: +(t.opacity / u).toFixed(3)
            }));
            return e.insertBefore(this).translate(t.offsetx, t.offsety);
        };
        var ur = function(n, t, r, u, f, e, o, s, h) {
            return null == h ? vt(n, t, r, u, f, e, o, s) : i.findDotsAtSegment(n, t, r, u, f, e, o, s, cf(n, t, r, u, f, e, o, s, h));
        }, fr = function(n, t) {
            return function(r, u, f) {
                var y, p;
                r = wt(r);
                var s, h, e, a, o, c = "", v = {}, l = 0;
                for (y = 0, p = r.length; p > y; y++) {
                    if (e = r[y], "M" == e[0]) s = +e[1], h = +e[2]; else {
                        if (a = ur(s, h, e[1], e[2], e[3], e[4], e[5], e[6]), l + a > u) {
                            if (t && !v.start) {
                                if (o = ur(s, h, e[1], e[2], e[3], e[4], e[5], e[6], u - l), c += [ "C" + o.start.x, o.start.y, o.m.x, o.m.y, o.x, o.y ], 
                                f) return c;
                                v.start = c, c = [ "M" + o.x, o.y + "C" + o.n.x, o.n.y, o.end.x, o.end.y, e[5], e[6] ].join(), 
                                l += a, s = +e[5], h = +e[6];
                                continue;
                            }
                            if (!n && !t) return o = ur(s, h, e[1], e[2], e[3], e[4], e[5], e[6], u - l), {
                                x: o.x,
                                y: o.y,
                                alpha: o.alpha
                            };
                        }
                        l += a, s = +e[5], h = +e[6];
                    }
                    c += e.shift() + e;
                }
                return v.end = c, o = n ? l : t ? v : i.findDotsAtSegment(s, h, e[0], e[1], e[2], e[3], e[4], e[5], 1), 
                o.alpha && (o = {
                    x: o.x,
                    y: o.y,
                    alpha: o.alpha
                }), o;
            };
        }, ou = fr(1), su = fr(), er = fr(0, 1);
        i.getTotalLength = ou, i.getPointAtLength = su, i.getSubpath = function(n, t, i) {
            if (this.getTotalLength(n) - i < 1e-6) return er(n, t).end;
            var r = er(n, i, 1);
            return t ? er(r, t).end : r;
        }, e.getTotalLength = function() {
            var n = this.getPath();
            return n ? this.node.getTotalLength ? this.node.getTotalLength() : ou(n) : undefined;
        }, e.getPointAtLength = function(n) {
            var t = this.getPath();
            return t ? su(t, n) : undefined;
        }, e.getPath = function() {
            var n, t = i._getPath[this.type];
            return "text" != this.type && "set" != this.type ? (t && (n = t(this)), n) : undefined;
        }, e.getSubpath = function(n, t) {
            var r = this.getPath();
            return r ? i.getSubpath(r, n, t) : undefined;
        }, g = i.easing_formulas = {
            linear: function(n) {
                return n;
            },
            "<": function(n) {
                return nt(n, 1.7);
            },
            ">": function(n) {
                return nt(n, .48);
            },
            "<>": function(n) {
                var i = .48 - n / 1.04, r = u.sqrt(.1734 + i * i), f = r - i, o = nt(y(f), 1 / 3) * (0 > f ? -1 : 1), e = -r - i, s = nt(y(e), 1 / 3) * (0 > e ? -1 : 1), t = o + s + .5;
                return 3 * (1 - t) * t * t + t * t * t;
            },
            backIn: function(n) {
                var t = 1.70158;
                return n * n * ((t + 1) * n - t);
            },
            backOut: function(n) {
                n -= 1;
                var t = 1.70158;
                return n * n * ((t + 1) * n + t) + 1;
            },
            elastic: function(n) {
                return n == !!n ? n : nt(2, -10 * n) * u.sin(2 * (n - .075) * k / .3) + 1;
            },
            bounce: function(n) {
                var i, r = 7.5625, t = 2.75;
                return 1 / t > n ? i = r * n * n : 2 / t > n ? (n -= 1.5 / t, i = r * n * n + .75) : 2.5 / t > n ? (n -= 2.25 / t, 
                i = r * n * n + .9375) : (n -= 2.625 / t, i = r * n * n + .984375), i;
            }
        }, g.easeIn = g["ease-in"] = g["<"], g.easeOut = g["ease-out"] = g[">"], g.easeInOut = g["ease-in-out"] = g["<>"], 
        g["back-in"] = g.backIn, g["back-out"] = g.backOut;
        var f = [], hu = n.requestAnimationFrame || n.webkitRequestAnimationFrame || n.mozRequestAnimationFrame || n.oRequestAnimationFrame || n.msRequestAnimationFrame || function(n) {
            setTimeout(n, 16);
        }, or = function() {
            for (var n, v, r, u, g, c, nt, w, ut, ft = +new Date(), b = 0; b < f.length; b++) if (n = f[b], 
            !n.el.removed && !n.paused) {
                var e, d, k = ft - n.start, h = n.ms, et = n.easing, o = n.from, l = n.diff, tt = n.to, y = (n.t, 
                n.el), it = {}, rt = {};
                if (n.initstatus ? (k = (n.initstatus * n.anim.top - n.prev) / (n.percent - n.prev) * h, 
                n.status = n.initstatus, delete n.initstatus, n.stop && f.splice(b--, 1)) : n.status = (n.prev + (n.percent - n.prev) * (k / h)) / n.anim.top, 
                !(0 > k)) if (h > k) {
                    v = et(k / h);
                    for (r in o) if (o[a](r)) {
                        switch (wi[r]) {
                          case p:
                            e = +o[r] + v * h * l[r];
                            break;

                          case "colour":
                            e = "rgb(" + [ sr(pi(o[r].r + v * h * l[r].r)), sr(pi(o[r].g + v * h * l[r].g)), sr(pi(o[r].b + v * h * l[r].b)) ].join(",") + ")";
                            break;

                          case "path":
                            for (e = [], u = 0, g = o[r].length; g > u; u++) {
                                for (e[u] = [ o[r][u][0] ], c = 1, nt = o[r][u].length; nt > c; c++) e[u][c] = +o[r][u][c] + v * h * l[r][u][c];
                                e[u] = e[u].join(lt);
                            }
                            e = e.join(lt);
                            break;

                          case "transform":
                            if (l[r].real) for (e = [], u = 0, g = o[r].length; g > u; u++) for (e[u] = [ o[r][u][0] ], 
                            c = 1, nt = o[r][u].length; nt > c; c++) e[u][c] = o[r][u][c] + v * h * l[r][u][c]; else w = function(n) {
                                return +o[r][n] + v * h * l[r][n];
                            }, e = [ [ "m", w(0), w(1), w(2), w(3), w(4), w(5) ] ];
                            break;

                          case "csv":
                            if ("clip-rect" == r) for (e = [], u = 4; u--; ) e[u] = +o[r][u] + v * h * l[r][u];
                            break;

                          default:
                            for (ut = [][s](o[r]), e = [], u = y.paper.customAttributes[r].length; u--; ) e[u] = +ut[u] + v * h * l[r][u];
                        }
                        it[r] = e;
                    }
                    y.attr(it), function(n, i, r) {
                        setTimeout(function() {
                            t("raphael.anim.frame." + n, i, r);
                        });
                    }(y.id, y, n.anim);
                } else {
                    if (function(n, r, u) {
                        setTimeout(function() {
                            t("raphael.anim.frame." + r.id, r, u), t("raphael.anim.finish." + r.id, r, u), i.is(n, "function") && n.call(r);
                        });
                    }(n.callback, y, n.anim), y.attr(tt), f.splice(b--, 1), n.repeat > 1 && !n.next) {
                        for (d in tt) tt[a](d) && (rt[d] = n.totalOrigin[d]);
                        n.el.attr(rt), kt(n.anim, n.el, n.anim.percents[0], null, n.totalOrigin, n.repeat - 1);
                    }
                    n.next && !n.stop && kt(n.anim, n.el, n.next, null, n.totalOrigin, n.repeat);
                }
            }
            i.svg && y && y.paper && y.paper.safari(), f.length && hu(or);
        }, sr = function(n) {
            return n > 255 ? 255 : 0 > n ? 0 : n;
        };
        e.animateWith = function(n, t, r, u, e, o) {
            var c, h, l, s = this;
            if (s.removed) return o && o.call(s), s;
            for (c = r instanceof ft ? r : i.animation(r, u, e, o), kt(c, s, c.percents[0], null, s.attr()), 
            h = 0, l = f.length; l > h; h++) if (f[h].anim == t && f[h].el == n) {
                f[l - 1].start = f[h].start;
                break;
            }
            return s;
        }, e.onAnimation = function(n) {
            return n ? t.on("raphael.anim.frame." + this.id, n) : t.unbind("raphael.anim.frame." + this.id), 
            this;
        }, ft.prototype.delay = function(n) {
            var t = new ft(this.anim, this.ms);
            return t.times = this.times, t.del = +n || 0, t;
        }, ft.prototype.repeat = function(n) {
            var t = new ft(this.anim, this.ms);
            return t.del = this.del, t.times = u.floor(o(n, 0)) || 1, t;
        }, i.animation = function(n, t, r, u) {
            if (n instanceof ft) return n;
            (i.is(r, "function") || !r) && (u = u || r || null, r = null), n = Object(n), t = +t || 0;
            var o, f, e = {};
            for (f in n) n[a](f) && h(f) != f && h(f) + "%" != f && (o = !0, e[f] = n[f]);
            return o ? (r && (e.easing = r), u && (e.callback = u), new ft({
                100: e
            }, t)) : new ft(n, t);
        }, e.animate = function(n, t, r, u) {
            var e, f = this;
            return f.removed ? (u && u.call(f), f) : (e = n instanceof ft ? n : i.animation(n, t, r, u), 
            kt(e, f, e.percents[0], null, f.attr()), f);
        }, e.setTime = function(n, t) {
            return n && null != t && this.status(n, l(t, n.ms) / n.ms), this;
        }, e.status = function(n, t) {
            var e, i, u = [], r = 0;
            if (null != t) return kt(n, this, -1, l(t, 1)), this;
            for (e = f.length; e > r; r++) if (i = f[r], i.el.id == this.id && (!n || i.anim == n)) {
                if (n) return i.status;
                u.push({
                    anim: i.anim,
                    status: i.status
                });
            }
            return n ? 0 : u;
        }, e.pause = function(n) {
            for (var i = 0; i < f.length; i++) f[i].el.id != this.id || n && f[i].anim != n || t("raphael.anim.pause." + this.id, this, f[i].anim) !== !1 && (f[i].paused = !0);
            return this;
        }, e.resume = function(n) {
            for (var r, i = 0; i < f.length; i++) f[i].el.id != this.id || n && f[i].anim != n || (r = f[i], 
            t("raphael.anim.resume." + this.id, this, r.anim) !== !1 && (delete r.paused, this.status(r.anim, r.status)));
            return this;
        }, e.stop = function(n) {
            for (var i = 0; i < f.length; i++) f[i].el.id != this.id || n && f[i].anim != n || t("raphael.anim.stop." + this.id, this, f[i].anim) !== !1 && f.splice(i--, 1);
            return this;
        }, t.on("raphael.remove", cu), t.on("raphael.clear", cu), e.toString = function() {
            return "Raphaël’s object";
        }, yt = function(n) {
            if (this.items = [], this.length = 0, this.type = "set", n) for (var t = 0, i = n.length; i > t; t++) n[t] && (n[t].constructor == e.constructor || n[t].constructor == yt) && (this[this.items.length] = this.items[this.items.length] = n[t], 
            this.length++);
        }, w = yt.prototype, w.push = function() {
            for (var n, i, t = 0, r = arguments.length; r > t; t++) n = arguments[t], n && (n.constructor == e.constructor || n.constructor == yt) && (i = this.items.length, 
            this[i] = this.items[i] = n, this.length++);
            return this;
        }, w.pop = function() {
            return this.length && delete this[this.length--], this.items.pop();
        }, w.forEach = function(n, t) {
            for (var i = 0, r = this.items.length; r > i; i++) if (n.call(t, this.items[i], i) === !1) return this;
            return this;
        };
        for (li in e) e[a](li) && (w[li] = function(n) {
            return function() {
                var t = arguments;
                return this.forEach(function(i) {
                    i[n][v](i, t);
                });
            };
        }(li));
        return w.attr = function(n, t) {
            var r, f, u, e;
            if (n && i.is(n, tt) && i.is(n[0], "object")) for (r = 0, f = n.length; f > r; r++) this.items[r].attr(n[r]); else for (u = 0, 
            e = this.items.length; e > u; u++) this.items[u].attr(n, t);
            return this;
        }, w.clear = function() {
            for (;this.length; ) this.pop();
        }, w.splice = function(n, t) {
            var r;
            n = 0 > n ? o(this.length + n, 0) : n, t = o(0, l(this.length - n, t));
            for (var u = [], e = [], f = [], i = 2; i < arguments.length; i++) f.push(arguments[i]);
            for (i = 0; t > i; i++) e.push(this[n + i]);
            for (;i < this.length - n; i++) u.push(this[n + i]);
            for (r = f.length, i = 0; i < r + u.length; i++) this.items[n + i] = this[n + i] = r > i ? f[i] : u[i - r];
            for (i = this.items.length = this.length -= t - r; this[i]; ) delete this[i++];
            return new yt(e);
        }, w.exclude = function(n) {
            for (var t = 0, i = this.length; i > t; t++) if (this[t] == n) return this.splice(t, 1), 
            !0;
        }, w.animate = function(n, t, r, u) {
            var o;
            (i.is(r, "function") || !r) && (u = r || null);
            var h, s, e = this.items.length, f = e, c = this;
            if (!e) return this;
            for (u && (s = function() {
                --e || u.call(c);
            }), r = i.is(r, ti) ? r : s, o = i.animation(n, t, r, s), h = this.items[--f].animate(o); f--; ) this.items[f] && !this.items[f].removed && this.items[f].animateWith(h, o, o), 
            this.items[f] && !this.items[f].removed || e--;
            return this;
        }, w.insertAfter = function(n) {
            for (var t = this.items.length; t--; ) this.items[t].insertAfter(n);
            return this;
        }, w.getBBox = function() {
            for (var n, t = [], i = [], r = [], u = [], f = this.items.length; f--; ) this.items[f].removed || (n = this.items[f].getBBox(), 
            t.push(n.x), i.push(n.y), r.push(n.x + n.width), u.push(n.y + n.height));
            return t = l[v](0, t), i = l[v](0, i), r = o[v](0, r), u = o[v](0, u), {
                x: t,
                y: i,
                x2: r,
                y2: u,
                width: r - t,
                height: u - i
            };
        }, w.clone = function(n) {
            n = this.paper.set();
            for (var t = 0, i = this.items.length; i > t; t++) n.push(this.items[t].clone());
            return n;
        }, w.toString = function() {
            return "Raphaël‘s set";
        }, w.glow = function(n) {
            var t = this.paper.set();
            return this.forEach(function(i) {
                var r = i.glow(n);
                null != r && r.forEach(function(n) {
                    t.push(n);
                });
            }), t;
        }, w.isPointInside = function(n, t) {
            var i = !1;
            return this.forEach(function(r) {
                return r.isPointInside(n, t) ? (i = !0, !1) : undefined;
            }), i;
        }, i.registerFont = function(n) {
            var i, u, f, r, t, e;
            if (!n.face) return n;
            this.fonts = this.fonts || {}, i = {
                w: n.w,
                face: {},
                glyphs: {}
            }, u = n.face["font-family"];
            for (f in n.face) n.face[a](f) && (i.face[f] = n.face[f]);
            if (this.fonts[u] ? this.fonts[u].push(i) : this.fonts[u] = [ i ], !n.svg) {
                i.face["units-per-em"] = st(n.face["units-per-em"], 10);
                for (r in n.glyphs) if (n.glyphs[a](r) && (t = n.glyphs[r], i.glyphs[r] = {
                    w: t.w,
                    k: {},
                    d: t.d && "M" + t.d.replace(/[mlcxtrv]/g, function(n) {
                        return {
                            l: "L",
                            c: "C",
                            x: "z",
                            t: "m",
                            r: "l",
                            v: "c"
                        }[n] || "M";
                    }) + "z"
                }, t.k)) for (e in t.k) t[a](e) && (i.glyphs[r].k[e] = t.k[e]);
            }
            return n;
        }, c.getFont = function(n, t, r, u) {
            var f, h, o, e, s, c;
            if (u = u || "normal", r = r || "normal", t = +t || {
                normal: 400,
                bold: 700,
                lighter: 300,
                bolder: 800
            }[t] || 400, i.fonts) {
                if (f = i.fonts[n], !f) {
                    h = RegExp("(^|\\s)" + n.replace(/[^\w\d\s+!~.:_-]/g, d) + "(\\s|$)", "i");
                    for (o in i.fonts) if (i.fonts[a](o) && h.test(o)) {
                        f = i.fonts[o];
                        break;
                    }
                }
                if (f) for (s = 0, c = f.length; c > s && (e = f[s], e.face["font-weight"] != t || e.face["font-style"] != r && e.face["font-style"] || e.face["font-stretch"] != u); s++) ;
                return e;
            }
        }, c.print = function(n, t, r, u, f, e, s, h) {
            var a, et, k, y;
            e = e || "middle", s = o(l(s || 0, 1), -1), h = o(l(h || 1, 3), 1);
            var c, v = b(r)[ut](d), g = 0, p = 0, tt = d;
            if (i.is(u, "string") && (u = this.getFont(u)), u) {
                c = (f || 16) / u.face["units-per-em"];
                var w = u.face.bbox[ut](vi), it = +w[0], nt = w[3] - w[1], rt = 0, ft = +w[1] + ("baseline" == e ? nt + +u.face.descent : nt / 2);
                for (a = 0, et = v.length; et > a; a++) "\n" == v[a] ? (g = 0, y = 0, p = 0, rt += nt * h) : (k = p && u.glyphs[v[a - 1]] || {}, 
                y = u.glyphs[v[a]], g += p ? (k.w || u.w) + (k.k && k.k[v[a]] || 0) + u.w * s : 0, 
                p = 1), y && y.d && (tt += i.transformPath(y.d, [ "t", g * c, rt * c, "s", c, c, it, ft, "t", (n - it) / c, (t - ft) / c ]));
            }
            return this.path(tt).attr({
                fill: "#000",
                stroke: "none"
            });
        }, c.add = function(n) {
            if (i.is(n, "array")) for (var t, u = this.set(), r = 0, f = n.length; f > r; r++) t = n[r] || {}, 
            lu[a](t.type) && u.push(this[t.type]().attr(t));
            return u;
        }, i.format = function(n, t) {
            var r = i.is(t, tt) ? [ 0 ][s](t) : arguments;
            return n && i.is(n, ti) && r.length - 1 && (n = n.replace(au, function(n, t) {
                return null == r[++t] ? d : r[t];
            })), n || d;
        }, i.fullfill = function() {
            var n = /\{([^\}]+)\}/g, t = /(?:(?:^|\.)(.+?)(?=\[|\.|$|\()|\[('|")(.+?)\2\])(\(\))?/g, i = function(n, i, r) {
                var u = r;
                return i.replace(t, function(n, t, i, r, f) {
                    t = t || r, u && (t in u && (u = u[t]), "function" == typeof u && f && (u = u()));
                }), u = (null == u || u == r ? n : u) + "";
            };
            return function(t, r) {
                return (t + "").replace(n, function(n, t) {
                    return i(n, t, r);
                });
            };
        }(), i.ninja = function() {
            return yi.was ? r.win.Raphael = yi.is : delete Raphael, i;
        }, i.st = w, function(n, t, r) {
            function u() {
                /in/.test(n.readyState) ? setTimeout(u, 9) : i.eve("raphael.DOMload");
            }
            null == n.readyState && n.addEventListener && (n.addEventListener(t, r = function() {
                n.removeEventListener(t, r, !1), n.readyState = "complete";
            }, !1), n.readyState = "loading"), u();
        }(document, "DOMContentLoaded"), t.on("raphael.DOMload", function() {
            ai = !0;
        }), function() {
            var nt, v;
            if (i.svg) {
                var t = "hasOwnProperty", u = String, f = parseFloat, tt = parseInt, c = Math, k = c.max, y = c.abs, d = c.pow, l = /[, ]+/, p = i.eve, o = "", w = " ", a = "http://www.w3.org/1999/xlink", ft = {
                    block: "M5,0 0,2.5 5,5z",
                    classic: "M5,0 0,2.5 5,5 3.5,3 3.5,2z",
                    diamond: "M2.5,0 5,2.5 2.5,5 0,2.5z",
                    open: "M6,1 1,3.5 6,6",
                    oval: "M2.5,0A2.5,2.5,0,0,1,2.5,5 2.5,2.5,0,0,1,2.5,0z"
                }, e = {};
                i.toString = function() {
                    return "Your browser supports SVG.\nYou are running Raphaël " + this.version;
                };
                var n = function(r, f) {
                    if (f) {
                        "string" == typeof r && (r = n(r));
                        for (var e in f) f[t](e) && ("xlink:" == e.substring(0, 6) ? r.setAttributeNS(a, e.substring(6), u(f[e])) : r.setAttribute(e, u(f[e])));
                    } else r = i._g.doc.createElementNS("http://www.w3.org/2000/svg", r), r.style && (r.style.webkitTapHighlightColor = "rgba(0,0,0,0)");
                    return r;
                }, it = function(t, r) {
                    var v, e, nt, p, h, rt, w = "linear", l = t.id + r, b = .5, s = .5, tt = t.node, it = t.paper, g = tt.style, a = i._g.doc.getElementById(l);
                    if (!a) {
                        if (r = u(r).replace(i._radial_gradient, function(n, t, i) {
                            if (w = "radial", t && i) {
                                b = f(t), s = f(i);
                                var r = 2 * (s > .5) - 1;
                                d(b - .5, 2) + d(s - .5, 2) > .25 && (s = c.sqrt(.25 - d(b - .5, 2)) * r + .5) && .5 != s && (s = s.toFixed(5) - 1e-5 * r);
                            }
                            return o;
                        }), r = r.split(/\s*\-\s*/), "linear" == w) {
                            if (v = r.shift(), v = -f(v), isNaN(v)) return null;
                            e = [ 0, 0, c.cos(i.rad(v)), c.sin(i.rad(v)) ], nt = 1 / (k(y(e[2]), y(e[3])) || 1), 
                            e[2] *= nt, e[3] *= nt, e[2] < 0 && (e[0] = -e[2], e[2] = 0), e[3] < 0 && (e[1] = -e[3], 
                            e[3] = 0);
                        }
                        if (p = i._parseDots(r), !p) return null;
                        if (l = l.replace(/[\(\)\s,\xb0#]/g, "_"), t.gradient && l != t.gradient.id && (it.defs.removeChild(t.gradient), 
                        delete t.gradient), !t.gradient) for (a = n(w + "Gradient", {
                            id: l
                        }), t.gradient = a, n(a, "radial" == w ? {
                            fx: b,
                            fy: s
                        } : {
                            x1: e[0],
                            y1: e[1],
                            x2: e[2],
                            y2: e[3],
                            gradientTransform: t.matrix.invert()
                        }), it.defs.appendChild(a), h = 0, rt = p.length; rt > h; h++) a.appendChild(n("stop", {
                            offset: p[h].offset ? p[h].offset : h ? "100%" : "0%",
                            "stop-color": p[h].color || "#fff"
                        }));
                    }
                    return n(tt, {
                        fill: "url(#" + l + ")",
                        opacity: 1,
                        "fill-opacity": 1
                    }), g.fill = o, g.opacity = 1, g.fillOpacity = 1, 1;
                }, b = function(t) {
                    var i = t.getBBox(1);
                    n(t.pattern, {
                        patternTransform: t.matrix.invert() + " translate(" + i.x + "," + i.y + ")"
                    });
                }, s = function(r, f, s) {
                    var b, k, g, tt, it, rt;
                    if ("path" == r.type) {
                        for (var p, w, ot, st, c, ut = u(f).toLowerCase().split("-"), ht = r.paper, h = s ? "end" : "start", ct = r.node, l = r.attrs, d = l["stroke-width"], et = ut.length, a = "classic", v = 3, y = 3, nt = 5; et--; ) switch (ut[et]) {
                          case "block":
                          case "classic":
                          case "oval":
                          case "diamond":
                          case "open":
                          case "none":
                            a = ut[et];
                            break;

                          case "wide":
                            y = 5;
                            break;

                          case "narrow":
                            y = 2;
                            break;

                          case "long":
                            v = 5;
                            break;

                          case "short":
                            v = 2;
                        }
                        "open" == a ? (v += 2, y += 2, nt += 2, ot = 1, st = s ? 4 : 1, c = {
                            fill: "none",
                            stroke: l.stroke
                        }) : (st = ot = v / 2, c = {
                            fill: l.stroke,
                            stroke: "none"
                        }), r._.arrows ? s ? (r._.arrows.endPath && e[r._.arrows.endPath]--, r._.arrows.endMarker && e[r._.arrows.endMarker]--) : (r._.arrows.startPath && e[r._.arrows.startPath]--, 
                        r._.arrows.startMarker && e[r._.arrows.startMarker]--) : r._.arrows = {}, "none" != a ? (b = "raphael-marker-" + a, 
                        k = "raphael-marker-" + h + a + v + y, i._g.doc.getElementById(b) ? e[b]++ : (ht.defs.appendChild(n(n("path"), {
                            "stroke-linecap": "round",
                            d: ft[a],
                            id: b
                        })), e[b] = 1), g = i._g.doc.getElementById(k), g ? (e[k]++, tt = g.getElementsByTagName("use")[0]) : (g = n(n("marker"), {
                            id: k,
                            markerHeight: y,
                            markerWidth: v,
                            orient: "auto",
                            refX: st,
                            refY: y / 2
                        }), tt = n(n("use"), {
                            "xlink:href": "#" + b,
                            transform: (s ? "rotate(180 " + v / 2 + " " + y / 2 + ") " : o) + "scale(" + v / nt + "," + y / nt + ")",
                            "stroke-width": (2 / (v / nt + y / nt)).toFixed(4)
                        }), g.appendChild(tt), ht.defs.appendChild(g), e[k] = 1), n(tt, c), it = ot * ("diamond" != a && "oval" != a), 
                        s ? (p = r._.arrows.startdx * d || 0, w = i.getTotalLength(l.path) - it * d) : (p = it * d, 
                        w = i.getTotalLength(l.path) - (r._.arrows.enddx * d || 0)), c = {}, c["marker-" + h] = "url(#" + k + ")", 
                        (w || p) && (c.d = i.getSubpath(l.path, p, w)), n(ct, c), r._.arrows[h + "Path"] = b, 
                        r._.arrows[h + "Marker"] = k, r._.arrows[h + "dx"] = it, r._.arrows[h + "Type"] = a, 
                        r._.arrows[h + "String"] = f) : (s ? (p = r._.arrows.startdx * d || 0, w = i.getTotalLength(l.path) - p) : (p = 0, 
                        w = i.getTotalLength(l.path) - (r._.arrows.enddx * d || 0)), r._.arrows[h + "Path"] && n(ct, {
                            d: i.getSubpath(l.path, p, w)
                        }), delete r._.arrows[h + "Path"], delete r._.arrows[h + "Marker"], delete r._.arrows[h + "dx"], 
                        delete r._.arrows[h + "Type"], delete r._.arrows[h + "String"]);
                        for (c in e) e[t](c) && !e[c] && (rt = i._g.doc.getElementById(c), rt && rt.parentNode.removeChild(rt));
                    }
                }, et = {
                    "": [ 0 ],
                    none: [ 0 ],
                    "-": [ 3, 1 ],
                    ".": [ 1, 1 ],
                    "-.": [ 3, 1, 1, 1 ],
                    "-..": [ 3, 1, 1, 1, 1, 1 ],
                    ". ": [ 1, 3 ],
                    "- ": [ 4, 3 ],
                    "--": [ 8, 3 ],
                    "- .": [ 4, 3, 1, 3 ],
                    "--.": [ 8, 3, 1, 3 ],
                    "--..": [ 8, 3, 1, 3, 1, 3 ]
                }, rt = function(t, i, r) {
                    if (i = et[u(i).toLowerCase()]) {
                        for (var e = t.attrs["stroke-width"] || "1", s = {
                            round: e,
                            square: e,
                            butt: 0
                        }[t.attrs["stroke-linecap"] || r["stroke-linecap"]] || 0, o = [], f = i.length; f--; ) o[f] = i[f] * e + (f % 2 ? 1 : -1) * s;
                        n(t.node, {
                            "stroke-dasharray": o.join(",")
                        });
                    }
                }, g = function(r, f) {
                    var v, e, d, vt, g, et, nt, p, st, at, ht, ct, lt, w, ut, ft, yt, h = r.node, c = r.attrs, pt = h.style.visibility;
                    h.style.visibility = "hidden";
                    for (v in f) if (f[t](v)) {
                        if (!i._availableAttrs[t](v)) continue;
                        switch (e = f[v], c[v] = e, v) {
                          case "blur":
                            r.blur(e);
                            break;

                          case "title":
                            d = h.getElementsByTagName("title"), d.length && (d = d[0]) ? d.firstChild.nodeValue = e : (d = n("title"), 
                            vt = i._g.doc.createTextNode(e), d.appendChild(vt), h.appendChild(d));
                            break;

                          case "href":
                          case "target":
                            g = h.parentNode, "a" != g.tagName.toLowerCase() && (et = n("a"), g.insertBefore(et, h), 
                            et.appendChild(h), g = et), "target" == v ? g.setAttributeNS(a, "show", "blank" == e ? "new" : e) : g.setAttributeNS(a, v, e);
                            break;

                          case "cursor":
                            h.style.cursor = e;
                            break;

                          case "transform":
                            r.transform(e);
                            break;

                          case "arrow-start":
                            s(r, e);
                            break;

                          case "arrow-end":
                            s(r, e, 1);
                            break;

                          case "clip-rect":
                            nt = u(e).split(l), 4 == nt.length && (r.clip && r.clip.parentNode.parentNode.removeChild(r.clip.parentNode), 
                            p = n("clipPath"), st = n("rect"), p.id = i.createUUID(), n(st, {
                                x: nt[0],
                                y: nt[1],
                                width: nt[2],
                                height: nt[3]
                            }), p.appendChild(st), r.paper.defs.appendChild(p), n(h, {
                                "clip-path": "url(#" + p.id + ")"
                            }), r.clip = st), e || (at = h.getAttribute("clip-path"), at && (ht = i._g.doc.getElementById(at.replace(/(^url\(#|\)$)/g, o)), 
                            ht && ht.parentNode.removeChild(ht), n(h, {
                                "clip-path": o
                            }), delete r.clip));
                            break;

                          case "path":
                            "path" == r.type && (n(h, {
                                d: e ? c.path = i._pathToAbsolute(e) : "M0,0"
                            }), r._.dirty = 1, r._.arrows && ("startString" in r._.arrows && s(r, r._.arrows.startString), 
                            "endString" in r._.arrows && s(r, r._.arrows.endString, 1)));
                            break;

                          case "width":
                            if (h.setAttribute(v, e), r._.dirty = 1, !c.fx) break;
                            v = "x", e = c.x;

                          case "x":
                            c.fx && (e = -c.x - (c.width || 0));

                          case "rx":
                            if ("rx" == v && "rect" == r.type) break;

                          case "cx":
                            h.setAttribute(v, e), r.pattern && b(r), r._.dirty = 1;
                            break;

                          case "height":
                            if (h.setAttribute(v, e), r._.dirty = 1, !c.fy) break;
                            v = "y", e = c.y;

                          case "y":
                            c.fy && (e = -c.y - (c.height || 0));

                          case "ry":
                            if ("ry" == v && "rect" == r.type) break;

                          case "cy":
                            h.setAttribute(v, e), r.pattern && b(r), r._.dirty = 1;
                            break;

                          case "r":
                            "rect" == r.type ? n(h, {
                                rx: e,
                                ry: e
                            }) : h.setAttribute(v, e), r._.dirty = 1;
                            break;

                          case "src":
                            "image" == r.type && h.setAttributeNS(a, "href", e);
                            break;

                          case "stroke-width":
                            (1 != r._.sx || 1 != r._.sy) && (e /= k(y(r._.sx), y(r._.sy)) || 1), r.paper._vbSize && (e *= r.paper._vbSize), 
                            h.setAttribute(v, e), c["stroke-dasharray"] && rt(r, c["stroke-dasharray"], f), 
                            r._.arrows && ("startString" in r._.arrows && s(r, r._.arrows.startString), "endString" in r._.arrows && s(r, r._.arrows.endString, 1));
                            break;

                          case "stroke-dasharray":
                            rt(r, e, f);
                            break;

                          case "fill":
                            if (ct = u(e).match(i._ISURL)) {
                                p = n("pattern"), lt = n("image"), p.id = i.createUUID(), n(p, {
                                    x: 0,
                                    y: 0,
                                    patternUnits: "userSpaceOnUse",
                                    height: 1,
                                    width: 1
                                }), n(lt, {
                                    x: 0,
                                    y: 0,
                                    "xlink:href": ct[1]
                                }), p.appendChild(lt), function(t) {
                                    i._preload(ct[1], function() {
                                        var i = this.offsetWidth, u = this.offsetHeight;
                                        n(t, {
                                            width: i,
                                            height: u
                                        }), n(lt, {
                                            width: i,
                                            height: u
                                        }), r.paper.safari();
                                    });
                                }(p), r.paper.defs.appendChild(p), n(h, {
                                    fill: "url(#" + p.id + ")"
                                }), r.pattern = p, r.pattern && b(r);
                                break;
                            }
                            if (w = i.getRGB(e), w.error) {
                                if (("circle" == r.type || "ellipse" == r.type || "r" != u(e).charAt()) && it(r, e)) {
                                    ("opacity" in c || "fill-opacity" in c) && (ut = i._g.doc.getElementById(h.getAttribute("fill").replace(/^url\(#|\)$/g, o)), 
                                    ut && (ft = ut.getElementsByTagName("stop"), n(ft[ft.length - 1], {
                                        "stop-opacity": ("opacity" in c ? c.opacity : 1) * ("fill-opacity" in c ? c["fill-opacity"] : 1)
                                    }))), c.gradient = e, c.fill = "none";
                                    break;
                                }
                            } else delete f.gradient, delete c.gradient, !i.is(c.opacity, "undefined") && i.is(f.opacity, "undefined") && n(h, {
                                opacity: c.opacity
                            }), !i.is(c["fill-opacity"], "undefined") && i.is(f["fill-opacity"], "undefined") && n(h, {
                                "fill-opacity": c["fill-opacity"]
                            });
                            w[t]("opacity") && n(h, {
                                "fill-opacity": w.opacity > 1 ? w.opacity / 100 : w.opacity
                            });

                          case "stroke":
                            w = i.getRGB(e), h.setAttribute(v, w.hex), "stroke" == v && w[t]("opacity") && n(h, {
                                "stroke-opacity": w.opacity > 1 ? w.opacity / 100 : w.opacity
                            }), "stroke" == v && r._.arrows && ("startString" in r._.arrows && s(r, r._.arrows.startString), 
                            "endString" in r._.arrows && s(r, r._.arrows.endString, 1));
                            break;

                          case "gradient":
                            ("circle" == r.type || "ellipse" == r.type || "r" != u(e).charAt()) && it(r, e);
                            break;

                          case "opacity":
                            c.gradient && !c[t]("stroke-opacity") && n(h, {
                                "stroke-opacity": e > 1 ? e / 100 : e
                            });

                          case "fill-opacity":
                            if (c.gradient) {
                                ut = i._g.doc.getElementById(h.getAttribute("fill").replace(/^url\(#|\)$/g, o)), 
                                ut && (ft = ut.getElementsByTagName("stop"), n(ft[ft.length - 1], {
                                    "stop-opacity": e
                                }));
                                break;
                            }

                          default:
                            "font-size" == v && (e = tt(e, 10) + "px"), yt = v.replace(/(\-.)/g, function(n) {
                                return n.substring(1).toUpperCase();
                            }), h.style[yt] = e, r._.dirty = 1, h.setAttribute(v, e);
                        }
                    }
                    ot(r, f), h.style.visibility = pt;
                }, ut = 1.2, ot = function(r, f) {
                    var y, h, l, e, a, p, v;
                    if ("text" == r.type && (f[t]("text") || f[t]("font") || f[t]("font-size") || f[t]("x") || f[t]("y"))) {
                        var c = r.attrs, s = r.node, w = s.firstChild ? tt(i._g.doc.defaultView.getComputedStyle(s.firstChild, o).getPropertyValue("font-size"), 10) : 10;
                        if (f[t]("text")) {
                            for (c.text = f.text; s.firstChild; ) s.removeChild(s.firstChild);
                            for (y = u(f.text).split("\n"), h = [], e = 0, a = y.length; a > e; e++) l = n("tspan"), 
                            e && n(l, {
                                dy: w * ut,
                                x: c.x
                            }), l.appendChild(i._g.doc.createTextNode(y[e])), s.appendChild(l), h[e] = l;
                        } else for (h = s.getElementsByTagName("tspan"), e = 0, a = h.length; a > e; e++) e ? n(h[e], {
                            dy: w * ut,
                            x: c.x
                        }) : n(h[0], {
                            dy: 0
                        });
                        n(s, {
                            x: c.x,
                            y: c.y
                        }), r._.dirty = 1, p = r._getBBox(), v = c.y - (p.y + p.height / 2), v && i.is(v, "finite") && n(h[0], {
                            dy: v
                        });
                    }
                }, h = function(n, t) {
                    this[0] = this.node = n, n.raphael = !0, this.id = i._oid++, n.raphaelid = this.id, 
                    this.matrix = i.matrix(), this.realPath = null, this.paper = t, this.attrs = this.attrs || {}, 
                    this._ = {
                        transform: [],
                        sx: 1,
                        sy: 1,
                        deg: 0,
                        dx: 0,
                        dy: 0,
                        dirty: 1
                    }, t.bottom || (t.bottom = this), this.prev = t.top, t.top && (t.top.next = this), 
                    t.top = this, this.next = null;
                }, r = i.el;
                h.prototype = r, r.constructor = h, i._engine.path = function(t, i) {
                    var r, u = n("path");
                    return i.canvas && i.canvas.appendChild(u), r = new h(u, i), r.type = "path", g(r, {
                        fill: "none",
                        stroke: "#000",
                        path: t
                    }), r;
                }, r.rotate = function(n, t, i) {
                    if (this.removed) return this;
                    if (n = u(n).split(l), n.length - 1 && (t = f(n[1]), i = f(n[2])), n = f(n[0]), 
                    null == i && (t = i), null == t || null == i) {
                        var r = this.getBBox(1);
                        t = r.x + r.width / 2, i = r.y + r.height / 2;
                    }
                    return this.transform(this._.transform.concat([ [ "r", n, t, i ] ])), this;
                }, r.scale = function(n, t, i, r) {
                    if (this.removed) return this;
                    if (n = u(n).split(l), n.length - 1 && (t = f(n[1]), i = f(n[2]), r = f(n[3])), 
                    n = f(n[0]), null == t && (t = n), null == r && (i = r), null == i || null == r) var e = this.getBBox(1);
                    return i = null == i ? e.x + e.width / 2 : i, r = null == r ? e.y + e.height / 2 : r, 
                    this.transform(this._.transform.concat([ [ "s", n, t, i, r ] ])), this;
                }, r.translate = function(n, t) {
                    return this.removed ? this : (n = u(n).split(l), n.length - 1 && (t = f(n[1])), 
                    n = f(n[0]) || 0, t = +t || 0, this.transform(this._.transform.concat([ [ "t", n, t ] ])), 
                    this);
                }, r.transform = function(r) {
                    var f, u = this._;
                    return null == r ? u.transform : (i._extractTransform(this, r), this.clip && n(this.clip, {
                        transform: this.matrix.invert()
                    }), this.pattern && b(this), this.node && n(this.node, {
                        transform: this.matrix
                    }), (1 != u.sx || 1 != u.sy) && (f = this.attrs[t]("stroke-width") ? this.attrs["stroke-width"] : 1, 
                    this.attr({
                        "stroke-width": f
                    })), this);
                }, r.hide = function() {
                    return this.removed || this.paper.safari(this.node.style.display = "none"), this;
                }, r.show = function() {
                    return this.removed || this.paper.safari(this.node.style.display = ""), this;
                }, r.remove = function() {
                    var n, t;
                    if (!this.removed && this.node.parentNode) {
                        n = this.paper, n.__set__ && n.__set__.exclude(this), p.unbind("raphael.*.*." + this.id), 
                        this.gradient && n.defs.removeChild(this.gradient), i._tear(this, n), "a" == this.node.parentNode.tagName.toLowerCase() ? this.node.parentNode.parentNode.removeChild(this.node.parentNode) : this.node.parentNode.removeChild(this.node);
                        for (t in this) this[t] = "function" == typeof this[t] ? i._removedFactory(t) : null;
                        this.removed = !0;
                    }
                }, r._getBBox = function() {
                    var t, n;
                    "none" == this.node.style.display && (this.show(), t = !0), n = {};
                    try {
                        n = this.node.getBBox();
                    } catch (i) {} finally {
                        n = n || {};
                    }
                    return t && this.hide(), n;
                }, r.attr = function(n, r) {
                    var e, c, a, s, o, h, f, u, v, y;
                    if (this.removed) return this;
                    if (null == n) {
                        e = {};
                        for (c in this.attrs) this.attrs[t](c) && (e[c] = this.attrs[c]);
                        return e.gradient && "none" == e.fill && (e.fill = e.gradient) && delete e.gradient, 
                        e.transform = this._.transform, e;
                    }
                    if (null == r && i.is(n, "string")) {
                        if ("fill" == n && "none" == this.attrs.fill && this.attrs.gradient) return this.attrs.gradient;
                        if ("transform" == n) return this._.transform;
                        for (a = n.split(l), s = {}, o = 0, h = a.length; h > o; o++) n = a[o], s[n] = n in this.attrs ? this.attrs[n] : i.is(this.paper.customAttributes[n], "function") ? this.paper.customAttributes[n].def : i._availableAttrs[n];
                        return h - 1 ? s : s[a[0]];
                    }
                    if (null == r && i.is(n, "array")) {
                        for (s = {}, o = 0, h = n.length; h > o; o++) s[n[o]] = this.attr(n[o]);
                        return s;
                    }
                    null != r ? (f = {}, f[n] = r) : null != n && i.is(n, "object") && (f = n);
                    for (u in f) p("raphael.attr." + u + "." + this.id, this, f[u]);
                    for (u in this.paper.customAttributes) if (this.paper.customAttributes[t](u) && f[t](u) && i.is(this.paper.customAttributes[u], "function")) {
                        v = this.paper.customAttributes[u].apply(this, [].concat(f[u])), this.attrs[u] = f[u];
                        for (y in v) v[t](y) && (f[y] = v[y]);
                    }
                    return g(this, f), this;
                }, r.toFront = function() {
                    if (this.removed) return this;
                    "a" == this.node.parentNode.tagName.toLowerCase() ? this.node.parentNode.parentNode.appendChild(this.node.parentNode) : this.node.parentNode.appendChild(this.node);
                    var n = this.paper;
                    return n.top != this && i._tofront(this, n), this;
                }, r.toBack = function() {
                    var n, t;
                    return this.removed ? this : (n = this.node.parentNode, "a" == n.tagName.toLowerCase() ? n.parentNode.insertBefore(this.node.parentNode, this.node.parentNode.parentNode.firstChild) : n.firstChild != this.node && n.insertBefore(this.node, this.node.parentNode.firstChild), 
                    i._toback(this, this.paper), t = this.paper, this);
                }, r.insertAfter = function(n) {
                    if (this.removed) return this;
                    var t = n.node || n[n.length - 1].node;
                    return t.nextSibling ? t.parentNode.insertBefore(this.node, t.nextSibling) : t.parentNode.appendChild(this.node), 
                    i._insertafter(this, n, this.paper), this;
                }, r.insertBefore = function(n) {
                    if (this.removed) return this;
                    var t = n.node || n[0].node;
                    return t.parentNode.insertBefore(this.node, t), i._insertbefore(this, n, this.paper), 
                    this;
                }, r.blur = function(t) {
                    var u, f, r = this;
                    return 0 != +t ? (u = n("filter"), f = n("feGaussianBlur"), r.attrs.blur = t, u.id = i.createUUID(), 
                    n(f, {
                        stdDeviation: +t || 1.5
                    }), u.appendChild(f), r.paper.defs.appendChild(u), r._blur = u, n(r.node, {
                        filter: "url(#" + u.id + ")"
                    })) : (r._blur && (r._blur.parentNode.removeChild(r._blur), delete r._blur, delete r.attrs.blur), 
                    r.node.removeAttribute("filter")), r;
                }, i._engine.circle = function(t, i, r, u) {
                    var f, e = n("circle");
                    return t.canvas && t.canvas.appendChild(e), f = new h(e, t), f.attrs = {
                        cx: i,
                        cy: r,
                        r: u,
                        fill: "none",
                        stroke: "#000"
                    }, f.type = "circle", n(e, f.attrs), f;
                }, i._engine.rect = function(t, i, r, u, f, e) {
                    var o, s = n("rect");
                    return t.canvas && t.canvas.appendChild(s), o = new h(s, t), o.attrs = {
                        x: i,
                        y: r,
                        width: u,
                        height: f,
                        r: e || 0,
                        rx: e || 0,
                        ry: e || 0,
                        fill: "none",
                        stroke: "#000"
                    }, o.type = "rect", n(s, o.attrs), o;
                }, i._engine.ellipse = function(t, i, r, u, f) {
                    var e, o = n("ellipse");
                    return t.canvas && t.canvas.appendChild(o), e = new h(o, t), e.attrs = {
                        cx: i,
                        cy: r,
                        rx: u,
                        ry: f,
                        fill: "none",
                        stroke: "#000"
                    }, e.type = "ellipse", n(o, e.attrs), e;
                }, i._engine.image = function(t, i, r, u, f, e) {
                    var s, o = n("image");
                    return n(o, {
                        x: r,
                        y: u,
                        width: f,
                        height: e,
                        preserveAspectRatio: "none"
                    }), o.setAttributeNS(a, "href", i), t.canvas && t.canvas.appendChild(o), s = new h(o, t), 
                    s.attrs = {
                        x: r,
                        y: u,
                        width: f,
                        height: e,
                        src: i
                    }, s.type = "image", s;
                }, i._engine.text = function(t, r, u, f) {
                    var e, o = n("text");
                    return t.canvas && t.canvas.appendChild(o), e = new h(o, t), e.attrs = {
                        x: r,
                        y: u,
                        "text-anchor": "middle",
                        text: f,
                        font: i._availableAttrs.font,
                        stroke: "none",
                        fill: "#000"
                    }, e.type = "text", g(e, e.attrs), e;
                }, i._engine.setSize = function(n, t) {
                    return this.width = n || this.width, this.height = t || this.height, this.canvas.setAttribute("width", this.width), 
                    this.canvas.setAttribute("height", this.height), this._viewBox && this.setViewBox.apply(this, this._viewBox), 
                    this;
                }, i._engine.create = function() {
                    var r, h, c, u = i._getContainer.apply(0, arguments), t = u && u.container, o = u.x, s = u.y, f = u.width, e = u.height;
                    if (!t) throw Error("SVG container not found.");
                    return r = n("svg"), h = "overflow:hidden;", o = o || 0, s = s || 0, f = f || 512, 
                    e = e || 342, n(r, {
                        height: e,
                        version: 1.1,
                        width: f,
                        xmlns: "http://www.w3.org/2000/svg"
                    }), 1 == t ? (r.style.cssText = h + "position:absolute;left:" + o + "px;top:" + s + "px", 
                    i._g.doc.body.appendChild(r), c = 1) : (r.style.cssText = h + "position:relative", 
                    t.firstChild ? t.insertBefore(r, t.firstChild) : t.appendChild(r)), t = new i._Paper(), 
                    t.width = f, t.height = e, t.canvas = r, t.clear(), t._left = t._top = 0, c && (t.renderfix = function() {}), 
                    t.renderfix(), t;
                }, i._engine.setViewBox = function(t, i, r, u, f) {
                    p("raphael.setViewBox", this, this._viewBox, [ t, i, r, u, f ]);
                    var s, h, o = k(r / this.width, u / this.height), e = this.top, c = f ? "xMidYMid meet" : "xMinYMin";
                    for (null == t ? (this._vbSize && (o = 1), delete this._vbSize, s = "0 0 " + this.width + w + this.height) : (this._vbSize = o, 
                    s = t + w + i + w + r + w + u), n(this.canvas, {
                        viewBox: s,
                        preserveAspectRatio: c
                    }); o && e; ) h = "stroke-width" in e.attrs ? e.attrs["stroke-width"] : 1, e.attr({
                        "stroke-width": h
                    }), e._.dirty = 1, e._.dirtyT = 1, e = e.prev;
                    return this._viewBox = [ t, i, r, u, !!f ], this;
                }, i.prototype.renderfix = function() {
                    var t, i, r, n = this.canvas, u = n.style;
                    try {
                        t = n.getScreenCTM() || n.createSVGMatrix();
                    } catch (f) {
                        t = n.createSVGMatrix();
                    }
                    i = -t.e % 1, r = -t.f % 1, (i || r) && (i && (this._left = (this._left + i) % 1, 
                    u.left = this._left + "px"), r && (this._top = (this._top + r) % 1, u.top = this._top + "px"));
                }, i.prototype.clear = function() {
                    i.eve("raphael.clear", this);
                    for (var t = this.canvas; t.firstChild; ) t.removeChild(t.firstChild);
                    this.bottom = this.top = null, (this.desc = n("desc")).appendChild(i._g.doc.createTextNode("Created with Raphaël " + i.version)), 
                    t.appendChild(this.desc), t.appendChild(this.defs = n("defs"));
                }, i.prototype.remove = function() {
                    p("raphael.remove", this), this.canvas.parentNode && this.canvas.parentNode.removeChild(this.canvas);
                    for (var n in this) this[n] = "function" == typeof this[n] ? i._removedFactory(n) : null;
                }, nt = i.st;
                for (v in r) r[t](v) && !nt[t](v) && (nt[v] = function(n) {
                    return function() {
                        var t = arguments;
                        return this.forEach(function(i) {
                            i[n].apply(i, t);
                        });
                    };
                }(v));
            }
        }(), function() {
            var s, d, y;
            if (i.vml) {
                var h = "hasOwnProperty", t = String, f = parseFloat, c = Math, e = c.round, k = c.max, g = c.min, p = c.abs, l = "fill", a = /[, ]+/, ut = i.eve, ft = " progid:DXImageTransform.Microsoft", o = " ", u = "", nt = {
                    M: "m",
                    L: "l",
                    C: "c",
                    Z: "x",
                    m: "t",
                    l: "r",
                    c: "v",
                    z: "x"
                }, et = /([clmz]),?([^clmz]*)/gi, ot = / progid:\S+Blur\([^\)]+\)/g, st = /-?[^,\s-]+/g, tt = "position:absolute;left:0;top:0;width:1px;height:1px", n = 21600, ht = {
                    path: 1,
                    rect: 1,
                    image: 1
                }, ct = {
                    circle: 1,
                    ellipse: 1
                }, lt = function(r) {
                    var v, c, y, f, s, w, h, p, l = /[ahqstv]/gi, a = i._pathToAbsolute;
                    if (t(r).match(l) && (a = i._path2curve), l = /[clmz]/g, a == i._pathToAbsolute && !t(r).match(l)) return t(r).replace(et, function(t, i, r) {
                        var u = [], o = "m" == i.toLowerCase(), f = nt[i];
                        return r.replace(st, function(t) {
                            o && 2 == u.length && (f += u + nt["m" == i ? "l" : "L"], u = []), u.push(e(t * n));
                        }), f + u;
                    });
                    for (c = a(r), v = [], s = 0, w = c.length; w > s; s++) {
                        for (y = c[s], f = c[s][0].toLowerCase(), "z" == f && (f = "x"), h = 1, p = y.length; p > h; h++) f += e(y[h] * n) + (h != p - 1 ? "," : u);
                        v.push(f);
                    }
                    return v.join(o);
                }, it = function(n, t, r) {
                    var u = i.matrix();
                    return u.rotate(-n, .5, .5), {
                        dx: u.x(t, r),
                        dy: u.y(t, r)
                    };
                }, w = function(t, i, r, u, f, e) {
                    var a, s, v = t._, k = t.matrix, h = v.fillpos, c = t.node, y = c.style, w = 1, b = "", d = n / i, g = n / r;
                    y.visibility = "hidden", i && r && (c.coordsize = p(d) + o + p(g), y.rotation = e * (0 > i * r ? -1 : 1), 
                    e && (a = it(e, u, f), u = a.dx, f = a.dy), 0 > i && (b += "x"), 0 > r && (b += " y") && (w = -1), 
                    y.flip = b, c.coordorigin = u * -d + o + f * -g, (h || v.fillsize) && (s = c.getElementsByTagName(l), 
                    s = s && s[0], c.removeChild(s), h && (a = it(e, k.x(h[0], h[1]), k.y(h[0], h[1])), 
                    s.position = a.dx * w + o + a.dy * w), v.fillsize && (s.size = v.fillsize[0] * p(i) + o + v.fillsize[1] * p(r)), 
                    c.appendChild(s)), y.visibility = "visible");
                };
                i.toString = function() {
                    return "Your browser doesn’t support SVG. Falling down to VML.\nYou are running Raphaël " + this.version;
                };
                var rt = function(n, i, r) {
                    for (var e, u = t(i).toLowerCase().split("-"), o = r ? "end" : "start", f = u.length, s = "classic", h = "medium", c = "medium"; f--; ) switch (u[f]) {
                      case "block":
                      case "classic":
                      case "oval":
                      case "diamond":
                      case "open":
                      case "none":
                        s = u[f];
                        break;

                      case "wide":
                      case "narrow":
                        c = u[f];
                        break;

                      case "long":
                      case "short":
                        h = u[f];
                    }
                    e = n.node.getElementsByTagName("stroke")[0], e[o + "arrow"] = s, e[o + "arrowlength"] = h, 
                    e[o + "arrowwidth"] = c;
                }, v = function(r, c) {
                    var yt, nt, ot, ut, ft, y, si, pt, st, tt, d, dt, gt, et, ni, vt, ri, bt, hi;
                    r.attrs = r.attrs || {};
                    var b = r.node, v = r.attrs, it = b.style, ui = ht[r.type] && (c.x != v.x || c.y != v.y || c.width != v.width || c.height != v.height || c.cx != v.cx || c.cy != v.cy || c.rx != v.rx || c.ry != v.ry || c.r != v.r), ci = ct[r.type] && (v.cx != c.cx || v.cy != c.cy || v.r != c.r || v.rx != c.rx || v.ry != c.ry), p = r;
                    for (yt in c) c[h](yt) && (v[yt] = c[yt]);
                    if (ui && (v.path = i._getPath[r.type](r), r._.dirty = 1), c.href && (b.href = c.href), 
                    c.title && (b.title = c.title), c.target && (b.target = c.target), c.cursor && (it.cursor = c.cursor), 
                    "blur" in c && r.blur(c.blur), (c.path && "path" == r.type || ui) && (b.path = lt(~t(v.path).toLowerCase().indexOf("r") ? i._pathToAbsolute(v.path) : v.path), 
                    "image" == r.type && (r._.fillpos = [ v.x, v.y ], r._.fillsize = [ v.width, v.height ], 
                    w(r, 1, 1, 0, 0, 0))), "transform" in c && r.transform(c.transform), ci) {
                        var kt = +v.cx, fi = +v.cy, ei = +v.rx || +v.r || 0, oi = +v.ry || +v.r || 0;
                        b.path = i.format("ar{0},{1},{2},{3},{4},{1},{4},{1}x", e((kt - ei) * n), e((fi - oi) * n), e((kt + ei) * n), e((fi + oi) * n), e(kt * n)), 
                        r._.dirty = 1;
                    }
                    if ("clip-rect" in c && (nt = t(c["clip-rect"]).split(a), 4 == nt.length && (nt[2] = +nt[2] + +nt[0], 
                    nt[3] = +nt[3] + +nt[1], ot = b.clipRect || i._g.doc.createElement("div"), ut = ot.style, 
                    ut.clip = i.format("rect({1}px {2}px {3}px {0}px)", nt), b.clipRect || (ut.position = "absolute", 
                    ut.top = 0, ut.left = 0, ut.width = r.paper.width + "px", ut.height = r.paper.height + "px", 
                    b.parentNode.insertBefore(ot, b), ot.appendChild(b), b.clipRect = ot)), c["clip-rect"] || b.clipRect && (b.clipRect.style.clip = "auto")), 
                    r.textpath && (ft = r.textpath.style, c.font && (ft.font = c.font), c["font-family"] && (ft.fontFamily = '"' + c["font-family"].split(",")[0].replace(/^['"]+|['"]+$/g, u) + '"'), 
                    c["font-size"] && (ft.fontSize = c["font-size"]), c["font-weight"] && (ft.fontWeight = c["font-weight"]), 
                    c["font-style"] && (ft.fontStyle = c["font-style"])), "arrow-start" in c && rt(p, c["arrow-start"]), 
                    "arrow-end" in c && rt(p, c["arrow-end"], 1), (null != c.opacity || null != c["stroke-width"] || null != c.fill || null != c.src || null != c.stroke || null != c["stroke-width"] || null != c["stroke-opacity"] || null != c["fill-opacity"] || null != c["stroke-dasharray"] || null != c["stroke-miterlimit"] || null != c["stroke-linejoin"] || null != c["stroke-linecap"]) && (y = b.getElementsByTagName(l), 
                    si = !1, y = y && y[0], y || (si = y = s(l)), "image" == r.type && c.src && (y.src = c.src), 
                    c.fill && (y.on = !0), (null == y.on || "none" == c.fill || null === c.fill) && (y.on = !1), 
                    y.on && c.fill && (pt = t(c.fill).match(i._ISURL), pt ? (y.parentNode == b && b.removeChild(y), 
                    y.rotate = !0, y.src = pt[1], y.type = "tile", st = r.getBBox(1), y.position = st.x + o + st.y, 
                    r._.fillpos = [ st.x, st.y ], i._preload(pt[1], function() {
                        r._.fillsize = [ this.offsetWidth, this.offsetHeight ];
                    })) : (y.color = i.getRGB(c.fill).hex, y.src = u, y.type = "solid", i.getRGB(c.fill).error && (p.type in {
                        circle: 1,
                        ellipse: 1
                    } || "r" != t(c.fill).charAt()) && at(p, c.fill, y) && (v.fill = "none", v.gradient = c.fill, 
                    y.rotate = !1))), ("fill-opacity" in c || "opacity" in c) && (tt = ((+v["fill-opacity"] + 1 || 2) - 1) * ((+v.opacity + 1 || 2) - 1) * ((+i.getRGB(c.fill).o + 1 || 2) - 1), 
                    tt = g(k(tt, 0), 1), y.opacity = tt, y.src && (y.color = "none")), b.appendChild(y), 
                    d = b.getElementsByTagName("stroke") && b.getElementsByTagName("stroke")[0], dt = !1, 
                    d || (dt = d = s("stroke")), (c.stroke && "none" != c.stroke || c["stroke-width"] || null != c["stroke-opacity"] || c["stroke-dasharray"] || c["stroke-miterlimit"] || c["stroke-linejoin"] || c["stroke-linecap"]) && (d.on = !0), 
                    ("none" == c.stroke || null === c.stroke || null == d.on || 0 == c.stroke || 0 == c["stroke-width"]) && (d.on = !1), 
                    gt = i.getRGB(c.stroke), d.on && c.stroke && (d.color = gt.hex), tt = ((+v["stroke-opacity"] + 1 || 2) - 1) * ((+v.opacity + 1 || 2) - 1) * ((+gt.o + 1 || 2) - 1), 
                    et = .75 * (f(c["stroke-width"]) || 1), tt = g(k(tt, 0), 1), null == c["stroke-width"] && (et = v["stroke-width"]), 
                    c["stroke-width"] && (d.weight = et), et && 1 > et && (tt *= et) && (d.weight = 1), 
                    d.opacity = tt, c["stroke-linejoin"] && (d.joinstyle = c["stroke-linejoin"] || "miter"), 
                    d.miterlimit = c["stroke-miterlimit"] || 8, c["stroke-linecap"] && (d.endcap = "butt" == c["stroke-linecap"] ? "flat" : "square" == c["stroke-linecap"] ? "square" : "round"), 
                    "stroke-dasharray" in c && (ni = {
                        "-": "shortdash",
                        ".": "shortdot",
                        "-.": "shortdashdot",
                        "-..": "shortdashdotdot",
                        ". ": "dot",
                        "- ": "dash",
                        "--": "longdash",
                        "- .": "dashdot",
                        "--.": "longdashdot",
                        "--..": "longdashdotdot"
                    }, d.dashstyle = ni[h](c["stroke-dasharray"]) ? ni[c["stroke-dasharray"]] : u), 
                    dt && b.appendChild(d)), "text" == p.type) {
                        p.paper.canvas.style.display = u;
                        var ti = p.paper.span, ii = 100, wt = v.font && v.font.match(/\d+(?:\.\d*)?(?=px)/);
                        for ((it = ti.style, v.font && (it.font = v.font), v["font-family"] && (it.fontFamily = v["font-family"]), 
                        v["font-weight"] && (it.fontWeight = v["font-weight"]), v["font-style"] && (it.fontStyle = v["font-style"]), 
                        wt = f(v["font-size"] || wt && wt[0]) || 10, it.fontSize = wt * ii + "px", p.textpath.string && (ti.innerHTML = t(p.textpath.string).replace(/</g, "&#60;").replace(/&/g, "&#38;").replace(/\n/g, "<br>")), 
                        vt = ti.getBoundingClientRect(), p.W = v.w = (vt.right - vt.left) / ii, p.H = v.h = (vt.bottom - vt.top) / ii, 
                        p.X = v.x, p.Y = v.y + p.H / 2, ("x" in c || "y" in c) && (p.path.v = i.format("m{0},{1}l{2},{1}", e(v.x * n), e(v.y * n), e(v.x * n) + 1)), 
                        ri = [ "x", "y", "text", "font", "font-family", "font-weight", "font-style", "font-size" ], 
                        bt = 0, hi = ri.length); hi > bt; bt++) if (ri[bt] in c) {
                            p._.dirty = 1;
                            break;
                        }
                        switch (v["text-anchor"]) {
                          case "start":
                            p.textpath.style["v-text-align"] = "left", p.bbx = p.W / 2;
                            break;

                          case "end":
                            p.textpath.style["v-text-align"] = "right", p.bbx = -p.W / 2;
                            break;

                          default:
                            p.textpath.style["v-text-align"] = "center", p.bbx = 0;
                        }
                        p.textpath.style["v-text-kern"] = !0;
                    }
                }, at = function(n, r, e) {
                    var l, s, a, h, w;
                    n.attrs = n.attrs || {};
                    var v = (n.attrs, Math.pow), y = "linear", p = ".5 .5";
                    if (n.attrs.gradient = r, r = t(r).replace(i._radial_gradient, function(n, t, i) {
                        return y = "radial", t && i && (t = f(t), i = f(i), v(t - .5, 2) + v(i - .5, 2) > .25 && (i = c.sqrt(.25 - v(t - .5, 2)) * (2 * (i > .5) - 1) + .5), 
                        p = t + o + i), u;
                    }), r = r.split(/\s*\-\s*/), "linear" == y && (l = r.shift(), l = -f(l), isNaN(l)) || (s = i._parseDots(r), 
                    !s)) return null;
                    if (n = n.shape || n.node, s.length) {
                        for (n.removeChild(e), e.on = !0, e.method = "none", e.color = s[0].color, e.color2 = s[s.length - 1].color, 
                        a = [], h = 0, w = s.length; w > h; h++) s[h].offset && a.push(s[h].offset + o + s[h].color);
                        e.colors = a.length ? a.join() : "0% " + e.color, "radial" == y ? (e.type = "gradientTitle", 
                        e.focus = "100%", e.focussize = "0 0", e.focusposition = p, e.angle = 0) : (e.type = "gradient", 
                        e.angle = (270 - l) % 360), n.appendChild(e);
                    }
                    return 1;
                }, b = function(n, t) {
                    this[0] = this.node = n, n.raphael = !0, this.id = i._oid++, n.raphaelid = this.id, 
                    this.X = 0, this.Y = 0, this.attrs = {}, this.paper = t, this.matrix = i.matrix(), 
                    this._ = {
                        transform: [],
                        sx: 1,
                        sy: 1,
                        dx: 0,
                        dy: 0,
                        deg: 0,
                        dirty: 1,
                        dirtyT: 1
                    }, t.bottom || (t.bottom = this), this.prev = t.top, t.top && (t.top.next = this), 
                    t.top = this, this.next = null;
                }, r = i.el;
                b.prototype = r, r.constructor = b, r.transform = function(r) {
                    var e, a, l;
                    if (null == r) return this._.transform;
                    e = this.paper._viewBoxShift, a = e ? "s" + [ e.scale, e.scale ] + "-1-1t" + [ e.dx, e.dy ] : u, 
                    e && (l = r = t(r).replace(/\.{3}|\u2026/g, this._.transform || u)), i._extractTransform(this, a + r);
                    var f, s = this.matrix.clone(), h = this.skew, c = this.node, v = ~t(this.attrs.fill).indexOf("-"), d = !t(this.attrs.fill).indexOf("url(");
                    if (s.translate(1, 1), d || v || "image" == this.type) if (h.matrix = "1 0 0 1", 
                    h.offset = "0 0", f = s.split(), v && f.noRotation || !f.isSimple) {
                        c.style.filter = s.toFilter();
                        var y = this.getBBox(), p = this.getBBox(1), b = y.x - p.x, k = y.y - p.y;
                        c.coordorigin = b * -n + o + k * -n, w(this, 1, 1, b, k, 0);
                    } else c.style.filter = u, w(this, f.scalex, f.scaley, f.dx, f.dy, f.rotate); else c.style.filter = u, 
                    h.matrix = t(s), h.offset = s.offset();
                    return l && (this._.transform = l), this;
                }, r.rotate = function(n, i, r) {
                    if (this.removed) return this;
                    if (null != n) {
                        if (n = t(n).split(a), n.length - 1 && (i = f(n[1]), r = f(n[2])), n = f(n[0]), 
                        null == r && (i = r), null == i || null == r) {
                            var u = this.getBBox(1);
                            i = u.x + u.width / 2, r = u.y + u.height / 2;
                        }
                        return this._.dirtyT = 1, this.transform(this._.transform.concat([ [ "r", n, i, r ] ])), 
                        this;
                    }
                }, r.translate = function(n, i) {
                    return this.removed ? this : (n = t(n).split(a), n.length - 1 && (i = f(n[1])), 
                    n = f(n[0]) || 0, i = +i || 0, this._.bbox && (this._.bbox.x += n, this._.bbox.y += i), 
                    this.transform(this._.transform.concat([ [ "t", n, i ] ])), this);
                }, r.scale = function(n, i, r, u) {
                    if (this.removed) return this;
                    if (n = t(n).split(a), n.length - 1 && (i = f(n[1]), r = f(n[2]), u = f(n[3]), isNaN(r) && (r = null), 
                    isNaN(u) && (u = null)), n = f(n[0]), null == i && (i = n), null == u && (r = u), 
                    null == r || null == u) var e = this.getBBox(1);
                    return r = null == r ? e.x + e.width / 2 : r, u = null == u ? e.y + e.height / 2 : u, 
                    this.transform(this._.transform.concat([ [ "s", n, i, r, u ] ])), this._.dirtyT = 1, 
                    this;
                }, r.hide = function() {
                    return this.removed || (this.node.style.display = "none"), this;
                }, r.show = function() {
                    return this.removed || (this.node.style.display = u), this;
                }, r._getBBox = function() {
                    return this.removed ? {} : {
                        x: this.X + (this.bbx || 0) - this.W / 2,
                        y: this.Y - this.H,
                        width: this.W,
                        height: this.H
                    };
                }, r.remove = function() {
                    if (!this.removed && this.node.parentNode) {
                        this.paper.__set__ && this.paper.__set__.exclude(this), i.eve.unbind("raphael.*.*." + this.id), 
                        i._tear(this, this.paper), this.node.parentNode.removeChild(this.node), this.shape && this.shape.parentNode.removeChild(this.shape);
                        for (var n in this) this[n] = "function" == typeof this[n] ? i._removedFactory(n) : null;
                        this.removed = !0;
                    }
                }, r.attr = function(n, t) {
                    var f, c, y, o, e, s, r, u, p, w;
                    if (this.removed) return this;
                    if (null == n) {
                        f = {};
                        for (c in this.attrs) this.attrs[h](c) && (f[c] = this.attrs[c]);
                        return f.gradient && "none" == f.fill && (f.fill = f.gradient) && delete f.gradient, 
                        f.transform = this._.transform, f;
                    }
                    if (null == t && i.is(n, "string")) {
                        if (n == l && "none" == this.attrs.fill && this.attrs.gradient) return this.attrs.gradient;
                        for (y = n.split(a), o = {}, e = 0, s = y.length; s > e; e++) n = y[e], o[n] = n in this.attrs ? this.attrs[n] : i.is(this.paper.customAttributes[n], "function") ? this.paper.customAttributes[n].def : i._availableAttrs[n];
                        return s - 1 ? o : o[y[0]];
                    }
                    if (this.attrs && null == t && i.is(n, "array")) {
                        for (o = {}, e = 0, s = n.length; s > e; e++) o[n[e]] = this.attr(n[e]);
                        return o;
                    }
                    null != t && (r = {}, r[n] = t), null == t && i.is(n, "object") && (r = n);
                    for (u in r) ut("raphael.attr." + u + "." + this.id, this, r[u]);
                    if (r) {
                        for (u in this.paper.customAttributes) if (this.paper.customAttributes[h](u) && r[h](u) && i.is(this.paper.customAttributes[u], "function")) {
                            p = this.paper.customAttributes[u].apply(this, [].concat(r[u])), this.attrs[u] = r[u];
                            for (w in p) p[h](w) && (r[w] = p[w]);
                        }
                        r.text && "text" == this.type && (this.textpath.string = r.text), v(this, r);
                    }
                    return this;
                }, r.toFront = function() {
                    return this.removed || this.node.parentNode.appendChild(this.node), this.paper && this.paper.top != this && i._tofront(this, this.paper), 
                    this;
                }, r.toBack = function() {
                    return this.removed ? this : (this.node.parentNode.firstChild != this.node && (this.node.parentNode.insertBefore(this.node, this.node.parentNode.firstChild), 
                    i._toback(this, this.paper)), this);
                }, r.insertAfter = function(n) {
                    return this.removed ? this : (n.constructor == i.st.constructor && (n = n[n.length - 1]), 
                    n.node.nextSibling ? n.node.parentNode.insertBefore(this.node, n.node.nextSibling) : n.node.parentNode.appendChild(this.node), 
                    i._insertafter(this, n, this.paper), this);
                }, r.insertBefore = function(n) {
                    return this.removed ? this : (n.constructor == i.st.constructor && (n = n[0]), n.node.parentNode.insertBefore(this.node, n.node), 
                    i._insertbefore(this, n, this.paper), this);
                }, r.blur = function(n) {
                    var t = this.node.runtimeStyle, r = t.filter;
                    return r = r.replace(ot, u), 0 != +n ? (this.attrs.blur = n, t.filter = r + o + ft + ".Blur(pixelradius=" + (+n || 1.5) + ")", 
                    t.margin = i.format("-{0}px 0 0 -{0}px", e(+n || 1.5))) : (t.filter = r, t.margin = 0, 
                    delete this.attrs.blur), this;
                }, i._engine.path = function(t, i) {
                    var r, h, e, f = s("shape");
                    return f.style.cssText = tt, f.coordsize = n + o + n, f.coordorigin = i.coordorigin, 
                    r = new b(f, i), h = {
                        fill: "none",
                        stroke: "#000"
                    }, t && (h.path = t), r.type = "path", r.path = [], r.Path = u, v(r, h), i.canvas.appendChild(f), 
                    e = s("skew"), e.on = !0, f.appendChild(e), r.skew = e, r.transform(u), r;
                }, i._engine.rect = function(n, t, r, u, f, e) {
                    var h = i._rectPath(t, r, u, f, e), o = n.path(h), s = o.attrs;
                    return o.X = s.x = t, o.Y = s.y = r, o.W = s.width = u, o.H = s.height = f, s.r = e, 
                    s.path = h, o.type = "rect", o;
                }, i._engine.ellipse = function(n, t, i, r, u) {
                    {
                        var f = n.path();
                        f.attrs;
                    }
                    return f.X = t - r, f.Y = i - u, f.W = 2 * r, f.H = 2 * u, f.type = "ellipse", v(f, {
                        cx: t,
                        cy: i,
                        rx: r,
                        ry: u
                    }), f;
                }, i._engine.circle = function(n, t, i, r) {
                    {
                        var u = n.path();
                        u.attrs;
                    }
                    return u.X = t - r, u.Y = i - r, u.W = u.H = 2 * r, u.type = "circle", v(u, {
                        cx: t,
                        cy: i,
                        r: r
                    }), u;
                }, i._engine.image = function(n, t, r, u, f, e) {
                    var a = i._rectPath(r, u, f, e), o = n.path(a).attr({
                        stroke: "none"
                    }), s = o.attrs, c = o.node, h = c.getElementsByTagName(l)[0];
                    return s.src = t, o.X = s.x = r, o.Y = s.y = u, o.W = s.width = f, o.H = s.height = e, 
                    s.path = a, o.type = "image", h.parentNode == c && c.removeChild(h), h.rotate = !0, 
                    h.src = t, h.type = "tile", o._.fillpos = [ r, u ], o._.fillsize = [ f, e ], c.appendChild(h), 
                    w(o, 1, 1, 0, 0, 0), o;
                }, i._engine.text = function(r, f, h, c) {
                    var l, k, w, a = s("shape"), y = s("path"), p = s("textpath");
                    return f = f || 0, h = h || 0, c = c || "", y.v = i.format("m{0},{1}l{2},{1}", e(f * n), e(h * n), e(f * n) + 1), 
                    y.textpathok = !0, p.string = t(c), p.on = !0, a.style.cssText = tt, a.coordsize = n + o + n, 
                    a.coordorigin = "0 0", l = new b(a, r), k = {
                        fill: "#000",
                        stroke: "none",
                        font: i._availableAttrs.font,
                        text: c
                    }, l.shape = a, l.path = y, l.textpath = p, l.type = "text", l.attrs.text = t(c), 
                    l.attrs.x = f, l.attrs.y = h, l.attrs.w = 1, l.attrs.h = 1, v(l, k), a.appendChild(p), 
                    a.appendChild(y), r.canvas.appendChild(a), w = s("skew"), w.on = !0, a.appendChild(w), 
                    l.skew = w, l.transform(u), l;
                }, i._engine.setSize = function(n, t) {
                    var r = this.canvas.style;
                    return this.width = n, this.height = t, n == +n && (n += "px"), t == +t && (t += "px"), 
                    r.width = n, r.height = t, r.clip = "rect(0 " + n + " " + t + " 0)", this._viewBox && i._engine.setViewBox.apply(this, this._viewBox), 
                    this;
                }, i._engine.setViewBox = function(n, t, r, u, f) {
                    i.eve("raphael.setViewBox", this, this._viewBox, [ n, t, r, u, f ]);
                    var s, h, e = this.width, o = this.height, c = 1 / k(r / e, u / o);
                    return f && (s = o / u, h = e / r, e > r * s && (n -= (e - r * s) / 2 / s), o > u * h && (t -= (o - u * h) / 2 / h)), 
                    this._viewBox = [ n, t, r, u, !!f ], this._viewBoxShift = {
                        dx: -n,
                        dy: -t,
                        scale: c
                    }, this.forEach(function(n) {
                        n.transform("...");
                    }), this;
                }, i._engine.initWin = function(n) {
                    var t = n.document;
                    t.createStyleSheet().addRule(".rvml", "behavior:url(#default#VML)");
                    try {
                        t.namespaces.rvml || t.namespaces.add("rvml", "urn:schemas-microsoft-com:vml"), 
                        s = function(n) {
                            return t.createElement("<rvml:" + n + ' class="rvml">');
                        };
                    } catch (i) {
                        s = function(n) {
                            return t.createElement("<" + n + ' xmlns="urn:schemas-microsoft.com:vml" class="rvml">');
                        };
                    }
                }, i._engine.initWin(i._g.win), i._engine.create = function() {
                    var e = i._getContainer.apply(0, arguments), f = e.container, r = e.height, u = e.width, c = e.x, l = e.y;
                    if (!f) throw Error("VML container not found.");
                    var t = new i._Paper(), s = t.canvas = i._g.doc.createElement("div"), h = s.style;
                    return c = c || 0, l = l || 0, u = u || 512, r = r || 342, t.width = u, t.height = r, 
                    u == +u && (u += "px"), r == +r && (r += "px"), t.coordsize = 1e3 * n + o + 1e3 * n, 
                    t.coordorigin = "0 0", t.span = i._g.doc.createElement("span"), t.span.style.cssText = "position:absolute;left:-9999em;top:-9999em;padding:0;margin:0;line-height:1;", 
                    s.appendChild(t.span), h.cssText = i.format("top:0;left:0;width:{0};height:{1};display:inline-block;position:relative;clip:rect(0 {0} {1} 0);overflow:hidden", u, r), 
                    1 == f ? (i._g.doc.body.appendChild(s), h.left = c + "px", h.top = l + "px", h.position = "absolute") : f.firstChild ? f.insertBefore(s, f.firstChild) : f.appendChild(s), 
                    t.renderfix = function() {}, t;
                }, i.prototype.clear = function() {
                    i.eve("raphael.clear", this), this.canvas.innerHTML = u, this.span = i._g.doc.createElement("span"), 
                    this.span.style.cssText = "position:absolute;left:-9999em;top:-9999em;padding:0;margin:0;line-height:1;display:inline;", 
                    this.canvas.appendChild(this.span), this.bottom = this.top = null;
                }, i.prototype.remove = function() {
                    i.eve("raphael.remove", this), this.canvas.parentNode.removeChild(this.canvas);
                    for (var n in this) this[n] = "function" == typeof this[n] ? i._removedFactory(n) : null;
                    return !0;
                }, d = i.st;
                for (y in r) r[h](y) && !d[h](y) && (d[y] = function(n) {
                    return function() {
                        var t = arguments;
                        return this.forEach(function(i) {
                            i[n].apply(i, t);
                        });
                    };
                }(y));
            }
        }(), yi.was ? r.win.Raphael = i : Raphael = i, i;
    }), function() {
        "use strict";
        function f(n) {
            return 10 > n ? "0" + n : n;
        }
        function quote(string) {
            return escapable.lastIndex = 0, escapable.test(string) ? '"' + string.replace(escapable, function(a) {
                var c = meta[a];
                return "string" == typeof c ? c : "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4);
            }) + '"' : '"' + string + '"';
        }
        function str(key, holder) {
            var i, k, v, length, partial, mind = gap, value = holder[key];
            switch (value && "object" == typeof value && "function" == typeof value.toJSON && (value = value.toJSON(key)), 
            "function" == typeof rep && (value = rep.call(holder, key, value)), typeof value) {
              case "string":
                return quote(value);

              case "number":
                return isFinite(value) ? value + "" : "null";

              case "boolean":
              case "null":
                return value + "";

              case "object":
                if (!value) return "null";
                if (gap += indent, partial = [], "[object Array]" === Object.prototype.toString.apply(value)) {
                    for (length = value.length, i = 0; length > i; i += 1) partial[i] = str(i, value) || "null";
                    return v = 0 === partial.length ? "[]" : gap ? "[\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "]" : "[" + partial.join(",") + "]", 
                    gap = mind, v;
                }
                if (rep && "object" == typeof rep) for (length = rep.length, i = 0; length > i; i += 1) "string" == typeof rep[i] && (k = rep[i], 
                v = str(k, value), v && partial.push(quote(k) + (gap ? ": " : ":") + v)); else for (k in value) Object.prototype.hasOwnProperty.call(value, k) && (v = str(k, value), 
                v && partial.push(quote(k) + (gap ? ": " : ":") + v));
                return v = 0 === partial.length ? "{}" : gap ? "{\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "}" : "{" + partial.join(",") + "}", 
                gap = mind, v;
            }
        }
        "function" != typeof Date.prototype.toJSON && (Date.prototype.toJSON = function() {
            return isFinite(this.valueOf()) ? this.getUTCFullYear() + "-" + f(this.getUTCMonth() + 1) + "-" + f(this.getUTCDate()) + "T" + f(this.getUTCHours()) + ":" + f(this.getUTCMinutes()) + ":" + f(this.getUTCSeconds()) + "Z" : null;
        }, String.prototype.toJSON = Number.prototype.toJSON = Boolean.prototype.toJSON = function() {
            return this.valueOf();
        });
        var cx, escapable, gap, indent, meta, rep;
        "function" != typeof JSON.stringify && (escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, 
        meta = {
            "\b": "\\b",
            "	": "\\t",
            "\n": "\\n",
            "\f": "\\f",
            "\r": "\\r",
            '"': '\\"',
            "\\": "\\\\"
        }, JSON.stringify = function(value, replacer, space) {
            var i;
            if (gap = "", indent = "", "number" == typeof space) for (i = 0; space > i; i += 1) indent += " "; else "string" == typeof space && (indent = space);
            if (rep = replacer, replacer && "function" != typeof replacer && ("object" != typeof replacer || "number" != typeof replacer.length)) throw Error("JSON.stringify");
            return str("", {
                "": value
            });
        }), "function" != typeof JSON.parse && (cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, 
        JSON.parse = function(text, reviver) {
            function walk(holder, key) {
                var k, v, value = holder[key];
                if (value && "object" == typeof value) for (k in value) Object.prototype.hasOwnProperty.call(value, k) && (v = walk(value, k), 
                v !== undefined ? value[k] = v : delete value[k]);
                return reviver.call(holder, key, value);
            }
            var j;
            if (text += "", cx.lastIndex = 0, cx.test(text) && (text = text.replace(cx, function(a) {
                return "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4);
            })), /^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:\s*\[)+/g, ""))) return j = eval("(" + text + ")"), 
            "function" == typeof reviver ? walk({
                "": j
            }, "") : j;
            throw new SyntaxError("JSON.parse");
        });
    }(), Array.prototype.map || (Array.prototype.map = function(callback, thisArg) {
        var T, A, k;
        if (null == this) throw new TypeError(" this is null or not defined");
        var O = Object(this), len = O.length >>> 0;
        if ("[object Function]" != {}.toString.call(callback)) throw new TypeError(callback + " is not a function");
        for (thisArg && (T = thisArg), A = Array(len), k = 0; len > k; ) {
            var kValue, mappedValue;
            k in O && (kValue = O[k], mappedValue = callback.call(T, kValue, k, O), A[k] = mappedValue), 
            k++;
        }
        return A;
    }), Array.prototype.indexOf || (Array.prototype.indexOf = function(searchElement, fromIndex) {
        if (this === undefined || null === this) throw new TypeError('"this" is null or not defined');
        var length = this.length >>> 0;
        for (fromIndex = +fromIndex || 0, 1 / 0 === Math.abs(fromIndex) && (fromIndex = 0), 
        0 > fromIndex && (fromIndex += length, 0 > fromIndex && (fromIndex = 0)); length > fromIndex; fromIndex++) if (this[fromIndex] === searchElement) return fromIndex;
        return -1;
    }), Array.prototype.forEach || (Array.prototype.forEach = function(callback, thisArg) {
        var T, k;
        if (null == this) throw new TypeError(" this is null or not defined");
        var O = Object(this), len = O.length >>> 0;
        if ("function" != typeof callback) throw new TypeError(callback + " is not a function");
        for (thisArg && (T = thisArg), k = 0; len > k; ) {
            var kValue;
            k in O && (kValue = O[k], callback.call(T, kValue, k, O)), k++;
        }
    }), "function" != typeof Object.create && !function() {
        var F = function() {};
        Object.create = function(o) {
            if (arguments.length > 1) throw Error("Second argument not supported");
            if (null === o) throw Error("Cannot set a null [[Prototype]]");
            if ("object" != typeof o) throw TypeError("Argument must be an object");
            return F.prototype = o, new F();
        };
    }(), !function(n, e) {
        "use strict";
        function t(n) {
            for (var e = {}, t = 0; t < n.length; ++t) e[n[t]] = !0;
            return e;
        }
        function r(n, e) {
            return Array.prototype.slice.call(n, e || 0);
        }
        function i(n) {
            return n.split("");
        }
        function o(n, e) {
            for (var t = e.length; --t >= 0; ) if (e[t] == n) return !0;
            return !1;
        }
        function a(n, e) {
            for (var t = 0, r = e.length; r > t; ++t) if (n(e[t])) return e[t];
        }
        function u(n, e) {
            if (0 >= e) return "";
            if (1 == e) return n;
            var t = u(n, e >> 1);
            return t += t, 1 & e && (t += n), t;
        }
        function s(n, e) {
            Error.call(this, n), this.msg = n, this.defs = e;
        }
        function c(n, e, t) {
            n === !0 && (n = {});
            var r = n || {};
            if (t) for (var i in r) r.hasOwnProperty(i) && !e.hasOwnProperty(i) && s.croak("`" + i + "` is not a supported option", e);
            for (var i in e) e.hasOwnProperty(i) && (r[i] = n && n.hasOwnProperty(i) ? n[i] : e[i]);
            return r;
        }
        function f(n, e) {
            for (var t in e) e.hasOwnProperty(t) && (n[t] = e[t]);
            return n;
        }
        function l() {}
        function p(n, e) {
            n.indexOf(e) < 0 && n.push(e);
        }
        function d(n, e) {
            return n.replace(/\{(.+?)\}/g, function(n, t) {
                return e[t];
            });
        }
        function h(n, e) {
            for (var t = n.length; --t >= 0; ) n[t] === e && n.splice(t, 1);
        }
        function _(n, e) {
            function t(n, t) {
                for (var r = [], i = 0, o = 0, a = 0; i < n.length && o < t.length; ) r[a++] = e(n[i], t[o]) <= 0 ? n[i++] : t[o++];
                return i < n.length && r.push.apply(r, n.slice(i)), o < t.length && r.push.apply(r, t.slice(o)), 
                r;
            }
            function r(n) {
                if (n.length <= 1) return n;
                var e = Math.floor(n.length / 2), i = n.slice(0, e), o = n.slice(e);
                return i = r(i), o = r(o), t(i, o);
            }
            return n.length < 2 ? n.slice() : r(n);
        }
        function v(n, e) {
            return n.filter(function(n) {
                return e.indexOf(n) < 0;
            });
        }
        function m(n, e) {
            return n.filter(function(n) {
                return e.indexOf(n) >= 0;
            });
        }
        function g(n) {
            function e(n) {
                if (1 == n.length) return t += "return str === " + JSON.stringify(n[0]) + ";";
                t += "switch(str){";
                for (var e = 0; e < n.length; ++e) t += "case " + JSON.stringify(n[e]) + ":";
                t += "return true}return false;";
            }
            n instanceof Array || (n = n.split(" "));
            var t = "", r = [];
            n: for (var i = 0; i < n.length; ++i) {
                for (var o = 0; o < r.length; ++o) if (r[o][0].length == n[i].length) {
                    r[o].push(n[i]);
                    continue n;
                }
                r.push([ n[i] ]);
            }
            if (r.length > 3) {
                r.sort(function(n, e) {
                    return e.length - n.length;
                }), t += "switch(str.length){";
                for (var i = 0; i < r.length; ++i) {
                    var a = r[i];
                    t += "case " + a[0].length + ":", e(a);
                }
                t += "}";
            } else e(n);
            return Function("str", t);
        }
        function b(n, e) {
            for (var t = n.length; --t >= 0; ) if (!e(n[t])) return !1;
            return !0;
        }
        function y() {
            this._values = {}, this._size = 0;
        }
        function A(n, e, t, r) {
            arguments.length < 4 && (r = L), e = e ? e.split(/\s+/) : [];
            var i = e;
            r && r.PROPS && (e = e.concat(r.PROPS));
            for (var o = "return function AST_" + n + "(props){ if (props) { ", a = e.length; --a >= 0; ) o += "this." + e[a] + " = props." + e[a] + ";";
            var u = r && new r();
            (u && u.initialize || t && t.initialize) && (o += "this.initialize();"), o += "}}";
            var s = Function(o)();
            if (u && (s.prototype = u, s.BASE = r), r && r.SUBCLASSES.push(s), s.prototype.CTOR = s, 
            s.PROPS = e || null, s.SELF_PROPS = i, s.SUBCLASSES = [], n && (s.prototype.TYPE = s.TYPE = n), 
            t) for (a in t) t.hasOwnProperty(a) && (/^\$/.test(a) ? s[a.substr(1)] = t[a] : s.prototype[a] = t[a]);
            return s.DEFMETHOD = function(n, e) {
                this.prototype[n] = e;
            }, s;
        }
        function w(n, e) {
            n.body instanceof W ? n.body._walk(e) : n.body.forEach(function(n) {
                n._walk(e);
            });
        }
        function E(n) {
            this.visit = n, this.stack = [];
        }
        function D(n) {
            return n >= 97 && 122 >= n || n >= 65 && 90 >= n || n >= 170 && Rt.letter.test(String.fromCharCode(n));
        }
        function F(n) {
            return n >= 48 && 57 >= n;
        }
        function C(n) {
            return F(n) || D(n);
        }
        function S(n) {
            return Rt.non_spacing_mark.test(n) || Rt.space_combining_mark.test(n);
        }
        function k(n) {
            return Rt.connector_punctuation.test(n);
        }
        function B(n) {
            return !Ft(n) && /^[a-z_$][a-z0-9_$]*$/i.test(n);
        }
        function x(n) {
            return 36 == n || 95 == n || D(n);
        }
        function T(n) {
            var e = n.charCodeAt(0);
            return x(e) || F(e) || 8204 == e || 8205 == e || S(n) || k(n);
        }
        function $(n) {
            return /^[a-z_$][a-z0-9_$]*$/i.test(n);
        }
        function O(n) {
            return kt.test(n) ? parseInt(n.substr(2), 16) : Bt.test(n) ? parseInt(n.substr(1), 8) : xt.test(n) ? parseFloat(n) : void 0;
        }
        function N(n, e, t, r) {
            this.message = n, this.line = e, this.col = t, this.pos = r, this.stack = Error().stack;
        }
        function M(n, e, t, r, i) {
            throw new N(n, t, r, i);
        }
        function R(n, e, t) {
            return n.type == e && (null == t || n.value == t);
        }
        function H(n, e, t) {
            function r() {
                return D.text.charAt(D.pos);
            }
            function i(n, e) {
                var t = D.text.charAt(D.pos++);
                if (n && !t) throw Ht;
                return "\n" == t ? (D.newline_before = D.newline_before || !e, ++D.line, D.col = 0) : ++D.col, 
                t;
            }
            function o(n) {
                for (;n-- > 0; ) i();
            }
            function a(n) {
                return D.text.substr(D.pos, n.length) == n;
            }
            function u(n, e) {
                var t = D.text.indexOf(n, D.pos);
                if (e && -1 == t) throw Ht;
                return t;
            }
            function s() {
                D.tokline = D.line, D.tokcol = D.col, D.tokpos = D.pos;
            }
            function c(n, t, r) {
                D.regex_allowed = "operator" == n && !Pt(t) || "keyword" == n && Ct(t) || "punc" == n && Ot(t), 
                S = "punc" == n && "." == t;
                var i = {
                    type: n,
                    value: t,
                    line: D.tokline,
                    col: D.tokcol,
                    pos: D.tokpos,
                    endpos: D.pos,
                    nlb: D.newline_before,
                    file: e
                };
                if (!r) {
                    i.comments_before = D.comments_before, D.comments_before = [];
                    for (var o = 0, a = i.comments_before.length; a > o; o++) i.nlb = i.nlb || i.comments_before[o].nlb;
                }
                return D.newline_before = !1, new V(i);
            }
            function f() {
                for (;$t(r()); ) i();
            }
            function l(n) {
                for (var e, t = "", o = 0; (e = r()) && n(e, o++); ) t += i();
                return t;
            }
            function p(n) {
                M(n, e, D.tokline, D.tokcol, D.tokpos);
            }
            function d(n) {
                var e = !1, t = !1, r = !1, i = "." == n, o = l(function(o, a) {
                    var u = o.charCodeAt(0);
                    switch (u) {
                      case 120:
                      case 88:
                        return r ? !1 : r = !0;

                      case 101:
                      case 69:
                        return r ? !0 : e ? !1 : e = t = !0;

                      case 45:
                        return t || 0 == a && !n;

                      case 43:
                        return t;

                      case t = !1, 46:
                        return i || r || e ? !1 : i = !0;
                    }
                    return C(u);
                });
                n && (o = n + o);
                var a = O(o);
                return isNaN(a) ? void p("Invalid syntax: " + o) : c("num", a);
            }
            function h(n) {
                var e = i(!0, n);
                switch (e.charCodeAt(0)) {
                  case 110:
                    return "\n";

                  case 114:
                    return "\r";

                  case 116:
                    return "	";

                  case 98:
                    return "\b";

                  case 118:
                    return "";

                  case 102:
                    return "\f";

                  case 48:
                    return "\x00";

                  case 120:
                    return String.fromCharCode(_(2));

                  case 117:
                    return String.fromCharCode(_(4));

                  case 10:
                    return "";

                  default:
                    return e;
                }
            }
            function _(n) {
                for (var e = 0; n > 0; --n) {
                    var t = parseInt(i(!0), 16);
                    isNaN(t) && p("Invalid hex-character pattern in string"), e = e << 4 | t;
                }
                return e;
            }
            function v(n) {
                var e, t = D.regex_allowed, r = u("\n");
                return -1 == r ? (e = D.text.substr(D.pos), D.pos = D.text.length) : (e = D.text.substring(D.pos, r), 
                D.pos = r), D.comments_before.push(c(n, e, !0)), D.regex_allowed = t, E();
            }
            function m() {
                for (var n, e, t = !1, o = "", a = !1; null != (n = r()); ) if (t) "u" != n && p("Expecting UnicodeEscapeSequence -- uXXXX"), 
                n = h(), T(n) || p("Unicode char: " + n.charCodeAt(0) + " is not valid in identifier"), 
                o += n, t = !1; else if ("\\" == n) a = t = !0, i(); else {
                    if (!T(n)) break;
                    o += i();
                }
                return Et(o) && a && (e = o.charCodeAt(0).toString(16).toUpperCase(), o = "\\u" + "0000".substr(e.length) + e + o.slice(1)), 
                o;
            }
            function g(n) {
                function e(n) {
                    if (!r()) return n;
                    var t = n + r();
                    return Tt(t) ? (i(), e(t)) : n;
                }
                return c("operator", e(n || i()));
            }
            function b() {
                switch (i(), r()) {
                  case "/":
                    return i(), v("comment1");

                  case "*":
                    return i(), B();
                }
                return D.regex_allowed ? $("") : g("/");
            }
            function y() {
                return i(), F(r().charCodeAt(0)) ? d(".") : c("punc", ".");
            }
            function A() {
                var n = m();
                return S ? c("name", n) : Dt(n) ? c("atom", n) : Et(n) ? Tt(n) ? c("operator", n) : c("keyword", n) : c("name", n);
            }
            function w(n, e) {
                return function(t) {
                    try {
                        return e(t);
                    } catch (r) {
                        if (r !== Ht) throw r;
                        p(n);
                    }
                };
            }
            function E(n) {
                if (null != n) return $(n);
                if (f(), s(), t) {
                    if (a("<!--")) return o(4), v("comment3");
                    if (a("-->") && D.newline_before) return o(3), v("comment4");
                }
                var e = r();
                if (!e) return c("eof");
                var u = e.charCodeAt(0);
                switch (u) {
                  case 34:
                  case 39:
                    return k();

                  case 46:
                    return y();

                  case 47:
                    return b();
                }
                return F(u) ? d() : Nt(e) ? c("punc", i()) : St(e) ? g() : 92 == u || x(u) ? A() : void p("Unexpected character '" + e + "'");
            }
            var D = {
                text: n.replace(/\r\n?|[\n\u2028\u2029]/g, "\n").replace(/\uFEFF/g, ""),
                filename: e,
                pos: 0,
                tokpos: 0,
                line: 1,
                tokline: 0,
                col: 0,
                tokcol: 0,
                newline_before: !1,
                regex_allowed: !1,
                comments_before: []
            }, S = !1, k = w("Unterminated string constant", function() {
                for (var n = i(), e = ""; ;) {
                    var t = i(!0);
                    if ("\\" == t) {
                        var r = 0, o = null;
                        t = l(function(n) {
                            if (n >= "0" && "7" >= n) {
                                if (!o) return o = n, ++r;
                                if ("3" >= o && 2 >= r) return ++r;
                                if (o >= "4" && 1 >= r) return ++r;
                            }
                            return !1;
                        }), t = r > 0 ? String.fromCharCode(parseInt(t, 8)) : h(!0);
                    } else if (t == n) break;
                    e += t;
                }
                return c("string", e);
            }), B = w("Unterminated multiline comment", function() {
                var n = D.regex_allowed, e = u("*/", !0), t = D.text.substring(D.pos, e), r = t.split("\n"), i = r.length;
                D.pos = e + 2, D.line += i - 1, i > 1 ? D.col = r[i - 1].length : D.col += r[i - 1].length, 
                D.col += 2;
                var o = D.newline_before = D.newline_before || t.indexOf("\n") >= 0;
                return D.comments_before.push(c("comment2", t, !0)), D.regex_allowed = n, D.newline_before = o, 
                E();
            }), $ = w("Unterminated regular expression", function(n) {
                for (var e, t = !1, r = !1; e = i(!0); ) if (t) n += "\\" + e, t = !1; else if ("[" == e) r = !0, 
                n += e; else if ("]" == e && r) r = !1, n += e; else {
                    if ("/" == e && !r) break;
                    "\\" == e ? t = !0 : n += e;
                }
                var o = m();
                return c("regexp", RegExp(n, o));
            });
            return E.context = function(n) {
                return n && (D = n), D;
            }, E;
        }
        function q(n, e) {
            function t(n, e) {
                return R(I.token, n, e);
            }
            function r() {
                return I.peeked || (I.peeked = I.input());
            }
            function i() {
                return I.prev = I.token, I.peeked ? (I.token = I.peeked, I.peeked = null) : I.token = I.input(), 
                I.in_directives = I.in_directives && ("string" == I.token.type || t("punc", ";")), 
                I.token;
            }
            function o() {
                return I.prev;
            }
            function u(n, e, t, r) {
                var i = I.input.context();
                M(n, i.filename, null != e ? e : i.tokline, null != t ? t : i.tokcol, null != r ? r : i.tokpos);
            }
            function s(n, e) {
                u(e, n.line, n.col);
            }
            function f(n) {
                null == n && (n = I.token), s(n, "Unexpected token: " + n.type + " (" + n.value + ")");
            }
            function l(n, e) {
                return t(n, e) ? i() : void s(I.token, "Unexpected token " + I.token.type + " «" + I.token.value + "», expected " + n + " «" + e + "»");
            }
            function p(n) {
                return l("punc", n);
            }
            function d() {
                return !e.strict && (I.token.nlb || t("eof") || t("punc", "}"));
            }
            function h() {
                t("punc", ";") ? i() : d() || f();
            }
            function _() {
                p("(");
                var n = Be(!0);
                return p(")"), n;
            }
            function v(n) {
                return function() {
                    var e = I.token, t = n(), r = o();
                    return t.start = e, t.end = r, t;
                };
            }
            function m() {
                (t("operator", "/") || t("operator", "/=")) && (I.peeked = null, I.token = I.input(I.token.value.substr(1)));
            }
            function g() {
                var n = N(at);
                a(function(e) {
                    return e.name == n.name;
                }, I.labels) && u("Label " + n.name + " defined twice"), p(":"), I.labels.push(n);
                var e = U();
                return I.labels.pop(), e instanceof ee || n.references.forEach(function(e) {
                    e instanceof ye && (e = e.label.start, u("Continue label `" + n.name + "` refers to non-IterationStatement.", e.line, e.col, e.pos));
                }), new ne({
                    body: e,
                    label: n
                });
            }
            function b(n) {
                return new G({
                    body: (n = Be(!0), h(), n)
                });
            }
            function y(n) {
                var e, t = null;
                d() || (t = N(st, !0)), null != t ? (e = a(function(n) {
                    return n.name == t.name;
                }, I.labels), e || u("Undefined label " + t.name), t.thedef = e) : 0 == I.in_loop && u(n.TYPE + " not inside a loop or switch"), 
                h();
                var r = new n({
                    label: t
                });
                return e && e.references.push(r), r;
            }
            function A() {
                p("(");
                var n = null;
                return !t("punc", ";") && (n = t("keyword", "var") ? (i(), L(!0)) : Be(!0, !0), 
                t("operator", "in")) ? (n instanceof xe && n.definitions.length > 1 && u("Only one variable declaration allowed in for..in loop"), 
                i(), E(n)) : w(n);
            }
            function w(n) {
                p(";");
                var e = t("punc", ";") ? null : Be(!0);
                p(";");
                var r = t("punc", ")") ? null : Be(!0);
                return p(")"), new oe({
                    init: n,
                    condition: e,
                    step: r,
                    body: z(U)
                });
            }
            function E(n) {
                var e = n instanceof xe ? n.definitions[0].name : null, t = Be(!0);
                return p(")"), new ae({
                    init: n,
                    name: e,
                    object: t,
                    body: z(U)
                });
            }
            function D() {
                var n = _(), e = U(), r = null;
                return t("keyword", "else") && (i(), r = U()), new Ae({
                    condition: n,
                    body: e,
                    alternative: r
                });
            }
            function F() {
                p("{");
                for (var n = []; !t("punc", "}"); ) t("eof") && f(), n.push(U());
                return i(), n;
            }
            function C() {
                p("{");
                for (var n, e = [], r = null, a = null; !t("punc", "}"); ) t("eof") && f(), t("keyword", "case") ? (a && (a.end = o()), 
                r = [], a = new Fe({
                    start: (n = I.token, i(), n),
                    expression: Be(!0),
                    body: r
                }), e.push(a), p(":")) : t("keyword", "default") ? (a && (a.end = o()), r = [], 
                a = new De({
                    start: (n = I.token, i(), p(":"), n),
                    body: r
                }), e.push(a)) : (r || f(), r.push(U()));
                return a && (a.end = o()), i(), e;
            }
            function S() {
                var n = F(), e = null, r = null;
                if (t("keyword", "catch")) {
                    var a = I.token;
                    i(), p("(");
                    var s = N(ot);
                    p(")"), e = new Se({
                        start: a,
                        argname: s,
                        body: F(),
                        end: o()
                    });
                }
                if (t("keyword", "finally")) {
                    var a = I.token;
                    i(), r = new ke({
                        start: a,
                        body: F(),
                        end: o()
                    });
                }
                return e || r || u("Missing catch/finally blocks"), new Ce({
                    body: n,
                    bcatch: e,
                    bfinally: r
                });
            }
            function k(n, e) {
                for (var r = []; r.push(new $e({
                    start: I.token,
                    name: N(e ? et : nt),
                    value: t("operator", "=") ? (i(), Be(!1, n)) : null,
                    end: o()
                })), t("punc", ","); ) i();
                return r;
            }
            function B() {
                var n, e = I.token;
                switch (e.type) {
                  case "name":
                  case "keyword":
                    n = O(ut);
                    break;

                  case "num":
                    n = new pt({
                        start: e,
                        end: e,
                        value: e.value
                    });
                    break;

                  case "string":
                    n = new lt({
                        start: e,
                        end: e,
                        value: e.value
                    });
                    break;

                  case "regexp":
                    n = new dt({
                        start: e,
                        end: e,
                        value: e.value
                    });
                    break;

                  case "atom":
                    switch (e.value) {
                      case "false":
                        n = new At({
                            start: e,
                            end: e
                        });
                        break;

                      case "true":
                        n = new wt({
                            start: e,
                            end: e
                        });
                        break;

                      case "null":
                        n = new _t({
                            start: e,
                            end: e
                        });
                    }
                }
                return i(), n;
            }
            function x(n, e, r) {
                for (var o = !0, a = []; !t("punc", n) && (o ? o = !1 : p(","), !e || !t("punc", n)); ) a.push(t("punc", ",") && r ? new gt({
                    start: I.token,
                    end: I.token
                }) : Be(!1));
                return i(), a;
            }
            function T() {
                var n = I.token;
                switch (i(), n.type) {
                  case "num":
                  case "string":
                  case "name":
                  case "operator":
                  case "keyword":
                  case "atom":
                    return n.value;

                  default:
                    f();
                }
            }
            function $() {
                var n = I.token;
                switch (i(), n.type) {
                  case "name":
                  case "operator":
                  case "keyword":
                  case "atom":
                    return n.value;

                  default:
                    f();
                }
            }
            function O(n) {
                var e = I.token.value;
                return new ("this" == e ? ct : n)({
                    name: e + "",
                    start: I.token,
                    end: I.token
                });
            }
            function N(n, e) {
                if (!t("name")) return e || u("Name expected"), null;
                var r = O(n);
                return i(), r;
            }
            function q(n, e, t) {
                return "++" != e && "--" != e || j(t) || u("Invalid use of " + e + " operator"), 
                new n({
                    operator: e,
                    expression: t
                });
            }
            function P(n) {
                return _e(he(!0), 0, n);
            }
            function j(n) {
                return e.strict ? n instanceof ct ? !1 : n instanceof Re || n instanceof Je : !0;
            }
            function z(n) {
                ++I.in_loop;
                var e = n();
                return --I.in_loop, e;
            }
            e = c(e, {
                strict: !1,
                filename: null,
                toplevel: null,
                expression: !1,
                html5_comments: !0
            });
            var I = {
                input: "string" == typeof n ? H(n, e.filename, e.html5_comments) : n,
                token: null,
                prev: null,
                peeked: null,
                in_function: 0,
                in_directives: !0,
                in_loop: 0,
                labels: []
            };
            I.token = i();
            var U = v(function() {
                var n;
                switch (m(), I.token.type) {
                  case "string":
                    var e = I.in_directives, a = b();
                    return e && a.body instanceof lt && !t("punc", ",") ? new X({
                        value: a.body.value
                    }) : a;

                  case "num":
                  case "regexp":
                  case "operator":
                  case "atom":
                    return b();

                  case "name":
                    return R(r(), "punc", ":") ? g() : b();

                  case "punc":
                    switch (I.token.value) {
                      case "{":
                        return new J({
                            start: I.token,
                            body: F(),
                            end: o()
                        });

                      case "[":
                      case "(":
                        return b();

                      case ";":
                        return i(), new Q();

                      default:
                        f();
                    }

                  case "keyword":
                    switch (n = I.token.value, i(), n) {
                      case "break":
                        return y(be);

                      case "continue":
                        return y(ye);

                      case "debugger":
                        return h(), new Y();

                      case "do":
                        return new re({
                            body: z(U),
                            condition: (l("keyword", "while"), n = _(), h(), n)
                        });

                      case "while":
                        return new ie({
                            condition: _(),
                            body: z(U)
                        });

                      case "for":
                        return A();

                      case "function":
                        return V(de);

                      case "if":
                        return D();

                      case "return":
                        return 0 == I.in_function && u("'return' outside of function"), new ve({
                            value: t("punc", ";") ? (i(), null) : d() ? null : (n = Be(!0), h(), n)
                        });

                      case "switch":
                        return new we({
                            expression: _(),
                            body: z(C)
                        });

                      case "throw":
                        return I.token.nlb && u("Illegal newline after 'throw'"), new me({
                            value: (n = Be(!0), h(), n)
                        });

                      case "try":
                        return S();

                      case "var":
                        return n = L(), h(), n;

                      case "const":
                        return n = W(), h(), n;

                      case "with":
                        return new ue({
                            expression: _(),
                            body: U()
                        });

                      default:
                        f();
                    }
                }
            }), V = function(n) {
                var e = n === de, r = t("name") ? N(e ? rt : it) : null;
                return e && !r && f(), p("("), new n({
                    name: r,
                    argnames: function(n, e) {
                        for (;!t("punc", ")"); ) n ? n = !1 : p(","), e.push(N(tt));
                        return i(), e;
                    }(!0, []),
                    body: function(n, e) {
                        ++I.in_function, I.in_directives = !0, I.in_loop = 0, I.labels = [];
                        var t = F();
                        return --I.in_function, I.in_loop = n, I.labels = e, t;
                    }(I.in_loop, I.labels)
                });
            }, L = function(n) {
                return new xe({
                    start: o(),
                    definitions: k(n, !1),
                    end: o()
                });
            }, W = function() {
                return new Te({
                    start: o(),
                    definitions: k(!1, !0),
                    end: o()
                });
            }, K = function() {
                var n = I.token;
                l("operator", "new");
                var e, r = Z(!1);
                return t("punc", "(") ? (i(), e = x(")")) : e = [], fe(new Ne({
                    start: n,
                    expression: r,
                    args: e,
                    end: o()
                }), !0);
            }, Z = function(n) {
                if (t("operator", "new")) return K();
                var e = I.token;
                if (t("punc")) {
                    switch (e.value) {
                      case "(":
                        i();
                        var r = Be(!0);
                        return r.start = e, r.end = I.token, p(")"), fe(r, n);

                      case "[":
                        return fe(te(), n);

                      case "{":
                        return fe(se(), n);
                    }
                    f();
                }
                if (t("keyword", "function")) {
                    i();
                    var a = V(pe);
                    return a.start = e, a.end = o(), fe(a, n);
                }
                return Ut[I.token.type] ? fe(B(), n) : void f();
            }, te = v(function() {
                return p("["), new Le({
                    elements: x("]", !e.strict, !0)
                });
            }), se = v(function() {
                p("{");
                for (var n = !0, r = []; !t("punc", "}") && (n ? n = !1 : p(","), e.strict || !t("punc", "}")); ) {
                    var a = I.token, u = a.type, s = T();
                    if ("name" == u && !t("punc", ":")) {
                        if ("get" == s) {
                            r.push(new Ke({
                                start: a,
                                key: B(),
                                value: V(le),
                                end: o()
                            }));
                            continue;
                        }
                        if ("set" == s) {
                            r.push(new Ge({
                                start: a,
                                key: B(),
                                value: V(le),
                                end: o()
                            }));
                            continue;
                        }
                    }
                    p(":"), r.push(new Xe({
                        start: a,
                        key: s,
                        value: Be(!1),
                        end: o()
                    }));
                }
                return i(), new We({
                    properties: r
                });
            }), fe = function(n, e) {
                var r = n.start;
                if (t("punc", ".")) return i(), fe(new He({
                    start: r,
                    expression: n,
                    property: $(),
                    end: o()
                }), e);
                if (t("punc", "[")) {
                    i();
                    var a = Be(!0);
                    return p("]"), fe(new qe({
                        start: r,
                        expression: n,
                        property: a,
                        end: o()
                    }), e);
                }
                return e && t("punc", "(") ? (i(), fe(new Oe({
                    start: r,
                    expression: n,
                    args: x(")"),
                    end: o()
                }), !0)) : n;
            }, he = function(n) {
                var e = I.token;
                if (t("operator") && qt(e.value)) {
                    i(), m();
                    var r = q(je, e.value, he(n));
                    return r.start = e, r.end = o(), r;
                }
                for (var a = Z(n); t("operator") && Pt(I.token.value) && !I.token.nlb; ) a = q(ze, I.token.value, a), 
                a.start = e, a.end = I.token, i();
                return a;
            }, _e = function(n, e, r) {
                var o = t("operator") ? I.token.value : null;
                "in" == o && r && (o = null);
                var a = null != o ? zt[o] : null;
                if (null != a && a > e) {
                    i();
                    var u = _e(he(!0), a, r);
                    return _e(new Ie({
                        start: n.start,
                        left: n,
                        operator: o,
                        right: u,
                        end: u.end
                    }), e, r);
                }
                return n;
            }, ge = function(n) {
                var e = I.token, r = P(n);
                if (t("operator", "?")) {
                    i();
                    var a = Be(!1);
                    return p(":"), new Ue({
                        start: e,
                        condition: r,
                        consequent: a,
                        alternative: Be(!1, n),
                        end: o()
                    });
                }
                return r;
            }, Ee = function(n) {
                var e = I.token, r = ge(n), a = I.token.value;
                if (t("operator") && jt(a)) {
                    if (j(r)) return i(), new Ve({
                        start: e,
                        left: r,
                        operator: a,
                        right: Ee(n),
                        end: o()
                    });
                    u("Invalid assignment");
                }
                return r;
            }, Be = function(n, e) {
                var o = I.token, a = Ee(e);
                return n && t("punc", ",") ? (i(), new Me({
                    start: o,
                    car: a,
                    cdr: Be(!0, e),
                    end: r()
                })) : a;
            };
            return e.expression ? Be(!0) : function() {
                for (var n = I.token, r = []; !t("eof"); ) r.push(U());
                var i = o(), a = e.toplevel;
                return a ? (a.body = a.body.concat(r), a.end = i) : a = new ce({
                    start: n,
                    body: r,
                    end: i
                }), a;
            }();
        }
        function P(n, e) {
            E.call(this), this.before = n, this.after = e;
        }
        function j(n, e, t) {
            this.name = t.name, this.orig = [ t ], this.scope = n, this.references = [], this.global = !1, 
            this.mangled_name = null, this.undeclared = !1, this.constant = !1, this.index = e;
        }
        function z(n) {
            function e(n, e) {
                return n.replace(/[\u0080-\uffff]/g, function(n) {
                    var t = n.charCodeAt(0).toString(16);
                    if (t.length <= 2 && !e) {
                        for (;t.length < 2; ) t = "0" + t;
                        return "\\x" + t;
                    }
                    for (;t.length < 4; ) t = "0" + t;
                    return "\\u" + t;
                });
            }
            function t(t) {
                var r = 0, i = 0;
                return t = t.replace(/[\\\b\f\n\r\t\x22\x27\u2028\u2029\0]/g, function(n) {
                    switch (n) {
                      case "\\":
                        return "\\\\";

                      case "\b":
                        return "\\b";

                      case "\f":
                        return "\\f";

                      case "\n":
                        return "\\n";

                      case "\r":
                        return "\\r";

                      case "\u2028":
                        return "\\u2028";

                      case "\u2029":
                        return "\\u2029";

                      case '"':
                        return ++r, '"';

                      case "'":
                        return ++i, "'";

                      case "\x00":
                        return "\\x00";
                    }
                    return n;
                }), n.ascii_only && (t = e(t)), r > i ? "'" + t.replace(/\x27/g, "\\'") + "'" : '"' + t.replace(/\x22/g, '\\"') + '"';
            }
            function r(e) {
                var r = t(e);
                return n.inline_script && (r = r.replace(/<\x2fscript([>\/\t\n\f\r ])/gi, "<\\/script$1")), 
                r;
            }
            function i(t) {
                return t = "" + t, n.ascii_only && (t = e(t, !0)), t;
            }
            function o(e) {
                return u(" ", n.indent_start + A - e * n.indent_level);
            }
            function a() {
                return k.charAt(k.length - 1);
            }
            function s() {
                n.max_line_len && w > n.max_line_len && f("\n");
            }
            function f(e) {
                e += "";
                var t = e.charAt(0);
                if (S && (t && !(";}".indexOf(t) < 0) || /[;]$/.test(k) || (n.semicolons || B(t) ? (F += ";", 
                w++, D++) : (F += "\n", D++, E++, w = 0), n.beautify || (C = !1)), S = !1, s()), 
                !n.beautify && n.preserve_line && H[H.length - 1]) for (var r = H[H.length - 1].start.line; r > E; ) F += "\n", 
                D++, E++, w = 0, C = !1;
                if (C) {
                    var i = a();
                    (T(i) && (T(t) || "\\" == t) || /^[\+\-\/]$/.test(t) && t == i) && (F += " ", w++, 
                    D++), C = !1;
                }
                var o = e.split(/\r?\n/), u = o.length - 1;
                E += u, 0 == u ? w += o[u].length : w = o[u].length, D += e.length, k = e, F += e;
            }
            function p() {
                S = !1, f(";");
            }
            function d() {
                return A + n.indent_level;
            }
            function h(n) {
                var e;
                return f("{"), N(), O(d(), function() {
                    e = n();
                }), $(), f("}"), e;
            }
            function _(n) {
                f("(");
                var e = n();
                return f(")"), e;
            }
            function v(n) {
                f("[");
                var e = n();
                return f("]"), e;
            }
            function m() {
                f(","), x();
            }
            function b() {
                f(":"), n.space_colon && x();
            }
            function y() {
                return F;
            }
            n = c(n, {
                indent_start: 0,
                indent_level: 4,
                quote_keys: !1,
                space_colon: !0,
                ascii_only: !1,
                unescape_regexps: !1,
                inline_script: !1,
                width: 80,
                max_line_len: 32e3,
                beautify: !1,
                source_map: null,
                bracketize: !1,
                semicolons: !0,
                comments: !1,
                preserve_line: !1,
                screw_ie8: !1,
                preamble: null
            }, !0);
            var A = 0, w = 0, E = 1, D = 0, F = "", C = !1, S = !1, k = null, B = g("( [ + * / - , ."), x = n.beautify ? function() {
                f(" ");
            } : function() {
                C = !0;
            }, $ = n.beautify ? function(e) {
                n.beautify && f(o(e ? .5 : 0));
            } : l, O = n.beautify ? function(n, e) {
                n === !0 && (n = d());
                var t = A;
                A = n;
                var r = e();
                return A = t, r;
            } : function(n, e) {
                return e();
            }, N = n.beautify ? function() {
                f("\n");
            } : l, M = n.beautify ? function() {
                f(";");
            } : function() {
                S = !0;
            }, R = n.source_map ? function(e, t) {
                try {
                    e && n.source_map.add(e.file || "?", E, w, e.line, e.col, t || "name" != e.type ? t : e.value);
                } catch (r) {
                    L.warn("Couldn't figure out mapping for {file}:{line},{col} → {cline},{ccol} [{name}]", {
                        file: e.file,
                        line: e.line,
                        col: e.col,
                        cline: E,
                        ccol: w,
                        name: t || ""
                    });
                }
            } : l;
            n.preamble && f(n.preamble.replace(/\r\n?|[\n\u2028\u2029]|\s*$/g, "\n"));
            var H = [];
            return {
                get: y,
                toString: y,
                indent: $,
                indentation: function() {
                    return A;
                },
                current_width: function() {
                    return w - A;
                },
                should_break: function() {
                    return n.width && this.current_width() >= n.width;
                },
                newline: N,
                print: f,
                space: x,
                comma: m,
                colon: b,
                last: function() {
                    return k;
                },
                semicolon: M,
                force_semicolon: p,
                to_ascii: e,
                print_name: function(n) {
                    f(i(n));
                },
                print_string: function(n) {
                    f(r(n));
                },
                next_indent: d,
                with_indent: O,
                with_block: h,
                with_parens: _,
                with_square: v,
                add_mapping: R,
                option: function(e) {
                    return n[e];
                },
                line: function() {
                    return E;
                },
                col: function() {
                    return w;
                },
                pos: function() {
                    return D;
                },
                push_node: function(n) {
                    H.push(n);
                },
                pop_node: function() {
                    return H.pop();
                },
                stack: function() {
                    return H;
                },
                parent: function(n) {
                    return H[H.length - 2 - (n || 0)];
                }
            };
        }
        function I(n, e) {
            return this instanceof I ? (P.call(this, this.before, this.after), void (this.options = c(n, {
                sequences: !e,
                properties: !e,
                dead_code: !e,
                drop_debugger: !e,
                unsafe: !1,
                unsafe_comps: !1,
                conditionals: !e,
                comparisons: !e,
                evaluate: !e,
                booleans: !e,
                loops: !e,
                unused: !e,
                hoist_funs: !e,
                keep_fargs: !1,
                hoist_vars: !1,
                if_return: !e,
                join_vars: !e,
                cascade: !e,
                side_effects: !e,
                pure_getters: !1,
                pure_funcs: null,
                negate_iife: !e,
                screw_ie8: !1,
                drop_console: !1,
                angular: !1,
                warnings: !0,
                global_defs: {}
            }, !0))) : new I(n, e);
        }
        e.UglifyJS = n, s.prototype = Object.create(Error.prototype), s.prototype.constructor = s, 
        s.croak = function(n, e) {
            throw new s(n, e);
        };
        var U = function() {
            function n(n, o, a) {
                function u() {
                    var u = o(n[s], s), l = u instanceof r;
                    return l && (u = u.v), u instanceof e ? (u = u.v, u instanceof t ? f.push.apply(f, a ? u.v.slice().reverse() : u.v) : f.push(u)) : u !== i && (u instanceof t ? c.push.apply(c, a ? u.v.slice().reverse() : u.v) : c.push(u)), 
                    l;
                }
                var s, c = [], f = [];
                if (n instanceof Array) if (a) {
                    for (s = n.length; --s >= 0 && !u(); ) ;
                    c.reverse(), f.reverse();
                } else for (s = 0; s < n.length && !u(); ++s) ; else for (s in n) if (n.hasOwnProperty(s) && u()) break;
                return f.concat(c);
            }
            function e(n) {
                this.v = n;
            }
            function t(n) {
                this.v = n;
            }
            function r(n) {
                this.v = n;
            }
            n.at_top = function(n) {
                return new e(n);
            }, n.splice = function(n) {
                return new t(n);
            }, n.last = function(n) {
                return new r(n);
            };
            var i = n.skip = {};
            return n;
        }();
        y.prototype = {
            set: function(n, e) {
                return this.has(n) || ++this._size, this._values["$" + n] = e, this;
            },
            add: function(n, e) {
                return this.has(n) ? this.get(n).push(e) : this.set(n, [ e ]), this;
            },
            get: function(n) {
                return this._values["$" + n];
            },
            del: function(n) {
                return this.has(n) && (--this._size, delete this._values["$" + n]), this;
            },
            has: function(n) {
                return "$" + n in this._values;
            },
            each: function(n) {
                for (var e in this._values) n(this._values[e], e.substr(1));
            },
            size: function() {
                return this._size;
            },
            map: function(n) {
                var e = [];
                for (var t in this._values) e.push(n(this._values[t], t.substr(1)));
                return e;
            }
        };
        var V = A("Token", "type value line col pos endpos nlb comments_before file", {}, null), L = A("Node", "start end", {
            clone: function() {
                return new this.CTOR(this);
            },
            $documentation: "Base class of all AST nodes",
            $propdoc: {
                start: "[AST_Token] The first token of this node",
                end: "[AST_Token] The last token of this node"
            },
            _walk: function(n) {
                return n._visit(this);
            },
            walk: function(n) {
                return this._walk(n);
            }
        }, null);
        L.warn_function = null, L.warn = function(n, e) {
            L.warn_function && L.warn_function(d(n, e));
        };
        var W = A("Statement", null, {
            $documentation: "Base class of all statements"
        }), Y = A("Debugger", null, {
            $documentation: "Represents a debugger statement"
        }, W), X = A("Directive", "value scope", {
            $documentation: 'Represents a directive, like "use strict";',
            $propdoc: {
                value: "[string] The value of this directive as a plain string (it's not an AST_String!)",
                scope: "[AST_Scope/S] The scope that this directive affects"
            }
        }, W), G = A("SimpleStatement", "body", {
            $documentation: "A statement consisting of an expression, i.e. a = 1 + 2",
            $propdoc: {
                body: "[AST_Node] an expression node (should not be instanceof AST_Statement)"
            },
            _walk: function(n) {
                return n._visit(this, function() {
                    this.body._walk(n);
                });
            }
        }, W), K = A("Block", "body", {
            $documentation: "A body of statements (usually bracketed)",
            $propdoc: {
                body: "[AST_Statement*] an array of statements"
            },
            _walk: function(n) {
                return n._visit(this, function() {
                    w(this, n);
                });
            }
        }, W), J = A("BlockStatement", null, {
            $documentation: "A block statement"
        }, K), Q = A("EmptyStatement", null, {
            $documentation: "The empty statement (empty block or simply a semicolon)",
            _walk: function(n) {
                return n._visit(this);
            }
        }, W), Z = A("StatementWithBody", "body", {
            $documentation: "Base class for all statements that contain one nested body: `For`, `ForIn`, `Do`, `While`, `With`",
            $propdoc: {
                body: "[AST_Statement] the body; this should always be present, even if it's an AST_EmptyStatement"
            },
            _walk: function(n) {
                return n._visit(this, function() {
                    this.body._walk(n);
                });
            }
        }, W), ne = A("LabeledStatement", "label", {
            $documentation: "Statement with a label",
            $propdoc: {
                label: "[AST_Label] a label definition"
            },
            _walk: function(n) {
                return n._visit(this, function() {
                    this.label._walk(n), this.body._walk(n);
                });
            }
        }, Z), ee = A("IterationStatement", null, {
            $documentation: "Internal class.  All loops inherit from it."
        }, Z), te = A("DWLoop", "condition", {
            $documentation: "Base class for do/while statements",
            $propdoc: {
                condition: "[AST_Node] the loop condition.  Should not be instanceof AST_Statement"
            },
            _walk: function(n) {
                return n._visit(this, function() {
                    this.condition._walk(n), this.body._walk(n);
                });
            }
        }, ee), re = A("Do", null, {
            $documentation: "A `do` statement"
        }, te), ie = A("While", null, {
            $documentation: "A `while` statement"
        }, te), oe = A("For", "init condition step", {
            $documentation: "A `for` statement",
            $propdoc: {
                init: "[AST_Node?] the `for` initialization code, or null if empty",
                condition: "[AST_Node?] the `for` termination clause, or null if empty",
                step: "[AST_Node?] the `for` update clause, or null if empty"
            },
            _walk: function(n) {
                return n._visit(this, function() {
                    this.init && this.init._walk(n), this.condition && this.condition._walk(n), this.step && this.step._walk(n), 
                    this.body._walk(n);
                });
            }
        }, ee), ae = A("ForIn", "init name object", {
            $documentation: "A `for ... in` statement",
            $propdoc: {
                init: "[AST_Node] the `for/in` initialization code",
                name: "[AST_SymbolRef?] the loop variable, only if `init` is AST_Var",
                object: "[AST_Node] the object that we're looping through"
            },
            _walk: function(n) {
                return n._visit(this, function() {
                    this.init._walk(n), this.object._walk(n), this.body._walk(n);
                });
            }
        }, ee), ue = A("With", "expression", {
            $documentation: "A `with` statement",
            $propdoc: {
                expression: "[AST_Node] the `with` expression"
            },
            _walk: function(n) {
                return n._visit(this, function() {
                    this.expression._walk(n), this.body._walk(n);
                });
            }
        }, Z), se = A("Scope", "directives variables functions uses_with uses_eval parent_scope enclosed cname", {
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
        }, K), ce = A("Toplevel", "globals", {
            $documentation: "The toplevel scope",
            $propdoc: {
                globals: "[Object/S] a map of name -> SymbolDef for all undeclared names"
            },
            wrap_enclose: function(n) {
                var e = this, t = [], r = [];
                n.forEach(function(n) {
                    var e = n.lastIndexOf(":");
                    t.push(n.substr(0, e)), r.push(n.substr(e + 1));
                });
                var i = "(function(" + r.join(",") + "){ '$ORIG'; })(" + t.join(",") + ")";
                return i = q(i), i = i.transform(new P(function(n) {
                    return n instanceof X && "$ORIG" == n.value ? U.splice(e.body) : void 0;
                }));
            },
            wrap_commonjs: function(n, e) {
                var t = this, r = [];
                e && (t.figure_out_scope(), t.walk(new E(function(n) {
                    n instanceof Ze && n.definition().global && (a(function(e) {
                        return e.name == n.name;
                    }, r) || r.push(n));
                })));
                var i = "(function(exports, global){ global['" + n + "'] = exports; '$ORIG'; '$EXPORTS'; }({}, (function(){return this}())))";
                return i = q(i), i = i.transform(new P(function(n) {
                    if (n instanceof G && (n = n.body, n instanceof lt)) switch (n.getValue()) {
                      case "$ORIG":
                        return U.splice(t.body);

                      case "$EXPORTS":
                        var e = [];
                        return r.forEach(function(n) {
                            e.push(new G({
                                body: new Ve({
                                    left: new qe({
                                        expression: new ut({
                                            name: "exports"
                                        }),
                                        property: new lt({
                                            value: n.name
                                        })
                                    }),
                                    operator: "=",
                                    right: new ut(n)
                                })
                            }));
                        }), U.splice(e);
                    }
                }));
            }
        }, se), fe = A("Lambda", "name argnames uses_arguments", {
            $documentation: "Base class for functions",
            $propdoc: {
                name: "[AST_SymbolDeclaration?] the name of this function",
                argnames: "[AST_SymbolFunarg*] array of function arguments",
                uses_arguments: "[boolean/S] tells whether this function accesses the arguments array"
            },
            _walk: function(n) {
                return n._visit(this, function() {
                    this.name && this.name._walk(n), this.argnames.forEach(function(e) {
                        e._walk(n);
                    }), w(this, n);
                });
            }
        }, se), le = A("Accessor", null, {
            $documentation: "A setter/getter function.  The `name` property is always null."
        }, fe), pe = A("Function", null, {
            $documentation: "A function expression"
        }, fe), de = A("Defun", null, {
            $documentation: "A function definition"
        }, fe), he = A("Jump", null, {
            $documentation: "Base class for “jumps” (for now that's `return`, `throw`, `break` and `continue`)"
        }, W), _e = A("Exit", "value", {
            $documentation: "Base class for “exits” (`return` and `throw`)",
            $propdoc: {
                value: "[AST_Node?] the value returned or thrown by this statement; could be null for AST_Return"
            },
            _walk: function(n) {
                return n._visit(this, this.value && function() {
                    this.value._walk(n);
                });
            }
        }, he), ve = A("Return", null, {
            $documentation: "A `return` statement"
        }, _e), me = A("Throw", null, {
            $documentation: "A `throw` statement"
        }, _e), ge = A("LoopControl", "label", {
            $documentation: "Base class for loop control statements (`break` and `continue`)",
            $propdoc: {
                label: "[AST_LabelRef?] the label, or null if none"
            },
            _walk: function(n) {
                return n._visit(this, this.label && function() {
                    this.label._walk(n);
                });
            }
        }, he), be = A("Break", null, {
            $documentation: "A `break` statement"
        }, ge), ye = A("Continue", null, {
            $documentation: "A `continue` statement"
        }, ge), Ae = A("If", "condition alternative", {
            $documentation: "A `if` statement",
            $propdoc: {
                condition: "[AST_Node] the `if` condition",
                alternative: "[AST_Statement?] the `else` part, or null if not present"
            },
            _walk: function(n) {
                return n._visit(this, function() {
                    this.condition._walk(n), this.body._walk(n), this.alternative && this.alternative._walk(n);
                });
            }
        }, Z), we = A("Switch", "expression", {
            $documentation: "A `switch` statement",
            $propdoc: {
                expression: "[AST_Node] the `switch` “discriminant”"
            },
            _walk: function(n) {
                return n._visit(this, function() {
                    this.expression._walk(n), w(this, n);
                });
            }
        }, K), Ee = A("SwitchBranch", null, {
            $documentation: "Base class for `switch` branches"
        }, K), De = A("Default", null, {
            $documentation: "A `default` switch branch"
        }, Ee), Fe = A("Case", "expression", {
            $documentation: "A `case` switch branch",
            $propdoc: {
                expression: "[AST_Node] the `case` expression"
            },
            _walk: function(n) {
                return n._visit(this, function() {
                    this.expression._walk(n), w(this, n);
                });
            }
        }, Ee), Ce = A("Try", "bcatch bfinally", {
            $documentation: "A `try` statement",
            $propdoc: {
                bcatch: "[AST_Catch?] the catch block, or null if not present",
                bfinally: "[AST_Finally?] the finally block, or null if not present"
            },
            _walk: function(n) {
                return n._visit(this, function() {
                    w(this, n), this.bcatch && this.bcatch._walk(n), this.bfinally && this.bfinally._walk(n);
                });
            }
        }, K), Se = A("Catch", "argname", {
            $documentation: "A `catch` node; only makes sense as part of a `try` statement",
            $propdoc: {
                argname: "[AST_SymbolCatch] symbol for the exception"
            },
            _walk: function(n) {
                return n._visit(this, function() {
                    this.argname._walk(n), w(this, n);
                });
            }
        }, K), ke = A("Finally", null, {
            $documentation: "A `finally` node; only makes sense as part of a `try` statement"
        }, K), Be = A("Definitions", "definitions", {
            $documentation: "Base class for `var` or `const` nodes (variable declarations/initializations)",
            $propdoc: {
                definitions: "[AST_VarDef*] array of variable definitions"
            },
            _walk: function(n) {
                return n._visit(this, function() {
                    this.definitions.forEach(function(e) {
                        e._walk(n);
                    });
                });
            }
        }, W), xe = A("Var", null, {
            $documentation: "A `var` statement"
        }, Be), Te = A("Const", null, {
            $documentation: "A `const` statement"
        }, Be), $e = A("VarDef", "name value", {
            $documentation: "A variable declaration; only appears in a AST_Definitions node",
            $propdoc: {
                name: "[AST_SymbolVar|AST_SymbolConst] name of the variable",
                value: "[AST_Node?] initializer, or null of there's no initializer"
            },
            _walk: function(n) {
                return n._visit(this, function() {
                    this.name._walk(n), this.value && this.value._walk(n);
                });
            }
        }), Oe = A("Call", "expression args", {
            $documentation: "A function call expression",
            $propdoc: {
                expression: "[AST_Node] expression to invoke as function",
                args: "[AST_Node*] array of arguments"
            },
            _walk: function(n) {
                return n._visit(this, function() {
                    this.expression._walk(n), this.args.forEach(function(e) {
                        e._walk(n);
                    });
                });
            }
        }), Ne = A("New", null, {
            $documentation: "An object instantiation.  Derives from a function call since it has exactly the same properties"
        }, Oe), Me = A("Seq", "car cdr", {
            $documentation: "A sequence expression (two comma-separated expressions)",
            $propdoc: {
                car: "[AST_Node] first element in sequence",
                cdr: "[AST_Node] second element in sequence"
            },
            $cons: function(n, e) {
                var t = new Me(n);
                return t.car = n, t.cdr = e, t;
            },
            $from_array: function(n) {
                if (0 == n.length) return null;
                if (1 == n.length) return n[0].clone();
                for (var e = null, t = n.length; --t >= 0; ) e = Me.cons(n[t], e);
                for (var r = e; r; ) {
                    if (r.cdr && !r.cdr.cdr) {
                        r.cdr = r.cdr.car;
                        break;
                    }
                    r = r.cdr;
                }
                return e;
            },
            to_array: function() {
                for (var n = this, e = []; n; ) {
                    if (e.push(n.car), n.cdr && !(n.cdr instanceof Me)) {
                        e.push(n.cdr);
                        break;
                    }
                    n = n.cdr;
                }
                return e;
            },
            add: function(n) {
                for (var e = this; e; ) {
                    if (!(e.cdr instanceof Me)) {
                        var t = Me.cons(e.cdr, n);
                        return e.cdr = t;
                    }
                    e = e.cdr;
                }
            },
            _walk: function(n) {
                return n._visit(this, function() {
                    this.car._walk(n), this.cdr && this.cdr._walk(n);
                });
            }
        }), Re = A("PropAccess", "expression property", {
            $documentation: 'Base class for property access expressions, i.e. `a.foo` or `a["foo"]`',
            $propdoc: {
                expression: "[AST_Node] the “container” expression",
                property: "[AST_Node|string] the property to access.  For AST_Dot this is always a plain string, while for AST_Sub it's an arbitrary AST_Node"
            }
        }), He = A("Dot", null, {
            $documentation: "A dotted property access expression",
            _walk: function(n) {
                return n._visit(this, function() {
                    this.expression._walk(n);
                });
            }
        }, Re), qe = A("Sub", null, {
            $documentation: 'Index-style property access, i.e. `a["foo"]`',
            _walk: function(n) {
                return n._visit(this, function() {
                    this.expression._walk(n), this.property._walk(n);
                });
            }
        }, Re), Pe = A("Unary", "operator expression", {
            $documentation: "Base class for unary expressions",
            $propdoc: {
                operator: "[string] the operator",
                expression: "[AST_Node] expression that this unary operator applies to"
            },
            _walk: function(n) {
                return n._visit(this, function() {
                    this.expression._walk(n);
                });
            }
        }), je = A("UnaryPrefix", null, {
            $documentation: "Unary prefix expression, i.e. `typeof i` or `++i`"
        }, Pe), ze = A("UnaryPostfix", null, {
            $documentation: "Unary postfix expression, i.e. `i++`"
        }, Pe), Ie = A("Binary", "left operator right", {
            $documentation: "Binary expression, i.e. `a + b`",
            $propdoc: {
                left: "[AST_Node] left-hand side expression",
                operator: "[string] the operator",
                right: "[AST_Node] right-hand side expression"
            },
            _walk: function(n) {
                return n._visit(this, function() {
                    this.left._walk(n), this.right._walk(n);
                });
            }
        }), Ue = A("Conditional", "condition consequent alternative", {
            $documentation: "Conditional expression using the ternary operator, i.e. `a ? b : c`",
            $propdoc: {
                condition: "[AST_Node]",
                consequent: "[AST_Node]",
                alternative: "[AST_Node]"
            },
            _walk: function(n) {
                return n._visit(this, function() {
                    this.condition._walk(n), this.consequent._walk(n), this.alternative._walk(n);
                });
            }
        }), Ve = A("Assign", null, {
            $documentation: "An assignment expression — `a = b + 5`"
        }, Ie), Le = A("Array", "elements", {
            $documentation: "An array literal",
            $propdoc: {
                elements: "[AST_Node*] array of elements"
            },
            _walk: function(n) {
                return n._visit(this, function() {
                    this.elements.forEach(function(e) {
                        e._walk(n);
                    });
                });
            }
        }), We = A("Object", "properties", {
            $documentation: "An object literal",
            $propdoc: {
                properties: "[AST_ObjectProperty*] array of properties"
            },
            _walk: function(n) {
                return n._visit(this, function() {
                    this.properties.forEach(function(e) {
                        e._walk(n);
                    });
                });
            }
        }), Ye = A("ObjectProperty", "key value", {
            $documentation: "Base class for literal object properties",
            $propdoc: {
                key: "[string] the property name converted to a string for ObjectKeyVal.  For setters and getters this is an arbitrary AST_Node.",
                value: "[AST_Node] property value.  For setters and getters this is an AST_Function."
            },
            _walk: function(n) {
                return n._visit(this, function() {
                    this.value._walk(n);
                });
            }
        }), Xe = A("ObjectKeyVal", null, {
            $documentation: "A key: value object property"
        }, Ye), Ge = A("ObjectSetter", null, {
            $documentation: "An object setter property"
        }, Ye), Ke = A("ObjectGetter", null, {
            $documentation: "An object getter property"
        }, Ye), Je = A("Symbol", "scope name thedef", {
            $propdoc: {
                name: "[string] name of this symbol",
                scope: "[AST_Scope/S] the current scope (not necessarily the definition scope)",
                thedef: "[SymbolDef/S] the definition of this symbol"
            },
            $documentation: "Base class for all symbols"
        }), Qe = A("SymbolAccessor", null, {
            $documentation: "The name of a property accessor (setter/getter function)"
        }, Je), Ze = A("SymbolDeclaration", "init", {
            $documentation: "A declaration symbol (symbol in var/const, function name or argument, symbol in catch)",
            $propdoc: {
                init: "[AST_Node*/S] array of initializers for this declaration."
            }
        }, Je), nt = A("SymbolVar", null, {
            $documentation: "Symbol defining a variable"
        }, Ze), et = A("SymbolConst", null, {
            $documentation: "A constant declaration"
        }, Ze), tt = A("SymbolFunarg", null, {
            $documentation: "Symbol naming a function argument"
        }, nt), rt = A("SymbolDefun", null, {
            $documentation: "Symbol defining a function"
        }, Ze), it = A("SymbolLambda", null, {
            $documentation: "Symbol naming a function expression"
        }, Ze), ot = A("SymbolCatch", null, {
            $documentation: "Symbol naming the exception in catch"
        }, Ze), at = A("Label", "references", {
            $documentation: "Symbol naming a label (declaration)",
            $propdoc: {
                references: "[AST_LoopControl*] a list of nodes referring to this label"
            },
            initialize: function() {
                this.references = [], this.thedef = this;
            }
        }, Je), ut = A("SymbolRef", null, {
            $documentation: "Reference to some symbol (not definition/declaration)"
        }, Je), st = A("LabelRef", null, {
            $documentation: "Reference to a label symbol"
        }, Je), ct = A("This", null, {
            $documentation: "The `this` symbol"
        }, Je), ft = A("Constant", null, {
            $documentation: "Base class for all constants",
            getValue: function() {
                return this.value;
            }
        }), lt = A("String", "value", {
            $documentation: "A string literal",
            $propdoc: {
                value: "[string] the contents of this string"
            }
        }, ft), pt = A("Number", "value", {
            $documentation: "A number literal",
            $propdoc: {
                value: "[number] the numeric value"
            }
        }, ft), dt = A("RegExp", "value", {
            $documentation: "A regexp literal",
            $propdoc: {
                value: "[RegExp] the actual regexp"
            }
        }, ft), ht = A("Atom", null, {
            $documentation: "Base class for atoms"
        }, ft), _t = A("Null", null, {
            $documentation: "The `null` atom",
            value: null
        }, ht), vt = A("NaN", null, {
            $documentation: "The impossible value",
            value: 0 / 0
        }, ht), mt = A("Undefined", null, {
            $documentation: "The `undefined` value",
            value: void 0
        }, ht), gt = A("Hole", null, {
            $documentation: "A hole in an array",
            value: void 0
        }, ht), bt = A("Infinity", null, {
            $documentation: "The `Infinity` value",
            value: 1 / 0
        }, ht), yt = A("Boolean", null, {
            $documentation: "Base class for booleans"
        }, ht), At = A("False", null, {
            $documentation: "The `false` atom",
            value: !1
        }, yt), wt = A("True", null, {
            $documentation: "The `true` atom",
            value: !0
        }, yt);
        E.prototype = {
            _visit: function(n, e) {
                this.stack.push(n);
                var t = this.visit(n, e ? function() {
                    e.call(n);
                } : l);
                return !t && e && e.call(n), this.stack.pop(), t;
            },
            parent: function(n) {
                return this.stack[this.stack.length - 2 - (n || 0)];
            },
            push: function(n) {
                this.stack.push(n);
            },
            pop: function() {
                return this.stack.pop();
            },
            self: function() {
                return this.stack[this.stack.length - 1];
            },
            find_parent: function(n) {
                for (var e = this.stack, t = e.length; --t >= 0; ) {
                    var r = e[t];
                    if (r instanceof n) return r;
                }
            },
            has_directive: function(n) {
                return this.find_parent(se).has_directive(n);
            },
            in_boolean_context: function() {
                for (var n = this.stack, e = n.length, t = n[--e]; e > 0; ) {
                    var r = n[--e];
                    if (r instanceof Ae && r.condition === t || r instanceof Ue && r.condition === t || r instanceof te && r.condition === t || r instanceof oe && r.condition === t || r instanceof je && "!" == r.operator && r.expression === t) return !0;
                    if (!(r instanceof Ie) || "&&" != r.operator && "||" != r.operator) return !1;
                    t = r;
                }
            },
            loopcontrol_target: function(n) {
                var e = this.stack;
                if (n) for (var t = e.length; --t >= 0; ) {
                    var r = e[t];
                    if (r instanceof ne && r.label.name == n.name) return r.body;
                } else for (var t = e.length; --t >= 0; ) {
                    var r = e[t];
                    if (r instanceof we || r instanceof ee) return r;
                }
            }
        };
        var Et = "break case catch const continue debugger default delete do else finally for function if in instanceof new return switch throw try typeof var void while with", Dt = "false null true", Ft = "abstract boolean byte char class double enum export extends final float goto implements import int interface long native package private protected public short static super synchronized this throws transient volatile yield " + Dt + " " + Et, Ct = "return new delete throw else case";
        Et = g(Et), Ft = g(Ft), Ct = g(Ct), Dt = g(Dt);
        var St = g(i("+-*&%=<>!?|~^")), kt = /^0x[0-9a-f]+$/i, Bt = /^0[0-7]+$/, xt = /^\d*\.?\d*(?:e[+-]?\d*(?:\d\.?|\.?\d)\d*)?$/i, Tt = g([ "in", "instanceof", "typeof", "new", "void", "delete", "++", "--", "+", "-", "!", "~", "&", "|", "^", "*", "/", "%", ">>", "<<", ">>>", "<", ">", "<=", ">=", "==", "===", "!=", "!==", "?", "=", "+=", "-=", "/=", "*=", "%=", ">>=", "<<=", ">>>=", "|=", "^=", "&=", "&&", "||" ]), $t = g(i("  \n\r	\f​᠎             　")), Ot = g(i("[{(,.;:")), Nt = g(i("[]{}(),;:")), Mt = g(i("gmsiy")), Rt = {
            letter: RegExp("[\\u0041-\\u005A\\u0061-\\u007A\\u00AA\\u00B5\\u00BA\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02C1\\u02C6-\\u02D1\\u02E0-\\u02E4\\u02EC\\u02EE\\u0370-\\u0374\\u0376\\u0377\\u037A-\\u037D\\u0386\\u0388-\\u038A\\u038C\\u038E-\\u03A1\\u03A3-\\u03F5\\u03F7-\\u0481\\u048A-\\u0523\\u0531-\\u0556\\u0559\\u0561-\\u0587\\u05D0-\\u05EA\\u05F0-\\u05F2\\u0621-\\u064A\\u066E\\u066F\\u0671-\\u06D3\\u06D5\\u06E5\\u06E6\\u06EE\\u06EF\\u06FA-\\u06FC\\u06FF\\u0710\\u0712-\\u072F\\u074D-\\u07A5\\u07B1\\u07CA-\\u07EA\\u07F4\\u07F5\\u07FA\\u0904-\\u0939\\u093D\\u0950\\u0958-\\u0961\\u0971\\u0972\\u097B-\\u097F\\u0985-\\u098C\\u098F\\u0990\\u0993-\\u09A8\\u09AA-\\u09B0\\u09B2\\u09B6-\\u09B9\\u09BD\\u09CE\\u09DC\\u09DD\\u09DF-\\u09E1\\u09F0\\u09F1\\u0A05-\\u0A0A\\u0A0F\\u0A10\\u0A13-\\u0A28\\u0A2A-\\u0A30\\u0A32\\u0A33\\u0A35\\u0A36\\u0A38\\u0A39\\u0A59-\\u0A5C\\u0A5E\\u0A72-\\u0A74\\u0A85-\\u0A8D\\u0A8F-\\u0A91\\u0A93-\\u0AA8\\u0AAA-\\u0AB0\\u0AB2\\u0AB3\\u0AB5-\\u0AB9\\u0ABD\\u0AD0\\u0AE0\\u0AE1\\u0B05-\\u0B0C\\u0B0F\\u0B10\\u0B13-\\u0B28\\u0B2A-\\u0B30\\u0B32\\u0B33\\u0B35-\\u0B39\\u0B3D\\u0B5C\\u0B5D\\u0B5F-\\u0B61\\u0B71\\u0B83\\u0B85-\\u0B8A\\u0B8E-\\u0B90\\u0B92-\\u0B95\\u0B99\\u0B9A\\u0B9C\\u0B9E\\u0B9F\\u0BA3\\u0BA4\\u0BA8-\\u0BAA\\u0BAE-\\u0BB9\\u0BD0\\u0C05-\\u0C0C\\u0C0E-\\u0C10\\u0C12-\\u0C28\\u0C2A-\\u0C33\\u0C35-\\u0C39\\u0C3D\\u0C58\\u0C59\\u0C60\\u0C61\\u0C85-\\u0C8C\\u0C8E-\\u0C90\\u0C92-\\u0CA8\\u0CAA-\\u0CB3\\u0CB5-\\u0CB9\\u0CBD\\u0CDE\\u0CE0\\u0CE1\\u0D05-\\u0D0C\\u0D0E-\\u0D10\\u0D12-\\u0D28\\u0D2A-\\u0D39\\u0D3D\\u0D60\\u0D61\\u0D7A-\\u0D7F\\u0D85-\\u0D96\\u0D9A-\\u0DB1\\u0DB3-\\u0DBB\\u0DBD\\u0DC0-\\u0DC6\\u0E01-\\u0E30\\u0E32\\u0E33\\u0E40-\\u0E46\\u0E81\\u0E82\\u0E84\\u0E87\\u0E88\\u0E8A\\u0E8D\\u0E94-\\u0E97\\u0E99-\\u0E9F\\u0EA1-\\u0EA3\\u0EA5\\u0EA7\\u0EAA\\u0EAB\\u0EAD-\\u0EB0\\u0EB2\\u0EB3\\u0EBD\\u0EC0-\\u0EC4\\u0EC6\\u0EDC\\u0EDD\\u0F00\\u0F40-\\u0F47\\u0F49-\\u0F6C\\u0F88-\\u0F8B\\u1000-\\u102A\\u103F\\u1050-\\u1055\\u105A-\\u105D\\u1061\\u1065\\u1066\\u106E-\\u1070\\u1075-\\u1081\\u108E\\u10A0-\\u10C5\\u10D0-\\u10FA\\u10FC\\u1100-\\u1159\\u115F-\\u11A2\\u11A8-\\u11F9\\u1200-\\u1248\\u124A-\\u124D\\u1250-\\u1256\\u1258\\u125A-\\u125D\\u1260-\\u1288\\u128A-\\u128D\\u1290-\\u12B0\\u12B2-\\u12B5\\u12B8-\\u12BE\\u12C0\\u12C2-\\u12C5\\u12C8-\\u12D6\\u12D8-\\u1310\\u1312-\\u1315\\u1318-\\u135A\\u1380-\\u138F\\u13A0-\\u13F4\\u1401-\\u166C\\u166F-\\u1676\\u1681-\\u169A\\u16A0-\\u16EA\\u1700-\\u170C\\u170E-\\u1711\\u1720-\\u1731\\u1740-\\u1751\\u1760-\\u176C\\u176E-\\u1770\\u1780-\\u17B3\\u17D7\\u17DC\\u1820-\\u1877\\u1880-\\u18A8\\u18AA\\u1900-\\u191C\\u1950-\\u196D\\u1970-\\u1974\\u1980-\\u19A9\\u19C1-\\u19C7\\u1A00-\\u1A16\\u1B05-\\u1B33\\u1B45-\\u1B4B\\u1B83-\\u1BA0\\u1BAE\\u1BAF\\u1C00-\\u1C23\\u1C4D-\\u1C4F\\u1C5A-\\u1C7D\\u1D00-\\u1DBF\\u1E00-\\u1F15\\u1F18-\\u1F1D\\u1F20-\\u1F45\\u1F48-\\u1F4D\\u1F50-\\u1F57\\u1F59\\u1F5B\\u1F5D\\u1F5F-\\u1F7D\\u1F80-\\u1FB4\\u1FB6-\\u1FBC\\u1FBE\\u1FC2-\\u1FC4\\u1FC6-\\u1FCC\\u1FD0-\\u1FD3\\u1FD6-\\u1FDB\\u1FE0-\\u1FEC\\u1FF2-\\u1FF4\\u1FF6-\\u1FFC\\u2071\\u207F\\u2090-\\u2094\\u2102\\u2107\\u210A-\\u2113\\u2115\\u2119-\\u211D\\u2124\\u2126\\u2128\\u212A-\\u212D\\u212F-\\u2139\\u213C-\\u213F\\u2145-\\u2149\\u214E\\u2183\\u2184\\u2C00-\\u2C2E\\u2C30-\\u2C5E\\u2C60-\\u2C6F\\u2C71-\\u2C7D\\u2C80-\\u2CE4\\u2D00-\\u2D25\\u2D30-\\u2D65\\u2D6F\\u2D80-\\u2D96\\u2DA0-\\u2DA6\\u2DA8-\\u2DAE\\u2DB0-\\u2DB6\\u2DB8-\\u2DBE\\u2DC0-\\u2DC6\\u2DC8-\\u2DCE\\u2DD0-\\u2DD6\\u2DD8-\\u2DDE\\u2E2F\\u3005\\u3006\\u3031-\\u3035\\u303B\\u303C\\u3041-\\u3096\\u309D-\\u309F\\u30A1-\\u30FA\\u30FC-\\u30FF\\u3105-\\u312D\\u3131-\\u318E\\u31A0-\\u31B7\\u31F0-\\u31FF\\u3400\\u4DB5\\u4E00\\u9FC3\\uA000-\\uA48C\\uA500-\\uA60C\\uA610-\\uA61F\\uA62A\\uA62B\\uA640-\\uA65F\\uA662-\\uA66E\\uA67F-\\uA697\\uA717-\\uA71F\\uA722-\\uA788\\uA78B\\uA78C\\uA7FB-\\uA801\\uA803-\\uA805\\uA807-\\uA80A\\uA80C-\\uA822\\uA840-\\uA873\\uA882-\\uA8B3\\uA90A-\\uA925\\uA930-\\uA946\\uAA00-\\uAA28\\uAA40-\\uAA42\\uAA44-\\uAA4B\\uAC00\\uD7A3\\uF900-\\uFA2D\\uFA30-\\uFA6A\\uFA70-\\uFAD9\\uFB00-\\uFB06\\uFB13-\\uFB17\\uFB1D\\uFB1F-\\uFB28\\uFB2A-\\uFB36\\uFB38-\\uFB3C\\uFB3E\\uFB40\\uFB41\\uFB43\\uFB44\\uFB46-\\uFBB1\\uFBD3-\\uFD3D\\uFD50-\\uFD8F\\uFD92-\\uFDC7\\uFDF0-\\uFDFB\\uFE70-\\uFE74\\uFE76-\\uFEFC\\uFF21-\\uFF3A\\uFF41-\\uFF5A\\uFF66-\\uFFBE\\uFFC2-\\uFFC7\\uFFCA-\\uFFCF\\uFFD2-\\uFFD7\\uFFDA-\\uFFDC]"),
            non_spacing_mark: RegExp("[\\u0300-\\u036F\\u0483-\\u0487\\u0591-\\u05BD\\u05BF\\u05C1\\u05C2\\u05C4\\u05C5\\u05C7\\u0610-\\u061A\\u064B-\\u065E\\u0670\\u06D6-\\u06DC\\u06DF-\\u06E4\\u06E7\\u06E8\\u06EA-\\u06ED\\u0711\\u0730-\\u074A\\u07A6-\\u07B0\\u07EB-\\u07F3\\u0816-\\u0819\\u081B-\\u0823\\u0825-\\u0827\\u0829-\\u082D\\u0900-\\u0902\\u093C\\u0941-\\u0948\\u094D\\u0951-\\u0955\\u0962\\u0963\\u0981\\u09BC\\u09C1-\\u09C4\\u09CD\\u09E2\\u09E3\\u0A01\\u0A02\\u0A3C\\u0A41\\u0A42\\u0A47\\u0A48\\u0A4B-\\u0A4D\\u0A51\\u0A70\\u0A71\\u0A75\\u0A81\\u0A82\\u0ABC\\u0AC1-\\u0AC5\\u0AC7\\u0AC8\\u0ACD\\u0AE2\\u0AE3\\u0B01\\u0B3C\\u0B3F\\u0B41-\\u0B44\\u0B4D\\u0B56\\u0B62\\u0B63\\u0B82\\u0BC0\\u0BCD\\u0C3E-\\u0C40\\u0C46-\\u0C48\\u0C4A-\\u0C4D\\u0C55\\u0C56\\u0C62\\u0C63\\u0CBC\\u0CBF\\u0CC6\\u0CCC\\u0CCD\\u0CE2\\u0CE3\\u0D41-\\u0D44\\u0D4D\\u0D62\\u0D63\\u0DCA\\u0DD2-\\u0DD4\\u0DD6\\u0E31\\u0E34-\\u0E3A\\u0E47-\\u0E4E\\u0EB1\\u0EB4-\\u0EB9\\u0EBB\\u0EBC\\u0EC8-\\u0ECD\\u0F18\\u0F19\\u0F35\\u0F37\\u0F39\\u0F71-\\u0F7E\\u0F80-\\u0F84\\u0F86\\u0F87\\u0F90-\\u0F97\\u0F99-\\u0FBC\\u0FC6\\u102D-\\u1030\\u1032-\\u1037\\u1039\\u103A\\u103D\\u103E\\u1058\\u1059\\u105E-\\u1060\\u1071-\\u1074\\u1082\\u1085\\u1086\\u108D\\u109D\\u135F\\u1712-\\u1714\\u1732-\\u1734\\u1752\\u1753\\u1772\\u1773\\u17B7-\\u17BD\\u17C6\\u17C9-\\u17D3\\u17DD\\u180B-\\u180D\\u18A9\\u1920-\\u1922\\u1927\\u1928\\u1932\\u1939-\\u193B\\u1A17\\u1A18\\u1A56\\u1A58-\\u1A5E\\u1A60\\u1A62\\u1A65-\\u1A6C\\u1A73-\\u1A7C\\u1A7F\\u1B00-\\u1B03\\u1B34\\u1B36-\\u1B3A\\u1B3C\\u1B42\\u1B6B-\\u1B73\\u1B80\\u1B81\\u1BA2-\\u1BA5\\u1BA8\\u1BA9\\u1C2C-\\u1C33\\u1C36\\u1C37\\u1CD0-\\u1CD2\\u1CD4-\\u1CE0\\u1CE2-\\u1CE8\\u1CED\\u1DC0-\\u1DE6\\u1DFD-\\u1DFF\\u20D0-\\u20DC\\u20E1\\u20E5-\\u20F0\\u2CEF-\\u2CF1\\u2DE0-\\u2DFF\\u302A-\\u302F\\u3099\\u309A\\uA66F\\uA67C\\uA67D\\uA6F0\\uA6F1\\uA802\\uA806\\uA80B\\uA825\\uA826\\uA8C4\\uA8E0-\\uA8F1\\uA926-\\uA92D\\uA947-\\uA951\\uA980-\\uA982\\uA9B3\\uA9B6-\\uA9B9\\uA9BC\\uAA29-\\uAA2E\\uAA31\\uAA32\\uAA35\\uAA36\\uAA43\\uAA4C\\uAAB0\\uAAB2-\\uAAB4\\uAAB7\\uAAB8\\uAABE\\uAABF\\uAAC1\\uABE5\\uABE8\\uABED\\uFB1E\\uFE00-\\uFE0F\\uFE20-\\uFE26]"),
            space_combining_mark: RegExp("[\\u0903\\u093E-\\u0940\\u0949-\\u094C\\u094E\\u0982\\u0983\\u09BE-\\u09C0\\u09C7\\u09C8\\u09CB\\u09CC\\u09D7\\u0A03\\u0A3E-\\u0A40\\u0A83\\u0ABE-\\u0AC0\\u0AC9\\u0ACB\\u0ACC\\u0B02\\u0B03\\u0B3E\\u0B40\\u0B47\\u0B48\\u0B4B\\u0B4C\\u0B57\\u0BBE\\u0BBF\\u0BC1\\u0BC2\\u0BC6-\\u0BC8\\u0BCA-\\u0BCC\\u0BD7\\u0C01-\\u0C03\\u0C41-\\u0C44\\u0C82\\u0C83\\u0CBE\\u0CC0-\\u0CC4\\u0CC7\\u0CC8\\u0CCA\\u0CCB\\u0CD5\\u0CD6\\u0D02\\u0D03\\u0D3E-\\u0D40\\u0D46-\\u0D48\\u0D4A-\\u0D4C\\u0D57\\u0D82\\u0D83\\u0DCF-\\u0DD1\\u0DD8-\\u0DDF\\u0DF2\\u0DF3\\u0F3E\\u0F3F\\u0F7F\\u102B\\u102C\\u1031\\u1038\\u103B\\u103C\\u1056\\u1057\\u1062-\\u1064\\u1067-\\u106D\\u1083\\u1084\\u1087-\\u108C\\u108F\\u109A-\\u109C\\u17B6\\u17BE-\\u17C5\\u17C7\\u17C8\\u1923-\\u1926\\u1929-\\u192B\\u1930\\u1931\\u1933-\\u1938\\u19B0-\\u19C0\\u19C8\\u19C9\\u1A19-\\u1A1B\\u1A55\\u1A57\\u1A61\\u1A63\\u1A64\\u1A6D-\\u1A72\\u1B04\\u1B35\\u1B3B\\u1B3D-\\u1B41\\u1B43\\u1B44\\u1B82\\u1BA1\\u1BA6\\u1BA7\\u1BAA\\u1C24-\\u1C2B\\u1C34\\u1C35\\u1CE1\\u1CF2\\uA823\\uA824\\uA827\\uA880\\uA881\\uA8B4-\\uA8C3\\uA952\\uA953\\uA983\\uA9B4\\uA9B5\\uA9BA\\uA9BB\\uA9BD-\\uA9C0\\uAA2F\\uAA30\\uAA33\\uAA34\\uAA4D\\uAA7B\\uABE3\\uABE4\\uABE6\\uABE7\\uABE9\\uABEA\\uABEC]"),
            connector_punctuation: RegExp("[\\u005F\\u203F\\u2040\\u2054\\uFE33\\uFE34\\uFE4D-\\uFE4F\\uFF3F]")
        };
        N.prototype.toString = function() {
            return this.message + " (line: " + this.line + ", col: " + this.col + ", pos: " + this.pos + ")\n\n" + this.stack;
        };
        var Ht = {}, qt = g([ "typeof", "void", "delete", "--", "++", "!", "~", "-", "+" ]), Pt = g([ "--", "++" ]), jt = g([ "=", "+=", "-=", "/=", "*=", "%=", ">>=", "<<=", ">>>=", "|=", "^=", "&=" ]), zt = function(n, e) {
            for (var t = 0; t < n.length; ++t) for (var r = n[t], i = 0; i < r.length; ++i) e[r[i]] = t + 1;
            return e;
        }([ [ "||" ], [ "&&" ], [ "|" ], [ "^" ], [ "&" ], [ "==", "===", "!=", "!==" ], [ "<", ">", "<=", ">=", "in", "instanceof" ], [ ">>", "<<", ">>>" ], [ "+", "-" ], [ "*", "/", "%" ] ], {}), It = t([ "for", "do", "while", "switch" ]), Ut = t([ "atom", "num", "string", "regexp", "name" ]);
        P.prototype = new E(), function(n) {
            function e(e, t) {
                e.DEFMETHOD("transform", function(e, r) {
                    var i, o;
                    return e.push(this), e.before && (i = e.before(this, t, r)), i === n && (e.after ? (e.stack[e.stack.length - 1] = i = this.clone(), 
                    t(i, e), o = e.after(i, r), o !== n && (i = o)) : (i = this, t(i, e))), e.pop(), 
                    i;
                });
            }
            function t(n, e) {
                return U(n, function(n) {
                    return n.transform(e, !0);
                });
            }
            e(L, l), e(ne, function(n, e) {
                n.label = n.label.transform(e), n.body = n.body.transform(e);
            }), e(G, function(n, e) {
                n.body = n.body.transform(e);
            }), e(K, function(n, e) {
                n.body = t(n.body, e);
            }), e(te, function(n, e) {
                n.condition = n.condition.transform(e), n.body = n.body.transform(e);
            }), e(oe, function(n, e) {
                n.init && (n.init = n.init.transform(e)), n.condition && (n.condition = n.condition.transform(e)), 
                n.step && (n.step = n.step.transform(e)), n.body = n.body.transform(e);
            }), e(ae, function(n, e) {
                n.init = n.init.transform(e), n.object = n.object.transform(e), n.body = n.body.transform(e);
            }), e(ue, function(n, e) {
                n.expression = n.expression.transform(e), n.body = n.body.transform(e);
            }), e(_e, function(n, e) {
                n.value && (n.value = n.value.transform(e));
            }), e(ge, function(n, e) {
                n.label && (n.label = n.label.transform(e));
            }), e(Ae, function(n, e) {
                n.condition = n.condition.transform(e), n.body = n.body.transform(e), n.alternative && (n.alternative = n.alternative.transform(e));
            }), e(we, function(n, e) {
                n.expression = n.expression.transform(e), n.body = t(n.body, e);
            }), e(Fe, function(n, e) {
                n.expression = n.expression.transform(e), n.body = t(n.body, e);
            }), e(Ce, function(n, e) {
                n.body = t(n.body, e), n.bcatch && (n.bcatch = n.bcatch.transform(e)), n.bfinally && (n.bfinally = n.bfinally.transform(e));
            }), e(Se, function(n, e) {
                n.argname = n.argname.transform(e), n.body = t(n.body, e);
            }), e(Be, function(n, e) {
                n.definitions = t(n.definitions, e);
            }), e($e, function(n, e) {
                n.name = n.name.transform(e), n.value && (n.value = n.value.transform(e));
            }), e(fe, function(n, e) {
                n.name && (n.name = n.name.transform(e)), n.argnames = t(n.argnames, e), n.body = t(n.body, e);
            }), e(Oe, function(n, e) {
                n.expression = n.expression.transform(e), n.args = t(n.args, e);
            }), e(Me, function(n, e) {
                n.car = n.car.transform(e), n.cdr = n.cdr.transform(e);
            }), e(He, function(n, e) {
                n.expression = n.expression.transform(e);
            }), e(qe, function(n, e) {
                n.expression = n.expression.transform(e), n.property = n.property.transform(e);
            }), e(Pe, function(n, e) {
                n.expression = n.expression.transform(e);
            }), e(Ie, function(n, e) {
                n.left = n.left.transform(e), n.right = n.right.transform(e);
            }), e(Ue, function(n, e) {
                n.condition = n.condition.transform(e), n.consequent = n.consequent.transform(e), 
                n.alternative = n.alternative.transform(e);
            }), e(Le, function(n, e) {
                n.elements = t(n.elements, e);
            }), e(We, function(n, e) {
                n.properties = t(n.properties, e);
            }), e(Ye, function(n, e) {
                n.value = n.value.transform(e);
            });
        }(), j.prototype = {
            unmangleable: function(n) {
                return this.global && !(n && n.toplevel) || this.undeclared || !(n && n.eval) && (this.scope.uses_eval || this.scope.uses_with);
            },
            mangle: function(n) {
                if (!this.mangled_name && !this.unmangleable(n)) {
                    var e = this.scope;
                    !n.screw_ie8 && this.orig[0] instanceof it && (e = e.parent_scope), this.mangled_name = e.next_mangled(n, this);
                }
            }
        }, ce.DEFMETHOD("figure_out_scope", function(n) {
            n = c(n, {
                screw_ie8: !1
            });
            var e = this, t = e.parent_scope = null, r = null, i = 0, o = new E(function(e, a) {
                if (n.screw_ie8 && e instanceof Se) {
                    var u = t;
                    return t = new se(e), t.init_scope_vars(i), t.parent_scope = u, a(), t = u, !0;
                }
                if (e instanceof se) {
                    e.init_scope_vars(i);
                    var u = e.parent_scope = t, s = r;
                    return r = t = e, ++i, a(), --i, t = u, r = s, !0;
                }
                if (e instanceof X) return e.scope = t, p(t.directives, e.value), !0;
                if (e instanceof ue) for (var c = t; c; c = c.parent_scope) c.uses_with = !0; else if (e instanceof Je && (e.scope = t), 
                e instanceof it) r.def_function(e); else if (e instanceof rt) (e.scope = r.parent_scope).def_function(e); else if (e instanceof nt || e instanceof et) {
                    var f = r.def_variable(e);
                    f.constant = e instanceof et, f.init = o.parent().value;
                } else e instanceof ot && (n.screw_ie8 ? t : r).def_variable(e);
            });
            e.walk(o);
            var a = null, u = e.globals = new y(), o = new E(function(n, t) {
                if (n instanceof fe) {
                    var r = a;
                    return a = n, t(), a = r, !0;
                }
                if (n instanceof ut) {
                    var i = n.name, s = n.scope.find_variable(i);
                    if (s) n.thedef = s; else {
                        var c;
                        if (u.has(i) ? c = u.get(i) : (c = new j(e, u.size(), n), c.undeclared = !0, c.global = !0, 
                        u.set(i, c)), n.thedef = c, "eval" == i && o.parent() instanceof Oe) for (var f = n.scope; f && !f.uses_eval; f = f.parent_scope) f.uses_eval = !0;
                        a && "arguments" == i && (a.uses_arguments = !0);
                    }
                    return n.reference(), !0;
                }
            });
            e.walk(o);
        }), se.DEFMETHOD("init_scope_vars", function(n) {
            this.directives = [], this.variables = new y(), this.functions = new y(), this.uses_with = !1, 
            this.uses_eval = !1, this.parent_scope = null, this.enclosed = [], this.cname = -1, 
            this.nesting = n;
        }), se.DEFMETHOD("strict", function() {
            return this.has_directive("use strict");
        }), fe.DEFMETHOD("init_scope_vars", function() {
            se.prototype.init_scope_vars.apply(this, arguments), this.uses_arguments = !1;
        }), ut.DEFMETHOD("reference", function() {
            var n = this.definition();
            n.references.push(this);
            for (var e = this.scope; e && (p(e.enclosed, n), e !== n.scope); ) e = e.parent_scope;
            this.frame = this.scope.nesting - n.scope.nesting;
        }), se.DEFMETHOD("find_variable", function(n) {
            return n instanceof Je && (n = n.name), this.variables.get(n) || this.parent_scope && this.parent_scope.find_variable(n);
        }), se.DEFMETHOD("has_directive", function(n) {
            return this.parent_scope && this.parent_scope.has_directive(n) || (this.directives.indexOf(n) >= 0 ? this : null);
        }), se.DEFMETHOD("def_function", function(n) {
            this.functions.set(n.name, this.def_variable(n));
        }), se.DEFMETHOD("def_variable", function(n) {
            var e;
            return this.variables.has(n.name) ? (e = this.variables.get(n.name), e.orig.push(n)) : (e = new j(this, this.variables.size(), n), 
            this.variables.set(n.name, e), e.global = !this.parent_scope), n.thedef = e;
        }), se.DEFMETHOD("next_mangled", function(n) {
            var e = this.enclosed;
            n: for (;;) {
                var t = Vt(++this.cname);
                if (B(t) && !(n.except.indexOf(t) >= 0)) {
                    for (var r = e.length; --r >= 0; ) {
                        var i = e[r], o = i.mangled_name || i.unmangleable(n) && i.name;
                        if (t == o) continue n;
                    }
                    return t;
                }
            }
        }), pe.DEFMETHOD("next_mangled", function(n, e) {
            for (var t = e.orig[0] instanceof tt && this.name && this.name.definition(); ;) {
                var r = fe.prototype.next_mangled.call(this, n, e);
                if (!t || t.mangled_name != r) return r;
            }
        }), se.DEFMETHOD("references", function(n) {
            return n instanceof Je && (n = n.definition()), this.enclosed.indexOf(n) < 0 ? null : n;
        }), Je.DEFMETHOD("unmangleable", function(n) {
            return this.definition().unmangleable(n);
        }), Qe.DEFMETHOD("unmangleable", function() {
            return !0;
        }), at.DEFMETHOD("unmangleable", function() {
            return !1;
        }), Je.DEFMETHOD("unreferenced", function() {
            return 0 == this.definition().references.length && !(this.scope.uses_eval || this.scope.uses_with);
        }), Je.DEFMETHOD("undeclared", function() {
            return this.definition().undeclared;
        }), st.DEFMETHOD("undeclared", function() {
            return !1;
        }), at.DEFMETHOD("undeclared", function() {
            return !1;
        }), Je.DEFMETHOD("definition", function() {
            return this.thedef;
        }), Je.DEFMETHOD("global", function() {
            return this.definition().global;
        }), ce.DEFMETHOD("_default_mangler_options", function(n) {
            return c(n, {
                except: [],
                eval: !1,
                sort: !1,
                toplevel: !1,
                screw_ie8: !1
            });
        }), ce.DEFMETHOD("mangle_names", function(n) {
            n = this._default_mangler_options(n);
            var e = -1, t = [], r = new E(function(i, o) {
                if (i instanceof ne) {
                    var a = e;
                    return o(), e = a, !0;
                }
                if (i instanceof se) {
                    var u = (r.parent(), []);
                    return i.variables.each(function(e) {
                        n.except.indexOf(e.name) < 0 && u.push(e);
                    }), n.sort && u.sort(function(n, e) {
                        return e.references.length - n.references.length;
                    }), void t.push.apply(t, u);
                }
                if (i instanceof at) {
                    var s;
                    do s = Vt(++e); while (!B(s));
                    return i.mangled_name = s, !0;
                }
                return n.screw_ie8 && i instanceof ot ? void t.push(i.definition()) : void 0;
            });
            this.walk(r), t.forEach(function(e) {
                e.mangle(n);
            });
        }), ce.DEFMETHOD("compute_char_frequency", function(n) {
            n = this._default_mangler_options(n);
            var e = new E(function(e) {
                e instanceof ft ? Vt.consider(e.print_to_string()) : e instanceof ve ? Vt.consider("return") : e instanceof me ? Vt.consider("throw") : e instanceof ye ? Vt.consider("continue") : e instanceof be ? Vt.consider("break") : e instanceof Y ? Vt.consider("debugger") : e instanceof X ? Vt.consider(e.value) : e instanceof ie ? Vt.consider("while") : e instanceof re ? Vt.consider("do while") : e instanceof Ae ? (Vt.consider("if"), 
                e.alternative && Vt.consider("else")) : e instanceof xe ? Vt.consider("var") : e instanceof Te ? Vt.consider("const") : e instanceof fe ? Vt.consider("function") : e instanceof oe ? Vt.consider("for") : e instanceof ae ? Vt.consider("for in") : e instanceof we ? Vt.consider("switch") : e instanceof Fe ? Vt.consider("case") : e instanceof De ? Vt.consider("default") : e instanceof ue ? Vt.consider("with") : e instanceof Ge ? Vt.consider("set" + e.key) : e instanceof Ke ? Vt.consider("get" + e.key) : e instanceof Xe ? Vt.consider(e.key) : e instanceof Ne ? Vt.consider("new") : e instanceof ct ? Vt.consider("this") : e instanceof Ce ? Vt.consider("try") : e instanceof Se ? Vt.consider("catch") : e instanceof ke ? Vt.consider("finally") : e instanceof Je && e.unmangleable(n) ? Vt.consider(e.name) : e instanceof Pe || e instanceof Ie ? Vt.consider(e.operator) : e instanceof He && Vt.consider(e.property);
            });
            this.walk(e), Vt.sort();
        });
        var Vt = function() {
            function n() {
                r = {}, t = i.split("").map(function(n) {
                    return n.charCodeAt(0);
                }), t.forEach(function(n) {
                    r[n] = 0;
                });
            }
            function e(n) {
                var e = "", r = 54;
                do e += String.fromCharCode(t[n % r]), n = Math.floor(n / r), r = 64; while (n > 0);
                return e;
            }
            var t, r, i = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$_0123456789";
            return e.consider = function(n) {
                for (var e = n.length; --e >= 0; ) {
                    var t = n.charCodeAt(e);
                    t in r && ++r[t];
                }
            }, e.sort = function() {
                t = _(t, function(n, e) {
                    return F(n) && !F(e) ? 1 : F(e) && !F(n) ? -1 : r[e] - r[n];
                });
            }, e.reset = n, n(), e.get = function() {
                return t;
            }, e.freq = function() {
                return r;
            }, e;
        }();
        ce.DEFMETHOD("scope_warnings", function(n) {
            n = c(n, {
                undeclared: !1,
                unreferenced: !0,
                assign_to_global: !0,
                func_arguments: !0,
                nested_defuns: !0,
                eval: !0
            });
            var e = new E(function(t) {
                if (n.undeclared && t instanceof ut && t.undeclared() && L.warn("Undeclared symbol: {name} [{file}:{line},{col}]", {
                    name: t.name,
                    file: t.start.file,
                    line: t.start.line,
                    col: t.start.col
                }), n.assign_to_global) {
                    var r = null;
                    t instanceof Ve && t.left instanceof ut ? r = t.left : t instanceof ae && t.init instanceof ut && (r = t.init), 
                    r && (r.undeclared() || r.global() && r.scope !== r.definition().scope) && L.warn("{msg}: {name} [{file}:{line},{col}]", {
                        msg: r.undeclared() ? "Accidental global?" : "Assignment to global",
                        name: r.name,
                        file: r.start.file,
                        line: r.start.line,
                        col: r.start.col
                    });
                }
                n.eval && t instanceof ut && t.undeclared() && "eval" == t.name && L.warn("Eval is used [{file}:{line},{col}]", t.start), 
                n.unreferenced && (t instanceof Ze || t instanceof at) && t.unreferenced() && L.warn("{type} {name} is declared but not referenced [{file}:{line},{col}]", {
                    type: t instanceof at ? "Label" : "Symbol",
                    name: t.name,
                    file: t.start.file,
                    line: t.start.line,
                    col: t.start.col
                }), n.func_arguments && t instanceof fe && t.uses_arguments && L.warn("arguments used in function {name} [{file}:{line},{col}]", {
                    name: t.name ? t.name.name : "anonymous",
                    file: t.start.file,
                    line: t.start.line,
                    col: t.start.col
                }), n.nested_defuns && t instanceof de && !(e.parent() instanceof se) && L.warn('Function {name} declared in nested statement "{type}" [{file}:{line},{col}]', {
                    name: t.name.name,
                    type: e.parent().TYPE,
                    file: t.start.file,
                    line: t.start.line,
                    col: t.start.col
                });
            });
            this.walk(e);
        }), function() {
            function n(n, e) {
                n.DEFMETHOD("_codegen", e);
            }
            function e(n, e) {
                n.DEFMETHOD("needs_parens", e);
            }
            function t(n) {
                var e = n.parent();
                return e instanceof Pe ? !0 : e instanceof Ie && !(e instanceof Ve) ? !0 : e instanceof Oe && e.expression === this ? !0 : e instanceof Ue && e.condition === this ? !0 : e instanceof Re && e.expression === this ? !0 : void 0;
            }
            function r(n, e, t) {
                var r = n.length - 1;
                n.forEach(function(n, i) {
                    n instanceof Q || (t.indent(), n.print(t), i == r && e || (t.newline(), e && t.newline()));
                });
            }
            function i(n, e) {
                n.length > 0 ? e.with_block(function() {
                    r(n, !1, e);
                }) : e.print("{}");
            }
            function o(n, e) {
                if (e.option("bracketize")) return void h(n.body, e);
                if (!n.body) return e.force_semicolon();
                if (n.body instanceof re && !e.option("screw_ie8")) return void h(n.body, e);
                for (var t = n.body; ;) if (t instanceof Ae) {
                    if (!t.alternative) return void h(n.body, e);
                    t = t.alternative;
                } else {
                    if (!(t instanceof Z)) break;
                    t = t.body;
                }
                s(n.body, e);
            }
            function a(n, e, t) {
                if (t) try {
                    n.walk(new E(function(n) {
                        if (n instanceof Ie && "in" == n.operator) throw e;
                    })), n.print(e);
                } catch (r) {
                    if (r !== e) throw r;
                    n.print(e, !0);
                } else n.print(e);
            }
            function u(n) {
                return [ 92, 47, 46, 43, 42, 63, 40, 41, 91, 93, 123, 125, 36, 94, 58, 124, 33, 10, 13, 0, 65279, 8232, 8233 ].indexOf(n) < 0;
            }
            function s(n, e) {
                e.option("bracketize") ? !n || n instanceof Q ? e.print("{}") : n instanceof J ? n.print(e) : e.with_block(function() {
                    e.indent(), n.print(e), e.newline();
                }) : !n || n instanceof Q ? e.force_semicolon() : n.print(e);
            }
            function c(n) {
                for (var e = n.stack(), t = e.length, r = e[--t], i = e[--t]; t > 0; ) {
                    if (i instanceof W && i.body === r) return !0;
                    if (!(i instanceof Me && i.car === r || i instanceof Oe && i.expression === r && !(i instanceof Ne) || i instanceof He && i.expression === r || i instanceof qe && i.expression === r || i instanceof Ue && i.condition === r || i instanceof Ie && i.left === r || i instanceof ze && i.expression === r)) return !1;
                    r = i, i = e[--t];
                }
            }
            function f(n, e) {
                return 0 == n.args.length && !e.option("beautify");
            }
            function p(n) {
                for (var e = n[0], t = e.length, r = 1; r < n.length; ++r) n[r].length < t && (e = n[r], 
                t = e.length);
                return e;
            }
            function d(n) {
                var e, t = n.toString(10), r = [ t.replace(/^0\./, ".").replace("e+", "e") ];
                return Math.floor(n) === n ? (n >= 0 ? r.push("0x" + n.toString(16).toLowerCase(), "0" + n.toString(8)) : r.push("-0x" + (-n).toString(16).toLowerCase(), "-0" + (-n).toString(8)), 
                (e = /^(.*?)(0+)$/.exec(n)) && r.push(e[1] + "e" + e[2].length)) : (e = /^0?\.(0+)(.*)$/.exec(n)) && r.push(e[2] + "e-" + (e[1].length + e[2].length), t.substr(t.indexOf("."))), 
                p(r);
            }
            function h(n, e) {
                return n instanceof J ? void n.print(e) : void e.with_block(function() {
                    e.indent(), n.print(e), e.newline();
                });
            }
            function _(n, e) {
                n.DEFMETHOD("add_source_map", function(n) {
                    e(this, n);
                });
            }
            function v(n, e) {
                e.add_mapping(n.start);
            }
            L.DEFMETHOD("print", function(n, e) {
                function t() {
                    r.add_comments(n), r.add_source_map(n), i(r, n);
                }
                var r = this, i = r._codegen;
                n.push_node(r), e || r.needs_parens(n) ? n.with_parens(t) : t(), n.pop_node();
            }), L.DEFMETHOD("print_to_string", function(n) {
                var e = z(n);
                return this.print(e), e.get();
            }), L.DEFMETHOD("add_comments", function(n) {
                var e = n.option("comments"), t = this;
                if (e) {
                    var r = t.start;
                    if (r && !r._comments_dumped) {
                        r._comments_dumped = !0;
                        var i = r.comments_before || [];
                        t instanceof _e && t.value && t.value.walk(new E(function(n) {
                            return n.start && n.start.comments_before && (i = i.concat(n.start.comments_before), 
                            n.start.comments_before = []), n instanceof pe || n instanceof Le || n instanceof We ? !0 : void 0;
                        })), e.test ? i = i.filter(function(n) {
                            return e.test(n.value);
                        }) : "function" == typeof e && (i = i.filter(function(n) {
                            return e(t, n);
                        })), i.forEach(function(e) {
                            /comment[134]/.test(e.type) ? (n.print("//" + e.value + "\n"), n.indent()) : "comment2" == e.type && (n.print("/*" + e.value + "*/"), 
                            r.nlb ? (n.print("\n"), n.indent()) : n.space());
                        });
                    }
                }
            }), e(L, function() {
                return !1;
            }), e(pe, function(n) {
                return c(n);
            }), e(We, function(n) {
                return c(n);
            }), e(Pe, function(n) {
                var e = n.parent();
                return e instanceof Re && e.expression === this;
            }), e(Me, function(n) {
                var e = n.parent();
                return e instanceof Oe || e instanceof Pe || e instanceof Ie || e instanceof $e || e instanceof Re || e instanceof Le || e instanceof Ye || e instanceof Ue;
            }), e(Ie, function(n) {
                var e = n.parent();
                if (e instanceof Oe && e.expression === this) return !0;
                if (e instanceof Pe) return !0;
                if (e instanceof Re && e.expression === this) return !0;
                if (e instanceof Ie) {
                    var t = e.operator, r = zt[t], i = this.operator, o = zt[i];
                    if (r > o || r == o && this === e.right) return !0;
                }
            }), e(Re, function(n) {
                var e = n.parent();
                if (e instanceof Ne && e.expression === this) try {
                    this.walk(new E(function(n) {
                        if (n instanceof Oe) throw e;
                    }));
                } catch (t) {
                    if (t !== e) throw t;
                    return !0;
                }
            }), e(Oe, function(n) {
                var e, t = n.parent();
                return t instanceof Ne && t.expression === this ? !0 : this.expression instanceof pe && t instanceof Re && t.expression === this && (e = n.parent(1)) instanceof Ve && e.left === t;
            }), e(Ne, function(n) {
                var e = n.parent();
                return f(this, n) && (e instanceof Re || e instanceof Oe && e.expression === this) ? !0 : void 0;
            }), e(pt, function(n) {
                var e = n.parent();
                return this.getValue() < 0 && e instanceof Re && e.expression === this ? !0 : void 0;
            }), e(vt, function(n) {
                var e = n.parent();
                return e instanceof Re && e.expression === this ? !0 : void 0;
            }), e(Ve, t), e(Ue, t), n(X, function(n, e) {
                e.print_string(n.value), e.semicolon();
            }), n(Y, function(n, e) {
                e.print("debugger"), e.semicolon();
            }), Z.DEFMETHOD("_do_print_body", function(n) {
                s(this.body, n);
            }), n(W, function(n, e) {
                n.body.print(e), e.semicolon();
            }), n(ce, function(n, e) {
                r(n.body, !0, e), e.print("");
            }), n(ne, function(n, e) {
                n.label.print(e), e.colon(), n.body.print(e);
            }), n(G, function(n, e) {
                n.body.print(e), e.semicolon();
            }), n(J, function(n, e) {
                i(n.body, e);
            }), n(Q, function(n, e) {
                e.semicolon();
            }), n(re, function(n, e) {
                e.print("do"), e.space(), n._do_print_body(e), e.space(), e.print("while"), e.space(), 
                e.with_parens(function() {
                    n.condition.print(e);
                }), e.semicolon();
            }), n(ie, function(n, e) {
                e.print("while"), e.space(), e.with_parens(function() {
                    n.condition.print(e);
                }), e.space(), n._do_print_body(e);
            }), n(oe, function(n, e) {
                e.print("for"), e.space(), e.with_parens(function() {
                    n.init ? (n.init instanceof Be ? n.init.print(e) : a(n.init, e, !0), e.print(";"), 
                    e.space()) : e.print(";"), n.condition ? (n.condition.print(e), e.print(";"), e.space()) : e.print(";"), 
                    n.step && n.step.print(e);
                }), e.space(), n._do_print_body(e);
            }), n(ae, function(n, e) {
                e.print("for"), e.space(), e.with_parens(function() {
                    n.init.print(e), e.space(), e.print("in"), e.space(), n.object.print(e);
                }), e.space(), n._do_print_body(e);
            }), n(ue, function(n, e) {
                e.print("with"), e.space(), e.with_parens(function() {
                    n.expression.print(e);
                }), e.space(), n._do_print_body(e);
            }), fe.DEFMETHOD("_do_print", function(n, e) {
                var t = this;
                e || n.print("function"), t.name && (n.space(), t.name.print(n)), n.with_parens(function() {
                    t.argnames.forEach(function(e, t) {
                        t && n.comma(), e.print(n);
                    });
                }), n.space(), i(t.body, n);
            }), n(fe, function(n, e) {
                n._do_print(e);
            }), _e.DEFMETHOD("_do_print", function(n, e) {
                n.print(e), this.value && (n.space(), this.value.print(n)), n.semicolon();
            }), n(ve, function(n, e) {
                n._do_print(e, "return");
            }), n(me, function(n, e) {
                n._do_print(e, "throw");
            }), ge.DEFMETHOD("_do_print", function(n, e) {
                n.print(e), this.label && (n.space(), this.label.print(n)), n.semicolon();
            }), n(be, function(n, e) {
                n._do_print(e, "break");
            }), n(ye, function(n, e) {
                n._do_print(e, "continue");
            }), n(Ae, function(n, e) {
                e.print("if"), e.space(), e.with_parens(function() {
                    n.condition.print(e);
                }), e.space(), n.alternative ? (o(n, e), e.space(), e.print("else"), e.space(), 
                s(n.alternative, e)) : n._do_print_body(e);
            }), n(we, function(n, e) {
                e.print("switch"), e.space(), e.with_parens(function() {
                    n.expression.print(e);
                }), e.space(), n.body.length > 0 ? e.with_block(function() {
                    n.body.forEach(function(n, t) {
                        t && e.newline(), e.indent(!0), n.print(e);
                    });
                }) : e.print("{}");
            }), Ee.DEFMETHOD("_do_print_body", function(n) {
                this.body.length > 0 && (n.newline(), this.body.forEach(function(e) {
                    n.indent(), e.print(n), n.newline();
                }));
            }), n(De, function(n, e) {
                e.print("default:"), n._do_print_body(e);
            }), n(Fe, function(n, e) {
                e.print("case"), e.space(), n.expression.print(e), e.print(":"), n._do_print_body(e);
            }), n(Ce, function(n, e) {
                e.print("try"), e.space(), i(n.body, e), n.bcatch && (e.space(), n.bcatch.print(e)), 
                n.bfinally && (e.space(), n.bfinally.print(e));
            }), n(Se, function(n, e) {
                e.print("catch"), e.space(), e.with_parens(function() {
                    n.argname.print(e);
                }), e.space(), i(n.body, e);
            }), n(ke, function(n, e) {
                e.print("finally"), e.space(), i(n.body, e);
            }), Be.DEFMETHOD("_do_print", function(n, e) {
                n.print(e), n.space(), this.definitions.forEach(function(e, t) {
                    t && n.comma(), e.print(n);
                });
                var t = n.parent(), r = t instanceof oe || t instanceof ae, i = r && t.init === this;
                i || n.semicolon();
            }), n(xe, function(n, e) {
                n._do_print(e, "var");
            }), n(Te, function(n, e) {
                n._do_print(e, "const");
            }), n($e, function(n, e) {
                if (n.name.print(e), n.value) {
                    e.space(), e.print("="), e.space();
                    var t = e.parent(1), r = t instanceof oe || t instanceof ae;
                    a(n.value, e, r);
                }
            }), n(Oe, function(n, e) {
                n.expression.print(e), n instanceof Ne && f(n, e) || e.with_parens(function() {
                    n.args.forEach(function(n, t) {
                        t && e.comma(), n.print(e);
                    });
                });
            }), n(Ne, function(n, e) {
                e.print("new"), e.space(), Oe.prototype._codegen(n, e);
            }), Me.DEFMETHOD("_do_print", function(n) {
                this.car.print(n), this.cdr && (n.comma(), n.should_break() && (n.newline(), n.indent()), 
                this.cdr.print(n));
            }), n(Me, function(n, e) {
                n._do_print(e);
            }), n(He, function(n, e) {
                var t = n.expression;
                t.print(e), t instanceof pt && t.getValue() >= 0 && (/[xa-f.]/i.test(e.last()) || e.print(".")), 
                e.print("."), e.add_mapping(n.end), e.print_name(n.property);
            }), n(qe, function(n, e) {
                n.expression.print(e), e.print("["), n.property.print(e), e.print("]");
            }), n(je, function(n, e) {
                var t = n.operator;
                e.print(t), (/^[a-z]/i.test(t) || /[+-]$/.test(t) && n.expression instanceof je && /^[+-]/.test(n.expression.operator)) && e.space(), 
                n.expression.print(e);
            }), n(ze, function(n, e) {
                n.expression.print(e), e.print(n.operator);
            }), n(Ie, function(n, e) {
                n.left.print(e), e.space(), e.print(n.operator), "<" == n.operator && n.right instanceof je && "!" == n.right.operator && n.right.expression instanceof je && "--" == n.right.expression.operator ? e.print(" ") : e.space(), 
                n.right.print(e);
            }), n(Ue, function(n, e) {
                n.condition.print(e), e.space(), e.print("?"), e.space(), n.consequent.print(e), 
                e.space(), e.colon(), n.alternative.print(e);
            }), n(Le, function(n, e) {
                e.with_square(function() {
                    var t = n.elements, r = t.length;
                    r > 0 && e.space(), t.forEach(function(n, t) {
                        t && e.comma(), n.print(e), t === r - 1 && n instanceof gt && e.comma();
                    }), r > 0 && e.space();
                });
            }), n(We, function(n, e) {
                n.properties.length > 0 ? e.with_block(function() {
                    n.properties.forEach(function(n, t) {
                        t && (e.print(","), e.newline()), e.indent(), n.print(e);
                    }), e.newline();
                }) : e.print("{}");
            }), n(Xe, function(n, e) {
                var t = n.key;
                e.option("quote_keys") ? e.print_string(t + "") : ("number" == typeof t || !e.option("beautify") && +t + "" == t) && parseFloat(t) >= 0 ? e.print(d(t)) : (Ft(t) ? e.option("screw_ie8") : $(t)) ? e.print_name(t) : e.print_string(t), 
                e.colon(), n.value.print(e);
            }), n(Ge, function(n, e) {
                e.print("set"), e.space(), n.key.print(e), n.value._do_print(e, !0);
            }), n(Ke, function(n, e) {
                e.print("get"), e.space(), n.key.print(e), n.value._do_print(e, !0);
            }), n(Je, function(n, e) {
                var t = n.definition();
                e.print_name(t ? t.mangled_name || t.name : n.name);
            }), n(mt, function(n, e) {
                e.print("void 0");
            }), n(gt, l), n(bt, function(n, e) {
                e.print("1/0");
            }), n(vt, function(n, e) {
                e.print("0/0");
            }), n(ct, function(n, e) {
                e.print("this");
            }), n(ft, function(n, e) {
                e.print(n.getValue());
            }), n(lt, function(n, e) {
                e.print_string(n.getValue());
            }), n(pt, function(n, e) {
                e.print(d(n.getValue()));
            }), n(dt, function(n, e) {
                var t = "" + n.getValue();
                e.option("ascii_only") ? t = e.to_ascii(t) : e.option("unescape_regexps") && (t = t.split("\\\\").map(function(n) {
                    return n.replace(/\\u[0-9a-fA-F]{4}|\\x[0-9a-fA-F]{2}/g, function(n) {
                        var e = parseInt(n.substr(2), 16);
                        return u(e) ? String.fromCharCode(e) : n;
                    });
                }).join("\\\\")), e.print(t);
                var r = e.parent();
                r instanceof Ie && /^in/.test(r.operator) && r.left === n && e.print(" ");
            }), _(L, l), _(X, v), _(Y, v), _(Je, v), _(he, v), _(Z, v), _(ne, l), _(fe, v), 
            _(we, v), _(Ee, v), _(J, v), _(ce, l), _(Ne, v), _(Ce, v), _(Se, v), _(ke, v), _(Be, v), 
            _(ft, v), _(Ye, function(n, e) {
                e.add_mapping(n.start, n.key);
            });
        }(), I.prototype = new P(), f(I.prototype, {
            option: function(n) {
                return this.options[n];
            },
            warn: function() {
                this.options.warnings && L.warn.apply(L, arguments);
            },
            before: function(n, e) {
                if (n._squeezed) return n;
                var t = !1;
                return n instanceof se && (n = n.hoist_declarations(this), t = !0), e(n, this), 
                n = n.optimize(this), t && n instanceof se && (n.drop_unused(this), e(n, this)), 
                n._squeezed = !0, n;
            }
        }), function() {
            function n(n, e) {
                n.DEFMETHOD("optimize", function(n) {
                    var t = this;
                    if (t._optimized) return t;
                    var r = e(t, n);
                    return r._optimized = !0, r === t ? r : r.transform(n);
                });
            }
            function e(n, e, t) {
                return t || (t = {}), e && (t.start || (t.start = e.start), t.end || (t.end = e.end)), 
                new n(t);
            }
            function t(n, t, r) {
                if (t instanceof L) return t.transform(n);
                switch (typeof t) {
                  case "string":
                    return e(lt, r, {
                        value: t
                    }).optimize(n);

                  case "number":
                    return e(isNaN(t) ? vt : pt, r, {
                        value: t
                    }).optimize(n);

                  case "boolean":
                    return e(t ? wt : At, r).optimize(n);

                  case "undefined":
                    return e(mt, r).optimize(n);

                  default:
                    if (null === t) return e(_t, r).optimize(n);
                    if (t instanceof RegExp) return e(dt, r).optimize(n);
                    throw Error(d("Can't handle constant of type: {type}", {
                        type: typeof t
                    }));
                }
            }
            function r(n) {
                if (null === n) return [];
                if (n instanceof J) return n.body;
                if (n instanceof Q) return [];
                if (n instanceof W) return [ n ];
                throw Error("Can't convert thing to statement array");
            }
            function i(n) {
                return null === n ? !0 : n instanceof Q ? !0 : n instanceof J ? 0 == n.body.length : !1;
            }
            function u(n) {
                return n instanceof we ? n : (n instanceof oe || n instanceof ae || n instanceof te) && n.body instanceof J ? n.body : n;
            }
            function s(n, t) {
                function i(n) {
                    function r(n, t) {
                        return e(G, n, {
                            body: e(Ve, n, {
                                operator: "=",
                                left: e(He, t, {
                                    expression: e(ut, t, t),
                                    property: "$inject"
                                }),
                                right: e(Le, n, {
                                    elements: n.argnames.map(function(n) {
                                        return e(lt, n, {
                                            value: n.name
                                        });
                                    })
                                })
                            })
                        });
                    }
                    return n.reduce(function(n, e) {
                        n.push(e);
                        var i = e.start, o = i.comments_before;
                        if (o && o.length > 0) {
                            var a = o.pop();
                            /@ngInject/.test(a.value) && (e instanceof de ? n.push(r(e, e.name)) : e instanceof Be ? e.definitions.forEach(function(e) {
                                e.value && e.value instanceof fe && n.push(r(e.value, e.name));
                            }) : t.warn("Unknown statement marked with @ngInject [{file}:{line},{col}]", i));
                        }
                        return n;
                    }, []);
                }
                function o(n) {
                    var e = [];
                    return n.reduce(function(n, t) {
                        return t instanceof J ? (_ = !0, n.push.apply(n, o(t.body))) : t instanceof Q ? _ = !0 : t instanceof X ? e.indexOf(t.value) < 0 ? (n.push(t), 
                        e.push(t.value)) : _ = !0 : n.push(t), n;
                    }, []);
                }
                function a(n, t) {
                    var i = t.self(), o = i instanceof fe, a = [];
                    n: for (var s = n.length; --s >= 0; ) {
                        var c = n[s];
                        switch (!0) {
                          case o && c instanceof ve && !c.value && 0 == a.length:
                            _ = !0;
                            continue n;

                          case c instanceof Ae:
                            if (c.body instanceof ve) {
                                if ((o && 0 == a.length || a[0] instanceof ve && !a[0].value) && !c.body.value && !c.alternative) {
                                    _ = !0;
                                    var f = e(G, c.condition, {
                                        body: c.condition
                                    });
                                    a.unshift(f);
                                    continue n;
                                }
                                if (a[0] instanceof ve && c.body.value && a[0].value && !c.alternative) {
                                    _ = !0, c = c.clone(), c.alternative = a[0], a[0] = c.transform(t);
                                    continue n;
                                }
                                if ((0 == a.length || a[0] instanceof ve) && c.body.value && !c.alternative && o) {
                                    _ = !0, c = c.clone(), c.alternative = a[0] || e(ve, c, {
                                        value: e(mt, c)
                                    }), a[0] = c.transform(t);
                                    continue n;
                                }
                                if (!c.body.value && o) {
                                    _ = !0, c = c.clone(), c.condition = c.condition.negate(t), c.body = e(J, c, {
                                        body: r(c.alternative).concat(a)
                                    }), c.alternative = null, a = [ c.transform(t) ];
                                    continue n;
                                }
                                if (1 == a.length && o && a[0] instanceof G && (!c.alternative || c.alternative instanceof G)) {
                                    _ = !0, a.push(e(ve, a[0], {
                                        value: e(mt, a[0])
                                    }).transform(t)), a = r(c.alternative).concat(a), a.unshift(c);
                                    continue n;
                                }
                            }
                            var l = v(c.body), p = l instanceof ge ? t.loopcontrol_target(l.label) : null;
                            if (l && (l instanceof ve && !l.value && o || l instanceof ye && i === u(p) || l instanceof be && p instanceof J && i === p)) {
                                l.label && h(l.label.thedef.references, l), _ = !0;
                                var d = r(c.body).slice(0, -1);
                                c = c.clone(), c.condition = c.condition.negate(t), c.body = e(J, c, {
                                    body: r(c.alternative).concat(a)
                                }), c.alternative = e(J, c, {
                                    body: d
                                }), a = [ c.transform(t) ];
                                continue n;
                            }
                            var l = v(c.alternative), p = l instanceof ge ? t.loopcontrol_target(l.label) : null;
                            if (l && (l instanceof ve && !l.value && o || l instanceof ye && i === u(p) || l instanceof be && p instanceof J && i === p)) {
                                l.label && h(l.label.thedef.references, l), _ = !0, c = c.clone(), c.body = e(J, c.body, {
                                    body: r(c.body).concat(a)
                                }), c.alternative = e(J, c.alternative, {
                                    body: r(c.alternative).slice(0, -1)
                                }), a = [ c.transform(t) ];
                                continue n;
                            }
                            a.unshift(c);
                            break;

                          default:
                            a.unshift(c);
                        }
                    }
                    return a;
                }
                function s(n, e) {
                    var t = !1, r = n.length, i = e.self();
                    return n = n.reduce(function(n, r) {
                        if (t) c(e, r, n); else {
                            if (r instanceof ge) {
                                var o = e.loopcontrol_target(r.label);
                                r instanceof be && o instanceof J && u(o) === i || r instanceof ye && u(o) === i ? r.label && h(r.label.thedef.references, r) : n.push(r);
                            } else n.push(r);
                            v(r) && (t = !0);
                        }
                        return n;
                    }, []), _ = n.length != r, n;
                }
                function f(n, t) {
                    function r() {
                        i = Me.from_array(i), i && o.push(e(G, i, {
                            body: i
                        })), i = [];
                    }
                    if (n.length < 2) return n;
                    var i = [], o = [];
                    return n.forEach(function(n) {
                        n instanceof G ? i.push(n.body) : (r(), o.push(n));
                    }), r(), o = l(o, t), _ = o.length != n.length, o;
                }
                function l(n, t) {
                    function r(n) {
                        i.pop();
                        var e = o.body;
                        return e instanceof Me ? e.add(n) : e = Me.cons(e, n), e.transform(t);
                    }
                    var i = [], o = null;
                    return n.forEach(function(n) {
                        if (o) if (n instanceof oe) {
                            var t = {};
                            try {
                                o.body.walk(new E(function(n) {
                                    if (n instanceof Ie && "in" == n.operator) throw t;
                                })), !n.init || n.init instanceof Be ? n.init || (n.init = o.body, i.pop()) : n.init = r(n.init);
                            } catch (a) {
                                if (a !== t) throw a;
                            }
                        } else n instanceof Ae ? n.condition = r(n.condition) : n instanceof ue ? n.expression = r(n.expression) : n instanceof _e && n.value ? n.value = r(n.value) : n instanceof _e ? n.value = r(e(mt, n)) : n instanceof we && (n.expression = r(n.expression));
                        i.push(n), o = n instanceof G ? n : null;
                    }), i;
                }
                function p(n) {
                    var e = null;
                    return n.reduce(function(n, t) {
                        return t instanceof Be && e && e.TYPE == t.TYPE ? (e.definitions = e.definitions.concat(t.definitions), 
                        _ = !0) : t instanceof oe && e instanceof Be && (!t.init || t.init.TYPE == e.TYPE) ? (_ = !0, 
                        n.pop(), t.init ? t.init.definitions = e.definitions.concat(t.init.definitions) : t.init = e, 
                        n.push(t), e = t) : (e = t, n.push(t)), n;
                    }, []);
                }
                function d(n) {
                    n.forEach(function(n) {
                        n instanceof G && (n.body = function t(n) {
                            return n.transform(new P(function(n) {
                                if (n instanceof Oe && n.expression instanceof pe) return e(je, n, {
                                    operator: "!",
                                    expression: n
                                });
                                if (n instanceof Oe) n.expression = t(n.expression); else if (n instanceof Me) n.car = t(n.car); else if (n instanceof Ue) {
                                    var r = t(n.condition);
                                    if (r !== n.condition) {
                                        n.condition = r;
                                        var i = n.consequent;
                                        n.consequent = n.alternative, n.alternative = i;
                                    }
                                }
                                return n;
                            }));
                        }(n.body));
                    });
                }
                var _;
                do _ = !1, t.option("angular") && (n = i(n)), n = o(n), t.option("dead_code") && (n = s(n, t)), 
                t.option("if_return") && (n = a(n, t)), t.option("sequences") && (n = f(n, t)), 
                t.option("join_vars") && (n = p(n, t)); while (_);
                return t.option("negate_iife") && d(n, t), n;
            }
            function c(n, e, t) {
                n.warn("Dropping unreachable code [{file}:{line},{col}]", e.start), e.walk(new E(function(e) {
                    return e instanceof Be ? (n.warn("Declarations in unreachable code! [{file}:{line},{col}]", e.start), 
                    e.remove_initializers(), t.push(e), !0) : e instanceof de ? (t.push(e), !0) : e instanceof se ? !0 : void 0;
                }));
            }
            function f(n, e) {
                return n.print_to_string().length > e.print_to_string().length ? e : n;
            }
            function v(n) {
                return n && n.aborts();
            }
            function m(n, t) {
                function i(i) {
                    i = r(i), n.body instanceof J ? (n.body = n.body.clone(), n.body.body = i.concat(n.body.body.slice(1)), 
                    n.body = n.body.transform(t)) : n.body = e(J, n.body, {
                        body: i
                    }).transform(t), m(n, t);
                }
                var o = n.body instanceof J ? n.body.body[0] : n.body;
                o instanceof Ae && (o.body instanceof be && t.loopcontrol_target(o.body.label) === n ? (n.condition = n.condition ? e(Ie, n.condition, {
                    left: n.condition,
                    operator: "&&",
                    right: o.condition.negate(t)
                }) : o.condition.negate(t), i(o.alternative)) : o.alternative instanceof be && t.loopcontrol_target(o.alternative.label) === n && (n.condition = n.condition ? e(Ie, n.condition, {
                    left: n.condition,
                    operator: "&&",
                    right: o.condition
                }) : o.condition, i(o.body)));
            }
            function A(n, e) {
                var t = e.option("pure_getters");
                e.options.pure_getters = !1;
                var r = n.has_side_effects(e);
                return e.options.pure_getters = t, r;
            }
            function w(n, t) {
                return t.option("booleans") && t.in_boolean_context() ? e(wt, n) : n;
            }
            n(L, function(n) {
                return n;
            }), L.DEFMETHOD("equivalent_to", function(n) {
                return this.print_to_string() == n.print_to_string();
            }), function(n) {
                var e = [ "!", "delete" ], t = [ "in", "instanceof", "==", "!=", "===", "!==", "<", "<=", ">=", ">" ];
                n(L, function() {
                    return !1;
                }), n(je, function() {
                    return o(this.operator, e);
                }), n(Ie, function() {
                    return o(this.operator, t) || ("&&" == this.operator || "||" == this.operator) && this.left.is_boolean() && this.right.is_boolean();
                }), n(Ue, function() {
                    return this.consequent.is_boolean() && this.alternative.is_boolean();
                }), n(Ve, function() {
                    return "=" == this.operator && this.right.is_boolean();
                }), n(Me, function() {
                    return this.cdr.is_boolean();
                }), n(wt, function() {
                    return !0;
                }), n(At, function() {
                    return !0;
                });
            }(function(n, e) {
                n.DEFMETHOD("is_boolean", e);
            }), function(n) {
                n(L, function() {
                    return !1;
                }), n(lt, function() {
                    return !0;
                }), n(je, function() {
                    return "typeof" == this.operator;
                }), n(Ie, function(n) {
                    return "+" == this.operator && (this.left.is_string(n) || this.right.is_string(n));
                }), n(Ve, function(n) {
                    return ("=" == this.operator || "+=" == this.operator) && this.right.is_string(n);
                }), n(Me, function(n) {
                    return this.cdr.is_string(n);
                }), n(Ue, function(n) {
                    return this.consequent.is_string(n) && this.alternative.is_string(n);
                }), n(Oe, function(n) {
                    return n.option("unsafe") && this.expression instanceof ut && "String" == this.expression.name && this.expression.undeclared();
                });
            }(function(n, e) {
                n.DEFMETHOD("is_string", e);
            }), function(n) {
                function e(n, e) {
                    if (!e) throw Error("Compressor must be passed");
                    return n._eval(e);
                }
                L.DEFMETHOD("evaluate", function(e) {
                    if (!e.option("evaluate")) return [ this ];
                    try {
                        var r = this._eval(e);
                        return [ f(t(e, r, this), this), r ];
                    } catch (i) {
                        if (i !== n) throw i;
                        return [ this ];
                    }
                }), n(W, function() {
                    throw Error(d("Cannot evaluate a statement [{file}:{line},{col}]", this.start));
                }), n(pe, function() {
                    throw n;
                }), n(L, function() {
                    throw n;
                }), n(ft, function() {
                    return this.getValue();
                }), n(je, function(t) {
                    var r = this.expression;
                    switch (this.operator) {
                      case "!":
                        return !e(r, t);

                      case "typeof":
                        if (r instanceof pe) return "function";
                        if (r = e(r, t), r instanceof RegExp) throw n;
                        return typeof r;

                      case "void":
                        return void e(r, t);

                      case "~":
                        return ~e(r, t);

                      case "-":
                        if (r = e(r, t), 0 === r) throw n;
                        return -r;

                      case "+":
                        return +e(r, t);
                    }
                    throw n;
                }), n(Ie, function(t) {
                    var r = this.left, i = this.right;
                    switch (this.operator) {
                      case "&&":
                        return e(r, t) && e(i, t);

                      case "||":
                        return e(r, t) || e(i, t);

                      case "|":
                        return e(r, t) | e(i, t);

                      case "&":
                        return e(r, t) & e(i, t);

                      case "^":
                        return e(r, t) ^ e(i, t);

                      case "+":
                        return e(r, t) + e(i, t);

                      case "*":
                        return e(r, t) * e(i, t);

                      case "/":
                        return e(r, t) / e(i, t);

                      case "%":
                        return e(r, t) % e(i, t);

                      case "-":
                        return e(r, t) - e(i, t);

                      case "<<":
                        return e(r, t) << e(i, t);

                      case ">>":
                        return e(r, t) >> e(i, t);

                      case ">>>":
                        return e(r, t) >>> e(i, t);

                      case "==":
                        return e(r, t) == e(i, t);

                      case "===":
                        return e(r, t) === e(i, t);

                      case "!=":
                        return e(r, t) != e(i, t);

                      case "!==":
                        return e(r, t) !== e(i, t);

                      case "<":
                        return e(r, t) < e(i, t);

                      case "<=":
                        return e(r, t) <= e(i, t);

                      case ">":
                        return e(r, t) > e(i, t);

                      case ">=":
                        return e(r, t) >= e(i, t);

                      case "in":
                        return e(r, t) in e(i, t);

                      case "instanceof":
                        return e(r, t) instanceof e(i, t);
                    }
                    throw n;
                }), n(Ue, function(n) {
                    return e(this.condition, n) ? e(this.consequent, n) : e(this.alternative, n);
                }), n(ut, function(t) {
                    var r = this.definition();
                    if (r && r.constant && r.init) return e(r.init, t);
                    throw n;
                });
            }(function(n, e) {
                n.DEFMETHOD("_eval", e);
            }), function(n) {
                function t(n) {
                    return e(je, n, {
                        operator: "!",
                        expression: n
                    });
                }
                n(L, function() {
                    return t(this);
                }), n(W, function() {
                    throw Error("Cannot negate a statement");
                }), n(pe, function() {
                    return t(this);
                }), n(je, function() {
                    return "!" == this.operator ? this.expression : t(this);
                }), n(Me, function(n) {
                    var e = this.clone();
                    return e.cdr = e.cdr.negate(n), e;
                }), n(Ue, function(n) {
                    var e = this.clone();
                    return e.consequent = e.consequent.negate(n), e.alternative = e.alternative.negate(n), 
                    f(t(this), e);
                }), n(Ie, function(n) {
                    var e = this.clone(), r = this.operator;
                    if (n.option("unsafe_comps")) switch (r) {
                      case "<=":
                        return e.operator = ">", e;

                      case "<":
                        return e.operator = ">=", e;

                      case ">=":
                        return e.operator = "<", e;

                      case ">":
                        return e.operator = "<=", e;
                    }
                    switch (r) {
                      case "==":
                        return e.operator = "!=", e;

                      case "!=":
                        return e.operator = "==", e;

                      case "===":
                        return e.operator = "!==", e;

                      case "!==":
                        return e.operator = "===", e;

                      case "&&":
                        return e.operator = "||", e.left = e.left.negate(n), e.right = e.right.negate(n), 
                        f(t(this), e);

                      case "||":
                        return e.operator = "&&", e.left = e.left.negate(n), e.right = e.right.negate(n), 
                        f(t(this), e);
                    }
                    return t(this);
                });
            }(function(n, e) {
                n.DEFMETHOD("negate", function(n) {
                    return e.call(this, n);
                });
            }), function(n) {
                n(L, function() {
                    return !0;
                }), n(Q, function() {
                    return !1;
                }), n(ft, function() {
                    return !1;
                }), n(ct, function() {
                    return !1;
                }), n(Oe, function(n) {
                    var e = n.option("pure_funcs");
                    return e ? e.indexOf(this.expression.print_to_string()) < 0 : !0;
                }), n(K, function(n) {
                    for (var e = this.body.length; --e >= 0; ) if (this.body[e].has_side_effects(n)) return !0;
                    return !1;
                }), n(G, function(n) {
                    return this.body.has_side_effects(n);
                }), n(de, function() {
                    return !0;
                }), n(pe, function() {
                    return !1;
                }), n(Ie, function(n) {
                    return this.left.has_side_effects(n) || this.right.has_side_effects(n);
                }), n(Ve, function() {
                    return !0;
                }), n(Ue, function(n) {
                    return this.condition.has_side_effects(n) || this.consequent.has_side_effects(n) || this.alternative.has_side_effects(n);
                }), n(Pe, function(n) {
                    return "delete" == this.operator || "++" == this.operator || "--" == this.operator || this.expression.has_side_effects(n);
                }), n(ut, function() {
                    return !1;
                }), n(We, function(n) {
                    for (var e = this.properties.length; --e >= 0; ) if (this.properties[e].has_side_effects(n)) return !0;
                    return !1;
                }), n(Ye, function(n) {
                    return this.value.has_side_effects(n);
                }), n(Le, function(n) {
                    for (var e = this.elements.length; --e >= 0; ) if (this.elements[e].has_side_effects(n)) return !0;
                    return !1;
                }), n(He, function(n) {
                    return n.option("pure_getters") ? this.expression.has_side_effects(n) : !0;
                }), n(qe, function(n) {
                    return n.option("pure_getters") ? this.expression.has_side_effects(n) || this.property.has_side_effects(n) : !0;
                }), n(Re, function(n) {
                    return !n.option("pure_getters");
                }), n(Me, function(n) {
                    return this.car.has_side_effects(n) || this.cdr.has_side_effects(n);
                });
            }(function(n, e) {
                n.DEFMETHOD("has_side_effects", e);
            }), function(n) {
                function e() {
                    var n = this.body.length;
                    return n > 0 && v(this.body[n - 1]);
                }
                n(W, function() {
                    return null;
                }), n(he, function() {
                    return this;
                }), n(J, e), n(Ee, e), n(Ae, function() {
                    return this.alternative && v(this.body) && v(this.alternative);
                });
            }(function(n, e) {
                n.DEFMETHOD("aborts", e);
            }), n(X, function(n) {
                return n.scope.has_directive(n.value) !== n.scope ? e(Q, n) : n;
            }), n(Y, function(n, t) {
                return t.option("drop_debugger") ? e(Q, n) : n;
            }), n(ne, function(n, t) {
                return n.body instanceof be && t.loopcontrol_target(n.body.label) === n.body ? e(Q, n) : 0 == n.label.references.length ? n.body : n;
            }), n(K, function(n, e) {
                return n.body = s(n.body, e), n;
            }), n(J, function(n, t) {
                switch (n.body = s(n.body, t), n.body.length) {
                  case 1:
                    return n.body[0];

                  case 0:
                    return e(Q, n);
                }
                return n;
            }), se.DEFMETHOD("drop_unused", function(n) {
                var t = this;
                if (n.option("unused") && !(t instanceof ce) && !t.uses_eval) {
                    var r = [], i = new y(), a = this, u = new E(function(e, o) {
                        if (e !== t) {
                            if (e instanceof de) return i.add(e.name.name, e), !0;
                            if (e instanceof Be && a === t) return e.definitions.forEach(function(e) {
                                e.value && (i.add(e.name.name, e.value), e.value.has_side_effects(n) && e.value.walk(u));
                            }), !0;
                            if (e instanceof ut) return p(r, e.definition()), !0;
                            if (e instanceof se) {
                                var s = a;
                                return a = e, o(), a = s, !0;
                            }
                        }
                    });
                    t.walk(u);
                    for (var s = 0; s < r.length; ++s) r[s].orig.forEach(function(n) {
                        var e = i.get(n.name);
                        e && e.forEach(function(n) {
                            var e = new E(function(n) {
                                n instanceof ut && p(r, n.definition());
                            });
                            n.walk(e);
                        });
                    });
                    var c = new P(function(i, a, u) {
                        if (i instanceof fe && !(i instanceof le) && !n.option("keep_fargs")) for (var s = i.argnames, f = s.length; --f >= 0; ) {
                            var l = s[f];
                            if (!l.unreferenced()) break;
                            s.pop(), n.warn("Dropping unused function argument {name} [{file}:{line},{col}]", {
                                name: l.name,
                                file: l.start.file,
                                line: l.start.line,
                                col: l.start.col
                            });
                        }
                        if (i instanceof de && i !== t) return o(i.name.definition(), r) ? i : (n.warn("Dropping unused function {name} [{file}:{line},{col}]", {
                            name: i.name.name,
                            file: i.name.start.file,
                            line: i.name.start.line,
                            col: i.name.start.col
                        }), e(Q, i));
                        if (i instanceof Be && !(c.parent() instanceof ae)) {
                            var p = i.definitions.filter(function(e) {
                                if (o(e.name.definition(), r)) return !0;
                                var t = {
                                    name: e.name.name,
                                    file: e.name.start.file,
                                    line: e.name.start.line,
                                    col: e.name.start.col
                                };
                                return e.value && e.value.has_side_effects(n) ? (e._unused_side_effects = !0, n.warn("Side effects in initialization of unused variable {name} [{file}:{line},{col}]", t), 
                                !0) : (n.warn("Dropping unused variable {name} [{file}:{line},{col}]", t), !1);
                            });
                            p = _(p, function(n, e) {
                                return !n.value && e.value ? -1 : !e.value && n.value ? 1 : 0;
                            });
                            for (var d = [], f = 0; f < p.length; ) {
                                var h = p[f];
                                h._unused_side_effects ? (d.push(h.value), p.splice(f, 1)) : (d.length > 0 && (d.push(h.value), 
                                h.value = Me.from_array(d), d = []), ++f);
                            }
                            return d = d.length > 0 ? e(J, i, {
                                body: [ e(G, i, {
                                    body: Me.from_array(d)
                                }) ]
                            }) : null, 0 != p.length || d ? 0 == p.length ? d : (i.definitions = p, d && (d.body.unshift(i), 
                            i = d), i) : e(Q, i);
                        }
                        if (i instanceof oe && (a(i, this), i.init instanceof J)) {
                            var v = i.init.body.slice(0, -1);
                            return i.init = i.init.body.slice(-1)[0].body, v.push(i), u ? U.splice(v) : e(J, i, {
                                body: v
                            });
                        }
                        return i instanceof se && i !== t ? i : void 0;
                    });
                    t.transform(c);
                }
            }), se.DEFMETHOD("hoist_declarations", function(n) {
                var t = n.option("hoist_funs"), r = n.option("hoist_vars"), i = this;
                if (t || r) {
                    var o = [], u = [], s = new y(), c = 0, f = 0;
                    i.walk(new E(function(n) {
                        return n instanceof se && n !== i ? !0 : n instanceof xe ? (++f, !0) : void 0;
                    })), r = r && f > 1;
                    var l = new P(function(n) {
                        if (n !== i) {
                            if (n instanceof X) return o.push(n), e(Q, n);
                            if (n instanceof de && t) return u.push(n), e(Q, n);
                            if (n instanceof xe && r) {
                                n.definitions.forEach(function(n) {
                                    s.set(n.name.name, n), ++c;
                                });
                                var a = n.to_assignments(), f = l.parent();
                                return f instanceof ae && f.init === n ? null == a ? n.definitions[0].name : a : f instanceof oe && f.init === n ? a : a ? e(G, n, {
                                    body: a
                                }) : e(Q, n);
                            }
                            if (n instanceof se) return n;
                        }
                    });
                    if (i = i.transform(l), c > 0) {
                        var p = [];
                        if (s.each(function(n, e) {
                            i instanceof fe && a(function(e) {
                                return e.name == n.name.name;
                            }, i.argnames) ? s.del(e) : (n = n.clone(), n.value = null, p.push(n), s.set(e, n));
                        }), p.length > 0) {
                            for (var d = 0; d < i.body.length; ) {
                                if (i.body[d] instanceof G) {
                                    var _, v, m = i.body[d].body;
                                    if (m instanceof Ve && "=" == m.operator && (_ = m.left) instanceof Je && s.has(_.name)) {
                                        var g = s.get(_.name);
                                        if (g.value) break;
                                        g.value = m.right, h(p, g), p.push(g), i.body.splice(d, 1);
                                        continue;
                                    }
                                    if (m instanceof Me && (v = m.car) instanceof Ve && "=" == v.operator && (_ = v.left) instanceof Je && s.has(_.name)) {
                                        var g = s.get(_.name);
                                        if (g.value) break;
                                        g.value = v.right, h(p, g), p.push(g), i.body[d].body = m.cdr;
                                        continue;
                                    }
                                }
                                if (i.body[d] instanceof Q) i.body.splice(d, 1); else {
                                    if (!(i.body[d] instanceof J)) break;
                                    var b = [ d, 1 ].concat(i.body[d].body);
                                    i.body.splice.apply(i.body, b);
                                }
                            }
                            p = e(xe, i, {
                                definitions: p
                            }), u.push(p);
                        }
                    }
                    i.body = o.concat(u, i.body);
                }
                return i;
            }), n(G, function(n, t) {
                return t.option("side_effects") && !n.body.has_side_effects(t) ? (t.warn("Dropping side-effect-free statement [{file}:{line},{col}]", n.start), 
                e(Q, n)) : n;
            }), n(te, function(n, t) {
                var r = n.condition.evaluate(t);
                if (n.condition = r[0], !t.option("loops")) return n;
                if (r.length > 1) {
                    if (r[1]) return e(oe, n, {
                        body: n.body
                    });
                    if (n instanceof ie && t.option("dead_code")) {
                        var i = [];
                        return c(t, n.body, i), e(J, n, {
                            body: i
                        });
                    }
                }
                return n;
            }), n(ie, function(n, t) {
                return t.option("loops") ? (n = te.prototype.optimize.call(n, t), n instanceof ie && (m(n, t), 
                n = e(oe, n, n).transform(t)), n) : n;
            }), n(oe, function(n, t) {
                var r = n.condition;
                if (r && (r = r.evaluate(t), n.condition = r[0]), !t.option("loops")) return n;
                if (r && r.length > 1 && !r[1] && t.option("dead_code")) {
                    var i = [];
                    return n.init instanceof W ? i.push(n.init) : n.init && i.push(e(G, n.init, {
                        body: n.init
                    })), c(t, n.body, i), e(J, n, {
                        body: i
                    });
                }
                return m(n, t), n;
            }), n(Ae, function(n, t) {
                if (!t.option("conditionals")) return n;
                var r = n.condition.evaluate(t);
                if (n.condition = r[0], r.length > 1) if (r[1]) {
                    if (t.warn("Condition always true [{file}:{line},{col}]", n.condition.start), t.option("dead_code")) {
                        var o = [];
                        return n.alternative && c(t, n.alternative, o), o.push(n.body), e(J, n, {
                            body: o
                        }).transform(t);
                    }
                } else if (t.warn("Condition always false [{file}:{line},{col}]", n.condition.start), 
                t.option("dead_code")) {
                    var o = [];
                    return c(t, n.body, o), n.alternative && o.push(n.alternative), e(J, n, {
                        body: o
                    }).transform(t);
                }
                i(n.alternative) && (n.alternative = null);
                var a = n.condition.negate(t), u = f(n.condition, a) === a;
                if (n.alternative && u) {
                    u = !1, n.condition = a;
                    var s = n.body;
                    n.body = n.alternative || e(Q), n.alternative = s;
                }
                if (i(n.body) && i(n.alternative)) return e(G, n.condition, {
                    body: n.condition
                }).transform(t);
                if (n.body instanceof G && n.alternative instanceof G) return e(G, n, {
                    body: e(Ue, n, {
                        condition: n.condition,
                        consequent: n.body.body,
                        alternative: n.alternative.body
                    })
                }).transform(t);
                if (i(n.alternative) && n.body instanceof G) return u ? e(G, n, {
                    body: e(Ie, n, {
                        operator: "||",
                        left: a,
                        right: n.body.body
                    })
                }).transform(t) : e(G, n, {
                    body: e(Ie, n, {
                        operator: "&&",
                        left: n.condition,
                        right: n.body.body
                    })
                }).transform(t);
                if (n.body instanceof Q && n.alternative && n.alternative instanceof G) return e(G, n, {
                    body: e(Ie, n, {
                        operator: "||",
                        left: n.condition,
                        right: n.alternative.body
                    })
                }).transform(t);
                if (n.body instanceof _e && n.alternative instanceof _e && n.body.TYPE == n.alternative.TYPE) return e(n.body.CTOR, n, {
                    value: e(Ue, n, {
                        condition: n.condition,
                        consequent: n.body.value || e(mt, n.body).optimize(t),
                        alternative: n.alternative.value || e(mt, n.alternative).optimize(t)
                    })
                }).transform(t);
                if (n.body instanceof Ae && !n.body.alternative && !n.alternative && (n.condition = e(Ie, n.condition, {
                    operator: "&&",
                    left: n.condition,
                    right: n.body.condition
                }).transform(t), n.body = n.body.body), v(n.body) && n.alternative) {
                    var l = n.alternative;
                    return n.alternative = null, e(J, n, {
                        body: [ n, l ]
                    }).transform(t);
                }
                if (v(n.alternative)) {
                    var p = n.body;
                    return n.body = n.alternative, n.condition = u ? a : n.condition.negate(t), n.alternative = null, 
                    e(J, n, {
                        body: [ n, p ]
                    }).transform(t);
                }
                return n;
            }), n(we, function(n, t) {
                if (0 == n.body.length && t.option("conditionals")) return e(G, n, {
                    body: n.expression
                }).transform(t);
                for (;;) {
                    var r = n.body[n.body.length - 1];
                    if (r) {
                        var i = r.body[r.body.length - 1];
                        if (i instanceof be && u(t.loopcontrol_target(i.label)) === n && r.body.pop(), r instanceof De && 0 == r.body.length) {
                            n.body.pop();
                            continue;
                        }
                    }
                    break;
                }
                var o = n.expression.evaluate(t);
                n: if (2 == o.length) try {
                    if (n.expression = o[0], !t.option("dead_code")) break n;
                    var a = o[1], s = !1, c = !1, f = !1, l = !1, p = !1, d = new P(function(r, i, o) {
                        if (r instanceof fe || r instanceof G) return r;
                        if (r instanceof we && r === n) return r = r.clone(), i(r, this), p ? r : e(J, r, {
                            body: r.body.reduce(function(n, e) {
                                return n.concat(e.body);
                            }, [])
                        }).transform(t);
                        if (r instanceof Ae || r instanceof Ce) {
                            var u = s;
                            return s = !c, i(r, this), s = u, r;
                        }
                        if (r instanceof Z || r instanceof we) {
                            var u = c;
                            return c = !0, i(r, this), c = u, r;
                        }
                        if (r instanceof be && this.loopcontrol_target(r.label) === n) return s ? (p = !0, 
                        r) : c ? r : (l = !0, o ? U.skip : e(Q, r));
                        if (r instanceof Ee && this.parent() === n) {
                            if (l) return U.skip;
                            if (r instanceof Fe) {
                                var d = r.expression.evaluate(t);
                                if (d.length < 2) throw n;
                                return d[1] === a || f ? (f = !0, v(r) && (l = !0), i(r, this), r) : U.skip;
                            }
                            return i(r, this), r;
                        }
                    });
                    d.stack = t.stack.slice(), n = n.transform(d);
                } catch (h) {
                    if (h !== n) throw h;
                }
                return n;
            }), n(Fe, function(n, e) {
                return n.body = s(n.body, e), n;
            }), n(Ce, function(n, e) {
                return n.body = s(n.body, e), n;
            }), Be.DEFMETHOD("remove_initializers", function() {
                this.definitions.forEach(function(n) {
                    n.value = null;
                });
            }), Be.DEFMETHOD("to_assignments", function() {
                var n = this.definitions.reduce(function(n, t) {
                    if (t.value) {
                        var r = e(ut, t.name, t.name);
                        n.push(e(Ve, t, {
                            operator: "=",
                            left: r,
                            right: t.value
                        }));
                    }
                    return n;
                }, []);
                return 0 == n.length ? null : Me.from_array(n);
            }), n(Be, function(n) {
                return 0 == n.definitions.length ? e(Q, n) : n;
            }), n(pe, function(n, e) {
                return n = fe.prototype.optimize.call(n, e), e.option("unused") && n.name && n.name.unreferenced() && (n.name = null), 
                n;
            }), n(Oe, function(n, r) {
                if (r.option("unsafe")) {
                    var i = n.expression;
                    if (i instanceof ut && i.undeclared()) switch (i.name) {
                      case "Array":
                        if (1 != n.args.length) return e(Le, n, {
                            elements: n.args
                        }).transform(r);
                        break;

                      case "Object":
                        if (0 == n.args.length) return e(We, n, {
                            properties: []
                        });
                        break;

                      case "String":
                        if (0 == n.args.length) return e(lt, n, {
                            value: ""
                        });
                        if (n.args.length <= 1) return e(Ie, n, {
                            left: n.args[0],
                            operator: "+",
                            right: e(lt, n, {
                                value: ""
                            })
                        }).transform(r);
                        break;

                      case "Number":
                        if (0 == n.args.length) return e(pt, n, {
                            value: 0
                        });
                        if (1 == n.args.length) return e(je, n, {
                            expression: n.args[0],
                            operator: "+"
                        }).transform(r);

                      case "Boolean":
                        if (0 == n.args.length) return e(At, n);
                        if (1 == n.args.length) return e(je, n, {
                            expression: e(je, null, {
                                expression: n.args[0],
                                operator: "!"
                            }),
                            operator: "!"
                        }).transform(r);
                        break;

                      case "Function":
                        if (b(n.args, function(n) {
                            return n instanceof lt;
                        })) try {
                            var o = "(function(" + n.args.slice(0, -1).map(function(n) {
                                return n.value;
                            }).join(",") + "){" + n.args[n.args.length - 1].value + "})()", a = q(o);
                            a.figure_out_scope({
                                screw_ie8: r.option("screw_ie8")
                            });
                            var u = new I(r.options);
                            a = a.transform(u), a.figure_out_scope({
                                screw_ie8: r.option("screw_ie8")
                            }), a.mangle_names();
                            var s;
                            try {
                                a.walk(new E(function(n) {
                                    if (n instanceof fe) throw s = n, a;
                                }));
                            } catch (c) {
                                if (c !== a) throw c;
                            }
                            var l = s.argnames.map(function(t, r) {
                                return e(lt, n.args[r], {
                                    value: t.print_to_string()
                                });
                            }), o = z();
                            return J.prototype._codegen.call(s, s, o), o = ("" + o).replace(/^\{|\}$/g, ""), 
                            l.push(e(lt, n.args[n.args.length - 1], {
                                value: o
                            })), n.args = l, n;
                        } catch (c) {
                            if (!(c instanceof N)) throw console.log(c), c;
                            r.warn("Error parsing code passed to new Function [{file}:{line},{col}]", n.args[n.args.length - 1].start), 
                            r.warn("" + c);
                        }
                    } else {
                        if (i instanceof He && "toString" == i.property && 0 == n.args.length) return e(Ie, n, {
                            left: e(lt, n, {
                                value: ""
                            }),
                            operator: "+",
                            right: i.expression
                        }).transform(r);
                        if (i instanceof He && i.expression instanceof Le && "join" == i.property) {
                            var p = 0 == n.args.length ? "," : n.args[0].evaluate(r)[1];
                            if (null != p) {
                                var d = i.expression.elements.reduce(function(n, e) {
                                    if (e = e.evaluate(r), 0 == n.length || 1 == e.length) n.push(e); else {
                                        var i = n[n.length - 1];
                                        if (2 == i.length) {
                                            var o = "" + i[1] + p + e[1];
                                            n[n.length - 1] = [ t(r, o, i[0]), o ];
                                        } else n.push(e);
                                    }
                                    return n;
                                }, []);
                                if (0 == d.length) return e(lt, n, {
                                    value: ""
                                });
                                if (1 == d.length) return d[0][0];
                                if ("" == p) {
                                    var h;
                                    return h = d[0][0] instanceof lt || d[1][0] instanceof lt ? d.shift()[0] : e(lt, n, {
                                        value: ""
                                    }), d.reduce(function(n, t) {
                                        return e(Ie, t[0], {
                                            operator: "+",
                                            left: n,
                                            right: t[0]
                                        });
                                    }, h).transform(r);
                                }
                                var _ = n.clone();
                                return _.expression = _.expression.clone(), _.expression.expression = _.expression.expression.clone(), 
                                _.expression.expression.elements = d.map(function(n) {
                                    return n[0];
                                }), f(n, _);
                            }
                        }
                    }
                }
                return r.option("side_effects") && n.expression instanceof pe && 0 == n.args.length && !K.prototype.has_side_effects.call(n.expression, r) ? e(mt, n).transform(r) : r.option("drop_console") && n.expression instanceof Re && n.expression.expression instanceof ut && "console" == n.expression.expression.name && n.expression.expression.undeclared() ? e(mt, n).transform(r) : n.evaluate(r)[0];
            }), n(Ne, function(n, t) {
                if (t.option("unsafe")) {
                    var r = n.expression;
                    if (r instanceof ut && r.undeclared()) switch (r.name) {
                      case "Object":
                      case "RegExp":
                      case "Function":
                      case "Error":
                      case "Array":
                        return e(Oe, n, n).transform(t);
                    }
                }
                return n;
            }), n(Me, function(n, t) {
                if (!t.option("side_effects")) return n;
                if (!n.car.has_side_effects(t)) {
                    var r;
                    if (!(n.cdr instanceof ut && "eval" == n.cdr.name && n.cdr.undeclared() && (r = t.parent()) instanceof Oe && r.expression === n)) return n.cdr;
                }
                if (t.option("cascade")) {
                    if (n.car instanceof Ve && !n.car.left.has_side_effects(t)) {
                        if (n.car.left.equivalent_to(n.cdr)) return n.car;
                        if (n.cdr instanceof Oe && n.cdr.expression.equivalent_to(n.car.left)) return n.cdr.expression = n.car, 
                        n.cdr;
                    }
                    if (!n.car.has_side_effects(t) && !n.cdr.has_side_effects(t) && n.car.equivalent_to(n.cdr)) return n.car;
                }
                return n.cdr instanceof je && "void" == n.cdr.operator && !n.cdr.expression.has_side_effects(t) ? (n.cdr.operator = n.car, 
                n.cdr) : n.cdr instanceof mt ? e(je, n, {
                    operator: "void",
                    expression: n.car
                }) : n;
            }), Pe.DEFMETHOD("lift_sequences", function(n) {
                if (n.option("sequences") && this.expression instanceof Me) {
                    var e = this.expression, t = e.to_array();
                    return this.expression = t.pop(), t.push(this), e = Me.from_array(t).transform(n);
                }
                return this;
            }), n(ze, function(n, e) {
                return n.lift_sequences(e);
            }), n(je, function(n, t) {
                n = n.lift_sequences(t);
                var r = n.expression;
                if (t.option("booleans") && t.in_boolean_context()) {
                    switch (n.operator) {
                      case "!":
                        if (r instanceof je && "!" == r.operator) return r.expression;
                        break;

                      case "typeof":
                        return t.warn("Boolean expression always true [{file}:{line},{col}]", n.start), 
                        e(wt, n);
                    }
                    r instanceof Ie && "!" == n.operator && (n = f(n, r.negate(t)));
                }
                return n.evaluate(t)[0];
            }), Ie.DEFMETHOD("lift_sequences", function(n) {
                if (n.option("sequences")) {
                    if (this.left instanceof Me) {
                        var e = this.left, t = e.to_array();
                        return this.left = t.pop(), t.push(this), e = Me.from_array(t).transform(n);
                    }
                    if (this.right instanceof Me && this instanceof Ve && !A(this.left, n)) {
                        var e = this.right, t = e.to_array();
                        return this.right = t.pop(), t.push(this), e = Me.from_array(t).transform(n);
                    }
                }
                return this;
            });
            var D = g("== === != !== * & | ^");
            n(Ie, function(n, t) {
                var r = t.has_directive("use asm") ? l : function(e, r) {
                    if (r || !n.left.has_side_effects(t) && !n.right.has_side_effects(t)) {
                        e && (n.operator = e);
                        var i = n.left;
                        n.left = n.right, n.right = i;
                    }
                };
                if (D(n.operator) && (n.right instanceof ft && !(n.left instanceof ft) && (n.left instanceof Ie && zt[n.left.operator] >= zt[n.operator] || r(null, !0)), 
                /^[!=]==?$/.test(n.operator))) {
                    if (n.left instanceof ut && n.right instanceof Ue) {
                        if (n.right.consequent instanceof ut && n.right.consequent.definition() === n.left.definition()) {
                            if (/^==/.test(n.operator)) return n.right.condition;
                            if (/^!=/.test(n.operator)) return n.right.condition.negate(t);
                        }
                        if (n.right.alternative instanceof ut && n.right.alternative.definition() === n.left.definition()) {
                            if (/^==/.test(n.operator)) return n.right.condition.negate(t);
                            if (/^!=/.test(n.operator)) return n.right.condition;
                        }
                    }
                    if (n.right instanceof ut && n.left instanceof Ue) {
                        if (n.left.consequent instanceof ut && n.left.consequent.definition() === n.right.definition()) {
                            if (/^==/.test(n.operator)) return n.left.condition;
                            if (/^!=/.test(n.operator)) return n.left.condition.negate(t);
                        }
                        if (n.left.alternative instanceof ut && n.left.alternative.definition() === n.right.definition()) {
                            if (/^==/.test(n.operator)) return n.left.condition.negate(t);
                            if (/^!=/.test(n.operator)) return n.left.condition;
                        }
                    }
                }
                if (n = n.lift_sequences(t), t.option("comparisons")) switch (n.operator) {
                  case "===":
                  case "!==":
                    (n.left.is_string(t) && n.right.is_string(t) || n.left.is_boolean() && n.right.is_boolean()) && (n.operator = n.operator.substr(0, 2));

                  case "==":
                  case "!=":
                    n.left instanceof lt && "undefined" == n.left.value && n.right instanceof je && "typeof" == n.right.operator && t.option("unsafe") && (n.right.expression instanceof ut && n.right.expression.undeclared() || (n.right = n.right.expression, 
                    n.left = e(mt, n.left).optimize(t), 2 == n.operator.length && (n.operator += "=")));
                }
                if (t.option("booleans") && t.in_boolean_context()) switch (n.operator) {
                  case "&&":
                    var i = n.left.evaluate(t), o = n.right.evaluate(t);
                    if (i.length > 1 && !i[1] || o.length > 1 && !o[1]) return t.warn("Boolean && always false [{file}:{line},{col}]", n.start), 
                    e(At, n);
                    if (i.length > 1 && i[1]) return o[0];
                    if (o.length > 1 && o[1]) return i[0];
                    break;

                  case "||":
                    var i = n.left.evaluate(t), o = n.right.evaluate(t);
                    if (i.length > 1 && i[1] || o.length > 1 && o[1]) return t.warn("Boolean || always true [{file}:{line},{col}]", n.start), 
                    e(wt, n);
                    if (i.length > 1 && !i[1]) return o[0];
                    if (o.length > 1 && !o[1]) return i[0];
                    break;

                  case "+":
                    var i = n.left.evaluate(t), o = n.right.evaluate(t);
                    if (i.length > 1 && i[0] instanceof lt && i[1] || o.length > 1 && o[0] instanceof lt && o[1]) return t.warn("+ in boolean context always true [{file}:{line},{col}]", n.start), 
                    e(wt, n);
                }
                if (t.option("comparisons")) {
                    if (!(t.parent() instanceof Ie) || t.parent() instanceof Ve) {
                        var a = e(je, n, {
                            operator: "!",
                            expression: n.negate(t)
                        });
                        n = f(n, a);
                    }
                    switch (n.operator) {
                      case "<":
                        r(">");
                        break;

                      case "<=":
                        r(">=");
                    }
                }
                return "+" == n.operator && n.right instanceof lt && "" === n.right.getValue() && n.left instanceof Ie && "+" == n.left.operator && n.left.is_string(t) ? n.left : (t.option("evaluate") && "+" == n.operator && (n.left instanceof ft && n.right instanceof Ie && "+" == n.right.operator && n.right.left instanceof ft && n.right.is_string(t) && (n = e(Ie, n, {
                    operator: "+",
                    left: e(lt, null, {
                        value: "" + n.left.getValue() + n.right.left.getValue(),
                        start: n.left.start,
                        end: n.right.left.end
                    }),
                    right: n.right.right
                })), n.right instanceof ft && n.left instanceof Ie && "+" == n.left.operator && n.left.right instanceof ft && n.left.is_string(t) && (n = e(Ie, n, {
                    operator: "+",
                    left: n.left.left,
                    right: e(lt, null, {
                        value: "" + n.left.right.getValue() + n.right.getValue(),
                        start: n.left.right.start,
                        end: n.right.end
                    })
                })), n.left instanceof Ie && "+" == n.left.operator && n.left.is_string(t) && n.left.right instanceof ft && n.right instanceof Ie && "+" == n.right.operator && n.right.left instanceof ft && n.right.is_string(t) && (n = e(Ie, n, {
                    operator: "+",
                    left: e(Ie, n.left, {
                        operator: "+",
                        left: n.left.left,
                        right: e(lt, null, {
                            value: "" + n.left.right.getValue() + n.right.left.getValue(),
                            start: n.left.right.start,
                            end: n.right.left.end
                        })
                    }),
                    right: n.right.right
                }))), n.right instanceof Ie && n.right.operator == n.operator && ("*" == n.operator || "&&" == n.operator || "||" == n.operator) ? (n.left = e(Ie, n.left, {
                    operator: n.operator,
                    left: n.left,
                    right: n.right.left
                }), n.right = n.right.right, n.transform(t)) : n.evaluate(t)[0]);
            }), n(ut, function(n, r) {
                if (n.undeclared()) {
                    var i = r.option("global_defs");
                    if (i && i.hasOwnProperty(n.name)) return t(r, i[n.name], n);
                    switch (n.name) {
                      case "undefined":
                        return e(mt, n);

                      case "NaN":
                        return e(vt, n);

                      case "Infinity":
                        return e(bt, n);
                    }
                }
                return n;
            }), n(mt, function(n, t) {
                if (t.option("unsafe")) {
                    var r = t.find_parent(se), i = r.find_variable("undefined");
                    if (i) {
                        var o = e(ut, n, {
                            name: "undefined",
                            scope: r,
                            thedef: i
                        });
                        return o.reference(), o;
                    }
                }
                return n;
            });
            var F = [ "+", "-", "/", "*", "%", ">>", "<<", ">>>", "|", "^", "&" ];
            n(Ve, function(n, e) {
                return n = n.lift_sequences(e), "=" == n.operator && n.left instanceof ut && n.right instanceof Ie && n.right.left instanceof ut && n.right.left.name == n.left.name && o(n.right.operator, F) && (n.operator = n.right.operator + "=", 
                n.right = n.right.right), n;
            }), n(Ue, function(n, t) {
                if (!t.option("conditionals")) return n;
                if (n.condition instanceof Me) {
                    var r = n.condition.car;
                    return n.condition = n.condition.cdr, Me.cons(r, n);
                }
                var i = n.condition.evaluate(t);
                if (i.length > 1) return i[1] ? (t.warn("Condition always true [{file}:{line},{col}]", n.start), 
                n.consequent) : (t.warn("Condition always false [{file}:{line},{col}]", n.start), 
                n.alternative);
                var o = i[0].negate(t);
                f(i[0], o) === o && (n = e(Ue, n, {
                    condition: o,
                    consequent: n.alternative,
                    alternative: n.consequent
                }));
                var a = n.consequent, u = n.alternative;
                if (a instanceof Ve && u instanceof Ve && a.operator == u.operator && a.left.equivalent_to(u.left)) return e(Ve, n, {
                    operator: a.operator,
                    left: a.left,
                    right: e(Ue, n, {
                        condition: n.condition,
                        consequent: a.right,
                        alternative: u.right
                    })
                });
                if (a instanceof Oe && u.TYPE === a.TYPE && a.args.length == u.args.length && a.expression.equivalent_to(u.expression)) {
                    if (0 == a.args.length) return e(Me, n, {
                        car: n.condition,
                        cdr: a
                    });
                    if (1 == a.args.length) return a.args[0] = e(Ue, n, {
                        condition: n.condition,
                        consequent: a.args[0],
                        alternative: u.args[0]
                    }), a;
                }
                return a instanceof Ue && a.alternative.equivalent_to(u) ? e(Ue, n, {
                    condition: e(Ie, n, {
                        left: n.condition,
                        operator: "&&",
                        right: a.condition
                    }),
                    consequent: a.consequent,
                    alternative: u
                }) : n;
            }), n(yt, function(n, t) {
                if (t.option("booleans")) {
                    var r = t.parent();
                    return r instanceof Ie && ("==" == r.operator || "!=" == r.operator) ? (t.warn("Non-strict equality against boolean: {operator} {value} [{file}:{line},{col}]", {
                        operator: r.operator,
                        value: n.value,
                        file: r.start.file,
                        line: r.start.line,
                        col: r.start.col
                    }), e(pt, n, {
                        value: +n.value
                    })) : e(je, n, {
                        operator: "!",
                        expression: e(pt, n, {
                            value: 1 - n.value
                        })
                    });
                }
                return n;
            }), n(qe, function(n, t) {
                var r = n.property;
                if (r instanceof lt && t.option("properties")) {
                    if (r = r.getValue(), Ft(r) ? t.option("screw_ie8") : $(r)) return e(He, n, {
                        expression: n.expression,
                        property: r
                    });
                    var i = parseFloat(r);
                    isNaN(i) || "" + i != r || (n.property = e(pt, n.property, {
                        value: i
                    }));
                }
                return n;
            }), n(Le, w), n(We, w), n(dt, w);
        }(), n.array_to_hash = t, n.slice = r, n.characters = i, n.member = o, n.find_if = a, 
        n.repeat_string = u, n.DefaultsError = s, n.defaults = c, n.merge = f, n.noop = l, 
        n.MAP = U, n.push_uniq = p, n.string_template = d, n.remove = h, n.mergeSort = _, 
        n.set_difference = v, n.set_intersection = m, n.makePredicate = g, n.all = b, n.Dictionary = y, 
        n.DEFNODE = A, n.AST_Token = V, n.AST_Node = L, n.AST_Statement = W, n.AST_Debugger = Y, 
        n.AST_Directive = X, n.AST_SimpleStatement = G, n.walk_body = w, n.AST_Block = K, 
        n.AST_BlockStatement = J, n.AST_EmptyStatement = Q, n.AST_StatementWithBody = Z, 
        n.AST_LabeledStatement = ne, n.AST_IterationStatement = ee, n.AST_DWLoop = te, n.AST_Do = re, 
        n.AST_While = ie, n.AST_For = oe, n.AST_ForIn = ae, n.AST_With = ue, n.AST_Scope = se, 
        n.AST_Toplevel = ce, n.AST_Lambda = fe, n.AST_Accessor = le, n.AST_Function = pe, 
        n.AST_Defun = de, n.AST_Jump = he, n.AST_Exit = _e, n.AST_Return = ve, n.AST_Throw = me, 
        n.AST_LoopControl = ge, n.AST_Break = be, n.AST_Continue = ye, n.AST_If = Ae, n.AST_Switch = we, 
        n.AST_SwitchBranch = Ee, n.AST_Default = De, n.AST_Case = Fe, n.AST_Try = Ce, n.AST_Catch = Se, 
        n.AST_Finally = ke, n.AST_Definitions = Be, n.AST_Var = xe, n.AST_Const = Te, n.AST_VarDef = $e, 
        n.AST_Call = Oe, n.AST_New = Ne, n.AST_Seq = Me, n.AST_PropAccess = Re, n.AST_Dot = He, 
        n.AST_Sub = qe, n.AST_Unary = Pe, n.AST_UnaryPrefix = je, n.AST_UnaryPostfix = ze, 
        n.AST_Binary = Ie, n.AST_Conditional = Ue, n.AST_Assign = Ve, n.AST_Array = Le, 
        n.AST_Object = We, n.AST_ObjectProperty = Ye, n.AST_ObjectKeyVal = Xe, n.AST_ObjectSetter = Ge, 
        n.AST_ObjectGetter = Ke, n.AST_Symbol = Je, n.AST_SymbolAccessor = Qe, n.AST_SymbolDeclaration = Ze, 
        n.AST_SymbolVar = nt, n.AST_SymbolConst = et, n.AST_SymbolFunarg = tt, n.AST_SymbolDefun = rt, 
        n.AST_SymbolLambda = it, n.AST_SymbolCatch = ot, n.AST_Label = at, n.AST_SymbolRef = ut, 
        n.AST_LabelRef = st, n.AST_This = ct, n.AST_Constant = ft, n.AST_String = lt, n.AST_Number = pt, 
        n.AST_RegExp = dt, n.AST_Atom = ht, n.AST_Null = _t, n.AST_NaN = vt, n.AST_Undefined = mt, 
        n.AST_Hole = gt, n.AST_Infinity = bt, n.AST_Boolean = yt, n.AST_False = At, n.AST_True = wt, 
        n.TreeWalker = E, n.KEYWORDS = Et, n.KEYWORDS_ATOM = Dt, n.RESERVED_WORDS = Ft, 
        n.KEYWORDS_BEFORE_EXPRESSION = Ct, n.OPERATOR_CHARS = St, n.RE_HEX_NUMBER = kt, 
        n.RE_OCT_NUMBER = Bt, n.RE_DEC_NUMBER = xt, n.OPERATORS = Tt, n.WHITESPACE_CHARS = $t, 
        n.PUNC_BEFORE_EXPRESSION = Ot, n.PUNC_CHARS = Nt, n.REGEXP_MODIFIERS = Mt, n.UNICODE = Rt, 
        n.is_letter = D, n.is_digit = F, n.is_alphanumeric_char = C, n.is_unicode_combining_mark = S, 
        n.is_unicode_connector_punctuation = k, n.is_identifier = B, n.is_identifier_start = x, 
        n.is_identifier_char = T, n.is_identifier_string = $, n.parse_js_number = O, n.JS_Parse_Error = N, 
        n.js_error = M, n.is_token = R, n.EX_EOF = Ht, n.tokenizer = H, n.UNARY_PREFIX = qt, 
        n.UNARY_POSTFIX = Pt, n.ASSIGNMENT = jt, n.PRECEDENCE = zt, n.STATEMENTS_WITH_LABELS = It, 
        n.ATOMIC_START_TOKEN = Ut, n.parse = q, n.TreeTransformer = P, n.SymbolDef = j, 
        n.base54 = Vt, n.OutputStream = z, n.Compressor = I;
    }({}, function() {
        return this;
    }());
    var define, kmdjs = {}, initializing = !1, fnTest = /xyz/.test(function() {}) ? /\b_super\b/ : /.*/, __class = function() {};
    __class.extend = function(prop) {
        function __class() {
            !initializing && this.init && this.init.apply(this, arguments);
        }
        var _super = this.prototype;
        initializing = !0;
        var prototype = new this();
        initializing = !1;
        for (var name in prop) "statics" != name && (prototype[name] = "function" == typeof prop[name] && "function" == typeof _super[name] && fnTest.test(prop[name]) ? function(name, fn) {
            return function() {
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
    var DepTree = __class.extend({
        init: function(n) {
            function i(n, t) {
                this.update(n - (this.dx || 0), t - (this.dy || 0)), this.dx = n, this.dy = t;
            }
            function r() {
                this.dx = this.dy = 0;
            }
            function u(n, u, f, e, o, s, h, c) {
                var l = [ [ "M", n, u ], [ "L", f, e ] ], a = t.set(t.path(l).attr({
                    stroke: o || Raphael.getColor(),
                    "stroke-width": c
                }), t.circle(f, e, s).attr({
                    fill: h,
                    stroke: "none"
                }), t.circle(n, u, s / 2).attr({
                    fill: h,
                    stroke: "none"
                }));
                a[1].update = function(n, t) {
                    var i = this.attr("cx") + n, r = this.attr("cy") + t;
                    this.attr({
                        cx: i,
                        cy: r
                    }), l[1][1] = i, l[1][2] = r, a[0].attr({
                        path: l
                    });
                }, a[2].update = function(n, t) {
                    var i = this.attr("cx") + n, r = this.attr("cy") + t;
                    this.attr({
                        cx: i,
                        cy: r
                    }), l[0][1] = i, l[0][2] = r, a[0].attr({
                        path: l
                    });
                }, a[1].drag(i, r), a[2].drag(i, r), a.toBack();
            }
            function e(n, t) {
                return n + Math.floor(Math.random() * (t - n + 1));
            }
            function o(n) {
                function et(n, t, i) {
                    for (var v, y, l, r, f, u, s, a, w, p, e = [], h = [], c = 0, o = n.length; o > c; c++) {
                        for (r = n[c], f = !1, u = 0, s = t.length; s > u; u++) g(t[u].name, r.deps) && (f = !0);
                        f ? e.push(r) : h.push(r);
                    }
                    for (v = [], y = [], l = 0, o = e.length; o > l; l++) {
                        for (r = e[l], f = !1, u = 0, s = e.length; s > u; u++) g(e[u].name, r.deps) && (f = !0);
                        for (a = 0, w = h.length; w > a; a++) g(h[a].name, r.deps) && (f = !0);
                        f ? v.push(r) : (r.level = i, y.push(r));
                    }
                    return p = h.concat(v), p.length > 0 ? et(p, y, ++i) : i;
                }
                function ct(t) {
                    for (var i = 0, r = n.length; r > i; i++) if (n[i].name == t) return !0;
                    return !1;
                }
                function g(n, t) {
                    for (var i = 0, r = t.length; r > i; i++) if (t[i] == n) return !0;
                    return !1;
                }
                for (var a, w, b, r, c, s, ft, l, y, ot, o, i, h = n.length, nt = t.width, p = t.height, st = {
                    x: nt / 2,
                    y: p / 2
                }, v = (e(0, 360), st.x - 150, 0); v < n.length; v++) if (i = n[v], i.deps && i.deps.length > 0) for (a = 0; a < i.deps.length; a++) if (!ct(i.deps[a])) throw i.deps[a] + " is not defined ";
                for (w = [], b = [], r = 0; h > r; r++) i = n[r], i.deps && 0 != i.deps.length ? b.push(i) : (i.level = 0, 
                w.push(i));
                var tt = et(b, w, 1), it = p / (tt + 1), k = p - it / 2 + 20;
                for (r = 0; tt + 1 > r; r++) {
                    for (c = [], s = 0, h = n.length; h > s; s++) n[s].level == r && c.push(n[s]);
                    var rt = 30, ht = 2 * rt, ut = (nt - ht) / c.length, d = rt + ut / 2;
                    for (o = 0, ft = c.length; ft > o; o++) f(c[o].name, d, k), c[o].x = d, c[o].y = k, 
                    d += ut;
                    k -= it;
                }
                for (r = 0; h > r; r++) if (l = n[r], y = l.deps) for (s = 0, dLen = y.length; dLen > s; s++) for (ot = y[s], 
                o = 0; h > o; o++) i = n[o], ot === i.name && (l.level - i.level > 1 ? u(l.x, l.y, i.x, i.y, "#8A8FD1", 10, "#8A8FD1", 2) : u(l.x, l.y, i.x, i.y, "#4D507E", 10, "#4D507E", 4));
            }
            var f, t = Raphael(n.renderTo, n.width, n.height);
            t.rect(0, 0, 819, 579, 10).attr({
                stroke: "#666"
            }), t.text(410, 20, "Dependence  Visualization for KMD.js").attr({
                fill: "#fff",
                "font-size": 20
            }), f = function(n, u, f) {
                var e = t.set(t.rect(u, f, 120, 20, 10).attr({
                    fill: "#D2DEEE"
                }), t.text(u, f, n).attr({
                    fill: "black",
                    "font-size": 20
                })), o = e[1].node.getBBox(), s = (o.widht, o.height, o.width / 2 + 5), h = o.height / 2 + 5;
                e[0].attr({
                    x: u - s,
                    y: f - h,
                    width: o.width + 10,
                    height: o.height + 10
                }), e[0].update = function(n, t) {
                    var i = this.attr("x") + n, r = this.attr("y") + t;
                    this.attr({
                        x: i,
                        y: r
                    }), e[1].attr({
                        x: i + s,
                        y: r + h
                    });
                }, e[1].update = function(n, t) {
                    var i = this.attr("x") + n, r = this.attr("y") + t;
                    this.attr({
                        x: i,
                        y: r
                    }), e[0].attr({
                        x: i - s,
                        y: r - h
                    });
                }, e.drag(i, r);
            }, o(n.data);
        }
    }), doc = document, data = {}, head = doc.head || doc.getElementsByTagName("head")[0] || doc.documentElement, baseElement = head.getElementsByTagName("base")[0], currentlyAddingScript, interactiveScript, isView = !1, isDebug = !1, isBuild = !1, modules = {}, classList = [], baseUrl = getBaseUrl(), mapping = {}, cBaseUrl, nsmp = {}, dataMain, isBrowser = !("undefined" == typeof window || "undefined" == typeof navigator || !window.document), ProjName, pendingModules = [], kmdmdinfo = [], lazyMdArr = [], isMDBuild = !1, checkModules = {}, allPending = [], isObject = isType("Object"), isString = isType("String"), isArray = Array.isArray || isType("Array"), isFunction = isType("Function"), isBoolean = isType("Boolean");
    define = function(name, deps, foctory) {
        var argc = arguments.length;
        if (1 == argc) throw "the class must take a name";
        2 == argc ? (foctory = deps, deps = []) : isString(deps) && (deps = [ deps ]);
        var mda = name.split(":"), fullname = mda[0], lastIndex = lastIndexOf(fullname, ".");
        -1 == lastIndex && (fullname = ProjName + "." + fullname, lastIndex = lastIndexOf(fullname, ".")), 
        mda.length > 1 && -1 == lastIndexOf(mda[1], ".") && (mda[1] = ProjName + "." + mda[1]);
        var baseClass = 1 == mda.length ? "__class" : ' __modules["' + mda[1] + '"]', className = fullname.substring(lastIndex + 1, fullname.length);
        deps.unshift(fullname.substring(0, lastIndex)), isInArray(deps, ProjName) || deps.unshift(ProjName), 
        refrence(className, deps, "var " + className + "=" + baseClass + ".extend(" + stringifyWithFuncs(foctory) + ");return " + className + ";", fullname);
    };
    var currentPendingModuleFullName = [];
    define.build = function() {
        isBuild = !0, define.apply(null, arguments);
    }, define.view = function() {
        isView = !0, define.apply(null, arguments);
    }, kmdjs.get = function(fullname, callback) {
        isString(fullname) && (fullname = [ fullname ]);
        for (var i = 0, len = fullname.length; len > i; i++) -1 == lastIndexOf(fullname[i], ".") && (fullname[i] = ProjName + "." + fullname[i]);
        currentPendingModuleFullName = fullname;
        for (var loaded = !0, mdArr = [], i = 0, len = fullname.length; len > i; i++) modules[fullname[i]] ? mdArr.push(modules[fullname[i]]) : loaded = !1;
        if (loaded) callback && callback.apply(null, mdArr); else for (var i = 0, len = fullname.length; len > i; i++) if (!modules[fullname[i]]) {
            var ns = fullname[i];
            allPending.push(ns), function(ns) {
                request(mapping[ns], function() {
                    callback && (define.pendingCallback = callback), remove(allPending, ns), currentPendingModuleFullName.length > 0 ? checkModuleCpt() : checkMainCpt();
                });
            }(ns);
        }
    };
    var kmdmaincpt = !1;
    define.pendingModules = pendingModules, kmdjs.build = function(fullname) {
        currentPendingModuleFullName = [ fullname ], isMDBuild = !0, allPending.push(fullname), 
        request(mapping[fullname], function() {
            remove(allPending, fullname), currentPendingModuleFullName.length > 0 ? checkModuleCpt() : checkMainCpt();
        });
    }, String.prototype.trim || (String.prototype.trim = function() {
        return this.replace(/^\s+|\s+$/g, "");
    }), allPending.push("Main"), request(dataMain + ".js", function() {
        remove(allPending, "Main"), currentPendingModuleFullName.length > 0 ? checkModuleCpt() : checkMainCpt();
    }), kmdjs.config = function(option) {
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