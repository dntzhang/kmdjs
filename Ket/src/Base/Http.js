define("Base.Http", {
    statics: {
        /**
         * transferring data between a client and a server.
         * @param {Object} option - The option of the request.
         * Example:
         *               Http.ajax({
         *                  method:"POST"
         *                  url: "test.ashx",
         *                  async:false,
         *                  data:"fname=Henry&lname=Ford",
         *                  success: function (msg) {
         *                     console.log(msg);
         *                  },
         *                  error:function(){
         *	
         *                  }
         *             });
         * @return {undefined}
         */
        ajax: function (option) {
            // http://www.w3.org/TR/XMLHttpRequest/       
            //http://www.w3schools.com/ajax/ajax_xmlhttprequest_send.asp
            var client = new XMLHttpRequest();
            client.onreadystatechange = function () {
                if (this.readyState == this.DONE) {
                    if ((this.status >= 200 && this.status < 300) || (this.status == 304)) {
                        // success!
                        option.success && option.success(this.responseText);
                        return;
                    }
                }
                // something went wrong
                option.error&&option.error(null);
            }
            //xmlhttp.open("POST", "ajax_test.asp", true);
            //xmlhttp.setRequestHeader("Content-type", "text/plain;charset=UTF-8");
            //xmlhttp.send("fname=Henry&lname=Ford");
            client.open(option.method||"GET", option.url, option.async||true);
            option.contentType&&client.setRequestHeader("Content-Type", option.contentType);
            client.send(option.data);
        },
        loadScript: function (option) {
            var doc = document;
            var head = doc.head || doc.getElementsByTagName("head")[0] || doc.documentElement;
            var baseElement = head.getElementsByTagName("base")[0];
            var url = option.url, callback = option.callback, charset = option.charset;
            var node = doc.createElement("script");
            if (charset) {
                node.charset = charset;
            }
            //http://msdn.microsoft.com/zh-cn/library/ie/ms536957.aspx
            node.onload = function () {
                node.onload =  null;
                head.removeChild(node);
                node = null;
                if (callback) callback()
            }

            node.async = true;
            node.src = url;
            baseElement ? head.insertBefore(node, baseElement) : head.appendChild(node);       
        },
        loadCSS: function (url, callback) {
            var head = document.getElementsByTagName('head')[0]
            var node = document.createElement('link')
            node.rel = 'stylesheet'
            node.onload = function () {
                callback();
            }
            node.onerror = function () {
                print('style is loaded. [onerror] ' + url)
            }
            node.href = url;
            head.appendChild(node)
        },
        jsonp: function (option) {
            var cbName ="KetJsonpCallback_"+ Math.random().toString().substr(2, 10);
   
            window[cbName] = function (data) {
                if (option.success) option.success(data);
                window[cbName] = null;
            }
            option.url = option.url.replace(/callback=\?/g, "callback=" + cbName);
            this.loadScript(option);
        }
    }
})

