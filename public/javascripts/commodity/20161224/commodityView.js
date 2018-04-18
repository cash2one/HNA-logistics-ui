app.factory('commodityView', [
    '$http',
    '$templateCache',
    '$compile',
    function ($http, $templateCache, $compile) {
        var commodityView = {},
            TPL_URL = '/tpl/fragment/commodity/',
            TPL_TYPE = '.html';

        commodityView.getTpl = function (name) {
            // var tpl = $templateCache.get(name + TPL_TYPE);
            // if(!tpl){
            return $http.get(TPL_URL + name + TPL_TYPE + nocache()).then(function (res) {
                if (res.data) {
                    $templateCache.put(name + TPL_TYPE, res.data);
                    return res.data;
                }
            });
            // }else{
            //	return { then : function(fn){ fn(tpl) }}
            // }
        };

        var doc = $(document);

        commodityView.promptBox = function (data) {
            var config = {
                isDelay: true,
                contentDelay: data.msg,
                time: 3000
            };

            if (data.errorCode == 0) {
                config.type = 'success';
            } else {
                // config.manualClose = true;
                config.type = 'errer';
            }
            doc.promptBox(config);

            !config.time || doc.promptBox('closePrompt');
        };

        commodityView.promptMidBox = function (title, data, btnText, fn) {
            doc.promptBox({
                title: title ? title : '提示信息',
                type: 'success',
                width: '400px',
                content: {
                    tip: data.msg
                },
                operation: [
                    {
                        type: 'submit',
                        description: btnText || Lang.getValByKey('common', 'common_pagination_confirm'),
                        operationEvent: function () {
                            fn();
                            // $(document).promptBox('closePrompt');
                            return false;
                        }
                    }
                ]
            });
        };

        commodityView.resetKeys = function (result, obj) {
            for (var i in obj) { delete result[i]; }
        };

        commodityView.setTableHeight = function () {
            var ah = $('#commodityList .bills').height(),
                tableWrap = $('#tableWrap');
            tableWrap.height(ah - tableWrap.offset().top + 20 + 'px');
        };

        commodityView.goodsTypes = function (list, $scope, data, cb) {
            var gname, gid;

            if (data.id) {
                $scope.goodType = gid = data.id;
            }
            if (data.name) {
                gname = data.name;
            }

            var html =
                '<div class="good-type" id="goodTypeDiv">' +
                '<div><strong>选择商品类别</strong><div class="good-type-div">' +
                goodItem(list, 0) +
                '</div><div class="good-type-btn"><button class="btn btn-primary btn-bill" ng-click="gcancel()">取消</button><button class="btn btn-primary btn-bill" ng-click="gconfirm()">确定</button></div></div></div>';

            var method = {
                gconfirm: function () {
                    cb(gname, gid);
                    $scope.gcancel();
                },
                gcancel: function () {
                    $('#goodTypeDiv').remove();
                },
                gchange: function (name, id) {
                    gname = name;
                    gid = id;
                }
            };
            if (!$scope.gconfirm) { $.extend($scope, method); }

            function goodItem(data, layer) {
                var html = '<ul>';
                data.forEach(function (item) {
                    html +=
                        '<li><p><input type="radio" style="left:' +
                        (-30 - layer * 15) +
                        'px" name="goodType" ng-click="gchange(\'' +
                        item.name +
                        "','" +
                        item.id +
                        '\')" ng-model="goodType" value="' +
                        item.id +
                        '" /><span>' +
                        item.name +
                        '</span></p></li>';
                    if (item.children && item.children.length > 0) { html += goodItem(item.children, layer + 1); }
                });
                html += '</ul>';
                return html;
            }
            $('#commodityList').children('#goodTypeDiv').remove();
            $('#commodityList').append($compile(html)($scope));
        };

        function nocache() {
            return '?a=' + Math.random();
        }

        return commodityView;
    }
]);
