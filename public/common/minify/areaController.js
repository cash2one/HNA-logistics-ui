easySpa.use(["public/common/areaService.js","widget/tab","widget/slimscroll"]),app.controller("areaController",["$scope","areaService","$rootScope",function(e,a,t){function r(e){if(e){var a=e.next;if(null==a)return;return a.clearData(),r(a)}}function n(e,a){for(var a=a.data,t=0,r=a.length;t<r;t++)if(a[t].name==e)return a[t]}function o(){e.areaModel.unSelectedData=[],e.areaModel.candidateFlag=!1;var t={urlParams:{pageIndex:1,pageSize:300}},r=a.getCountry(t).data;for(var n in r)r[n].name=r[n].name+"("+r[n].figureCode+")";angular.forEach(r,function(a,t){e.areaModel.unSelectedData.push({id:a.id,name:a.name,figureCode:a.figureCode,delete:!1,isShow:!0,checkbox:e.areaModel.candidateFlag,interId:a.figureCode})});var o=a.height("selectedUser");setTimeout(function(){a.slimscroll(".selected-user",o),$(window).resize(function(){o=a.height("selectedUser"),a.slimscroll(".selected-user",o)})},10),a.slimscroll(".selected-user",o)}function d(t){if("CN"==e.countryFigureCode)var r=a.getAddressData(e.countryFigureCode,e.countryFigureCode);else{var n={urlParams:{countryCode:e.countryFigureCode,parentId:e.countryFigureCode,q:e.scroller.q,pageIndex:e.scroller.pageIndex,pageSize:e.scroller.pageSize}};if(e.countryFigureCode)var r=a.getOtherAddressData(n);else var r=[]}var o=r.data,d=o?o.length:0;e.areaModel.unSelectedData=[],e.areaModel.candidateFlag=!1,t||(e.searchCandidateValue="");for(var i=0;i<d;i++){if("CN"==e.countryFigureCode)var l=o[i].name;else var l=o[i].cityName;e.areaModel.unSelectedData.push({id:o[i].id,name:l,figureCode:e.countryFigureCode,delete:!1,isShow:!0,checkbox:e.areaModel.candidateFlag,interId:e.countryFigureCode+C+o[i].id,interName:e.countryName+C+o[i].name})}e.deleteCandidate(),"CN"!=e.countryFigureCode&&(e.scroller.totalPage=r.pagination&&r.pagination.totalPage),e.showProvince()}function i(t){var r=a.getAddressData(e.countryFigureCode,m.id),r=r.data,n=r?r.length:0;e.areaModel.unSelectedData=[],e.areaModel.candidateFlag=!1,e.searchCandidateValue="";for(var o=0;o<n;o++)e.areaModel.unSelectedData.push({id:r[o].id,name:r[o].name,figureCode:e.countryFigureCode,delete:!1,isShow:!0,checkbox:e.areaModel.candidateFlag,interId:e.countryFigureCode+C+m.id+C+r[o].id,interName:e.countryName+C+e.provinceName+C+r[o].name});e.showCity(t),e.deleteCandidate()}function l(){var t=a.getAddressData(e.countryFigureCode,p.id),t=t.data,r=t?t.length:0;e.areaModel.unSelectedData=[],e.areaModel.candidateFlag=!1,e.searchCandidateValue="";for(var n=0;n<r;n++)e.areaModel.unSelectedData.push({id:t[n].id,name:t[n].name,figureCode:e.countryFigureCode,delete:!1,isShow:!0,checkbox:e.areaModel.candidateFlag,interId:e.countryFigureCode+C+m.id+C+p.id+C+t[n].id,interName:e.countryName+C+e.provinceName+C+e.cityName+C+t[n].name});e.showArea(),e.deleteCandidate()}function c(){var t=a.getAddressData(e.countryFigureCode,f.id),t=t.data,r=t?t.length:0;e.areaModel.unSelectedData=[],e.areaModel.candidateFlag=!1,e.searchCandidateValue="";for(var n=0;n<r;n++)e.areaModel.unSelectedData.push({id:t[n].id,name:t[n].name,figureCode:e.countryFigureCode,delete:!1,isShow:!0,checkbox:e.areaModel.candidateFlag,interId:e.countryFigureCode+C+m.id+C+p.id+C+f.id+C+t[n].id,interName:e.countryName+C+e.provinceName+C+e.cityName+C+e.areaName+C+t[n].name});e.deleteCandidate()}function s(e){if(e)for(var a=0;a<e.length;a++)e[a].name=e[a].name+"("+e[a].figureCode+")"}function u(a,t){e.countryFigureCode&&!y&&(y=!0,"bottom"==t?(e.scroller.pageIndex<e.scroller.totalPage&&(e.scroller.pageIndex=e.scroller.pageIndex+1,d(!0),setTimeout(function(){scrollObj.slimScroll({scrollTo:"0px"})},800)),setTimeout(function(){y=!1},800)):"top"==t&&(e.scroller.pageIndex>1?(e.scroller.pageIndex=e.scroller.pageIndex-1,setTimeout(function(){scrollObj.slimScroll({scrollTo:scrollObj.outerHeight()}),y=!1},800)):(e.scroller.pageIndex=1,y=!1),d(!0)),e.$apply())}function g(){e.showCountry(),e.showProvince(),e.showCity()}var h,m,p,f,C="/";e.scroller={q:"",pageIndex:1,pageSize:200},e.toggleCandidateAll=function(e){var a=[];1==e.candidateFlag?angular.forEach(e.unSelectedData,function(e,t){a.push({id:e.id,name:e.name,figureCode:e.figureCode,delete:e.delete,isShow:e.isShow,checkbox:!0,interId:e.interId})}):angular.forEach(e.unSelectedData,function(e,t){a.push({id:e.id,name:e.name,figureCode:e.figureCode,delete:e.delete,isShow:e.isShow,checkbox:e.delete,interId:e.interId})}),e.unSelectedData=a},e.toggleSelectedAll=function(e){var a=[];1==e.selectedFlag?angular.forEach(e.selectedData,function(e,t){a.push({id:e.id,name:e.name,figureCode:e.figureCode,delete:e.delete,isShow:e.isShow,checkbox:!0,interId:e.interId})}):angular.forEach(e.selectedData,function(e,t){a.push({id:e.id,name:e.name,figureCode:e.figureCode,delete:e.delete,isShow:e.isShow,checkbox:!1,interId:e.interId})}),e.selectedData=a},t.initCtrl=function(){e.checkedPlaceholder=Lang.getValByKey("common","common_page_unchecked_inputName"),e.countryFigureCode=e.countryName="",e.tabIndex=0,e.searchCandidateValue="",e.searchSelectedValue=""},e.tabCallback=function(a){h&&h.clearData(),m&&m.clearData(),p&&p.clearData(),f&&f.clearData(),e.searchCandidateValue="",0==a?(e.tabIndex=0,scrollObj&&scrollObj.unbind("slimscroll"),o(),$(".area-box .input-box").each(function(e){e&&$(this).addClass("select-disabled")}),e.countryFigureCode="",e.countryName="",e.deleteCandidate(),e.checkedPlaceholder=Lang.getValByKey("common","common_page_unchecked_inputName")):(e.tabIndex=1,e.countryFigureCode=e.countryName="",e.areaModel.unSelectedData=[],e.checkedPlaceholder=Lang.getValByKey("common","common_page_inputName")),e.$apply()},e.getCountryData=function(e,t){t||(t=1),e=e||"";var r={urlParams:{q:e,pageIndex:t,pageSize:10}};return a.getCountry(r)},e.showCountry=function(){e.countryDatas||(e.countryDatas=e.getCountryData()),h||(h=selectFactory({data:e.countryDatas,isSearch:!0,id:"countryFigure",showTextField:"name",defaultText:Lang.getValByKey("common","common_select_tips"),pagination:!0,closeLocalSearch:!0,searchPlaceHoder:"请输入国家名称或二字码",onSearchValueChange:function(a,t,r){var n=e.getCountryData(t,r);s(n.data),a.setData(n)},attrTextModel:function(a,t){e.countryName=a;var o;o=a?n(a,t):{},h.id=o?o.id:"",h.figureCode=o?o.figureCode:"",e.countryFigureCode=h.figureCode,"CN"!=h.figureCode?(m&&m.clearData(),e.provinceName="",p&&p.clearData(),e.cityName="",f&&f.clearData(),e.areaName="",e.scroller.pageIndex=1,e.scroller.q="",scrollObj.unbind("slimscroll"),scrollObj.bind("slimscroll",function(e,a){u(e,a)})):scrollObj.unbind("slimscroll"),e.provinceDatas="",e.provinceName="",e.cityDatas="",e.areaDatas="",$(".area-box .input-box").each(function(e){e&&$(this).addClass("select-disabled")}),"CN"==e.countryFigureCode&&$("#province").parent(".input-box").removeClass("select-disabled"),r(h),d(),e.$apply()}})),h.setData(e.countryDatas),$("#countryFigure").val(e.countryName)},e.getProvinceData=function(t,r){r||(r=1),t=t||"";var n={urlParams:{q:t,parentId:e.countryFigureCode,countryCode:e.countryFigureCode,pageIndex:r,pageSize:10}};return a.getAddrData(n)},e.showProvince=function(){if($("#province").parent(".input-box").hasClass("select-disabled"))return!1;e.provinceDatas||(e.provinceDatas=e.getProvinceData()),m=selectFactory({data:e.provinceDatas,isSearch:!0,isUsePinyin:!0,id:"province",defaultText:Lang.getValByKey("common","common_select_tips"),showTextField:"name",pagination:!0,closeLocalSearch:!0,searchPlaceHoder:"请输入省名称",onSearchValueChange:function(a,t,r){if("CN"!=e.countryFigureCode)return!1;var n=e.getProvinceData(t,r);a.setData(n)},attrTextModel:function(a,t){e.provinceName=a,"CN"==e.countryFigureCode&&($("#area").parent(".input-box").addClass("select-disabled"),$("#city").parent(".input-box").removeClass("select-disabled")),e.cityDatas="",e.cityName="",p&&p.clearData(),e.areaDatas="",f&&f.clearData();var o;o=a?n(a,t):{},m.id=o?o.id:"",m.id||($("#area").parent(".input-box").addClass("select-disabled"),$("#city").parent(".input-box").addClass("select-disabled")),r(m),o.id?i(!0):d(),e.$apply()}}),m.setData(e.provinceDatas),m.open(),h.next=m,$("#province").val(e.provinceName)},e.getCityData=function(t,r){r||(r=1),t=t||"";var n={urlParams:{q:t,countryCode:e.countryFigureCode,parentId:m.id,pageIndex:r,pageSize:10}};return a.getAddrData(n)},e.showCity=function(a){if($("#city").parent(".input-box").hasClass("select-disabled"))return!1;e.cityDatas||(e.cityDatas=e.getCityData()),p=selectFactory({data:e.cityDatas,id:"city",isSearch:!0,defaultText:Lang.getValByKey("common","common_select_tips"),isUsePinyin:!0,direction:"up",showTextField:"name",pagination:!0,closeLocalSearch:!0,searchPlaceHoder:"请输入市名称",onSearchValueChange:function(a,t,r){if(!e.provinceName)return!1;var n=e.getCityData(t,r);a.setData(n)},attrTextModel:function(a,t){e.cityName=a,"CN"==e.countryFigureCode&&$("#area").parent(".input-box").removeClass("select-disabled"),e.areaDatas="",e.areaName="",f&&f.clearData();var o;o=a?n(a,t):{},p.id=o?o.id:"",p.id||$("#area").parent(".input-box").addClass("select-disabled"),r(p),o.id?l():i(),e.$apply()}}),p.setData(e.cityDatas),!0===a?e.cityDatas.data.length>1?p.open():1===e.cityDatas.data.length&&("CN"==e.countryFigureCode&&$("#area").parent(".input-box").removeClass("select-disabled"),e.cityName=e.cityDatas.data[0].name,p.id=e.cityDatas.data[0].id,e.areaDatas="",e.areaName="",f&&f.clearData(),r(p),l(),e.$apply()):p.open(),m.next=p,$("#city").val(e.cityName)},e.getAreaData=function(t,r){r||(r=1),t=t||"";var n={urlParams:{q:t,countryCode:e.countryFigureCode,parentId:p.id,pageIndex:r,pageSize:10}};return a.getAddrData(n)},e.showArea=function(){if($("#area").parent(".input-box").hasClass("select-disabled"))return!1;e.areaDatas||(e.areaDatas=e.getAreaData()),f=selectFactory({data:e.areaDatas,isSearch:!0,defaultText:Lang.getValByKey("common","common_select_tips"),isUsePinyin:!0,id:"area",showTextField:"name",direction:"up",pagination:!0,closeLocalSearch:!0,searchPlaceHoder:"请输入区县名称",onSearchValueChange:function(a,t,r){if(!e.cityName)return!1;var n=e.getAreaData(t,r);a.setData(n)},attrTextModel:function(a,t){e.areaName=a;var r;r=a?n(a,t):{},f.id=r?r.id:"",r.id?c():l(),e.$apply()}}),f.setData(e.areaDatas),f.open(),p.next=f,$("#area").val(e.areaName)},e.toggleCandidateOne=function(a){for(var t=e.areaModel.unSelectedData,r=t.length?t.length:0,n=0,o=0;o<r;o++)1!=a.split("/").length?t[o].interId.split("/").length==a.split("/").length&&t[o].interId.split("/")[t[o].interId.split("/").length-1]==a.split("/")[a.split("/").length-1]&&(t[o].checkbox=!t[o].checkbox):t[o].interId==a&&(t[o].checkbox=!t[o].checkbox),t[o].checkbox||++n;e.areaModel.unSelectedData=t,e.areaModel.candidateFlag=!n},e.searchCandidate=function(){var a=$.trim(e.searchCandidateValue.toLowerCase());if(a&&(a=a.replace(/[，。、,.\/]/g,",").replace(/(^\s*)|(\s*$)/g,"")),e.countryName&&"CN"!=e.countryFigureCode)e.scroller.q=e.searchCandidateValue,e.scroller.pageIndex=1,d(!0);else{for(var t=e.areaModel.unSelectedData,r=t.length,n=[],o=!0,i=0;i<r;i++){if(!e.countryName&&a)for(var l=a.split(","),c=0,s=l.length;c<s;c++){if(t[i].name&&l[c]&&(-1!=t[i].name.toLowerCase().indexOf(l[c])||-1!=t[i].interId.toLowerCase().indexOf(l[c]))){o=!0;break}o=!1}else o=!(!t[i].name||-1==t[i].name.toLowerCase().indexOf(a));n.push({id:t[i].id,name:t[i].name,figureCode:t[i].figureCode,delete:t[i].delete,isShow:o,checkbox:t[i].checkbox,interId:t[i].interId,interName:t[i].interName})}e.areaModel.unSelectedData=n,e.deleteCandidate()}},e.addSelectedData=function(){for(var a=e.areaModel.unSelectedData,t=e.areaModel.selectedData,r=a.length,n=0;n<r;n++)a[n].checkbox&&!a[n].delete&&a[n].isShow&&(t.unshift({id:a[n].id,name:a[n].name,figureCode:a[n].figureCode,delete:!1,isShow:!0,checkbox:e.areaModel.selectedFlag,interId:a[n].interId,interName:a[n].interName}),a[n].delete=!0);e.areaModel.unSelectedData=a,e.areaModel.selectedData=t,e.deleteCandidate()},e.deleteCandidate=function(){for(var a=e.areaModel.selectedData.length,t=e.areaModel.unSelectedData.length,r=e.areaModel.unSelectedData,n=e.areaModel.selectedData,o=0;o<t;o++)r[o].delete=!1;if(a&&t)for(var d=0;d<a;d++)for(var i=0;i<t;i++)-1==(n[d].interId+C).indexOf(r[i].interId+C)&&-1==(r[i].interId+C).indexOf(n[d].interId+C)||(r[i].delete=!0,r[i].checkbox=!0);e.areaModel.unSelectedData=r;for(var l=0,c=0;c<t;c++)e.areaModel.unSelectedData[c].checkbox&&++l;e.areaModel.candidateFlag=l==t},e.toggleSelectedOne=function(a){for(var t=e.areaModel.selectedData,r=t.length?t.length:0,n=0,o=0;o<r;o++)1!=a.split("/").length?t[o].interId.split("/").length==a.split("/").length&&t[o].interId.split("/")[t[o].interId.split("/").length-1]==a.split("/")[a.split("/").length-1]&&(t[o].checkbox=!t[o].checkbox):t[o].interId==a&&(t[o].checkbox=!t[o].checkbox),t[o].checkbox||++n;e.areaModel.selectedData=t,e.areaModel.selectedFlag=!n},e.searchSelected=function(){for(var a=e.searchSelectedValue.toLowerCase(),t=e.areaModel.selectedData,r=t.length,n=[],o=!0,d=0;d<r;d++){if(a){var i=a.split(",");if(1!=i.length)return!1;for(var l=0,c=i.length;l<c;l++){if(t[d].name&&i[l]&&(-1!=t[d].name.toLowerCase().indexOf(i[l])||-1!=t[d].interId.toLowerCase().indexOf(i[l]))){o=!0;break}o=!1}}else o=!(!t[d].name||-1==t[d].name.toLowerCase().indexOf(a));n.push({id:t[d].id,name:t[d].name,figureCode:t[d].figureCode,delete:t[d].delete,isShow:o,checkbox:t[d].checkbox,interId:t[d].interId,interName:t[d].interName})}e.areaModel.selectedData=n},e.removeSelectedData=function(){for(var a=e.areaModel.unSelectedData,t=e.areaModel.selectedData,r=[],n=a.length,o=t.length,d=0;d<o;d++)if(t[d].checkbox&&t[d].isShow)for(var i=0;i<n;i++)t[d].id==a[i].id&&a[i].delete&&(a[i].delete=!1,a[i].checkbox=e.areaModel.candidateFlag);else r.push({id:t[d].id,name:t[d].name,figureCode:t[d].figureCode,delete:t[d].delete,isShow:t[d].isShow,checkbox:t[d].checkbox,interId:t[d].interId,interName:t[d].interName});e.areaModel.unSelectedData=a,e.areaModel.selectedData=r,e.deleteCandidate()},e.init=function(){t.tab=$("#m-tab").tab({callback:e.tabCallback})};var y=!1;!function(){g()}()}]);