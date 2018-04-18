<?php
    function deldir($dir) {
      //先删除目录下的文件：
      $dh=opendir($dir);
      while ($file=readdir($dh)) {
        if($file!="." && $file!="..") {
          $fullpath=$dir."/".$file;
          if(!is_dir($fullpath)) {
              unlink($fullpath);
          } else {
              deldir($fullpath);
          }
        }
      }
      closedir($dh);
    }
    $url = $_REQUEST["urls"];
    $urls = explode(",", $url);
    $jsStr = "";
    for($index = 0; $index < count($urls); $index++) {
        if(!strpos($urls[$index], "ublic/") && (!strpos($urls[$index], ".css") || !strpos($urls[$index], ".js"))) {
            echo "无访问权限!";
            exit;
        }
    }
    $cacheConfig = file_get_contents("public/common/cacheConfig.js");
    function addEtag($file) {
        $last_modified_time = filemtime($file);
        $etag = md5_file($file);
        header("Last-Modified: ".gmdate("D, d M Y H:i:s", $last_modified_time)." GMT");
        header("Etag: $etag");
        if (@strtotime($_SERVER['HTTP_IF_MODIFIED_SINCE']) == $last_modified_time || @trim($_SERVER['HTTP_IF_NONE_MATCH']) == $etag) {
            header("HTTP/1.1 304 Not Modified");
            exit;
        }
    }
    $cacheFileName = substr(md5($url), 0, 10) . ".txt";
    if(strpos($cacheConfig, "isUseCache = false") > 0) {
        deldir("cache");
        $cacheConfigCopy = "window.isUseCache = false;//调试模式使用 false， 生产模式使用 true\nwindow.cacheTime = '{timestamp}'; //每次发布的时候更新时间戳以更新客户浏览器缓存，开发模式不需要改";
        $cacheConfigCopy = str_replace("{timestamp}", substr(md5(time()), 0, 4), $cacheConfigCopy);
        file_put_contents("public/common/cacheConfig.js", $cacheConfigCopy);
    }
    if(!is_dir("cache")) {
        mkdir("cache", 0777, true);
    }
    if(file_exists("cache/" . $cacheFileName) && !strpos($cacheConfig, "isUseCache = false") && !strpos($url, "public/common/cacheConfig.js")) {
        addEtag("cache/" . $cacheFileName);
        $jsStr = file_get_contents("cache/" . $cacheFileName);
    } else {
        for($index = 0; $index < count($urls); $index++) {
                if($index < count($urls) -1) {
                    $jsStr .= file_get_contents($urls[$index]) . "\n\n\n\n\n/*^~~^*/";
                } else {
                    $jsStr .= file_get_contents($urls[$index]);
                }
         }
         $jsStr = str_replace(" \u2028", "", $jsStr);
         if(strpos($cacheConfig, "isUseCache = true") > 0) {
             if($url != "public/common/cacheConfig.js") {
                file_put_contents("cache/" . $cacheFileName, $jsStr);
             }
         }
    }
    header('Content-type: text/css');
    echo $jsStr;
?>