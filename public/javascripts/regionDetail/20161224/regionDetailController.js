easySpa.require([
    'widget/slimscroll',
    'widget/prompt',
    'widget/select',
    'public/common/tableController.js',
    'widget/parseUrl',
    'widget/tab',
    'public/common/areaController.js',
    'public/common/areaService.js',
], function(){
    app.controller('regionDetailCtrl', ['$scope', 'regionDetailService', 'regionDetailView', 'tableService', 'areaService', function($scope, regionDetailService, regionDetailView, tableService, areaService) {
        $scope.regionDetail = {
            'id': 0    //编辑分区方案详情id。
        };

        var countryEle;
        var provinceEle;
        var cityEle;
        var areaEle;
        var separator = '/';    //定义地区ID和名称的分隔符。

        $scope.tableModel = {
            'tableHeader': [
                Lang.getValByKey("common", 'common_thead_number'),
                Lang.getValByKey("common", 'common_thead_name'),
                Lang.getValByKey("common", 'common_code_code'),
                Lang.getValByKey("common", 'common_thead_type'),
                Lang.getValByKey("regionDetail", 'regDetail_code_countryArea'),
                Lang.getValByKey("common", 'common_page_remarks')
            ],
            'tableBody': [],
            'restURL': 'logistics.getRegionsByID',
            'restData': {
                'q': '',
                'pageIndex': 1,
                'pageSize': 10,
                'schemaId': '',
                'sort':'createTime'
            },
            'selectNumber': 0,
            'selectFlag': false
        };

        $scope.initData = function(){
            $scope.parameter = window.parseUrl.getParams();

            $scope.productGroupId = $scope.parameter.productGroupId == 1 ? 1 : ($scope.parameter.productGroupId == 6 ? 6 : 11);

            $scope.titleName = $scope.parameter.name;
            $scope.editable = true;
            if($scope.parameter.q != 'region'){
                if($scope.parameter.status != 1){
                    $scope.editable = false;
                }
            }
            if(top.location.href.indexOf("isEdit=false") > -1) {//订单详情跳转过来的
                $scope.editable = false;
            }

            $scope.placeholder = '请输入地区名称、二字码或邮编';
            if($scope.productGroupId == 1){
                $scope.tableModel.tableHeader[4] = '港口';
                $scope.placeholder = '请输入港口名称（支持中英文名称）';
            }else if($scope.productGroupId == 6){
                $scope.tableModel.tableHeader[4] = '机场';
                $scope.placeholder = '请输入三字码或机场名称';
            }
        };
        $scope.initData();

        $scope.getTable = function(){

            $scope.tableModel.restData.schemaId = $scope.parameter.schemaId;

            var config = {
                'urlParams': $scope.tableModel.restData
            };

            tableService.getTable($scope.tableModel.restURL, config, function(data){
                if(data.errorCode === 0){

                    $scope.tableModel = tableService.table($scope.tableModel, config, data);
                    tableReData();
                    var height = regionDetailView.height('table');
                    setTimeout(function() {
                        regionDetailView.slimscroll('.table-container tbody', height);
                        $(window).resize(function(){
                            height = regionDetailView.height('table');
                            regionDetailView.slimscroll('.table-container tbody', height);
                        });
                    }, 10);
                }
            });
        };
        $scope.getTable();

        $scope.$watch('tableModel',  function(newValue, oldValue) {
            if (newValue === oldValue) {return; }

            tableReData();
        }, true);

        function tableReData(){
            angular.forEach($scope.tableModel.tableBody, function(value, key){
                if(value.areas && value.areas.length){    //类型为：国家或地区
                    $scope.tableModel.tableBody[key].type = Lang.getValByKey("regionDetail", 'regDetail_code_countryArea');
                    $scope.tableModel.tableBody[key].typeValue = '';
                    for(var i=0,len=value.areas.length; i<len; i++){
                        if($scope.tableModel.tableBody[key].typeValue){
                            $scope.tableModel.tableBody[key].typeValue += '，' + sliceLastNode(value.areas[i].name);
                        }else{
                            $scope.tableModel.tableBody[key].typeValue += sliceLastNode(value.areas[i].name);
                        }
                    }
                }else if(value.postcodes && value.postcodes.length){    //类型为：邮编
                    $scope.tableModel.tableBody[key].type = Lang.getValByKey("regionDetail", 'regDetail_code_posts');
                    $scope.tableModel.tableBody[key].typeValue = '';
                    for(var i=0,len=value.postcodes.length; i<len; i++){
                        if($scope.tableModel.tableBody[key].typeValue){
                            $scope.tableModel.tableBody[key].typeValue += '，' + value.postcodes[i].startPostcode + '-' + value.postcodes[i].endPostcode;
                        }else{
                            $scope.tableModel.tableBody[key].typeValue += value.postcodes[i].startPostcode + '-' + value.postcodes[i].endPostcode;
                        }
                    }
                }else if(value.ports && value.ports.length){    //类型为：港口 或 机场
                    if($scope.productGroupId == 1){
                        $scope.tableModel.tableBody[key].type = '港口';
                    }else if($scope.productGroupId == 6){
                        $scope.tableModel.tableBody[key].type = '机场';
                    }
                    $scope.tableModel.tableBody[key].typeValue = '';

                    for(var i=0,len=value.ports.length; i<len; i++){
                        if($scope.productGroupId == 1){    //港口
                            value.ports[i].oName = value.ports[i].name;
                        }else if($scope.productGroupId == 6){    //机场
                            value.ports[i].oName = value.ports[i].triadCode;
                        }
                        if($scope.tableModel.tableBody[key].typeValue){
                            $scope.tableModel.tableBody[key].typeValue += '，' + value.ports[i].oName;
                        }else{
                            $scope.tableModel.tableBody[key].typeValue += value.ports[i].oName;
                        }
                    }
                }
            });
        }

        /**
         * table表格搜索
         */
        $scope.search = function(){
            $scope.tableModel.restData.pageIndex = 1;
            $scope.q = $scope.tableModel.restData.q;

            $scope.getTable();
        };

        /**
         * 返回
         */
        $scope.goBack = function(){
            if($scope.parameter.q == 'region') {
                window.location.href = '#/' + $scope.parameter.q + '?index=' + $scope.parameter.index;
            } else if ($scope.parameter.q === 'servicesApproval') {
                window.location.href = '#/' + $scope.parameter.q + '?uid=' + $scope.parameter.uid + '&status=' + $scope.parameter.checkStatus;
            } else if ($scope.parameter.q === 'services') {
                if($scope.parameter.isfromprice){    //从采购价格的服务跳转到服务详情，然后从服务分区跳转到分区详情
                    window.location.href = '#/' + $scope.parameter.q + '?uid=' + $scope.parameter.uid + '&backfrom=region' + '&isfromprice=1&priceData=' + $scope.parameter.priceData;
                }else{
                    window.location.href = '#/' + $scope.parameter.q + '?uid=' + $scope.parameter.uid + '&backfrom=region';
                }
            } else if($scope.parameter.orderNo){    //订单-》产品-》产品范围
                window.location.href = '#/' + $scope.parameter.q + '?uid='+$scope.parameter.uid+'&orderNo='+$scope.parameter.orderNo + '&id='+$scope.parameter.id+'&from=' + $scope.parameter.from + '&type=' + $scope.parameter.type + '&index=' + $scope.parameter.index + '&workId=' + $scope.parameter.workId + '&isJustShow=' + $scope.parameter.isJustShow + '&origin='+$scope.parameter.origin;
            } else{    //产品范围直接跳转过来的 返回
                window.location.href = '#/' + $scope.parameter.q + '?uid='+$scope.parameter.uid+'&id='+$scope.parameter.id+'&from=' + $scope.parameter.from + '&type=' + $scope.parameter.type + '&index=' + $scope.parameter.index;
            }
        };

        /**============================= 删除分区方案详情操作Begin ==========================*/
        $scope.del = function(){
            var param = [];

            var oldData = tableService.getSelectTable($scope.tableModel.tableBody);

            if(!oldData.length){
                regionDetailView.promptBox({isDelay:true,contentDelay:Lang.getValByKey("common", 'common_code_noSelected'),type: 'errer',manualClose:true});
                return false;
            }

            //组织数据
            angular.forEach(oldData, function(val){
                param.push(val.id);
            });

            var opt = {
                title: Lang.getValByKey("common", 'common_prompt_title'),
                type: 'warning',
                content: {
                    tip: Lang.getValByKey("regionDetail", 'regDetail_code_delTips')
                },
                operation: [
                    {
                        type: 'submit',
                        description: Lang.getValByKey("common", 'common_page_delete'),
                        application:'delete',
                        operationEvent: function () {
                            regionDetailService.del(param, function(data){
                                if(data.errorCode === 0){
                                    regionDetailView.promptBox({isDelay:true,contentDelay:data.msg,type: 'success'});

                                    //更新table表数据
                                    $scope.$apply($scope.getTable());

                                    regionDetailView.promptBox('closePrompt');
                                }else{
                                    regionDetailView.promptBox({isDelay:true,contentDelay:data.msg,type: 'errer',manualClose:true});
                                }
                            });
                        }
                    }
                ]
            };
            regionDetailView.promptBox(opt);
        };
        /**============================= 删除分区方案详情操作end ==========================*/

        /**==========================================添加方案详情Begin========================**/
        $scope.add = function(){
            //清除angular表单脏值检测
            $scope.form.$setPristine();
            $scope.form.$setUntouched();

            //清空数据
            $scope.regionName = '';
            $scope.regionCode = '';
            $scope.regionZone = '';
            $scope.selectedData = [];
            $scope.choosedData = [];
            $scope.regionSeaAirZone = '';
            $scope.seaAirChoosedData = [];
            $scope.remark = '';
            $('#remote-zone-msg, #remote-seaair-msg').html('');

            if($scope.productGroupId == 1){
                $scope.regionType = '港口';
            }else if($scope.productGroupId == 6){
                $scope.regionType = '机场';
            }else {
                $scope.regionType = Lang.getValByKey("regionDetail", 'regDetail_code_countryArea');
                $scope.regionTypeValue = 1;
            }

            $scope.regionDetail.id = 0;

            $(document).promptBox({
                title: Lang.getValByKey("regionDetail", 'regDetail_code_addRegion'),
                loadTitle: function(){
                    return Lang.getValByKey("regionDetail", 'regDetail_code_addRegion')
                },
                isMiddle: true,
                isNest:true,
                content: {
                    nest: $('#detail'),
                },
                loadData: function(){
                    $('#nest-contactsDetail .other-btn button[name="prompt-operation"]').addClass('edit').removeClass('save');
                },
                operation: [
                    {
                        type: 'submit',
                        description: Lang.getValByKey("common", 'common_page_save'),
                        operationEvent: function(){
                            $scope.saveRegionDetail();
                            $scope.$apply();
                        }
                    }
                ]
            });
        };

        /**
         * 编码异步校验
         */
        $scope.checkCode = function(){
            var config = {
                'urlParams':{
                    'schemaId': $scope.parameter.schemaId,
                    'code': $scope.regionCode,
                    'sid': $scope.regionDetail.id
                }
            };
            if($scope.regionCode){
                regionDetailService.checkCode(config, function(data){
                    if(data.errorCode != 0){    //编码重复
                        $scope.form.regionCode.errorTips = data.msg;
                        $("#code-msg").removeClass("ng-hide").addClass('remote-invalid');
                    }else{    //编码不重复
                        $("#code-msg").addClass("ng-hide").removeClass('remote-invalid');
                        $scope.form.regionCode.errorTips = "";
                    }
                });
            }
        };

        /**
         * 新增 or 修改信息
         */
        $scope.saveRegionDetail = function(){
            if(!$scope.regionName){
                $scope.form.regionName.$setDirty();
            }
            if(!$scope.regionCode){
                $scope.form.regionCode.$setDirty();
            }
            // if(!$scope.regionSeaAirZone){
            //     $scope.form.regionSeaAirZone.$setDirty();
            // }

            if($scope.productGroupId == 11){    //速递
                if($scope.regionTypeValue == 1 && !$scope.regionZone){
                    $scope.form.regionZone.$setDirty();
                }
                if($scope.regionTypeValue == 2 && !$scope.regionCountry){
                    $scope.form.regionCountry.$setDirty();
                }
                if($scope.regionTypeValue == 2 && !checkPost()){
                    return;
                }
                if($scope.regionTypeValue == 2 && $scope.checkPostResult){
                    return;
                }
                if($("#code-msg").hasClass('remote-invalid')){
                    return;
                }
            }else if($scope.productGroupId != 11){
                if(!$scope.regionSeaAirZone){
                    $scope.form.regionSeaAirZone.$setDirty();
                }
            }

            if(!$scope.form.$valid){
                scrollToErrorView($("#nest-detail .prompt-content"));
                return;
            }

            var config = {
                urlParams : {
                    'schemaId': $scope.parameter.schemaId,
                    'name': $scope.regionName,
                    'code': $scope.regionCode,
                    'description': $scope.remark,
                    'postcodes': [],
                    'areas': [],
                    'ports': []
                }
            };

            if($scope.productGroupId == 11){
                if($scope.regionTypeValue == 1){    //国家或地区
                    var map = {};
                    angular.forEach($scope.choosedData, function(value, key){
                        map = {
                            "figureCode": value.figureCode,
                            "name": value.name
                        };
                        config.urlParams.areas.push(map);
                    });
                }else if($scope.regionTypeValue == 2){    //邮编数据组织
                    var map = {};
                    $('#post-zone').children('li').each(function(){
                        var country = $scope.regionCountryId,
                            start = $(this).children('.u-post-start').val(),
                            end = $(this).children('.u-post-end').val();
                        if(country && start && end){
                            map = {
                                "country": $scope.regionCountryId,
                                "startPostcode": angular.uppercase($(this).children('.u-post-start').val()),
                                "endPostcode": angular.uppercase($(this).children('.u-post-end').val())
                            };
                            config.urlParams.postcodes.push(map);
                        }
                    });
                }
            }else{
                config.urlParams.ports = $scope.seaAirChoosedData;
            }

            if($scope.regionDetail.id){    //修改
                config.seatParams = {'id': $scope.regionDetail.id};

                regionDetailService.saveEditRegionDetail(config, function(data){

                    if(data.errorCode === 0){
                        regionDetailView.promptBox({isDelay:true,contentDelay:data.msg,type: 'success'});

                        //更新table表数据
                        $scope.getTable();

                        regionDetailView.promptBox('closeFormPrompt');
                    }else{
                        if(data.errorCode == 100000){
                            if($scope.regionTypeValue == 1){
                                $("#remote-zone-msg").html(data.msg);
                            }else if($scope.regionTypeValue == 2){
                                remoteCheckPost(data.data);
                            }else{
                                $('#remote-seaair-msg').html(data.msg);
                            }
                        }else{
                            regionDetailView.promptBox({isDelay:true,contentDelay:data.msg,type: 'errer',manualClose:true});
                        }
                    }
                });
            }else{    //新增
                regionDetailService.saveRegionDetail(config, function(data){

                    if(data.errorCode === 0){
                        regionDetailView.promptBox({isDelay:true,contentDelay:data.msg,type: 'success'});

                        //更新table表数据
                        $scope.getTable();

                        regionDetailView.promptBox('closeFormPrompt');
                    }else{
                        if(data.errorCode == 100000){
                            if($scope.regionTypeValue == 1){
                                $("#remote-zone-msg").html(data.msg);
                            }else if($scope.regionTypeValue == 2){
                                remoteCheckPost(data.data);
                            }else{
                                $('#remote-seaair-msg').html(data.msg);
                            }
                        }else{
                            regionDetailView.promptBox({isDelay:true,contentDelay:data.msg,type: 'errer',manualClose:true});
                        }
                    }
                });
            }
        };

        /**
         * 类型获取展示
         */
        $scope.init = function(){
            //分区类型：国家或地区  ； 邮编。
            selectFactory({
                data: {
                    data:[
                        {'id':1,'name':Lang.getValByKey("regionDetail", 'regDetail_code_countryArea')},
                        {'id':2, 'name':Lang.getValByKey("regionDetail", 'regDetail_code_posts')}
                    ]
                },
                defaultText: '',
                id: "type-select-input",
                showTextField: "name",
                attrTextField: {
                    "ng-value": "id"
                },
                attrTextId: function(id){
                    $scope.regionTypeValue = id;
                },
                attrTextModel: function(name){
                    //模拟change事件
                    if($scope.regionType != name){
                        Select.sharePool['country'] = '';
                        if(!$scope.regionDetail.id){    // 新增时清空数据
                            if($scope.regionTypeValue == 1){    //国家或地区
                                $scope.regionZone = '';
                            }else if($scope.regionTypeValue == 2){    //邮编
                                $scope.regionCountry = '';
                                $scope.regionCountryId = '';

                                $scope.post.restData();
                            }
                        }else{    // 修改时重置数据
                            if($scope.regionTypeValue == 1) {    //国家或地区
                                $scope.choosedData = [];
                                $scope.selectedData = [];
                                $scope.regionZone = '';
                                var map = {};
                                angular.forEach($scope.editData.areas, function(value, key){
                                    var name = sliceLastNode(value.name);
                                    var id = sliceLastNode(value.figureCode);
                                    var figureCode = sliceFirstNode(value.figureCode);

                                    $scope.regionZone += '，' + name;
                                    map = {
                                        'id': id,
                                        'name': name,
                                        'figureCode': figureCode,
                                        'delete': false,
                                        'isShow': true,
                                        'checkbox': $scope.selectedFlag,
                                        'interId': value.figureCode,
                                        'interName': value.name
                                    };
                                    $scope.choosedData.push(map);
                                    $scope.selectedData.push(map);
                                });
                                $scope.regionZone ? $scope.regionZone = $scope.regionZone.slice(1) : '';
                            }else if($scope.regionTypeValue == 2){    //邮编
                                $scope.post.restData($scope.editData.postcodes);
                            }
                        }
                    }
                    $scope.regionType = name;
                    $scope.$apply();
                }
            });
        };
        /**==========================================添加方案详情end========================**/

        /**======================================国家列表Begin=========================**/
        function getCountryData(q,currentPage) {
            if(!currentPage) {
                currentPage = 1;
            }

            q = q ? q : '';
            var config = {
                urlParams: {
                    q: q,
                    "pageIndex": currentPage,
                    "pageSize": 10
                }
            };
            return regionDetailService.getCountryData(config);

        }

        function rebuildName(data) {
            if (!data) {
                return;
            }
            for (var index = 0; index < data.length; index++) {
                data[index].name = data[index].name + '(' + data[index].figureCode + ')';
            }
        }

        $scope.showRegionCountry = function(){
            var config = {
                urlParams: {
                    "pageIndex": 1,
                    "pageSize": 300
                }
            };

            $scope.countryRegionData = getCountryData();
            rebuildName($scope.countryRegionData.data);

            countryRegionEle = selectFactory({
                data: $scope.countryRegionData,
                isSearch: true,
                pagination: true,
                searchPlaceHoder: "请输入国家名称或二字码",
                id: "country",
                showTextField: "name",
                onSearchValueChange: function (attachEvent, data,currentPage) {
                    var countryData = getCountryData(data,currentPage);
                    rebuildName(countryData.data);
                    attachEvent.setData(countryData);
                },
                attrTextModel: function(name, data) {
                    var sigleData =getSigleDataByName(name, data);

                    $scope.regionCountry = name;
                    $scope.regionCountryId = sigleData && sigleData.figureCode;

                    $scope.$apply();
                }
            });
        };

        /**======================================国家列表end=========================**/


        /**==========================编辑方案详情Begin==========================**/
        $scope.edit = function(id){
            //非草稿状态
            if(!$scope.editable){ return; }

            $scope.regionDetail.id = id;
            $scope.form.regionCode.errorTips = '';
            $('#remote-zone-msg, #remote-seaair-msg').html('');

            regionDetailService.getEdit(id, function(data){
                if(data && data.errorCode === 0){
                    $scope.editData = data.data;    //缓存编辑数据。

                    $scope.regionName = data.data.name;
                    $scope.regionCode = data.data.code;
                    $scope.remark = data.data.description;
                    $scope.regionCountry = '';
                    $scope.regionCountryId = '';

                    if($scope.productGroupId == 1){
                        $scope.regionType = '港口';
                    }else if($scope.productGroupId == 6){
                        $scope.regionType = '机场';
                    }

                    if(data.data.areas.length){
                        $scope.regionType = Lang.getValByKey("regionDetail", 'regDetail_code_countryArea');
                        $scope.regionTypeValue = 1;

                        $scope.regionZone = '';

                        $scope.choosedData = [];
                        $scope.selectedData = [];
                        var map = {};
                        angular.forEach(data.data.areas, function(value, key){
                            var name = sliceLastNode(value.name);
                            var id = sliceLastNode(value.figureCode);
                            var figureCode = sliceFirstNode(value.figureCode);

                            $scope.regionZone += '，' + name;
                            map = {
                                'id': id,
                                'name': name,
                                'figureCode': value.figureCode,
                                'delete': false,
                                'isShow': true,
                                'checkbox': $scope.selectedFlag,
                                'interId': value.figureCode,
                                'interName': value.name
                            };
                            $scope.choosedData.push(map);
                            $scope.selectedData.push(map);
                        });
                        $scope.regionZone ? $scope.regionZone = $scope.regionZone.slice(1) : '';
                    }else if(data.data.postcodes.length){
                        $scope.regionType = Lang.getValByKey("regionDetail", 'regDetail_code_posts');
                        $scope.regionTypeValue = 2;
                        $scope.post.restData(data.data.postcodes);
                    }else if(data.data.ports.length){
                        $scope.regionSeaAirZone = '';

                        $scope.seaAirChoosedData = [];
                        $scope.selectedData = [];

                        angular.forEach(data.data.ports, function(value, key){
                            var name = '';
                            if($scope.productGroupId == 1){    //港口
                                name = value.name + '(' + value.enName + ')';
                            }else if($scope.productGroupId == 6){    //机场
                                name = value.triadCode + '(' + value.name + ')';
                            }

                            $scope.regionSeaAirZone += '，' + name;
                            var map = {
                                'areaId': value.areaId,
                                'countryCode': value.countryCode,
                                'name': name,
                                'transportId':value.transportId,
                                'delete': false,
                                'isShow': true,
                                'checkbox': false
                            };
                            $scope.seaAirChoosedData.push(map);
                            $scope.selectedData.push(map);
                        });
                        $scope.regionSeaAirZone = $scope.regionSeaAirZone ? $scope.regionSeaAirZone.slice(1) : '';
                    }

                    $(document).promptBox({
                        title: Lang.getValByKey("regionDetail", 'regDetail_code_editRegion'),
                        loadTitle: function(){
                            return Lang.getValByKey("regionDetail", 'regDetail_code_editRegion')
                        },
                        isMiddle: true,
                        isNest:true,
                        content: {
                            nest: $('#detail'),
                        },
                        loadData: function(){
                            $('#nest-contactsDetail .other-btn button[name="prompt-operation"]').addClass('edit').removeClass('save');
                        },
                        operation: [
                            {
                                type: 'submit',
                                description: Lang.getValByKey("common", 'common_page_save'),
                                operationEvent: function(){
                                    $scope.saveRegionDetail();
                                    $scope.$apply();
                                }
                            }
                        ]
                    });
                }
            });
        };
        /**==========================编辑方案详情end==========================**/


        /**===============================邮编段Begin==============================*/
        $scope.post = {
            max: 100,  //最大可创建100个节点
            length: 1,    //当前数量
            addFlag: true,    //新增邮编段按钮状态
            delFlag: false,    //删除邮编段按钮状态
            data:[    //数据存储
                {
                    start:'',    //开始值
                    end:''    //结束值
                }
            ]
        };

        $scope.post.del = function($index){
            if($scope.post.length <= 1){
                return;
            }
            var result = $scope.post.data.splice($index, 1);
            if(!result.length){
                return;
            }
            --$scope.post.length;
            $scope.post.addFlag = true;
            if($scope.post.length == 1){
                $scope.post.delFlag = false;
            }
        };

        $scope.post.add = function(){
            if($scope.post.length >= $scope.post.max){
                return ;
            }

            $scope.post.data.push({
                start:'',
                end:''
            });

            ++$scope.post.length;
            $scope.post.delFlag = true;
            if($scope.post.length == $scope.post.max){
                $scope.post.addFlag = false;
            }
        };

        $scope.post.restData = function(postcodes){
            $scope.checkPostResult = false;

            if(postcodes && postcodes.length){
                var length = postcodes.length;
                $scope.post.length = length;
                $scope.post.data = [];
                if(length > 1){
                    $scope.post.delFlag = true;
                }else{
                    $scope.post.delFlag = false;
                }
                if(length < $scope.post.max){
                    $scope.post.addFlag = true;
                }else{
                    $scope.post.addFlag = false;
                }

                var map = {};
                for(var i=0; i<length; i++){
                    $scope.regionCountry = postcodes[i].countryName;
                    $scope.regionCountryId = postcodes[i].country;
                    map = {
                        start: postcodes[i].startPostcode,
                        end:  postcodes[i].endPostcode
                    };
                    $scope.post.data.push(map);
                }
            }else{
                $scope.post.length = 1;
                $scope.post.addFlag = true;
                $scope.post.delFlag = false;
                $scope.regionCountry = '';
                $scope.regionCountryId = '';
                $scope.post.data = [{start:'', end:''}];
            }
        };

        function checkPost(){
            var flag = true, count = 0;
            var length = $('#post-zone').children('li').length;

            $('#post-zone').children('li').each(function(){
                var start = $.trim($(this).children('.u-post-start').val());
                var end = $.trim($(this).children('.u-post-end').val());
                if(!start && !end){
                    ++count;
                }
                if(start && !end){
                    $(this).children('.u-post-end').addClass('post-error');
                    flag = false;
                }else if(!start && end){
                    $(this).children('.u-post-start').addClass('post-error');
                    flag = false;
                }else{
                    $(this).children('input').removeClass('post-error');
                }
            });

            //都没有填写数据
            if(count == length){
                flag = false;
                $('#post-zone').children('li').eq(0).children('input').addClass('post-error');
            }
            return flag;
        }

        function remoteCheckPost(data){
            var length = data && data.length;
            if(length){
                $('#post-zone').children('li').each(function(){
                    var start = $.trim($(this).children('.u-post-start').val());
                    var end = $.trim($(this).children('.u-post-end').val());

                    for(var i=0; i<length; i++){
                        if(start == data[i].startPostcode && end == data[i].endPostcode){
                            $(this).children('input').addClass('post-error');
                            break;
                        }else{
                            $(this).children('input').removeClass('post-error');
                        }
                    }
                });
            }
        }

        $scope.rePostClass = function($event){
            $scope.checkPostResult = false;

            $('#post-zone input').each(function(){
                var val = $(this).val();
                if(val){
                    if((/^[0-9a-zA-Z]*$/g).test(val)){
                        $(this).removeClass('post-error post-errors');
                    }else{
                        $scope.checkPostResult = true;
                        $(this).addClass('post-errors');
                    }
                }else{
                    $(this).removeClass('post-error post-errors');
                }
            });
        };
        /**=============================== 邮编段end ==============================*/


        /**=============================== 选择速递区域 ==============================*/
        $scope.selectRegion = function(){
            $scope.initCtrl();

            $(document).promptBox({
                title: Lang.getValByKey("regionDetail", 'regDetail_page_countryAdd'),
                isHidden:true,
                boxWidth:true,
                isNest:true,
                loadData : function(){
                    $scope.loadRegionData();
                },
                content: {
                    nest: $('#serviceZone')
                },
                operation: [
                    {
                        type: 'submit',
                        description: Lang.getValByKey("common", 'common_prompt_confirm'),
                        operationEvent: function(){
                            $(document).promptBox('closeSlideBox');
                            /** 国家地区名称显示 */
                            var inputStr = '';
                            angular.forEach($scope.areaModel.selectedData, function(value, key){
                                inputStr += '，' + value.name.split('/')[value.name.split('/').length - 1] ;
                            });

                            inputStr ? inputStr = inputStr.slice(1) : '';
                            $scope.regionZone = inputStr;

                            /** 国家地区id集 */
                            $scope.choosedData = [];
                            var map = {};
                            angular.forEach($scope.areaModel.selectedData, function(value, key){
                                map = {
                                    'figureCode': value.interId,
                                    'name': value.name.split('/')[value.name.split('/').length - 1]
                                };
                                $scope.choosedData.push(map);
                            });

                            $scope.$apply();

                        }
                    }
                ]
            });
        };
        /** 初始化areaModel */
        var areaModel = {
            unSelectedData: [],    //待选区数据缓存
            selectedData: [],    //已选区数据缓存
            candidateFlag: false,    //待选区全选按钮勾选状态；true：勾选，false：未勾选。
            selectedFlag: false    //已选区全选按钮勾选状态；true：勾选，false：未勾选。
        };
        /** loadData */
        $scope.loadRegionData = function(){

            var config = {
                urlParams: {
                    "pageIndex": 1,
                    "pageSize": 300
                }
            };

            areaModel.unSelectedData = regionDetailService.getCountry(config).data;
            areaModel.selectedData = $scope.choosedData;
            $scope.tab.selected(0);
            $scope.areaModel = areaService.initArea(areaModel);
        };
        /**================= 国家地区弹框调用事件 end =================*/


        /**=============================== 选择港口 或 机场 区域 =======================**/
        var countryEle, cityEle;
        /**
         * 选择国家
         * @param q
         * @param currentPage
         */
        $scope.getCountryList = function (q,currentPage) {
            var config = {
                urlParams: {
                    'q': q || '',
                    "pageIndex": currentPage || 1,
                    "pageSize": 10
                }
            };
            var data = regionDetailService.getCountryList(config);
            angular.forEach(data.data, function(value, index){
                value.name += '(' + value.figureCode + ')';
            });
            return data;
        };
        $scope.showCountry = function(){
            if(countryEle) { return; }

            countryEle = selectFactory({
                data: [],
                isSearch: true,
                id: "select-country",
                defaultText:Lang.getValByKey("common", 'common_select_tips'),
                pagination: true,
                closeLocalSearch:true,
                searchPlaceHoder: "请输入国家名称或二字码",
                onSearchValueChange: function (attachEvent, data,currentPage) {
                    var countryData = $scope.getCountryList(data,currentPage);
                    attachEvent.setData(countryData);
                },
                attrTextModel: function(name, data, item) {
                    $scope.countryName = name;
                    $scope.countryFigureCode = item.figureCode;
                    //清空城市数据
                    $scope.cityName = '';
                    $scope.cityId = '';

                    //获取港口或机场地址
                    $scope.getAirSeaData();
                    $scope.$apply();
                }
            });
            countryEle.open();
        };

        /**
         * 选择地区
         * @param q
         * @param currentPage
         * @returns {*}
         */
        $scope.getCityList = function(q, currentPage){
            var config = {
                urlParams: {
                    'q': q || '',
                    'countryCode': $scope.countryFigureCode,
                    'parentId': $scope.countryFigureCode,
                    'pageIndex': currentPage || 1,
                    'pageSize': 10
                }
            };
            return regionDetailService.getCityList(config);
        };
        $scope.showCity = function(){
            if(cityEle){ return; }

            cityEle = selectFactory({
                data: [],
                id: "select-city",
                isSearch: true,
                defaultText:Lang.getValByKey("common", 'common_select_tips'),
                isUsePinyin: true,
                showTextField: "name",
                pagination: true,
                closeLocalSearch:true,
                searchPlaceHoder: "请输入市名称",
                onSearchValueChange: function (attachEvent, data,currentPage) {
                    if(!$scope.countryFigureCode){ return false; }

                    var cityData = $scope.getCityList(data,currentPage);
                    attachEvent.setData(cityData);
                },
                attrTextModel: function(name, data, item) {
                    $scope.cityName = name;
                    $scope.cityId = item.id;

                    $scope.getAirSeaData();
                    $scope.$apply();
                }
            });
            cityEle.open();
        };

        /**
         * 获取机场或港口数据
         */
        $scope.getAirSeaData = function(){
            $scope.unSelectedData = [];
            $scope.candidateFlag = false;

            if(!$scope.countryFigureCode){ return ; }

            var config = {
                'urlParams':{
                    'type': $scope.productGroupId,
                    'countryId': $scope.countryFigureCode,
                    'cityId': $scope.cityId,
                    'pageIndex': 1,
                    'pageSize': 20000
                }
            };

            regionDetailService.getAirSeaData(config, function(res){
                if(res.errorCode === 0){
                    angular.forEach(res.data, function(value, key){
                        var map = {
                            'transportId': value.id,
                            'countryCode': $scope.countryFigureCode,
                            'areaId': value.cityId,
                            'delete': false,
                            'isShow': true,
                            'checkbox': $scope.candidateFlag
                        };
                        if($scope.productGroupId == 1){    //港口
                            map.name = value.name + '(' + value.englishName + ')';
                        }else if($scope.productGroupId == 6){    //机场
                            map.name = value.triadCode + '(' + value.name + ')';
                        }

                        $scope.unSelectedData.push(map);
                    });

                    $scope.delCandidate();
                }
            });

            var height = $('#airSeaZone').height() - 255;
            $('#candidateZones').slimscroll({'height':height});
            $(window).resize(function(){
                var height = $('#airSeaZone').height() - 255;
                $('#candidateZones').slimscroll({'height':height});
            });
        };

        /**
         * 待选区-全选、全不选
         */
        $scope.airSeaCandidateAll = function(){
            angular.forEach($scope.unSelectedData, function(value, index){
                if($scope.candidateFlag){    //全选
                    $scope.unSelectedData[index].checkbox = true;
                }else{
                    $scope.unSelectedData[index].checkbox = value.delete;
                }
            });
        };

        /**
         * 待选区单选
         */
        $scope.airSeaCandidateOne = function(transportId){
            var unselect = 0;    //未选项记录数

            angular.forEach($scope.unSelectedData, function(value, index){
                if (value.transportId == transportId) {
                    value.checkbox = !value.checkbox;
                }

                !value.checkbox ? ++unselect : '';
            });

            //如果未选项记录数大于0，则非全选。
            $scope.candidateFlag = unselect ? false : true;
        };

        /**
         * 待选区搜索
         */
        $scope.seaAirSearchCandidate = function(){
            var key = $scope.seaAirSearchCandidateVal ? $scope.seaAirSearchCandidateVal.toLowerCase() : '';
            angular.forEach($scope.unSelectedData, function(value, index){
                if(
                    $scope.unSelectedData[index].name
                    &&  $scope.unSelectedData[index].name.toLowerCase().indexOf(key) != -1
                ){
                    $scope.unSelectedData[index].isShow = true;
                }else{
                    $scope.unSelectedData[index].isShow = false;
                }
            });
        };

        /**
         * 待选区-》已选区
         */
        $scope.selectedToRight = function(){
            angular.forEach($scope.unSelectedData, function(value, index){
                if( $scope.unSelectedData[index]['checkbox']
                    && !$scope.unSelectedData[index]['delete']
                    && $scope.unSelectedData[index]['isShow']
                ){
                    var map = {};
                    map = $.extend({}, $scope.unSelectedData[index]);

                    map.checkbox = $scope.selectedFlag;

                    $scope.selectedData.unshift(map);

                    $scope.unSelectedData[index]['delete'] = true;
                }
            });
            // $scope.deleteCandidate();
        };

        /**
         * 已选区全选、全不选
         */
        $scope.airSeaSelectedAll = function(){
            angular.forEach($scope.selectedData,  function(value, index){
                if($scope.selectedFlag){    // 全选
                    $scope.selectedData[index].checkbox = true;
                }else{  //全不选
                    $scope.selectedData[index].checkbox = false;
                }
            });
        };

        /**
         * 已选区单选
         */
        $scope.airSeaSelectedOne = function(transportId){
            var unselect = 0;    //未选项记录数

            angular.forEach($scope.selectedData, function(value, index){
                if (value.transportId == transportId) {
                    value.checkbox = !value.checkbox;
                }

                !value.checkbox ? ++unselect : '';
            });

            //如果未选项记录数大于0，则非全选。
            $scope.selectedFlag = unselect ? false : true;
        };

        /**
         * 已选区—》待选区
         */
        $scope.selectedToLeft = function(){
            var candidateData= $scope.unSelectedData,
                oldSelectedData = $scope.selectedData;

            var newSelectedData = [];

            var candidateLength = candidateData.length,
                selectedLength = oldSelectedData.length;

            for(var i=0; i<selectedLength; i++){
                if(oldSelectedData[i].checkbox && oldSelectedData[i].isShow) {
                    for (var j = 0; j < candidateLength; j++) {
                        if(oldSelectedData[i].transportId == candidateData[j].transportId && candidateData[j].delete) {
                            candidateData[j].delete = false;
                            candidateData[j].checkbox = $scope.candidateFlag;
                        }
                    }
                }else{
                    var map = $.extend({}, oldSelectedData[i]);
                    newSelectedData.push(map);
                }
            }
            $scope.unSelectedData = candidateData;
            $scope.selectedData = newSelectedData;
            // $scope.deleteCandidate();
        };

        /**
         * 已选区搜索
         */
        $scope.seaAirSearchSelected = function(){
            var key = $scope.seaAirSearchSelectedVal ? $scope.seaAirSearchSelectedVal.toLowerCase() : '';
            angular.forEach($scope.selectedData, function(value, index){
                if(
                    $scope.selectedData[index].name
                    && $scope.selectedData[index].name.toLowerCase().indexOf(key) != -1
                ){
                    $scope.selectedData[index].isShow = true;
                }else{
                    $scope.selectedData[index].isShow = false;
                }
            });
        };

        /**
         * 弹出选择区域框
         */
        $scope.selectOtherRegion = function(){
            $('#airSeaZone').show();
            $scope.airSeaZone = true;
            $scope.airSeaZoneTitle = $scope.productGroupId == 1 ? '添加港口' : '添加机场';

            //初始化数据
            $scope.candidateFlag = false;
            $scope.unSelectedData = [];
            $scope.selectedFlag = false;

            //清空国家城市数据
            $scope.countryName = '';
            $scope.countryFigureCode = '';
            $scope.cityName = '';
            $scope.cityId = '';

            $scope.seaAirSearchCandidateVal = '';

            var height = window.innerHeight - 260;
            $('#candidateZones, #selectedZones').slimscroll({'height':height});
            $(window).resize(function(){
                height = window.innerHeight - 260;
                $('#candidateZones, #selectedZones').slimscroll({'height':height});
            });
        };

        /**
         * 确认已选
         */
        $scope.cfmSeaAirSelected = function(){
            $('#remote-seaair-msg').html('');
            var inputStr = '';
            $scope.seaAirChoosedData = [];

            angular.forEach($scope.selectedData, function(value, key){
                inputStr += '，' + value.name;

                $scope.seaAirChoosedData.push({
                    'countryCode': value.countryCode,
                    'areaId': value.areaId,
                    'name': value.name,
                    'transportId': value.transportId
                });
            });
            $scope.regionSeaAirZone = inputStr ? inputStr.slice(1) : '';

            $scope.airSeaZone = false;
        };

        $scope.delCandidate = function(){
            var selLength = $scope.selectedData.length,
                canLength = $scope.unSelectedData.length;

            var unSelectedData= $scope.unSelectedData,
                selectedData = $scope.selectedData;

            for(var m=0; m<canLength; m++){
                unSelectedData[m].delete = false;
            }

            if(selLength && canLength){
                for(var i=0; i<selLength; i++){
                    for(var j=0; j<canLength; j++){
                        if(selectedData[i].transportId == unSelectedData[j].transportId){
                            unSelectedData[j].delete = true;
                            unSelectedData[j].checkbox = true;
                        }
                    }
                }
            }

            $scope.unSelectedData = unSelectedData;

            //更新待选区全选框按钮状态
            var count = 0;
            for(var k=0; k<canLength; k++){
                if($scope.unSelectedData[k].checkbox){
                    ++count;
                }
            }
            if(count == canLength){    //全选
                $scope.candidateFlag = true;
            }else{
                $scope.candidateFlag = false;
            }
        };
        /**================= 选择港口 或 机场 区域事件end =================*/


        function sliceLastNode(str){
            if(!str && (typeof str != 'string')){
                return str;
            }
            var index = str.lastIndexOf(separator);
            if(index != -1){
                str = str.slice(index+1);
            }
            return str;
        }

        function sliceFirstNode(str){
            if(!str && (typeof str != 'string')){
                return str;
            }
            var index = str.indexOf(separator);
            if(index != -1){
                str = str.slice(0, index);
            }
            return str;
        }

        /**
         * 获取已选单个数据信息
         * @param name
         * @param data
         * @returns {*}
         */
        function getSigleDataByName(name, data){
            var data = data.data;
            for(var index=0, length=data.length; index<length; index++) {
                if(data[index].name == name) {
                    return data[index];
                }
            }
        }
    }]);
});