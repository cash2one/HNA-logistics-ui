app.factory('customerView', [
    function () {
        var customerView = {};

        /** tab切换事件 */
        customerView.tab = function (selector, callback) {
            return $(selector).tab({ callback: callback });
        };

        /**
     * 弹出层
     * @param opt    弹出层options，值可为对象或者字符串
     */
        customerView.promptBox = function (opt) {
            $(document).promptBox(opt);
        };

        /**
     * 计算滚动条高度
     * @param type
     * @returns {number}
     */
        customerView.height = function (type) {
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

        customerView.lockBtn = function() {
            $("#submitVerify").attr("disabled", "true");
            $("#submitVerify").addClass("disabled");
        }
        customerView.unlockBtn = function() {
            $("#submitVerify").removeAttr("disabled");
            $("#submitVerify").removeClass("disabled");
        }

        customerView.disableBtn = function(id) {
            $("#"+id).attr("disabled", "true");
            $("#"+id).addClass("disabled");
        }
        customerView.enableBtn = function(id) {
            $("#"+id).removeAttr("disabled");
            $("#"+id).removeClass("disabled");
        }


        customerView.check = function() {
            var isLimit = false;
            var checkBoxEles = $(".checkbox");
            for(var index = 0; index < checkBoxEles.length; index++) {
                if(checkBoxEles[index].checked) {
                    var status = $(checkBoxEles[index]).attr("data-status");
                    if(status != Lang.getValByKey("customer", "customer_state_to_be_submit")) {
                        isLimit = true;
                        customerView.lockBtn();
                        break;
                    }
                }
            }
            if(!isLimit) {
                customerView.unlockBtn();
            }
        }

        customerView.bindEvent =function () {
            var time = setInterval(function () {

                if($("tbody tr").length > 0) {
                    clearInterval(time);
                    time = null;
                    $("tbody tr").delegate(".checkbox", "change", function() {

                        customerView.check();
                    });
                    $("#select-all").on("change", function() {
                        customerView.check();
                    });
                }
            }, 100);
        }

        return customerView;
    },
]);
