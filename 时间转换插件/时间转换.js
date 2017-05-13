Date.prototype.toRelativeTime = function(now_time) {
    var dT = new Date() - this;//当前时间对象与指定时间的差值
    now_time = parseInt(now_time, 10);
    
    if (isNaN(now_time)) {
        now_time = 0;
    }
    
    if (dT <= now_time) {
        return "刚刚";
    }
    
    var units = null; //时间单位
    var consersions = {
        '毫秒':1,     //1ms
        '秒': 1000,   //1000ms
        '分钟': 60,   //60s
        '小时': 60,   //60m
        '天': 24,     //24h
        '月': 30,     //30d
        '年': 12      //12m
    };
    
    //下面这里的逻辑实在不理解
    for (var key in consersions) {
        if (dT < consersions[key]) {
            break;
        } else {
            units = key;
            dT = dT / consersions[key];
        }
    }
    
    dT = Math.floor(dT);
    return [dT, units].join("");
};

//调用方法 new Date("1995-10-09 12:12:30").toRelativeTime();