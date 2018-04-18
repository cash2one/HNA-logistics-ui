easySpa.use(['public/common/areaService.js','widget/tab', 'widget/slimscroll',]);

app.controller('areaController', ["$scope", "areaService", '$rootScope', function($scope, areaService, $rootScope){

    var countryEle;
    var provinceEle;
    var cityEle;
    var areaEle;
    var separator = '/';    //定义地区ID和名称的分隔符。

    //待选区为非中国区省份请求参数
    $scope.scroller = {
        'q':'',
        'pageIndex':1,
        'pageSize':200
    };

    /** 待选框全选事件 */
    $scope.toggleCandidateAll = function(areaModel){
        var data = [];
        if(areaModel.candidateFlag == true){
            angular.forEach(areaModel.unSelectedData, function(value, key){
                data.push({
                    'id': value.id,
                    'name': value.name,
                    'figureCode': value.figureCode,
                    'delete': value.delete,
                    'isShow': value.isShow,
                    'checkbox': true,
                    'interId': value.interId
                });
            });
        }else{
            angular.forEach(areaModel.unSelectedData, function(value, key){
                data.push({
                    'id': value.id,
                    'name': value.name,
                    'figureCode': value.figureCode,
                    'delete': value.delete,
                    'isShow': value.isShow,
                    'checkbox': value.delete,
                    'interId': value.interId
                });
            });
        };

        areaModel.unSelectedData = data;
    };

    /** 已选框全选事件 */
    $scope.toggleSelectedAll = function(areaModel){
        var data = [];
        if(areaModel.selectedFlag == true){
            angular.forEach(areaModel.selectedData, function(value, key){
                data.push({
                    'id': value.id,
                    'name': value.name,
                    'figureCode': value.figureCode,
                    'delete': value.delete,
                    'isShow': value.isShow,
                    'checkbox': true,
                    'interId': value.interId
                });
            });
        }else{
            angular.forEach(areaModel.selectedData, function(value, key){
                data.push({
                    'id': value.id,
                    'name': value.name,
                    'figureCode': value.figureCode,
                    'delete': value.delete,
                    'isShow': value.isShow,
                    'checkbox': false,
                    'interId': value.interId
                });
            });
        };

        areaModel.selectedData = data;
    };

    /*================================ 四级联动数据处理 ===========================*/
    /** 更改父节点勾选时清理下级关联的所有节点数据 */
    function clearNextAddress(currentEle) {
        if(currentEle){
            var nextEle = currentEle.next;
            if(nextEle == null) {
                return;
            }
            nextEle.clearData();
            return clearNextAddress(nextEle);
        }
    }

    /** 获取已选单个数据信息 */
    function getSigleDataByName(name, data){
        var data = data.data;
        for(var index=0, length=data.length; index<length; index++) {
            if(data[index].name == name) {
                return data[index];
            }
        }
    }

    $rootScope.initCtrl = function(){
        $scope.checkedPlaceholder = Lang.getValByKey("common", 'common_page_unchecked_inputName');
        $scope.countryFigureCode = $scope.countryName = '';
        $scope.tabIndex = 0;
        $scope.searchCandidateValue = '';
        $scope.searchSelectedValue = '';
    };

    $scope.tabCallback = function(index){
        //清空数据
        countryEle && countryEle.clearData();
        provinceEle && provinceEle.clearData();
        cityEle && cityEle.clearData();
        areaEle && areaEle.clearData();

        //清除搜索框内容
        $scope.searchCandidateValue = '';

        if(index == 0){
            $scope.tabIndex = 0;

            //解除scroll控件事件绑定
            scrollObj && scrollObj.unbind('slimscroll');

            getCountry();

            //重置下拉框禁用状态
            $('.area-box .input-box').each(function(index){
                if(index){
                    $(this).addClass('select-disabled');
                }
            });

            $scope.countryFigureCode = '';
            $scope.countryName = '';

            $scope.deleteCandidate();
            $scope.checkedPlaceholder = Lang.getValByKey("common", 'common_page_unchecked_inputName');
        }else{

            $scope.tabIndex = 1;
            $scope.countryFigureCode = $scope.countryName = '';

            $scope.areaModel.unSelectedData = [];
            $scope.checkedPlaceholder = Lang.getValByKey("common", 'common_page_inputName');
        }
        $scope.$apply();
    };
    /** 加载待选区国家数据 */
    function getCountry(){
        // 为国家使用
        $scope.areaModel.unSelectedData = [];
        $scope.areaModel.candidateFlag = false;

        var config = {
            urlParams: {
                "pageIndex": 1,
                "pageSize": 300
            }
        };

        var data = areaService.getCountry(config).data;

        for (var i in data){
            data[i].name = data[i].name + '(' + data[i].figureCode + ')';
        }

        angular.forEach(data, function(value, key){
            $scope.areaModel.unSelectedData.push({
                'id': value.id,
                'name': value.name,
                'figureCode': value.figureCode,
                'delete': false,
                'isShow': true,
                'checkbox': $scope.areaModel.candidateFlag,
                'interId': value.figureCode
            });
        });

        var height = areaService.height('selectedUser');
        setTimeout(function() {
            areaService.slimscroll('.selected-user', height);
            $(window).resize(function(){
                height = areaService.height('selectedUser');
                areaService.slimscroll('.selected-user', height);
            });
        }, 10);
        areaService.slimscroll('.selected-user', height);
    }
    function getProvince(searchValueFlag){

        if($scope.countryFigureCode == 'CN'){    //调取中国省份列表
            var datas = areaService.getAddressData($scope.countryFigureCode, $scope.countryFigureCode);
        }else{    //非中国区省份列表
            var config = {
                'urlParams':{
                    'countryCode':$scope.countryFigureCode,
                    'parentId':$scope.countryFigureCode,
                    'q':$scope.scroller.q,
                    'pageIndex':$scope.scroller.pageIndex,
                    'pageSize':$scope.scroller.pageSize
                }
            };
            if(!$scope.countryFigureCode){
                var datas = [];
            }else{
                var datas = areaService.getOtherAddressData(config);
            }
        }

        var data = datas.data;
        var length = data ? data.length : 0;

        $scope.areaModel.unSelectedData = [];
        $scope.areaModel.candidateFlag = false;
        if(!searchValueFlag){
            $scope.searchCandidateValue = '';
        }

        for(var i=0; i<length; i++){
            if($scope.countryFigureCode == 'CN'){
                var name = data[i].name;
            }else{
                var name = data[i].cityName;
            }

            $scope.areaModel.unSelectedData.push({
                'id': data[i].id,
                'name': name,
                'figureCode': $scope.countryFigureCode,
                'delete': false,
                'isShow': true,
                'checkbox': $scope.areaModel.candidateFlag,
                'interId': $scope.countryFigureCode + separator + data[i].id,
                'interName': $scope.countryName + separator + data[i].name
            });
        }

        $scope.deleteCandidate();

        if($scope.countryFigureCode != 'CN'){
            $scope.scroller.totalPage = datas.pagination && datas.pagination.totalPage;
        }
        $scope.showProvince();
    }
    function getCity(openNextLevel){
        var data = areaService.getAddressData($scope.countryFigureCode, provinceEle.id);
        var data = data.data;
        var length = data ? data.length : 0;

        $scope.areaModel.unSelectedData = [];
        $scope.areaModel.candidateFlag = false;
        $scope.searchCandidateValue = '';

        for(var i=0; i<length; i++){
            $scope.areaModel.unSelectedData.push({
                'id': data[i].id,
                'name': data[i].name,
                'figureCode': $scope.countryFigureCode,
                'delete': false,
                'isShow': true,
                'checkbox': $scope.areaModel.candidateFlag,
                'interId': $scope.countryFigureCode + separator + provinceEle.id + separator + data[i].id,
                'interName': $scope.countryName + separator + $scope.provinceName + separator + data[i].name
            });
        }
        $scope.showCity(openNextLevel);

        $scope.deleteCandidate();
    }
    function getArea(){
        var data = areaService.getAddressData($scope.countryFigureCode, cityEle.id);

        var data = data.data;
        var length = data ? data.length : 0;

        $scope.areaModel.unSelectedData = [];
        $scope.areaModel.candidateFlag = false;
        $scope.searchCandidateValue = '';

        for(var i=0; i<length; i++){
            $scope.areaModel.unSelectedData.push({
                'id': data[i].id,
                'name': data[i].name,
                'figureCode': $scope.countryFigureCode,
                'delete': false,
                'isShow': true,
                'checkbox': $scope.areaModel.candidateFlag,
                'interId': $scope.countryFigureCode + separator + provinceEle.id + separator + cityEle.id + separator + data[i].id,
                'interName': $scope.countryName + separator + $scope.provinceName + separator + $scope.cityName + separator + data[i].name
            });
        }

        $scope.showArea();
        $scope.deleteCandidate();
    }

    function getStreet(){
        var data = areaService.getAddressData($scope.countryFigureCode, areaEle.id);

        var data = data.data;
        var length = data ? data.length : 0;

        $scope.areaModel.unSelectedData = [];
        $scope.areaModel.candidateFlag = false;
        $scope.searchCandidateValue = '';

        for(var i=0; i<length; i++){
            $scope.areaModel.unSelectedData.push({
                'id': data[i].id,
                'name': data[i].name,
                'figureCode': $scope.countryFigureCode,
                'delete': false,
                'isShow': true,
                'checkbox': $scope.areaModel.candidateFlag,
                'interId': $scope.countryFigureCode + separator + provinceEle.id + separator + cityEle.id + separator + areaEle.id + separator + data[i].id,
                'interName': $scope.countryName + separator + $scope.provinceName + separator + $scope.cityName + separator + $scope.areaName + separator + data[i].name
            });
        }

        $scope.deleteCandidate();
    }

    /**
     * 选择国家
     */
    function rebuildName(data) {
        if (!data) {
            return;
        }
        for (var index = 0; index < data.length; index++) {
            data[index].name = data[index].name + '(' + data[index].figureCode + ')';
        }
    }

    $scope.getCountryData = function (q,currentPage) {
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
        return areaService.getCountry(config);
    };

    $scope.showCountry = function(){

        if(!$scope.countryDatas){
            $scope.countryDatas = $scope.getCountryData()
        }

        if(!countryEle){
            countryEle = selectFactory({
                data: $scope.countryDatas,
                isSearch: true,
                id: "countryFigure",
                showTextField: "name",
                defaultText:Lang.getValByKey("common", 'common_select_tips'),
                pagination: true,
                closeLocalSearch:true,
                searchPlaceHoder: "请输入国家名称或二字码",
                onSearchValueChange: function (attachEvent, data,currentPage) {
                    var countryData = $scope.getCountryData(data,currentPage);
                    rebuildName(countryData.data);
                    attachEvent.setData(countryData);
                },
                attrTextModel: function(name, data) {
                    $scope.countryName = name;

                    var countryData;
                    if(!name) {
                        countryData = {};
                    } else {
                        countryData = getSigleDataByName(name, data);
                    }

                    countryEle.id = countryData ? countryData.id : '';
                    countryEle.figureCode = countryData ? countryData.figureCode : '';

                    $scope.countryFigureCode = countryEle.figureCode;
                    if(countryEle.figureCode != 'CN'){    //非中国区
                        provinceEle && provinceEle.clearData();
                        $scope.provinceName = '';
                        cityEle && cityEle.clearData();
                        $scope.cityName = '';
                        areaEle && areaEle.clearData();
                        $scope.areaName = '';
                        $scope.scroller.pageIndex = 1;
                        $scope.scroller.q = '';

                        scrollObj.unbind('slimscroll');    //先解除绑定后在进行绑定
                        scrollObj.bind("slimscroll", function(e, pos){
                            canScrollEvent(e, pos);
                        });
                    }else{
                        scrollObj.unbind('slimscroll');
                    }
                    $scope.provinceDatas = '';
                    $scope.provinceName = '';
                    $scope.cityDatas = '';
                    $scope.areaDatas = '';

                    //重置下拉框禁用状态
                    $('.area-box .input-box').each(function(index){
                        if(index){
                            $(this).addClass('select-disabled');
                        }
                    });
                    if($scope.countryFigureCode == 'CN'){
                        $('#province').parent('.input-box').removeClass('select-disabled');
                    }
                    clearNextAddress(countryEle);
                    getProvince();
                    $scope.$apply();
                }
            });
        }

        countryEle.setData($scope.countryDatas);
        // countryEle.open();
        $('#countryFigure').val($scope.countryName);
    };

    $scope.getProvinceData = function (q,currentPage) {
        if(!currentPage) {
            currentPage = 1;
        }

        q = q ? q : '';

        var config = {
            urlParams: {
                q: q,
                "parentId":$scope.countryFigureCode,
                "countryCode": $scope.countryFigureCode,
                "pageIndex": currentPage,
                "pageSize": 10
            }
        };
        return areaService.getAddrData(config);
    };

    /** 选择省份 */
    $scope.showProvince = function(){


        if($('#province').parent('.input-box').hasClass('select-disabled')){
            return false;
        }
        if(!$scope.provinceDatas){
            $scope.provinceDatas = $scope.getProvinceData();
        }

        provinceEle = selectFactory({
            data: $scope.provinceDatas,
            isSearch: true,
            isUsePinyin: true,
            id: "province",
            defaultText:Lang.getValByKey("common", 'common_select_tips'),
            showTextField: "name",
            pagination: true,
            closeLocalSearch:true,
            searchPlaceHoder: "请输入省名称",
            onSearchValueChange: function (attachEvent, data,currentPage) {
                if($scope.countryFigureCode != 'CN'){ return false; }    //必须有，阻止非中国区点击城市

                var ProvinceData = $scope.getProvinceData(data,currentPage);
                attachEvent.setData(ProvinceData);
            },
            attrTextModel: function(name, data) {
                $scope.provinceName = name;
                if($scope.countryFigureCode == 'CN' ) {
                    $('#area').parent('.input-box').addClass('select-disabled');
                    $('#city').parent('.input-box').removeClass('select-disabled');
                }

                $scope.cityDatas = '';
                $scope.cityName = '';
                cityEle && cityEle.clearData();
                $scope.areaDatas = '';
                areaEle && areaEle.clearData();

                var provinceData;
                if(!name) {
                    provinceData = {};
                } else {
                    provinceData = getSigleDataByName(name, data);
                }

                provinceEle.id = provinceData ? provinceData.id : '';
                if(!provinceEle.id){
                    $('#area').parent('.input-box').addClass('select-disabled');
                    $('#city').parent('.input-box').addClass('select-disabled');
                }

                clearNextAddress(provinceEle);

                if(provinceData.id){
                    getCity(true);
                }else{
                    getProvince();
                }
                $scope.$apply();
            }
        });
        provinceEle.setData($scope.provinceDatas);
        provinceEle.open();
        countryEle.next = provinceEle;
        $('#province').val($scope.provinceName);
    };

    /**
     * 展示城市数据
     * @returns {boolean}
     */

    $scope.getCityData = function (q,currentPage) {
        if(!currentPage) {
            currentPage = 1;
        }

        q = q ? q : '';

        var config = {
            urlParams: {
                q: q,
                "countryCode": $scope.countryFigureCode,
                "parentId":provinceEle.id,
                "pageIndex": currentPage,
                "pageSize": 10
            }
        };
        return areaService.getAddrData(config);
    };

    $scope.showCity = function(openNextLevel){
        if($('#city').parent('.input-box').hasClass('select-disabled')){
            return false;
        }
        if(!$scope.cityDatas){
            $scope.cityDatas = $scope.getCityData();
        }

        cityEle = selectFactory({
            data: $scope.cityDatas,
            id: "city",
            isSearch: true,
            defaultText:Lang.getValByKey("common", 'common_select_tips'),
            isUsePinyin: true,
            direction:'up',
            showTextField: "name",
            pagination: true,
            closeLocalSearch:true,
            searchPlaceHoder: "请输入市名称",
            onSearchValueChange: function (attachEvent, data,currentPage) {
                if(!$scope.provinceName){ return false; }

                var CityData = $scope.getCityData(data,currentPage);
                attachEvent.setData(CityData);
            },
            attrTextModel: function(name, data) {
                $scope.cityName = name;
                if($scope.countryFigureCode == 'CN'){
                    $('#area').parent('.input-box').removeClass('select-disabled');
                }
                $scope.areaDatas = '';
                $scope.areaName = '';
                areaEle && areaEle.clearData();

                var cityData;
                if(!name) {
                    cityData = {};
                } else {
                    cityData = getSigleDataByName(name, data);
                }
                cityEle.id = cityData ? cityData.id : '';
                if(!cityEle.id){
                    $('#area').parent('.input-box').addClass('select-disabled');
                }
                clearNextAddress(cityEle);

                if(cityData.id){
                    getArea();
                }else{
                    getCity();
                }

                $scope.$apply();
            }
        });
        cityEle.setData($scope.cityDatas);
        if (openNextLevel === true) {
          if ($scope.cityDatas.data.length > 1) {
            cityEle.open();
          } else if ($scope.cityDatas.data.length === 1) {
            if($scope.countryFigureCode == 'CN'){
                $('#area').parent('.input-box').removeClass('select-disabled');
            }
            $scope.cityName = $scope.cityDatas.data[0].name;
            cityEle.id = $scope.cityDatas.data[0].id;
            $scope.areaDatas = '';
            $scope.areaName = '';
            areaEle && areaEle.clearData();
            clearNextAddress(cityEle);
            getArea();
            $scope.$apply();
          }
        } else {
          cityEle.open();
        }
        provinceEle.next = cityEle;
        $('#city').val($scope.cityName);
    };

    /**
     * 展示区县数据
     * @returns {boolean}
     */

    $scope.getAreaData = function (q,currentPage) {
        if(!currentPage) {
            currentPage = 1;
        }

        q = q ? q : '';

        var config = {
            urlParams: {
                q: q,
                "countryCode": $scope.countryFigureCode,
                "parentId":cityEle.id,
                "pageIndex": currentPage,
                "pageSize": 10
            }
        };
        return areaService.getAddrData(config);
    };

    $scope.showArea = function(){
        if($('#area').parent('.input-box').hasClass('select-disabled')){
            return false;
        }
        if(!$scope.areaDatas){
            $scope.areaDatas = $scope.getAreaData();
        }

        areaEle = selectFactory({
            data: $scope.areaDatas,
            isSearch: true,
            defaultText:Lang.getValByKey("common", 'common_select_tips'),
            isUsePinyin: true,
            id: "area",
            showTextField: "name",
            direction:'up',
            pagination: true,
            closeLocalSearch:true,
            searchPlaceHoder: "请输入区县名称",
            onSearchValueChange: function (attachEvent, data,currentPage) {
                if(!$scope.cityName){ return false; }

                var AreaData = $scope.getAreaData(data,currentPage);
                attachEvent.setData(AreaData);
            },
            attrTextModel: function(name, data) {
                $scope.areaName = name;
                var areaData;
                if(!name) {
                    areaData = {};
                } else {
                    areaData = getSigleDataByName(name, data);
                }
                areaEle.id = areaData ? areaData.id : '';

                if(areaData.id){
                    getStreet();
                }else{
                    getArea();
                }

                $scope.$apply();
            }
        });
        areaEle.setData($scope.areaDatas);
        areaEle.open();
        cityEle.next = areaEle;
        $('#area').val($scope.areaName);
    };


    /*================================ 待选区数据处理 ===========================*/
    /**
     * 待选用户单个checkbox
     * @param id    Id
     */
    $scope.toggleCandidateOne = function(id){
        var data = $scope.areaModel.unSelectedData;
        var length = data.length ? data.length : 0;
        var unselect = 0;
        for (var i = 0; i < length; i++) {
            if(id.split('/').length != 1){
                if(data[i].interId.split('/').length == id.split('/').length){
                    if (data[i].interId.split('/')[data[i].interId.split('/').length-1] == id.split('/')[id.split('/').length -1]) {
                        data[i].checkbox = !data[i].checkbox;
                    }
                }
            }else{
                if (data[i].interId == id) {
                    data[i].checkbox = !data[i].checkbox;
                }
            }

            if (!data[i].checkbox) {
                ++unselect;
            }
        }
        $scope.areaModel.unSelectedData = data;
        if(unselect){
            $scope.areaModel.candidateFlag = false;
        }else{
            $scope.areaModel.candidateFlag = true;
        }
    };

    /**
     * 待选区搜索
     */
    $scope.searchCandidate = function(){
        var key = $.trim(($scope.searchCandidateValue).toLowerCase());
        if(key){
            key = key.replace(/[，。、,.\/]/g,',').replace(/(^\s*)|(\s*$)/g,'');
        }

        if($scope.countryName && $scope.countryFigureCode != 'CN'){    //地区-》其他国家城市搜索
            $scope.scroller.q = $scope.searchCandidateValue;
            $scope.scroller.pageIndex = 1;
            getProvince(true);
        }else{
            var data = $scope.areaModel.unSelectedData;
            var length = data.length;
            var arr = [];
            var isShow = true;

            for(var i=0; i<length; i++){
                if(!$scope.countryName && key){    //待选区为国家，支持以逗号为分隔符的二字码进行多国家匹配
                    var keyArr = key.split(',');
                    for(var j=0, l=keyArr.length; j<l; j++){
                        if(data[i].name && keyArr[j] &&  (((data[i].name).toLowerCase()).indexOf(keyArr[j]) != -1
                            || ((data[i].interId).toLowerCase()).indexOf(keyArr[j]) != -1)){
                            isShow = true;
                            break;
                        }else{
                            isShow = false;
                        }
                    }
                }else{
                    if(!data[i].name || ((data[i].name).toLowerCase()).indexOf(key) == -1){
                        isShow = false;
                    }else{
                        isShow = true;
                    }
                }

                arr.push({
                    'id': data[i].id,
                    'name': data[i].name,
                    'figureCode': data[i].figureCode,
                    'delete': data[i].delete,
                    'isShow': isShow,
                    'checkbox': data[i].checkbox,
                    'interId': data[i].interId,
                    'interName': data[i].interName
                });
            }
            $scope.areaModel.unSelectedData = arr;

            $scope.deleteCandidate();
        }
    };

    /**
     * 待选区域 -》 已选区域
     */
    $scope.addSelectedData = function(){
        var candidateData= $scope.areaModel.unSelectedData,
            selectedData = $scope.areaModel.selectedData;

        var candidateLength = candidateData.length;

        for(var i=0; i<candidateLength; i++){
            if(candidateData[i]['checkbox'] && !candidateData[i]['delete'] && candidateData[i]['isShow']){
                selectedData.unshift({
                    'id': candidateData[i].id,
                    'name': candidateData[i].name,
                    'figureCode': candidateData[i].figureCode,
                    'delete': false,
                    'isShow': true,
                    'checkbox': $scope.areaModel.selectedFlag,
                    'interId': candidateData[i].interId,
                    'interName': candidateData[i].interName
                });
                candidateData[i]['delete'] = true;
            }
        }
        $scope.areaModel.unSelectedData = candidateData;
        $scope.areaModel.selectedData = selectedData;

        $scope.deleteCandidate();
    };

    /**
     * 待选区 delete  置灰
     */
    $scope.deleteCandidate = function(){
        var selLength = $scope.areaModel.selectedData.length,
            canLength = $scope.areaModel.unSelectedData.length;

        var unSelectedData= $scope.areaModel.unSelectedData,
            selectedData = $scope.areaModel.selectedData;

        for(var m=0; m<canLength; m++){
            unSelectedData[m].delete = false;
        }

        if(selLength && canLength){
            for(var i=0; i<selLength; i++){
                for(var j=0; j<canLength; j++){
                    if((selectedData[i].interId + separator).indexOf(unSelectedData[j].interId + separator) != -1
                        || (unSelectedData[j].interId + separator).indexOf(selectedData[i].interId + separator) != -1){
                        unSelectedData[j].delete = true;
                        unSelectedData[j].checkbox = true;
                    }
                }
            }
        }

        $scope.areaModel.unSelectedData = unSelectedData;

        //更新待选区全选框按钮状态
        var count = 0;
        for(var k=0; k<canLength; k++){
            if($scope.areaModel.unSelectedData[k].checkbox){
                ++count;
            }
        }
        if(count == canLength){    //全选
            $scope.areaModel.candidateFlag = true;
        }else{
            $scope.areaModel.candidateFlag = false;
        }
    };

    /*================================ 已选区数据处理 ===========================*/

    /**
     * 已选用户单个checkbox
     * @param userId    用户Id
     * @param userType    用户类型
     */
    $scope.toggleSelectedOne = function(id){
        var data = $scope.areaModel.selectedData;
        var length = data.length ? data.length : 0;
        var unselect = 0;
        for (var i = 0; i < length; i++) {
            if(id.split('/').length != 1){
                if(data[i].interId.split('/').length == id.split('/').length){
                    if (data[i].interId.split('/')[data[i].interId.split('/').length-1] == id.split('/')[id.split('/').length -1]) {
                        data[i].checkbox = !data[i].checkbox;
                    }
                }
            }else{
                 if (data[i].interId == id) {
                    data[i].checkbox = !data[i].checkbox;
                 }
            }
            if (!data[i].checkbox) {
                ++unselect;
            }
        }

        $scope.areaModel.selectedData = data;
        if(unselect){
            $scope.areaModel.selectedFlag = false;
        }else{
            $scope.areaModel.selectedFlag = true;
        }
    };

    /**
     * 已选区搜索
     */
    $scope.searchSelected = function(){
        var key = ($scope.searchSelectedValue).toLowerCase(),
            data= $scope.areaModel.selectedData;

        var length = data.length;
        var arr = [];
        var isShow = true;

        for(var i=0; i<length; i++){
            if(key){    //待选区为国家，支持以逗号为分隔符的二字码进行多国家匹配
                var keyArr = key.split(',');
                if(keyArr.length == 1){
                    for(var j=0, l=keyArr.length; j<l; j++){
                        if(data[i].name && keyArr[j] &&  (((data[i].name).toLowerCase()).indexOf(keyArr[j]) != -1
                            || ((data[i].interId).toLowerCase()).indexOf(keyArr[j]) != -1)){
                            isShow = true;
                            break;
                        }else{
                            isShow = false;
                        }
                    }
                }else{
                    return false;
                }
            }else{
                if(!data[i].name || ((data[i].name).toLowerCase()).indexOf(key) == -1){
                    isShow = false;
                }else{
                    isShow = true;
                }
            }

            arr.push({
                'id': data[i].id,
                'name': data[i].name,
                'figureCode': data[i].figureCode,
                'delete': data[i].delete,
                'isShow': isShow,
                'checkbox': data[i].checkbox,
                'interId': data[i].interId,
                'interName': data[i].interName
            });
        }
        $scope.areaModel.selectedData = arr;
    };

    /**
     * 已选区域 -》 待选区域
     */
    $scope.removeSelectedData = function(){
        var candidateData= $scope.areaModel.unSelectedData,
            oldSelectedData = $scope.areaModel.selectedData;

        var newSelectedData = [];

        var candidateLength = candidateData.length,
            selectedLength = oldSelectedData.length;

        for(var i=0; i<selectedLength; i++){
            if(oldSelectedData[i].checkbox && oldSelectedData[i].isShow) {
                for (var j = 0; j < candidateLength; j++) {
                    if(oldSelectedData[i].id == candidateData[j].id && candidateData[j].delete) {
                        candidateData[j].delete = false;
                        candidateData[j].checkbox = $scope.areaModel.candidateFlag;
                    }
                }
            }else{
                newSelectedData.push({
                    'id': oldSelectedData[i].id,
                    'name': oldSelectedData[i].name,
                    'figureCode': oldSelectedData[i].figureCode,
                    'delete': oldSelectedData[i].delete,
                    'isShow': oldSelectedData[i].isShow,
                    'checkbox': oldSelectedData[i].checkbox,
                    'interId': oldSelectedData[i].interId,
                    'interName': oldSelectedData[i].interName
                });
            }
        }
        $scope.areaModel.unSelectedData = candidateData;
        $scope.areaModel.selectedData = newSelectedData;

        $scope.deleteCandidate();
    };

    /** tab切换组件初始化 */
    $scope.init = function(){
        $rootScope.tab = $('#m-tab').tab({callback:$scope.tabCallback});
    };

    var lockScroll = false;
    function canScrollEvent(e, pos){
        if(!$scope.countryFigureCode || lockScroll){
            return ;
        }

        lockScroll = true;    //加锁

        if(pos == 'bottom'){    //到底部，加载更多
            if($scope.scroller.pageIndex < $scope.scroller.totalPage){
                $scope.scroller.pageIndex = $scope.scroller.pageIndex + 1;

                getProvince(true);

                setTimeout(function(){
                    scrollObj.slimScroll({ scrollTo : '0px' });
                }, 800);
            }
            setTimeout(function(){
                lockScroll = false;
            }, 800);
        }else if(pos == 'top'){    //到顶部，下拉刷新
            if($scope.scroller.pageIndex > 1){
                $scope.scroller.pageIndex = $scope.scroller.pageIndex - 1;
                setTimeout(function(){
                    scrollObj.slimScroll({ scrollTo : scrollObj.outerHeight()});
                    lockScroll = false;
                }, 800);
            }else{
                $scope.scroller.pageIndex = 1;
                lockScroll = false;
            }
            getProvince(true);
        }
        $scope.$apply();
    }


    function initSelect() {
        $scope.showCountry();
        $scope.showProvince();
        $scope.showCity();
    }
    function init() {
        initSelect();
    }
    init();
}]);
