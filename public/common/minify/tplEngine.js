!function(){String.prototype.replaceAll=function(e,a){return this.replace(new RegExp(e,"gm"),a)};var e=Lang.getCurrentLanguage(),a=JSON.parse(Lang.getLangData("common",e,"common"));Lang.langData=a;var t="<div id='container'>"+template("container",a)+"</div>";$("#container").replaceWith($(t));var n=$("[include]");if(easySpa.isUseCombine){for(var r=[],l=0;l<n.length;l++)r.push($(n[l]).attr("include"));var o=easySpa.getRemoteText(easySpa.combineLoadUrl+"?urls="+r.join(","));o=o.split(easySpa.responseTextMark);for(var l=0;l<o.length;l++)i=template("",o[l])(a),$(n[l]).html(i)}else for(var l=0;l<n.length;l++){url=$(n[l]).attr("include");var i=easySpa.getRemoteText(url);i=template("",i)(a),$(n[l]).html(i)}}();