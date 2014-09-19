//如果Observable了它，它下面的子类就自动会被监控，所有子类就不用继承自Observable
define("UserVM:Util.Observable", ["Base", "Util"], {

    ctor: function (vm) {
        this.users = vm.data;
        this._super();


        var $ = JQuery.mock();
        this.el = $(vm.el);
       
        this.tplFn = Template.parse(this.el.html().replace(/&lt;/g, "<").replace(/&gt;/g, ">"));
        this.updateView();
        var self = this;
        this.change(
          
            Helper.debounce(function () {
           
                self.updateView();
            }, 50)
          )
    },
    addUser: function () {      
        this.users.list.push(new User("wangwu", 100));  
    },
    updateUser: function () {
        this.users.list[Math.floor(this.users.list.length * Math.random())].name = "randomName";
    },
    deleteUser: function () {
         this.users.list.splice(0, 1);
    },
    updateView: function () {
        var $ = JQuery.mock();
        var self = this;      
        this.el.html(this.tplFn(this.users));
        var $ipt = $("input", this.el[0]);
        $ipt.each(function () {
            var vm = $(this).attr("vm");
            vm && $(this).val(self.users[vm]);
        })
    }
})