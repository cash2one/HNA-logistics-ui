<?php
    $cacheConfig = file_get_contents("public/common/cacheConfig.js");
    $cacheConfig = str_replace("window.isUseCache = false", "window.isUseCache = true", $cacheConfig);
    file_put_contents("public/common/cacheConfig.js", $cacheConfig);
?>