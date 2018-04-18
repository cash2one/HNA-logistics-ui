/*通用脚本文件*/
function setAjaxHeader() {
    var token = cookie.get("token");
    if(token) {
        $.ajaxSetup({
            headers: {
                "x-token": token
            }
        });
    }
}
setAjaxHeader();
Date.prototype.format = function(format) {
    var o = {
        "M+" : this.getMonth()+1, //month
        "d+" : this.getDate(), //day
        "h+" : this.getHours(), //hour
        "m+" : this.getMinutes(), //minute
        "s+" : this.getSeconds(), //second
        "q+" : Math.floor((this.getMonth()+3)/3), //quarter
        "S" : this.getMilliseconds() //millisecond
    }

    if(/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
    }

    for(var k in o) {
        if(new RegExp("("+ k +")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length));
        }
    }
    return format;
}
/** 居中弹框里的菜单导航内容显示隐藏公共事件 */
function loadBar(ele){

    ele.removeClass('active');
    ele.next().hide();
    if(!ele.next('ul').eq(0).is(':visible')){
        ele.next('ul').eq(0).show();
        ele.eq(0).addClass('active');
    };

    ele.eq(0).next('.switch-list').css('height', 400 - ele.length*40);

    setTimeout(
        function() {
            ele.eq(0).next('.switch-list').scrollTop(0);
        }, 0);
};
function barClick(ele){
    ele.on('click', function(){
        ele.removeClass('active');
        if($(this).next().is(':visible')){
            $(this).next().hide();
            $(this).removeClass('active');
            return false;
        } else{
            ele.next().hide();
            $(this).next().show();
            $(this).addClass('active');
            setTimeout(
                function() {
                    ele.eq(0).next('.switch-list').scrollTop(0);
                }, 0);
            return false;
        }
    });
};
/** 居中弹框里的校验未通过，提交时自动展开 */
function showErrorModel(ele){
    var error = $('.errors');
    error.each(function(i){
        if(error.eq(i).parents('li').find('input').hasClass('ng-invalid')){
            ele.find('.label-text').removeClass('active');
            ele.next('.isContainer').hide();
            error.eq(i).parents('.isContainer').prev('.label-text').addClass('active');
            error.eq(i).parents('.isContainer').show();
            return false;
        }
    })
}

$.extend({
    dropdown:function(btobj, clickobj){
        $(document).delegate('.page-size', 'click', function(e){
            $(this).toggleClass('open');
            e.stopPropagation();
        });
        $(document).on('click',function(){
            $('.page-size').removeClass('open');
        });
    }
});
$.dropdown();

var  reSetMenuCssStatus = function(menu){
    var oA = top.$(".treeview-menu").find('a');
    oA.removeClass("selected");
    for(var s = 0,len = oA.length;s < len;s++){
        if($(oA[s]).attr("data-hash") == menu){
            $(oA[s]).addClass("selected")
        }
    }
}

$.event.special.valuechange = {
    teardown: function (namespaces) {
        $(this).unbind('.valuechange');
    },

    handler: function (e) {
        $.event.special.valuechange.triggerChanged($(this));
    },

    add: function (obj) {
        $(this).on('keyup.valuechange cut.valuechange paste.valuechange input.valuechange', obj.selector, $.event.special.valuechange.handler)
    },

    triggerChanged: function (element) {
        var current = element[0].contentEditable === 'true' ? element.html() : element.val()
            , previous = typeof element.data('previous') === 'undefined' ? element[0].defaultValue : element.data('previous')
        if (current !== previous) {
            element.trigger('valuechange', [element.data('previous')])
            element.data('previous', current)
        }
    }
};

/*模板处理模块start
* orderNo: TRD_1707261455250115079348
* type:1
* */
window.Template = {
    build: function(templateService, type, orderNo, callback) {//生成pdf
        templateService.getTemplate({urlParams:{async:true,type:type}}, function(res) {
            var html = res.data;
            templateService.getTemplateData({urlParams:{async:true,type:type},seatParams:{orderNo: orderNo}}, function(res) {
                top.htmlToPic(template, res, html, type, orderNo, templateService, callback);
            });
        });
    },
    uploadTemplate: function(templateService, dataUrl, type, orderNo, callback) {
        templateService.uploadTemplate({//生成pdf
            urlParams: {
                "image": dataUrl,
                "type": type,
                "orderNo": orderNo,
                async: true
            },
            seatParams: {
                "type": type,
                "orderNo": orderNo
            }
        }, function (result) {
            callback(result);
        });
    }
}
/*模板处理模块end*/

/*错误定位代码start*/
    function startScroll(currentErrorEle, parentHasScrollNode) {
        parentHasScrollNode.scrollTop(currentErrorEle.offset().top - parentHasScrollNode.offset().top + parentHasScrollNode.scrollTop() - 10);
    }
    function scrollToErrorView(parentHasScrollNode) {
        setTimeout(function() {
            var inputEles = $("[type=text]", parentHasScrollNode);
            var inputElesinputEles = $("textArea", parentHasScrollNode);
            var eles = $.merge(inputEles, inputElesinputEles);
            for(var index = 0; index < inputEles.length; index++) {
                if($(inputEles[index]).css("border-bottom-color") == "rgb(250, 120, 126)") {
                    startScroll($(inputEles[index]), parentHasScrollNode);
                    break;
                }
            }
        }, 300);
    }
/*错误定位代码end*/


/*获取之前的日期
 console.log(getBeforeDate(7));//前七天的日期*/
function getBeforeDate(n){
    var n = n,s;
    var d = new Date();
    var year = d.getFullYear();
    var mon=d.getMonth()+1;
    var day=d.getDate();
    if(day <= n){
        if(mon>1) {
            mon=mon-1;
        }
        else {
            year = year-1;
            mon = 12;
        }
    }
    d.setDate(d.getDate()-n);
    year = d.getFullYear();
    mon=d.getMonth()+1;
    day=d.getDate();
    s = year+"-"+(mon<10?('0'+mon):mon)+"-"+(day<10?('0'+day):day);
    return s;
}

/*
 * 日期转换为当年的周数 start
 * 例：2017-12-08   --->
 */
function getYearWeek(dateString){
    var da =dateString;//日期格式2015-12-30
    //当前日期
    var date1 = new Date(da.substring(0,4), parseInt(da.substring(5,7)) - 1, da.substring(8,10));
    //1月1号
    var date2 = new Date(da.substring(0,4), 0, 1);
    //获取1月1号星期（以周一为第一天，0周一~6周日）
    var dateWeekNum=date2.getDay()-1;
    if(dateWeekNum<0){dateWeekNum=6;}
    if(dateWeekNum<4){
        //前移日期
        date2.setDate(date2.getDate()-dateWeekNum);
    }else{
        //后移日期
        date2.setDate(date2.getDate()+7-dateWeekNum);
    }
    var d = Math.round((date1.valueOf() - date2.valueOf()) / 86400000);
    if(d<0){
        var date3 = (date1.getFullYear()-1)+"-12-31";
        return getYearWeek(date3);
    }else{
        //得到年数周数
        var year=date1.getFullYear();
        var week=Math.ceil((d+1 )/ 7);
        return year+"年第"+week+"周";
    }
}
/* 日期转换为当年的周数 end */

