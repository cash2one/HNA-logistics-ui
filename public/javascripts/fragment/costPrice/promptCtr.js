app.controller('promptCtr', [
    '$scope',
    function ($scope) {
        var service = null;
        var copyPriceUrl = location.href.indexOf('costPrice') > -1 ? '#/priceDetail?module=costPrice&q=price' : '#/priceDetail?module=salesPrice&q=price';
        $scope.$on('resetDataEvent', function (event, data) {
            $scope.priceType = 1;
            $scope.adjustVal = '0';
            $scope.adjustType = Lang.getValByKey('price', 'price_change_up');
            $scope.adjustUnit = Lang.getValByKey('price', 'price_percent');
            $scope.adjustTypeId = '1';
            $scope.adjustUnitId = '1';
            $scope.uid = data.uid;
            service = data.service;
            hideAdjustError();
        });
        function showAdjustError() {
            $('#adjust-error-msg').addClass('errors');
            $('#adjust-error-msg').html(Lang.getValByKey('price', 'price_adjust_error_tips'));
            $('#adjust-error-msg').removeClass('ng-hide');
        }
        function hideAdjustError() {
            $('#adjust-error-msg').removeClass('errors');
            $('#adjust-error-msg').html('');
            $('#adjust-error-msg').addClass('ng-hide');
        }
        $scope.isOk = function () {
            if (!$scope.verifyFormat()) {
                return;
            }
            if ($scope.adjustType == Lang.getValByKey('price', 'price_change_down') && $scope.adjustUnit == Lang.getValByKey('price', 'price_percent')) {
                if ($scope.adjustVal && (parseFloat($scope.adjustVal) < 0 || parseFloat($scope.adjustVal) > 100)) {
                    showAdjustError();
                } else {
                    hideAdjustError();
                }
            } else {
                hideAdjustError();
            }
        };
        $scope.verifyFormat = function () {
            if (!$scope.adjustVal) {
                return;
            }
            var reg = /^(\d{1}|[1-9][0-9]*)$|^(0{1}|[1-9][0-9]*)\.\d{1,3}$/;
            if (!reg.test($scope.adjustVal)) {
                $('#adjust-error-msg').addClass('errors');
                $('#adjust-error-msg').html('请输入数字和小数点，可精确到小数点后3位');
                $('#adjust-error-msg').removeClass('ng-hide');
                return false;
            } else {
                hideAdjustError();
                return true;
            }
        };
        $scope.savePrompt = function () {
            if ($('#adjust-error-msg').hasClass('errors')) {
                return;
            }
            var data = {
                priceType: $scope.priceType,
                adjustTypeId: $scope.adjustTypeId,
                adjustVal: $scope.adjustVal,
                adjustUnitId: $scope.adjustUnitId,
                uid: $scope.uid
            };
            data = encodeURIComponent(JSON.stringify(data));
            location.href = copyPriceUrl + '&data=' + data;
        };
        selectFactory({
            data: {
                data: [
                    {
                        name: Lang.getValByKey('price', 'price_change_up'),
                        id: 1
                    },
                    {
                        name: Lang.getValByKey('price', 'price_change_down'),
                        id: 2
                    }
                ]
            },
            id: 'adjust-type',
            defaultText: '',
            attrTextModel: function (name, data, currentData) {
                $scope.adjustType = name;
                $scope.adjustTypeId = currentData.id;
                $scope.$apply();
                $scope.isOk();
            }
        });
        selectFactory({
            data: {
                data: [
                    {
                        name: Lang.getValByKey('price', 'price_percent'),
                        id: 1
                    },
                    {
                        name: Lang.getValByKey('price', 'price_money'),
                        id: 2
                    }
                ]
            },
            id: 'adjust-unit',
            defaultText: '',
            attrTextModel: function (name, data, currentData) {
                $scope.adjustUnit = name;
                $scope.adjustUnitId = currentData.id;
                $scope.$apply();
                $scope.isOk();
            }
        });
    }
]);
