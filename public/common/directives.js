app.constant(
    /**
     * 定义常用正则常量，可在其他directive中调用，需要先引入REGEXP服务。
     */
    "REGEXP",
    {
        "SUPPLIERNAME":/^([\w\u4E00-\u9FA5_\-\(\)\（\）\s.&,]+)+$/,//中英文、数字、空格和符号“-”,“_”,","(",")","（","）","&",","
        "GOODSNAME":/^([\w\u4E00-\u9FA5_\-\(\)\（\）\s.,]+)+$/,//中英文、数字、空格和符号“-”,“_”,","(",")","（","）",","
        "PRICE":/^[0-9]+(.[0-9]{1,2})?$/, //只能输入最多2位的小数
        "TOTALPRICE":/^[0-9]+(.[0-9]{1,4})?$/, //只能输入最多4位的小数
        "POSITIVEINTEGER":/^[0-9]*[1-9][0-9]*$/, //正整数
        "IMOCODE":/^([\w]+)+$/, //英文和数字
        "ORDERNUMBER":/^([\w\u4E00-\u9FA5_\-.]+)+$/,//中英文、数字和符号“-”、“_”,"."
        "TEMPLATENAME":/^([\w\u4E00-\u9FA5_\-\,\s.]+)+$/,//中英文、数字和符号“-”、“_”,".",空格，','
        "ONLYNAME":/^([\w\u4E00-\u9FA5_\-\(\)\（\）\s]+)+$/,//中英文、数字和符号“-”,“_”,"()（）"空格
        "NAMEEN": /^([\w_\-\(\)\（\）\s]+)+$/,    //英文、数字和符号“-”、“_”,"()","（）"空格
        "NAMECN": /^([\u4E00-\u9FA5_\-\(\)\（\）\d]+)+$/,    //中文、数字和符号“-”、“_”,"()","（）"
        "NAME": /^([\w\u4E00-\u9FA5_\-]+)+$/,    //中英文、数字和符号“-”、“_”
        "NAMESPACE": /^([\w\u4E00-\u9FA5_\-\s]+)+$/,    //中英文、数字和符号“-”、“_”
        "CODE": /^([\w_\-]+)+$/,    //大小写英文、数字和符号“-”、“_”
        "carrierCode": /^([A-Za-z\d\-\&\.\,\(\)\s]+)+$/,    //大小写英文、数字和符号&、.、,、-、(、)
        "CODEWITHBLANK": /^([\w_\-\s]+)+$/,    //大小写英文、数字和符号“-”、“_”、空格
        "PHONE": /^([\d_\-\+]+)+$/,    //数字和符号“-”、“_”
        "NUMBER" : /^\d+(\.\d+)?$/,
        "EMAIL": /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,    //邮箱校验
        "triadCode": /^[A-Za-z]+$/,
        "PAYLOAD": /^(\d{1}|[1-9][0-9]*)$|^(0{1}|[1-9][0-9]*)\.\d{1,3}$/,
        "noZeroInt" : /^[1-9]\d+$/,
        "floatTwo" : /^(\d{1}|[1-9][0-9]*)$|^(0{1}|[1-9][0-9]*)\.\d{1,2}$/,
        "noZeroFloatTwo" : /^[1-9][0-9]*$|^([1-9][0-9]*)\.\d{1,2}$|^[0]\.[1-9]\d*$|^[0]\.[0][1-9]$/,
        "floatFour" : /^(\d{1}|[1-9][0-9]*)$|^(0{1}|[1-9][0-9]*)\.\d{1,4}$/,
        "phoneNumber" : /^1(3|5|6|7|8|9)\d{9}$/,
        "numberPrefix": /^([A-Za-z\d\#\*\!]+)+$/,
        "seriesWNumber": /^([\d\*]+)\?{1}$|^(\d*\?{1}\-\d*\?{1})$/,
        "seriesNumber": /^([\d\*\?]+)$|^(\d*\?{0,1}\d*\-\d*\?{0,1}\d*)$/
    }
)
.value(
    /**
     * 定义常用配置，可在其他directive中调用，需要先引入CONFIG服务。
     */
    "CONFIG",
    {
        "maxThirty": 30,
        "maxFifteen": 15,
        "tipsShow": false
    }
)
.directive('ngEnter', function () {
    /**
     * 自定义ngEnter指令。可以在标签上面直接使用。
     * 如：<p ng-enter="expression"></p>
     * expression为自定义函数或表达式。
     */
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.ngEnter);
                });
                event.preventDefault();
            }
        });
    };
})
.directive('ngConversion', function () {
    /**
     * 自定义ngUpper指令。可以在标签上面直接使用。
     * 如：<input type="text" ng-conversion="lowercase" /> 转换小写
     *    或者 <input type="text" ng-conversion="uppercase" />   转换大写
     * 将输入框的内容进行大小写转换。
     */
    return function (scope, elm, attrs, ctrl) {
        elm.bind("keyup", function (event) {
            if(elm.val() && event.which >= 65 && event.which <= 90){
                if(attrs.ngConversion == 'lowercase'){
                    elm.val((elm.val()).toLowerCase());
                }else if(attrs.ngConversion == 'uppercase'){
                    elm.val((elm.val()).toUpperCase());
                }
            }
        });
    };
})
.directive('verification', ["REGEXP", "CONFIG", function (REGEXP, CONFIG) {
    /**
     * 自定义通用校验指令
     */
    return {
        restrict:'A',
        require: 'ngModel',
        link: function (scope, elm, attrs, ctrl) {


            var tipsPrefix = Lang.getValByKey("common", "common_code_pleinput"),
                tipsOne = Lang.getValByKey("common", "common_code_tipsOne"),
                tipsTwo = Lang.getValByKey("common", "common_code_tipsTwo"),
                tipsThree = Lang.getValByKey("common", "common_code_tipsThree"),
                tipsFour = Lang.getValByKey("common", "common_code_tipsFour"),
                tipsErrFormat = Lang.getValByKey("common", "common_code_errformat");

            var verifiValue = {};
            elm.bind("focus", function(){

                verifiValue = angular.fromJson(attrs);
                verifiValue = eval('(' + verifiValue.verification + ')');

                scope.$apply(function(){
                    //长度限制，默认值30
                    if(verifiValue.maxType){
                        if(verifiValue.maxType == '15') {
                            ctrl.maxLength =  verifiValue.maxLength || CONFIG.maxFifteen;
                        }else if(verifiValue.maxType == '30') {
                            ctrl.maxLength =  verifiValue.maxLength || CONFIG.maxThirty;
                        }
                    }else{
                        ctrl.maxLength =  verifiValue.maxLength || CONFIG.maxThirty;
                    }

                    //默认提示信息
                    verifiValue.tipsShow = verifiValue.tipsShow == undefined ? CONFIG.tipsShow : verifiValue.tipsShow;

                    if(verifiValue.tipsShow){
                        switch(verifiValue.tipsType)
                        {
                            case 'one' :
                                ctrl.tips = tipsOne;
                                break;
                            case 'two' :
                                ctrl.tips = tipsTwo;
                                break;
                            case 'three' :
                                ctrl.tips = tipsThree;
                                break;
                            default :
                                ctrl.tips = verifiValue.tipsMsg ||  tipsOne;
                        }
                    }
                    ctrl.info = true;
                });
            }).bind("blur", function(){
                scope.$apply(function(){
                    ctrl.info = false;
                });
            });

            ctrl.$validators.defined = function (modelValue, viewValue) {
                if (ctrl.$isEmpty(modelValue)) {
                    return true;
                }
                if(verifiValue.ruleReg && verifiValue.ruleRegMsg){
                    verifiValue.ruleReg = eval(verifiValue.ruleReg);
                    if(!verifiValue.ruleReg.test(viewValue)) {
                        ctrl.errorTips = verifiValue.ruleRegMsg || tipsErrFormat;
                        return false;
                    }else{
                        ctrl.errorTips = "";
                    }

                }else if(verifiValue.ruleType){

                    switch(verifiValue.ruleType)
                    {
                        case 'namespace':{

                            if(!REGEXP.NAMESPACE.test(viewValue)){
                                ctrl.errorTips = '请输入中英文、数字、空格和符号“-”、“_”';
                                return false;
                            }
                            break;

                        }
                        case 'goodsname':{

                            if(!REGEXP.GOODSNAME.test(viewValue)){
                                ctrl.errorTips = '请输入中英文、数字、空格和符号“-”、“_”、“.”、“（”、“）”、“(”、“)”、“,”';
                                return false;
                            }
                            break;

                        }
                        case 'suppliername':{
                            if(!REGEXP.SUPPLIERNAME.test(viewValue)){
                                ctrl.errorTips = '请输入中英文、数字、空格和符号“-”、“_”、“.”、“（”、“）”、“(”、“)”、“&”';
                                return false;
                            }
                            break;

                        }
                        case 'price':{
                            if(!REGEXP.PRICE.test(viewValue)){
                                ctrl.errorTips = '请输入数字，最多仅支持2位小数';
                                return false;
                            }
                            break;

                        }
                        case 'totalprice':{
                            if(!REGEXP.TOTALPRICE.test(viewValue)){
                                ctrl.errorTips = '请输入数字，最多仅支持4位小数';
                                return false;
                            }
                            break;
                        }
                        case 'positiveinteger':{
                            if(!REGEXP.POSITIVEINTEGER.test(viewValue)){
                                ctrl.errorTips = '请输入正整数';
                                return false;
                            }
                            break;
                        }
                        case 'imocode':{
                            if(!REGEXP.IMOCODE.test(viewValue)){
                                ctrl.errorTips = '请输入英文、数字';
                                return false;
                            }
                            break;

                        }
                        case 'ordernumber':{
                            if(!REGEXP.ORDERNUMBER.test(viewValue)){
                                ctrl.errorTips = '请输入中英文、数字、“.”、“-”、“_”';
                                return false;
                            }
                            break;
                        }
                        case 'templatename':{
                            if(!REGEXP.TEMPLATENAME.test(viewValue)){
                                ctrl.errorTips = '请输入中英文、数字、“.”、“-”、“_”、空格、“,”';
                                return false;
                            }
                            break;
                        }
                        case 'onlyname':{
                            if(!REGEXP.ONLYNAME.test(viewValue)){
                                ctrl.errorTips = '请输入中英文、数字、空格和符号 “-”、“_”、“(”、“)”、“（”、“）” ';
                                return false;
                            }
                            break;
                        }
                        case 'nameen':{
                            if(!REGEXP.NAMEEN.test(viewValue)){
                                ctrl.errorTips = '请输入英文、数字、“-_()（）”、空格';
                                return false;
                            }
                            break;
                        }
                        case 'namecn':{
                            if(!REGEXP.NAMECN.test(viewValue)){
                                ctrl.errorTips = '请输入中文、数字、“-_()（）”';
                                return false;
                            }
                            break;
                        }
                        case 'name' :
                        {
                            if(!REGEXP.NAME.test(viewValue)){
                                ctrl.errorTips = verifiValue.ruleRegMsg || tipsPrefix + tipsOne;
                                return false;
                            }
                            break;
                        }
                        case 'code' :
                        {
                            if(!REGEXP.CODE.test(viewValue)){
                                ctrl.errorTips = verifiValue.ruleRegMsg || tipsPrefix + tipsTwo;
                                return false;
                            }
                            break;
                        }
                        case 'carrierCode' :
                        {
                            if(!REGEXP.carrierCode.test(viewValue)){
                                ctrl.errorTips = "请输入英文、数字、空格和符号 “-”、“&”、“(”、“)”、“.”、“,” ";
                                return false;
                            }
                            break;
                        }
                        case 'codewithblank':
                        {
                            if(!REGEXP.CODEWITHBLANK.test(viewValue)){
                                ctrl.errorTips = "请输入大小写英文、数字和符号-、_、空格";
                                return false;
                            }
                            break;
                        }
                        case 'email' :
                        {
                            if(!REGEXP.EMAIL.test(viewValue)){
                                ctrl.errorTips = verifiValue.ruleRegMsg || tipsFour;
                                return false;
                            }
                            break;
                        }
                        case 'phone' :
                        {
                            if(!REGEXP.PHONE.test(viewValue)){
                                ctrl.errorTips = verifiValue.ruleRegMsg || tipsPrefix + tipsThree;
                                return false;
                            }
                            break;
                        }
                        case 'number' :
                        {
                            if(!REGEXP.PHONE.test(viewValue)){
                                ctrl.errorTips = verifiValue.ruleRegMsg || tipsPrefix + tipsThree;
                                return false;
                            }
                            break;
                        }
                        case 'payload':
                        {
                            if(!REGEXP.PAYLOAD.test(viewValue)){
                                ctrl.errorTips = verifiValue.ruleRegMsg;
                                return false;
                            }
                            break;
                        }
                        case 'floatTwo':
                        {
                            if(!REGEXP.floatTwo.test(viewValue)){
                                ctrl.errorTips = verifiValue.ruleRegMsg;
                                return false;
                            }
                            break;
                        }
                        case 'floatFour':
                        {
                            if(!REGEXP.floatFour.test(viewValue)){
                                ctrl.errorTips = verifiValue.ruleRegMsg;
                                return false;
                            }
                            break;
                        }
                        case 'phoneNumber':
                        {
                            if(!REGEXP.phoneNumber.test(viewValue)){
                                ctrl.errorTips = verifiValue.ruleRegMsg;
                                return false;
                            }
                            break;
                        }
                        case 'emailNumber' :
                        {
                            if(!REGEXP.emailNumber.test(viewValue)){
                                ctrl.errorTips = verifiValue.ruleRegMsg || tipsFour;
                                return false;
                            }
                            break;
                        }
                        case 'numberPrefix':
                        {
                            if(!REGEXP.numberPrefix.test(viewValue)){
                                ctrl.errorTips = verifiValue.ruleRegMsg;
                                return false;
                            }
                            break;
                        }
                        case 'seriesWNumber':
                        {
                            if(!REGEXP.seriesWNumber.test(viewValue)){
                                ctrl.errorTips = '请按已选规则输入*-?或数字';
                                return false;
                            }
                            break;
                        }
                        case 'seriesNumber':
                        {
                            if(!REGEXP.seriesNumber.test(viewValue)){
                                ctrl.errorTips = '请按已选规则输入*-?或数字';
                                return false;
                            }
                            break;
                        }
                    }
                }
                return true;
            }
        }
    };
}])
.directive('hnapagination', [function () {
    /**
     * 分页指令。
     */
    return {
        restrict: 'EA',
        templateUrl: 'tpl/public/pagination.html',
        scope:{
            'pageTable':'=pageTableModel',
            'table':'=tableService'
        },
        replace:true,
        link: function(scope) {
            scope.total = Lang.getValByKey("common", 'common_pagination_total');
            scope.piecedata = Lang.getValByKey("common", 'common_pagination_piecedata');
            scope.perPage = Lang.getValByKey("common", 'common_pagination_perPage');
            scope.piece = Lang.getValByKey("common", 'common_pagination_piece');
            scope.home = Lang.getValByKey("common", 'common_pagination_home');
            scope.prev = Lang.getValByKey("common", 'common_pagination_prev');
            scope.next = Lang.getValByKey("common", 'common_pagination_next');
            scope.last = Lang.getValByKey("common", 'common_pagination_last');
            scope.go = Lang.getValByKey("common", 'common_pagination_go');
            scope.page = Lang.getValByKey("common", 'common_pagination_page');
            scope.confirm = Lang.getValByKey("common", 'common_pagination_confirm');
        }
    };
}])
.directive('fileModel', ['$parse', '$rootScope', function ($parse, $rootScope) {
    /** 文件上传 */
    return {
        restrict: 'A',
        link: function(scope, element, attrs, ngModel) {
            if(attrs.multiple){    //多图上传
                element.bind('change', function(event){
                    var avatarFile = [];
                    scope.$apply(function(){
                        if(attrs.multiple){
                            for(var i=0, length=element[0].files.length; i<length; i++){
                                avatarFile.push(element[0].files[i]);
                            }
                        }
                    });
                    scope.getFile(avatarFile, event);
                });
            }else{
                var model = $parse(attrs.fileModel);
                var modelSetter = model.assign;
                element.bind('change', function(event){
                    scope.$apply(function(){
                        modelSetter(scope, element[0].files[0]);
                        modelSetter($rootScope, element[0].files[0]);
                    });
                    //附件预览
                    scope.file = (event.srcElement || event.target).files[0];
                    scope.getFile(event);
                });
            }
        }
    };
}])
.directive('fileNew', ['$parse', function ($parse){
    /** 文件上传 */
    return {
        restrict: 'A',
        link: function(scope, element, attrs, ngModel) {
            var model = $parse(attrs.fileNew);
            var modelSetter = model.assign;
            element.bind('change', function(event){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
                //附件预览
                scope.file = (event.srcElement || event.target).files[0];
                scope.updateFile();
            });
        }
    };
}])
.constant(
    'RULES',
    {
        'validate' : {
            name : /^([\w\u4E00-\u9FA5_\-]+)+$/,    //中英文、数字和符号“-”、“_”
            surname : /^([A-Za-z\s\u4E00-\u9FA5]+)+$/,    //中英文、空格
            code : /^([\w_\-]+)+$/,                 //大小写英文、数字和符号“-”、“_”
            phone : /^([\d_\-\+]+)+$/,              //数字和符号“-”、“_”、“+”
            mobilephone : /^1[356789]\d{9}$/,           
            //大小写英文、数字和符号“-”、“_”“+”
            email : /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
            triadCode : /^[A-Za-z]+$/,
            number : /^\d+(\.\d+)?$/,
            letterAndNum : /^[A-Za-z0-9]+$/,            //英文和数字
            float : /^\d+(\.\d{1,3})?$/,
            floatTwo : /^(\d{1}|[1-9][0-9]*)$|^(0{1}|[1-9][0-9]*)\.\d{1,2}$/,
            noZeroFloatTwo : /^[1-9][0-9]*$|^([1-9][0-9]*)\.\d{1,2}$|^[0]\.[1-9]\d*$|^[0]\.[0][1-9]$/,
            floatThree : /^(\d{1}|[1-9][0-9]*)$|^(0{1}|[1-9][0-9]*)\.\d{1,3}$/,
            floatFour : /^(\d{1}|[1-9][0-9]*)$|^(0{1}|[1-9][0-9]*)\.\d{1,4}$/,
            fix : /^([\d\s\-\+\(\)]+)+$/              //数字、空格和符号“(”、“）”、“-”、“+”
        }
    }
)
.directive('validateCode', ['RULES', function(RULES){
    /**
     * 自定义校验
     * 只需要添加校验正则和提示
     */
    return {
        restrict:'A',
        require: 'ngModel',
        replace:true,
        link: function (scope, elm, attrs, ctrl) {
            var verifiValue = {};
            verifiValue = angular.fromJson(attrs);

            verifiValue.validateCode = eval('(' + verifiValue.validateCode + ')');
            if(verifiValue.validateCode.maxLength) {
                elm.attr('maxLength', verifiValue.validateCode.maxLength);
            };

            elm.bind("focus", function(){
                scope.$apply(function(){
                    ctrl.tips = verifiValue.validateCode.ruleRegMsg;
                    ctrl.info = true;
                });
            }).bind("blur", function(){
                scope.$apply(function(){
                    ctrl.info = false;
                });
            });

            ctrl.$validators.defined = function (modelValue, viewValue){
                if (ctrl.$isEmpty(modelValue)){
                    return true;
                }
                if(verifiValue.validateCode.ruleReg){
                    var ruleReg = verifiValue.validateCode.ruleReg;

                    var keys = [];
                    for(var key in RULES.validate){
                        keys.push(key);
                    };

                    if(ruleReg.indexOf('/') != -1){
                        if(!eval(ruleReg).test(viewValue)){
                            ctrl.errorTips = verifiValue.validateCode.ruleRegMsg;
                            return false;
                        }
                    }else{
                        for(var i in keys){
                            if(ruleReg == keys[i]){
                                if(!RULES.validate[ruleReg].test(viewValue)){
                                    ctrl.errorTips = verifiValue.validateCode.ruleRegMsg;
                                    return false;
                                }
                            }
                        }
                    };

                };
                return true;
            }
        }
    };
}])
.directive('validatetip', [function (){
    /**
     * 自定义校验提示
     * 联合validateCode使用
     */
    return {
        restrict: 'EA',
        templateUrl: 'tpl/public/validate.html',
        scope:{
            'validate':'=fromModel'
        },
        replace:true,
        link: function(scope){
            // console.log(scope.validate, ' validate')
        }
    };
}])
/**
 * 备注
 *
 */
.directive('remark', [function (){
    return  {
        restrict:'EA',
        replace:true,
        templateUrl: 'tpl/public/remark.html',

        scope:{
            description:'='

        },
        link: function (scope,elm,attrs) {
            scope.textareaNumber = 140;
            scope.showTextNumber = function () {
                scope.textareaNumber = 140 - scope.description.length;
            };
            scope.word = Lang.getValByKey("common", "common_page_remark_number");
            // elm.attr('placeholder',Lang.getValByKey("common", "common_page_remark"));

        }

    };
}])
.directive('myDrag',function(){
    return {
        restrict : 'A',
        link : function(scope,element,attr){

            // var disX = 0;
            var disY = 0;
            //console.log(typeof attr.myDrag);
            //attr.myDrag = angular.equals(attr.myDrag,'true');

            element.on('mousedown',function(ev){
                var This = this;
                //disX = ev.pageX - $(this).offset().left;
                disY = ev.pageY - $(this).offset().top;


                $(document).on('mousemove',function(ev){
                   // $(This).css('left',ev.pageX - disX);
                   $(This).css('top',ev.pageY - disY);
                });
                $(document).on('mouseup',function(){
                    $(document).off();
                });
                return false;
            });

        }
    };
})


.directive('textLength', [function(){
    /**
     * 自定义计算备注字符长度
     */
    return {
        restrict: 'EA',
        require: 'ngModel',
        replace:true,
        link: function(scope, elm, attrs, ctrl){
            elm.bind("focus", function(){
                scope.$apply(function(){
                    elm.parent().find('.text-legth').remove();
                    elm.after('<div class="text-legth">'+(140-elm.val().length)+Lang.getValByKey("common", "common_page_remark_number")+'</div>');
                });
            });

            elm.on("keyup", function(){
                var value = elm.val();
                scope.$apply(function(){
                    if(value.length){
                        elm.parent().find('.text-legth').remove();
                        var valLength = 140-value.length < 0 ? 0 : 140-value.length;
                        elm.after('<div class="text-legth">'+valLength+Lang.getValByKey("common", "common_page_remark_number")+'</div>');
                    }else{
                        elm.parent().find('.text-legth').remove();
                        elm.after('<div class="text-legth">'+140+Lang.getValByKey("common", "common_page_remark_number")+'</div>');
                    }
                });
            });

            elm.on("change", function(){
                var value = elm.val();
                scope.$apply(function(){
                    if(value.length){
                        elm.parent().find('.text-legth').remove();
                        var valLength = 140-value.length < 0 ? 0 : 140-value.length;
                        elm.after('<div class="text-legth">'+valLength+Lang.getValByKey("common", "common_page_remark_number")+'</div>');
                    }
                });
            });

            elm.on('cut paste', function(){
                var el = $(this);
                scope.$apply(function(){
                    setTimeout(function() {
                        var value = $(el).val();
                        if(value.length){
                            elm.parent().find('.text-legth').remove();
                            var valLength = 140-value.length < 0 ? 0 : 140-value.length;
                            elm.after('<div class="text-legth">'+valLength+Lang.getValByKey("common", "common_page_remark_number")+'</div>');
                        }
                    }, 100);
                });
            });

            elm.bind("blur", function(){
                scope.$apply(function(){
                    elm.parent().find('.text-legth').remove();
                });
            });

        },

    };
}])

.directive('textLength2', [function(){
        /**
         * 自定义计算备注字符长度
         */
        return {
            restrict: 'EA',
            require: 'ngModel',
            replace:true,
            link: function(scope, elm, attrs, ctrl){

                elm.bind("focus", function(){
                    scope.$apply(function(){
                        elm.parent().find('.text-legth').remove();
                        elm.after('<div class="text-legth">'+(200-elm.val().length)+Lang.getValByKey("common", "common_page_remark_number")+'</div>');
                    });
                });

                elm.on("keyup", function(){
                    var value = elm.val();
                    scope.$apply(function(){
                        if(value.length){
                            elm.parent().find('.text-legth').remove();
                            var valLength = 200-value.length < 0 ? 0 : 200-value.length;
                            elm.after('<div class="text-legth">'+valLength+Lang.getValByKey("common", "common_page_remark_number")+'</div>');
                        }else{
                            elm.parent().find('.text-legth').remove();
                            elm.after('<div class="text-legth">'+200+Lang.getValByKey("common", "common_page_remark_number")+'</div>');
                        }
                    });
                });

                elm.on("change", function(){
                    var value = elm.val();
                    scope.$apply(function(){
                        if(value.length){
                            elm.parent().find('.text-legth').remove();
                            var valLength = 200-value.length < 0 ? 0 : 200-value.length;
                            elm.after('<div class="text-legth">'+valLength+Lang.getValByKey("common", "common_page_remark_number")+'</div>');
                        }
                    });
                });

                elm.on('cut paste', function(){
                    var el = $(this);
                    scope.$apply(function(){
                        setTimeout(function() {
                            var value = $(el).val();
                            if(value.length){
                                elm.parent().find('.text-legth').remove();
                                var valLength = 200-value.length < 0 ? 0 : 200-value.length;
                                elm.after('<div class="text-legth">'+valLength+Lang.getValByKey("common", "common_page_remark_number")+'</div>');
                            }
                        }, 100);
                    });
                });

                elm.bind("blur", function(){
                    scope.$apply(function(){
                        elm.parent().find('.text-legth').remove();
                    });
                });

            },

        };
    }])


.directive('valiateWeight', function(){
    return {
        restrict: 'EA',
        require: 'ngModel',
        link: function(scope, elm, attrs, ctrl){
               scope.$watch("weightLimitMin",function(n){
                    cb(n, 'min');
               } );
               scope.$watch("weightLimitMax", function(n){
                    cb(n, 'max');
                });
               scope.canSubmit = true;
               function cb(n, type){
                    scope.weightLimitMsg = '';
                    // 这里的weightLimitMin/Max必须是input标签的name, 因为后面要用这个去控制input的样式
                    removeClass('weightLimitMin');
                    removeClass('weightLimitMax');
                    if(scope.weightLimitMin == null) scope.weightLimitMin = '';
                    if(scope.weightLimitMax == null) scope.weightLimitMax = '';
                    if(typeof n === 'string' || typeof n === 'number'){
                        if(scope.weightLimitMin === '' && scope.weightLimitMax === ''){
                            scope.weightLimitMsg = '';
                            scope.canSubmit = true;
                            removeClass('weightLimitMin');
                            removeClass('weightLimitMax');
                            return;
                        }
                        // 当校验min时, 不只要校验min的值是否正确, 还要同时校验max的值是否正确。校验max值的时候同理。
                        if(!checkWeight(scope.weightLimitMin) && type === 'min'){
                            scope.weightLimitMsg = "请输入数字，保留三位小数";
                            addClass('weightLimitMin');
                            return;
                        }
                        if(!checkWeight(scope.weightLimitMax) && type === 'min'){
                            scope.weightLimitMsg = "请输入数字，保留三位小数";
                            addClass('weightLimitMax');
                            return;
                        }
                        if(!checkWeight(scope.weightLimitMax) && type === 'max'){
                            scope.weightLimitMsg = "请输入数字，保留三位小数";
                            addClass('weightLimitMax');
                            return;
                        }
                        if(!checkWeight(scope.weightLimitMin) && type === 'max'){
                            scope.weightLimitMsg = "请输入数字，保留三位小数";
                            addClass('weightLimitMin');
                            return;
                        }
                        if(!checkWeight(scope.weightLimitMin) && scope.weightLimitMax){
                            scope.weightLimitMsg = "请输入下限值";
                            addClass('weightLimitMin');
                            return;
                        }
                        if(!checkWeight(scope.weightLimitMax) && scope.weightLimitMin){
                            scope.weightLimitMsg = "请输入上限值";
                            addClass('weightLimitMax');
                            return;
                        }
                        if(checkWeight(scope.weightLimitMin) && checkWeight(scope.weightLimitMax)){
                            if(parseFloat(scope.weightLimitMin) >= parseFloat(scope.weightLimitMax)){
                                scope.weightLimitMsg = "下限值必须小于上限值";
                                addClass('weightLimitMin');
                                addClass('weightLimitMax');
                            }
                        }
                    } else {
                        addClass('weightLimitMin');
                        addClass('weightLimitMax');
                    }
               }

               function addClass(name){
                   $('input[name="'+ name +'"]').addClass("ng-invalid ng-dirty");
                    scope.canSubmit = false;
               }
               function removeClass(name){
                    $('input[name="'+ name +'"]').removeClass("ng-invalid ng-dirty");
                    scope.canSubmit = true;
               }
        }
    }
})

.directive('formatEnt', function(entTypeFilter){
    return {
        require: 'ngModel',
        link: function(scope, element, attrs, ngModelController) {
        ngModelController.$parsers.push(function(data) {
            return entTypeFilter(data); //converted
        });
        ngModelController.$formatters.push(function(data) {
            return entTypeFilter(data); //converted
        });
        }
    }
});

function checkWeight(val){
    if(!val) return true;
    // var reg = /^[0-9]{1,6}(\.[0-9]{1,3})$/;
    // var reg2 = /^[0-9]{1,10}$/;
    var reg = /^(\d{1}|[1-9][0-9]*)$|^(0{1}|[1-9][0-9]*)\.\d{1,3}$/;
    if(reg.test(val)){
        return true;
    }
    return false;
}
