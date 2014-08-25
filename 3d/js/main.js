kmdjs.config({
    name: "HelloKanvas",
    baseUrl: "js"
});
define("Main" ,{
    ctor: function () {

        window.onload = function () {

            var canvas = document.getElementById('myCanvas');
            var context = canvas.getContext('2d');            var distance = 400;
            var eyePosition = { x: 0, y: 0, z: 400 };

            //画上一张图（矩形4个点坐标）
            //   context.drawImage(document.querySelector("img"),0,0)
            //得其中4个点沿着Y轴变换后的坐标（4点坐标）
            var rect = { p1: { x: -64, y: -64, z: 0 }, p2: { x: 64, y: -64, z: 0 }, p3: { x: 64, y: 64, z: 0 }, p4: { x: -64, y: 64, z: 0 } };
            context.translate(canvas.width / 2, canvas.height / 2)
            context.beginPath();
            context.moveTo(rect.p1.x, rect.p1.y);
            context.lineTo(rect.p2.x, rect.p2.y);
            context.lineTo(rect.p3.x, rect.p3.y);

            context.closePath();

            context.stroke();
            var ag = 1;
            setInterval(function () {
                context.clearRect(-1 * canvas.width / 2, -1 * canvas.height / 2, canvas.width, canvas.height)
                var tp1 = rotatePoint(rect.p1, ag, "y");
                var tp2 = rotatePoint(rect.p2, ag, "y");
                var tp3 = rotatePoint(rect.p3, ag, "y");
                var tp4 = rotatePoint(rect.p4, ag, "y");
                ag++;
                changeDistance(tp1);
                changeDistance(tp2);
                changeDistance(tp3);
                changeDistance(tp4);

                var tf = createTransform(rect, { p1: { x: tp1.x, y: tp1.y }, p2: { x: tp2.x, y: tp2.y }, p3: { x: tp3.x, y: tp3.y } })
                var tf2 = createTransform({ p1: rect.p1, p2: rect.p3, p3: rect.p4 }, { p1: { x: tp1.x, y: tp1.y }, p2: { x: tp3.x, y: tp3.y }, p3: { x: tp4.x, y: tp4.y } })
                // 
                //context.beginPath();
                //context.moveTo(tp1.x, tp1.y);
                //context.lineTo(tp2.x, tp2.y);
                //context.lineTo(tp3.x, tp3.y);
                //context.closePath();
                //context.stroke();

                //context.beginPath();
                //context.moveTo(tp1.x, tp1.y);
                //context.lineTo(tp3.x, tp3.y);
                //context.lineTo(tp4.x, tp4.y);
                //context.closePath();
                //context.stroke();

                context.save();
                context.beginPath();
                context.moveTo(tp1.x, tp1.y);
                context.lineTo(tp2.x, tp2.y);
                context.lineTo(tp3.x, tp3.y);
                context.closePath();
                // ---- clip ----
                context.clip();
                // ---- texture mapping ----
                context.transform.apply(context, tf);
                context.drawImage(document.querySelector("img"), -64, -64);
                context.restore();

                context.save()
                context.beginPath();
                context.moveTo(tp1.x, tp1.y);
                context.lineTo(tp3.x, tp3.y);
                context.lineTo(tp4.x, tp4.y);
                context.closePath();

                // ---- clip ----

                context.clip();

                // ---- texture mapping ----
                context.transform.apply(context, tf2);
                context.drawImage(document.querySelector("img"), -64, -64);
                context.restore();
            }, 15)


            function changeDistance(p) {
                p.x = p.x * distance / Math.abs(eyePosition.z - p.z);
                p.y = p.y * distance / Math.abs(eyePosition.z - p.z);

            }
            function createTransform(source, dest) {
                var x11 = source.p1.x;
                var x12 = source.p1.y;
                var x21 = source.p2.x;
                var x22 = source.p2.y;
                var x31 = source.p3.x;
                var x32 = source.p3.y;
                var y11 = dest.p1.x;
                var y12 = dest.p1.y;
                var y21 = dest.p2.x;
                var y22 = dest.p2.y;
                var y31 = dest.p3.x;
                var y32 = dest.p3.y;

                var a1 = ((y11 - y21) * (x12 - x32) - (y11 - y31) * (x12 - x22)) /
                            ((x11 - x21) * (x12 - x32) - (x11 - x31) * (x12 - x22));
                var a2 = ((y11 - y21) * (x11 - x31) - (y11 - y31) * (x11 - x21)) /
                            ((x12 - x22) * (x11 - x31) - (x12 - x32) * (x11 - x21));
                var a3 = y11 - a1 * x11 - a2 * x12;
                var a4 = ((y12 - y22) * (x12 - x32) - (y12 - y32) * (x12 - x22)) /
                            ((x11 - x21) * (x12 - x32) - (x11 - x31) * (x12 - x22));
                var a5 = ((y12 - y22) * (x11 - x31) - (y12 - y32) * (x11 - x21)) /
                            ((x12 - x22) * (x11 - x31) - (x12 - x32) * (x11 - x21));
                var a6 = y12 - a4 * x11 - a5 * x12;
                return [a1, a4, a2, a5, a3, a6];
            }

            function rotatePoint(p, angle, d) {
                var angle = angle * Math.PI / 180;
                if (d == "y") {
                    var x = p.x * Math.cos(angle) + p.z * Math.sin(angle);
                    var z = p.z * Math.cos(angle) - p.x * Math.sin(angle);
                    return { x: x, y: p.y, z: z };
                } else if (d == "x") {
                    var y = p.z * Math.sin(angle) + p.y * Math.cos(angle);
                    var z = p.z * Math.cos(angle) - p.y * Math.sin(angle);
                    return { x: p.x, y: y, z: z };
                }
                else if (d == "z") {
                    var x = p.y * Math.sin(angle) + p.x * Math.cos(angle);
                    var y = p.y * Math.cos(angle) - p.x * Math.sin(angle);
                    return { x: x, y: y, z: p.z };
                }
            }

        }
    }


})
