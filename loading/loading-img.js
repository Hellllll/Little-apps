/*此例子适合当点击某个元素时，加载显示，不适合页面加载时候用*/
(function (){
	var AjaxLoading = {};

	AjaxLoading.load = function (element, ms, event, left, top, callback) {
		//都是先判断参数是否存在
		if (!left || typeof left == undefined) {
			left = 0;
		} 
		if (!top || typeof top == undefined) {
			top = 0;
		}

		this.element = element; //显示图标的parent元素
		this.obj = $("#" + this.element);//获取此对象
		this.sourceEventElement = $(event.currentTarget);
		this.start = function () {
			this.obj.css({ position: 'relative'});
			this.sourceEventElement.attr("disabled", true);

			var imgobj = $("<img src='images/loading.PNG' style='position:absolute; width:32px; height:32px;' id='img_loding'/>"); 
			imgobj.css({ left: this.obj.width() / 2-imgobj.width()/2-left, top: this.obj.height() / 2-imgobj.height()/2-top });
		
			imgobj.appendTo(this.obj);
			this.obj.animate({ height: this.obj.height() }, ms, function () {
				callback();
			});
		};

		this.stop = function () {
			$("#img_loading").remove();
			this.sourceEventElement.attr("disabled", false);
		}
	};	
})();