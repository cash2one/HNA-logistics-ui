!function(){var a={set:function(a,e,n){var t=new Date,g=n;t.setTime(t.getTime()+24*g*3600*1e3),document.cookie=a+"="+e+";expires="+t.toGMTString()},get:function(a){for(var e,n=document.cookie.replace(/[ ]/g,""),t=n.split(";"),g=0;g<t.length;g++){var r=t[g].split("=");if(a==r[0]){e=r[1];break}}return e},delete:function(a){var e=new Date;e.setTime(e.getTime()-1e4),document.cookie=a+"=v; expires ="+e.toGMTString()}};Lang={dataPool:{},langData:{}},Lang.langLibrary=function(){return{"zh-CN":"简体中文","zh-HK":"繁體中文","en-US":"English"}},Lang.getCurrentLanguage=function(){return a.get("language")?a.get("language"):"zh-CN"},Lang.defaultTxt=function(a){return Lang.langLibrary()[Lang.getCurrentLanguage()]},Lang.getBrowserLang=function(){return navigator.language?navigator.language:navigator.browserLanguage},Lang.getValByKey=function(a,e){if(Lang.dataPool[a])return Lang.dataPool[a][e]},Lang.getLangData=function(a,e,n){var t="",g="",r="",o={},i={};"page"==n||"common"==n?t="languages/"+a+"/"+e+".lang":"widget"==n&&(t="public/widget/"+a+"/"+e+".lang"),"page"==n&&(g="languages/common/"+e+".lang");var u=$.ajax({url:t,dataType:"html",type:"GET",async:!1,cache:easySpa.isAjaxCache}).responseText;g&&(r=$.ajax({url:g,dataType:"html",type:"GET",async:!1,cache:easySpa.isAjaxCache}).responseText);try{o=r?JSON.parse(r):{},i=JSON.parse(u),$.extend(!0,o,i),Lang.dataPool[a]=o,u=JSON.stringify(o)}catch(e){o=r?JSON.parse(r):{},Lang.dataPool[a]=o,u=JSON.stringify(o)}return u},Lang.switchLang=function(e){a.set("language",e,30)}}();