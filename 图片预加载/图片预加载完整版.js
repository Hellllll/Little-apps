//比较完善的预加载插件
var imgReady = (function () {
	var list = [],  //似乎保存的是函数参数
		intervalId = null;

	//执行队列的特性，先进先出	
	var queue = function () {

		for (var i = 0; i < list.length; i++) {
			list[i].end ? list.splice(i--, 1) : list[i](); //如果出现错误，则剔除
		}
		!list.length && stop(); //length为false，list为空时，就停止
	};

	var stop = function () {
		clearInterval(intervalId);
		intervalId = null;
	};

	return function (url, ready, error) {

		var onready = {},
			width,
			height,
			newWidth,
			newHeight,
			img = new Image();
			img.src = url;

		if (img.complete) {
			ready.call(img);
			return;
		}

		width = img.width;
		height = img.height;

		img.onerror = function () {
			error && error.call(img);
			onready.end = true;
			img = img.onload = img.error = null; //为何要这样做
		};

		//图片尺寸就绪
		var onready = function () {
			newWidth = img.width;
			newHeight = img.height;

			if (newWidth !== width || newHeight !== height || 

				newWidth * newHeight > 1024) {

				ready.call(img);
				onready.end = true;
			}
		};

		onready();

		img.onload = function () {
			!onready.end && onready();
			img = img.onload = img.onerror = null;
		};

		if (!onready.end) {
			list.push(onready);

			if (intervalId === null) {
				intervalId = setInterval(queue, 40);
			}
		}
	}

})();

//调用
imgReady("images/heeli.png", function() {
		    var ali = document.getElementsByTagName('li');
		    var i, l = ali.length;
		    var oimg = document.createElement('img');
		    oimg.src = this.src;
		    for (i=0; i<l; i++) {
		        ali[i].appendChild(oimg);
		    }
		});