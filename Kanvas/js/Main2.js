kmdjs.config({
    name: "HelloKanvas",
    baseUrl: "js",
    classes: [
          { name: "Kanvas.DisplayObject" },
          { name: "Kanvas.Txt" },
          { name: "Kanvas.Stage" },
          { name: "Kanvas.Container" },
          { name: "Kanvas.Matrix2D" },
          { name: "Kanvas.Shape.Circle" },
          { name: "Kanvas.Loader" },
          { name: "Kanvas.RAF" },
          { name: "Kanvas.UID" },
          { name: "Kanvas.UI.Button" },
          { name: "Kanvas.UI.ShapeButton" },
          { name: "Kanvas.TWEEN" },
          { name: "Kanvas.Wheel" },
          {name:"Kanvas.Shape"}
    ]
});

define("Main", ["Kanvas", "Kanvas.Shape"], {
    ctor: function () {

        var stage = new Stage("#ourCanvas");
        stage.scalable();

        //var circle = new Circle(10, "red");
        //circle.x=300;
        //circle.y = 200;
        //circle.hover(function () {
        //    this.scaleX = this.scaleY = 1.2;
        //    stage.update();
        //}, function () {
        //    this.scaleX = this.scaleY = 1;
        //    stage.update();
        //})
        //var circle2 = new Circle(10, "green");
        //circle2.x = 200;
        //circle2.y = 130;
        //stage.add(circle, circle2);
      
        //var sp = new Shape();
        //sp.beginPath().arc(377 / 4, 391 / 4, 140 / 4, 0, Math.PI * 2).closePath().fillStyle('#f4862c').fill().strokeStyle("#046ab4").lineWidth(8 / 4).stroke().beginPath().moveTo(298 / 4, 506 / 4).bezierCurveTo(236 / 4, 396 / 4, 302 / 4, 272 / 4, 407 / 4, 254 / 4).strokeStyle("#046ab4").lineWidth(6 / 4).stroke().beginPath().moveTo(328 / 4, 258 / 4).bezierCurveTo(360 / 4, 294 / 4, 451 / 4, 272 / 4, 503 / 4, 332 / 4).strokeStyle("#046ab4").lineWidth(6 / 4).stroke().beginPath().moveTo(282 / 4, 288 / 4).bezierCurveTo(391 / 4, 292 / 4, 481 / 4, 400 / 4, 488 / 4, 474 / 4).strokeStyle("#046ab4").lineWidth(6 / 4).stroke().beginPath().moveTo(242 / 4, 352 / 4).bezierCurveTo(352 / 4, 244 / 4, 319 / 4, 423 / 4, 409 / 4, 527 / 4).strokeStyle("#046ab4").lineWidth(6 / 4).stroke();
        //sp.regX = 377 / 4;
        //sp.regY = 391 / 4;
        //sp.x = 100;
        //sp.y = 200;
        //sp.hover(function () {
        //    this.scaleX *= 1.2;
        //    this.scaleY *= 1.2;
        //    stage.update();
        //}, function () {
        //    this.scaleX /= 1.2;
        //    this.scaleY /= 1.2;
        //    stage.update();
        //})

        //var sp2 = new Shape();
        //sp2.beginPath().arc(377 / 4, 391 / 4, 140 / 4, 0, Math.PI * 2).closePath().fillStyle('#f4862c').fill().strokeStyle("#046ab4").lineWidth(8 / 4).stroke().beginPath().moveTo(298 / 4, 506 / 4).bezierCurveTo(236 / 4, 396 / 4, 302 / 4, 272 / 4, 407 / 4, 254 / 4).strokeStyle("#046ab4").lineWidth(6 / 4).stroke().beginPath().moveTo(328 / 4, 258 / 4).bezierCurveTo(360 / 4, 294 / 4, 451 / 4, 272 / 4, 503 / 4, 332 / 4).strokeStyle("#046ab4").lineWidth(6 / 4).stroke().beginPath().moveTo(282 / 4, 288 / 4).bezierCurveTo(391 / 4, 292 / 4, 481 / 4, 400 / 4, 488 / 4, 474 / 4).strokeStyle("#046ab4").lineWidth(6 / 4).stroke().beginPath().moveTo(242 / 4, 352 / 4).bezierCurveTo(352 / 4, 244 / 4, 319 / 4, 423 / 4, 409 / 4, 527 / 4).strokeStyle("#046ab4").lineWidth(6 / 4).stroke();
        //sp2.regX = 377 / 4;
        //sp2.regY = 391 / 4;
        //sp2.x = 300;
        //sp2.y =100;
        //sp2.hover(function () {
        //    this.scaleX*=1.2;
        //        this.scaleY *= 1.2;
        //    stage.update();
        //}, function () {
        //    this.scaleX /= 1.2;
        //    this.scaleY /= 1.2;
        //    stage.update();
        //})
        //stage.add(sp, sp2);


        var sp3 = new Shape();
   

        //Triangle
        sp3.beginPath();
        sp3.moveTo(51, 150);
        sp3.lineTo(701, 150);
        sp3.lineTo(375, 568);
        sp3.closePath();
        sp3.fillStyle('#bcc2c4');
        sp3.fill();
        sp3.strokeStyle ( "#046ab4");
        sp3.lineWidth ( 13);
        sp3.stroke();

        //KNICKS - BG
        sp3.beginPath();
        sp3.moveTo(132, 375);
        sp3.bezierCurveTo(288, 277, 480, 284, 619, 377);
        sp3.lineTo(696, 299);
        sp3.lineTo(644, 185);
        sp3.lineTo(623, 171);
        sp3.lineTo(631, 156);
        sp3.lineTo(603, 95);
        sp3.lineTo(528, 68);
        sp3.lineTo(507, 84);
        sp3.lineTo(504, 92);
        sp3.bezierCurveTo(464, 82, 440, 80, 386, 77);
        sp3.lineTo(372, 92);
        sp3.lineTo(372, 76);
        sp3.bezierCurveTo(315, 79, 289, 83, 248, 93);
        sp3.lineTo(242, 82);
        sp3.lineTo(207, 66);
        sp3.lineTo(202, 76);
        sp3.lineTo(201, 75);
        sp3.lineTo(149, 95);
        sp3.lineTo(56, 299);
        sp3.closePath();
        sp3.fillStyle ( '#046ab4');
        sp3.fill();

        //KNICKS - K
        sp3.beginPath();
        sp3.moveTo(156, 104);
        sp3.lineTo(188, 91);
        sp3.lineTo(156, 165);
        sp3.lineTo(192, 137);
        sp3.lineTo(212, 79);
        sp3.lineTo(235, 90);
        sp3.lineTo(217, 150);
        sp3.lineTo(185, 181);
        sp3.lineTo(200, 207);
        sp3.lineTo(183, 264);
        sp3.lineTo(141, 280);
        sp3.lineTo(166, 211);
        sp3.lineTo(160, 203);
        sp3.lineTo(136, 226);
        sp3.lineTo(108, 296);
        sp3.lineTo(83, 310);
        sp3.lineTo(69, 297);
        sp3.closePath();
        sp3.fillStyle ( '#f4862c');
        sp3.fill();

        //KNICKS - N
        sp3.beginPath();
        sp3.moveTo(244, 105);
        sp3.lineTo(273, 97);
        sp3.lineTo(283, 140);
        sp3.lineTo(291, 95);
        sp3.lineTo(316, 91);
        sp3.lineTo(299, 236);
        sp3.lineTo(266, 241);
        sp3.lineTo(272, 200);
        sp3.lineTo(261, 145);
        sp3.lineTo(239, 247);
        sp3.lineTo(203, 257);
        sp3.closePath();
        sp3.fillStyle ( '#f4862c');
        sp3.fill();

        //KNICKS - I
        sp3.beginPath();
        sp3.moveTo(332, 89);
        sp3.lineTo(359, 87);
        sp3.lineTo(354, 231);
        sp3.lineTo(319, 233);
        sp3.closePath();
        sp3.fillStyle ( '#f4862c');
        sp3.fill();

        //KNICKS - C
        sp3.beginPath();
        sp3.moveTo(391, 88);
        sp3.lineTo(426, 90);
        sp3.lineTo(429, 114);
        sp3.lineTo(403, 114);
        sp3.lineTo(408, 202);
        sp3.lineTo(439, 204);
        sp3.lineTo(443, 235);
        sp3.lineTo(392, 232);
        sp3.lineTo(374, 213);
        sp3.lineTo(374, 103);
        sp3.closePath();
        sp3.fillStyle ( '#f4862c');
        sp3.fill();

        //KNICKS - K
        sp3.beginPath();
        sp3.moveTo(436, 92);
        sp3.lineTo(461, 95);
        sp3.lineTo(473, 161);
        sp3.lineTo(491, 138);
        sp3.lineTo(480, 98);
        sp3.lineTo(508, 104);
        sp3.lineTo(518, 134);
        sp3.lineTo(505, 161);
        sp3.lineTo(528, 180);
        sp3.lineTo(550, 258);
        sp3.lineTo(513, 247);
        sp3.lineTo(501, 195);
        sp3.lineTo(488, 185);
        sp3.lineTo(480, 196);
        sp3.lineTo(488, 242);
        sp3.lineTo(455, 237);
        sp3.closePath();
        sp3.fillStyle ( '#f4862c');
        sp3.fill();

        //KNICKS - S
        sp3.beginPath();
        sp3.moveTo(517, 89);
        sp3.lineTo(530, 80);
        sp3.lineTo(595, 103);
        sp3.lineTo(616, 147);
        sp3.lineTo(580, 137);
        sp3.lineTo(572, 114);
        sp3.lineTo(549, 107);
        sp3.lineTo(561, 142);
        sp3.lineTo(635, 191);
        sp3.lineTo(683, 296);
        sp3.lineTo(668, 312);
        sp3.lineTo(572, 266);
        sp3.lineTo(553, 203);
        sp3.lineTo(588, 214);
        sp3.lineTo(599, 242);
        sp3.lineTo(627, 254);
        sp3.lineTo(610, 210);
        sp3.lineTo(539, 159);
        sp3.closePath();
        sp3.fillStyle ( '#f4862c');
        sp3.fill();

        //KNICKS - Rectangles
        sp3.beginPath();
        sp3.moveTo(86, 314);
        sp3.lineTo(110, 300);
        sp3.lineTo(154, 351);
        sp3.lineTo(135, 362);
        sp3.closePath();
        sp3.fillStyle ( '#bcc2c4');
        sp3.fill();
        sp3.beginPath();
        sp3.moveTo(143, 285);
        sp3.lineTo(182, 269);
        sp3.lineTo(214, 322);
        sp3.lineTo(180, 338);
        sp3.closePath();
        sp3.fill();
        sp3.beginPath();
        sp3.moveTo(204, 262);
        sp3.lineTo(240, 252);
        sp3.lineTo(260, 304);
        sp3.lineTo(256, 309);
        sp3.lineTo(229, 317);
        sp3.closePath();
        sp3.fill();
        sp3.beginPath();
        sp3.moveTo(265, 246);
        sp3.lineTo(299, 241);
        sp3.lineTo(304, 265);
        sp3.lineTo(277, 285);
        sp3.closePath();
        sp3.fill();
        sp3.beginPath();
        sp3.moveTo(320, 239);
        sp3.lineTo(355, 236);
        sp3.lineTo(354, 247);
        sp3.lineTo(323, 256);
        sp3.closePath();
        sp3.fill();
        sp3.beginPath();
        sp3.moveTo(374, 221);
        sp3.lineTo(387, 234);
        sp3.lineTo(387, 245);
        sp3.lineTo(373, 245);
        sp3.closePath();
        sp3.fill();
        sp3.beginPath();
        sp3.moveTo(391, 236);
        sp3.lineTo(442, 240);
        sp3.lineTo(440, 259);
        sp3.lineTo(391, 245);
        sp3.closePath();
        sp3.fill();
        sp3.beginPath();
        sp3.moveTo(453, 241);
        sp3.lineTo(489, 249);
        sp3.lineTo(478, 285);
        sp3.lineTo(449, 264);
        sp3.closePath();
        sp3.fill();
        sp3.beginPath();
        sp3.moveTo(512, 253);
        sp3.lineTo(550, 264);
        sp3.lineTo(524, 319);
        sp3.lineTo(500, 311);
        sp3.lineTo(493, 303);
        sp3.closePath();
        sp3.fill();
        sp3.beginPath();
        sp3.moveTo(570, 271);
        sp3.lineTo(664, 315);
        sp3.lineTo(617, 364);
        sp3.lineTo(540, 324);
        sp3.closePath();
        sp3.fill();

        //Ball - Circle
        sp3.beginPath();
        sp3.arc(377, 391, 140, 0, Math.PI * 2);
        sp3.closePath();
        sp3.fillStyle ( '#f4862c');
        sp3.fill();
        sp3.strokeStyle ( "#046ab4");
        sp3.lineWidth = 11;
        sp3.stroke();

        //Ball - Curve 1
        sp3.beginPath();
        sp3.moveTo(298, 506);
        sp3.bezierCurveTo(236, 396, 302, 272, 407, 254);
        sp3.strokeStyle ( "#046ab4");
        sp3.lineWidth = 6;
        sp3.stroke();

        //Ball - Curve 2
        sp3.beginPath();
        sp3.moveTo(328, 258);
        sp3.bezierCurveTo(360, 294, 451, 272, 503, 332);
        sp3.strokeStyle ( "#046ab4");
        sp3.lineWidth = 6;
        sp3.stroke();

        //Ball - Curve 3
        sp3.beginPath();
        sp3.moveTo(282, 288);
        sp3.bezierCurveTo(391, 292, 481, 400, 488, 474);
        sp3.strokeStyle ("#046ab4");
        sp3.lineWidth = 6;
        sp3.stroke();

        //Ball - Curve 4
        sp3.beginPath();
        sp3.moveTo(242, 352);
        sp3.bezierCurveTo(352, 244, 319, 423, 409, 527);
        sp3.strokeStyle ( "#046ab4");
        sp3.lineWidth = 6;
        sp3.stroke();

        //NEW YORK - N
        sp3.beginPath();
        sp3.moveTo(264, 42);
        sp3.lineTo(273, 39);
        sp3.lineTo(277, 46);
        sp3.lineTo(279, 37);
        sp3.lineTo(289, 35);
        sp3.lineTo(278, 81);
        sp3.lineTo(268, 83);
        sp3.lineTo(272, 65);
        sp3.lineTo(273, 63);
        sp3.lineTo(269, 58);
        sp3.lineTo(261, 85);
        sp3.lineTo(251, 87);
        sp3.closePath();
        sp3.fillStyle ( '#046ab4');
        sp3.fill();

        //NEW YORK - E
        sp3.beginPath();
        sp3.moveTo(297, 32);
        sp3.lineTo(316, 29);
        sp3.lineTo(315, 37);
        sp3.lineTo(304, 40);
        sp3.lineTo(303, 49);
        sp3.lineTo(313, 48);
        sp3.lineTo(312, 56);
        sp3.lineTo(301, 59);
        sp3.lineTo(300, 68);
        sp3.lineTo(310, 67);
        sp3.lineTo(309, 76);
        sp3.lineTo(287, 79);
        sp3.closePath();
        sp3.fillStyle ( '#046ab4');
        sp3.fill();

        //NEW YORK - W
        sp3.beginPath();
        sp3.moveTo(322, 28);
        sp3.lineTo(330, 27);
        sp3.lineTo(326, 64);
        sp3.lineTo(332, 64);
        sp3.lineTo(337, 26);
        sp3.lineTo(345, 25);
        sp3.lineTo(341, 62);
        sp3.lineTo(347, 62);
        sp3.lineTo(350, 25);
        sp3.lineTo(359, 24);
        sp3.lineTo(356, 67);
        sp3.lineTo(350, 73);
        sp3.lineTo(340, 73);
        sp3.lineTo(337, 70);
        sp3.lineTo(331, 74);
        sp3.lineTo(320, 75);
        sp3.lineTo(316, 71);
        sp3.closePath();
        sp3.fillStyle ( '#046ab4');
        sp3.fill();

        //NEW YORK - Y
        sp3.beginPath();
        sp3.moveTo(375, 24);
        sp3.lineTo(383, 24);
        sp3.lineTo(383, 51);
        sp3.lineTo(388, 51);
        sp3.lineTo(388, 24);
        sp3.lineTo(396, 24);
        sp3.lineTo(397, 55);
        sp3.lineTo(391, 60);
        sp3.lineTo(391, 72);
        sp3.lineTo(382, 72);
        sp3.lineTo(382, 60);
        sp3.lineTo(374, 53);
        sp3.closePath();
        sp3.fillStyle ( '#046ab4');
        sp3.fill();

        //NEW YORK - O
        sp3.beginPath();
        sp3.moveTo(407, 25);
        sp3.lineTo(420, 26);
        sp3.lineTo(425, 32);
        sp3.lineTo(430, 68);
        sp3.lineTo(425, 74);
        sp3.lineTo(410, 73);
        sp3.lineTo(405, 67);
        sp3.lineTo(403, 30);
        sp3.closePath();
        sp3.fillStyle ( '#046ab4');
        sp3.fill();
        sp3.beginPath();
        sp3.moveTo(412, 35);
        sp3.lineTo(417, 35);
        sp3.lineTo(420, 63);
        sp3.lineTo(414, 63);
        sp3.closePath();
        sp3.fillStyle ( '#ffffff');
        sp3.fill();

        //NEW YORK - R
        sp3.beginPath();
        sp3.moveTo(433, 28);
        sp3.lineTo(451, 31);
        sp3.lineTo(457, 38);
        sp3.lineTo(461, 56);
        sp3.lineTo(459, 58);
        sp3.lineTo(463, 63);
        sp3.lineTo(465, 79);
        sp3.lineTo(455, 78);
        sp3.lineTo(452, 64);
        sp3.lineTo(447, 62);
        sp3.lineTo(449, 77);
        sp3.lineTo(439, 76);
        sp3.closePath();
        sp3.fillStyle ( '#046ab4');
        sp3.fill();
        sp3.beginPath();
        sp3.moveTo(443, 39);
        sp3.lineTo(449, 40);
        sp3.lineTo(451, 52);
        sp3.lineTo(444, 51);
        sp3.closePath();
        sp3.fillStyle ( '#ffffff');
        sp3.fill();

        //NEW YORK - K
        sp3.beginPath();
        sp3.moveTo(465, 35);
        sp3.lineTo(473, 36);
        sp3.lineTo(478, 57);
        sp3.lineTo(483, 58);
        sp3.lineTo(484, 56);
        sp3.lineTo(480, 39);
        sp3.lineTo(488, 41);
        sp3.lineTo(493, 58);
        sp3.lineTo(491, 61);
        sp3.lineTo(495, 66);
        sp3.lineTo(501, 87);
        sp3.lineTo(491, 84);
        sp3.lineTo(487, 70);
        sp3.lineTo(481, 68);
        sp3.lineTo(484, 83);
        sp3.lineTo(474, 81);
        sp3.closePath();
        sp3.fillStyle ( '#046ab4');
        sp3.fill();

        sp3.x = 100;
        sp3.y = -20;
        stage.add(sp3);
        stage.update();
    }
})
