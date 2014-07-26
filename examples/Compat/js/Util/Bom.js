define("Util.Bom", {
    statics: {
        getViewport: function () {
            var d = document.documentElement, b = document.body, w = window, div = document.createElement("div");
            div.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";
            var lt = !(div.firstChild.nodeType === 3) ?
                { left: b.scrollLeft || d.scrollLeft, top: b.scrollTop || d.scrollTop } :
                { left: w.pageXOffset, top: w.pageYOffset };
            var wh = w.innerWidth ?
                { width: w.innerWidth, height: w.innerHeight } :
                    (d && d.clientWidth && d.clientWidth != 0 ?
                    { width: d.clientWidth, height: d.clientHeight } :
                    { width: b.clientWidth, height: b.clientHeight });

            return [lt.left, lt.top, wh.width, wh.height]
        }
    }
})
