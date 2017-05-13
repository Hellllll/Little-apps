function DataLazyLoad(options) {

	this.config = {

		container	   : 	window,  //容器，默认为window
		threshold	   : 	0,		 //离多少像素渲染图片
		event		   : 	'scroll', //默认为scroll（滚动）
		effect		   : 	'fadeIn', //jQuery自带效果
		effectspeed	   : 	1000,     //时间
		suffix		   : 	'img', 	  //img属性，默认以data-img也可以自定义后缀
		skip_invisible : 	true 	  //如果img标签隐藏是，那么不强制加载
	};

	this.cache = {};

	this.init(options);
}

DataLazyLoad.prototype = {

	init: function(options) {

		this.config = $.extend(this.config, options || {});
		var self = this,
			_config = self.config,
			_cache = self.cache;

		$(_config.container).unbind(_config.event);
		$(_config.container).bind(_config.event, function() {
			self._update();
		});
	},

	_eachImg: function(item) {
		var self = this,
			_config = self.config,
			_cache = self.cache;

		if ($(item).attr('isload') == 'false') {
			var dataImg = $(item).attr('data-' + _config.suffix),
			src = $(item).attr('src');
			$(item).hide();
			$(item).attr('src', dataImg);
			$(item).attr('data-'+_config.suffix, '');
			$(item)[_config.effect](_config.effectspeed);
			$(item).attr('isload', 'true');
		}
	},

	_update: function() {
		var self = this,
			_config = self.config,
			_cache = self.cache;

		if (_config.container === window) {

			$('img').each(function (index, item) {

				if (_config.skip_invisible && !$('img').is(":visible")) {
					return; //如果图片隐藏，那么不强制加载
				}

				if (self._abovethetop(item) || self._lelfofbegin(item)) {
					//nothing to do.
				} else if (self._belowthefold(item) && self._rightoffold(item)) {
					self._eachImg(item);
				}
			});
		} else {
			$('img', $(_config.container)).each(function(index,item){
                // 如果图片隐藏的 那么不强制加载
                if(_config.skip_invisible && !$('img').is(":visible")) {
                    return;
                }
                if (self._abovethetop(item) ||
                    self._leftofbegin(item)) {
                	//do nothing.
                } else if (self._belowthefold(item) &&
                    self._rightoffold(item)) {

                        self._eachImg(item);
                } 
            });
		}
	},

	_belowthefold: function (elem) {
		var self = this,
			_config = self.config;
			
		var fold;
		if (_config.container === window) {
			fold = $(window).height() + $(window).scrollTop(); 
		} else {
			//当容器不为window时，用。。。
			fold = $(_config.container).offset().top + $(_config.container).height();
		}

		return fold >= $(elem).offset().top - _config.threshold;
	},

	_rightoffold: function(elem){
        var self = this,
            _config = self.config;
        var fold;
        if(_config.container === window) {
            fold = $(window).width() + $(window).scrollLeft();
        }else {
            fold = $(_config.container).offset().left + $(_config.container).width();
        }
        return fold >= $(elem).offset().left - _config.threshold;
    },
    /*
     * 往上滚动
     * @return {Boolean}
     */
    _abovethetop: function(elem){
        var self = this,
            _config = self.config;
        var fold;
        if(_config.container === window) {
            fold = $(window).scrollTop();
        }else {
            fold = $(_config.container).offset().top;
        }
        return fold >= $(elem).offset().top + _config.threshold  + $(elem).height();
    },
    /*
     * 往左滚动
     * @return {Boolean}
     */
    _leftofbegin: function(elem) {
        var self = this,
            _config = self.config;
        var fold;
        if (_config.container === window) {
            fold = $(window).scrollLeft();
        } else {
            fold = $(_config.container).offset().left;
        }
        return fold >= $(elem).offset().left + _config.threshold + $(elem).width();
    }
};

$(function () {

	var datalazy = new DataLazyLoad({
		container: '#demo'
	});
});