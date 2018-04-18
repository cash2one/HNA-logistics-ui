app.controller('cumulativeCtrl',['$scope', 'cockpitService', function($scope, cockpitService){
    var maxDate = new Date().format("yyyy-MM-dd");
    var TEN_THOUSAND = '万';
    var HUNDRED_MILLION = '亿';
    var TRILLION = '万亿';
    var UNLIMITED = '不限';
    var SUPPLIER_UNIT = '个';
    $scope.datas = [];
    initCalendar();

    $scope.getCumulativeStatics = function(){
        var config = {
            urlParams: {
                startDate: $scope.cumulativeStart === UNLIMITED ? '' : $scope.cumulativeStart.replace(/(^\s+)|(\s+$)/g,""),
                endDate: $scope.cumulativeEnd.replace(/(^\s+)|(\s+$)/g,"")
            }
        };
        cockpitService.getCumulativeStatics(config, function(res){
            if(res.errorCode === 0 && res.data){
                res.data.forEach(function(val, index){
                    if(val.id === 'supplier' || val.id === 'customer'){
                        val.unit = SUPPLIER_UNIT;
                    }
                    if(val.allCount < 10000){
                        val._allCount = (val.id === 'amount' || val.id === 'volume') ? val.allCount.toFixed(2) : val.allCount;
                        val._allCountUnit = val.unit;
                    }else if(val.allCount < 100000000 && val.allCount >= 10000){
                        val._allCount = (val.allCount / 10000).toFixed(2);
                        val._allCountUnit = TEN_THOUSAND + val.unit;
                    }else if(val.allCount > 1000000000000){
                        val._allCount = (val.allCount / 1000000000000).toFixed(2);
                        val._allCountUnit = TRILLION + val.unit;
                    }else{
                        val._allCount = (val.allCount / 100000000).toFixed(2);
                        val._allCountUnit = HUNDRED_MILLION + val.unit;
                    }

                    if(val.logisticsCount < 10000){
                        val._logisticsCount = (val.id === 'amount' || val.id === 'volume') ? val.logisticsCount.toFixed(2) : val.logisticsCount;
                        val._logisticsCountUnit = val.unit;
                    }else if(val.logisticsCount < 100000000 && val.logisticsCount >= 10000){
                        val._logisticsCount = (val.logisticsCount / 10000).toFixed(2);
                        val._logisticsCountUnit = TEN_THOUSAND + val.unit;
                    }else if(val.logisticsCount > 1000000000000){
                        val._logisticsCount = (val.logisticsCount / 1000000000000).toFixed(2);
                        val._logisticsCountUnit = TRILLION + val.unit;
                    }else{
                        val._logisticsCount = (val.logisticsCount / 100000000).toFixed(2);
                        val._logisticsCountUnit = HUNDRED_MILLION + val.unit;
                    }

                    if(val.tradeCount < 10000){
                        val._tradeCount = (val.id === 'amount' || val.id === 'volume') ? val.tradeCount.toFixed(2) : val.tradeCount;
                        val._tradeCountUnit = val.unit;
                    }else if(val.tradeCount < 100000000 && val.tradeCount >= 10000){
                        val._tradeCount = (val.tradeCount / 10000).toFixed(2);
                        val._tradeCountUnit = TEN_THOUSAND + val.unit;
                    }else if(val.tradeCount > 1000000000000){
                        val._tradeCount = (val.tradeCount / 1000000000000).toFixed(2);
                        val._tradeCountUnit = TRILLION + val.unit;
                    }else{
                        val._tradeCount = (val.tradeCount / 100000000).toFixed(2);
                        val._tradeCountUnit = HUNDRED_MILLION + val.unit;
                    }

                });
                $scope.datas = res.data;
                setTimeout(function(){
                    initPieCharts();
                }, 10)
            }
        });
    };
    $scope.getCumulativeStatics();

    function initCalendar() {
        /*日期组件初始化*/
        Calander.init({
            ele: ["#cumulativeStartTime", "#cumulativeEndTime"],
            isClear: true,
            showHour:false,
            showMinute:false,
            showSecond:false,
            showTime:false
        });
        $scope.cumulativeStart = UNLIMITED;
        $scope.cumulativeEnd = maxDate;
    };

    function initPieCharts() {
        for(var i = 0; i < $scope.datas.length; i++){
            (function(currentIndex){
                var data = $scope.datas;
                var myChart = 'myChart_' + currentIndex;
                var option = 'option_' + currentIndex;
                option = {
                    series: [
                        {
                            name: '',
                            type: 'pie',
                            radius: ['76%', '82%'],
                            labelLine: {
                                normal: {
                                    show: false
                                }
                            },
                            hoverAnimation: false,
                            silent: true,
                            data: [{
                                value: data[currentIndex].tradeCount,
                                itemStyle: {
                                    normal: {
                                        color: {
                                            type: 'linear',
                                            x: 1,
                                            y: 1,
                                            x2: 0,
                                            y2: 0,
                                            colorStops: [{
                                                offset: 0, color: '#E1DFFD' // 0% 处的颜色
                                            },
                                                {
                                                    offset: 0.34, color: '#00C5FE'
                                                },{
                                                    offset: 1, color: '#3A93FF' // 100% 处的颜色
                                                }]
                                        },
                                        borderColor: new echarts.graphic.LinearGradient(1, 1, 0, 0, [{
                                            offset: 0, color: '#E1DFFD'
                                        }, {
                                            offset: 0.34, color: '#00C5FE'
                                        },{
                                            offset: 1, color: '#3A93FF'
                                        }]),
                                        borderWidth: 5
                                    }
                                }
                            },{
                                value: data[currentIndex].logisticsCount,
                                itemStyle: {
                                    normal: {
                                        color: 'rgba(128,128,128,0)',
                                        borderColor: new echarts.graphic.LinearGradient(1, 1, 0, 0, [{
                                            offset: 0, color: '#E1DFFD'
                                        }, {
                                            offset: 0.34, color: '#00C5FE'
                                        },{
                                            offset: 1, color: '#3A93FF'
                                        }]),
                                        borderWidth: 5,
                                        opacity: 0.2
                                    }
                                }
                            }]
                        }
                    ]
                };
                myChart = echarts.init(document.getElementById('trade' + currentIndex));
                myChart.setOption(option);
            })(i)
        }
    };

    $scope.jumpTo = function(id, type){
        if(id === 'amount' || id === 'volume'){
            return;
        }
        if(type === 'logistics'){
            switch(id){
                case 'order':
                    window.location.href = '#/orders';
                    break;
                case 'supplier':
                    window.location.href = '#/supplier';
                    break;
                case 'customer':
                    window.location.href = '#/customer?module=logistics';
                    break;
                default:
                    return;
            }
        }else{
            switch(id){
                case 'order':
                    window.location.href = '#/tradeOrderSearch';
                    break;
                case 'supplier':
                    window.location.href = '#/supplier?module=trade';
                    break;
                case 'customer':
                    window.location.href = '#/customer?module=trade';
                    break;
                default:
                    return;
            }
        }
    }

}]);