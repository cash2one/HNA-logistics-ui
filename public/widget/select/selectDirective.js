easySpa.use([
    'public/lib/pinyin.js',
    'public/lib/pinyin-util.js'
]);
var isShowNoResult = true;
String.prototype.replaceAll = function(s1,s2){
    return this.replace(new RegExp(s1,"gm"),s2);
};
function Select(option) {
    if(!option) {
        option = {};
    }
    this.DEFAULT_COUNT = 11;
    if(option.defaultCount && option.defaultCount > 0) {
        this.DEFAULT_COUNT = option.defaultCount;
    }
    this.limitSearchLength = option.limitSearchLength || 30;
    this.url =  option.url;
    this.data = option.data;
    this.allData = this.data;
    this.cacheData = this.data;
    this.offset = option.offset || 4;
    this.maxHeight = option.maxHeight || 240;
    this.minHeight = option.minHeight || 34;
    this.height = option.height;
    this.isCreateNewSelect = option.isCreateNewSelect || false;
    this.inputElement = $("#" + option.id);
    this.parentElement = option.parentContainer;
    this.isCache = option.isCache;
    this.state = false;
    this.defaultCount = this.DEFAULT_COUNT;
    this.showTextField = option.showTextField || "name";
    this.attrTextField = option.attrTextField;
    this.attrTextModel = option.attrTextModel;
    this.attrTextId = option.attrTextId;
    this.selectListBoxEle = null;
    this.selectContainerEle = null;
    this.isSearch = option.isSearch;
    this.noResultText = option.noResultText || "无搜索结果";
    this.direction = option.direction;
    this.searchDefaultText = option.searchDefaultText;
    this.searchBoxEle = null,
    this.isUsePinyin = option.isUsePinyin;
    this.multipleSign = option.multipleSign;
    this.onBeforeShow = option.onBeforeShow;
    this.isNotUseFilter = option.isNotUseFilter;
    this.onSearchValueChange = option.onSearchValueChange;
    this.closeLocalSearch = option.closeLocalSearch || false;
    this.isSaveInputVal = option.isSaveInputVal || true;
    this.searchPlaceHoder = option.searchPlaceHoder || "请输入搜索条件";
    this.isPageLoaddingOpen = false;//分页的loadding是否打开，默认为false
    this.pagination = option.pagination || false;
    this.paginationScrollDirection = "down";
    this.currentPage = 1;
    this.isCanPaginationScroll = true;
    this.isShowSelectWhenHidden = true;
    if((typeof option.isReadOnly == "undefined" || option.isReadOnly) && !this.multipleSign) {
        this.inputElement.attr("readonly", "readonly");
    }
    if(this.isSearch) {
        this.defaultText = typeof option.defaultText == "undefined" ? "全部" : option.defaultText;
    } else {
        this.defaultText = typeof option.defaultText == "undefined" ? "请选择" : option.defaultText;
    }
}
var isShowConditionSearchText = false;
Select.prototype = {
    isInputClick: false,
    getView: function() {
        var currencyView = {};
        currencyView.getCursorPosition =function(inputEle) {
            var inputTextEle = $(inputEle);
            if(!$.trim(inputTextEle.val())) {
                return;
            }
            inputTextEle = inputTextEle[0];
            var CaretPos = 0;
            if (document.selection) { // IE Support
                var Sel = document.selection.createRange();
                Sel.moveStart('character', -inputTextEle.value.length);
                CaretPos = Sel.text.length;
            }else if(inputTextEle.selectionStart || inputTextEle.selectionStart == '0'){// Firefox support
                CaretPos = inputTextEle.selectionStart;
            }
            return CaretPos;
        };
        //设置光标位置函数
        currencyView.setCursorPosition = function(inputEle, pos){
            var inputTextEle = $(inputEle);
            inputTextEle = inputTextEle[0];
            if(inputTextEle.setSelectionRange) {
                inputTextEle.setSelectionRange(pos,pos);
            }
            else if (inputTextEle.createTextRange) {
                var range = inputTextEle.createTextRange();
                range.collapse(true);
                range.moveEnd('character', pos);
                range.moveStart('character', pos);
                range.select();
            }
        };
        return currencyView;
    },
    setDefaultCount: function(defaultCount) {
        if(this.pagination) {
            this.defaultCount = 10;
        } else {
            if(defaultCount == 1) {
                this.defaultCount = defaultCount + 1;
                this.DEFAULT_COUNT = defaultCount + 1;
            } else {
                this.defaultCount = defaultCount;
                this.DEFAULT_COUNT = defaultCount;
            }
        }
    },
    clearActiveCls: function() {
        if(this.selectListBoxEle) {
            $("li", this.selectListBoxEle).removeClass("active");
        }
    },
    moveScrollUp: function(activeLiEle) {
        var self = this;
        // var offsetActiveEle = activeLiEle.offset();
        // var offsetInputElementEle = this.inputElement.offset();
        setTimeout(function() {
            self.selectContainerEle.scrollTop(self.selectContainerEle[0].scrollTop - activeLiEle.outerHeight());
        }, 100);
    },
    moveScrollDown: function(activeLiEle) {
        var self = this;
        // var offsetActiveEle = activeLiEle.offset();
        // var offsetInputElementEle = this.inputElement.offset();
        setTimeout(function() {
            self.selectContainerEle.scrollTop(self.selectContainerEle[0].scrollTop + activeLiEle.outerHeight());
        }, 100);
    },
    moveSelectedUp: function() {
        if(this.isSearch) {
            if ($(".no-result", this.selectListBoxEle).length > 0) {
                return;
            }
        }
        var hasActive = false;
        var liEles = $("li", this.selectListBoxEle);
        for(var index = 0; index < liEles.length; index++) {
            if($(liEles[index]).hasClass("active") && index != 0) {
                $(liEles[index]).removeClass("active");
                $(liEles[index - 1]).addClass("active");
                hasActive = true;
                break;
            } else if($(liEles[index]).hasClass("active")) {
                hasActive = true;
            }
        }
        if(!hasActive) {
            $(liEles[0]).addClass("active");
        }
        this.moveScrollUp($("li.active", this.selectListBoxEle));
    },
    moveSelectedDown: function() {
        if(this.isSearch) {
            if ($(".no-result", this.selectListBoxEle).length > 0) {
                return;
            }
        }
        var hasActive = false;
        var liEles = $("li", this.selectListBoxEle);
        for(var index = 0; index < liEles.length; index++) {
            if($(liEles[index]).hasClass("active") && index != liEles.length - 1) {
                $(liEles[index]).removeClass("active");
                $(liEles[index + 1]).addClass("active");
                hasActive = true;
                break;
            } else if($(liEles[index]).hasClass("active")) {
                hasActive = true;
            }
        }
        if(!hasActive) {
            $(liEles[0]).addClass("active");
        }
        this.moveScrollDown($("li.active", this.selectListBoxEle));
    },
    isExistInVal: function(val) {
       var inputVal = this.inputElement.val();
       if(val.indexOf("(") > -1) {
           val = val.substring(0, val.indexOf("("));
       }
       var inputVals = inputVal.split("，").length > 0 ? inputVal.split("，") : inputVal.split(",");
       var flag = false;
       for(var index = 0; index < inputVals.length; index++) {
           if(inputVals[index].indexOf("(") > -1) {
               inputVals[index] = inputVals[index].substring(0, inputVals[index].indexOf("("));
           }
           if(inputVals[index] == val) {
               flag = true;
               break;
           }
       }
       if(!flag) {
           return false;
       }
       return true;
    },
    setData: function(cacheData) {
        if(this.pagination && !this.isShowSelectWhenHidden) {
            return;
        }
        this.isPageLoaddingOpen = false;//打开分页加载开关
        if(!this.isSaveInputVal) {
            this.inputElement.val("");
        }
        this.allData = cacheData;
        if( cacheData.data && !cacheData.data.length ) {
            $(".loading").remove();
        }
        if(this.isInputClick) {
            this.clearSelectList();
            this.refresh();
            this.isInputClick = false;
        }
    },
    clearSelectList: function() {
        this.selectListBoxEle.html("");
    },
    getSigleDataByName: function(name) {
        if(!this.allData) {
            return {};
        }
        var data = this.allData.data;
        for(var index = 0; index < data.length; index++) {
            if(name == data[index][this.showTextField]) {
                return data[index];
            }
        }
        return {};
    },
    setVal: function(val, type) {
        var currentVal = this.inputElement.val();
        var activeEle = $(".active", this.selectListBoxEle);
        if(!val) {
            if(type != "noSearch") {
                var selectVal = activeEle.html();
                if(selectVal.indexOf(this.noResultText) > -1 || selectVal.indexOf("loading") > -1) {
                    selectVal = this.inputElement.val();
                }
                if(this.multipleSign && !this.isExistInVal(selectVal)) {
                    if($.trim(currentVal) && $.trim(currentVal).lastIndexOf("，") > -1 && $.trim(currentVal).lastIndexOf("，") == $.trim(currentVal).length - 1 || !$.trim(currentVal)) {
                        this.inputElement.val(currentVal + selectVal);
                    } else {
                        this.inputElement.val(currentVal + this.multipleSign + selectVal);
                    }
                    this.inputElement.currentVal = this.inputElement.val();
                } else if(!this.multipleSign) {
                    this.inputElement.val(selectVal);
                }
            }
        } else {
            if(this.multipleSign && !this.isExistInVal(val)) {
                if($.trim(currentVal) && $.trim(currentVal).lastIndexOf("，") > -1 && $.trim(currentVal).lastIndexOf("，") == $.trim(currentVal).length - 1 || !$.trim(currentVal)) {
                    this.inputElement.val(currentVal + val);
                } else {
                    this.inputElement.val(currentVal + this.multipleSign + val);
                }
                this.inputElement.currentVal = this.inputElement.val();
            } else if(!this.multipleSign) {
                this.inputElement.val(val);
            }
        }
        val = this.inputElement.val();
        if(this.multipleSign && this.multipleSign == ",") {
            val = val.replaceAll(",", "，");
            this.inputElement.val(val);
        }
        if(this.defaultText && val.indexOf(this.defaultText) > -1) {
            this.inputElement.val("");
            val = "";
        }
        for(var key in this.attrTextField) {
            this.attrTextId(activeEle.attr(key), val);
        }
        if(this.attrTextModel) {
            this.attrTextModel(val, this.data, this.getSigleDataByName(val), this);
        }
        this.hide();
    },
    getSearchCurrentList: function() {
        var self = this;
        if(!$.trim(this.searchBoxEle.val())) {
            return [];
        }
        var searchList = [];
        var data = this.allData.data;
        for(var index = 0; index < data.length; index++) {
            var isOk = false;
            var name = data[index][this.showTextField].toLowerCase();

            if(self.isNotUseFilter){

                searchList.push(data[index]);
            }else{
                if(this.closeLocalSearch){
                    searchList.push(data[index]);
                }else{
                    if(name.indexOf(($.trim(this.searchBoxEle.val())).toLowerCase()) > -1) {
                        searchList.push(data[index]);
                        isOk = true;
                    }
                    if(!isOk && this.isUsePinyin) {
                        var dataPinYin = pinyinUtil.getPinyin(data[index][this.showTextField]);
                        dataPinYin = dataPinYin.replace(/\s+/g, "");
                        if(dataPinYin.indexOf($.trim(this.searchBoxEle.val())) > -1) {
                            searchList.push(data[index]);
                        }
                    }
                }
            }
        }
        return searchList;
    },
    refresh: function() {
        var self = this;
        if(self.allData && !self.allData.data) {
            return;
        }
        self.build();
        self.updateData(self.allData);
    },
    open: function() {
        var self = this;
        self.searchBoxEle.val("");
        self.inputElement.focus();
        self.isInputClick = true;
        if(self.onSearchValueChange) {
            $(".search-condition-box", self.selectContainerEle).trigger("keyup");
        }
        if(self.allData && !self.allData.data) {
            return;
        }
        setTimeout(function() {
            self.setDefaultCount(self.DEFAULT_COUNT);
            self.build();
            self.updateData(self.allData);
        }, 100);
    },
    destroy: function() {
        var id = this.inputElement.attr("id");
        if(Select.sharePool[id]) {
            $(Select.sharePool[id].selectContainerEle).remove();
            delete Select.sharePool[id];
        }
    },
    showUpLoadding: function() {
        this.paginationScrollDirection = "up";
        var firstLiEle = $("li:eq(0)", this.selectListBoxEle);
        firstLiEle.css("border-top", "none");
        this.selectListBoxEle.addClass("top-cls");
        $("<div class='loading reset'><img src='../public/img/loading.gif' /></div>").insertBefore(this.selectListBoxEle);
        this.selectContainerEle.scrollTop(1);
    },
    showDownLoadding: function() {
        this.paginationScrollDirection = "down";
        $("<div class='loading bottom-cls'><img src='../public/img/loading.gif' /></div>").insertAfter(this.selectListBoxEle);
        this.selectContainerEle.scrollTop(this.selectContainerEle.scrollTop() + 34);
    },
    bindEvent: function() {
        var self = this;
        var isScroll = false;
        this.selectListBoxEle.delegate("li", "click", function() {
            isScroll = false;
            self.selectContainerEle.removeClass("select-list-hide");
            self.setVal();
        });
        this.selectContainerEle.on("scroll", function() {
            setTimeout(function() {
                self.isCanPaginationScroll = true;
            }, 100);
        });
        this.selectContainerEle.on("scroll", function() {
            var searchConditionContainerEle = $(".search-condition-container", self.selectContainerEle);
            var scrollTop = self.selectContainerEle.scrollTop();
            self.state = true;
            isScroll = true;
            self.selectContainerEle.addClass("select-list-hide");
            searchConditionContainerEle.css("top", scrollTop + "px");
            if(scrollTop == 0) {
                searchConditionContainerEle.css("border-bottom", "1px solid #ddd");
            } else {
                searchConditionContainerEle.css("border-bottom", "none");
            }
        });
        this.selectContainerEle.on("scroll", function() {
            if(!self.isCanPaginationScroll) {
                return;
            }
            self.isCanPaginationScroll = false;
            if(self.pagination) {
                setTimeout(function() {
                    self.isCanPaginationScroll = true;
                    var scrollTop = self.selectContainerEle.scrollTop();
                    var containerEle = self.selectContainerEle[0];
                    if (scrollTop == 0) {
                        if (self.currentPage != 1) {
                            if (!self.isPageLoaddingOpen) {
                                self.isInputClick = true;
                                self.isPageLoaddingOpen = true;
                                self.showUpLoadding();
                                self.currentPage--;
                                self.isShowSelectWhenHidden = true;
                                setTimeout(function() {
                                    if(!self.currentPage) { self.currentPage = 1; }
                                    self.onSearchValueChange(self, self.searchBoxEle.val(), self.currentPage);
                                }, 1500);
                            }
                        }
                    } else if (scrollTop + self.selectContainerEle.height() >= containerEle.scrollHeight) {
                        var dataCount = 0;
                        if (self.allData && self.allData.data && self.allData.data.length > 0) {
                            for(var index = 0; index < self.allData.data.length; index++) {
                                if($.trim(self.allData.data[index][self.showTextField])) {
                                    dataCount++;
                                }
                            }
                            if (!self.isPageLoaddingOpen && self.allData.pagination &&  self.currentPage < self.allData.pagination.totalPage) {
                                self.isInputClick = true;
                                self.isPageLoaddingOpen = true;
                                self.showDownLoadding();
                                self.currentPage++;
                                self.isShowSelectWhenHidden = true;
                                setTimeout(function() {
                                    if(!self.currentPage) { self.currentPage = 1; }
                                    self.onSearchValueChange(self, self.searchBoxEle.val(), self.currentPage);
                                }, 1500);
                            }
                        }
                    }
                }, 200);
            }
            // var scrollTop = self.selectContainerEle.scrollTop();
        });
        this.selectListBoxEle.on("blur", function() {
            self.state = false;
            isScroll = false;
            self.selectContainerEle.removeClass("select-list-hide");
        });
        this.inputElement.on("click", function() {
            self.isShowSelectWhenHidden = true;
            self.currentPage = 1;
            self.open();
        });
        if(this.inputElement.next().hasClass("icon-drop-down")) {
            this.inputElement.next().on("click", function() {
                self.open();
                self.inputElement.focus();
            });
        }
        $(".search-condition-box", self.selectContainerEle).on("focus", function() {
            self.state = true;
            isScroll = true;
            self.selectContainerEle.addClass("select-list-hide");
        });
        $(".search-condition-box", self.selectContainerEle).on("blur", function() {
            self.state = false;
            isScroll = false;
            setTimeout(function() {
                self.selectContainerEle.removeClass("select-list-hide");
            }, 500);

        });
        this.inputElement.on("focus", function() {
            self.inputElement.currentVal = self.inputElement.val();
        });
        this.inputElement.on("keyup", function(ev) {
            if(ev.keyCode == 13) {
                return;
            }
            if(self.multipleSign && ev.keyCode != 8) {
                self.inputElement.val(self.inputElement.currentVal);
            } else if(self.multipleSign) {
                var view = self.getView();
                var pos = view.getCursorPosition(self.inputElement);
                if(self.inputElement.currentVal.indexOf("，") > -1) {
                    var nameList = self.inputElement.currentVal.split("，");
                } else {
                    var nameList = self.inputElement.currentVal.split(",");
                }
                var endPos = 0;
                var startPos = 0;
                for(var index = 0; index < nameList.length; index++) {
                    endPos += nameList[index].length + 1;
                    startPos = endPos - nameList[index].length - 1;
                    if(pos >= startPos && pos <= endPos) {
                        nameList.splice(index, 1);
                        self.inputElement.currentVal = nameList.join("，");
                        // if(self.inputElement.currentVal.lastIndexOf("，") != self.inputElement.currentVal.length - 1) {
                        //     self.inputElement.currentVal += "，";
                        // }
                        self.inputElement.val(self.inputElement.currentVal);
                        self.attrTextModel(self.inputElement.currentVal, self.data, self.getSigleDataByName(self.inputElement.currentVal), self);
                        setTimeout(function() {
                            view.setCursorPosition(self.inputElement, startPos);
                        }, 100);
                        break;
                    }
                }
            }
        });

        var timeout = 0;
        $(".search-condition-box", self.selectContainerEle).on("keyup", function(ev) {
            self.isShowSelectWhenHidden = true;
            timeout = setTimeout(function() {
                self.currentPage = 1;
                if(self.searchBoxEle.val().length > self.limitSearchLength) {
                    self.searchBoxEle.val(self.searchBoxEle.val().substring(0, self.limitSearchLength));
                }
                if(self.onSearchValueChange) {
                    self.isInputClick = true;
                    self.onSearchValueChange(self, $.trim(self.searchBoxEle.val()));
                }
                if(self.closeLocalSearch) {
                    self.isInputClick = true;
                    return;
                }
                if(ev.keyCode == 8 && !$.trim(self.searchBoxEle.val())) {
                    self.setDefaultCount(self.DEFAULT_COUNT);
                    self.build();
                    self.updateData(self.allData);
                    return;
                }
                if(ev.keyCode == 38 || ev.keyCode == 40 || ev.keyCode == 13) {
                    return;
                }
                if(self.allData) {
                    if($.trim(self.searchBoxEle.val())) {
                        var searchList = self.getSearchCurrentList();
                        self.setDefaultCount(searchList.length);
                        self.updateData({
                            data: searchList
                        });
                    } else {
                        self.setDefaultCount(self.DEFAULT_COUNT);
                        self.build();
                        self.updateData(self.allData);
                    }
                }

            },100);

        });
        this.selectListBoxEle.delegate("li", "mouseenter", function() {
            if(self.isSearch) {
                if ($(".no-result", self.selectListBoxEle).length > 0) {
                    return;
                }
            }
            $("li", self.selectListBoxEle).removeClass("active");
            $(this).addClass("active");
        });
        this.inputElement.on("blur", function(ev) {
            if(isScroll) {
                self.selectContainerEle.removeClass("select-list-hide");
                isScroll = false;
            }
            // var attachEle = $(this);
            if(self.isSearch) {
                setTimeout(function() {
                    //self.clearActiveCls();
                    //self.setVal(attachEle.val(), "noSearch");
                    self.hide();
                }, 500);
            } else {
                //self.setVal();
                setTimeout(function() {
                    self.hide();
                }, 500);
            }
        });
        $(window).resize(function() {
            self.selectContainerEle.width(self.inputElement.outerWidth() - 2);
            self.selectContainerEle.offset({
                left: self.inputElement.offset().left,
                top: self.selectContainerEle.offset().top
            });
        });
        $(document).on("keydown", function(ev) {
            if(ev.keyCode == 38) {
                /* if(self.state) {
                    //self.moveSelectedUp();
                } */
                return false;
            } else if(ev.keyCode == 40) {
                /* if(self.state) {
                    //self.moveSelectedDown();
                } */
                return false;
            } else if(ev.keyCode == 13) {
                var display = self.selectContainerEle.css("display");
                if(!display || display == "none") {
                    return;
                }
                if(self.isSearch) {
                    if ($(".no-result", self.selectListBoxEle).length > 0) {
                        return;
                    }
                }
                if(isScroll || self.state) {
                    var liEles = $("li", self.selectListBoxEle);
                    if(liEles.hasClass("active")) {
                        self.setVal();
                    } else {
                        var selectVal = $(liEles[0]).html();
                        if(selectVal.indexOf(this.noResultText) > -1 || selectVal.indexOf("loading") > -1) {
                            self.setVal();
                        } else {
                            self.setVal(selectVal);
                        }
                    }
                    self.selectContainerEle.removeClass("select-list-hide");
                    isScroll = false;
                }
                return false;
            }
            return;
        });
    },
    loadHtml: function() {
        if(!Select.html) {
            Select.html = $.ajax({
                url: "public/widget/select/select.html",
                type: "GET",
                dataType: "html",
                async: false
            }).responseText;
            return Select.html;
        }
        return Select.html;
    },
    getData: function(callback) {
        if(this.data) {
            callback(this.data);
        } else {
            $.ajax({
                url: this.url,
                type: "GET",
                datatype: "json",
                success: function(data) {
                    callback(data);
                },
                error: function(e) {
                    callback({});
                }
            });
        }
    },
    setDefaultActive: function() {
        var self = this;
        var defaultVal = this.inputElement.val();
        var liEles = $("li", this.selectListBoxEle);
        var isHas = false;
        if($.trim(defaultVal) != "") {
            for(var index = 0; index < liEles.length; index++) {
                if($(liEles[index]).html() == defaultVal) {
                    $(liEles[index]).addClass("active");
                    isHas = true;
                    setTimeout(function() {
                        self.selectContainerEle.scrollTop($(liEles[index]).outerHeight() * index);
                    }, 10);
                    break;
                }
            }
            if(!isHas) {
                $(liEles[0]).addClass("active");
            }
        } else {
            $(liEles[0]).addClass("active");
        }
    },
    hide: function() {
        this.selectContainerEle.css("display", "none");
        this.isShowSelectWhenHidden = false;
        this.state = false;
        this.isInputClick = false;
        // if(this.pagination) {//如果是需要分页显示的
        //
        // }
    },
    display: function() {
        this.selectContainerEle.css("display", "block");
        this.state = true;
    },
    showNoResult: function(noResultContent) {
        $("li", this.selectContainerEle).html(noResultContent);
    },
    show: function(data, selectListBoxEle) {
        var self = this;
        var isDataLessDefault = false;
        this.isInputClick = false;
        self.isCanPaginationScroll = false;
        this.isPageLoaddingOpen = false;//每次显示完成后重置开关
        $(".top-cls").removeClass("top-cls");
        $(".loading").remove();
        if(this.onBeforeShow) {
           this.onBeforeShow(this);
        }
        if(!data.data) {
            return;
        }
        var isSetDefault = true;
        self.selectContainerEle.outerWidth(this.inputElement.outerWidth());
        var inputOffset = this.inputElement.offset();
        var inputX = inputOffset.left;
        var inputY = inputOffset.top;
        if(!this.isHasListBoxEle) {
            this.inputElement.parent().append(self.selectContainerEle);
            this.isHasListBoxEle = true;
        }
        self.selectContainerEle.css({
            "min-height": this.minHeight + "px",
            "max-height": this.maxHeight + "px"
        });
        if(this.height) {
            self.selectContainerEle.css({
                "height": this.height + "px"
            });
        }
        var itemArray = data.data;
        if(this.isSearch) {
            this.searchBoxEle.attr("placeholder", this.searchPlaceHoder);
            if (itemArray.length == 0) {
                isSetDefault = false;
                var obj = {};
                if($.trim(this.searchBoxEle.val()) != "") {
                    obj[this.showTextField] = "<span style='color:#e7e7e7'>loading...</span>";
                    if(isShowNoResult) {
                        isShowNoResult = false;
                        setTimeout(function() {
                            if($("li", self.selectContainerEle).length == 1 && $.trim($("li span:eq(0)", self.selectContainerEle).html()) == "loading...") {
                                //obj[self.showTextField] = "<div style='color:red;text-align:left' class='no-result'>" + self.noResultText + "</div>";
                                self.showNoResult("<div style='color:red;text-align:left' class='no-result'>" + self.noResultText + "</div>");
                            }
                            isShowNoResult = true;
                        }, 2000);
                    }
                } else {
                    obj[this.showTextField] = "";
                    this.hide();
                }
                itemArray.push(obj);
            } else if(this.defaultText && itemArray && itemArray[0] && itemArray[0][this.showTextField] != this.defaultText && !$.trim(this.searchBoxEle.val())) {
                var obj = {};
                obj[this.showTextField] = this.defaultText;
                itemArray.unshift(obj);
            }
        } else {
            if(this.defaultText && itemArray && itemArray[0] && itemArray[0][this.showTextField] != this.defaultText) {
                var obj = {};
                obj[this.showTextField] = this.defaultText;
                itemArray.unshift(obj);
            }
        }
        if(this.pagination) {//如果是需要分页显示的
            if(!this.defaultCount) {
                this.defaultCount = 10;
            }
            if(itemArray.length < this.defaultCount) {
                isDataLessDefault = true;
                self.paginationScrollDirection = "up";
                for(var index = itemArray.length; index < this.defaultCount; index++) {
                    itemArray[index] = {};
                    itemArray[index]["none"] = true;
                    itemArray[index][this.showTextField] = "";
                }
            }
        }
        for(var index = 0; index < itemArray.length; index++) {
            var itemEle;
            if(!itemArray[index]["none"]) {
                itemEle = $("<li></li>");
            } else {
                itemEle = $("<div class='no-border'></div>");
            }
            itemEle.html(itemArray[index][this.showTextField]);
            for(var key in this.attrTextField) {
                itemEle.attr(key, itemArray[index][this.attrTextField[key]]);
            }
            selectListBoxEle.append(itemEle);
            if(this.defaultCount && index + 1 > this.defaultCount) {
                break;
            }
        }
        var browerBottom = $(window).scrollTop() + $(window).height();
        var selectBottom = inputY + this.inputElement.outerHeight() + self.selectContainerEle.outerHeight();
        if(this.direction == 'up'){
            self.selectContainerEle.offset({//下拉在上面的位置
                left: inputX,
                top: inputY - self.selectContainerEle.outerHeight()
            });
        }else if(selectBottom - browerBottom < -this.offset) {
            //改变下拉的位置
            self.selectContainerEle.offset({//下拉在下面的位置
                left: inputX,
                top: inputY + this.inputElement.height()
            });
        } else {
            //改变下拉的位置
            self.selectContainerEle.offset({//下拉在上面的位置
                left: inputX,
                top: inputY - self.selectContainerEle.outerHeight()
            });
        }
        this.state = true;
        if(isSetDefault) {
            self.setDefaultActive();
        }
        if(self.isSearch) {
            if(!isShowConditionSearchText) {
                isShowConditionSearchText = true;
                $(".search-condition-container", self.selectContainerEle).removeClass("select-hidden");
                $(".search-condition-container", self.selectContainerEle).css({
                    "width": self.selectListBoxEle.width() + "px",
                    "top": "0"
                });
                $(".search-condition-box", self.selectContainerEle).css({
                    "width": self.selectListBoxEle.width() + "px"
                });

                self.selectListBoxEle.css("margin-top", "30px");
                isShowConditionSearchText = false;
            }
        }
        if(self.pagination) {
            setTimeout(function() {
                if(self.paginationScrollDirection == "down") {
                    self.selectContainerEle.scrollTop(self.selectContainerEle.scrollTop() - 1);
                } else {
                    if(isDataLessDefault) {
                        self.selectContainerEle.scrollTop(1);
                    }
                }
            }, 100);
        }
    },
    showError: function() {
        this.selectContainerEle.css("display", "block");
        this.state = true;
        this.selectListBoxEle.html("");
        this.show({
            data: []
        }, this.selectListBoxEle);
    },
    build: function() {
        var self = this;
        this.getData(function(data) {
            if(!self.selectContainerEle) {
                self.selectContainerEle = $(self.loadHtml());
                self.selectListBoxEle = $(".select-list-box", self.selectContainerEle);
                self.searchBoxEle = $(".search-condition-box", self.selectContainerEle);
                self.bindEvent();
            }
            if(self.inputElement.length > 0) {
                var display = self.selectContainerEle.css("display");
                if(display == "none") {
                    self.selectListBoxEle.html("");
                    self.show(data, self.selectListBoxEle);
                    if (self.state) {
                        self.selectContainerEle.css("display", "block");
                    } else {
                        self.selectContainerEle.css("display", "none");
                    }
                }
            }
        });
    },
    clearData: function() {
        this.allData = [];
        this.inputElement.val("");
        this.selectListBoxEle.html("");
    },
    updateData: function() {
        var url,
            data,
            self = this;
        for(var index = 0; index < arguments.length; index++) {
            if(typeof arguments[index] == "object") {
                data = arguments[index];
            } else if(typeof arguments[index] == "string") {
                url = arguments[index];
            }
        }
        if(url) {
            this.url = url;
        } else {
            this.data = data;
        }
        this.getData(function(data) {
            self.selectListBoxEle.html("");
            self.show(data, self.selectListBoxEle);
        });
    }
};
Select.sharePool = {};//使用享元模式
function selectFactory(option) {
    if(Select.sharePool[option.id] && !option.isCreateNewSelect) {
        if(Select.sharePool[option.id].state) {
            Select.sharePool[option.id].state = false;
        } else {
            Select.sharePool[option.id].state = true;
        }
        return Select.sharePool[option.id];
    } else {
        Select.sharePool[option.id] = new Select(option);
        Select.sharePool[option.id].state = true;
        Select.sharePool[option.id].build();
        return Select.sharePool[option.id];
    }
}
