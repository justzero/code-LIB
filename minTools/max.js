/**
 * 该文件在所有js文件之前引入
 */
(function() {

    // 定义顶层命名空间
    var $ = youdao = window.youdao || {};
    
    $.ns = function(namespace, context){
        var parent = (context == null) ? window : context;
        var arr = namespace.split('.');
        for (var i = 0; i < arr.length; i++) {
            if (!!!parent[arr[i]]) {
                parent[arr[i]] = {};
            }
            parent = parent[arr[i]];
        }
        return parent;
    };
    
    $.require_module = function(namespace, context){
        var parent = (context == null) ? window : context;
        var arr = namespace.split('.');
        for (var i = 0; i < arr.length; i++) {
            if (!!!parent[arr[i]]) {
                throw new Error("required module not found: " + namespace);
            }
            parent = parent[arr[i]];
        }
        return parent;
    };
    
    $.extend = function(namespace, obj){
        if(!obj) return;
        var _ns = $.ns(namespace);
        for(var key in obj){
            if(obj.hasOwnProperty(key)){
                _ns[key] = obj[key];
            }
        }
        return _ns;
    };

})();
/**
 * youdao.util
 */
(function($) {

	var toStr = Object.prototype.toString;

	var util = {
		mode: document.compatMode,
		isString: function(str) {
			return toStr.call(str) === "[object String]";
		},
		isFunction: function(fn) {
			return toStr.call(fn) === "[object Function]";
		},
		isArray: function(arr) {
			return toStr.call(arr) === "[object Array]";
		},
		isInArray:function(arr,ele){
			if( !this.isArray(arr)){
				return false ;
			}
			for(var i=0;i<arr.length;i++){
				if(arr[i] == ele){
					return true ;
				}
			}
			return false ;
		},
		isEmptyObject: function(obj) {
			for (var k in obj) {
				if (obj.hasOwnProperty(k)) return false;
			}
			return true;
		},
		getNumberLength:function(num){
			if( isNaN(num) ){
				return 0;
			}
			num = num<0?-num:num ;
			return Math.floor(Math.log(num)/Math.log(10))+1 ;
		},
		trim: function(text) {
			return (text || "").replace(/^\s+|\s+$/g, "");
		},
		jsonToStr: function(oParam, x) {
			var pa = [];
			if (!x) var x = '&';
			for (var k in oParam) {
				if (!oParam.hasOwnProperty(k)) continue;
				pa.push(k + '=' + oParam[k]);
			}
			return pa.join(x);
		},
		comboParams: function(oParam) {
			var pa = [];
			for (var k in oParam) {
				if (!oParam.hasOwnProperty(k)) continue;
				pa.push(k + '=' + encodeURIComponent(oParam[k]));
			}
			pa.push('t=' + ( + new Date));
			return pa.join('&');
		},
		getModName: function(modNS) {
			if (util.isString(modNS)) {
				var name_list = modNS.split('.');
				return name_list[name_list.length - 1];
			}
		},
		urlToJson: function(url, x) {
			var obj = {},
			options = url;
			if (!x) x = '&';
			options = options.replace(/^[?]{1}|[#]{1}$/g, '').split(x);
			for (var i = 0, len = options.length; i < len; i++) {
				var e = options[i].split('=');
				if (e[0].length === 0) continue;
				obj[e[0]] = e.length === 1 ? '': e[1];
			}
			return obj;
		},
		/***
		 * set the feature code .
		 * St.  setFtCode('000100',0,true)  return '100100'
		 * 		setFtCode('000100',2,true)  return '001100'
		 * 		setFtCode('100100',0,false)  return '000100'
		 */
		setFtCode: function( ftCode , num , flag ){
			var length = ftCode ? ftCode.length: 0 , code = '';
			if( num >= length ){
				code = ftCode ;
				for( var i=0;i<num-length;i++){
					code += '0';
				}
				code += flag?'1':'0';
				return code ;
			}
			code = ftCode.substring(0,num);
			code += flag?'1':'0' ;
			code += ftCode.substring(num+1>=length?length:num+1,length);
			return code ;
		}
	};

	$.extend('youdao.util', util);

})(youdao);


/**
 * youdao.setting
 * 系统常量配置
 */
(function($) {

	var consts = {
		ajaxTimeout: 5,
		codeOfs: 88,
		baseUrl: "http://zhushou.youdao.com/",
		updateUrl: "http://zhushou.youdao.com/",
		logUrl: "http://zhushou.youdao.com/log",
		logType: "ARMANI_EXTENSION_ACTION",
		mmUrl: "http://www.360buy.com/product/140007.html",
		pageUrl: location.href,
		elemId: "youdaoGWZS",
		optionsID: "youdaoGWZS_options",
		serUrl: "productSense",
		updateSer: "productSense",
		baseCss: "http://zhushou.youdao.com/css/",
		commonCssName: "extension_2_0_",
		commonName: "gouwu_",
		showTime: .2,
		baseUrl_test: "./server/",
		serUrl_test: "data6.js",
		baseCss_test: "./css/",
		commonCssName_test: ""
	};

	$.extend('youdao.consts', consts);
})(youdao);


/**
 * youdao.dom
 */
(function($){
    
    var $u = $.require_module('youdao.util');
    
    var dom = {
        addClass: function(elem, classNames){
            if(elem.nodeType !== 1) return false;
            var cn1 = elem.className?$u.trim(elem.className).split(/\s+/g):[],
                cn2 = $u.trim(classNames).split(/\s+/g),
                noin = true;
            for(var i=0; i<cn2.length; i++){
                if(!this.hasClass(elem, cn2[i])){
                    cn1.push(cn2[i]);
                }
            }
            elem.className = cn1.join(' ');
        },
        removeClass: function(elem, classNames){
            if(elem.nodeType !== 1) return false;
            var cn1 = $u.trim(elem.className),
                cn2 = $u.trim(classNames).split(/\s+/g);
            for(var i=0; i<cn2.length; i++){
                if(!this.hasClass(elem, cn2[i])) continue;
                cn1 = cn1.replace(cn2[i], ' ');
            }
            elem.className = $u.trim(cn1);
        },
        hasClass: function(elem, className){
            if(elem.nodeType !== 1) return false;
            if((' '+elem.className+' ').indexOf(' '+className+' ') === -1){
                return false;
            }
            return true;
        },
        // 两个参数时： function(className, rootContext)
        getElementsByClass: function(className, tagName, rootContext){
            var cn = className, tag = tagName || '*', context = rootContext || document;
            if(arguments.length === 2){
                context = tagName || document;
                tag = '*';
            }
            var tagNodes = context.getElementsByTagName(tag),
                nodesArr = [];
            for(var i=0, l=tagNodes.length; i<l; i++){
                if(this.hasClass(tagNodes[i], cn)){
                    nodesArr.push(tagNodes[i]);
                }
            }
            return nodesArr;
        },
        getStyle: function (elem, attr){
            if(elem.attr){
                return elem.style[attr];
            }else if(elem.currentStyle){
                return elem.currentStyle[attr];
            }else if(document.defaultView && document.defaultView.getComputedStyle){
                attr=attr.replace(/([A-Z])/g,'-$1').toLowerCase();
                return document.defaultView.getComputedStyle(elem,null).getPropertyValue(attr);
            }else{
                return '';
            }
        },
        outWidth: function(el){
            var pa = ['marginLeft','paddingLeft','width','paddingRight','marginRight'],
                sum = 0;
            for(var i=0; i<pa.length;i++){
                sum += parseInt(this.getStyle(el, pa[i]), 10);
            }
            
            return sum;
        },
        outHeight: function(el){
            var pa = ['marginTop','paddingTot','height','paddingBottom','marginBottom'],
                sum = 0;
            for(var i=0; i<pa.length;i++){
                sum += parseInt(this.getStyle(el, pa[i]), 10);
            }
            
            return sum;
        },
        pageX: function (elem) {
            return elem.offsetParent ? elem.offsetLeft + dom.pageX(elem.offsetParent) : elem.offsetLeft;
        },
        pageY: function (elem) {
          return elem.offsetParent ? elem.offsetTop + dom.pageY(elem.offsetParent) : elem.offsetTop;
        },
        builderFragment: function(htmlStr, callback) {
            var div = document.createElement('div'),
                frag = document.createDocumentFragment();
            div.innerHTML = htmlStr;
            (function() {
                if (div.firstChild) {
                    frag.appendChild(div.firstChild);
                    setTimeout(arguments.callee, 0);
                } else {
                    if(youdao.isFunction(callback)){
                        callback(frag);
                    }
                }
            })();
        },
        append: function(tag, att, css, html) {
            // 须将方法绑定到元素上才可使用
            var object = document.createElement(tag); 
            for( var i in att) object[i] = att[i]; 
            for( var i in css) object.style[i] = css[i]; 
            if (html) object.innerHTML = html;
            this.appendChild(object); 
            object.append = dom.append; 
            return object; 
        }
    };
    
    $.extend('youdao.dom', dom);
    
})(youdao);




/**
 * youdao.event
 */
(function($) {
	function addEvent(element, type, handler) {
		if (element.addEventListener) {
			element.addEventListener(type, handler, false);
		} else {
			// assign each event handler a unique ID
			if (!handler.$$guid) handler.$$guid = addEvent.guid++;
			// create a hash table of event types for the element
			if (!element.events) element.events = {};
			// create a hash table of event handlers for each element/event pair
			var handlers = element.events[type];
			if (!handlers) {
				handlers = element.events[type] = {};
				// store the existing event handler (if there is one)
				if (element["on" + type]) {
					handlers[0] = element["on" + type];
				}
			}
			// store the event handler in the hash table
			handlers[handler.$$guid] = handler;
			// assign a global event handler to do all the work
			element["on" + type] = handleEvent;
		}
	};
	// a counter used to create unique IDs
	addEvent.guid = 1;

	function removeEvent(element, type, handler) {
		if (element.removeEventListener) {
			element.removeEventListener(type, handler, false);
		} else {
			// delete the event handler from the hash table
			if (element.events && element.events[type]) {
				delete element.events[type][handler.$$guid];
			}
		}
	};

	function handleEvent(event) {
		var returnValue = true;
		// grab the event object (IE uses a global event object)
		event = event || fixEvent(((this.ownerDocument || this.document || this).parentWindow || window).event);
		// get a reference to the hash table of event handlers
		var handlers = this.events[event.type];
		// execute each event handler
		for (var i in handlers) {
			this.$$handleEvent = handlers[i];
			if (this.$$handleEvent(event) === false) {
				returnValue = false;
			}
		}
		return returnValue;
	};

	function fixEvent(event) {
		// add W3C standard event methods
		event.preventDefault = fixEvent.preventDefault;
		event.stopPropagation = fixEvent.stopPropagation;
		return event;
	};
	fixEvent.preventDefault = function() {
		this.returnValue = false;
	};
	fixEvent.stopPropagation = function() {
		this.cancelBubble = true;
	};

	var event = {
		stopBubble: function(e) {
			if (e && e.stopPropagation) {
				e.stopPropagation();
			} else {
				window.event.cancelBubble = true;
			}
		},
		stopDefault: function(e) {
			if (e && e.preventDefault) {
				e.preventDefault();
			} else {
				window.event.returnValue = false;
			}
			return false;
		},
		addEvent: function(elems, type, handle) {
			if (!elems) return;
			if (elems.nodeType === 1 || elems.document) {
				this._addEvent(elems, type, handle);
				return;
			}
			for (var i = 0; i < elems.length; i++) {
				this._addEvent(elems[i], type, handle);
			}
		},
		_addEvent: addEvent 
	};

	$.extend('youdao.event', event);

})(youdao);


/**
 * youdao.ajax
 */
(function($){
    
    var $u = $.require_module('youdao.util');
    var $consts = $.require_module('youdao.consts');

    // conf{url: 'script url', params:{}, context: ctx, success: fn, error: fn}
    $.ajax = function(conf){
        var jsonpCallback = 'youdaogouwupi'+(+new Date),
            params = conf.params || {};
        params['jsonp'] = jsonpCallback;
        
        var timerHandler = null;
        
        window[jsonpCallback] = function(json){
            window.clearTimeout(timerHandler);
            if(json === null){
                if($u.isFunction(conf.error)){
                    conf.error.call(conf.context);
                }
            }else{
                if($u.isFunction(conf.success)){
                    conf.success.call(conf.context, json);
                }
            }
        };
        // use script tag send a request, imitate ajax
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = $consts.baseUrl+conf.url+'?'+$u.comboParams(params);
        script.charset = 'utf-8';
        document.getElementsByTagName('head')[0].appendChild(script);
        
        // timing starts
        var timeoutHandler = function(){
            //console.log('sorry! is time out '+constant.timeout);
            window[jsonpCallback] = function(){};
            if($u.isFunction(conf.error)){
                conf.error.call(conf.context);
            }
        };
        timerHandler = window.setTimeout(timeoutHandler, $consts.ajaxTimeout*1000);
    };
    
})(youdao);
/**
 * youdao.setting
 */
(function($){
    // 鍔ㄧ敾绠楁硶
    var Tween = {
        Quad: {
            easeIn: function(t,b,c,d){
                return c*(t/=d)*t + b;
            },
            easeOut: function(t,b,c,d){
                return -c *(t/=d)*(t-2) + b;
            },
            easeInOut: function(t,b,c,d){
                if ((t/=d/2) < 1) return c/2*t*t + b;
                return -c/2 * ((--t)*(t-2) - 1) + b;
            },
            Line: function(t,b,c,d){ 
					  return c*t/d + b; 
			},
			Back: function(t,b,c,d){
					  var s = 2.70158, w = c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
					  return w;
			}
        }
    };
    
    /**
     * 鍔ㄧ敾
     * $.animate(elem, ['left', 0, 100, '%'], 'fast', animateType, fn, ctx);
     * $.animate(GouwuDom.loading, ['right', -150, 0, 'px'], 'fast', 'easeOut', function(){}, this);
	 *json = { elem: consts.elemId, attr: ['left', -300, 0, 'px'], timer: 'normal', atp: 'easeOut', callback: function() { callback.success(); }, context: self }	;
     */
    $.addAnimate = function(json) {
        var cache = $.require_module('youdao.cache');
              cache.animate[json.elem] = cache.animate[json.elem] || [];
        var anim_list = cache.animate[json.elem];
              
        if (anim_list && anim_list.length === 0) {
            anim_list.push(json);
            $.runAnimate(json.elem);
        } else anim_list.push(json);
    };
    $.runAnimate = function(elem){
        var cache = $.require_module('youdao.cache'),
                anim_list = cache.animate[elem];
                //console.log(cache.animate);
        if (anim_list.length !== 0) {
            var data = anim_list.shift(), e;
			if (data.elem === 'body') e = document.body;
			else e = document.getElementById(data.elem);
            $.animate(e, data.attr, data.timer, data.atp, function(){ 
                data.callback();
                $.runAnimate.call(data.context, elem);
            }, data.context);
        };
    };
    $.animate = function(elem, attr, timer, atp, callback, context){
        var util = $.require_module('youdao.util');
        var spd = {'vFast': 100, 'fast': 150, 'normal': 400, 'slow': 800},
            t = 0,
			timerId,
            b = attr[1],
            c = attr[2] - attr[1],
            f = 15,
            d = spd[timer] || timer,
            s = Math.abs(Math.ceil(c/(d/f))),
            atype = atp || 'Line',
            _unit = attr.length === 4 ? attr[3] : '%';
        function run(){            
            if(t < d){
                elem.style[attr[0]] = (Math.ceil(Tween.Quad[atype](t,b,c,d)))+_unit;
                t += s;
                //window.setTimeout(run, f);
            }else{
				clearInterval(timerId);
                elem.style[attr[0]] = attr[2]+_unit;
                if(util.isFunction(callback)){
                    callback.call(context);
                }
            }
        };
		
		function fade(){
			if (t < d){
				var value = Math.ceil(Tween.Quad[atype](t,b,c,d));
				elem.style.opacity = value / 100;
				elem.style.fiter = 'alpha(opacity=' + value + ')';
				t += s;
				//window.setTimeout(fade, f);
			} else {
				clearInterval(timerId);
				elem.style.opacity = attr[2] / 100;
				elem.style.filter = 'alpha(opacity=' + attr[2] + ')';
				if(util.isFunction(callback)){
					callback.call(context);
				}
			}
		};
        if (attr[0] === 'fade') {
			timerId = window.setInterval(fade, f);
		}
		else timerId = window.setInterval(run, f);
    }
    
})(youdao);

/**
 * 简易模板
 * var string = youdao.tmpl('HtmlString', jsonData);
 * 
 * -- HtmlString as follows -----------------------
 * <ul class="<%=className%>">
 *     <% for(var i=0; i<user.length) { %>
 *         <li><%=user[i].name%></li>
 *     <% } %>
 * </ul>
 * ------------------------------------------------
 */
(function($){

    var cache = {};

    $.tmpl = function tmpl(str, data){
        //console.log(str);
        var fn = !/\W/.test(str) ?
                cache[str] = cache[str] ||
                tmpl(document.getElementById(str).innerHTML) :
            new Function("obj",
                "var p=[],print=function(){p.push.apply(p,arguments);};" +
                "with(obj){p.push('" +
                str
                    .replace(/[\r\t\n]/g, " ")
                    .split("<%").join("\t")
                    .replace(/((^|%>)[^\t]*)'/g, "$1\r")
                    .replace(/\t=(.*?)%>/g, "',$1,'")
                    .split("\t").join("');")
                    .split("%>").join("p.push('")
                    .split("\r").join("\\'")
                + "');}return p.join('');");
        return data ? fn( data ) : fn;
    };
})(youdao);
/**
 * 模块管理器
 */
(function($){
    
    var $m = $.ns('youdao.module_manager');
    var $u = $.require_module('youdao.util');

    var regedModList = [],
        _sendModEvent = function(msg){return false;},
        _receiveModEvent = function(evt){return false;};
    
    $m.regMods = function(mods){
        if(!$u.isArray(mods)) return false;
        for(var i=0, l=mods.length; i<l; i++){
            this.regMod(mods[i]);
        }
    };
    
    $m.regMod = function(mod){
        if(!!!mod.sendModEvent){
            mod.sendModEvent = _sendModEvent;
        }
        if(!!!mod.receiveModEvent){
            mod.receiveModEvent = _receiveModEvent;
        }
        
        regedModList.push(mod);
    };
    
    $m.disp = function(evt){
        for(var i=0, l=regedModList.length; i<l; i++){
            regedModList[i].receiveModEvent(evt);
        }
    };
    
})(youdao);
(function($){		
    var cache = {};                        
	cache.conf = {    
		browser : 'chrome',
		version : '2.0',
		apiVersion : '2.0',
		vendor : 'youdao',
		position: 'down',  //up & down
		flag: 0 ,// 0: no-show features; 1: show
		showLen: 3,
		searchData: '请输入想查找的商品',
		taobao: false,
		title: document.title,
		cateGory: 'wu',
		product: 'product'
		};
	cache.dom = {
	    body: document.body,
	    elem: document.body
	};
	cache.animate = {};
	cache.nosyn = {};
	$.extend('youdao.cache', cache);
})(youdao);
    

(function($) {
	
	var cs = $.require_module('youdao.consts');
	var util = $.require_module('youdao.util');
	
	var code = {
	    zero: ['0','00','000','0000','00000','000000','0000000','00000000'],
	    strReverse: function(str){
	        var r = [];
	        for(var i=0, l=str.length; i<l; i++){
	            r[r.length] = str.charAt(i);    
	        }
	        return r.reverse().join('');
	    },
	    encrypt: function(srcStr, m, rvt){
	        if(!util.isString(srcStr)) return '';
	        var uca = [];
	        for(var i=0, l=srcStr.length; i<l; i++){
	            uca[uca.length] = code.to(srcStr.charCodeAt(i), m);
	        }            
	        return rvt? code.strReverse(uca.join('')):uca.join('');
	    },
	    to: function(n, m){
	        var n1 = ''+(n+cs.codeOfs).toString(16), len = m - n1.length;
	        if(len > 0){
	            return code.zero[len-1]+n1;
	        }
	        return n1;
	    },
	    decrypt: function(srcStr, m, rvt){
	        if(!util.isString(srcStr)) return '';
	        var uca = [];
	        if (rvt) srcStr = code.strReverse(srcStr);
	        for(var i=0,j=0; i<srcStr.length; i+=m,j++){
	            var s = srcStr.substring(i, i+m);
	            uca[j] = code.tranFormat(s, m);
	      }            
	        return String.fromCharCode.apply(String, uca);
	    },
	    tranFormat: function(n, m){
	        if(n.length !== m) return 0;
	        return parseInt(n.replace(/^0+/g,''),16) - cs.codeOfs;
	    }
	};
	
	$.extend('youdao.code', code);
})(youdao);

(function($){
    
    var $u = $.require_module('youdao.util'),
        cache = $.require_module('youdao.cache');

    $.run = function(mods, callback, ctx){
        //console.log(mods);
        if($u.isArray(mods)){
            runMods(mods, callback, ctx);
        }else if($u.isString(mods)){
            runMod(mods, callback, ctx);
        }
    };
    
    $.runNoSyn = function(mods) {
        if($u.isArray(mods)){
            var mod, name, mod_list=[ ];
            for (var i=0, len=mods.length; i != len; i++) {
                mod = mods.pop();
                name = $u.getModName(mod);
                if (!cache.nosyn[name]) { mod_list.push(mod);}
                else {
                    $.conf[name] = {};
                    //console.log(mod_list, mod, mod_list.length);
                    $.conf[name].success = (mod_list.length > 1) ? mod_list.reverse() : mod_list;
                    //console.log(name, $.conf[name].success);
                    mod_list = [mod];
                }
            }
            $.run(mod_list.reverse());
        };
    };
    
    $.setCallback = function(key, callbackObj){
        $.conf[$u.getModName(key)] = callbackObj;
    };
    
    function runMod(modNS, callback, ctx){
        var mod = $.require_module(modNS);
        //console.log('mod : ',mod);
        if($u.isArray(mod) && mod.length !== 0){
        	runMods(mod, callback, ctx);
        	return;
        }
        
        if($u.isFunction(mod)){
            var name = $u.getModName(modNS),cb={};
            
            if ($.conf[name]) {
                for (var i in $.conf[name])
                    cb[i] = function() {
                        $.run($.conf[name][i]);
                    }
                mod(cb);
            } else mod();
        }
        if($u.isFunction(callback)){
            callback.apply(ctx);
        }
    }
    
    function runMods(mods, callback, ctx){
    	//console.log(mods, callback);
        for(var i=0, len = mods.length; i<len; i++){

            if(i === len-1){
                runMod(mods[i], callback, ctx);
            }else{
                runMod(mods[i]);
            }
        }
    }
    
})(youdao);

(function($) {
	var img = new Image() ;
	var logUtil={
		sendLog:function(action, elem) {
			var cache = $.require_module('youdao.cache'),
			consts = $.require_module('youdao.consts'),
			util = $.require_module('youdao.util');
			if (cache.conf.test && !cache.localConf.log) return; //test return
			var json = {
				type: consts.logType,
				action: action,
				fromSite: consts.pageUrl,
				toSite: elem.getAttribute('href') || 'none',
				product: cache.conf.product,
				position: elem.getAttribute('ps') || 'no-position',
	            browser: cache.localConf.browser || cache.conf.browser,
				version: cache.conf.version,
				vendor: cache.conf.vendor,
				cateGory: cache.conf.cateGory
			};
			if (elem.tagName === 'INPUT' && elem.getAttribute('type') === 'submit' && json.toSite === "none") {
				if (json.toSite === 'none') return true;
				else elem.removeAttribute('href');
			}
			if (elem.className === 'non' || elem.className === 'noMore') {
				return true;
			}
			var params , parameters = elem.getAttribute('params') || 'no-parameters' ;
			if( parameters === 'no-parameters' ){
				params = util.comboParams(json) ;
			}else{
				params = util.comboParams(json) + parameters ;
			}
			
			img.src = consts.logUrl + '?' + params ;
			return true;
		}
	};
	$.extend('youdao.logUtil', logUtil);
})(youdao);


(function($) {

    $.conf = {
        'init': [],
        'initGouwuContainer': [],
        '110011': ['searchMin', 'douban',  'conf', 'taobao', 'morePrice','priceData', 'resize'],
        '110000': ['searchMax','conf'],
        '111100': ['searchMin', 'sameType', 'conf' ,'taobao','morePrice',  'resize'],
        features: ['sameType'],
        featuresCode:'1',
        action: {
            '110011': [],
            '110000': [],
            '111100': []
        },
        info: {
            'priceData' : [],
            'douban' : [],
            'sameType' : []
        }
    };
    
})(youdao);

(function($) {
	var m = $.ns('youdao.modules'),
	consts = $.require_module('youdao.consts'),
	cache = $.require_module('youdao.cache');
	m.css = function() {
		var cache = $.require_module('youdao.cache');
		cache.dom.elem.append = $.dom.append;
		var elem = cache.dom.elem.append('div', {
			id: consts.elemId,
			className: cache.conf.position
		},
		{},
		''),
		showDiv = cache.dom.elem.append('div', {
			id: consts.elemId + 'Show'
		},
		{},
		'');
		cache.dom.elem = elem;
		cache.dom.show = showDiv;
		var positionWrapCtn = function() {
			if (cache.conf.position === 'down') {
				if (cache.conf.ie !== 6) cache.dom.bottom = 0 - document.body.scrollTop;
				else cache.dom.bottom = (cache.dom.bottom) ? 0: 1;
				cache.dom.elem.style.top = 'auto';
				cache.dom.elem.style.bottom = cache.dom.bottom + 'px';
				if (cache.dom.show.style.display === 'block') {
					cache.dom.show.style.bottom = (cache.conf.backCompat) ? (cache.dom.bottom + 50) + 'px': (cache.dom.bottom + 60) + 'px';
					cache.dom.show.style.top = 'auto';
				}
			} else {
				if (cache.conf.ie !== 6) cache.dom.top = document.body.scrollTop;
				else cache.dom.top = document.documentElement.scrollTop;
				cache.dom.elem.style.top = cache.dom.top + 'px';
				cache.dom.bottom = 'auto';
				if (cache.dom.show.style.display === 'block') {
					cache.dom.show.style.top = (cache.conf.backCompat) ? (cache.dom.top + 50) + 'px': (cache.dom.top + 60) + 'px';
					cache.dom.show.style.bottom = 'auto';
				}
			}
		};
		if (cache.conf.ie === 6 || cache.conf.backCompat) {
			positionWrapCtn();
			$.event.addEvent(window, 'scroll', function(event) {
				positionWrapCtn();
			});
			$.event.addEvent(window, 'resize', function(event) {
				positionWrapCtn();
			});
		} else {
			cache.dom.elem.style.position = 'fixed';
			cache.dom.show.style.position = 'fixed';
		}
	};
})(youdao);


(function($) {
	var modules = $.ns('youdao.modules'),
	cache = $.require_module('youdao.cache');
	cache.nosyn.RequestPriceInfo = true;
	modules.RequestPriceInfo = function(callback) {
		var cache = $.require_module('youdao.cache'),
		consts = $.require_module('youdao.consts'),
		code = $.require_module('youdao.code'),
		conf = cache.conf,
		self = this,
		o = ['t=' + conf.title, 'k=' + conf['keywords'], 'd=' + conf['description']],
		k = code.encrypt(o.join('^&'), 4, false),
		u = code.encrypt(consts.pageUrl, 2, true),
		l = 1900 - u.length;
		k = (k.length > l) ? k.substr(0, l) : k;
		//console.log(callback, $.conf);
		var json = {
			url: consts.serUrl,
			params: {
				'browser': cache.localConf.browser || conf.browser,
				'version': conf.version,
				'vendor': conf.vendor,
				'av': conf.apiVersion,
				m: u,
				k: k
			},
			context: self,
			success: function(json) {
				cache.data = json;
				callback.success();
			},
			error: function() {
				cache.data = {
					code: '110000'
				};
				callback.success();
			}
		};
		if (cache.conf.test === 2) json.params = {
			'mmurl': consts.mmUrl
		};
		if (cache.conf.test === 1 && cache.localConf.filename) json.params = {
			filename: cache.localConf.filename
		};
		$.ajax(json);
	};

})(youdao);


(function($) {
	var m = $.ns('youdao.modules'),
	cache = $.require_module('youdao.cache');
	cache.nosyn.cssLink = true;
	m.cssLink = function(callback) {
		var dom = $.require_module('youdao.dom'),
		css = document.createElement('link');
		css.type = 'text/css';
		css.rel = 'stylesheet';
		if (!cache.conf.backCompat){
		    css.href = consts.baseCss + consts.commonCssName + cache.conf.browser + '.css';
			if (cache.conf.ie === 6)
		    css.href = consts.baseCss + consts.commonCssName + cache.conf.browser + '_6.css';
		} else
			css.href = consts.baseCss + consts.commonCssName + 'ie_bc.css';
		document.getElementsByTagName('head')[0].appendChild(css);
		var div = document.createElement('div');
		div.className = 'youdaoGWZSTestCss';
		document.body.appendChild(div);
		var CSSload = function(link, callback) {
			var cssLoaded = false;
			try {
				if (dom.getStyle(div, 'height') === '1px') {
					cssLoaded = true;
				}
			}
			catch(ex) {}
			if (cssLoaded) {
				callback();
			} else {
				setTimeout(function() {
					CSSload(link, callback);
				},
				100);
			}
		};
		//if (!cache.conf.backCompat)
		    CSSload(css, callback.success);
		//else
		//	alert('this is a bad page!');
		document.getElementById('testBt').innerHTML = 'css Link href : ' + css.href;
	};
})(youdao);


(function($) {

	var m = $.ns('youdao.modules');

	m.info = function() {
		//console.log('info');
		var consts = $.require_module('youdao.consts');
		var util = $.require_module('youdao.util');
		var cache = $.require_module('youdao.cache');
		var infoConf = cache.conf;
		var testMod = function(json) {
			if (!json.test) {
				cache.conf.test = 0;
				return;
			};
			if (json.test === '1') {
				cache.conf.test = 1;
				consts.baseUrl = json.baseUrl || consts.baseUrl_test;
				consts.serUrl = json.serUrl || consts.serUrl_test;
				consts.baseCss = json.baseCss || consts.baseCss_test;
				consts.commonCssName = json.commonCssName || consts.commonCssName_test;
				return;
			};
			if (json.test === '2') {
				cache.conf.test = 2;
				if (json.mmUrl) consts.mmUrl = json.mmUrl;
				return;
			};
		};
		var options = document.getElementById(consts.optionsID);
		if (options) {
			var json = util.urlToJson(options.innerHTML, ";");
			cache.localConf = json;
			testMod(json);
			for (var item in json)
				if (cache.conf[item]) cache.conf[item] = json[item];
		}
		var w = cache.dom.body.style.width;
		cache.dom.body.style.width = '100%';
		cache.dom.bodyWidth = cache.dom.body.offsetWidth;
		cache.dom.body.style.width = w;
		cache.conf.ie = (function() {
			var undef, v = 3,
			div = document.createElement('div'),
			all = div.getElementsByTagName('i');
			while (
			div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->', all[0]);
			return v > 4 ? v: undef;
		} ());
		if (cache.conf.ie) {
			cache.conf.browser = 'ie';
			if (document.compatMode === 'BackCompat') {
				cache.conf.backCompat = true;
			}
		}
	};

	$.conf.init.push('youdao.modules.info');

})(youdao);


(function($) {
	var m = $.ns('youdao.modules');	
	m.metas = function() {
		var cache = $.require_module('youdao.cache');
		var util = $.require_module('youdao.util');
		
		var elems = document.getElementsByTagName('meta'),
			metas = {}, key, _host = window.location.hostname;
		for (var i=0, len=elems.length; i<len; i++) {
			key = elems[i].name;
			if (!util.isString(key)) continue;
			key = key.toLowerCase();
			metas[key] = '' + elems[i].getAttribute('content');
			if (key === 'keywords' && /(taobao\.com)|(tmall\.com)/.test(_host)) {
				var tmp = getTaobaoInfo();
				if (tmp !== '') metas[key] = tmp;
				cache.conf.taobao = true;
			};
		};
		for (i in metas) cache.conf[i] = metas[i];
		function getTaobaoInfo() {
			var o = document.getElementById('attributes');
	        if(!o) return '';
	        var htmlstr = o.innerHTML || '';
	        var isbn = htmlstr.match(/ISBN[^<]+?(\d+)/); 
	        if (isbn) return '@ISBN='+isbn[1] ;
	        var ret='';
	        var name=htmlstr.match(/名称[^\"][^<]+/); ; 
	        if (name ) ret=name;
	        var brand=htmlstr.match(/品牌[^\"][^<]+/); 
	        if (brand ) ret+=' '+brand;
	        var model=htmlstr.match(/型号[^\"][^<]+/);
	        if (model ) ret+=' '+model;
	        ret=ret.replace('&nbsp;',' ').replace('&nbsp;',' ').replace('&nbsp;',' ');
	        return ret;
		};
	};
	$.conf.init.push('youdao.modules.metas');
})(youdao);

(function($) {
	var m = $.ns('youdao.modules'),
	cache = $.require_module('youdao.cache');
	cache.nosyn.gouwuInit = true;
	m.gouwuInit = function(callback) {
		var util = $.require_module('youdao.util'),
		consts = $.require_module('youdao.consts'),
		features = $.require_module('youdao.consts'),
		elem = cache.dom.elem,
		str = '',
		div = document.getElementById(consts.commonName + 'contentBar'),
		body = document.body;
		cache.nosyn.gouwuInit = true;
		for (var i in $.conf[cache.data.code])
		str += $.tm[$.conf[cache.data.code][i]] || '';
		if (cache.data.urlPriceList && cache.data.urlPriceList.length < cache.conf.showLen) cache.conf.showLen = cache.data.urlPriceList.length;
		var tmpData = cache.data.urlPriceList;
		if (tmpData && tmpData.length !== 0) {
			for (var i = 0; i < tmpData.length; i++)
			if (!tmpData[i].num) tmpData[i].num = 0;
		};
		var data = {
			data: cache.data,
			conf: cache.conf.position || 'down',
			taobao: cache.conf.taobao,
			name: consts.commonName,
			len: cache.conf.showLen,
			value: cache.conf.searchData
		};
		var features = $.conf.features;
		//set features show flag
		
		/***
		 * get features to be shown no
		 * 0:表示无新特征提示
		 * i:表示要显示的新特征提示为：features[i-1]
		 */
		var getFeatureNo = function(){
        	var localFtCode = cache.localConf.featureCode?cache.localConf.featureCode:'' , ftCode = $.conf.featuresCode ,length = Math.min(localFtCode.length , ftCode.length) ;
        	for(var i = 0 ; i < length; i++){
        		if( ftCode.charAt(i)==='1' && localFtCode.charAt(i)==='0' ){
        			return (i+1) ;
        		}
        	}
        	if( localFtCode.length < ftCode.length ){
        		// to be done ----将localFtCode补全（即补零）lazy way
        		for(;i<ftCode.length;i++){
        			if( ftCode.charAt(i)==='1' ){
        				return (i+1) ;
        			}
        		}
        	}
        	return 0 ;
        } ;
        cache.conf.flag = getFeatureNo() ;
//        console.log('set flag'+cache.conf.flag);
        
		if (cache.conf.flag) {
			$.tm.event.tmp = $.tm.event[features[cache.conf.flag - 1]];
			$.tm.event[features[cache.conf.flag - 1]] = function() {};
		}
		div.innerHTML = $.tmpl(str, data);
		for (var i in $.conf[cache.data.code]) {
			var code = $.conf[cache.data.code][i],
			fn = $.tm.event[code];
			if (fn && util.isFunction(fn)) {
				/*if (!cache.conf.flag || features[cache.conf.flag-1] !== code) */
				fn();
			}
		}

		elem.style.opacity = 1;
		elem.style.fiter = 'alpha(opacity=100)';
		cache.dom.contentWidth = div.offsetWidth;
		elem.style.overflow = 'hidden';
		document.getElementById(consts.commonName + 'close').style.display = 'block';
		json = {
			elem: cache.dom.elem.id,
			attr: ['height', 0, 50, 'px'],
			timer: 'fast',
			atp: 'Line',
			context: this,
			callback: function() {
				//div.style.overflow = 'visible';
				cache.dom.elem.style.overflow = 'visible';
				callback.success();
			}
		};
		$.addAnimate(json);
		if ((fn = $.tm.event.up[cache.data.code]) && util.isFunction(fn)) fn();
	};
})(youdao);


(function($) { 
    $.ctrl = {
        attr: ['top', 'right', 'bottom', 'left'],
        setAttr: function(json, html, fn) {
            var cache = $.require_module('youdao.cache'),
            div = cache.dom.show;
            if ((json.left + json.width + 10) > cache.dom.bodyWidth)
                json.left = cache.dom.bodyWidth - json.width - 10;
			if (div.className === json.css && div.style.left === json.left + 'px') {
            	this.cleanTime();
				return;
			};
			this.cleanTime();
            this.clean();
            for (var i in json) {
               if (i === 'css') {
                   div.className = json[i];
                   continue;
               }
               if (json[i] !== 'auto')
                    div.style[i] = json[i] + 'px';
               else div.style[i] = 'auto';
            }
			if (cache.conf.position === 'up') {
				div.style.top = (cache.conf.ie === 6 || cache.conf.backCompat) ? cache.dom.top + 50 + 'px' : '50px';
				if (cache.conf.ie === 6 && !cache.conf.backCompat) div.style.top = cache.dom.top + 60 + 'px';
				div.style.bottom = 'auto';
			} else {
				div.style.bottom = (cache.conf.ie === 6 || cache.conf.backCompat) ? cache.dom.bottom + 50 + 'px' : '50px';
				if (cache.conf.ie === 6 && !cache.conf.backCompat) div.style.bottom = cache.dom.bottom + 60 + 'px';
				div.style.top = 'auto';
			}
            div.innerHTML = html;
			if (div.style.display === 'none'){
				div.style.display = 'block';
				var options = {
					elem: div.id,
					attr: ['fade', 0, 100, 'px'],
					timer: 'fast',
					atp: 'Line',
					context: this,
					callback: function(){}
				};
				if (cache.conf.ie !== 6) $.addAnimate(options);
			};
            if (fn) fn();
        },
        delayClean: function(timer, fn) {
            var util = $.require_module('youdao.util');
            if (fn && util.isFunction(fn))
                this.timeId = setTimeout(function() { fn(); $.ctrl.clean(); }, timer);
            else 
                this.timeId = setTimeout($.ctrl.clean, timer);
        },
        cleanTime: function() {
            if (this.timeId) {
                //console.log('11');
                clearTimeout(this.timeId);
                this.timeId = '';
            };
        },
        clean: function( ) {
            var cache = $.require_module('youdao.cache'),
            consts = $.require_module('youdao.consts'),
            name = consts.commonName,
            div = cache.dom.show;
            if (div.className === "youdaoGWZSdouban"){ 
				var tmpE = document.getElementById(name + 'douban');
			}else if(div.className==="youdaoGWZSsameType"){
				var tmpE = document.getElementById(name + 'sameType');
			}
			else var tmpE = document.getElementById(name + div.className);
			if (tmpE && tmpE.className === 'enter') tmpE.className = '';
            //div.innerHTML = '';
			if (!cache.localConf || !cache.localConf.popofade || cache.localConf.popofade !== "false") {
            	div.className = '';
				div.style.display = 'none';
			};
        },
        timeId: ''
    };
})(youdao);

/// 需要修改，没有elem注册

// 当插件条渲染好之后，调用该模块，实现后续动作
(function($){
    var m = $.ns('youdao.modules'),
         cache = $.require_module('youdao.cache');
         cache.nosyn.gouwuExperience = true;
    m.gouwuExperience = function(callback){
        $.runNoSyn($.conf.action[cache.data.code]);
		callback.success();
    };
})(youdao);
//test

(function($){
    var m = $.ns('youdao.modules'), consts = $.require_module('youdao.consts'),
         cache = $.require_module('youdao.cache'),util = $.require_module('youdao.util');
    m.newFeatures = function(){
        if (cache.conf.flag && $.conf.features.length !== 0 ) {
            var showFeatures = function(num) {
                    var item = $.conf.features[num], dom = $.require_module('youdao.dom'), fDiv = cache.dom.body.append('div', { id: consts.commonName + 'features' },{ position: 'absolute' });
                    elem = document.getElementById(consts.commonName + item);
                    
                   //当同款数目为0时，不触发新功能提示；同时将同款服饰按钮的原有事件恢复。
                    if( item === 'sameType' && ( !cache.data.sameType.sameTypeNum ||cache.data.sameType.sameTypeNum <= 0 )){
                    	var code = $.conf.features[++cache.conf.flag - 1];
            			$.tm.event[code] = $.tm.event.tmp;
            			$.tm.event.tmp();
                    	return ;
                    }
                    
                    cache.dom.fDiv = fDiv;
                    fDiv.flag = cache.conf.flag;
                    if (elem.className === 'noMore') {
                        var code = $.conf.features[cache.conf.flag - 1];
                        $.tm.event[code] = $.tm.event.tmp;
                        $.tm.event.tmp();
                        return;
                    }
                    if (cache.conf.ie !== 6) fDiv.style.position = 'fixed';
                    var elemP = dom.pageX(elem) , elemWidth = elem.offsetWidth , leftX, pageWidth = cache.dom.bodyWidth -10;                    
                    var attr = {
                        width: 282,
                        height: 'auto',
                        left: dom.pageX(elem) - elemWidth*2/3
                    };
                    attr.left = elemP + elemWidth/2 - attr.width/3 ;
                	leftX = elemWidth/3 -12;
                    if( elemP < attr.width ){
                    	attr.left = elemP + elemWidth/2 - attr.width/3 ;
                    	leftX = attr.width/3 -12;
                    }
                    if(elemP + attr.width > pageWidth ){
                    	attr.left = pageWidth - attr.width ;
                    	leftX = attr.width - ( pageWidth- (elemP+elemWidth/2))-12 ;
                    }
                    console.log('left:'+attr.left);
                    console.log('leftX:'+leftX );
                    if (!cache.conf.position || cache.conf.position === 'down') {
                    	attr.top = (cache.conf.ie === 6) ? cache.dom.top - attr.height - 2 : 'auto'; attr.bottom = 55;
                    }else { 
                    	attr.top = (cache.conf.ie === 6) ? cache.dom.top + 70 : 70; attr.bottom = 'auto'; 
                    }
                    for (var i in attr) {
                        if (attr[i] !== 'auto')
                            fDiv.style[i] = attr[i] + 'px';
                        else fDiv.style[i] = 'auto';
                    }
                    fDiv.className = 'features';
                    var str = $.tm.popo({leftX: leftX, type: 1}, $.tm.features.tmple);
                    fDiv.innerHTML = $.tmpl( str ,{info: tipWord[item]?tipWord[item]:tipWord['default']});
                    $.tm.features.event(fDiv);
                    
            };
            var tipWord = {
            	"sameType":['有道购物助手为您在淘宝找到:',cache.data.sameType.sameTypeNum+'件 同款服饰','同款服饰','浏览淘宝服饰页面时自动为您查找淘宝同款。','http://zhushou.youdao.com/features?keyfrom=help'],
            	"default":['有道购物助手为您在淘宝找到:','XXX 同款服饰','XXXX','浏览淘宝服饰页面时自动为您查找淘宝同款。','http://zhushou.youdao.com/features?keyfrom=help'],
            };
            showFeatures(cache.conf.flag -1);
        };
    };
//    $.conf.action['110011'].push('youdao.modules.newFeatures');
    $.conf.action['111100'].push('youdao.modules.newFeatures');
})(youdao);

(function($) {
	var m = $.ns('youdao.modules'),
	cache = $.require_module('youdao.cache'),
	consts = $.require_module('youdao.consts');
	cache.nosyn.updatePrice = true;
	m.updatePrice = function(callback) {
		consts.baseUrl = consts.updateUrl;
		var data = cache.data.urlPriceList,

		qPrice = function(list) {
			var len = list.length,
			arr = [];
			for (var i = 0; i < len; i++) {
				var price = data[list[i]],
				l = price.items.length;
				while (price.num < l && ! price.items[price.num].available)++price.num;
				if (price.num >= l) {
					price.html = '缺货';
					price.available = "false";
					price.num = 0;
				} else {
					if (price.items[price.num].available && price.items[price.num].newPrice) price.html = price.items[price.num].newPrice + '元';
					else arr.push(list[i]);
				}
			}
			if (arr.length !== 0) priceUpdate(arr);
			else show(function() {
				document.getElementById(consts.commonName + 'priceData').innerHTML = $.tmpl($.tm.onePrice, {
					data: cache.data,
					name: consts.commonName,
					len: cache.conf.showLen
				});
				$.tm.event.priceData();
			});
		},

		priceUpdate = function(list) {
			var arr = [],
			tmp = {};
			for (var i = 0, len = list.length; i < len; i++) {
				var price = data[list[i]];
				tmp[price.items[price.num].cpsUrl] = list[i];
				price.items[price.num].newPrice = price.items[price.num].price;
				arr.push(price.items[price.num].cpsUrl);
			}
			$.ajax({
				url: consts.updateSer,
				params: {
					t: new Date().getTime(),
					updatePrice: true,
					urls: arr.join('|@|')
				},
				context: this,
				success: function(json) {
					$.ajax({
						url: consts.updateSer,
						params: {
							t: new Date().getTime(),
							updatePrice: true,
							urls: arr.join('|@|')
						},
						context: this,
						success: function(json) {
							for (var key in json) {
								var p = data[tmp[key]];
								if (p.items[p.num].price !== json[key].price || p.items[p.num].available !== json[key].avb) {
									p.items[p.num].priceUpDate = true;
									p.priceUpDate = true;
								}
								p.items[p.num].available = json[key].avb;
								p.items[p.num].price = p.items[p.num].newPrice = json[key].price;
							}
							qPrice(list);
							callback.success();
						},
						error: function() {
							if (callback.error) callback.error();
						}
					});
				},
				error: function() {
					if (callback.error) callback.error();
				}
			});
		},
		show = function(fn) {
			var x = (cache.conf.position === 'up') ? - 1: 1;
			var json = {
				elem: consts.commonName + 'priceData',
				attr: ['top', 0, 50 * x, 'px'],
				timer: 'fast',
				atp: 'Line',
				context: this,
				callback: function() {
					fn();
					$.addAnimate({
						elem: consts.commonName + 'priceData',
						attr: ['top', 50 * x, 0, 'px'],
						timer: 'fast',
						atp: 'Back',
						context: this,
						callback: function() {
							$.tm.lowPriceResize();
							$.event.addEvent(window, 'resize', function() {
								youdao.tm.lowPriceResize();
							});

						}
					});
				}
			};
			$.addAnimate(json);
		};
		var arrS = [];
		for (var i = 0; i < cache.conf.showLen; i++) arrS.push(i);
		qPrice(arrS);
	};
	if (!cache.localConf || ! cache.localConf.update || cache.localConf.update !== 'false') {
		$.conf.action['110011'].push('youdao.modules.updatePrice');
	}
})(youdao);


(function($) {
	var m = $.ns('youdao.modules'),
	cache = $.require_module('youdao.cache'),
	consts = $.require_module('youdao.consts');
	cache.nosyn.updateSameType = true;
	m.updateSameType = function(callback) {
		

		show = function(fn) {
			var x = (cache.conf.position === 'up') ? - 1: 1;
			var json = {
				elem: consts.commonName + 'sameType',
				attr: ['top', 0, 50 * x, 'px'],
				timer: 'fast',
				atp: 'Line',
				context: this,
				callback: function() {
					fn();
					$.addAnimate({
						elem: consts.commonName + 'sameType',
						attr: ['top', 50 * x, 0, 'px'],
						timer: 'fast',
						atp: 'Back',
						context: this,
						callback: function() {
							$.tm.sameTypeTip('block');
							$.event.addEvent(window, 'resize', function() {
								youdao.tm.sameTypeTip('block');
							});

						}
					});
				}
			};
			$.addAnimate(json);
		};
		
//		show(function() {
//			$.tm.event.sameType();
//		});
		$.tm.sameTypeTip('block');
		$.event.addEvent(window, 'resize', function() {
			youdao.tm.sameTypeTip('block');
		});
	};
	if (!cache.localConf || ! cache.localConf.update || cache.localConf.update !== 'false') {
		$.conf.action['111100'].push('youdao.modules.updateSameType');
	}
})(youdao);


(function($) {
	var m = $.ns('youdao.modules'),
	cache = $.require_module('youdao.cache'),
	consts = $.require_module('youdao.consts'),
	util = $.require_module('youdao.util');
	m.gouwuLog = function() {
		if (cache.conf.test && !cache.localConf.log) return; //test return
		var img = new Image();
		/*** set log ***/
		var sendLog = function(action, elem) {
			var json = {
				type: consts.logType,
				action: action,
				fromSite: consts.pageUrl,
				toSite: elem.getAttribute('href') || 'none',
				product: cache.conf.product,
				position: elem.getAttribute('ps') || 'no-position',
                browser: cache.localConf.browser || cache.conf.browser,
				version: cache.conf.version,
				vendor: cache.conf.vendor,
				cateGory: cache.conf.cateGory,
			};
			
			if (elem.tagName === 'INPUT' && elem.getAttribute('type') === 'submit' && json.toSite === "none") {
				if (json.toSite === 'none') return true;
				else elem.removeAttribute('href');
			}
			if (elem.className === 'non' || elem.className === 'noMore') {
				return true;
			}
			
			var params , parameters = elem.getAttribute('params') || 'no-parameters' ;
			if( parameters === 'no-parameters' ){
				params = util.comboParams(json) ;
			}else{
				params = util.comboParams(json) + '&'+parameters ;
			}
			
			img.src = consts.logUrl + '?' + params ;
			return true;
		};
		/*** �ݹ�ڵ� ***/
		var startLog = function(type, elem) {
			if (!elem.tagName || ! elem) return;
			var action = elem.getAttribute(type);
			if (action) {
				sendLog(action, elem);
			};
			startLog(type, elem.parentNode);
		};
		/*** addEvent ***/
		$.event.addEvent(window, 'click', function(e) {
			e = e || window.event;
			var target = e.target || e.srcElement;
			startLog('clkAction', target);
		});
		$.event.addEvent(cache.dom.elem, 'mouseover', function(e) {
			e = e || window.event;
			var target = e.target || e.srcElement;
			startLog('hoverAction', target);
		});
	};
	
})(youdao);


(function($) {
	if (!$.tm) {
		$.tm = {
			info: {},
			event: {},
			features: {}
		};
	}
	// gouwuzhushou loading...
	var consts = $.require_module('youdao.consts'),
	name = consts.commonName,
	cache = $.require_module('youdao.cache');

	/***
 * 弹出框通用样式模版 
 * */
	$.tm.popo = function(att, str) {
		var upStyle = downStyle = 'display: none;',
		span = '';
		if (cache.dom.elem.className === 'down') downStyle = '';
		else upStyle = '';
		if (att.type === 2) span = '<span class="youdaoGWZS_topIcon"><%=logo%></span>';
		return '<div class="youdaoGWZS_st' + att.type + '">\
                             <div class="youdaoGWZS_top1">\
                             <div class="youdaoGWZS_top2"><div class="youdaoGWZS_upPoint" style="left:' + att.leftX + 'px; ' + upStyle + '"></div>' + span + '</div>\
                             </div>\
                             <div class="youdaoGWZS_content">' + str + '</div>\
                             <div class="youdaoGWZS_bottom1"><div class="youdaoGWZS_bottom2"><div class="youdaoGWZS_downPoint" style="left:' + att.leftX + 'px; ' + downStyle + '"></div></div></div>';
	};

	/***
 * loading 过程模版 
 * */
	$.tm.load = '<span class="youdaoGWBar_left"></span>\
	<div class="youdaoGWBar_mid">\
    <a id="<%=name%>icon" class="hide" href="http://gouwu.youdao.com/?keyfrom=extension" clkAction="CLICK_LOGO" target="_blank" ref="icon"> </a>\
    <div id="<%=name%>contentBar">\
    <span class="youdaoGWLoad" > </span>\
    </div>\
    <span id="<%=name%>close" class="close" style="display: none;" clkAction="CLOSE" ref="close"> </span>\
    <span id="<%=name%>lowPrice" ref="end"> </span>\
    <span id="<%=name%>sameTypeTip" ref="end"> <span id="<%=name%>sameTypeTipContent"></span> </span>\
	</div>\
	<span class="youdaoGWBar_right"></span>\
';
	$.tm.event.load = function() {
		$.event.addEvent(document.getElementById(name + 'close'), 'click', function() {
			var cache = $.require_module('youdao.cache'),
			div = document.getElementById(name + 'contentBar'),
			json,
			close = document.getElementById(name + 'close'),
			icon = document.getElementById(name + 'icon'),
			util = $.require_module('youdao.util');
			/* * *
	 			 * open animation
	 			 * */
			if (close.name === '1') {
				div.style.display = 'block';
				icon.className = 'hide';
				json = {
					elem: div.id,
					attr: ['width', 1, cache.dom.contentWidth, 'px'],
					timer: 'normal',
					atp: 'Line',
					callback: function() {
						close.className = 'close';
						cache.dom.elem.style.overflow = div.style.overflow = 'visible';
						close.name = '0';
						$.tm.lowPriceResize();
						$.tm.sameTypeTip('block');
					},
					context: this
				};
				$.addAnimate(json);
			} else { // close animation
				div.style.overflow = 'hidden';
				$.tm.lowPriceResize('none');
				$.tm.sameTypeTip('none');
				if (cache.dom.fDiv && cache.dom.fDiv.style.display !== 'none') cache.dom.fDiv.style.display = 'none';
				json = {
					elem: div.id,
					attr: ['width', cache.dom.contentWidth, 1, 'px'],
					timer: 'normal',
					atp: 'Line',
					callback: function() {
						close.className = 'open';
						icon.className = 'show';
						close.name = '1';
						cache.dom.elem.style.overflow = div.style.overflow = 'hidden';
						//div.style.display = 'none'; 
					},
					context: this
				};
				$.addAnimate(json);
				if (e = document.getElementById(name + 'features')) {
					if (util.isFunction(e.closeFdiv)) e.closeFdiv();
				};
			};
			return false;
		});
	};

	/***
 * logo 模版 
 * */
	$.tm.logo = '<a id="<%=name%>logo" href="http://gouwu.youdao.com/" target="_blank" ref="logo"> </a>';

	/* * *
	 * button common function
	 * */
	var youdao_input_focus = function() {
		var fld = document.getElementById(name + 'fld');
		fld.className = 'focus';
		var txt = this.value;
		if (txt === '请输入想查找的商品') this.value = '';
	};
	var youdao_input_blur = function() {
		var fld = document.getElementById(name + 'fld');
		fld.className = '';
		this.value = (/^\s*$/g).test(this.value) ? '请输入想查找的商品': this.value;
		cache.conf.searchData = this.value;
	};
	var youdao_input_click = function(e) {
		var val = e.value;
		if ((/^\s*$/).test(val) || val === '请输入想查找的商品') {
			youdao_input_alert(e);
			return false;
		};
		return true;
	};
	var youdao_input_alert = function(e) {
		var counter = 0;
		var colorArr = ['#F2C100', '#BABABA'];
		var el = document.getElementById(name + 'fld');
		var timer = setInterval(function() {
			el.style.borderColor = colorArr[counter % 2];
			counter++;
			if (counter > 7) {
				clearInterval(timer);
				el.style.cssText = '';
			}
		},
		100);
	};

	/***
 * searchMin 模版 
 * */
	$.tm.searchMin = '<span id="<%=name%>searchMin" title="搜索" clkAction="SHOW_SEARCH"> </span>';
	$.tm.info.searchMin = '<form id="<%=name%>searchMinForm" action="http://gouwu.youdao.com/search?keyfrom=extension" target="_blank" method="get">\
	                                <fieldset id="<%=name%>fld">\
                                    <input id="<%=name%>searchInfo" autocomplete="off" name="q" type="text" value="<%=value%>" />\
									<input name="keyfrom" value="extension" type="hidden" />\
                                    <input id="<%=name%>searchBt" type="submit" clkAction="SEARCH" value="搜商品" />\
									</fieldset>\
                                    </form>';
	$.tm.event.searchMin = function() {
		$.event.addEvent(document.getElementById(name + 'searchMin'), 'click', function() {
			var cache = $.require_module('youdao.cache'),
			div = cache.dom.show,
			json = {
				css: 'youdao',
				value: cache.conf.searchData,
				name: name
			},
			consts = $.require_module('youdao.consts'),
			timer = consts.showTime * 1000,
			str = $.tm.popo({
				leftX: 40,
				type: 1
			},
			$.tm.info.searchMin),
			html = $.tmpl(str, json);
			if (div.style.display === 'block' && div.className === 'searchMin') {
				$.ctrl.clean();
				return;
			};
			var attr = {
				css: 'searchMin',
				width: 280,
				height: 'auto',
				left: dom.pageX(this) - 35
			};
			$.ctrl.setAttr(attr, html, function() {
				document.getElementById(name + 'searchMin').className = 'enter';
			});
			document.getElementById(name + 'searchInfo').onfocus = youdao_input_focus;
			document.getElementById(name + 'searchInfo').onblur = youdao_input_blur;
			document.getElementById(name + 'searchBt').onclick = function() {
				var el = document.getElementById(name + 'searchInfo');
				if (!youdao_input_click(el)) return false;
				else this.setAttribute('href', 'http://gouwu.youdao.com/search?q=' + el.value);
			};
			div.onmouseout = function() {
				if (document.getElementById(name + 'searchInfo')) {
					//console.log( name );
					cache.conf.searchData = (/^\s*$/g).test(document.getElementById(name + 'searchInfo').value) ? '请输入想查找的商品': document.getElementById(name + 'searchInfo').value;
				};
				$.ctrl.delayClean(timer, function() {
					div.onmouseout = function() {
						$.ctrl.delayClean(timer);
					};
				});
			};
		});
		$.event.addEvent(document.getElementById(name + 'searchMin'), 'mouseout', function() {
			var consts = $.require_module('youdao.consts'),
			timer = consts.showTime * 1000,
			cache = $.require_module('youdao.cache'),
			div = cache.dom.show;
			if (document.getElementById(name + 'searchInfo')) {
				//console.log( name );
				cache.conf.searchData = document.getElementById(name + 'searchInfo').value;
			};
			$.ctrl.delayClean(timer, function() {
				div.onmouseout = function() {
					$.ctrl.delayClean(timer);
				};
			});
		});
	};

	/***
 * searchMax 模版 
 * */
	$.tm.searchMax = '<% var addr = "http://gouwu.youdao.com/search?keyfrom=extension", bt = "搜商品"; if (taobao) { addr="http://s.taobao.com/search?keyfrom=extension"; bt="搜淘宝"; } %>\
				 <form id="<%=name%>searchMax" action="<%=addr%>" target="_blank" method="get">\
					        <fieldset id="<%=name%>fld">\
							<input id="<%=name%>sMaxInfo" autocomplete="off" name="q" type="text" value="<%=value%>" />\
							<input name="keyfrom" value="extension" type="hidden" />\
                            <input id="<%=name%>sMaxBt" type="submit" clkAction="SEARCH" value="<%=bt%>" />\
							</fieldset>\
							</form>';
	$.tm.event.searchMax = function() {
		$.event.addEvent(document.getElementById(name + 'sMaxInfo'), 'keypress', function(e) {
			//console.log(e);
		});
		document.getElementById(name + 'sMaxInfo').onblur = youdao_input_blur;
		document.getElementById(name + 'sMaxInfo').onfocus = youdao_input_focus;
		document.getElementById(name + 'sMaxBt').onclick = function() {
			var el = document.getElementById(name + 'sMaxInfo');
			if (!youdao_input_click(el)) return false;
			else this.setAttribute('href', document.getElementById(name + 'searchMax').getAttribute('action') + '?q=' + el.value);
		};
	};

	/***
 * douban 模版 
 * */
	$.tm.douban = '<span id="<%=name%>douban" <% if (!data.douban || !data.douban.doubanReview.summary) {  data.douban = { doubanRate : ""}; %> class="noMore" <% } else data.douban.doubanRate += "分"; %> hoverAction="SHOW_DOUBAN" ><%=data.douban.doubanRate%></span>';
	$.tm.info.douban = '<ul><li class="douban1">\
                      <% ps = "0 " + (parseInt(rate) * 15 - 150) + "px"; %>\
                      <span class="bookStar" style="background-position: <%=ps%>;"></span>\
                      <span style=" font-size: 14px; color: #cc0000;"><%=rate%></span><span style="font-size: 12px; color: #666;">(<%=rateCount%>人)</span>\
					  </li>\
                      <li class="douban2">本书热门书评</li>\
                      <li class="douban3"><%=data.summary%><a class="" href="<%=data.url%>" target="_blank" clkAction="CLICK_DOUBAN" title="查看详情">详细>></a></li>\
                      <li class="douban4">\
					  <span class="douban_author"><%=data.author%></span><span class="douban_time"><%=data.pubdate%></span>\
					  </li>\
					  <li class="douban5">\
					  <a class="moreShopBox" class="bookMore" href="<%=doubanUrl%>" target="_blank" clkAction="CLICK_DOUBAN" title="去豆瓣查看详情" style="margin: 0;"><span>该书的详情</span></a>\
					  </li></ul>';

	$.tm.event.douban = function() {
		var elem = document.getElementById(name + 'douban'),
		cache = $.require_module('youdao.cache'),
		consts = $.require_module('youdao.consts'),
		timer = consts.showTime * 1000;
		$.event.addEvent(elem, 'mouseover', function() {
			if (elem.className === 'noMore') return;
			var div = cache.dom.show,
			dom = $.require_module('youdao.dom'),
			str = $.tm.popo({
				leftX: 50,
				type: 2
			},
			$.tm.info.douban),
			html = $.tmpl(str, {
				rate: cache.data.douban.doubanRate,
				rateCount: cache.data.douban.doubanRateCount,
				data: cache.data.douban.doubanReview,
				doubanUrl: cache.data.douban.doubanUrl,
				logo: ''
			});;
			var attr = {
				css: 'youdaoGWZSdouban',
				width: 350,
				height: 'auto',
				left: dom.pageX(this) - 30
			};
			if (div.style.display === 'block' && div.className === 'douban') {
				$.ctrl.clean();
				return;
			}
			$.ctrl.setAttr(attr, html, function() {
				elem.className = 'enter';
			});
		});
		$.event.addEvent(elem, 'mouseout', function() {
			$.ctrl.delayClean(timer);
		});
	};
	
	/***
	 * sameType 模版 
	 * 同款服饰模板
	 * */
		$.tm.sameType = '<span id="<%=name%>sameType"  <%if(!data.sameType){%> class="noMore"<%}%> title="淘宝同款服饰" hoverAction="SHOW_SAMETYPE" ></span>';
		$.tm.info.sameType = '<ul><li class="sameType1">\
								<% var hasSameType=false ;if(sameTypeNum && sameTypeNum>0)hasSameType=true;else hasSameType=false;%>\
								<table><tr><td  colspan="2" style="width:290px"><span class="<%if(hasSameType){%>sameTypeTitle<%}else{ %>sameTypeTitleNo<%}%>">相同款式</span>\
								<span class="<%if(hasSameType){%>sameTypeNumber<%}else{ %>sameTypeNumberNo<%}%>">:</span>\
								<%if(hasSameType){%><span class="sameTypeContent">为您找到</span><%}%>\
								<span class="<%if(hasSameType){%>sameTypeNumber<%}else{ %>sameTypeNumberNo<%}%>"><%=sameTypeNum%></span>\
								<span class="<%if(hasSameType){%>sameTypeContent<%}else{ %>sameTypeContentNo<%}%>">件</span></td>\
								<td style="vertical-align:middle;"><span class="sameTypeLink">\
								<% if(hasSameType){%><a id="<%=name%>sameTypeBt" class="sameTypeBtEnable" href="<%=sameTypeUrl%>" target="_blank" clkAction="CLICK_SAMETYPE" title="查看同款服饰"><%}else {%><a id="<%=name%>sameTypeBt" class="sameTypeBtDisable" target="_blank"> <%}%>去看看</a></span></td></tr></table> </li>\
								<li class="sameType2">\
								<span class="similarType">相似款式:</span>\
								<form id="<%=name%>sameTypeForm" action="http://s.taobao.com/search" target="_blank" method="get" accept-charset="gbk"><div>\
								<input id="<%=name%>searchSimilarInfo" autocomplete="off" name="q" type="text" value="<%=similarTypeWords%>" title="<%=similarTypeWords%>"/>\
                                <input id="<%=name%>searchSimilarBt" type="submit" clkAction="CLICK_SILIMAR_SAMETYPE" title="搜索相似款式" value="搜相似" />\
                                </div></form></li></ul>'; 
		$.tm.event.sameType = function() {
			var elem = document.getElementById(name + 'sameType'),
			cache = $.require_module('youdao.cache'),
			consts = $.require_module('youdao.consts'),
			util = $.require_module('youdao.util'),
			timer = consts.showTime * 1000;
			$.event.addEvent(elem, 'mouseover', function() {
				if (elem.className === 'noMore') return;
				var div = cache.dom.show,
				dom = $.require_module('youdao.dom'),
				str = $.tm.popo({
					leftX: 50,
					type: 2
				},
				$.tm.info.sameType),
				html = $.tmpl(str, {
					sameTypeNum: cache.data.sameType.sameTypeNum?cache.data.sameType.sameTypeNum:0,
					sameTypeUrl: cache.data.sameType.sameTypeUrl,
					similarTypeWords: cache.data.sameType.similarTypeWords,
					name: consts.commonName,
					logo: '同款服饰'
				});;
				var attr = {
					css: 'youdaoGWZSsameType',
					width: 320,
					height: 'auto',
					left: dom.pageX(this) - 30
				};
				if (div.style.display === 'block' && div.className === 'sameType') {
					$.ctrl.clean();
					return;
				}
				if (!cache.conf.position || cache.conf.position === 'down') {
					attr.top = (cache.conf.ie === 6) ? cache.dom.top - attr.height - 2: 'auto';
					attr.bottom = 52;
					attr.left = dom.pageX(this) - 30 ;
				}else {
					attr.top = (cache.conf.ie === 6) ? cache.dom.top + 52: 52;
					attr.bottom = 'auto';
					attr.left = dom.pageX(this) - 45 ;
				}
				$.ctrl.setAttr(attr, html, function() {
					elem.className = 'enter';
				});
				
				document.getElementById(name + 'sameTypeBt').onclick = function() {
					var sameTypeNum = cache.data.sameType.sameTypeNum?cache.data.sameType.sameTypeNum:0 ;
					this.setAttribute('params', 'sameTypeNum='+sameTypeNum);
					return true ;
				};
				
				document.getElementById(name + 'searchSimilarBt').onclick = function() {
					var e = document.getElementById(name + 'searchSimilarInfo');
					var keyWords = util.trim( cache.data.sameType.similarTypeWords ) , isChanged = 0 ,keyWordsChanged = util.trim(e.value);
					if ((/^\s*$/).test(keyWordsChanged)) {
						return false ;
					}
					if( keyWords != keyWordsChanged ){
						isChanged = 1 ;
					}
					var params =  'keyWords=' + keyWords + '&isChanged=' + isChanged + (isChanged == 1?('&keyWordsChanged='+keyWordsChanged):'') ;
					this.setAttribute('href', "http://s.taobao.com/search?q="+keyWordsChanged);
					this.setAttribute('params', params);
					return true ;
				};
			});
			$.event.addEvent(elem, 'mouseout', function() {
				$.ctrl.delayClean(timer);
			});
		};
		
		/***
		 * 同款服饰数量提示模板
		 */
		$.tm.sameTypeTip = function(style){
			
			var e = document.getElementById(consts.commonName + 'sameType'),
			closeCss = document.getElementById(consts.commonName + 'close').className;
			if (e && cache.data.sameType && cache.data.sameType.sameTypeNum &&cache.data.sameType.sameTypeNum>0 && closeCss !== 'open' ) { //
				var sameTypeNum = cache.data.sameType.sameTypeNum;
				e.style.color = '#cc0033';
				var tip = document.getElementById(consts.commonName + 'sameTypeTip');
				tip.style.left = (dom.pageX(e) + (e.offsetWidth / 2) - 20) + 'px';
				tip.style.display = style || 'block';
				var tipContent = document.getElementById(consts.commonName+'sameTypeTipContent');
				tipContent.style.display = style || 'block';
				// calculate the position and content of the same Type tip text.
				var util = $.require_module('youdao.util');
				var n = util.getNumberLength(sameTypeNum); // 同款服饰数量位数 
				var left , content ;
				if( n > 3 ){
					left =  (tip.offsetWidth-10*(4+1))/2 + 2 + 'px';
					content = ">1000件"; 
				}else{
					left =  (tip.offsetWidth-10*(n+1))/2 + 'px';
					content = sameTypeNum+"件"; 
				}
//				console.log("left="+left);
//				console.log("content="+content);
				tipContent.style.left = left ;
				tipContent.innerHTML= content ;
			} else {
				var tip = document.getElementById(consts.commonName + 'sameTypeTip');
				tip.style.display = 'none';
				var tipContent = document.getElementById(consts.commonName+'sameTypeTipContent');
				tipContent.innerHTML='';
				tipContent.style.display = 'none';
			}
		}

	/***
 * PriceData 模版 
 * */
	$.tm.onePrice = '<% for(var i = len-1; i >= 0; i--) {%>\
                        <%var style = ""; var urlNum = (data.urlPriceList[i].num % data.urlPriceList[i].length) ? data.urlPriceList[i].num : 0; %>\
                        <% if (i === 0)  style += "background-image: none; "; %>\
						<% if (data.urlPriceList[i].html === "缺货") {%>\
						<a id = "<%=name%>price<%=i%>" class="oneDataPrice" hoverAction="SHOW_OUT_MERCHANT" clkAction="CLICK_OUT_MERCHANT" style="<%=style%> color:#b2b2b2;" href="<%=data.urlPriceList[i].items[urlNum].cpsUrl %>" target="_blank" ps="0"\
							<% if (data.urlPriceList[i].priceUpdated) {%>\
								updated="1"\
							<%} else {%>\
								updated="0"\
							<%}%>\
							rel="onePrice" >\
							<% if (data.urlPriceList[i].items[0].price !== "0.0") { %>\
							<%=data.urlPriceList[i].siteName + " " + data.urlPriceList[i].items[0].price + "元(缺货)"%>\
							<% } else {%>\
								<% if (data.urlPriceList[i].items[0].priceImageUrl) {%>\
								<%=data.urlPriceList[i].siteName + " " %><img src="<%=data.urlPriceList[i].items[0].priceImageUrl%>" style="width: 60px; height: 20px; vertical-align: top;" alt="price" />(缺货)\
								<%} else {%>\
									<%=data.urlPriceList[i].siteName + " 暂无报价(缺货)"%>\
								<% } %>\
							<% } %>\
						<% } else { %>\
						<a id = "<%=name%>price<%=i%>" class="oneDataPrice" hoverAction="SHOW_OUT_MERCHANT" clkAction="CLICK_OUT_MERCHANT" style="<%=style%>" href="<%=data.urlPriceList[i].items[urlNum].cpsUrl %>" target="_blank" ps="0"\
							<% if (data.urlPriceList[i].priceUpdated) {%>\
								updated="1"\
							<%} else {%>\
								updated="0"\
							<%}%>\
							rel="onePrice" >\
							<% if ((!data.urlPriceList[i].html && data.urlPriceList[i].items[0].price !== "0.0") || (data.urlPriceList[i].html && data.urlPriceList[i].html !== "0.0元")) {%>\
							<%=data.urlPriceList[i].siteName + " " + (data.urlPriceList[i].html || data.urlPriceList[i].items[0].price + "元")%>\
							<% } else { %>\
							<%=data.urlPriceList[i].siteName + " "%>\
							<% if (data.urlPriceList[i].items[0].priceImageUrl) %>\
								<img src="<%=data.urlPriceList[i].items[0].priceImageUrl%>" style="width: 60px; height: 20px; vertical-align: top;" alt="price" />\
							<% else %> 暂无报价\
							<% } %>\
						<% } %>\
						</a>\
                        <% } %>';
	$.tm.priceData = '<div id="<%=name%>priceData" <% if (!data.hasLower) { %> class="noMore" <% }%> >' + $.tm.onePrice + '</div> ';
	$.tm.event.priceData = function() {
		var priceData = document.getElementById(name + 'priceData'),
		span = priceData.getElementsByTagName('a'),
		cache = $.require_module('youdao.cache'),
		consts = $.require_module('youdao.consts'),
		timer = consts.showTime * 1000;
		$.event.addEvent(span, 'mouseover', function() {
			var elem = this,
			i = parseInt(elem.id.match(/\d/)),
			data = cache.data.urlPriceList[i],
			div = cache.dom.show,
			dom = $.require_module('youdao.dom'),
			json = {
				priceList: data.items,
				len: data.items.length,
				ship: data.shipping,
				data: data,
				logo: (data.items.length === 1) ? '商品详情': '更多同款商品(不同颜色、规格等)'
			},
			str = $.tm.popo({
				leftX: 30,
				type: 2
			},
			youdao.tm.info.priceData),
			html = $.tmpl(str, json);
			var attr = {
				css: 'priceData',
				width: 325,
				height: 'auto',
				left: dom.pageX(this)
			};
			$.ctrl.setAttr(attr, html);
		});
		$.event.addEvent(span, 'mouseout', function() {
			$.ctrl.delayClean(timer);
		});
	};
	$.tm.info.priceData = '<ul><% for(var i=0; i != len; i++) {%>\
							 <% if (i > 4) break;%>\
                                <% if (priceList[i].available) {%>\
                                <li class="price">\
                                <a href="<%=priceList[i].cpsUrl%>" ps="<%=i+1%>" target="_blank" title="<%=priceList[i].name%>" clkAction="CLICK_OUT_MERCHANT_IN" style="display: block; text-align: left;">\
                                    <% if (priceList[i].price !== "0.0") {%>\
									<span style=" display: block; float: right;"><%=priceList[i].price %>元</span>\
									<%} else {%>\
										<% if (priceList[i].priceImageUrl) {%>\
											<img style=" display: block; float: right; width: 60px; height: 20px; vertical-align: top;" src="<%=priceList[i].priceImageUrl%>" alt="price"/>\
										<%} else {%>\
											<span style="dispay: block; float: right;">暂无报价</span>\
										<%}%>\
									<%}%>\
                                    <%=priceList[i].shortName%>\
                                </a>\
                                </li>\
                                <% } else { %>\
                                <li class="noPrice">\
                                <a href="<%=priceList[i].cpsUrl%>" ps="<%=i+1%>" target="_blank" title="<%=priceList[i].name%>" clkAction="CLICK_OUT_MERCHANT_IN" style="display: block; text-align: left;">\
                                    <% if (priceList[i].price !== "0.0") {%>\
									<span style=" display: block; float: right;"><%=priceList[i].price %>元(缺货)</span>\
									<%} else {%>\
										<% if (priceList[i].priceImageUrl) {%>\
											<span style="display: block; float: right;">\
												<img style="width: 60px; height: 20px; vertical-align: top;" src="<%=priceList[i].priceImageUrl%>" alt="price"/>\
												(缺货)\
											</span>\
										<%} else {%>\
                                    		<span style=" display: block; float: right;">暂无报价(缺货)</span>\
										<%}%>\
									<%}%>\
                                    <%=priceList[i].shortName%>\
								</a>\
								</li>\
                                <% } %>\
                            <% } %>\
                            <% if (ship) { %>\
                                <li class="ship">\
								<% if (data.famous) { %><span class="famousleft"><%=data.siteName + ": "%></span> <%} else {%><%=data.siteName + ": "%><% } %>\
								<span style="color: #698723;"><%=data.shipping%></span></li>\
                            <% } else { %>\
                                <li class="ship">\
								<% if (data.famous) { %><span class="famousleft"><%=data.siteName + ": "%></span> <%} else {%><%=data.siteName + ": "%><% } %>\
								<span style="color: #b2b2b2;">暂无运费信息</span></li>\
                            <% } %>\
                            </ul>';

	/***
 * taobao 模版 
 * */
	$.tm.taobao = '<span id="<%=name%>taobao" <% if (!data.taobaoPriceList || data.taobaoPriceList.items.length === 0) { %> class="noMore" title="暂无淘宝报价信息" <% } %> hoverAction="SHOW_TAOBAO" ref="taobao"> </span>';
	$.tm.info.taobao = '<ul>\
				   	<% for(var i=0; i < data.length; i++) {%>\
                   	<li class="oneShop"><table  border="0">\
                   	<tr class="tr1">\
						<td class="shopName">\
							<a href="<%=data[i].cpsUrl%>" target="_blank" clkAction="CLICK_ TAOBAO" ref="taobaoShop">\
								<%=data[i].taobao_nick_name || "淘宝店铺"%>\
							</a>\
						</td>\
						<td class="rank">\
                    	<% if (data[i].taobao_rank) { %>\
                    	<% css = "rankImg"; wd = "100%"; ps = "0 0"; %>\
                    	<% if (data[i].taobao_rank >= 30) { css = "rankImg2"; wd = "26px"; ps = "0 0"; %>\
                    	<%  } else { wd = ((data[i].taobao_rank % 5) * 13 !== 0)  ?  (data[i].taobao_rank % 5) * 13 + "px" : "65px"; ps = (data[i].taobao_rank > 15) ? "0 bottom" : " 0 top"; } %>\
                    	<% } else { css = "noRankImg"; wd = "100%"; ps = "0 0";}%>\
                    		<span class="<%=css%>" style="width:<%=wd%>; background-position: <%=ps%>;"></span>\
                    	</td>\
						<td class="price">\
							<%=data[i].price%>元\
						</td>\
					</tr>\
					<tr class="tr3"></tr>\
                    <tr class="tr2">\
						<td class="name" title="<%=data[i].name%>">\
							<a href="<%=data[i].cpsUrl%>" rel="taobaoshop" clkAction="CLICK_TAOBAO" target="_blank" style="width: 100%; height: 100%;"><%=data[i].shortName%></a>\
						</td>\
						<td class="addr">\
							<%=data[i].shop_loc%>\
						</td>\
						<td class="biz_buy">\
							<% biz =  (data[i].biz_30_day) ?"最近成交<br/>" + data[i].biz_30_day + "笔" : ""; %> <%=biz%>\
						</td>\
					</tr>\
                    </table>\
					</li> \
                    <% } %>\
                    <li class="moreShop">\
					<a class="moreShopBox" href="<%=moreUrl%>" target="_blank" rel="moreShop" clkAction="CLICK_TAOBAO" title="更多淘宝报价">\
					<span>更多淘宝搜索结果</span>\
					</a>\
					</li>\
                    </ul>';
	$.tm.event.taobao = function() {
		var elem = document.getElementById(name + 'taobao'),
		cache = $.require_module('youdao.cache'),
		consts = $.require_module('youdao.consts'),
		timer = consts.showTime * 1000;
		$.event.addEvent(elem, 'mouseover', function() {
			if (elem.className === 'noMore') return;
			var div = cache.dom.show,
			dom = $.require_module('youdao.dom'),
			str = $.tm.popo({
				//leftX: 220, //ie
				leftX: 180,
				//chrome
				type: 2
			},
			youdao.tm.info.taobao),
			html = $.tmpl(str, {
				data: cache.data.taobaoPriceList.items,
				moreUrl: cache.data.taobaoPriceList.moreUrl,
				logo: ''
			});
			var attr = {
				css: 'taobao',
				width: 350,
				height: 'auto',
				left: dom.pageX(this)
			};
			$.ctrl.setAttr(attr, html, function() {
				document.getElementById(name + 'taobao').className = 'enter';
			});
		});
		$.event.addEvent(document.getElementById(name + 'taobao'), 'mouseout', function() {
			var consts = $.require_module('youdao.consts'),
			timer = consts.showTime * 1000;
			$.ctrl.delayClean(timer);
		});
	};

	/***
 * morePrice 模版 
 * */
	$.tm.morePrice = '<span id="<%=name%>morePrice"<% if (len === data.urlPriceList.length) { %> class="noMore" title="暂无其他商城报价信息" <% } %> hoverAction="SHOW_MORE_MERCHANT" ref="morePrice"> </span>';
	$.tm.info.morePrice = '<ul><% for(var i=showLen; i < data.length; i++) {%>\
										<% if (i - showLen >= 5) break; %>\
                                        <% if (data[i].available === "true") { %>\
										<li class="oneShop">\
										<table  border="0">\
                                            <tr class="tr1">\
												<td class="shopName">\
													<% var num = data[i].num; %>\
													<a href="<%=data[i].items[num].url%>" clkAction="CLICK_ MORE_MERCHANT" rel="shop" target="_blank">\
													<%=data[i].siteName%><% if (data[i].famous) { %>\
													<img src="http://zhushou.youdao.com/images/extension_2_0/famous.png" class="famous"/>\
													<%}%>\
													</a>\
												</td>\
                                                <td class="price">\
												<%if ((data[i].html && data[i].html !== "0.0元") || (!data[i].html && data[i].items[num].price !== "0.0")) {%>\
													<%=(data[i].html || data[i].items[num].price + "元")%>\
												<% } else {%>\
													<img style="width: 60px; height: 20px; vertical-align: top;" src="<%=data[i].items[num].priceImageUrl%>"/>\
												<% } %>\
												</td>\
											</tr>\
											<tr class="tr3"></tr>\
                                            <tr class="tr2">\
												<td class="name" title="<%=data[i].items[num].name%>">\
													<a href="<%=data[i].items[num].url%>" rel="shop" clkAction="CLICK_ MORE_MERCHANT" target="_blank" style="width: 100%; height: 100%;">\
													<%=data[i].items[num].shortName%>\
													</a>\
												</td>\
												<td class="ship"><% if (data[i].shipping) { %>\
														<span style="color: #698723;"><%=data[i].shipping%></span></td>\
													<% } else { %>\
														<span style="color: #b2b2b2;">暂无运费信息</span></td>\
													<% } %>\
											</tr>\
                                        </table>\
										</li> \
										<%} else {%>\
										<li class="noShop">\
										<table  border="0">\
                                            <tr class="tr1">\
												<td class="shopName">\
													<% num = data[i].num;%>\
													<a href="<%=data[i].items[num].url%>" rel="shop" clkAction="CLICK_ MORE_MERCHANT" style="color: #b2b2b2;" target="_blank">\
													<%=data[i].siteName%>\
													<% if (data[i].famous) { %>\
													<img src="http://zhushou.youdao.com/images/extension_2_0/famous.png" class="famous"/>\
                                            		<%}%>\
													</a>\
												</td>\
                                                <td class="price" style=" color: #b2b2b2; ">\
												<%if (data[i].items[0].price !== "0.0") {%>\
													<%=data[i].items[num].price + "元"%>\
												<% } else {%>\
													<% if (data[i].items[0].priceImageUrl !== "") { %>\
														<img style="width: 60px; height: 20px; vertical-align: top;" src="<%=data[i].items[num].priceImageUrl%>"/>\
													<% } else { %>\
														无报价信息\
													<% } %>\
												<% } %>\
												</td>\
											</tr>\
											<tr class="tr3"></tr>\
                                            <tr class="tr2">\
												<td class="name" title="<%=data[i].items[num].name%>">\
													<a href="<%=data[i].items[num].url%>" rel="shop" clkAction="CLICK_ MORE_MERCHANT" target="_blank" style="width: 100%; height: 100%; color: #b2b2b2;">\
													<%=data[i].items[num].shortName%>\
													</a>\
												</td>\
												<td class="ship">\
													<span style="color: #b2b2b2;">缺货</span>\
												</td>\
											</tr>\
                                        </table>\
										</li> \
										<% } %>\
                                    	<% } %>\
                                    <li class="moreShop">\
										<a href="<%=moreUrl%>" target="_blank" rel="moreShop" clkAction="CLICK_ MORE_MERCHANT" title="更多商城报价" class="moreShopBox">\
										<span>更多商城报价</span>\
										</a>\
										</li>\
                                    </ul>';
	$.tm.event.morePrice = function() {
		var elem = document.getElementById(name + 'morePrice'),
		cache = $.require_module('youdao.cache'),
		consts = $.require_module('youdao.consts'),
		timer = consts.showTime * 1000;
		$.event.addEvent(elem, 'mouseover', function() {
			if (elem.className === 'noMore') return;
			else {
				var div = cache.dom.show,
				dom = $.require_module('youdao.dom'),
				json = {
					data: cache.data.urlPriceList,
					showLen: cache.conf.showLen,
					moreUrl: cache.data.detailUrl,
					logo: '商城报价'
				},
				str = $.tm.popo({
					//leftX: 60, //ie
					leftx: 20,
					//chrome
					type: 2
				},
				$.tm.info.morePrice),
				html = $.tmpl(str, json);
				var attr = {
					css: 'morePrice',
					width: 300,
					height: 'auto',
					left: dom.pageX(this)
				};
				$.ctrl.setAttr(attr, html, function() {
					document.getElementById(name + 'morePrice').className = 'enter';
				});
			}
		});
		$.event.addEvent(document.getElementById(name + 'morePrice'), 'mouseout', function() {
			var consts = $.require_module('youdao.consts'),
			timer = consts.showTime * 1000;
			$.ctrl.delayClean(timer);
		});
	};

	/***
 * conf 模版 
 * */
	$.tm.conf = '<span id="<%=name%>conf"\
			<% if (data.code === "110000") {%>\
				style="background-position-x: -30px; border-bottom: none 0; float: left; "\
			<% }else{ %>\
				style="background-position-x: 0px;"\
			<% } %>\
			title="设置"\
			clkAction="CLICK_SET"> </span>';
	$.tm.info.conf = '<h2>设置</h2>\
                  <div class="mid">\
				  <strong>显示位置:</strong>\
                  <div class="radio radio1">\
                      <input id="upBt" type="radio" name="conf" value = "网页上方">浏览器顶部\
			      </div>\
				  <div class="radio radio2">\
                      <input id="downBt" type="radio" name="conf" value = "网页下方">浏览器底部\
				  </div>\
				  <input id="<%=name%>set" type="button" clkAction="SET" value = "确定" class="non1">\
                  </div>\
                  <a class="youdaoGWZShelp" href="http://zhushou.youdao.com/help" clkAction="SUGGEST" target="_blank" >帮助</a>\
                  <a class="youdaoGWZSfeelback" href="http://zhushou.youdao.com/suggest" clkAction="HELP" target="_blank" >意见反馈</a>\
                  <a id="<%=name%>confClose" title="关闭"> </a>';
	$.tm.event.conf = function() {
		var util = $.require_module('youdao.util');
		$.event.addEvent(document.getElementById(name + 'conf'), 'click', function() {
			var cache = $.require_module('youdao.cache'),
			div = cache.dom.show,
			json = {
				css: 'youdao',
				name: consts.commonName
			},
			str = $.tm.popo({
				leftX: 203,
				type: 1
			},
			youdao.tm.info.conf),
			html = $.tmpl(str, json);
			var attr = {
				css: 'conf',
				width: 253,
				height: 'auto',
				left: dom.pageX(this) - 190
			};
			if (div.style.display === 'block' && div.className === 'conf') {
				$.ctrl.clean();
				return;
			}
			$.ctrl.setAttr(attr, html, function() {
				document.getElementById(name + 'conf').className = 'enter';
			});
			document.getElementById(cache.conf.position + 'Bt').checked = "checked";
			var set = document.getElementById(consts.commonName + 'set');
			set.className = 'non';
			var elemId = {
				'down': 'upBt',
				'up': 'downBt'
			} [cache.conf.position];
			$.event.addEvent(document.getElementById(consts.commonName + 'confClose'), 'click', function() {
				$.ctrl.clean();
			});
			$.event.addEvent(document.getElementById(cache.conf.position + 'Bt'), 'click', function() {
				set.className = 'non';
			});
			$.event.addEvent(document.getElementById(elemId), 'click', function() {
				set.className = 'enable';
			});
			$.event.addEvent(set, 'click', function() {
				if (set.className === 'non') return false;
				var e;
				if (!cache.conf.position || cache.conf.position === 'down') {
					$.ctrl.clean();
					cache.dom.elem.className = 'up';
					cache.conf.position = 'up';
					cache.localConf.position = 'up';
					var sE = document.getElementById(consts.optionsID);
					if (sE && cache.localConf) sE.innerHTML = util.jsonToStr(cache.localConf, ';');
					if (cache.conf.ie === 6) {
						cache.dom.top = document.documentElement.scrollTop;
						cache.dom.elem.style.top = cache.dom.top + 1 + 'px';
						cache.dom.elem.style.bottom = 'auto';
					}
					if (cache.conf.backCompat) {
						cache.dom.top = document.body.scrollTop;
						cache.dom.elem.style.top = cache.dom.top + 'px';
						cache.dom.elem.style.bottom = 'auto';
					}
					if (e = document.getElementById(name + 'features')) {
						e.style.top = '70px';
						e.style.bottom = 'auto';
						
						var ele1 = youdao.dom.getElementsByClass('youdaoGWZS_upPoint','div',document.getElementById(name+'features'));
						console.log("ele:"+ele1);
						if( ele1 && ele1.length>0 ){
							ele1[0].style.display='block';
						}else{
							return ;
						}
						ele1 = youdao.dom.getElementsByClass('youdaoGWZS_downPoint','div',document.getElementById(name+'features'));
						if( ele1 && ele1.length>0 ){
							ele1[0].style.display='none';
						}else{
							return ;
						}
					};
				} else {
					$.ctrl.clean();
					cache.dom.elem.className = 'down';
					cache.conf.position = 'down';
					cache.localConf.position = 'down';
					var sE = document.getElementById(consts.optionsID);
					if (sE && cache.localConf) sE.innerHTML = util.jsonToStr(cache.localConf, ';');
					if (cache.conf.ie === 6) {
						cache.dom.elem.style.bottom = cache.dom.bottom = (cache.conf.bottom) ? 0: 1;
						cache.dom.elem.style.top = cache.dom.top = 'auto';
					}
					if (cache.conf.backCompat) {
						cache.dom.bottom = 0 - document.body.scrollTop;
						cache.dom.elem.style.bottom = cache.dom.bottom + 'px';
						cache.dom.elem.style.top = cache.dom.top = 'auto';
					}
					if (e = document.getElementById(name + 'features')) {
						e.style.bottom = '55px';
						e.style.top = 'auto';
						var ele1 = youdao.dom.getElementsByClass('youdaoGWZS_upPoint','div',document.getElementById(name+'features'));
						console.log("ele:"+ele1);
						if( ele1 && ele1.length>0 ){
							ele1[0].style.display='none';
						}else{
							return ;
						}
						ele1 = youdao.dom.getElementsByClass('youdaoGWZS_downPoint','div',document.getElementById(name+'features'));
						if( ele1 && ele1.length>0 ){
							ele1[0].style.display='block';
						}else{
							return ;
						}
					};
				}
			});
		});
		$.event.addEvent(document.getElementById(name + 'conf'), 'mouseout', function() {
			var consts = $.require_module('youdao.consts'),
			timer = consts.showTime * 1000;
			$.ctrl.delayClean(timer);
		});
	};

	/***
 * window resize 事件 模版 
 * */
	$.tm.event.resize = function() {
		var div = cache.dom.show,
		span = div.append('span', {
			className: 'oneDataPrice'
		},
		{},
		'');
		for (var i = 0, len = cache.data.urlPriceList.length; i < len; i++) {
			var price = cache.data.urlPriceList[i];
			span.innerHTML = price.siteName + '  ' + price.items[0].price + '元(缺货)';
			price.len = span.offsetWidth + 35;
		}
		var reSizeWin = function() {
			if (!cache.conf.ie) {
				var w = cache.dom.body.style.width || 'auto';
				cache.dom.body.style.width = '100%';
				cache.dom.bodyWidth = cache.dom.body.offsetWidth;
				cache.dom.body.style.width = w;
			} else {
				cache.dom.bodyWidth = (document.documentElement.clientWidth) ? document.documentElement.clientWidth: document.body.clientWidth;
			};
			cache.dom.contentWidth = (cache.conf.ie === 6) ? Math.ceil(cache.dom.bodyWidth - 160) : Math.ceil(cache.dom.bodyWidth - 152);
			document.getElementById(consts.commonName + 'contentBar').style.width = cache.dom.contentWidth + 'px';
			if (cache.data.code === '110000') {
				var tmpW, sub = 0,
				i = 0,
				mLeft = 0;
				if (!cache.data.douban || ! cache.data.douban.doubanReview || ! cache.data.douban.doubanReview.summary) {
					tmpW = cache.dom.bodyWidth - 500;
				} else {
					tmpW = cache.dom.bodyWidth - 600;
				}
				while (i < cache.data.urlPriceList.length && sub < tmpW) {
					sub += cache.data.urlPriceList[i++].len;
				}
				if (sub >= tmpW) cache.conf.showLen = (i > 1) ? i - 1: 0;
				else cache.conf.showLen = i;
				if (cache.conf.showLen > 3) cache.conf.showLen = 3;
				var priceElem = document.getElementById(consts.commonName + 'priceData');
				if (priceElem) priceElem.innerHTML = $.tmpl($.tm.onePrice, {
					data: cache.data,
					name: consts.commonName,
					len: cache.conf.showLen
				});
				if (cache.data.urlPriceList.length - cache.conf.showLen > 0) {
					document.getElementById(consts.commonName + 'morePrice').className = '';
					document.getElementById(consts.commonName + 'morePrice').title = '';
				} else {
					document.getElementById(consts.commonName + 'morePrice').className = 'noMore';
					document.getElementById(consts.commonName + 'morePrice').title = '暂无其他商城报价信息';
				}
				$.tm.event.priceData();
			}
		};
		reSizeWin();
		$.event.addEvent(window, 'resize', reSizeWin);
	};

	/***
 * 更低价显示 模版 
 * */
	$.tm.lowPriceResize = function(style) {
		var e = document.getElementById(consts.commonName + 'price0'),
		closeCss = document.getElementById(consts.commonName + 'close').className;
		if (e && cache.data.hasLower && closeCss !== 'open') {
			e.style.color = '#cc0033';
			var low = document.getElementById(consts.commonName + 'lowPrice');
			low.style.left = (dom.pageX(e) + (e.offsetWidth / 2) - 10) + 'px';
			low.style.display = style || 'block';
			//cache.dom.elem.style.overflow = 'visiable';
		} else {
			var low = document.getElementById(consts.commonName + 'lowPrice');
			low.style.display = 'none';
		}
	};

	/***
 * 特殊动画 模版 
 * */
	$.tm.event.up = {
		'110011': function() {
			cache.dom.bodyMarginTop = (mTop = document.body.style.marginTop) ? mTop: 'auto';
			var options = {
				elem: 'body',
				attr: ['marginTop', 0, 50, 'px'],
				timer: 'vFast',
				atp: 'Line',
				context: this,
				callback: function() {}
			};
			if (cache.conf.position === 'up') {
				$.addAnimate(options);
			};
			$.event.addEvent(document.getElementById(consts.commonName + 'close'), 'click', function() {
				if (document.getElementById(consts.commonName + 'close').className === 'close' && cache.dom.elem.className === 'up') {
					options.attr = ['marginTop', 50, 0, 'px'];
					$.addAnimate(options);
				};
				if (document.getElementById(consts.commonName + 'close').className === 'open' && cache.dom.elem.className === 'up') {
					options.attr = ['marginTop', 0, 50, 'px'];
					$.addAnimate(options);
				};
			});
			var conf = document.getElementById(consts.commonName + 'conf');
			if (conf) $.event.addEvent(conf, 'click', function() {
				if (cache.dom.show.style.display === 'none') return;
				var set = document.getElementById(consts.commonName + 'set');
				if (!set) return;
				$.event.addEvent(set, 'click', function() {
					if (set.className === 'non') return;
					var options = {
						elem: 'body',
						attr: ['marginTop', 0, 50, 'px'],
						timer: 'vFast',
						atp: 'Line',
						context: this,
						callback: function() {}
					};
					if (document.body.style.marginTop === '50px' && cache.dom.elem.className === 'down') {
						options.attr = ['marginTop', 50, 0, 'px'];
						$.addAnimate(options);
					};
					if (document.body.style.marginTop !== '50px' && cache.dom.elem.className === 'up') {
						options.attr = ['marginTop', 0, 50, 'px'];
						$.addAnimate(options);
					};
				});
			});
		},
		'110000': function() {
			var div = document.getElementById(consts.commonName + 'contentBar'),
			close = document.getElementById(consts.commonName + 'close'),
			icon = document.getElementById(consts.commonName + 'icon');
			div.style.width = 0;
			div.style.overflow = 'hidden';
			div.style.display = 'none';
			close.className = 'open';
			close.name = '1';
			icon.className = 'show';
		},
		'111100': function() {
			cache.dom.bodyMarginTop = (mTop = document.body.style.marginTop) ? mTop: 'auto';
			var options = {
				elem: 'body',
				attr: ['marginTop', 0, 50, 'px'],
				timer: 'vFast',
				atp: 'Line',
				context: this,
				callback: function() {}
			};
			if (cache.conf.position === 'up') {
				$.addAnimate(options);
			};
			$.event.addEvent(document.getElementById(consts.commonName + 'close'), 'click', function() {
				if (document.getElementById(consts.commonName + 'close').className === 'close' && cache.dom.elem.className === 'up') {
					options.attr = ['marginTop', 50, 0, 'px'];
					$.addAnimate(options);
				};
				if (document.getElementById(consts.commonName + 'close').className === 'open' && cache.dom.elem.className === 'up') {
					options.attr = ['marginTop', 0, 50, 'px'];
					$.addAnimate(options);
				};
			});
			$.event.addEvent(document.getElementById(consts.commonName + 'conf'), 'click', function() {
				if (cache.dom.show.style.display === 'none') return;
				var set = document.getElementById(consts.commonName + 'set');
				if (!set) return;
				$.event.addEvent(set, 'click', function() {
					if (set.className === 'non') return;
					var options = {
						elem: 'body',
						attr: ['marginTop', 0, 50, 'px'],
						timer: 'vFast',
						atp: 'Line',
						context: this,
						callback: function() {}
					};
					if (document.body.style.marginTop === '50px' && cache.dom.elem.className === 'down') {
						options.attr = ['marginTop', 50, 0, 'px'];
						$.addAnimate(options);
					};
					if (document.body.style.marginTop !== '50px' && cache.dom.elem.className === 'up') {
						options.attr = ['marginTop', 0, 50, 'px'];
						$.addAnimate(options);
					};
				});
			});
		}
	};

	/***
	 * 新功能引导 模版 
	 * */
		$.tm.features.tmple = '<ul class="feature">\
	                                        <li class="fts1"><span class="ftLogo"></span>功能提示</li>\
	                                        <li class="fts2"><div class="ftContent">\
	                                        	<div class="ftContent1"><%=info[0]%> </div>\
	                                        	<div class="ftContent2"><%=info[1]%> </div>\
	                                        </div></li>\
	                                        <li class="fts3"><div style="margin:5px 0px;"><span class="ftsName"><%=info[2]%></span>\
	                                        	<span class="ftsDes">功能简介:</span></div>\
	                                        	<span class="ftsDesInfo"><%=info[3]%></span>\
	                                        </li>\
	                                        <li class="fts4">\
	                                        	<a href="<%=info[4]%>" target="_blank" clkAction="CLICK_FEATURE_HELP">查看功能详情>></a>\
	                                        	<input id="ftsBt" type="button" clkAction="CLICK_FEATURE_USE" value="我知道了"/>\
	                                        </li></ul>';
		$.tm.features.event = function(fDiv) {
			var logUtil = $.require_module('youdao.logUtil');
			logUtil.sendLog('SHOW_NEW_FEATURE', new Image());
			
			$.event.addEvent(document.getElementById('ftsBt'), 'click', function() {
				var util = $.require_module('youdao.util');
				
				//log
				if( $.conf.features[cache.conf.flag-1] === 'sameType'){
					var sameTypeNum = cache.data.sameType.sameTypeNum ;
					this.setAttribute('params', 'sameTypeNum='+sameTypeNum );
				}
				
				fDiv.style.display = 'none';
				var code = $.conf.features[cache.conf.flag - 1];
				$.tm.event[code] = $.tm.event.tmp;
				$.tm.event.tmp();
				// write the local storage 
				var sE = document.getElementById(consts.optionsID);
				if (sE && cache.localConf) {
					cache.localConf.featureCode = util.setFtCode(cache.localConf.featureCode?cache.localConf.featureCode:'',cache.conf.flag-1,true) ;
					sE.innerHTML = util.jsonToStr(cache.localConf, ';');
				}
				console.log('cache.dom.elem.flag'+cache.dom.elem.flag);
				console.log('cache.conf.flag'+cache.conf.flag);
				cache.conf.flag = 0 ;
				cache.dom.elem.flag = (cache.conf.flag <= $.conf.features.length) ? cache.conf.flag: 0;
			});
			fDiv.closeFdiv = function() {
				var util = $.require_module('youdao.util');
				fDiv.style.display = 'none';
				var code = $.conf.features[cache.conf.flag - 1];
				$.tm.event[code] = $.tm.event.tmp;
				$.tm.event.tmp();
			}
		};

})(youdao);


(function($){
	var m = $.ns('youdao.modules'),
	cache = $.require_module('youdao.cache');
	cache.nosyn.loadin = true;
	m.loadin = function( callback ) {
	    var  dom = $.require_module('youdao.dom'), consts = $.require_module('youdao.consts');
	    elem = cache.dom.elem;
	    showDiv = cache.dom.show;
        showDiv.onmouseover = function() {
            $.ctrl.cleanTime();
        };
        showDiv.onmouseout = function() {
            $.ctrl.delayClean(consts.showTime * 1000);
        };
	    var data = { name: consts.commonName };
	    //console.log(youdao.tm);
	    elem.innerHTML = $.tmpl( $.tm.load,  data);
		cache.dom.contentWidth = cache.dom.inLen = document.getElementById(consts.commonName + 'contentBar').offsetWidth;
	    $.tm.event.load();
	    //document.getElementById(consts.commonName + 'contentBar').style.width = '240px';
		cache.dom.elem.style.overflow = 'hidden';
	    var self = this,
	          json = {
	             elem: consts.elemId,
	             attr: ['height', 0, 50, 'px'],
	             timer: 'fast',
	             atp: 'Line',
	             callback: function() { callback.success(); },
	             context: self
	          }	;
	    $.addAnimate(json);
	}
})(youdao);

(function($){
    var m = $.ns('youdao.modules'),
        cache = $.require_module('youdao.cache');
        cache.nosyn.loadout = true,
		consts = $.require_module('youdao.consts');
    m.loadout = function(callback) {
        var cache = $.require_module('youdao.cache');
        cache.dom.elem.append = $.dom.append,
        dom = $.require_module('youdao.dom');
        var elem = cache.dom.elem;
        var self = this, w = dom.outWidth(elem),
              json = {
                 elem: consts.elemId,
                 attr: ['fade', 100, 0, 'px'],
                 timer: 'vFast',
                 atp: 'Line',
                 callback: function(){ elem.style.height = 0; callback.success(); },
                 context: self
              } ;
       	// $.addAnimate(json);
		json.callback();
		cache.dom.inLen = cache.dom.elem.offsetWidth;
		//callback.success();
    };
})(youdao);

(function($) {
	$.runNoSyn(['youdao.conf.init', 'youdao.modules.cssLink', 'youdao.modules.css', 'youdao.modules.loadin', 'youdao.modules.RequestPriceInfo', 'youdao.modules.loadout', 'youdao.modules.gouwuInit', 'youdao.modules.gouwuExperience', 'youdao.modules.gouwuLog']);
})(youdao);


