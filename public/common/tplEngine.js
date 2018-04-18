(function() {
    String.prototype.replaceAll  = function(s1,s2) {
        return this.replace(new RegExp(s1,"gm"),s2);
    }
    var langType = Lang.getCurrentLanguage();
    var langData = JSON.parse(Lang.getLangData("common", langType, "common"));
    Lang.langData = langData;
    var tpl = "<div id='container'>" + template("container", langData) + "</div>";
    $("#container").replaceWith($(tpl));
    var includeEles = $("[include]");
    if(easySpa.isUseCombine) {
        var urls = [];
        for (var index = 0; index < includeEles.length; index++) {
            urls.push($(includeEles[index]).attr("include"));
        }
        var htmls = easySpa.getRemoteText(easySpa.combineLoadUrl + "?urls=" + urls.join(","));
        htmls = htmls.split(easySpa.responseTextMark);
        for (var index = 0; index < htmls.length; index++) {
            html = template("", htmls[index])(langData);
            $(includeEles[index]).html(html);
        }
    } else {
        for(var index = 0; index < includeEles.length; index++) {
            url = $(includeEles[index]).attr("include");
            var html = easySpa.getRemoteText(url);
            html = template("", html)(langData);
            $(includeEles[index]).html(html);
        }
    }
})();