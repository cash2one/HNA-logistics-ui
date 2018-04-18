app.factory('customerMessageDetailView', [function() {
    var customerMessageDetailView = {};
    
    customerMessageDetailView.summitMsg = function (msg) {

        $('#messageList').append('<div class="message me">'+
            '<div class="test">' +
                '<img class="avatar" src='+msg.pic +'>' +
                '<div class="custom-name" title='+msg.refReplyerFullName +'>' +msg.name+'</div>'+
             '</div>'+

            '<div class="content">'+
            '<div class="nickname"><span class="time">'+msg.time+'</span></div>'+
            '<div class="bubble bubble_primary right">'+
            '<div class="bubble_cont">'+
            '<div class="plain">'+
            '<pre>'+msg.content+'</pre>'+
            '</div>'+
            '</div>'+
            '</div>'+
            '</div>'+
            '</div>')

        var div = document.getElementById('messageList');  //滚动到底部
        div.scrollTop = div.scrollHeight;
        
    }



    customerMessageDetailView.insertCustomerDialogPre = function (msg) {
        $('#messageList').prepend('<div class="message">'+
            '<img class="avatar" src='+msg.avatarFilePath +'>' +
            '<div class="content">'+
            '<div class="nickname"><span class="time">'+msg.createTime+'</span></div>'+
            '<div class="bubble bubble_primary left">'+
            '<div class="bubble_cont">'+
            '<div class="plain">'+
            '<pre>'+msg.messageBody+'</pre>'+
            '</div>'+
            '</div>'+
            '</div>'+
            '</div>'+
            '</div>')
    }



    customerMessageDetailView.insertServiceDialogPre = function (msg) {
        $('#messageList').prepend('<div class="message me">'+
            '<div class="test">' +
                '<img class="avatar" src='+msg.avatarFilePath +'>' +
                '<div class="custom-name" title='+msg.refReplyerFullName +'>' +msg.name+'</div>'+
            '</div>'+
            '<div class="content">'+
            '<div class="nickname"><span class="time">'+msg.createTime+'</span></div>'+
            '<div class="bubble bubble_primary right">'+
            '<div class="bubble_cont">'+
            '<div class="plain">'+
            '<pre>'+msg.messageBody+'</pre>'+
            '</div>'+
            '</div>'+
            '</div>'+
            '</div>'+
            '</div>')
    }

    return customerMessageDetailView;
}]);