
app.factory('customerApprovalView', [
    function () {
        var customerApprovalView = {};

        /** tab切换事件 */
        customerApprovalView.tab = function (selector, callback) {
            return $(selector).tab({ callback: callback });
        };

        /**
         * 弹出层
         * @param opt    弹出层options，值可为对象或者字符串
         */
        customerApprovalView.promptBox = function (opt) {
            $(document).promptBox(opt);
        };

        /**
         * 计算滚动条高度
         * @param type
         * @returns {number}
         */
        customerApprovalView.height = function (type) {
            var height = 0;
            switch (type) {
                case 'getResources':
                    height = $('.layout-right').height() - $('.layout-right ul').outerHeight() - 160;
                    break;
                case 'getSeniorResources':
                    height = $('.layout-right').height() - $('.layout-right ul').outerHeight() - 195;
                    break;
                case 'getRoleUser':
                    height = $('.layout-right').height() - 320;
                    break;
                case 'getSeniorRoleUser':
                    height = $('.layout-right').height() - 354;
                    break;
                case 'getGroupCandidate':
                    height = window.innerHeight - 252;
                    break;
                default:
                    height = 0;
                    break;
            }
            return height;
        };

        return customerApprovalView;
    },
]);
