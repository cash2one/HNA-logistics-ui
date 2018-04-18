app.factory('areaService', ['easyHttp', '$rootScope', function (easyHttp, $rootScope) {
    var factory = {};

    /**
     * 初始化重组areaModel数据
     * @param areaModel
     * @returns {*}
     */
    factory.initArea = function(areaModel){

        var data = [], unData = [];
        //待选区数据重组
        angular.forEach(areaModel.unSelectedData, function(value, key){
            //国家name上面添加二字码
            if((value.figureCode).indexOf('/') == -1 && (value.name).indexOf(value.figureCode) == -1){
                value.name = value.name + '(' + value.figureCode + ')';
            }

            unData.push({
                'id': value.figureCode,
                'name': value.name,
                'figureCode': value.figureCode,
                'delete': false,
                'isShow': true,
                'checkbox': false,
                'interId': value.figureCode
            });
        });
        //已选区数据重组
        angular.forEach(areaModel.selectedData, function(value, key){
            //国家name上面添加二字码
            if((value.figureCode).indexOf('/') == -1 && (value.name).indexOf(value.figureCode) == -1){
                value.name = value.name + '(' + value.figureCode + ')';
            }

            data.push({
                'id': value.figureCode,
                'name': value.name,
                'figureCode': value.figureCode,
                'delete': false,
                'isShow': true,
                'checkbox': false,
                'interId': value.figureCode
            });
        });

        for(var i=0,il=unData.length; i<il; i++){
            for(var j=0, jl=data.length; j<jl; j++){
                if(data[j].figureCode && data[j].figureCode.split('/')){
                    if(unData[i].figureCode == data[j].figureCode.split('/')[0]){
                        unData[i].checkbox = true;
                        unData[i].delete = true;
                    }
                }else{
                    if(unData[i].figureCode == data[j].figureCode){
                        unData[i].checkbox = true;
                        unData[i].delete = true;
                    }
                }
            }
        }

        areaModel.unSelectedData = unData;
        areaModel.selectedData = data;
        areaModel.candidateFlag = false;
        areaModel.selectedFlag = false;

        var height = factory.height('selectedUser');
        setTimeout(function() {
            $('#selectedZone').slimscroll({'height':height});
            scrollObj = $('#candidateZone').slimscroll({'height':height});

            $(window).resize(function(){
                height = factory.height('selectedUser');
                factory.slimscroll('.selected-user', height);
            });
        }, 10);
        factory.slimscroll('.selected-user', height);
        return areaModel;
    };

    /**
     * 获取国家列表
     * @returns {*}
     */
    factory.getCountry = function(param){
        return easyHttp.get("logistics.getCountry",param);
    };

    /**
     * 获取中国国家的省，市，区……
     * @param countryCode
     * @param parentId
     * @returns {*}
     */
    factory.getAddressData = function(countryCode, parentId) {
        return easyHttp.get("logistics.search", {urlParams: {"countryCode": countryCode,"parentId": parentId,"pageIndex":1,"pageSize":1000}});
    };

    factory.getAddrData=function(param) {
        return easyHttp.get("logistics.search", param);
    }

    /**
     * 获取其他国家的省份
     * @param config
     * @returns {*}
     */
    factory.getOtherAddressData = function(config){
        return easyHttp.get("logistics.getAreaList", config);
    };

    /**
     * 计算滚动条高度
     * @param type
     * @returns {number}
     */
    factory.height = function(type){
        var height = 0;
        switch (type){
            case 'table': height = $('.master-table').height() - 350;
                break;

            case 'selectedUser' : height = window.innerHeight - 252;
                break;
        }
        return height;
    };

    /**
     * 滚动条设置
     * @param elm    选择器，#id 或 .class
     * @param height    高度
     */
    factory.slimscroll = function(elm, height){
        $(elm).slimscroll({ height: height });
    };

    return factory;
}]);
