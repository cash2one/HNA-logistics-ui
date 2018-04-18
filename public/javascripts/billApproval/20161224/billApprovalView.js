app.factory('billApprovalView', [function() {
    var billApprovalView = {};

    billApprovalView.getDate = function(){
        var time = new Date();
        return [time.getFullYear(),time.getMonth() + 1,time.getDate()].map(function(item){ return formate(item)}).join("-")
            + ' '
            + [time.getHours(),time.getMinutes(),time.getSeconds()].map(function(item){ return formate(item)}).join(":");
    }

    billApprovalView.getLastMonth = function(){
        var date = billApprovalView.getDate().split(" ")[0].split('-'), start, end;
        if(date[1] == 1){
            date[0] = date[0] - 1;
            date[1] = 12;
        }else{
            date[1] = date[1] - 1;
        }

        date[2] = 1;
        date[1] = formate(date[1]);
        date[2] = formate(date[2]);
        start = date.join("-");

        date[2] = (new Date(date[0], date[1],0)).getDate();

        end = date.join("-");

        return {
            'start' : start + [' 00','00','00'].join(':'),
            'end' : end + [' 23','59','59'].join(':')
        }
    }

    function formate(number){
        if(number < 10) number = '0' + number;
        return number;
    }

    return billApprovalView;
}]);