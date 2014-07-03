/* Dependence  Visualization for KMD.js
 * By 当耐特 http://weibo.com/iamleizhang
 * KMD.js http://kmdjs.github.io/
 * blog: http://www.cnblogs.com/iamzhanglei/
 * My website:http://htmlcssjs.duapp.com/
 * thanks to http://raphaeljs.com/
 * MIT Licensed.
 */
define("MyAapp.DepTree", function () {
    return function (s) {
        /**
         * @param {number} dt
         * @param {number} dy
         * @return {undefined}
         */
        function render(dt, dy) {
            this.update(dt - (this.dx || 0), dy - (this.dy || 0));
            /** @type {number} */
            this.dx = dt;
            /** @type {number} */
            this.dy = dy;
        }
        /**
         * @return {undefined}
         */
        function position() {
            /** @type {number} */
            this.dx = this.dy = 0;
        }
        /**
         * @param {?} x
         * @param {?} y
         * @param {?} ctx
         * @param {?} Y
         * @param {string} dataTable
         * @param {number} width
         * @param {Object} color
         * @param {number} opt_attributes
         * @return {undefined}
         */
        function draw(x, y, ctx, Y, dataTable, width, color, opt_attributes) {
            /** @type {Array} */
            var arrowPath = [["M", x, y], ["L", ctx, Y]];
            var instance = paper.set(paper.path(arrowPath).attr({
                stroke: dataTable || Raphael.getColor(),
                "stroke-width": opt_attributes
            }), paper.circle(ctx, Y, width).attr({
                fill: color,
                stroke: "none"
            }), paper.circle(x, y, width / 2).attr({
                fill: color,
                stroke: "none"
            }));
            /**
             * @param {number} x
             * @param {number} y
             * @return {undefined}
             */
            instance[1].update = function (x, y) {
                var cx = this.attr("cx") + x;
                var cy = this.attr("cy") + y;
                this.attr({
                    cx: cx,
                    cy: cy
                });
                arrowPath[1][1] = cx;
                arrowPath[1][2] = cy;
                instance[0].attr({
                    path: arrowPath
                });
            };
            /**
             * @param {number} x
             * @param {number} y
             * @return {undefined}
             */
            instance[2].update = function (x, y) {
                var cx = this.attr("cx") + x;
                var cy = this.attr("cy") + y;
                this.attr({
                    cx: cx,
                    cy: cy
                });
                arrowPath[0][1] = cx;
                arrowPath[0][2] = cy;
                instance[0].attr({
                    path: arrowPath
                });
            };
            instance[1].drag(render, position);
            instance[2].drag(render, position);
            instance.toBack();
        }
        /**
         * @param {number} opt_attributes
         * @param {number} expectedNumberOfNonCommentArgs
         * @return {?}
         */
        function randFloat(opt_attributes, expectedNumberOfNonCommentArgs) {
            return opt_attributes + Math.floor(Math.random() * (expectedNumberOfNonCommentArgs - opt_attributes + 1));
        }
        /**
         * @param {Array} data
         * @return {undefined}
         */
        function onload(data) {
            /**
             * @param {(Array|NodeList)} data
             * @param {Array} args
             * @param {number} e
             * @return {?}
             */
            function fire(data, args, e) {
                /** @type {Array} */
                var matches = [];
                /** @type {Array} */
                var handlers = [];
                var caseSensitive;
                var typePattern;
                var p;
                var m;
                var f;
                var i;
                var count;
                var a;
                var l;
                var memory;
                /** @type {number} */
                var idx = 0;
                var len = data.length;
                for (; idx < len; idx++) {
                    m = data[idx];
                    /** @type {boolean} */
                    f = false;
                    /** @type {number} */
                    i = 0;
                    count = args.length;
                    for (; i < count; i++) {
                        if (notify(args[i].name, m.deps)) {
                            /** @type {boolean} */
                            f = true;
                        }
                    }
                    if (f) {
                        matches.push(m);
                    } else {
                        handlers.push(m);
                    }
                }
                /** @type {Array} */
                caseSensitive = [];
                /** @type {Array} */
                typePattern = [];
                /** @type {number} */
                p = 0;
                /** @type {number} */
                len = matches.length;
                for (; p < len; p++) {
                    m = matches[p];
                    /** @type {boolean} */
                    f = false;
                    /** @type {number} */
                    i = 0;
                    /** @type {number} */
                    count = matches.length;
                    for (; i < count; i++) {
                        if (notify(matches[i].name, m.deps)) {
                            /** @type {boolean} */
                            f = true;
                        }
                    }
                    /** @type {number} */
                    a = 0;
                    /** @type {number} */
                    l = handlers.length;
                    for (; a < l; a++) {
                        if (notify(handlers[a].name, m.deps)) {
                            /** @type {boolean} */
                            f = true;
                        }
                    }
                    if (f) {
                        caseSensitive.push(m);
                    } else {
                        /** @type {number} */
                        m.level = e;
                        typePattern.push(m);
                    }
                }
                return memory = handlers.concat(caseSensitive), memory.length > 0 ? fire(memory, typePattern, ++e) : e;
            }
            /**
             * @param {?} token
             * @return {?}
             */
            function handler(token) {
                /** @type {number} */
                var i = 0;
                var iLen = data.length;
                for (; i < iLen; i++) {
                    if (data[i].name == token) {
                        return true;
                    }
                }
                return false;
            }
            /**
             * @param {?} item
             * @param {Array} a
             * @return {?}
             */
            function notify(item, a) {
                /** @type {number} */
                var i = 0;
                var aLength = a.length;
                for (; i < aLength; i++) {
                    if (a[i] == item) {
                        return true;
                    }
                }
                return false;
            }
            var len = data.length;
            var width = paper.width;
            var h = paper.height;
            var logo_center = {
                x: width / 2,
                y: h / 2
            };
            var startY = randFloat(0, 360);
            /** @type {number} */
            var pc = 360 / len;
            /** @type {number} */
            var vt = logo_center.x - 150;
            var i;
            var args;
            var memory;
            var idx;
            var result;
            var index;
            var n;
            var e;
            var children;
            var child;
            var c;
            var d;
            /** @type {number} */
            var j = 0;
            for (; j < data.length; j++) {
                if (d = data[j], d.deps) {
                    /** @type {number} */
                    i = 0;
                    for (; i < d.deps.length; i++) {
                        if (!handler(d.deps[i])) {
                            throw d.deps[i] + " is not defined ";
                        }
                    }
                }
            }
            /** @type {Array} */
            args = [];
            /** @type {Array} */
            memory = [];
            /** @type {number} */
            idx = 0;
            for (; idx < len; idx++) {
                d = data[idx];
                if (d.deps) {
                    memory.push(d);
                } else {
                    /** @type {number} */
                    d.level = 0;
                    args.push(d);
                }
            }
            var from = fire(memory, args, 1);
            /** @type {number} */
            var halfHeight = h / (from + 1);
            /** @type {number} */
            var top = h - halfHeight / 2 + 20;
            /** @type {number} */
            idx = 0;
            for (; idx < from + 1; idx++) {
                /** @type {Array} */
                result = [];
                /** @type {number} */
                index = 0;
                len = data.length;
                for (; index < len; index++) {
                    if (data[index].level == idx) {
                        result.push(data[index]);
                    }
                }
                /** @type {number} */
                var x = 30;
                /** @type {number} */
                var pos = x * 2;
                /** @type {number} */
                var size = (width - pos) / result.length;
                /** @type {number} */
                var value = x + size / 2;
                /** @type {number} */
                c = 0;
                /** @type {number} */
                n = result.length;
                for (; c < n; c++) {
                    update(result[c].name, value, top);
                    /** @type {number} */
                    result[c].x = value;
                    /** @type {number} */
                    result[c].y = top;
                    value += size;
                }
                top -= halfHeight;
            }
            /** @type {number} */
            idx = 0;
            for (; idx < len; idx++) {
                if (e = data[idx], children = e.deps, children) {
                    /** @type {number} */
                    index = 0;
                    dLen = children.length;
                    for (; index < dLen; index++) {
                        child = children[index];
                        /** @type {number} */
                        c = 0;
                        for (; c < len; c++) {
                            d = data[c];
                            if (child === d.name) {
                                if (e.level - d.level > 1) {
                                    draw(e.x, e.y, d.x, d.y , "#8A8FD1", 10, "#8A8FD1", 2);
                                } else {
                                    draw(e.x, e.y, d.x , d.y , "#4D507E", 10, "#4D507E", 4);
                                }
                            }
                        }
                    }
                }
            }
        }
        var paper = Raphael(s.renderTo, s.width, s.height);
        var update;
        paper.rect(0, 0, 819, 579, 10).attr({
            stroke: "#666"
        });
        paper.text(410, 20, "Dependence  Visualization for KMD.js").attr({
            fill: "#fff",
            "font-size": 20
        });
        /**
         * @param {?} orig
         * @param {number} x
         * @param {number} y
         * @return {undefined}
         */
        update = function (orig, x, y) {
            var instance = paper.set(paper.rect(x, y, 120, 20, 10).attr({
                fill: "#D2DEEE"
            }), paper.text(x, y, orig).attr({
                fill: "black",
                "font-size": 20
            }));
            var child = instance[1].node.getBBox();
            var node = child.widht;
            var oldHeight = child.height;
            /** @type {number} */
            var diffX = child.width / 2 + 5;
            /** @type {number} */
            var diffY = child.height / 2 + 5;
            instance[0].attr({
                x: x - diffX,
                y: y - diffY,
                width: child.width + 10,
                height: child.height + 10
            });
            /**
             * @param {number} delta
             * @param {number} offset
             * @return {undefined}
             */
            instance[0].update = function (delta, offset) {
                var x = this.attr("x") + delta;
                var y = this.attr("y") + offset;
                this.attr({
                    x: x,
                    y: y
                });
                instance[1].attr({
                    x: x + diffX,
                    y: y + diffY
                });
            };
            /**
             * @param {number} delta
             * @param {number} offset
             * @return {undefined}
             */
            instance[1].update = function (delta, offset) {
                var x = this.attr("x") + delta;
                var y = this.attr("y") + offset;
                this.attr({
                    x: x,
                    y: y
                });
                instance[0].attr({
                    x: x - diffX,
                    y: y - diffY
                });
            };
            instance.drag(render, position);
        };
        onload(s.data);
    };
});
