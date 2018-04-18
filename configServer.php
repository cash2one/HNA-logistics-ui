<!DOCTYPE html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="stylesheet" href="public/lib/bootstrap.min.css">
        <script src="public/lib/angular-min.js"></script>
        <script src="public/lib/jquery.js"></script>
    </head>
    <style>
        .navbar-inverse {
            background-color: #6f5499;
            border-color: #fff;
        }
        .navbar-inverse .navbar-nav>.active>a, .navbar-inverse .navbar-nav>.active>a:hover, .navbar-inverse .navbar-nav>.active>a:focus {
            color: #fff;
            background-color: transparent;
        }
        table {
            border-bottom:1px solid #ddd;
        }
        table th {
            text-align:center;
        }table td {
            text-align:center;
            font-size:12px;
        }
        .add-app {
            color:#FFCF00!important;
        }
        .input-text {
            width:200px;
            border:none;
            text-align:center;
            outline:none;
        }
        .btn-xs {
            outline:none;
        }
        .navbar-nav li:hover {
            background-color:#FFF;
        }
        .navbar-nav li:hover a {
            color:#3E8CB5!important;
        }
        .navbar-nav a:hover .host-layer {
            visibility:visible!important;
            border:1px solid #ddd;

        }
        .host-layer {
            position: absolute;
            width: 265px;
            height: 150px;
            background-color: #FFF;
            left: 0px;
            border: 1px solid #ddd;
            top: 50px;
            border-top: none!important;
        }
        .host-layer p {
            color:#999;
            font-size:12px;
            margin-top:15px;
            padding-left:15px;
        }
        .host-layer p span {
            padding-right:20px;
        }
        .host-layer p input[type=text] {
            width:180px;
            color:#999;
            outline:none;
        }
        .lang-server {
            float: right;
            clear: both;
            color: #FFF;
            font-size: 18px;
            margin-top: 12px;
            text-decoration:none!important;
        }
        .lang-server:hover {
            color:#FFF;
        }
    </style>
    <?php
        $appName = $_GET["key"];
        $operatorType = $_POST["type"];
        if(isset($operatorType) && $operatorType == "update") {
            $interfaces = json_decode($_POST["interfaces"]);
            $interfaces = json_encode($interfaces, JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);
            $interfaces = str_replace("\\/", "/", $interfaces);
            file_put_contents("public/common/interface.js", "window.Interface=" . $interfaces, LOCK_EX);
            return;
        }
        $interfacePath = "public/common/interface.js";
        $interfaceContent = file_get_contents($interfacePath);
        $indexEq = strpos($interfaceContent, '=');
        $interArray = substr($interfaceContent,$indexEq+1);
        $interJson = $interArray;
        $interArray = json_decode($interArray, true);
        if(!isset($appName)) {
            foreach($interArray as $key=>$val) {
                $appName = $key;
                break;
            }
        }
    ?>
    <body ng-app="config-server" ng-controller="api">
        <input type="hidden" value='<?php echo $interJson;?>' id="inter-json"/>
        <input type="hidden" value='<?php echo $appName;?>' id="app-name"/>
        <div class="navbar navbar-inverse" role="navigation">
          <div class="container">
             <a href="langServer.php" class="lang-server">LangServer</a>
            <div class="navbar-header">
              <a class="navbar-brand" href="#">API Config Server</a>
            </div>
            <div id="navbar" class="collapse navbar-collapse">
              <ul class="nav navbar-nav">
                 <?php foreach($interArray as $key=>$val) {?>
                    <li <?php if($key == $appName) {echo "class='active'";}?>>
                        <a data-url="configServer.php?key=<?php echo $key;?>" class="menu-item" href="javascript:void(0)">
                            <?php echo $key;?>
                            <?php if($key == $appName) {?>
                                <div class="host-layer" style="visibility:hidden" ng-init="title='<?php echo $val['title'];?>';host='<?php echo $val["host"];?>'">
                                    <p>
                                        <span>标题:</span><input type="text" value="" ng-model="title"/>
                                    </p>
                                    <p>
                                        <span>域名:</span><input value="" type="text" ng-model="host"/>
                                    </p>
                                    <p>
                                        <input type="button" class="btn-sm btn-success" value="保存" ng-click="saveHost()"/>
                                    </p>
                                </div>
                            <?php }?>
                        </a>
                    </li>
                 <?php } ?>
                 <!--<li><a href="configServer.php?key=addApp" class="add-app">添加应用</a></li>-->
              </ul>
            </div>
          </div>
        </div>
        <div class="container">
            <table class="table">
                <thead>
                    <th>接口名称</th>
                    <th>接口ID</th>
                    <th>访问URL</th>
                    <th>参数描述</th>
                    <th>操作</th>
                </thead>
                <tr ng-repeat="interface in interfaces">
                    <td><input class="input-text" type="text" value="{{interface.name}}" ng-model="interface.name"/></td>
                    <td><input class="input-text" type="text" value="{{interface.id}}" ng-model="interface.id"/></td>
                    <td><input style="width:320px" class="input-text" type="text" value="{{interface.url}}" ng-model="interface.url"/></td>
                    <td><textArea style="border:1px solid #ddd;text-align:left;height:50px;resize:none" class="input-text" value="{{interface.desc}}" ng-model="interface.desc"></textArea></td>
                    <td>
                        <input type="button" class="btn-xs btn-success" value="保存" ng-click="save()">
                        <input type="button" class="btn-xs btn-warning" value="删除" ng-click="delete($index)">
                        <input type="button" class="btn-xs btn-info" value="增加" ng-click="add($index)">
                    </td>
                </tr>
            </table>
        </div>
        <script>
            var app = angular.module('config-server', []);
            app.controller('api', function($scope) {
                var appName = $("#app-name").val();
                var interfaceJson = $("#inter-json").val();
                var interfaces = JSON.parse(interfaceJson)[appName].interfaces;
                if(interfaces && interfaces.length == 0) {
                    $scope.interfaces.push({
                        "name": "",
                        "id": "",
                        "url": "",
                        "desc": ""
                    });
                }
                function update(json) {
                    $.ajax({
                        "type": "POST",
                        "url": "configServer.php",
                        "dataType": "text",
                        "data": {
                            "type": "update",
                            "interfaces": JSON.stringify(json)
                        },
                        success: function() {
                            alert("更新成功");
                        }
                    });
                }
                $scope.interfaces = interfaces;
                $scope.save = function() {
                    var json = JSON.parse(interfaceJson);
                    for(var index = 0; index < $scope.interfaces.length; index++) {
                        delete $scope.interfaces[index]["$$hashKey"];
                    }
                    json[appName].interfaces = $scope.interfaces;
                    update(json);
                }
                $scope.delete = function(apiIndex) {
                    if(window.confirm("是否确认删除!")) {
                        for(var index = 0; index < $scope.interfaces.length; index++) {
                            if(index == apiIndex) {
                                $scope.interfaces.splice(index, 1);
                                if($scope.interfaces.length == 0) {
                                    $scope.interfaces.push({
                                        "name": "",
                                        "id": "",
                                        "url": "",
                                        "desc": ""
                                    });
                                }
                                break;
                            }
                        }
                        var json = JSON.parse(interfaceJson);
                        for(var index = 0; index < $scope.interfaces.length; index++) {
                            delete $scope.interfaces[index]["$$hashKey"];
                        }
                        json[appName].interfaces = $scope.interfaces;
                        update(json);
                    }
                }
                $scope.add = function(apiIndex) {
                    for(var index = 0; index < $scope.interfaces.length; index++) {
                            if(index == apiIndex) {
                                $scope.interfaces.splice(index + 1, 0, {
                                    "name": "",
                                    "id": "",
                                    "url": "",
                                    "desc": ""
                                });
                                break;
                            }
                    }
                }
                $scope.saveHost = function() {
                   var json = JSON.parse(interfaceJson);
                   for(var index = 0; index < $scope.interfaces.length; index++) {
                       delete $scope.interfaces[index]["$$hashKey"];
                   }
                   json[appName]["title"] = $scope.title;
                   json[appName]["host"] = $scope.host;
                   json[appName].interfaces = $scope.interfaces;
                   update(json);
                }
            });
            $(".menu-item").on("click", function(e) {
                if(e.target == this) {
                    window.location.href = $(this).attr("data-url");
                }
            });
        </script>
    </body>
</html>