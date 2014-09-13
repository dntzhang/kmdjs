define("Compotent.CountDown", ["Base"], {
    ctor: function (option) {
        Http.loadCompotent("Compotent/CountDown/CountDown.css","Compotent/CountDown/CountDown.tpl",
          function (tpl) {
                var  hour= option.hour || 0,
                  minute=option.minute || 0,
                  second= option.second || 0;
              var data = {
                  hour: option.hour > 9 ? option.hour : "0" + option.hour,
                  minute: option.minute > 9 ? option.minute : "0" + option.minute,
                  second: option.second > 9 ? option.second : "0" + option.second

              }

              var html = Template.parse(tpl, data);

              Dom.html(option.renderTo, html);
          });        
    }
})