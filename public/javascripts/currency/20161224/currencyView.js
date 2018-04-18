app.factory('currencyView', [function() {
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
    }
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
    }
    return currencyView;
}]);