/**
 * fn:getType
 * params:0
 * return:String
 * example
 * ''.getType()//[object String]
 **/
Object.prototype.getType = function () {
    return Object.prototype.toString.call(this);
};
/**
 * fn:setScrope
 * params:0
 * return:Object
 * example
 * {a:1,b:{b:1}}.setScrope()//{a:1,b:{b:1,root:obj,top:obj},root:obj,top:obj}
 **/
Object.prototype.setScrope = function (r) {
    var root = this;
    var top = r || this;
    var o = r || this;
    for (var p in o) {
        try {
            if (o.__lookupSetter__(p) || o.__lookupGetter__(p) || !o[p])
                continue;
            if (o.hasOwnProperty(p) && p !== 'root' && p !== 'top' && o[p].getType() == '[object Object]') {
                o[p].root = root;
                o[p].top = top;
                arguments.callee.call(this, o[p]);
            }
        } catch (e) {
            console.log(e);
            console.log(p);
        }
    }
    return this;
};
/**
 * fn:trim
 * params:0|1
 * return:String
 * example:
 * '  abc  '.trim()//abc
 * * '  a b c  '.trim()//a b c
 * '  a b c  '.trim(true)//abc
 **/
String.prototype.trim = function (flag) {
    if (!flag)
        return this.replace(/(^\s+)|(\s+$)/g, '');
    return this.split(' ').join('');
};
/**
 * fn:shiftFirst
 * params:1|2
 * return:Array
 * example:
 * ['a', 'b', 'c'].shiftFirst('c')//["c", "a", "b"]
 * ['a', 'b', 'c'].shiftFirst('d')//["d", "a", "b", "c"]
 * [{id: 1, p: 'a'}, {id: 2, p: 'b'}, {id: 3, p: 'c'}].shiftFirst({id: 3, p: 'd'}, 'id')//[{id: 3, p: 'd'}, {id: 1, p: 'a'}, {id: 2, p: 'b'}]
 * [{id: 1, p: 'a'}, {id: 2, p: 'b'}].shiftFirst({id: 4, p: 'e'}, 'id')//[{id: 4, p: 'e'}, {id: 1, p: 'a'}, {id: 2, p: 'b'}]
 **/
Array.prototype.shiftFirst = function (item, key) {
    if (!item)
        throw 'bad argument item';
    switch (item.getType()) {
        case '[object Object]':
            if (!key && this.indexOf(item) == -1) {
                this.unshift(item);
                return;
            }
            if (!item[key])
                throw 'bad argument key';
            var target = this.filter(function (e) {
                if (item[key] === e[key])
                    return true;
            });
            if (target[0]) {
                this.sort(function (a, b) {
                    if (a[key] === item[key])
                        return -1;
                    if (b[key] === item[key])
                        return 1;
                });
                this[0] = item;
            }
            else
                this.unshift(item);
            break;
        default :
            if (this.indexOf(item) != -1)
                this.sort(function (a, b) {
                    if (a === item)
                        return -1;
                    if (b === item)
                        return 1;
                    return false;
                });
            else
                this.unshift(item);
            break;
    }
};
/**
 * fn:$
 * params:1|2
 * return:Array
 * example:
 * $(selector)//[node,node...]
 * $(selector,node)//[childnodeOfnode,childnodeOfnode...]
 * node.$(selector)//[childnodeOfnode,childnodeOfnode...]
 **/
HTMLElement.prototype.$ = window.$ = function (selector, root) {
    if (root)
        return Array.prototype.slice.call(root.querySelectorAll(selector));
    return Array.prototype.slice.call((this == window ? document : this).querySelectorAll(selector));
};
/**
 * fn:hasClass
 * params:1
 * return:Boolean
 * example
 * node.hasClass(className)//true|false
 **/
HTMLElement.prototype.hasClass = function (name) {
    return (this.className.search(new RegExp('\\b' + name + '\\b')) != -1);
};
/**
 * fn:toggleClass
 * params:1|2
 * return node
 * example
 * node.toggleClass(className,<true>)//<node class='className'/>
 * node.toggleClass([className],<true>)//<node class='className'/>
 * node.toggleClass([className,className...],<true>)//<node class='className,className...'/>
 * node.toggleClass(className,false)//<node/>
 * node.toggleClass([className],false)//<node/>
 * node.toggleClass([className,className...],false)//<node/>
 * **/
HTMLElement.prototype.toggleClass = function (name, flag) {
    if (!name || name.length < 1)
        return;
    var type = Object.prototype.toString.call(name);
    var cname = this.className, i, reg, len, string, value
    switch (type) {
        case '[object String]':
            len = 1;
            string = name.trim(true);
            break;
        case '[object Array]':
            len = name.length;
            break;
    }
    if (arguments.length < 2 || flag) {
        //add class
        for (i = 0; i < len; i++) {
            value = (string || name[i]).trim(true);
            reg = new RegExp('\\b' + value + '\\b');
            if (reg.test(cname))
                continue;
            else {
                if (cname == '')
                    cname = value;
                else
                    cname += ' ' + value;
            }
        }
    } else if (!flag) {
        //remove class
        if (!this.hasAttribute('class'))
            return;
        for (i = 0; i < len; i++) {
            value = (string || name[i]).trim(true);
            reg = new RegExp('\\b' + value + '\\b(:?\\s?)');
            cname = cname.replace(reg, '').replace(/\s$/, '');
            if (!cname) {
                return this.removeAttribute('class'), this;
            }
        }
    }
    return this.className = cname, this;
};
/**
 * fn:getCssValue
 * params:1|2
 * return String|Number
 * example
 * node.getCssValue('height')//100px
 * node.getCssValue('height',true)//100
 * **/
HTMLElement.prototype.getCssValue = function (key, isNum) {
    if (isNum)
        return parseInt(window.getComputedStyle(this).getPropertyValue(key));
    return window.getComputedStyle(this).getPropertyValue(key);
};
/**
 * fn:getMatchedCssValue
 * params:2
 * return String
 * example
 * node.getMatchedCssValue('matchedClassName','height')//100px|10%|5em...
 * **/
HTMLElement.prototype.getMatchedCssValue = function (selector, className) {
    var cssRuleList = Array.prototype.slice.call(window.getMatchedCSSRules(this)), res;
    cssRuleList.forEach(function (item) {
        if (item.selectorText === selector) {
            res = item.style[className];
        }
    });
    return res;
};
/**
 * fn:say
 * params:1|2
 * return undefind
 * example
 * node.say('anyEvent',param)
 * **/
HTMLElement.prototype.say = function (name, param) {
    var evt = document.createEvent('HTMLEvents');
    evt.initEvent(name, false, false);
    if (param)
        evt.param = param;
    this.dispatchEvent(evt);
};
/**
 * fn:getAbsPos
 * params:0|1
 * return Object
 * example
 * node.getAbsPos()//pos by body
 * node.getAbsPos(someTopNode)//pos by someTopNode
 * **/
HTMLElement.prototype.getAbsPos = function (parent, ele) {
    var ele = ele || this;
    var left = ele.offsetLeft;
    var top = ele.offsetTop;
    var res;
    if (ele.offsetParent != null && ele.offsetParent != parent) {
        res = arguments.callee.call(ele.offsetParent, parent);
        left += res.left;
        top += res.top;
    }
    return {left: left, top: top};
};
/**
 * fn:getTopParent
 * params:1
 * return HTMLElement
 * example
 * node.getTopParent('p')//some p element
 * **/
HTMLElement.prototype.getTopParent = function (nodeName, count) {
    var e = this, parent = e.parentElement, n = count || 0;
    if (e.nodeName.toLowerCase() == nodeName && n > 0)
        return e;
    if (!parent || parent == document.body)
        return null;
    n++;
    return arguments.callee.call(parent, nodeName, n);
};
/**
 * Class Candy
 * Property:id,os
 * fn:getQueryString,postMessage,init
 * **/
function Candy() {
    //获取系统
    var ua = navigator.appVersion;
    var os = ua.match(/(iPhone|iPad|Android)/);
    if (os) {
        if ({'iPhone': true, 'iPad': true}[os[0]])
            os = 'apple';
        else if (os[0] == 'Android')
            os = 'android';
    }
    else
        os = 'other';
    //设定系统环境
    this.os = os;
    //设定默认ID
    this.id = arguments.callee.toString().match(new RegExp('function\\s(\\w*)\\(', 'i'))[1] + '_' + (new Date().getTime());
}
/**
 * fn:getQueryString
 * params:0
 * return Object
 * example
 * http://xxx.com?a=1&b=2
 * (instance of Item).getQueryString()//{a:'1',b:'2'}
 * **/
Candy.prototype.getQueryString = function () {
    var params = location.search.substring(1);
    if (params != "") {
        params = '{"' + params.replace(/&/g, '","').replace(/=/g, '":"') + '"}';
        try {
            params = JSON.parse(params);
        } catch (e) {
            return undefined;
        }
        return params;
    }
};
/**
 * fn:postMessage
 * params:2
 * return undefind
 * example
 * (instance of Item).postMessage(someWindow,data)
 * **/
Candy.prototype.postMessage = function (someWindow, data) {
    try {
        someWindow.postMessage(data, someWindow.location.origin);
    } catch (e) {
        console.log(e);
        someWindow.postMessage(data, '*');
    }
    console.log('send by Item');
};
/**
 * fn:init
 * params:0
 * return undefind
 * example
 * must be called by class extended from Item
 * Live.prototype = new Candy();
 function Live(root,argu) {
        this.id = 'live';
        this.init();
    }
 * **/
Candy.prototype.init = function () {
    for (var p in this) {
        if (p !== 'root' && this[p].getType() == '[object Object]' && this[p].init)
            try {
                this[p].init();
            }
            catch (e) {
                console.log(this.id + '-init-' + e);
            }
    }
};
Object.freeze(Candy.prototype);