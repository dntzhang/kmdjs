Function.prototype.extend = function () {
    function a() { }
    a.prototype = this.prototype;
    return new a()
};
Array.prototype.size = function () {
    return this.length
};
Array.prototype.contains = function (a) {
    return this.indexOf(a) != -1
};
Array.prototype.containsAll = function (b) {
    for (var a = 0; a < b.length; a++) {
        if (!this.contains(b[a])) {
            return false
        }
    }
    return true
};
Array.prototype.isEmpty = function () {
    return this.length == 0
};
Array.prototype.clone = function () {
    var b = new Array(this.length);
    for (var a = 0; a < this.length; a++) {
        b[a] = this[a]
    }
    return b
};
Array.prototype.clear = function () {
    this.length = 0
};
Array.prototype.add = function (a, b) {
    if (arguments.length == 2) {
        this.splice(a, 0, b)
    } else {
        this.push(a)
    }
};
Array.prototype.addAll = function (b, d) {
    if (arguments.length == 2) {
        var e = this.length,
		a = d.length;
        this.length += a;
        for (var c = e - 1; c >= b; c--) {
            this[c + a] = this[c]
        }
        for (var c = 0; c < a; c++) {
            this[c + b] = d[c]
        }
    } else {
        for (var c = 0; c < b.length; c++) {
            this.push(b[c])
        }
    }
};
Array.prototype.remove = function (b) {
    var a = this.indexOf(b);
    if (a != -1) {
        this.splice(a, 1);
        return true
    }
    return false
};
Array.prototype.removeAll = function (b) {
    for (var a = 0; a < b.length; a++) {
        this.remove(b[a])
    }
};
Array.prototype.retainAll = function (b) {
    for (var a = this.length - 1; a >= 0; a--) {
        if (!b.contains(this[a])) {
            this.splice(a, 1)
        }
    }
};
if (typeof CanvasRenderingContext2D != "undefined") {
    if (!CanvasRenderingContext2D.prototype.measureText) {
        CanvasRenderingContext2D.prototype.measureText = function (a) {
            this.mozTextStyle = this.font;
            return {
                width: this.mozMeasureText(a)
            }
        }
    }
    if (!CanvasRenderingContext2D.prototype.fillText) {
        CanvasRenderingContext2D.prototype.fillText = function (b, a, c) {
            this.mozTextStyle = this.font;
            this.save();
            this.translate(a, c);
            this.mozDrawText(b);
            this.restore()
        }
    }
}
function Tree() {
    this.clear()
}
Tree._Node = function (a, b) {
    this.outgoing = [];
    this.incoming = [];
    this.children = [];
    this.tree = a;
    this.index = a.nodes.length;
    this.parent = b;
    a.nodes.add(this)
};
Tree._Node.prototype.addChild = function () {
    var a = new Tree._Node(this.tree, this);
    this.children.add(a);
    return a
};
Tree._Node.prototype.removeChild = function (c) {
    this.children.remove(c);
    c.clearEdges();
    c.clearChildren();
    this.tree.nodes.splice(c.index, 1);
    for (var a = c.index, b = this.tree.nodes.length; a < b; a++) {
        this.tree.nodes[a].index = a
    }
};
Tree._Node.prototype.clearChildren = function () {
    for (var a = 0; a < this.children.length; a++) {
        this.removeChild(this.children[a])
    }
};
Tree._Node.prototype.addEdge = function (a) {
    a.incoming.push(this);
    this.outgoing.push(a)
};
Tree._Node.prototype.removeEdge = function (a) {
    if (a.incoming.remove(this)) {
        this.outgoing.remove(a);
        return true
    }
    return false
};
Tree._Node.prototype.clearEdges = function () {
    for (var a = 0; a < this.incoming.length; a++) {
        this.incoming[a].outgoing.remove(this)
    }
    for (var a = 0; a < this.outgoing.length; a++) {
        this.outgoing[a].incoming.remove(this)
    }
    this.incoming = [];
    this.outgoing = []
};
Tree._Node.prototype.ancestors = function () {
    var b = [];
    var c = this,
	a = this.parent;
    while (a != null) {
        b.add(c);
        c = a;
        a = a.parent
    }
    b.add(c);
    return b
};
Tree.prototype.clear = function () {
    this.nodes = [];
    this.root = new Tree._Node(this, null)
};
Tree.prototype.leastCommonAncestor = function (f, d) {
    if (f == d) {
        return f
    }
    var e = f.ancestors();
    var c = d.ancestors();
    var g = e.pop();
    var h = c.pop();
    var i = null;
    while (g == h) {
        i = g;
        g = e.pop();
        h = c.pop()
    }
    return i
};
function Vector(a, b) {
    this.x = a;
    this.y = b
}
Vector.prototype.distance = function (a, d) {
    var c = this.x - a;
    var b = this.y - d;
    return Math.sqrt(c * c + b * b)
};
Vector.prototype.perp = function () {
    return new Vector(-this.y, this.x)
};
Vector.prototype.dot = function (a) {
    return this.x * a.x + this.y * a.y
};
Vector.prototype.cross = function (a) {
    return this.x * a.y - this.y * a.x
};
Vector.prototype.toString = function () {
    return "(" + this.x + ", " + this.y + ")"
};
function Path() { }
Path.Segment = function (b, a) {
    this.type = b;
    this.points = a
};
Path.SEG_MOVE = 1;
Path.SEG_LINE = 2;
Path.SEG_BEZIER = 3;
Path.prototype._path = function (c) {
    c.beginPath();
    var a = this.segments();
    for (var b = 0; b < a.length; b++) {
        var d = a[b];
        switch (d.type) {
            case Path.SEG_MOVE:
                var f = d.points[0];
                c.moveTo(f.x, f.y);
                break;
            case Path.SEG_LINE:
                var f = d.points[0];
                c.lineTo(f.x, f.y);
                break;
            case Path.SEG_BEZIER:
                var f = d.points[0];
                var g = d.points[1];
                var e = d.points[2];
                c.bezierCurveTo(g.x, g.y, e.x, e.y, f.x, f.y);
                break
        }
    }
};
Path.prototype.fill = function (a) {
    this._path(a);
    a.fill();
    return this
};
Path.prototype.stroke = function (a) {
    this._path(a);
    a.stroke();
    return this
};
Path.prototype.contains = function (b, a, c) {
    this._path(b);
    return b.isPointInPath(a, c)
};
Path.prototype.segments = function () {
    if (!this._segments) {
        this._segments = []
    }
    return this._segments
};
Path.prototype.moveTo = function (a, b) {
    this.segments().add(new Path.Segment(Path.SEG_MOVE, [new Vector(a, b)]));
    return this
};
Path.prototype.lineTo = function (a, b) {
    this.segments().add(new Path.Segment(Path.SEG_LINE, [new Vector(a, b)]));
    return this
};
Path.prototype.bezierCurveTo = function (c, b, e, d, a, f) {
    this.segments().add(new Path.Segment(Path.SEG_BEZIER, [new Vector(a, f), new Vector(c, b), new Vector(e, d)]));
    return this
};
Path.prototype.intersects = function (n, c) {
    var k = this._clone().flatten(c)._segments;
    var h = n._clone().flatten(c)._segments;
    for (var e = 0; e < k.length; e++) {
        if (k[e].type != Path.SEG_LINE) {
            continue
        }
        var m = k[e - 1].points[0];
        var l = k[e].points[0];
        for (var d = 0; d < h.length; d++) {
            if (h[d].type != Path.SEG_LINE) {
                continue
            }
            var g = h[d - 1].points[0];
            var f = h[d].points[0];
            if (Line.intersect(m, l, g, f)) {
                return true
            }
        }
    }
    return false
};
Path.prototype.transform = function (e) {
    var b = this.segments();
    for (var c = 0; c < b.length; c++) {
        var d = b[c];
        for (var a = 0; a < d.points.length; a++) {
            d.points[a] = e.transform(d.points[a])
        }
    }
    return this
};
Path.prototype.flat = function () {
    var a = this.segments();
    for (var b = 0; b < a.length; b++) {
        if (a[b].type == Path.SEG_BEZIER) {
            return false
        }
    }
    return true
};
Path.prototype.flatten = function (d) {
    var e = this;
    if (this.flat()) {
        return this
    }
    if (!d) {
        d = 1
    }
    function g(q, p, o, n) {
        var t = new Line(q.x, q.y, n.x, n.y);
        if ((t.distance(p.x, p.y) <= d) && (t.distance(o.x, o.y) <= d)) {
            e.lineTo(n.x, n.y)
        } else {
            var l = q;
            var h = Path._weightCurve(Path._bezierLeft[1], q, p, o, n);
            var r = Path._weightCurve(Path._bezierLeft[2], q, p, o, n);
            var k = Path._weightCurve(Path._bezierLeft[3], q, p, o, n);
            g(l, h, r, k);
            var j = k;
            var s = Path._weightCurve(Path._bezierRight[1], q, p, o, n);
            var m = Path._weightCurve(Path._bezierRight[2], q, p, o, n);
            var i = n;
            g(j, s, m, i)
        }
    }
    var a = this.segments();
    this._segments = [];
    for (var b = 0; b < a.length; b++) {
        var c = a[b];
        switch (c.type) {
            case Path.SEG_BEZIER:
                var f = a[b - 1];
                g(f.points[0], c.points[1], c.points[2], c.points[0]);
                break;
            default:
                this._segments.add(c);
                break
        }
    }
    return this
};
Path.prototype.split = function (c, b) {
    var g = this._clone().flatten(b)._segments;
    function l(n, j, i) {
        return new Vector(n.x * (1 - i) + j.x * i, n.y * (1 - i) + j.y * i)
    }
    var k = 0;
    var d = new Array(g.length);
    d[0] = 0;
    for (var f = 1; f < g.length; f++) {
        var q = g[f - 1].points[0];
        var m = g[f].points[0];
        d[f] = k += q.distance(m.x, m.y)
    }
    for (var f = 1; f < g.length; f++) {
        d[f] /= k
    }
    var s = new Array(c);
    var q = g[0].points[0],
	a = q;
    for (var f = 0, e = 1; f < c; f++) {
        var r = new Path().moveTo(a.x, a.y);
        var h = (f + 1) / c;
        while (d[e] < h) {
            q = g[e++].points[0];
            r.lineTo(q.x, q.y)
        }
        var m = g[e].points[0];
        if (d[e] == h) {
            q = g[e++].points[0];
            a = m
        } else {
            var o = (h - d[e - 1]) / (d[e] - d[e - 1]);
            a = l(q, m, o)
        }
        r.lineTo(a.x, a.y);
        s[f] = r
    }
    return s
};
Path.prototype.clear = function () {
    this.segments().clear();
    return this
};
Path.prototype._clone = function (a) {
    var b = new Path();
    b._segments = this.segments();
    return b
};
Path._weightCurve = function (a, e, d, c, b) {
    return new Vector(a[0] * e.x + a[1] * d.x + a[2] * c.x + a[3] * b.x, a[0] * e.y + a[1] * d.y + a[2] * c.y + a[3] * b.y)
};
Path._bezierLeft = [[8 / 8, 0 / 8, 0 / 8, 0 / 8], [4 / 8, 4 / 8, 0 / 8, 0 / 8], [2 / 8, 4 / 8, 2 / 8, 0 / 8], [1 / 8, 3 / 8, 3 / 8, 1 / 8]];
Path._bezierRight = [[1 / 8, 3 / 8, 3 / 8, 1 / 8], [0 / 8, 2 / 8, 4 / 8, 2 / 8], [0 / 8, 0 / 8, 4 / 8, 4 / 8], [0 / 8, 0 / 8, 0 / 8, 8 / 8]];
function AffineTransform() {
    this._matrix = [1, 0, 0, 0, 1, 0]
}
AffineTransform.prototype.rotate = function (c) {
    var b = Math.cos(c);
    var a = Math.sin(c);
    var d = this._matrix.clone();
    this._matrix[0] = d[0] * b - d[1] * a;
    this._matrix[1] = d[0] * a + d[1] * b;
    this._matrix[3] = d[3] * b - d[4] * a;
    this._matrix[4] = d[3] * a + d[4] * b;
    return this
};
AffineTransform.prototype.scale = function (a, b) {
    if (arguments.length == 1) {
        b = a
    }
    this._matrix[0] = this._matrix[0] * a;
    this._matrix[1] = this._matrix[1] * b;
    this._matrix[3] = this._matrix[3] * a;
    this._matrix[4] = this._matrix[4] * b;
    return this
};
AffineTransform.prototype.shear = function (a, c) {
    var b = this._matrix.clone();
    this._matrix[0] = b[0] + b[1] * c;
    this._matrix[1] = b[0] * a + b[1];
    this._matrix[3] = b[3] + b[4] * c;
    this._matrix[4] = b[3] * a + b[4];
    return this
};
AffineTransform.prototype.translate = function (a, b) {
    this._matrix[2] = this._matrix[0] * a + this._matrix[1] * b + this._matrix[2];
    this._matrix[5] = this._matrix[3] * a + this._matrix[4] * b + this._matrix[5];
    return this
};
AffineTransform.prototype.transform = function (a) {
    return new Vector(this._matrix[0] * a.x + this._matrix[1] * a.y + this._matrix[2], this._matrix[3] * a.x + this._matrix[4] * a.y + this._matrix[5])
};
function BasisSpline() {
    Path.call(this);
    this._points = []
}
BasisSpline.prototype = Path.extend();
BasisSpline.prototype.add = function (a, b) {
    this._points.push(new Vector(a, b));
    this._segments = null;
    return this
};
BasisSpline.prototype.addAll = function (a) {
    this._points.addAll(a);
    this._segments = null;
    return this
};
BasisSpline.prototype.clear = function () {
    this._points = [];
    this._segments = null;
    return this
};
BasisSpline.prototype.straighten = function (g) {
    var h = this._points;
    var f = h.length - 1;
    var b = h[f].x - h[0].x;
    var a = h[f].y - h[0].y;
    for (var c = 1; c < f; c++) {
        var d = h[c];
        d.x = g * d.x + (1 - g) * (h[0].x + c * b / f);
        d.y = g * d.y + (1 - g) * (h[0].y + c * a / f)
    }
    this._segments = null;
    return this
};
BasisSpline.prototype.points = function () {
    return this._points
};
BasisSpline.prototype.segments = function () {
    if (this._segments) {
        return this._segments
    }
    this._segments = [];
    var d = this._points;
    if (!d) {
        var c = Function.stacktrace();
        throw c
    }
    switch (d.length) {
        case 0:
            break;
        case 1:
            this.moveTo(d[0].x, d[0].y);
            break;
        case 2:
            this.moveTo(d[0].x, d[0].y);
            this.lineTo(d[1].x, d[1].y);
            break;
        default:
            this.moveTo(d[0].x, d[0].y);
            var h = d[0];
            var g = h;
            var f = h;
            var e = d[1];
            this._basisCurveTo(h, g, f, e);
            for (var b = 2; b < d.length; b++) {
                h = g;
                g = f;
                f = e;
                e = d[b];
                this._basisCurveTo(h, g, f, e)
            }
            for (var a = 0; a < 2; a++) {
                h = g;
                g = f;
                f = e;
                this._basisCurveTo(h, g, f, e)
            }
            break
    }
    return this._segments
};
BasisSpline._basisToBezier = [[1 / 6, 4 / 6, 1 / 6, 0 / 6], [0 / 6, 4 / 6, 2 / 6, 0 / 6], [0 / 6, 2 / 6, 4 / 6, 0 / 6], [0 / 6, 1 / 6, 4 / 6, 1 / 6]];
BasisSpline.prototype._basisCurveTo = function (g, f, e, d) {
    var c = Path._weightCurve(BasisSpline._basisToBezier[1], g, f, e, d);
    var b = Path._weightCurve(BasisSpline._basisToBezier[2], g, f, e, d);
    var a = Path._weightCurve(BasisSpline._basisToBezier[3], g, f, e, d);
    this.bezierCurveTo(c.x, c.y, b.x, b.y, a.x, a.y)
};
function Circle(a, c, b) {
    this.center = new Vector(a, c);
    this.radius = b
}
Circle.prototype._path = function (a) {
    a.beginPath();
    a.arc(this.center.x, this.center.y, this.radius, 0, 2 * Math.PI, false)
};
Circle.prototype.fill = function (a) {
    this._path(a);
    a.fill();
    return this
};
Circle.prototype.stroke = function (a) {
    this._path(a);
    a.stroke();
    return this
};
Circle.prototype.distance = function (a, b) {
    return this.center.distance(a, b) - this.radius
};
Circle.prototype.diameter = function () {
    return 2 * this.radius
};
Circle.prototype.circumference = function () {
    return 2 * Math.PI * this.radius
};
Circle.prototype.area = function () {
    return Math.PI * this.radius * this.radius
};
function Line(b, d, a, c) {
    Path.call(this);
    this._segments = [new Path.Segment(Path.SEG_MOVE, [new Vector(b, d)]), new Path.Segment(Path.SEG_LINE, [new Vector(a, c)])]
}
Line.prototype = Path.extend();
Line.prototype.distance = function (a, g) {
    var d = this.start(),
	f = this.end();
    var c = f.x - d.x,
	b = f.y - d.y;
    return ((c == 0) && (b == 0)) ? d.distance(a, g) : Math.abs(c * (d.y - g) - b * (d.x - a)) / Math.sqrt(c * c + b * b)
};
Line.prototype.start = function () {
    return this._segments[0].points[0]
};
Line.prototype.end = function () {
    return this._segments[1].points[0]
};
Line.prototype.length = function () {
    return this.start().distance(this.end())
};
Line.intersect = function (p, o, i, g) {
    var n = new Vector(g.x - i.x, g.y - i.y);
    var m = new Vector(p.y - o.y, o.x - p.x);
    var l = new Vector(p.x - i.x, p.y - i.y);
    var k = l.dot(n.perp());
    var h = n.dot(m);
    if (h > 0) {
        if ((k < 0) || (k > h)) {
            return false
        }
    } else {
        if ((k > 0) || (k < h)) {
            return false
        }
    }
    var j = l.dot(m);
    if (h > 0) {
        if ((j < 0) || (j > h)) {
            return false
        }
    } else {
        if ((j > 0) || (j < h)) {
            return false
        }
    }
    return true
};
function Rectangle(a, d, b, c) {
    this.x = a;
    this.y = d;
    this.width = b;
    this.height = c
}
Rectangle.prototype._path = function (a) {
    a.beginPath();
    a.moveTo(this.x, this.y);
    a.lineTo(this.x + this.width, this.y);
    a.lineTo(this.x + this.width, this.y + this.height);
    a.lineTo(this.x, this.y + this.height);
    a.closePath()
};
Rectangle.prototype.fill = function (a) {
    this._path(a);
    a.fill();
    return this
};
Rectangle.prototype.stroke = function (a) {
    this._path(a);
    a.stroke();
    return this
};
Rectangle.prototype.circumference = function () {
    return 2 * (this.width + this.height)
};
Rectangle.prototype.area = function () {
    return this.width * this.height
};
function BundledEdgeRouter(a, b) {
    this.beta = 0.85;
    this.tree = a;
    this.layout = b;
    this.splines = null
}
BundledEdgeRouter.prototype._spline = function (d, c) {
    var h = this.tree.nodes[d],
	a = this.tree.nodes[c];
    var g = this.tree.leastCommonAncestor(h, a);
    var f = [];
    f.add(this.transformPoint(this.layout.position(d)));
    while (h != g) {
        h = h.parent;
        f.add(this.transformPoint(this.layout.position(h.index)))
    }
    var b = f.size();
    while (a != g) {
        f.add(b, this.transformPoint(this.layout.position(a.index)));
        a = a.parent
    }
    var e = new BasisSpline().addAll(f).straighten(this.beta);
    e._start = d;
    e._end = c;
    return e
};
BundledEdgeRouter.prototype.init = function () {
    this.splines = [];
    for (var b = 0; b < this.tree.nodes.length; b++) {
        for (var a = 0; a < this.tree.nodes[b].outgoing.length; a++) {
            this.splines.add(this._spline(b, this.tree.nodes[b].outgoing[a].index))
        }
    }
};
BundledEdgeRouter.prototype.draw = function (b) {
    for (var a = 0; a < this.splines.length; a++) {
        this.drawSpline(b, a)
    }
};
BundledEdgeRouter.prototype.drawSpline = function (b, a) {
    this.splines[a].stroke(b)
};
BundledEdgeRouter.prototype.transformPoint = function (a) {
    return a
};
function CircleLayout(a) {
    this.endAngle = 2 * Math.PI;
    this.startAngle = 0;
    this.startRadius = 0;
    this.tree = a
}
CircleLayout.prototype.init = function () {
    this._positions = [];
    this._angles = [];
    var f = this;
    var h = new Array(this.tree.nodes.length);
    var e = new Array(this.tree.nodes.length);
    var b = 0;
    var i = 1;
    function g(l, m) {
        if (m > b) {
            b = m
        }
        e[l.index] = m;
        if ((m > 0) || (l.children.length > 1)) {
            m++
        }
        var k = (l.children.length == 0) ? 1 : 0;
        for (var j = 0; j < l.children.length; j++) {
            k += g(l.children[j], m)
        }
        if (k == l.children.length) {
            k++
        }
        h[l.index] = k;
        return k
    }
    function c(j) {
        if (!f.sort) {
            return j
        }
        j = j.clone();
        j.sort(f.sort);
        return j
    }
    function a(r, s, l) {
        d(r, (s + l) / 2);
        var q = (l - s) / h[r.index];
        var p = c(r.children);
        for (var o = 0, m = 0; m < p.length; m++) {
            var n = o + h[p[m].index];
            a(p[m], s + o * q, s + n * q);
            o = n
        }
    }
    function d(l, n) {
        n -= Math.PI / 2;
        var m = e[l.index];
        var k = (m == 0) ? 0 : (f.startRadius + radiusScale * m);
        var j = Math.cos(n) * k;
        var o = Math.sin(n) * k;
        f._positions[l.index] = new Vector(j, o);
        f._angles[l.index] = n
    }
    g(this.tree.root, 0);
    radiusScale = (1 - this.startRadius) / b;
    a(this.tree.root, this.startAngle, this.endAngle)
};
CircleLayout.prototype.position = function (a) {
    return this._positions[a]
};
CircleLayout.prototype.angle = function (a) {
    return this._angles[a]
};
CircleLayout.prototype.outline = function () {
    var c = this;
    var a = this.tree.nodes.clone();
    a.sort(function (g, f) {
        return c.angle(g.index) - c.angle(f.index)
    });
    var e = new Path();
    for (var b = 0; b < a.length; b++) {
        if (a[b].children.length == 0) {
            var d = this.position(a[b].index);
            if (e.segments().length == 0) {
                e.moveTo(d.x, d.y)
            } else {
                e.lineTo(d.x, d.y)
            }
        }
    }
    return e
};
function Color() { }
Color.Rgb = function (f, e, c, d) {
    this.r = f;
    this.g = e;
    this.b = c;
    this.a = d
};
Color.Rgb.prototype.rgb = function () {
    return this
};
Color.Rgb.prototype.toString = function () {
    return "rgba(" + this.r + ", " + this.g + ", " + this.b + ", " + this.a + ")"
};
Color.white = new Color.Rgb(255, 255, 255, 1);
Color.red = new Color.Rgb(255, 0, 0, 1);
Color.green = new Color.Rgb(0, 255, 0, 1);
Color.blue = new Color.Rgb(0, 0, 255, 1);
Color.black = new Color.Rgb(0, 0, 0, 1);
function Gradient(b, a) {
    this.start = b.rgb();
    this.end = a.rgb()
}
Gradient.prototype.color = function (a) {
    return new Color.Rgb(Math.round(this.start.r * (1 - a) + this.end.r * a), Math.round(this.start.g * (1 - a) + this.end.g * a), Math.round(this.start.b * (1 - a) + this.end.b * a), this.start.a * (1 - a) + this.end.a * a)
};
function RadialLabeler(a, b) {
    this.tree = a;
    this.layout = b
}
RadialLabeler.prototype._drawNode = function (d, c) {
    var e = this.transformPoint(this.layout.position(c));
    d.save();
    d.translate(e.x, e.y);
    d.fillStyle = this.style(this.tree.nodes[c]) || d.fillStyle;
    var b = this.transformAngle(this.layout.angle(c));
    var f = this.name(this.tree.nodes[c]);
    if (this._upsideDown(b)) {
        d.rotate(b + Math.PI);
        d.fillText(f, -d.measureText(f).width - 2, 2)
    } else {
        d.rotate(b);
        d.fillText(f, 2, 2)
    }
    d.restore()
};
RadialLabeler.prototype._upsideDown = function (a) {
    a %= 2 * Math.PI;
    if (a < 0) {
        a += 2 * Math.PI
    }
    return (a > Math.PI / 2) && (a < 1.5 * Math.PI)
};
RadialLabeler.prototype.draw = function (b) {
    if (!b.fillText) {
        return
    }
    for (var a = 0; a < this.tree.nodes.length; a++) {
        if (this.tree.nodes[a].children.length == 0) {
            this._drawNode(b, a)
        }
    }
};
RadialLabeler.prototype.name = function (a) {
    return a.index
};
RadialLabeler.prototype.style = function (a) {
    return null
};
RadialLabeler.prototype.transformPoint = function (a) {
    return a
};
RadialLabeler.prototype.transformAngle = function (a) {
    return a
};
RadialLabeler.prototype.nodeAt = function (a, g) {
    var d = 0,
	b = Infinity;
    for (var e = 1; e < this.tree.nodes.length; e++) {
        var f = this.transformPoint(this.layout.position(e));
        var c = f.distance(a, g);
        if (c < b) {
            d = e;
            b = c
        }
    }
    return this.tree.nodes[d]
};
function DependencyTree() {
    Tree.call(this);
    this._map = {}
}
DependencyTree.prototype = Tree.extend();
DependencyTree.prototype.get = function (a) {
    if (this._map[a]) {
        return this._map[a]
    }
    var b = a.lastIndexOf(".");
    var c = (b == -1) ? this.root : this.get(a.substring(0, b));
    var d = c.addChild();
    d.name = a.substring(b + 1);
    d.fullName = a;
    this._map[a] = d;
    return d
};
function DependencyTreeControl(d,m, e, q ) {
    var data = d;
    var J = m.getContext("2d");
    var O = document.createElement("canvas").getContext("2d");
    O.canvas.width = m.width;
    O.canvas.height = m.height;
    O.canvas.style.display = "none";
    document.body.appendChild(O.canvas);
    var A = new DependencyTree();
    for (var H = 0; H < data.length; H++) {
        var D = A.get(data[H].name);
        for (var E = 0; E < data[H].deps.length; E++) {
            D.addEdge(A.get(data[H].deps[E]))
        }
    }
    var v = m.width,
	I = m.height,
	y = 80;
    var r = 0;
    var p = new AffineTransform().translate(v / 2, I / 2).scale(Math.min(v, I) / 2 - y);
    var M = new CircleLayout(A);
    M.startRadius = 0.6;
    M.sort = function (h, g) {
        return (h.name == g.name) ? 0 : ((h.name > g.name) ? 1 : -1)
    };
    M.init();
    var N = new RadialLabeler(A, M);
    N.transformAngle = function (b) {
        return b + r
    };
    N.transformPoint = function (b) {
        return p.transform(b)
    };
    N.name = function (b) {
        return b.name
    };
    N.style = function (b) {
        return b._style
    };
    var k = new BundledEdgeRouter(A, M);
    k.transformPoint = function (b) {
        return p.transform(b)
    };
    k.init();
    var s = DependencyTreeControl._light;
    var d = new Gradient(s.edgeStart, s.edgeEnd);
    var a = 1;
    var z = 8;
    var u = new Array(k.splines.length);
    for (var H = 0; H < u.length; H++) {
        u[H] = k.splines[H].flatten().split(z)
    }
    k.draw = function (w) {
        w.save();
        w.translate(v / 2, I / 2);
        w.rotate(r);
        w.translate(-v / 2, -I / 2);
        w.globalCompositeOperation = s.edgeComposite;
        w.strokeStyle = s.edgeInactive;
        for (var b = 0; b < this.splines.length; b++) {
            var P = this.splines[b];
            if (!P._active) {
                P.stroke(w)
            }
        }
        for (var h = 0, R = z; h < R; h++) {
            var Q = d.color((h + 0.5) / R);
            Q.a = a;
            w.strokeStyle = Q.toString();
            for (var b = 0; b < this.splines.length; b++) {
                if (this.splines[b]._active) {
                    u[b][h].stroke(w)
                }
            }
        }
        w.restore()
    };
    function x() {
        var Q = new Array(A.nodes.length);
        var h = new Array(A.nodes.length);
        for (var j = 0; j < A.nodes.length; j++) {
            Q[j] = h[j] = 0
        }
        var g = 0;
        var b;
        if (K != null) {
            b = new Line(K.start().x, K.start().y, K.end().x, K.end().y).transform(new AffineTransform().translate(v / 2, I / 2).rotate(r).translate(-v / 2, -I / 2))
        }
        for (var j = 0; j < k.splines.length; j++) {
            var P = k.splines[j];
            P._active = !b || b.intersects(P);
            if (P._active) {
                g++;
                h[P._start]++;
                Q[P._end]++
            }
        }
        for (var j = 0; j < A.nodes.length; j++) {
            var w = A.nodes[j].parent;
            while (w != null) {
                Q[w.index] += Q[j];
                h[w.index] += h[j];
                w = w.parent
            }
        }
        a = 0.17 + 0.83 / Math.sqrt(g);
        for (var j = 0; j < A.nodes.length; j++) {
            A.nodes[j]._style = ((Q[j] > 0) && (h[j] == 0)) ? s.labelEnd : (((h[j] > 0) && (Q[j] == 0)) ? s.labelStart : (((Q[j] + h[j]) > 0) ? s.labelActive : s.labelInactive))
        }
    }
    function o(b) {
        b = b || q._node;
        q.style.color = b._style;
        q.innerHTML = b.fullName;
        q._node = b
    }
    var B = 0;
    var f = 1;
    var G = 2;
    var n = M.outline().transform(p);
    var t = B;
    var L = 0;
    var C = null;
    var K = null;
    window.addEventListener("mousedown",
	function (h) {
	    if (h.button != 0) {
	        return
	    }
	    var b = h.pageX - m.offsetLeft;
	    var i = h.pageY - m.offsetTop;
	    C = new Vector(b, i);
	    O.clearRect(0, 0, v, I);
	    O.drawImage(m, 0, 0, v, I);
	    if (n.contains(J, b, i)) {
	        t = G;
	        if (K != null) {
	            var g = K.start(),
				h = K.end();
	            if (C.distance(g.x, g.y) < 4) {
	                C = h
	            } else {
	                if (C.distance(h.x, h.y) < 4) {
	                    C = g
	                }
	            }
	        }
	        h.preventDefault();
	        return
	    }
	    t = f;
	    L = 0;
	    h.preventDefault()
	},
	false);
    window.addEventListener("mousemove",
	function (w) {
	    var b = w.pageX - m.offsetLeft;
	    var P = w.pageY - m.offsetTop;
	    switch (t) {
	        case B:
	            o(N.nodeAt(b, P));
	            if (K != null) {
	                var g = K.start(),
                    w = K.end();
	                var j = new Vector(b, P);
	                if ((j.distance(g.x, g.y) < 4) || (j.distance(w.x, w.y) < 4)) {
	                    document.body.style.cursor = "move";
	                    break
	                }
	            }
	            document.body.style.cursor = n.contains(J, b, P) ? "crosshair" : "move";
	            break;
	        case G:
	            J.clearRect(0, 0, v, I);
	            J.drawImage(O.canvas, 0, 0, v, I);
	            K = new Line(C.x, C.y, b, P);
	            l();
	            break;
	        case f:
	            var i = new Vector(b - v / 2, P - I / 2);
	            var h = new Vector(C.x - v / 2, C.y - I / 2);
	            L = Math.atan2(h.cross(i), h.dot(i));
	            J.clearRect(0, 0, v, I);
	            J.save();
	            J.translate(v / 2, I / 2);
	            J.rotate(L);
	            J.translate(-v / 2, -I / 2);
	            J.drawImage(O.canvas, 0, 0, v, I);
	            J.restore();
	            break
	    }
	},
	false);
    window.addEventListener("mouseup",
	function (g) {
	    var b = g.pageX - m.offsetLeft;
	    var h = g.pageY - m.offsetTop;
	    switch (t) {
	        case G:
	            if (C.distance(b, h) < 3) {
	                K = null
	            }
	            x();
	            F();
	            break;
	        case f:
	            r += L;
	            if (K != null) {
	                K.transform(new AffineTransform().translate(v / 2, I / 2).rotate(-L).translate(-v / 2, -I / 2))
	            }
	            p = new AffineTransform().translate(v / 2, I / 2).scale(Math.min(v, I) / 2 - y).rotate(-r);
	            n = M.outline().transform(p);
	            F();
	            break
	    }
	    document.body.style.cursor = "auto";
	    t = B
	},
	false);
    window.addEventListener("keydown",
	function (b) {
	    if (t != B) {
	        return
	    }
	    switch (b.keyCode) {
	        case 73:
	            s = s.next;
	            d.start = s.edgeStart;
	            d.end = s.edgeEnd;
	            x();
	            o();
	            F();
	            break
	    }
	},
	false);
    function l() {
        if (!K) {
            return
        }
        J.strokeStyle = s.intersectStroke;
        J.fillStyle = s.intersectFill;
        K.stroke(J);
        new Circle(K.start().x, K.start().y, 2.5).fill(J).stroke(J);
        new Circle(K.end().x, K.end().y, 2.5).fill(J).stroke(J)
    }
    function c() {
        var g = e.getContext("2d");
        var b = g.canvas.width,
		P = g.canvas.height;
        g.clearRect(0, 0, b, P);
        var Q = g.createLinearGradient(20, 0, b - 20, 0);
        Q.addColorStop(0, d.start.toString());
        Q.addColorStop(1, d.end.toString());
        g.fillStyle = Q;
        g.fillRect(20, 13, b - 35, 2);
        g.font = "7pt Sans-Serif";
        g.fillStyle = s.labelStart;
        g.fillText("A", 10, 17);
        g.fillStyle = s.labelEnd;
        g.fillText("B", b - 12, 17);
        var j = "depends on";
        var i = g.measureText(j).width;
        g.fillStyle = s.intersectStroke;
        g.fillText(j, (b - i) / 2, 10)
    }
    function F() {
        document.body.style.background = s.background;
        J.clearRect(0, 0, v, I);
        k.draw(J);
        l();
        N.draw(J);
        c()
    }
    this.init = function () {
        J.lineWidth = 3;
        J.font = "22pt Sans-Serif";
        x();
        F()
    }
}
DependencyTreeControl._light = {
    background: "white",
    edgeComposite: "darker",
    edgeStart: Color.green,
    edgeEnd: Color.red,
    edgeInactive: "rgba(0, 0, 0, .02)",
    labelStart: "rgb(0, 128, 0)",
    labelEnd: "rgb(128, 0, 0)",
    labelActive: "black",
    labelInactive: "rgba(0, 0, 0, .2)",
    intersectStroke: "black",
    intersectFill: "white"
};
DependencyTreeControl._dark = {
    background: "black",
    edgeComposite: "lighter",
    edgeStart: Color.green,
    edgeEnd: Color.red,
    edgeInactive: "rgba(192, 192, 192, .02)",
    labelStart: "rgb(0, 192, 0)",
    labelEnd: "rgb(192, 0, 0)",
    labelActive: "rgb(192, 192, 192)",
    labelInactive: "rgba(192, 192, 192, .2)",
    intersectStroke: "white",
    intersectFill: "black"
};
DependencyTreeControl._alt = {
    background: "white",
    edgeComposite: "darker",
    edgeStart: new Color.Rgb(28, 0, 252, 1),
    edgeEnd: new Color.Rgb(249, 128, 22, 1),
    edgeInactive: "rgba(0, 0, 0, .02)",
    labelStart: "rgb(28, 0, 252)",
    labelEnd: "rgb(176, 91, 16)",
    labelActive: "black",
    labelInactive: "rgba(0, 0, 0, .2)",
    intersectStroke: "black",
    intersectFill: "white"
};
DependencyTreeControl._altDark = {
    background: "black",
    edgeComposite: "lighter",
    edgeStart: new Color.Rgb(53, 0, 252, 1),
    edgeEnd: new Color.Rgb(249, 128, 22, 1),
    edgeInactive: "rgba(192, 192, 192, .02)",
    labelStart: "rgb(64, 0, 255)",
    labelEnd: "rgb(176, 91, 16)",
    labelActive: "rgb(192, 192, 192)",
    labelInactive: "rgba(192, 192, 192, .2)",
    intersectStroke: "white",
    intersectFill: "black"
};
DependencyTreeControl._mono = {
    background: "rgb(128, 128, 128)",
    edgeComposite: "source-over",
    edgeStart: Color.white,
    edgeEnd: Color.black,
    edgeInactive: "rgba(0, 0, 0, .02)",
    labelStart: "white",
    labelEnd: "black",
    labelActive: "#333333",
    labelInactive: "rgba(0, 0, 0, .2)",
    intersectStroke: "black",
    intersectFill: "white"
};
DependencyTreeControl._light.next = DependencyTreeControl._dark;
DependencyTreeControl._dark.next = DependencyTreeControl._alt;
DependencyTreeControl._alt.next = DependencyTreeControl._altDark;
DependencyTreeControl._altDark.next = DependencyTreeControl._mono;
DependencyTreeControl._mono.next = DependencyTreeControl._light;