app.factory("pictureService",["$http",function(e){var r={};return r.maxUpload=9,r.picPreUrl="",r.uploadUrl=Interface.getUrlById("logistics.uploadFileToUrl"),r.init=function(e,t){var p=e.picture.length;p>=r.maxUpload||0==e.edit?e.uploadShow=!1:e.uploadShow=!0;for(var i=0;i<p;i++)e.picture[i].picUrl=r.picPreUrl+e.picture[i].picUrlID.path,e.picture[i].name=e.picture[i].picUrlID.name,-1!=e.picture[i].picUrlID.type.indexOf("image")?(e.picture[i].typeImage=!0,e.picture[i].typePdf=!1,e.picture[i].suffix=r.getImageSuffix(e.picture[i].picUrlID.type)):-1!=e.picture[i].picUrlID.type.indexOf("application")&&(e.picture[i].typeImage=!1,e.picture[i].typePdf=!0,e.picture[i].suffix="pdf");return e},r.uploadFile=function(t,p){var i,a,o={};if(void 0==p)return!1;if(p.size>1e7)return o.errorlocal=Lang.getValByKey("common","common_prompt_upload_too_large"),o;if(0==p.size)return o.errorlocal=Lang.getValByKey("common","common_prompt_upload_zero"),o;if(p.name){var l=p.name.lastIndexOf(".");a=p.name.substr(l+1)}if(t.accept&&p.name&&-1==t.accept.indexOf(a))return o.errorlocal="文件格式不正确，无法上传！",o;if(t.accept&&a&&-1==t.accept.indexOf(a))return o.errorlocal="文件格式不正确，无法上传！",o;i=-1!=p.type.indexOf("image")?r.uploadUrl+"pic":r.uploadUrl+"file";var c=new FormData;c.append("file",p);var n={method:"POST",url:i,data:c,headers:{"Content-Type":void 0,"x-token":cookie.get("token")},transformRequest:angular.identity};return e(n)},r.updateModel=function(e,t,p){var i=t,a={};if(-1!=i.type.indexOf("image")){var o=r.getImageSuffix(i.type);a={picUrlID:t,delshow:!1,name:t.name,picUrl:r.picPreUrl+t.path,typeImage:!0,suffix:o,typePdf:!1}}else-1!=i.type.indexOf("application")&&(a={picUrlID:t,delshow:!1,name:t.name,picUrl:r.picPreUrl+t.path,typeImage:!1,suffix:"pdf",typePdf:!0});return e.picture.push(a),e.picture.length>=r.maxUpload?e.uploadShow=!1:e.uploadShow=!0,e},r.getImageSuffix=function(e){return!e||e&&-1==e.indexOf("/")?e:e.split("/")[1]},r}]);