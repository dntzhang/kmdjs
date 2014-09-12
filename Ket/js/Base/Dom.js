define("Base.Dom", {
    statics: {
        query: function (selector) {
            return document.querySelector(selector);
        },
        queryAll: function (selector) {
            return Array.prototype.slice.call(document.querySelectorAll(selector));
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
        css: function (node, styleName, value) {
            if (arguments.length == 3) node.style[styleName] = value;
            //因为有transition的存在，所有这行代码需要注释掉
            //if (node.style[styleName]) return node.style[styleName];
            return window.getComputedStyle(node, null)[styleName];
        },
        data: function (node, key, value) {
            if (arguments.length == 2) return node.dataset[key];
            node.dataset[key] = typeof value == "object" ? JSON.stringify(value) : value;
        },
        html: function (node,html) {
            if (arguments.length == 1) return node.innerHTML;
            node.innerHTML = html;
        },
        on: function (node, type, fn) {
            node.addEventListener(type,fn,false);
        },
        off: function (node, type, fn) {
            node.removeEventListener(type, fn, false);          
        },
        attr: function (node, name,value) {
            if (arguments.length == 2) return node.getAttribute(name);
            return node.setAttribute(name, value);
        }
    }


})