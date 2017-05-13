//预加载图片的原理
function loadImage(url,callback) {
			var img = new Image();
			img.src = url;
			
			//使用img.complete判断img对象是否存在，返回TRUE or false
			if(img.complete){ 
				callback.call(img);
				return;
			}
			img.onload = function(){
				callback.call(img); //传递参数而已
			};
		};
loadImage("images/heeli.png", function() {
    var ali = document.getElementsByTagName('li');
    var i, l = ali.length;
    var oimg = document.createElement('img');
    oimg.src = this.src;
    for (i=0; i<l; i++) {
        ali[i].appendChild(oimg);
    }
});