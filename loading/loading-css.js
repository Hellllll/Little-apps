/*整体说来逻辑还是十分简单的，但又没有优化的地方呢*/
define(function(){

    exports.loading = function(){
        
    };//???
});
function loading(element,lightColor,darkColor,speed,callback){
    /*一般要先判断参数是否存在或者符合要求*/
    if( !element && ( !element.innerText || !element.textContent)) return;
    element = typeof element === "string" ? document.getElementById(element) : element;
    lightColor = lightColor || "#fff" , darkColor = darkColor || "#000",speed = speed || 300;
 
    var arr_spanEles = new Array();
     
     console.log(element.innerText);
    !function(arr_elementText){

        element.innerText = element.textContent = "";
        for(var i = 0; i < arr_elementText.length; i++){
            var span = document.createElement("span");
            element.innerText ? span.innerText = arr_elementText[i] : span.textContent = arr_elementText[i];
            element.appendChild(span);
            arr_spanEles.push(span);
        }
    }((element.innerText || element.textContent).split(""));
 
    var index = -1, length = arr_spanEles.length;

    var loadingTimer = setInterval(function(){
        arr_spanEles[Math.max(index,0)].style.color = darkColor;//靠
        arr_spanEles[Math.max(index,0)].style.fontSize = "20px";
        
        if(index == length-1){
            index = -1;
            callback && callback();
        }
        ++index;
        arr_spanEles[index].style.color = lightColor;
        arr_spanEles[index].style.fontSize = "30px";
    }, speed);
}

loading("animation-loading", "#ccc", "#000", 400, function(){

    //do sth.
});