var Calander
easySpa.require(['widget/calander'], function() {
     Calander = {
        config: null,
        inputPool: "",
        beginTime: "",
        finishTime: "",
        classPool: [],
        resetCalanderLayout: function() {
            var currentInputEle = this.getCurrentInputEle();
            if(currentInputEle && currentInputEle.length > 0) {
                var calanderEle = $(".ui-datepicker");
                calanderEle.offset({
                    left: currentInputEle.offset().left
                });
            }
        },
        getCurrentInputEle: function() {
            for(var index = 0; index < this.classPool.length; index++) {
                if($(".ui-datepicker").hasClass(this.classPool[index])) {
                    return $(this.inputPool[index]);
                }
            }
            return null;
        },
        clearOtherClass: function(currentClass) {
            for(var index = 0; index < this.classPool.length; index++) {
                if(currentClass != this.classPool[index]) {
                    $(".ui-datepicker").removeClass(this.classPool[index]);
                }
            }
        },
        build: function() {
            var self = this;
            if(typeof self.inputPool != "string") {
                $(self.inputPool[0]).datetimepicker({
                    timeFormat: this.config.showTime? "HH:mm:ss":"",
                    dateFormat: "yy-mm-dd",
                    showSecond: this.config.showSecond,
                    showMinute: this.config.showMinute,
                    showHour: this.config.showHour,
                    showTime: this.config.showTime,
                    changeYear: true,
                    changeMonth: true,
                    showOtherMonths: true,
                    beforeShow: function() {
                        self.beginTime = $(self.inputPool[0]).val();
                        if($.trim($(self.inputPool[1]).val())) {
                            $(self.inputPool[0]).datetimepicker("option", "maxDate", $(self.inputPool[1]).val());
                            $(self.inputPool[0]).val(self.beginTime);
                        } else {
                            $(self.inputPool[0]).datetimepicker("option", "maxDate", "");
                            $(self.inputPool[0]).val(self.beginTime);
                        }
                        $(".ui-datepicker").css("visibility", "visible");
                        $(".ui-datepicker").removeClass("canlander2");
                        $(".ui-datepicker").addClass("canlander");
                        self.clearOtherClass(self.classPool[0]);
                        $(".ui-datepicker").addClass(self.classPool[0]);
                    },
                    onChangeMonthYear: function() {
                        if(self.config.difference && ($(self.inputPool[0]).val() == $(self.inputPool[1]).val())){
                            var beginTimeData = new Date($(self.inputPool[1]).val()).getTime() - (self.config.difference || 0);

                            $(self.inputPool[0]).datetimepicker("setDate", new Date(beginTimeData).format("yyyy-MM-dd hh:mm:ss"));
                            $(self.inputPool[0]).datetimepicker("refresh");
                            self.beginTime = $(self.inputPool[0]).val();
                        }else{
                            self.beginTime = $(self.inputPool[0]).val();
                        }
                    },
                    onSelect: function(date) {
                        var beginTimeData = new Date(date).getTime();
                        var finishTimeData = new Date($(self.inputPool[1]).val()).getTime() - (self.config.difference || 0);
                        if(finishTimeData < beginTimeData && $.trim($(self.inputPool[1]).val())) {
                            $(self.inputPool[0]).val(new Date(finishTimeData).format("yyyy-MM-dd hh:mm:ss"));
                            $(self.inputPool[0]).datetimepicker("setDate", new Date(finishTimeData).format("yyyy-MM-dd hh:mm:ss"));
                            $(self.inputPool[0]).datetimepicker("refresh");
                            self.beginTime = $(self.inputPool[0]).val();
                        } else {
                            self.beginTime = date;
                        }
                    },
                    onClose: function() {
                        if(!self.config.isClear){
                            $(self.inputPool[0]).datetimepicker("setDate", self.beginTime);
                            $(self.inputPool[0]).val(self.beginTime);
                        }
                    }
                });

                $(self.inputPool[1]).datetimepicker({
                    timeFormat: this.config.showTime? "HH:mm:ss":"",
                    dateFormat: "yy-mm-dd",
                    showSecond: this.config.showSecond,
                    showMinute: this.config.showMinute,
                    showHour: this.config.showHour,
                    showTime: this.config.showTime,
                    changeYear: true,
                    changeMonth: true,
                    beforeShow: function() {
                        self.finishTime = $(self.inputPool[1]).val();
                        $(self.inputPool[1]).datetimepicker("option", "defaultDate", self.finishTime);
                        $(self.inputPool[1]).datetimepicker("setDate", self.finishTime);
                        if($.trim($(self.inputPool[0]).val())) {
                            $(self.inputPool[1]).datetimepicker("option", "minDate", $(self.inputPool[0]).val());
                        } else {
                            $(self.inputPool[1]).datetimepicker("option", "minDate", "");
                        }
                        $(".ui-datepicker").css("visibility", "visible");
                        $(".ui-datepicker").removeClass("canlander2");
                        $(".ui-datepicker").addClass("canlander");
                        self.clearOtherClass(self.classPool[1]);
                        $(".ui-datepicker").addClass(self.classPool[1]);
                    },
                    onSelect: function(date) {
                        var beginTimeData = new Date($(self.inputPool[0]).val()).getTime() + (self.config.difference || 0);
                        var finishTimeData = new Date(date).getTime();
                        if(finishTimeData < beginTimeData && $.trim($(self.inputPool[0]).val())) {
                            $(self.inputPool[1]).val(new Date(beginTimeData).format("yyyy-MM-dd hh:mm:ss"));
                            $(self.inputPool[1]).datetimepicker("setDate", new Date(beginTimeData).format("yyyy-MM-dd hh:mm:ss"));
                            $(self.inputPool[1]).datetimepicker("refresh");
                            self.finishTime = $(self.inputPool[1]).val();
                        } else {
                            self.finishTime = date;
                        }
                    },
                    onChangeMonthYear: function() {
                        if(self.config.difference && ($(self.inputPool[0]).val() == $(self.inputPool[1]).val())){
                            var finishTimeData = new Date($(self.inputPool[0]).val()).getTime() + (self.config.difference || 0);

                            $(self.inputPool[1]).datetimepicker("setDate", new Date(finishTimeData).format("yyyy-MM-dd hh:mm:ss"));
                            $(self.inputPool[1]).datetimepicker("refresh");
                            self.finishTime = $(self.inputPool[1]).val();
                        }else{
                            self.finishTime = $(self.inputPool[1]).val();
                        }
                    },
                    onClose: function() {
                        if(!self.config.isClear){
                            $(self.inputPool[1]).datetimepicker("setDate", self.finishTime);
                            $(self.inputPool[1]).val(self.finishTime);
                        }
                    }
                });
            } else {
                $(self.inputPool).datetimepicker({
                    timeFormat: this.config.showTime? "HH:mm:ss":"",
                    dateFormat: "yy-mm-dd",
                    showSecond: this.config.showSecond,
                    showMinute: this.config.showMinute,
                    showHour: this.config.showHour,
                    showTime: this.config.showTime,
                    changeYear: true,
                    changeMonth: true,
                    showOtherMonths: true,
                    beforeShow: function() {
                        $(".ui-datepicker").css("visibility", "visible");
                        $(".ui-datepicker").removeClass("canlander2");
                        $(".ui-datepicker").addClass("canlander");
                        self.clearOtherClass(self.classPool[0]);
                        $(".ui-datepicker").addClass(self.classPool[0]);
                    }
                });
            }
        },
        bindEvent: function() {
            var self = this;
            $(window).resize(function() {//保证在拉缩窗口的时候更新日历位置
                var currentInputEle = self.getCurrentInputEle();
                if(currentInputEle && currentInputEle.length > 0) {
                    var calanderEle = $(".ui-datepicker");
                    calanderEle.offset({
                        left: currentInputEle.offset().left
                    });
                }
            });
        },
        initData: function() {
            this.inputPool = this.config.ele;
            if(typeof this.inputPool == "string") {
                this.classPool = this.inputPool.substring(1, this.inputPool.length) + "-canlander";
            } else {
                this.classPool.push(this.inputPool[0].substring(1, this.inputPool[0].length) + "-canlander");
                this.classPool.push(this.inputPool[1].substring(1, this.inputPool[1].length) + "-canlander");
            }
        },
        resetData: function() {
            this.config = null;
            this.inputPool = "";
            this.beginTime = "";
            this.finishTime = "";
            this.classPool = [];
        },
        init: function(config) {
            if(typeof config.showHour == "undefined") {
                config.showHour = true;
            }
            if(typeof config.showMinute == "undefined") {
                config.showMinute = true;
            }
            if(typeof config.showSecond == "undefined") {
                config.showSecond = true;
            }
            if(typeof config.showTime == "undefined") {
                config.showTime = true;
            }
            this.resetData();
            this.config = config;
            this.initData();
            this.build();
            this.bindEvent();
            Calander = $.extend(true, {}, Calander);
        }
    }
});