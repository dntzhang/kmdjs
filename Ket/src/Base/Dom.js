define("Base.Dom", {
    statics: {
        query: function (selector,context) {
            return context ? context.querySelector(selector) : document.querySelector(selector);
        },
        queryAll: function (selector, context) {
            return Array.prototype.slice.call(context ? context.querySelectorAll(selector) : document.querySelectorAll(selector));
        },
        data: function (node, key, value) {
            if (arguments.length == 2) return node.dataset[key];
            node.dataset[key] = typeof value == "object" ? JSON.stringify(value) : value;
        },
        removeData: function (node, key) {
            node.dataset[key] = null;
        },


        attr: function (node, name, value) {
            if (arguments.length == 2) return node.getAttribute(name);
            return node.setAttribute(name, value);
        },
        removeAttr: function (node, name) {
            node.removeAttribute(name);
        },
        addClass: function (node, name) {
            node.classList.add(name);
        },
        removeClass: function (node, name) {
            node.classList.remove(name);
        },
        toggleClass: function (name) {
            node.classList.toggle(name);
        },
        containClass: function (name) {
            return node.classList.contains(name);
        },
        html: function (node, html) {
            if (arguments.length == 1) return node.innerHTML;
            node.innerHTML = html;
        },
        text: function (node, text) {
            if (arguments.length == 1) return node.innerText;
            node.innerText = text;
        },
        val: function (node, value) {
            if (arguments.length == 1) return node.value;
            node.value = value;
        },


        css: function (node, styleName, value) {
            if (arguments.length == 3) node.style[styleName] = value;
            //因为有transition的存在，所有这行代码需要注释掉
            //if (node.style[styleName]) return node.style[styleName];
            return window.getComputedStyle(node, null)[styleName];
        },
        offset: function (node) {
            var rect = node.getBoundingClientRect();
            return { left: window.pageXOffset + rect.left, top: window.pageYOffset + rect.top };
        },
        position: function (node) {
            return { left: node.offsetLeft, top: node.offsetTop };
        },
        scrollLeft: function (node, val) {
            if (arguments.length == 1) return node.scrollLeft;
            node.scrollLeft = val;
        },
        scrollTop:function(node,val){
            if (arguments.length == 1) return node.scrollTop;
            node.scrollTop = val;
        },
        innerHeight: function (node) {
            var prop = window.getComputedStyle(node, null);
            var bs = prop["boxSizing"];
            if (bs == "border-box ") {
                return parseFloat(prop["height"]) - parseFloat(prop["borderTopWidth"]) - parseFloat(prop["borderBottomWidth"]);
            } else {
                return parseFloat(prop["height"]) + parseFloat(prop["paddingTop"]) + parseFloat(prop["paddingBottom"]);
            }
        },
        innerWidth: function (node) {
            var prop = window.getComputedStyle(node, null);
            var bs = prop["boxSizing"];
            if (bs == "border-box ") {
                return parseFloat(prop["width"]) - parseFloat(prop["borderLeftWidth"]) - parseFloat(prop["borderRightWidth"]);
            } else {
                return parseFloat(prop["width"]) + parseFloat(prop["paddingLeft"]) + parseFloat(prop["paddingRight"]);
            }
        },
        outerHeight: function (node) {

            var prop = window.getComputedStyle(node, null);
            var bs = prop["boxSizing"];
            if (bs == "border-box ") {
                return parseFloat(prop["height"]) + parseFloat(prop["marginTop"]) + parseFloat(prop["marginBottom"]);
            } else {
                return parseFloat(prop["height"]) + parseFloat(prop["paddingTop"]) + parseFloat(prop["paddingBottom"]) + parseFloat(prop["marginTop"]) + parseFloat(prop["marginBottom"]) + parseFloat(prop["borderTopWidth"]) + parseFloat(prop["borderBottomWidth"]);
            }
        },
        outerWidth: function (node) {
            var prop = window.getComputedStyle(node, null);
            var bs = prop["boxSizing"];
            if (bs == "border-box ") {
                return parseFloat(prop["width"]) + parseFloat(prop["marginLeft"]) + parseFloat(prop["marginRight"]);
            } else {
                return parseFloat(prop["width"]) + parseFloat(prop["paddingLeft"]) + parseFloat(prop["paddingRight"]) + parseFloat(prop["marginLeft"]) + parseFloat(prop["marginRight"]) + parseFloat(prop["borderLeftWidth"]) + parseFloat(prop["borderRightWidth"]);
            }
        },


        append: function (parent, child) {
            parent.appendChild(child);
        },
        prepend: function (parent, child) {
            parent.insertBefore(child, parent.childNodes[0]);
        },
        remove: function (node) {
            node.parentNode.removeChild(node);
        },


        on: function (node, type, fn) {
            node.addEventListener(type, fn, false);
        },
        off: function (node, type, fn) {
            node.removeEventListener(type, fn, false);
        },
        one: function (node, type, fn) {
            var callback = function (evt) {
                fn(evt);
                node.removeEventListener(type, callback, false);
                callback = null;
            }
            node.addEventListener(type, callback, false);
        },


        /**
         * animate dom
         * @param {Object} option - The option of the animation.
         * Example:
         *      Fx.animate(Dom.query(".test"), {
         *      	to: { width: "200px" },
         *      	duration: 1000,
         *      	timing:"ease-in",
         *      	complete: function () {
         *      		alert(11111111111);
         *      	}
         *      });
         ** @return {undefined}
         *	复合属性。检索或设置对象变换时的过渡。 
         *可以为同一元素的多个属性定义过渡效果。示例： 
         *transition:border-color .5s ease-in .1s, background-color .5s ease-in .1s, color .5s ease-in .1s;
         */
        animate: function (node, option) {
            var transitionStyle = "transition:";
            for (var key in option.to) {
                this.css(node, key, this.css(node, key));
                transitionStyle += key + " ";
                transitionStyle += option.duration / 1000 + "s ";
                transitionStyle += option.timing || "linear" + " ";
                transitionStyle += option.delay ? (option.delay / 1000 + "s, ") : ",";
            }
            transitionStyle = transitionStyle.substr(0, transitionStyle.length - 1) + ";";

            this.data(node, "endProp", option.to);
            node.style.cssText += transitionStyle;

            var cptHandle = function () {
                if (option.complete) option.complete();
                //防止触发多次
                Dom.off(node, "transitionend", cptHandle)
            }

            this.on(node, "transitionend", cptHandle);

            //防止样式还没设置成功导致transition失效
            setTimeout(function () {
                for (var key in option.to) {
                    Dom.css(node, key, option.to[key]);
                }
            }, 1)
        },
        stop: function (node, jumpToEnd) {
            if (!jumpToEnd) {
                var props = window.getComputedStyle(node, null);
                var endProp = JSON.parse(this.data(node, "endProp"));
                for (var name in endProp) {
                    Dom.css(node, name, props[name]);
                }
            }
            node.style.transition = "";
        }
    }
})