(function($){
	var bt1 = document.createElement('div');
	var bt2 = document.createElement('div');
	bt1.style.border = '#cc0033 solid 1px';
	bt1.innerHTML = 'bt1';
	document.body.appendChild(bt1);
	bt2.style.border = '#cc0033 solid 1px';
	bt2.innerHTML = 'bt2';
	document.body.appendChild(bt2);
	$["click"] = [
		function(){ alert(111); },
		function(){ alert(222); }
	];
	$.event.addEvent(bt1, 'click', function(){
		for (var i in $["click"]) $["click"][i]();
	});
	$.event.addEvent(bt2, 'click', function(){
		$["click"].push(function() {
			alert('333');
		});
	});

})(window)
