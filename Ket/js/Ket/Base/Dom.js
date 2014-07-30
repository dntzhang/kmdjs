define("Ket.Base.Dom", ["Ket.Util"], {
    statics: {
        ctor: function () {

            var w = (this.win) ? (this.win.contentWindow) : this.win || window;
            this.win = w;
            this.doc = w.document;
            this._getDoc = null;
        },
        setWin:function(iframeElement){
            this.win = iframeElement;
            this.init();
        },
        getWin : function(element) {
            var doc = this.getDoc(element);
            return (element.document) ? element : doc["defaultView"] ||
                doc["parentWindow"] || this.win;
        },
        getDoc: function (element) {
          
            if (element) {
                element = element || window.document;
                this._getDoc=(element["nodeType"] === 9) ? element : element["ownerDocument"]
                    || this.doc;
                return this._getDoc;
            } else {
                if (this._getDoc) {
                    return this._getDoc;
                } else {
                    element = element || window.document;
                    this._getDoc=(element["nodeType"] === 9) ? element : element["ownerDocument"]
                        || this.doc;
                    return this._getDoc;
                }
            }

        },
        id: function (id, doc) {
            return this.getDoc(doc).getElementById(id);
        },
        name: function (name, doc) {
            var el = doc;
            return this.getDoc(doc).getElementsByName(name);
        },
        tagName: function (tagName, el) {
            var el = el || this.getDoc();
            return el.getElementsByTagName(tagName);
        },
        getText: function (element) {
            //var text = element ? element[TEXT_CONTENT] : '';
            //if (text === UNDEFINED && INNER_TEXT in element) {
            //    text = element[INNER_TEXT];
            //}
            //return text || '';
        },
        getAttributeByParent: function (attribute, startNode, topNode) {
            var jumpOut = false;
            var el = startNode;
            var result;
            do {
                result = el.getAttribute(attribute);
                // 如果本次循环未找到result
                if (Base.isUndefined(result) || Base.isNull(result)) {
                    // 如果本次循环已经到了监听的dom
                    if (el === topNode) {
                        jumpOut = true;
                    }
                        // 如果本次循环还未到监听的dom，则继续向上查找
                    else {
                        el = el.parentNode;
                    }
                }
                    // 如果找到了result
                else {
                    jumpOut = true;
                }
            }
            while (!jumpOut);

            return result;
        },
        node: function (type, attrObj, win) {
            var p,
                w = win || this.win,
                d = document,
                n = d.createElement(type);
            var mapObj = {
                "class": function () {
                    n.className = attrObj["class"];
                },
                "style": function () {
                    this.setCssText(n, attrObj["style"]);
                }
            }
            for (p in attrObj) {
                if (mapObj[p]) {
                    mapObj[p]();
                } else {
                    n.setAttribute(p, attrObj[p]);
                }
            }

            return n;
        },
        setClass: function (el, className) {
            el.className = className;
        },
        getClass: function (el) {
            return el.className;
        },
        hasClass: function (el, className) {
            if (!el || !className) {
                return false;
            }
            return el.classList.contains(className);
        },
        addClass: function (el, className) {
            if (!el || !className || this.hasClass(el, className)) {
                return;
            }
            el.classList.add(className);
        },
        removeClass: function (el, className) {
            if (!el || !className || !this.hasClass(el, className)) {
                return;
            }
            el.classList.remove(className);
        },
        toggleClass: function (el, className) {
            if (!el || !className) {
                return;
            }
            el.classList.toggle(className);
        },
        replaceClass: function (el, oldClassName, newClassName) {
            this.removeClass(el, oldClassName);
            this.addClass(el, newClassName);
            //el.className = (" "+el.className+" ").replace(" "+oldClassName+" "," "+newClassName+" ");
        },
        createStyleNode: function (styles, id) {
            var styleNode = this.node('style', {
                'id': id || '',
                'type': 'text/css'
            });

            this.getDocHead().appendChild(styleNode);

            var stylesType = typeof (styles);
            //参数是文本
            if (stylesType == "string") {
                //IE
                if (styleNode.styleSheet) {
                    styleNode.styleSheet.cssText = styles;
                } else {
                    var tn = document.createTextNode(styles);
                    styleNode.appendChild(tn);
                }
                //参数是对象
            } else if (stylesType == "object") {
                var i = 0,
                    styleSheet = document.styleSheets[document.styleSheets.length - 1];
                for (var selector in styles) {
                    if (styleSheet.insertRule) {
                        var rule = selector + "{" + styles[selector] + "}";
                        styleSheet.insertRule(rule, i++);
                    } else {
                        //IE
                        styleSheet.addRule(selector, styles[selector], i++);
                    }
                }
            }

            return styleNode;
        },
        setStyle: function (el, styleName, value) {
            if (!el) {
                return;
            }

            var name = Browser.getName();
            if (styleName === "float" || styleName === "cssFloat") {
                if (name === "ie") {
                    styleName = "styleFloat";
                } else {
                    styleName = "cssFloat";
                }
            }

            //J.out(styleName);

            if (styleName === "opacity" && name === "ie" && Browser.getIEVersion() < 9) {
                var opacity = value * 100;


                el.style.filter = 'alpha(opacity="' + opacity + '")';

                if (!el.style.zoom) {
                    el.style.zoom = 1;
                }

                return;
            }
            el.style[styleName] = value;
            return Dom;
        },
        getStyle: function (el, styleName) {
            if (!el) {
                return;
            }

            var win = this.getWin(el);
            var name = Browser.getName();
            //J.out(name);
            if (styleName === "float" || styleName === "cssFloat") {
                if (name === "ie") {
                    styleName = "styleFloat";
                } else {
                    styleName = "cssFloat";
                }
            }
            if (styleName === "opacity" && name === "ie" && Browser.getIEVersion() < 9) {
                var opacity = 1,
                    result = el.style.filter.match(/opacity=(\d+)/);
                if (result && result[1]) {
                    opacity = result[1] / 100;
                }
                return opacity;
            }

            if (el.style[styleName]) {
                return el.style[styleName];
            } else if (el.currentStyle) {
                //alert(el.currentStyle[styleName]);
                return el.currentStyle[styleName];
            } else if (win.getComputedStyle) {
                //J.out(win.getComputedStyle(el, null));
                return win.getComputedStyle(el, null)[styleName];
            } else if (document.defaultView && document.defaultView.getComputedStyle) {
                styleName = styleName.replace(/([/A-Z])/g, "-$1");
                styleName = styleName.toLowerCase();
                var style = document.defaultView.getComputedStyle(el, "");
                return style && style.getPropertyValue(styleName);
            }

        },
        setCssText: function (el, cssText) {
            el.style.cssText = cssText;
        },
        getCssText: function (el) {
            return el.style.cssText;
        },
        addCssText: function (el, cssText) {
            el.style.cssText += ';' + cssText;
        },
        show: function (el, displayStyle) {
            var display;
            var _oldDisplay = el.getAttribute("_oldDisplay");

            if (_oldDisplay) {
                display = _oldDisplay;
            } else {
                display = this.getStyle(el, "display");
            }

            if (displayStyle) {
                this.setStyle(el, "display", displayStyle);
            } else {
                if (display === "none") {
                    this.setStyle(el, "display", "block");
                } else {
                    this.setStyle(el, "display", display);
                }
            }
        },
        isShow: function (el) {
            var display = this.getStyle(el, "display");
            if (display === "none") {
                return false;
            } else {
                return true;
            }
        },
        recover: function (el) {
            var display;
            var _oldDisplay = el.getAttribute("_oldDisplay");

            if (_oldDisplay) {
                display = _oldDisplay;
            } else {
                display = this.getStyle(el, "display");
            }
            if (display === "none") {
                this.setStyle(el, "display", "");
            } else {
                this.setStyle(el, "display", display);
            }
        },
        hide: function (el) {
            var display = this.getStyle(el, "display");
            var _oldDisplay = el.getAttribute("_oldDisplay");

            if (!_oldDisplay) {
                if (display === "none") {
                    el.setAttribute("_oldDisplay", "");
                } else {
                    el.setAttribute("_oldDisplay", display);
                }
            }
            this.setStyle(el, "display", "none");
        },
        getScrollLeft: function (el) {
            var scrollLeft;
            if (el) {
                scrollLeft = el.scrollLeft;
            } else {
                scrollLeft = Math.max(document.documentElement.scrollLeft, document.body.scrollLeft);
            }
            return scrollLeft || 0;
        },
        getScrollTop: function (el) {
            var scrollTop;
            if (el) {
                scrollTop = el.scrollTop;
            } else {
                scrollTop = Math.max(document.documentElement.scrollTop, document.body.scrollTop);
            }
            return scrollTop || 0;
        },
        getScrollHeight: function (el) {
            var scrollHeight;
            if (el) {
                scrollHeight = el.scrollHeight;
            } else {
                scrollHeight = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
            }
            return scrollHeight || 0;
        },
        getScrollWidth: function (el) {
            var scrollWidth;
            if (el) {
                scrollWidth = el.scrollWidth;
            } else {
                scrollWidth = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth);
            }
            return scrollWidth || 0;
        },
        getClientHeight: function (el) {
            //var name = J.browser.engine.name;
            el = el || this.getDocumentElement();
            // IE, Gecko
            return el.clientHeight;
        },
        getClientWidth: function (el) {
            //var name = J.browser.engine.name;
            el = el || this.getDocumentElement();
            // IE, Gecko
            return el.clientWidth;
        },
        getOffsetHeight: function (el) {
            //var name = J.browser.engine.name;
            el = el || this.getDocumentElement();
            return el.offsetHeight;
        },
        getOffsetWidth: function (el) {
            //var name = J.browser.engine.name;
            el = el || this.getDocumentElement();
            return el.offsetWidth;
        },
        getClientXY: function (el) {
            var _t = 0,
                _l = 0;

            if (el) {
                //这里只检查document不够严谨, 在el被侵染置换(jQuery做了这么恶心的事情)
                //的情况下, el.getBoundingClientRect() 调用回挂掉
                // 顶IE的这个属性，获取对象到可视范围的距离。
                if (document.documentElement.getBoundingClientRect && el.getBoundingClientRect) {
                    //现在firefox3，chrome2，opera9.63都支持这个属性。
                    var box = { left: 0, top: 0, right: 0, bottom: 0 };
                    try {
                        box = el.getBoundingClientRect();
                    } catch (ex) {
                        return [0, 0];
                    }
                    var oDoc = el.ownerDocument;
                    //修正ie和firefox之间的2像素差异
                    var _fix = Browser.getIEVersion() ? 2 : 0;

                    _t = box.top - _fix + this.getScrollTop(oDoc);
                    _l = box.left - _fix + this.getScrollLeft(oDoc);
                } else {
                    //这里只有safari执行。
                    while (el.offsetParent) {
                        _t += el.offsetTop;
                        _l += el.offsetLeft;
                        el = el.offsetParent;
                    }
                }
            }
            return [_l, _t];
        },
        setClientXY: function (el, x, y) {
            x = parseInt(x) + this.getScrollLeft();
            y = parseInt(y) + this.getScrollTop();
            this.setXY(el, x, y);
        },
        getXY: function (el) {
            var xy = this.getClientXY(el);

            xy[0] = xy[0] + this.getScrollLeft();
            xy[1] = xy[1] + this.getScrollTop();
            return xy;
        },
        setXY: function (el, x, y) {
            var _ml = parseInt(this.getStyle(el, "marginLeft")) || 0;
            var _mt = parseInt(this.getStyle(el, "marginTop")) || 0;

            this.setStyle(el, "left", parseInt(x) - _ml + "px");
            this.setStyle(el, "top", parseInt(y) - _mt + "px");
        },
        getRelativeXY: function (el, relativeEl) {
            var xyEl = this.getXY(el);
            var xyRelativeEl = this.getXY(relativeEl);
            var xy = [];

            xy[0] = xyEl[0] - xyRelativeEl[0];
            xy[1] = xyEl[1] - xyRelativeEl[1];
            return xy;
        },
        getPosX: function (el) {
            return parseCssPx(this.getStyle(el, 'left'));
        },
        getPosY: function (el) {
            return parseCssPx(this.getStyle(el, 'top'));
        },
        getWidth: function (el) {
            return parseCssPx(this.getStyle(el, 'width'));
        },
        getHeight: function (el) {
            return parseCssPx(this.getStyle(el, 'height'));
        },
        getSelectionText: function (win) {
            win = win || window;
            var doc = win.document;
            if (win.getSelection) {
                // This technique is the most likely to be standardized.
                // this.getSelection() returns a Selection object, which we do not document.
                return win.getSelection().toString();
            } else if (doc.getSelection) {
                // This is an older, simpler technique that returns a string
                return doc.getSelection();
            } else if (doc.selection) {
                // This is the IE-specific technique.
                // We do not document the IE selection property or TextRange objects.
                return doc.selection.createRange().text;
            }

        },
        getTextFieldSelection: function (el) {
            if (el.selectionStart != undefined && el.selectionEnd != undefined) {
                var start = el.selectionStart;
                var end = el.selectionEnd;
                return el.value.substring(start, end);
            } else {
                // Not supported on this browser
                return "";
            }

        },
        getDocumentElement: function () {
            if (DocumentElement) {
                return DocumentElement;
            }
            if (document.compatMode === 'CSS1Compat') {
                DocumentElement = document.documentElement;
            } else {
                DocumentElement = document.body;
            }
            return DocumentElement;

        },
        getDocHead: function () {
            if (!HeadElement) {
                var doc = this.getDoc();
                HeadElement = doc.getElementsByTagName('head') ? doc.getElementsByTagName('head')[0] : doc.documentElement;
            }
            return HeadElement;
        },
        contains: function (parent, child, containSelf) {
            if (!containSelf && parent === child) {
                return false;
            }
            if (parent.compareDocumentPosition) {
                //w3c
                var res = parent.compareDocumentPosition(child);
                if (res == 20 || res == 0) {
                    return true;
                }
            } else {
                //ie
                if (parent.contains(child)) {
                    return true;
                }
            }
            return false;
        },
        getHref: function (el) {
            var result;
            if (Browser.getIEVersion() && Browser.getIEVersion() <= 7) {
                result = el.getAttribute('href', 4);
            } else {
                result = el.href;
            }
            return result || null;
        },

        mini: function () {
            var snack = /(?:[\w\-\\.#]+)+(?:\[\w+?=([\'"])?(?:\\\1|.)+?\1\])?|\*|>/ig,
          exprClassName = /^(?:[\w\-_]+)?\.([\w\-_]+)/,
          exprId = /^(?:[\w\-_]+)?#([\w\-_]+)/,
          exprNodeName = /^([\w\*\-_]+)/,
          na = [null, null];

            function _find(selector, context) {

                /**
                 * This is what you call via x()
                 * Starts everything off...
                 */

                context = context || document;

                var simple = /^[\w\-_#]+$/.test(selector);

                if (!simple && context.querySelectorAll) {
                    return realArray(context.querySelectorAll(selector));
                }

                if (selector.indexOf(',') > -1) {
                    var split = selector.split(/,/g), ret = [], sIndex = 0, len = split.length;
                    for (; sIndex < len; ++sIndex) {
                        ret = ret.concat(_find(split[sIndex], context));
                    }
                    return unique(ret);
                }

                var parts = selector.match(snack),
                    part = parts.pop(),
                    id = (part.match(exprId) || na)[1],
                    className = !id && (part.match(exprClassName) || na)[1],
                    nodeName = !id && (part.match(exprNodeName) || na)[1],
                    collection;

                if (className && !nodeName && context.getElementsByClassName) {

                    collection = realArray(context.getElementsByClassName(className));

                } else {

                    collection = !id && realArray(context.getElementsByTagName(nodeName || '*'));

                    if (className) {
                        collection = filterByAttr(collection, 'className', RegExp('(^|\\s)' + className + '(\\s|$)'));
                    }

                    if (id) {
                        var byId = context.getElementById(id);
                        return byId ? [byId] : [];
                    }
                }

                return parts[0] && collection[0] ? filterParents(parts, collection) : collection;

            }

            function realArray(c) {

                /**
                 * Transforms a node collection into
                 * a real array
                 */

                try {
                    return Array.prototype.slice.call(c);
                } catch (e) {
                    var ret = [], i = 0, len = c.length;
                    for (; i < len; ++i) {
                        ret[i] = c[i];
                    }
                    return ret;
                }

            }

            function filterParents(selectorParts, collection, direct) {

                /**
                 * This is where the magic happens.
                 * Parents are stepped through (upwards) to
                 * see if they comply with the selector.
                 */

                var parentSelector = selectorParts.pop();

                if (parentSelector === '>') {
                    return filterParents(selectorParts, collection, true);
                }

                var ret = [],
                    r = -1,
                    id = (parentSelector.match(exprId) || na)[1],
                    className = !id && (parentSelector.match(exprClassName) || na)[1],
                    nodeName = !id && (parentSelector.match(exprNodeName) || na)[1],
                    cIndex = -1,
                    node, parent,
                    matches;

                nodeName = nodeName && nodeName.toLowerCase();

                while ((node = collection[++cIndex])) {

                    parent = node.parentNode;

                    do {

                        matches = !nodeName || nodeName === '*' || nodeName === parent.nodeName.toLowerCase();
                        matches = matches && (!id || parent.id === id);
                        matches = matches && (!className || RegExp('(^|\\s)' + className + '(\\s|$)').test(parent.className));

                        if (direct || matches) { break; }

                    } while ((parent = parent.parentNode));

                    if (matches) {
                        ret[++r] = node;
                    }
                }

                return selectorParts[0] && ret[0] ? filterParents(selectorParts, ret) : ret;

            }


            var unique = (function () {

                var uid = +new Date();

                var data = (function () {

                    var n = 1;

                    return function (elem) {

                        var cacheIndex = elem[uid],
                            nextCacheIndex = n++;

                        if (!cacheIndex) {
                            elem[uid] = nextCacheIndex;
                            return true;
                        }

                        return false;

                    };

                })();

                return function (arr) {

                    /**
                     * Returns a unique array
                     */

                    var length = arr.length,
                        ret = [],
                        r = -1,
                        i = 0,
                        item;

                    for (; i < length; ++i) {
                        item = arr[i];
                        if (data(item)) {
                            ret[++r] = item;
                        }
                    }

                    uid += 1;

                    return ret;

                };

            })();

            function filterByAttr(collection, attr, regex) {

                /**
                 * Filters a collection by an attribute.
                 */

                var i = -1, node, r = -1, ret = [];

                while ((node = collection[++i])) {
                    if (regex.test(node[attr])) {
                        ret[++r] = node;
                    }
                }

                return ret;
            }

            return _find;
        },
        query: function (selector, context) {
            return this.mini()(selector, context);
        }
    }
})