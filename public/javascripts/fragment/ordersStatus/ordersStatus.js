ordersStatusDataHandle = {
    setStatus: function (data, orderStatus) {
        var statusMenu = {
            "DRAFT": "./public/img/icon-draft.svg",
            "COMMITED": "./public/img/icon-submitted.svg",
            "ACCEPT": "./public/img/icon-examine.svg",
            "RECEGOOD": "./public/img/icon-solicitation.svg",
            "TRANSPORT": "./public/img/icon-transport.svg",
            "DISPACTCHING": "./public/img/icon-delivery.svg",
            "RECEIVED": "./public/img/icon-receive.svg"
        };
        var statusList = ["DRAFT", "COMMITED", "ACCEPT", "RECEGOOD", "TRANSPORT", "DISPACTCHING", "RECEIVED"];
        var tempData = [];
        var index = statusList.indexOf(orderStatus);
        for (var s = 0, len = data.length; s < len; s++) {
            if (s <= index) {
                tempData.push({
                    'statusColor': "statusColor",
                    'svgUrl': statusMenu[data[s].code].replace(".svg", "-s.svg"),
                    'txt': data[s].name
                })
            } else {
                tempData.push({
                    'statusColor': '',
                    'svgUrl': statusMenu[data[s].code],
                    'txt': data[s].name
                })
            }
        }
        return tempData;
    },
    setTransInfo: function (res) {
        var orders = [];
        for (var s in res) {
            var temp = {};
            for (var k = 0, len = res[s].length; k < len; k++) {
                var key = res[s][k]['messageTime'].split(" ")[0];
                var value = res[s][k]['messageTime'].split(" ")[1] + "    " + res[s][k]['trackMessage'];
                temp[key] = (temp[key] || []).concat(value);
            }
            var tA = [];
            for (var a in temp) {
                tA.push({
                    date: a,
                    detail: temp[a]
                })
            }
            orders.push({
                subOrderNum: s,
                item: tA
            })
        }
        return orders;
    },
    countObjLength: function (obj) {    // 计算对象长度
        var size = 0, key;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) {
                ++size;
            }
        }
        return size;
    }
};
