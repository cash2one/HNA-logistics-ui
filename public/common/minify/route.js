!function(){function e(e,t){var a="";if(-1==e.indexOf("?"))return e;a=e.substr(e.indexOf("?")+1);var r="",n="";if(-1!=a.indexOf("&")){r=a.split("&");for(i in r)r[i].split("=")[0]!=t&&(n=n+r[i].split("=")[0]+"="+r[i].split("=")[1]+"&");return e.substr(0,e.indexOf("?"))+"?"+n.substr(0,n.length-1)}return r=a.split("="),r[0]==t?e.substr(0,e.indexOf("?")):e}function t(){if(c.length>=2){var t=c[c.length-2],a=c[c.length-1];if(t=e(t,"t"),a=e(a,"t"),t!=a)return!0}return!1}function a(e,a){return!!(e&&a&&e.$$route&&a.$$route&&e.$$route.templateUrl!=a.$$route.templateUrl||t())}function r(e,t){e.$$route&&e.$$route.isReload&&a(e,t)?($("body").css({display:"none"}),top.isGoToPage=!1,window.location.reload(),easySpa.isReloadPage=!0):(easySpa.clearCssTpl(),easySpa.clearEventLoop(),easySpa.delayTime=null,easySpa.relateJs={},easySpa.jsTree={},easySpa.callbackPool=[],easySpa.requireCount=1,easySpa.jsCount=0)}function n(e){return $.ajax({url:e,type:"GET",cache:easySpa.isAjaxCache,dataType:"html",async:!1}).responseText}function o(e,t){return template("",e)(t)}function l(){var e=easySpa.config.relyJsPath;for(var t in e)if(-1==location.href.indexOf(".html")&&-1==t.indexOf(".html"))for(var a=e[t],r=0;r<a.length;r++)easySpa.use([a[r]]);else if(t.indexOf(".html")>-1&&location.href.indexOf(t)>-1)for(var a=e[t],r=0;r<a.length;r++)easySpa.use([a[r]])}function p(e){for(var t=!1,a=0;a<u.length;a++)if(e==u[a].gotoUrl){t=u[a].gotoUrl;break}return t}function s(e,t){e=e.replaceAll("<%","#%"),e=e.replaceAll("%>","%#"),e="<div>"+e+"</div>";var e=$(e),a=$("[include]",e);if(easySpa.isUseCombine){for(var r=[],i=0;i<a.length;i++)r.push($(a[i]).attr("include"));if(0==r.length)return e=e.html(),e=e.replaceAll("#%","<%"),e=e.replaceAll("%#","%>");var n=easySpa.getRemoteText(easySpa.combineLoadUrl+"?urls="+r.join(","));if(!$.trim(n))return e=e.html(),e=e.replaceAll("#%","<%"),e=e.replaceAll("%#","%>");n=n.split(easySpa.responseTextMark);for(var i=0;i<n.length;i++){var o=template("",n[i])(t);$(a[i]).html(o)}}else for(var i=0;i<a.length;i++){var l=$(a[i]).attr("include"),o="";f[l]?o=f[l]:(o=easySpa.getRemoteText(l),f[l]=o),o=template("",o)(t),$(a[i]).html(o)}return e=e.html(),e=e.replaceAll("#%","<%"),e=e.replaceAll("%#","%>")}var u=[],c=[],f={};String.prototype.replaceAll=function(e,t){return this.replace(new RegExp(e,"gm"),t)},app=angular.module("app",["ngRoute"]),app.run(function(e){e.$on("$routeChangeStart",function(e,t,a){if(c.push(location.href),r(t,a),!easySpa.isReloadPage){if(t.$$route){var i=t.$$route.templateUrl,l=t.$$route.template;if("string"!=typeof l){var f=p(i);f||(f=n(i),u.push({gotoUrl:f}));var g=t.$$route.originalPath,m=g.split("/")[g.split("/").length-1],d=Lang.getCurrentLanguage(),y=JSON.parse(Lang.getLangData(m,d,"page"));f=s(f,y),f=o(f,y)}else f=l;easySpa.isReloadPage||(t.$$route.template=f)}$("div[ng-view]").css("display","none")}}),e.$on("$routeChangeSuccess",function(e,t,a){$("div[ng-view]").css("display","block")})}),app.config(["$routeProvider","$controllerProvider","$compileProvider","$provide","$httpProvider",function(e,t,a,r,i){app.register={controller:t.register,factory:r.factory,directive:a.directive},app.controller=app.register.controller,app.factory=app.register.factory,easySpa.insertJsToPage(easySpa.loadCombinAssets(easySpa.combineLoadUrl+"?urls=public/common/minify/ajax.js,public/common/minify/cookie.js,public/common/minify/routeConfig.js,public/common/minify/tplEngine.js,public/common/minify/common.js")),l(),app.directive=app.register.directive;var n=app.directive;app.directive=function(e,t){var a=t(),r=function(){return a};if(a.templateUrl){var i="public/widget/"+a.widgetName+"/"+a.templateUrl,l=Lang.getCurrentLanguage(),p=a.isChild?"{}":Lang.getLangData(a.widgetName,l,"widget"),s=p?JSON.parse(p):{};a.template=o(easySpa.getRemoteText(i),s),delete a.templateUrl}else r=t;return n.apply(this,[e,r])};var p=e.when;e.when=function(e,t){return e?p.apply(this,[e,t]):this};for(var s in routeConfig)routeConfig[s].resolve=easySpa.getController().setAssets(routeConfig[s].pageName,routeConfig[s].timstamp),e=e.when(s,routeConfig[s])}])}();