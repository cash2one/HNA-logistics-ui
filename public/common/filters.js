app.filter('trustHtml',function($sce){
    return function(value, key){
        if(value && key){
            var v = value.toLowerCase(),
                k = key.toLowerCase();

            var i = v.indexOf(k),
                l = k.length;

            if(i != -1){
                var str = value.substr(i, l);
                value = value.replace(str, '<span style="color: red">'+str+'</span>');
            }
        }
        return $sce.trustAsHtml(value);
    }
});

app.filter('serviceType',function () {
    return function (isServiceMain) {
        if (isServiceMain) {
            return '主账号'
        } else {
            return '子账号'
        }
    }
    
})

app.filter('messageState',function () {
    return function (state) {
        if (state) {
            return '已解决'
        } else {
            return '未解决'
        }
    }

})

app.filter('projectStatus', function(){
    return function(status) {
        switch (+status) {
            case 1:
                return '草稿';
            case 2:
                return '待初审';
            case 3:
                return '待终审';
            case 4:
                return '已立项';
            case 5:
                return '已结项';
            default:
                return '已关闭';
        }
    }
})

app.filter('entType', function(){
    return function(status) {
        switch (+status) {
            case 1:
                return '供应商';
            case 2:
                return '客户';
            case 3:
                return '平台';
            default:
                return '';
        }
    }
})

app.filter('bizType', function(){
    return function(status) {
        switch (+status) {
            case 1:
                return '物流';
            default:
                return '贸易';
        }
    }
})

app.filter('approvalIdentity', function(){
    return function(status) {
        switch (+status) {
            case 1:
                return '风控审核';
            case 2:
                return '财务审核';
            default:
                return '运营审核';
        }
    }
})