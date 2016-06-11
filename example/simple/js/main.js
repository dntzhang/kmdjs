kmdjs.define('main',['util.bom','app.Ball'], function() {

    var ball = new app.Ball(0, 0, 28, 1, -2, 'kmdjs');

    var vp = util.bom.getViewport();

    setInterval(function () {
        ball.tick();
        (ball.x + ball.r * 2 > vp[2] || ball.x < 0) && (ball.vx *= -1);
        (ball.y + ball.r * 2 > vp[3] || ball.y < 0) && (ball.vy *= -1);
    }, 15);

});