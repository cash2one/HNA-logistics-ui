easySpa.require([
    'widget/slimscroll',
    'widget/tab',
    'widget/starRating',
    'public/common/tableController.js',
    'public/javascripts/fragment/supplier/suppliersService.js',
    'widget/slides'
], function() {
    app.controller('supplierController', ['$scope', '$rootScope', 'tableService',
        function($scope, $rootScope, tableService) {

            $scope.tableBDModel = {
                tableHeader: [
                    Lang.getValByKey("common", 'common_thead_number'),
                    Lang.getValByKey("common", 'common_table_responsibility'),
                    Lang.getValByKey("common", 'common_table_full_name'),
                    Lang.getValByKey("common", 'common_table_job_code'),
                    Lang.getValByKey("common", 'common_table_department'),
                    Lang.getValByKey("common", 'common_table_position'),
                    Lang.getValByKey("common", 'common_table_mobile_phone'),
                    Lang.getValByKey("common", 'common_table_telephone'),
                    Lang.getValByKey("common", 'common_table_remark')
                ],
                tableBody: [],
                selectNumber: 0,
                selectFlag: false
            };

            $scope.tableContactsModel = {
                tableHeader: [
                    Lang.getValByKey("common", 'common_thead_number'),
                    Lang.getValByKey("common", 'common_table_responsibility'),
                    Lang.getValByKey("common", 'common_table_full_name'),
                    Lang.getValByKey("common", 'common_table_department'),
                    Lang.getValByKey("common", 'common_table_position'),
                    Lang.getValByKey("common", 'common_table_mobile_phone'),
                    Lang.getValByKey("common", 'common_table_telephone'),
                    Lang.getValByKey("common", 'common_table_remark')
                ],
                tableBody: [],
                selectNumber: 0,
                selectFlag: false
            };

            $rootScope.tabs = $('#supplier-tab').tab({callback:supplierTab});

            function supplierTab(index){
                if(index == 1){
                    resizeTable();
                    $scope.tableBDModel.tableBody = tableService.addCheckbox($scope.supplierModel.supplierData.bds);
                    $scope.$apply();
                }
                if(index == 2){
                    resizeTable();
                    $scope.tableContactsModel.tableBody = tableService.addCheckbox($scope.supplierModel.supplierData.supplierContacts);
                    $scope.$apply();
                }
                if(index == 4){
                    /** 营业执照预览 */
                    $scope.getPictureUrl = function(fileid){
                        $('#slides').picturePreview({pictureId : fileid}, $scope.pictureModel.picture);
                    };
                }
            };
        }]);
});