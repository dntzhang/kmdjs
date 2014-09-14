define("Compotent.CountDown", ["Base"], {
    ctor: function (option) {

        this.hour = option.hour || 0;
        this.minute = option.minute || 0;
        this.second = option.second || 0;
        this.totalScd = this.hour * 3600 + this.minute * 60 + this.second;
        
        var data = {
            hour: option.hour > 9 ? option.hour : "0" + option.hour,
            minute: option.minute > 9 ? option.minute : "0" + option.minute,
            second: option.second > 9 ? option.second : "0" + option.second,
            //can get base url from CountDown's static prop:baseUrl
            baseUrl: CountDown.baseUrl
        }
        //can get deps data from CountDown's static prop:deps
        var html = Template.parse(CountDown.deps[1], data);
        Dom.html(option.renderTo, html);

        this.hourNode = Dom.query(".cpt-cd-h", option.renderTo);
        this.minuteNode = Dom.query(".cpt-cd-m", option.renderTo);
        this.secondNode = Dom.query(".cpt-cd-s", option.renderTo);
       
        var self = this;
        RAF.requestInterval(function () {
        //    alert(1)
            self.tick();
        }, 1000);
        
    },
    tick: function () {
        this.compute();
        this.render();
    },
    compute:function(){
        this.totalScd--;
        this.hour = Math.floor(this.totalScd / 3600);
        this.minute = Math.floor((this.totalScd - (this.hour * 3600)) / 60);
        this.second = this.totalScd - this.hour * 3600 - this.minute * 60;
    },
    render: function () {
        Dom.html(this.hourNode, this.hour>9? this.hour : "0" + this.hour);
        Dom.html(this.minuteNode, this.minute > 9 ? this.minute : "0" + this.minute);
        Dom.html(this.secondNode, this.second > 9 ? this.second : "0" + this.second);
    }
})