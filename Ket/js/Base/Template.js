define("Base.Template", {
    statics: {
        parse: function(str, data) {
            var tmpl = 'var __p=[];' + 'with(obj||{}){__p.push(\'' +
                str.replace(/\\/g, '\\\\')
                    .replace(/'/g, '\\\'')
                    .replace(/<%=([\s\S]+?)%>/g, function (match, code) {
                        return '\',' + code.replace(/\\'/, '\'') + ',\'';
                    })
                .replace(/<%([\s\S]+?)%>/g, function (match, code) {
                    return '\');' + code.replace(/\\'/, '\'')
                        .replace(/[\r\n\t]/g, ' ') + '__p.push(\'';
                })
                .replace(/\r/g, '\\r')
                    .replace(/\n/g, '\\n')
                    .replace(/\t/g, '\\t') +
                    '\');}return __p.join("");',

                    func = new Function('obj', tmpl);

                    return data ? func(data) : func;
        }
    }
})