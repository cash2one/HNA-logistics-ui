<?php
    $operType = $_POST["operType"];
    if(isset($operType) && $operType == "translate") {
        $from = $_POST["form"];
        $to = $_POST["to"];
        $query = $_POST["query"];
        $transtype = $_POST["transtype"];
        $simple_means_flag = $_POST["simple_means_flag"];
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, "http://fanyi.baidu.com/v2transapi");
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, "from=$from&to=$to&query=$query&transtype=$transtype&simple_means_flag=$simple_means_flag");
        curl_setopt($ch,CURLOPT_RETURNTRANSFER,1);
        curl_setopt($ch,CURLOPT_HEADER,0);
        $result = curl_exec($ch);
        curl_close($ch);
        echo $result;
        return;
    }
    if(isset($operType) && $operType == "import") {
        $savePath = $_POST["savePath"];
        $current_dir = opendir($savePath);
        $fileArray = array();
        while(($file = readdir($current_dir)) !== false) {
            if(strpos($file, ".lang") > -1) {
                $fileArray[] = json_decode(file_get_contents($savePath . "/" . $file), true);
            }
        }
        $maxLength = 0;
        $maxIndex = 0;
        for($index = 0; $index < count($fileArray); $index++) {
            if(count($fileArray[$index]) > $maxLength) {
                $maxLength = count($fileArray[$index]);
                $maxIndex = $index;
            }
        }
        echo json_encode($fileArray[$maxIndex]);
        return;
    }
?>
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
            text-align:left;
        }table td {
            text-align:left;
            font-size:12px;
        }
        .add-app {
            color:#FFCF00!important;
        }
        .input-text {
            width:300px;
            border:none;
            text-align:left;
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
        .config-server {
            float: right;
            clear: both;
            color: #FFF;
            font-size: 18px;
            margin-top: 12px;
            text-decoration:none!important;
        }
        .config-server:hover {
            color:#fff;
        }
        .lang-list {
            width:200px;
            height:20px;
            margin-top:16px;
        }
        .tab-list a {
            display:inline-block;
            width:60px;
            height:25px;
            line-height:25px;
            margin-right: 15px;
            background-color:#EFEFEF;
            text-align:center;
            color:#1B74CA;
            text-decoration:none;
        }
        .tab-list a.active {
            background-color:#ff6600;
            color:#fff;
        }
        .btn-success, .btn-primary {
            border:1px solid #fff;
            border-radius:3px;
            height:25px;
            font-size:13px;
            line-height:13px;
            cursor:pointer;
            background-color:#286090!important;
            color:#FFF!important;
            padding-right:2px;
            padding-left:2px;
            display:inline-block;
            vertical-align:middle;
        }
        </style>
        <?php
            if(isset($operType) && $operType == "update") {
                $langTxt = $_POST["langTxt"];
                $savePath = $_POST["savePath"];
                $langTxt = json_decode($langTxt);
                $langTxt = json_encode($langTxt, JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);
                $langTxt = str_replace("\\/", "/", $langTxt);
                file_put_contents($savePath, $langTxt, LOCK_EX);
                return;
            }
            $selectPath = $_GET["path"];
            $langType = $_GET["langType"];
            function getlangPageList() {
                $langList = array();
                $paths = array("languages", "public/widget");
                for($index = 0; $index < count($paths); $index++) {
                    $path = $paths[$index];
                    $current_dir = opendir($path);
                    while(($file = readdir($current_dir)) !== false) {
                        $sub_dir = $path . DIRECTORY_SEPARATOR . $file;
                        if($file == '.' || $file == '..') {
                            continue;
                        } else if(is_dir($sub_dir)) {
                            $langList[$file] = $sub_dir;
                        }
                    }
                }
                return $langList;
            }
            $langList = getlangPageList();
            if(!isset($selectPath)) {
                foreach($langList as $key=>$val) {
                    $selectPath = $langList[$key];
                    break;
                }
            }
            function getLangTypeList($selectPath) {
                $langTypeList = array();
                $current_dir = opendir($selectPath);
                while(($file = readdir($current_dir)) !== false) {
                   $fileName = basename($file, ".lang");
                   if(strpos($file, ".lang") > -1) {
                        $langTypeList[$fileName] = $selectPath.$file;
                   }
                }
                return $langTypeList;
            }
            $langTypeList = getLangTypeList($selectPath);
            if(!isset($langType)) {
                foreach($langTypeList as $key=>$val) {
                    $langType = $key;
                    break;
                }
            }
            function getLangContent($path, $langType) {
                return file_get_contents($path . "/$langType" . ".lang");
            }
            $langContent = getLangContent($selectPath, $langType);
       ?>
    <body ng-app="lang-server" ng-controller="lang">
        <input type="hidden" id="langContent" value='<?php echo $langContent;?>'/>
        <input type="hidden" id="path" value=<?php echo $selectPath . "/$langType" . ".lang";?>>
        <div class="navbar navbar-inverse" role="navigation">
                  <div class="container">
                     <a href="configServer.php" class="config-server">configServer</a>
                    <div class="navbar-header">
                      <a class="navbar-brand" href="#">LANG Config Server</a>
                    </div>
                    <div id="navbar" class="collapse navbar-collapse">
                        <select class="lang-list">
                            <?php
                                foreach($langList as $key=>$val) {
                            ?>
                            <option value="<?php echo $val;?>" <?php if($val == $selectPath) {echo "selected";}?>>
                                <?php
                                    if(strpos($val, "widget") > -1) {
                                        echo "widget--" . $key;
                                    } else {
                                        echo "page--" . $key;
                                    }
                                ?>
                            </option>
                            <?php }?>
                        </select>
                    </div>
                  </div>
                </div>
                <div class="container">
                    <div class="tab-list">
                        <?php
                            foreach($langTypeList as $key=>$val) {
                        ?>
                           <a href="langServer.php?path=<?php echo $selectPath;?>&langType=<?php echo $key;?>" class="<?php if($key == $langType) {echo "active";}?>"><?php echo $key;?></a>
                        <?php }?>
                        <input type="button" class="btn-success" value="一键导入" ng-click="importData()"/>
                        <span style="padding-left:30px">源语种:</span>
                        <select style="width:100px" id="src">
                            <option value="zh">中文简体</option>
                            <option value="cht">中文繁文</option>
                            <option value="en">英语</option>
                        </select>　
                        <span>目标语种:</span>
                        <select style="width:100px" id="dist">
                            <option value="zh">中文简体</option>
                            <option value="cht" selected>中文繁文</option>
                            <option value="en">英语</option>
                        </select>　
                        <a class="btn-primary" value="一键翻译" ng-click="tranlateData()"/>一键翻译</a>
                    </div>
                    <table class="table" style="margin-top:20px">
                            <thead>
                                <th>key</th>
                                <th>value</th>
                                <th>操作</th>
                            </thead>
                            <tr ng-repeat="lang in newLangArray">
                                <td><input type="text" class="input-text" val="{{lang.key}}" ng-model="lang.key"></td>
                                <td><input type="text" class="input-text" val="{{lang.val}}" ng-model="lang.val"></td>
                                <td>
                                    <input type="button" class="btn-xs btn-success" style="background-color:green!important;font-size:12px;padding:2px 5px" value="保存" ng-click="save()">
                                    <input type="button" class="btn-xs btn-warning" value="删除" ng-click="delete($index)">
                                    <input type="button" class="btn-xs btn-info" value="增加" ng-click="add($index)">
                                </td>
                            </tr>
                   </table>
                </div>
        </div>
        <script>
            var app = angular.module('lang-server', []);
            app.controller('lang', function($scope) {
               var langJson = JSON.parse($("#langContent").val());
               var newLangArray = [];
               for(var key in langJson) {
                    newLangArray.push({
                        "key": key,
                        "val": langJson[key]
                    });
               }
               $scope.newLangArray = newLangArray;
               if($scope.newLangArray.length == 0) {
                    $scope.newLangArray.push({
                        "key":"",
                        "val":""
                    });
               }
               function update(json) {
                    $.ajax({
                        "type": "POST",
                        "url": "langServer.php",
                        "dataType": "text",
                        "data": {
                            "operType": "update",
                            "langTxt": JSON.stringify(json),
                            "savePath": $("#path").val()
                        },
                        success: function() {
                            alert("更新成功");
                        }
                    });
               }
               $scope.save = function() {
                   var json = {};
                   for(var index = 0; index < $scope.newLangArray.length; index++) {
                       var key = $scope.newLangArray[index]["key"];
                       var value = $scope.newLangArray[index]["val"];
                       if($.trim(key) != "") {
                          json[key] = value;
                       }
                   }
                   update(json);
               }
               $scope.delete = function(index) {
                    if(window.confirm("是否确认删除!")) {
                        for(var i = 0; i < $scope.newLangArray.length; i++) {
                            if(i == index) {
                                 $scope.newLangArray.splice(index, 1);
                                 if($scope.newLangArray.length == 0) {
                                       $scope.newLangArray.push({
                                          "key": "",
                                          "val": ""
                                       });
                                 }
                            }
                        }
                    }
                    $scope.save();
               }
               $scope.add = function(langIndex) {
                    for(var index = 0; index < $scope.newLangArray.length; index++) {
                            if(index == langIndex) {
                                $scope.newLangArray.splice(index + 1, 0, {
                                    "key": "",
                                    "val": "",
                                });
                                break;
                            }
                    }
               }
               $scope.importData = function() {
                   var path = $("#path").val();
                   path = path.substring(0, path.lastIndexOf("/"));
                   $.ajax({
                      type: "POST",
                      url: "langServer.php",
                      data: {
                        "operType": "import",
                        "savePath": path
                      },
                      dataType:"text",
                      success: function(data) {
                          data = JSON.parse(data);
                          var langContent = JSON.parse($("#langContent").val());
                          if($scope.newLangArray.length == 1) {
                             $scope.newLangArray.length = 0;
                          }
                          for(langName in data) {
                             if(!langContent[langName]) {
                                $scope.newLangArray.push({
                                   "key": langName,
                                   "val": data[langName]
                                });
                             }
                          }
                          $scope.$apply();
                      }
                   });
               }
               $scope.tranlateData = function() {
                   var srcLang = $("#src").val();
                   var distLang = $("#dist").val();
                   for(var index = 0; index < $scope.newLangArray.length; index++) {
                      (function(index) {
                          $.ajax({
                             type: "POST",
                             url: "langServer.php",
                             data: {
                                "from": srcLang,
                                "to": distLang,
                                "query": $scope.newLangArray[index]["val"],
                                "transtype": "translang",
                                "simple_means_flag": 3,
                                "operType": "translate"
                             },
                             dataType:"text",
                             success: function(result) {
                                result = JSON.parse(result);
                                var trans_result = result.trans_result.data[0];
                                $scope.newLangArray[index]["val"] = trans_result.dst.toLowerCase();
                                $scope.$apply();
                             }
                          });
                      })(index);
                   }
               }
            });
            function bindEvent() {
                $("select").on("change", function() {
                    window.location.href = "langServer.php?path=" + $(this).val();
                });
            }
            bindEvent();
        </script>
    </body>