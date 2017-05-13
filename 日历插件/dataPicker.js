;(function () {
    
    var date = {}, 
        lastDay,
        lastDayDate,
        monthRander,
        $wrap;
    
    //获取月份相应的数据
    date.getMonthDate =  function (year, month) {
        
        var dateDate = [];
        
        //1.获取年月
        if (!year || !month) {
            var today = new Date();
            year = today.getFullYear();
            month = today.getMonth() + 1;
        }
        //获取传入月的第一天
        var firstDay = new Date(year, month-1, 1);//获取当月第一天
        var firstDayWeek = firstDay.getDay();  //获取第一天表示的星期
        if (firstDayWeek === 0) {
            firstDayWeek = 7;
        }
        
        year = firstDay.getFullYear();
        month = firstDay.getMonth() + 1;
        
        if (month <= 9) {
            month = "0" + month;
        }
        
        //2.分别获取上月和当月的最后一天
        var lastMonthDay = new Date(year, month-1, 0);
        var lastMonthDate = lastMonthDay.getDate(); //获取上一月的最后一天
        var lastMonthShow = firstDayWeek - 1; //需要显示上月的天数
        
        lastDay = new Date(year, month, 0); 
        lastDayDate = lastDay.getDate(); //获取当月的最后一天
        
        //3.获取本月数据，月份最多可能包括6个星期
        for (var i = 0; i < 7 * 6; i++) {
            
            //这里的逻辑有些绕，但还是比较容易理解
            var dateDay = i - lastMonthShow + 1;  //抽象表示月份中的天数（负数正数区分上月和当月）
            var showDay = dateDay; //showDay是为了获取月份中真实的日期数
            var thisMonth = month; //thisMonth和showDay作用同理
            
            if (dateDay <= 0) {
                //上月
                thisMonth = month - 1;
                showDay = lastMonthDate + dateDay;
            } else if (dateDay > lastDayDate) {
                //当月
                thisMonth = month + 1;
                showDay = showDay - lastDayDate;
            }
            
            if (showDay <= 9) {
                showDay = "0" + showDay;
            }
            
            if (thisMonth === 0) {
                thisMonth = 12;
            }
            if (thisMonth === 13) {
                thisMonth = 1;
            }
            dateDate.push({
                month: thisMonth,
                date: dateDay,
                show: showDay
            });
        }
        
        return {
            year: year,
            month: month,
            days: dateDate
        };
    };

    //生成模板
    date.randerDate = function (year, month) {
        monthRander  = date.getMonthDate(year, month);
        
        var html = '<div class="date-header">' +
                '<a href="#" class="date-btn date-btn-prev"><</a>' +
                '<span class="date-cur-month">' + monthRander.year + '-' + monthRander.month + '</span>' +
                '<a href="#" class="date-btn date-btn-next">></a>'+
                '</div>'+
                '<div class="date-body">'+
                '<table>'+
                '<thead>'+
                '<tr>'+
                '<th>一</th>'+
                '<th>二</th>'+
                '<th>三</th>'+
                '<th>四</th>'+
                '<th>五</th>'+
                '<th>六</th>'+
                '<th>日</th>'+
                '</tr>'+
                '</thead>'+
                '<tbody>';

        for (var i = 0; i < monthRander.days.length; i++) {
            
            var dateThisDay = monthRander.days[i];
            if (i%7 === 0) {
                html += '<tr>';
            }
            if (monthRander.days[i].date <= 0 || monthRander.days[i].date > lastDayDate) {
                html += '<td class = "not" data-date="' + dateThisDay.date + '">' + dateThisDay.show + '</td>';
            } else {
                html += '<td data-date="' + dateThisDay.date + '">' + dateThisDay.show + '</td>';
            }
            if (i%7 === 6) {
                html += '</tr>';
            }
        } 
        html +=  '</tbody>'+
            '</table>'+
            '</div>';
        return html;
    };

    //渲染模板，这里的参数为何？
    date.rander = function (monthChange) {
        var year, month;
        
        if (monthRander) {
            year = monthRander.year;
            month = monthRander.month;
        }
        
        if (monthChange === "prev") {
            month--;
            if (month === 0) {
                month = 12;
                year--;
            }
        }
        if (monthChange === "next") {
            month++;
        }
        
        var randerHtml = date.randerDate(year, month);
        
        $wrap = document.querySelector('.date-wrap');
        
        if (!$wrap) {
            $wrap = document.createElement('div');
            $wrap.className = 'date-wrap';
            document.body.appendChild($wrap);
        }
        $wrap.innerHTML = randerHtml;
    };

    //业务逻辑交互处理
    date.init = function (input) {
        
        date.rander();
        
        var $input = document.querySelector(input);
        var isOpen = false;
        
        //点击文本框显示日历框
        $input.addEventListener("click", function () {
           if (isOpen) {
                $wrap.classList.remove("active"); //classList的作用
                isOpen = false;
           } else {
                $wrap.classList.add("active");
                var left = $input.offsetLeft;
                var top = $input.offsetTop + $input.offsetHeight;
                $wrap.style.top = top + 2 + "px";
                $wrap.style.left = left + 2 + "px";
                isOpen = true;
           }
        });
        
        $wrap.addEventListener("click", function (e) {
            var $target = e.target;
            
            if ($target.tagName.toLowerCase() === "td") {
                var inputDate = new Date(monthRander.year, monthRander.month-1, $target.dataset.date); //$target.dataset.date这里的数据保存在标签的自定义属性中
                $input.value = date.translateDate(inputDate); 
                $wrap.classList.remove("active");
                isOpen = false;
            }
            
            if (!$target.classList.contains("date-btn")) {
                return;
            }
            if ($target.classList.contains("date-btn-prev")) {
                date.rander("prev");
            } else if ($target.classList.contains("date-btn-next")) {
                date.rander("next");
            }
        });
    };
    
    //格式化日期
    date.translateDate = function (date) {
        var htmlDate = "";
        var change = function (num) {
            if (num <= 9) {
                return "0" + num;
            }
            return num;
        };
        htmlDate += date.getFullYear() + "-";
        htmlDate += change(date.getMonth() + 1) + "-";
        htmlDate += change(date.getDate());
        return htmlDate;
    };
    
    window.date = date;
})();

date.init(".datepicker");