!function(i,e,t,n){function s(e,t,n){this.el=i(e),this.options=i.extend({},d,t),this.init(n)}var l=0,d={pictureId:""};s.prototype={init:function(t){var n=this;n.html(t);for(var s=0;s<t.length;s++)t[s].picUrlID.id==n.options.pictureId&&(n.el.find(".picture-box").css({"margin-left":-s*(n.el.find(".position-box").width()-440)}),n.el.find(".picture").eq(s).css("visibility","visible").addClass("active"));n.resizeEvent(t),i(e).resize(function(){n.resizeEvent(t),n.prevEvent(t),n.nextEvent(t)}),n.el.find(".slidesjs-previous").on("click",function(){n.prevEvent(t)}),n.el.find(".slidesjs-next").on("click",function(){n.nextEvent(t)}),n.el.find(".icon-Close-Popup").on("click",function(){n.el.empty()})},html:function(i){var e=this;e.el[0].innerHTML='<div class="picture-container prompt-modal"><div class="title"><i class="icon-Close-Popup"></i></div><div class="position-box"><div class="picture-box"></div></div><a href="javascript:void(0);" class="slidesjs-previous slidesjs-navigation"><i class="icon-right left icon-large"></i></a><a href="javascript:void(0);" class="slidesjs-next slidesjs-navigation"><i class="icon-right icon-large"></i></a></div>';for(var t="",n=0;n<i.length;n++)-1!=i[n].picUrlID.type.indexOf("image")?"tiff"==e.getImageSuffix(i[n].picUrlID.type)?t+='<div style="visibility: hidden;" class="picture"><div style="color: #fff;font-size: 25px;position: relative;top: 50%;margin-top: -20px">'+Lang.getValByKey("widget/slides","slides_not_preview")+'</div><div class="download-picture"><a class="download" href="'+e.getThumbnail(i[n].picUrl)+"?filename="+i[n].name+'"><button class="btn btn-primary"><i class="icon-download"></i>'+Lang.getValByKey("widget/slides","slides_code_download")+"</button></a></div></div>":t+='<div style="visibility: hidden;" class="picture"><img src="'+e.getThumbnail(i[n].picUrl)+'" ><div class="download-picture"><a class="download" href="'+e.getThumbnail(i[n].picUrl)+"?filename="+i[n].name+'"><button class="btn btn-primary"><i class="icon-download"></i>'+Lang.getValByKey("widget/slides","slides_code_download")+"</button></a></div></div>":-1!=i[n].picUrlID.type.indexOf("pdf")?t+='<div style="visibility: hidden;" class="picture"><embed style="height: 100%;width: 100%" type="application/pdf" src="'+i[n].picUrl+'" ><div class="download-picture"><a class="download" href="'+i[n].picUrl+"?filename="+i[n].name+'"><button class="btn btn-primary"><i class="icon-download"></i>'+Lang.getValByKey("widget/slides","slides_code_download")+"</button></a></div></div>":-1==i[n].picUrlID.type.indexOf("msword")&&-1==i[n].picUrlID.type.indexOf("vnd")||(t+='<div style="visibility: hidden;" class="picture"><div style="color: #fff;font-size: 25px;position: relative;top: 50%;margin-top: -20px">'+Lang.getValByKey("widget/slides","slides_not_preview")+'</div><div class="download-picture"><a class="download" href="'+i[n].picUrl+"?filename="+i[n].name+'"><button class="btn btn-primary"><i class="icon-download"></i>'+Lang.getValByKey("widget/slides","slides_code_download")+"</button></a></div></div>");e.el.find(".picture-box")[0].innerHTML=t},resizeEvent:function(i){var e=this;e.el.find(".picture").css({width:e.el.find(".position-box").width()-440}),e.el.find(".picture-box").css({width:i.length*e.el.find(".picture").width()+200})},prevEvent:function(i){var e=this,t=e.el.find(".position-box").width()-440,n=e.el.find(".picture.active").index();return l=n,l--,-1==l&&(l=i.length-1),e.el.find(".picture").css("visibility","hidden").removeClass("active"),e.el.find(".picture-box").css({"margin-left":-l*t}),e.el.find(".picture").eq(l).css("visibility","visible").addClass("active"),l},nextEvent:function(i){var e=this,t=e.el.find(".position-box").width()-440,n=e.el.find(".picture.active").index();return l=n,l++,l==i.length&&(l=0),e.el.find(".picture").css("visibility","hidden").removeClass("active"),e.el.find(".picture-box").css({"margin-left":-l*t}),e.el.find(".picture").eq(l).css("visibility","visible").addClass("active"),l},getImageSuffix:function(i){return!i||i&&-1==i.indexOf("/")?i:i.split("/")[1]},getThumbnail:function(i){if(-1!=i.indexOf("150x150")){var e=i.lastIndexOf("."),t=i.substring(0,e),n=i.substring(e,i.length),s=t.lastIndexOf("_");i=i.substring(0,s)+n}return i}},i.fn.picturePreview=function(i,e){e?new s(this,i,e):new s(this,null,i)}}(jQuery,window,document);