define("UserVM", ["Base"],{

    ctor: function (vm) {
        var $ = JQuery.mock();
        this.el = $(vm.el);
        this.user = new User("wangwu", 4);
        this.tpl=this.el.html().replace(/&lt;/g, "<").replace(/&gt;/g, ">");
        this.update();
        //this.users = vm.data;


        var self = this;
        this.user.change(function () {          
            self.update();
        })
    },
    add: function () {        
        //auto update
        this.user.age++;
    },
    update: function () {
        var $ = JQuery.mock();
        var self = this;
        this.el.html(Template.parse(this.tpl, this.user));
        var $ipt = $("input", this.el[0]);
        $ipt.each(function () {
            var vm = $(this).attr("vm");
            vm && $(this).val(self.user[vm]);
        })
    }
})