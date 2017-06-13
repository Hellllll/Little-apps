
//2.封装通用函数
function random(range) {
	var max = Math.max(range[0], range[1]);
	var min = Math.min(range[0], range[1]);
	var diff = max-min;

	var randomNum = Math.ceil(Math.random() * diff + min);
	return randomNum;

}	

//3.内容输出，原生js实现模板引擎功能
function addPhotos () {

	var template = g("#wrap").innerHTML;
	var html = [];
	var nav = [];

	//循环，s是一个数字
	for (s in data) {
		var _html = template
						.replace('{{index}}', s)
						.replace('{{img}}', data[s].img)
						.replace('{{caption}}', data[s].caption)
						.replace('{{desc}}', data[s].desc);
			html.push(_html);

			//这里的g()根本访问不了啊
			nav.push('<span id="nav_'+ s +'" onclick="turn(g(\'#photo_'+ s +'\'))" class="i">&nbsp;</span>');
	}
	html.push("<div class='nav'>" + nav.join() + "</div>")
	g('#wrap').innerHTML = html.join('');

	//渲染完图片之后，让图片各就各位
	resort(random([-1, data.length-1]));
}

addPhotos();

//4.中间图片的显示
function resort(n) {

	var photo_center = g("#photo_" + n);
	var _photos = g(".photo"); //表示一个临时变量，只是类数组
	var photos = Array.prototype.slice.apply(_photos);

	for (var i = 0; i < photos.length; i++) {

		//先清空之前赋予的样式(shit,这里还真不能将photos[i].className的值赋给一个变量)
		photos[i].className = photos[i].className.replace(/\s*photo-center\s*/, ' ');
		photos[i].className = photos[i].className.replace(/\s*photo_front\s*/, ' ');
	    photos[i].className = photos[i].className.replace(/\s*photo_back\s*/, ' ');
	    photos[i].className += ' photo_front';
	    photos[i].style.left = '';
	    photos[i].style.top = '';
	    photos[i].style['-webkit-transform'] = 'rotate(360deg) scale(1.3)';
	}

	//选择随机的一张图片显示在中央
	photo_center.className += ' photo-center ';		
	//console.log(photo_center.className);
	photo_center = photos.splice(n, 1)[0]; //获取中间图片的引用
	

	var photos_left = photos.splice(0, Math.ceil(photos.length/2));
	var photos_right = photos;

	var ranges = range();

	for (var s in photos_left) {
		var photo = photos_left[s];
		photo.style.left = random(ranges.left.x) + "px";
		photo.style.left = random(ranges.left.x) + "px";
		photo.style['-webkit-transform'] = 'rotate(' + random([-150,150]) +'deg) scale(1)';
	}

	for(var s in photos_right){
     	var photo = photos_right[s];
        photo.style.left = random(ranges.right.x) + 'px';
        photo.style.top = random(ranges.right.y) + 'px';
        photo.style['-webkit-transform'] = 'rotate(' + random([-150,150]) + 'deg)  scale(1)';
    }

    var navs = g('.i');
    for(var s = 0; s < navs.length; s++){
        navs[s].className = navs[s].className.replace(/\s*i_current\s*/,' ');
        navs[s].className = navs[s].className.replace(/\s*i_back\s*/,' ');
    }
    g('#nav_'+n).className += ' i_current ';
}

//5.计算图片不能超过的位置,其实逻辑很简单
function range () {

	var range = { 
		left: { x:[], y:[] }, 
		right: { x: [], y: [] }
	};
	var wrap = {
		w: g("#wrap").clientWidth,
		h: g("#wrap").clientHeight
	};
	var photo = {
		w: g(".photo")[0].clientWidth,
		h: g(".photo")[0].clientHeight
	};
	range.wrap = wrap;
	range.photo = photo;
	range.left.x = [0-photo.w, wrap.w/2-photo.w/2];
	range.right.x = [wrap.w/2+photo.w/2, wrap.w+photo.w];
	range.left.y = [0-photo.h, wrap.h];
	range.right.y = range.left.y;

	return range;
}

// 1.页面翻转控制
function turn (elem) {

	var cls = elem.className;
	var n = elem.id.split('_')[1];

	if (!/photo-center/.test(cls)){
       return resort(n);
    } 

	if (/photo_front/.test(cls)) {

		//这里要注意，匹配的是正则表达式
		cls = cls.replace(/photo_front/, 'photo_back');
		//g('#nav_'+n).className += 'i_back';

	} else {
		cls = cls.replace(/photo_back/, 'photo_front');
		//g('#nav_'+n).className = g('#nav_'+n).className.replace(/\s*i_back\s*/,' ');
	}

	return elem.className = cls;

}

//通用函数设置。乱七八糟
function g(selector) {
		var method = selector.substr(0, 1) == '.' ? 'getElementsByClassName' : 'getElementById';
		return document[method](selector.substr(1));
}