app.controller('weeklyStaticsCtrl', ['$scope', '$route','cockpitService', function($scope, $route, cockpitService){
    var weeklyChart = echarts.init(document.getElementById("weeklyChart"));
    var currentDay = new Date().getDay() === 0 ? 7 : new Date().getDay();
    var maxDate = getBeforeDate(currentDay);
    $scope.stateName = '物流';
    $scope.stateCode = 'logistics';
    $scope.weeklyStart = getBeforeDate(currentDay + 34);
    $scope.weeklyEnd = maxDate;
    initCalendar();
    initStateSelect();

    function initStateSelect(){
        var selectData = {
            data: [
                {
                    name: '物流',
                    code: 'logistics'
                },
                {
                    name: '贸易',
                    code: 'trade'
                }
            ]
        };
        var stateEle = selectFactory({
            data: selectData,
            id: 'state',
            defaultText: null,
            attrTextModel: function(name, data, currentData){
                if(currentData.code === 'logistics'){
                    $scope.stateName = '物流';
                    $scope.stateCode = 'logistics';
                }else{
                    $scope.stateName = '贸易';
                    $scope.stateCode = 'trade';
                }
                $scope.$apply();
            }
        });
    };
    function initCalendar() {
        /*日期组件初始化*/
        Calander.init({
            ele: ["#startTime", "#endTime"],
            isClear: true,
            showHour:false,
            showMinute:false,
            showSecond:false,
            showTime:false
        });
    };


    $scope.initChart = function() {
        var config = {
            urlParams: {
                startDate: $scope.weeklyStart,
                endDate: $scope.weeklyEnd
            },
            seatParams: {
                type: $scope.stateCode
            }
        };
        cockpitService.getWeeklyStatics(config, function(res){
            if(res.errorCode === 0){
                var dataAxis = [],
                    yAxisLeftData = [],  // Y轴(左)
                    yAxisRightData = [],  // Y轴(右)
                    yAxisLeft = 'CNY',
                    yAxisRight = '单';
                res.data.statisticsList.forEach(function(val, index){
                    dataAxis.push('w' + val.week + '\r\n' + val.year);
                    yAxisLeftData.push(val.amount);
                    yAxisRightData.push(val.billCount);
                });

                var option = {
                    color: ['#09ACF8','#7938D0 '],
                    tooltip : {
                        trigger: 'axis',
                        backgroundColor: '#fff',
                        textStyle: {
                            color: '#8CA0B3',
                            fontsize: 16
                        },
                        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                            type : 'cross',        // 默认为直线，可选为：'line' | 'cross'
                            label: {
                                show: true,
                                backgroundColor: 'transparent',
                                textStyle: {
                                    color: 'transparent'
                                }
                            },
                            lineStyle: {
                                color: '#C6EAFF',
                                type: 'solid',
                                opacity: 0.69
                            },
                            crossStyle: {
                                color: '#C6EAFF',
                                type: 'solid',
                                opacity: 0.69
                            }
                        }
                    },
                    legend: {
                        left: 'center',
                        top: 12,
                        data:[{
                            name: '交易额',
                            icon: 'circle',
                            textStyle: {
                                color: '#8CA0B3'
                            }
                        },{
                            name: '订单量',
                            icon: 'circle',
                            textStyle: {
                                color: '#8CA0B3'
                            }
                        }]
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis : [
                        {
                            type : 'category',
                            data : dataAxis,
                            boundaryGap: false,
                            axisLine: {
                                show: true,
                                lineStyle: {
                                    color: '#4187E6',
                                    width: 1,
                                    type: 'solid',
                                    opacity: 0.61
                                }
                            },
                            axisLabel: {
                                show: true,
                                color: '#8CA0B3',
                                fontSize: 16,
                                margin: 10
                            },
                            axisTick: {
                                show: false
                            },
                            splitLine: {
                                show: true,
                                lineStyle: {
                                    color: '#8CA0B3',
                                    type: 'dotted',
                                    opacity: 0.4
                                }
                            }
                        }
                    ],
                    yAxis : [
                        {
                            type: 'value',
                            name: yAxisLeft,
                            nameTextStyle: {
                                color: '#697B8C',
                                fontSize: 16
                            },
                            position: 'left',
                            axisLine: {
                                show: true,
                                lineStyle: {
                                    color: '#4187E6',
                                    width: 1,
                                    type: 'solid',
                                    opacity: 0.61
                                }
                            },
                            axisLabel: {
                                show: true,
                                color: '#8CA0B3',
                                fontSize: 16,
                                margin: 20
                            },
                            axisTick: {
                                show: false
                            },
                            splitLine: {
                                show: true,
                                lineStyle: {
                                    color: '#8CA0B3',
                                    type: 'dotted',
                                    opacity: 0.4
                                }
                            }
                        },
                        {
                            type: 'value',
                            name: yAxisRight,
                            nameTextStyle: {
                                color: '#697B8C',
                                fontSize: 16
                            },
                            position: 'right',
                            axisLine: {
                                show: true,
                                lineStyle: {
                                    color: '#4187E6',
                                    width: 1,
                                    type: 'solid',
                                    opacity: 0.61
                                }
                            },
                            axisLabel: {
                                show: true,
                                color: '#8CA0B3',
                                fontSize: 16,
                                margin: 20
                            },
                            axisTick: {
                                show: false
                            },
                            splitLine: {
                                show: true,
                                lineStyle: {
                                    color: '#8CA0B3',
                                    type: 'dotted',
                                    opacity: 0.4
                                }
                            }
                        },
                    ],
                    series : [
                        {
                            name: '交易额',
                            type:'line',
                            smooth: true,
                            yAxis: 1,
                            lineStyle: {
                                normal: {
                                    color: '#09ACF8',
                                    width: 2,
                                    type: 'solid',
                                    shadowColor: '#3BAFDA',
                                    shadowBlur: 12
                                }
                            },
                            areaStyle: {
                                normal: {
                                    color: {
                                        type: 'linear',
                                        x: 0,
                                        y: 0,
                                        x2: 0,
                                        y2: 1,
                                        colorStops: [{
                                            offset: 0, color: 'rgb(193, 231, 251)' // 0% 处的颜色
                                        }, {
                                            offset: 1, color: 'rgb(251, 240, 253)' // 100% 处的颜色
                                        }],
                                        globalCoord: false // 缺省为 false
                                    }
                                }
                            },

                            symbol: 'none',
                            data:yAxisLeftData
                        },
                        {
                            name: '订单量',
                            type:'line',
                            smooth: true,
                            yAxisIndex: 1,
                            lineStyle: {
                                normal: {
                                    color: '#9958F0',
                                    width: 2,
                                    type: 'solid',
                                    shadowColor: '#813AE0',
                                    shadowBlur: 12
                                }
                            },
                            areaStyle: {
                                normal: {
                                    color: {
                                        type: 'linear',
                                        x: 0,
                                        y: 0,
                                        x2: 0,
                                        y2: 1,
                                        colorStops: [{
                                            offset: 0, color: 'rgb(171, 166, 243)' // 0% 处的颜色
                                        }, {
                                            offset: 1, color: 'rgb(230, 234, 245)' // 100% 处的颜色
                                        }],
                                        globalCoord: false // 缺省为 false
                                    }
                                }
                            },
                            symbol: 'none',
                            data:yAxisRightData
                        }

                    ]
                };
                weeklyChart.setOption(option);
            }
        });
    };

    $scope.$on('changeToIndicator', function(e, res){
        $scope.initChart();
    });
    if($route.current.params){
        $scope.initChart();
    }else{
        return;
    }

}]);