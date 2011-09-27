(function(){
        var ua = navigator.userAgent.toLowerCase(),
            rwebkit = /(webkit)[ \/]([\w.]+)/,
            ropera = /(opera)(?:.*version)?[ \/]([\w.]+)/,
            rmsie = /(msie) ([\w.]+)/,
            rmozilla = /(mozilla)(?:.*? rv:([\w.]+))?/;

        var match = rwebkit.exec( ua ) ||
            ropera.exec( ua ) ||
            rmsie.exec( ua ) ||
            ua.indexOf("compatible") < 0 && rmozilla.exec( ua ) ||
            [];
        
        var browser = match[1] || "";
        var version = match[2] || "0";
		var div = document.createElement('div');
		div.innerHTML = 'userAgent : ' + ua + '<br/>browser : ' + browser + '<br/>version : ' + version;
		document.body.appendChild(div);
})();
