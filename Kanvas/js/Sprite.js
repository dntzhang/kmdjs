define("Kanvas.Sprite:Kanvas.DisplayObject", {
    ctor: function (option) {
        //var defaultOption = {
        //    framerate:20,
        //    imgs: [img1, img2],
        //    frames: [
        //            // x, y, width, height, imageIndex, regX, regY
        //            [0, 0, 64, 64, 0, 32, 64],
        //            [64, 0, 96, 64, 0]
        //    ],
        //    animations: {
        //        walk: {
        //            frames: [8, 9, 10, 9, 8],
        //            next: "run",
        //            speed: 2,
        //            loop: false
        //        },
        //        jump: {


        //        }
        //    }
        //}
        this._super();
        this.option = option;
        this.currentFrameIndex = 0;
        this.animationFrameIndex = 0;
        this.currentAnimation = "walk";
        this._rect = [0, 0, 10, 10];
        this.img = this.option.imgs[0];
        var self = this;

        this.loop = RAF.requestInterval(function () {
           
            var opt = self.option;
            var frames = opt.animations[self.currentAnimation].frames, len = frames.length;
            self.animationFrameIndex++;
            if (self.animationFrameIndex > len - 1) self.animationFrameIndex = 0;
           
            self._rect = opt.frames[frames[self.animationFrameIndex]];
            if (self._rect.length > 4) self.img = opt.imgs[self._rect[4]];
        }, 1000 / this.option.framerate);
    },
    draw: function (ctx) {
        ctx.drawImage(this.img, this._rect[0], this._rect[1], this._rect[2], this._rect[3], 0, 0, this._rect[2], this._rect[3]);
    }
})
