define("UserVM", ["Base","Util"],{

    ctor: function (vm) {
        var $ = JQuery.mock();
        this.el = $(vm.el);
        this.user = vm.data;
        this.tplFn = Template.parse(this.el.html().replace(/&lt;/g, "<").replace(/&gt;/g, ">"));
        this.update();
        var self = this;
        this.user.change(
            Helper.debounce(function () {
                self.update();
            }, 100)
          )
    },
    add: function () {        
        //auto update
        //this.user.d[0]++;
    
        //this.user.d.push(111);
      //  console.log(this.user.hobby.toString())

     //   console.log(this.user.d)
        // this.user.d[13] = 1111;
        this.user.hobby.push("other")
        this.user.hobby[1] = "other2";
    },
    update: function () {
        var $ = JQuery.mock();
        var self = this;      
        this.el.html(this.tplFn(this.user));
        var $ipt = $("input", this.el[0]);
        $ipt.each(function () {
            var vm = $(this).attr("vm");
            vm && $(this).val(self.user[vm]);
        })
    }
})