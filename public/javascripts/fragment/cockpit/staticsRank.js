easySpa.require([
	'public/lib/bmap.min.js'
], function(){
	app.controller('staticsCtrl', ['$scope', 'cockpitService', function($scope, cockpitService){
        var myChart;
        $scope.init = function(){
			$scope.rankTabActive = 'amount';
			$scope.rankTabName = '交易额';
            $scope.rankStateName = '物流';
            $scope.rankStateCode = 'logistics';
            $scope.defaultRankState = 'logistics';
			$scope.rankLists = [];
			$scope.mapData = [];
			$scope.amountLists = [];
			$scope.amountMap = [];
			$scope.orderLists = [];
			$scope.orderMap = [];
			$scope.volumeLists = [];
			$scope.volumeMap = [];
			$scope.amountState = 'logistics';
            $scope.orderState = 'logistics';
            $scope.volumeState = 'logistics';
			getStaticsRankDataDefault('logistics','amount');
			loadScript('http://api.map.baidu.com/api?v=2.0&ak=HY3gctvPnQpT5BOFgzFcNxkDr37cnPj3&callback=init', function(){
	            setTimeout(function(){
                    myChart = echarts.init(document.getElementById("myMap"));
	                initMap();
	            },1000)
	        });
            initRankSelect();
	    };

		$scope.init();

        function initRankSelect(){
            var selectOption = {
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
            selectFactory({
                data: selectOption,
                id: 'rankState',
                defaultText: null,
                attrTextModel: function(name, data, currentData){
                    if(currentData.code === $scope.rankStateCode){
                        return;
                    }else{
                        switch($scope.rankTabActive) {
                            case 'amount':
                                $scope.amountState = currentData.code;
                                break;
                            case 'order':
                                $scope.orderState = currentData.code;
                                break;
                            case 'volume':
                                $scope.volumeState = currentData.code;
                            default:
                                break;
                        }
                        $scope.rankStateCode = currentData.code;
                        $scope.rankStateName = currentData.name;
                        getStaticsRankDataDefault(currentData.code,$scope.rankTabActive);
                        initMap();
                    }
                    $scope.$apply();
                }
            });
        }

        function loadScript(url, callback) {
            var script = document.createElement("script");
            script.type = "text/javascript";
            script.src = url;
            document.getElementsByTagName("head")[0].appendChild(script);
            if (script.readyState) { //IE
                script.onreadystatechange = function () {
                    if (script.readyState == "loaded" || script.readyState == "complete") {
                        script.onreadystatechange = null;
                        callback();
                    }
                };
            } else { //Others
                script.onload = function () {
                    callback();
                };
            }
        }

        function initMap(){
            var datas = $scope.mapData.data || [];
            var data = [], geoCoordMap = {};
            datas.forEach(function(val, index){
            	data.push({
            		name: val.name,
            		value: val.value,
                    unit: val.unit
            	});
                geoCoordMap[val.name] = [];
                geoCoordMap[val.name].push(val.longitude);
                geoCoordMap[val.name].push(val.latitude);
            });
            var convertData = function (data) {
                var res = [];
                for (var i = 0; i < data.length; i++) {
                    var temp = 18 - i*1.9;
                    var geoCoord = geoCoordMap[data[i].name];
                    if (geoCoord) {
                        res.push({
                            name: data[i].name,
                            value: geoCoord.concat(data[i].value, temp),
                            unit: data[i].unit
                        });
                    }
                }
                return res;
            };

            var option = {
                backgroundColor: '#fff',
                title: {
                    text: '各地区'+ $scope.rankTabName + $scope.mapData.periodType +'排行',
                    left: 'center',
                    padding: [12, 0, 0, 10],
                    textStyle: {
                        color: '#fff',
                        fontSize: 18
                    }
                },
                tooltip : {
                    trigger: 'item',
                    borderWidth: 0,
                    position: 'top',
                    backgroundColor: 'transparent',
                    formatter: function(val){
                        return '<div style="margin-bottom:10px; background-color: #fff; text-align: center; padding: 10px 30px; border-radius: 2px; position: relative;"><em style="position: absolute; display: block; width: 0; height: 0; left: 50%; margin-left: -4px; bottom: -16px; border: 8px solid #fff; border-color: #fff transparent transparent transparent;"></em><p style="font-size: 18px; height: 28px; line-height: 28px; color: #F7A42C;">'+val.data.name+'</p><p style="font-size: 16px; color: #626262; height: 22px; line-height: 22px;">'+val.value[2]+val.data.unit+'</p></div>'
                    }
                },
                bmap: {
                    center: $scope.mapData.cityMap ? [108.953,34.278] : [40.8470603561,-3.1640625000],
                    zoom: $scope.mapData.cityMap ? 5 : 1,
                    roam: true,
                    mapStyle: {
                        styleJson: [
                            {
                                "featureType": "water",
                                "elementType": "all",
                                "stylers": {
                                    "color": "#2E9FF4"
                                }
                            },
                            {
                                "featureType": "land",
                                "elementType": "all",
                                "stylers": {
                                    "color": "#0E82D9"
                                }
                            },
                            {
                                "featureType": "boundary",
                                "elementType": "geometry",
                                "stylers": {
                                    "color": "#064f85",
                                    "visibility": "off"
                                }
                            },
                            {
                                "featureType": "railway",
                                "elementType": "all",
                                "stylers": {
                                    "visibility": "off"
                                }
                            },
                            {
                                "featureType": "highway",
                                "elementType": "geometry",
                                "stylers": {
                                    "color": "#004981",
                                    "visibility": "off"
                                }
                            },
                            {
                                "featureType": "highway",
                                "elementType": "geometry.fill",
                                "stylers": {
                                    "color": "#005b96",
                                    "lightness": 1,
                                    "visibility": "off"
                                }
                            },
                            {
                                "featureType": "highway",
                                "elementType": "labels",
                                "stylers": {
                                    "visibility": "off"
                                }
                            },
                            {
                                "featureType": "arterial",
                                "elementType": "geometry",
                                "stylers": {
                                    "color": "#004981",
                                    "visibility": "off"
                                }
                            },
                            {
                                "featureType": "arterial",
                                "elementType": "geometry.fill",
                                "stylers": {
                                    "color": "#00508b",
                                    "visibility": "off"
                                }
                            },
                            {
                                "featureType": "poi",
                                "elementType": "all",
                                "stylers": {
                                    "visibility": "off"
                                }
                            },
                            {
                                "featureType": "green",
                                "elementType": "all",
                                "stylers": {
                                    "color": "#056197",
                                    "visibility": "off"
                                }
                            },
                            {
                                "featureType": "subway",
                                "elementType": "all",
                                "stylers": {
                                    "visibility": "off"
                                }
                            },
                            {
                                "featureType": "manmade",
                                "elementType": "all",
                                "stylers": {
                                    "visibility": "off"
                                }
                            },
                            {
                                "featureType": "local",
                                "elementType": "all",
                                "stylers": {
                                    "visibility": "off"
                                }
                            },
                            {
                                "featureType": "arterial",
                                "elementType": "labels",
                                "stylers": {
                                    "visibility": "off"
                                }
                            },
                            {
                                "featureType": "boundary",
                                "elementType": "geometry.fill",
                                "stylers": {
                                    "color": "#029fd4",
                                    "visibility": "off"
                                }
                            },
                            {
                                "featureType": "building",
                                "elementType": "all",
                                "stylers": {
                                    "color": "#1a5787",
                                    "visibility": "off"
                                }
                            },
                            {
                                "featureType": "label",
                                "elementType": "all",
                                "stylers": {
                                    "visibility": "off"
                                }
                            }
                        ]
                    }
                },
                series : [
                    {
                        name: 'Top 10',
                        type: 'effectScatter',
                        coordinateSystem: 'bmap',
                        data: convertData(data.sort(function (a, b) {
                            return b.value - a.value;
                        }).slice(0, 9)),
                        symbolSize: function (val) {
                            return val[3];
                        },
                        showEffectOn: 'render',
                        rippleEffect: {
                            brushType: 'stroke',
                            scale: 2.5
                        },
                        hoverAnimation: true,
                        label: {
                            normal: {
                                formatter: '{b}',
                                position: 'right',
                                fontSize: 14,
                                show: true
                            }
                        },
                        itemStyle: {
                            normal: {
                                color: '#87FFAE'
                            }
                        },
                        zlevel: 1
                    }
                ]
            };
            
            myChart.setOption(option);
        }

        /*获取首屏数据*/
		function getStaticsRankDataDefault(biz,biztype){
			cockpitService.getStaticsRankDefault({
				seatParams: {
				    biz: biz,
					biztype: biztype
				}
			}, function(res){
				if(res.errorCode === 0){
					var listData = [];
					listData.push({
						type: 'product',
						typeName: '产品销量',
						periodType: '月',
						data: translateData(res.data.product),
						isShowRankItem: false
					});
					listData.push({
						type: 'supplier',
						typeName: '供应商产值',
						periodType: '月',
						data: translateData(res.data.supplier),
						isShowRankItem: false
					});
					listData.push({
						type: 'customer',
						typeName: '客户活跃度',
						periodType: '月',
						data: translateData(res.data.customer),
						isShowRankItem: false
					});
					var amountMap = {
						period: 'month',
                        periodType: '月',
						data: translateData(res.data.region),
						isShowRankItem: false,
                        cityMap: true
					};
					switch (biztype) {
						case 'amount':
                            $scope.amountLists = listData;
                            $scope.amountMap = amountMap;
							break;
						case 'order':
                            $scope.orderLists = listData;
                            $scope.orderMap = amountMap;
							break;
						case 'volume':
                            $scope.volumeLists = listData;
                            $scope.volumeMap = amountMap;
						default:
							break;
					};
                    $scope.rankLists = listData;
                    $scope.mapData = amountMap;
                };
			});
		}

		function translateData(data){
            if(!data || !data.length){
                return data;
            }
			data[0]._width  = 100;
			var standardVal = data[0].value;
			data.forEach(function(val, index){
			    val.value = Math.round(val.value);
				if(index !== 0){
					val._width = Math.ceil(100 * val.value / standardVal);
				}
			});
			return data;
		};

		$scope.changeRankTab = function(name){
			if(name === $scope.rankTabActive){
				return;
			}else{
				$scope.rankTabActive = name;
                switch (name) {
					case 'amount':
                        $scope.rankTabName = '交易额';
                        if($scope.amountLists.length > 0 && $scope.amountState == $scope.rankStateCode){
                            $scope.rankLists = $scope.amountLists;
                            $scope.mapData = $scope.amountMap;
						}else {
                            $scope.amountState = $scope.rankStateCode
                            getStaticsRankDataDefault($scope.rankStateCode,name);
                        }
						break;
					case 'order':
                        $scope.rankTabName = '订单量';
                        if($scope.orderLists.length > 0 && $scope.orderState == $scope.rankStateCode){
                            $scope.rankLists = $scope.orderLists;
                            $scope.mapData = $scope.orderMap;
						}else {
                            $scope.orderState = $scope.rankStateCode
                            getStaticsRankDataDefault($scope.rankStateCode,name);
                        }
						break;
					case 'volume':
                        $scope.rankTabName = '货量';
                        if($scope.volumeLists.length > 0 && $scope.volumeState == $scope.rankStateCode){
                            $scope.rankLists = $scope.volumeLists;
                            $scope.mapData = $scope.volumeMap;
						}else {
                            $scope.volumeState = $scope.rankStateCode
                            getStaticsRankDataDefault($scope.rankStateCode,name);
                        }
						break;
					default:
						break;
				};
                initMap();
			}
		};

		$scope.showRankItem = function(type){
			if(type === 'map'){
				$scope.mapData.isShowRankItem = true;
			}else{
				$scope.rankLists.forEach(function(val, index){
					if(val.type === type){
						val.isShowRankItem = true;
					}
				});
			}
			
		};
        /*更新局部数据*/
		$scope.getStaticsRankData = function(biztype, type, period){
		    var regiontype;
		    if(type === 'region'){
		        regiontype = $scope.mapData.cityMap ? 'cn' : 'country';  // 'cn':城市(中国), 'country':国家
            }else{
		        regiontype = '';
            }
	        cockpitService.getStaticsRank({
	            seatParams: {
	                biz: $scope.rankStateCode,
	                biztype: biztype,
	                scope: type,
	                period: period,
                    regiontype: regiontype
	            }
	        }, function(res){
		        var periodType;
	        	switch(period)
				{
					case 'year':
						periodType = '年';
						break;
					case 'month':
						periodType = '月';
						break;
					case 'quarter':
						periodType = '季';
						break;
					case 'week':
						periodType = '周';
						break;
					default:
						periodType = '';
						break;
				};
	            if(res.errorCode === 0){
	            	if(type === 'region'){
	            		$scope.mapData.isShowRankItem = false;
	            		$scope.mapData.period = period;
	            		$scope.mapData.periodType = periodType;
	            		$scope.mapData.data = translateData(res.data[type]);
                        initMap();
	            	}else{
	            		$scope.rankLists.forEach(function(val, index){
		            		if(val.type === type){
		            			val.data = translateData(res.data[type]);
		            			val.periodType = periodType;
		            			val.isShowRankItem = false;
		            		}
		            	});
	            	}
	            }
	        });
		};

        /*切换地图 国家or城市显示*/
		$scope.toggleMap = function(){
            $scope.mapData.cityMap = $scope.mapData.cityMap ? false : true;
            $scope.getStaticsRankData($scope.rankTabActive, 'region', $scope.mapData.period);
        }
	}]);
});