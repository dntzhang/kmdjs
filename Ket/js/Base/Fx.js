define("Base.Dom.Fx", ["Base"],{

	//Fx.animate(Dom.query(".test"), {
	//	to: { width: "200px" },
	//	duration: 1000,
	//	timing:"ease-in",
	//	complete: function () {
	//		alert(11111111111);
	//	}
	//});
	//	复合属性。检索或设置对象变换时的过渡。 
	//可以为同一元素的多个属性定义过渡效果。示例： 
	//缩写方式：
	//	transition:border-color .5s ease-in .1s, background-color .5s ease-in .1s, color .5s ease-in .1s;
	statics: {
		animate: function (node, option) {
			var transitionStyle = "transition:";
			for (var key in option.to) {
				Dom.css(node, key, Dom.css(node, key));
				transitionStyle += key+" ";			
				transitionStyle += option.duration / 1000 + "s ";
				transitionStyle += option.timing||"linear" + " ";
				transitionStyle += option.delay ? (option.delay / 1000 + "s, ") : ",";
			}
			transitionStyle = transitionStyle.substr(0, transitionStyle.length - 1) + ";";
			
			Dom.data(node, "endProp", option.to);
			node.style.cssText += transitionStyle;

			var cptHandle=function () {			
				if (option.complete) option.complete();
				//防止触发多次
				Dom.off(node, "transitionend", cptHandle)
			}
			
			Dom.on(node, "transitionend", cptHandle);

			//防止样式还没设置成功导致transition失效
			setTimeout(function () {
				for (var key in option.to) {
					Dom.css(node, key, option.to[key]);
				}
			}, 1)
		},
		stop: function (node, jumpToEnd) {
		    if (!jumpToEnd) {
		        var props = window.getComputedStyle(node, null);
		        var endProp = JSON.parse(Dom.data(node, "endProp"));
		        for (var name in endProp) {
		            Dom.css(node, name, props[name]);
		        }
		    }
		    node.style.transition = "";
		}
	}
})