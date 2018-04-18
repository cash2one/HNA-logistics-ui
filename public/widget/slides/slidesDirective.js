/*
 * 图片预览，滚动事件
 * $(id).picturePreview()
 */
;(function ($, window, document, undefined ){
    var index = 0;
    var defaults = {
        pictureId: ''
    };

    function plugin(element, options, data){
        this.el = $(element);
        this.options = $.extend({}, defaults, options);
        this.init(data);
    };

    plugin.prototype = {
        init: function (data){
            var picture = this;

            picture.html(data);
            for(var i = 0; i < data.length; i++){
                if(data[i].picUrlID.id == picture.options.pictureId){
                    picture.el.find('.picture-box').css({
                        'margin-left': - i*(picture.el.find('.position-box').width() - 440)
                    });
                    picture.el.find('.picture').eq(i).css('visibility', 'visible').addClass('active');
                };
            };

            picture.resizeEvent(data);
            $(window).resize(function(){
                picture.resizeEvent(data);
                picture.prevEvent(data);
                picture.nextEvent(data);
            });

            picture.el.find('.slidesjs-previous').on('click', function(){
                picture.prevEvent(data);
            });
            picture.el.find('.slidesjs-next').on('click', function(){
                picture.nextEvent(data);
            });
            picture.el.find('.icon-Close-Popup').on('click', function(){
                picture.el.empty();
            });
        },
        html: function(data){
            var picture = this;
            var container = '<div class="picture-container prompt-modal">' +
                    '<div class="title"><i class="icon-Close-Popup"></i></div>' +
                    '<div class="position-box">' +
                    '<div class="picture-box">' +
                    '</div>'+
                    '</div>'+
                    '<a href="javascript:void(0);" class="slidesjs-previous slidesjs-navigation"><i class="icon-right left icon-large"></i></a>'+
                    '<a href="javascript:void(0);" class="slidesjs-next slidesjs-navigation"><i class="icon-right icon-large"></i></a>'+
                    '</div>'
            picture.el[0].innerHTML = container;
            var item ='';
            for(var i = 0; i < data.length; i++) {
                if(data[i].picUrlID.type.indexOf('image') != -1){
                    if(picture.getImageSuffix(data[i].picUrlID.type) == 'tiff'){
                        item += '<div style="visibility: hidden;" class="picture">'+
                                '<div style="color: #fff;font-size: 25px;position: relative;top: 50%;margin-top: -20px">'+Lang.getValByKey("widget/slides", 'slides_not_preview')+'</div>'+
                                '<div class="download-picture"><a class="download" href="'+ picture.getThumbnail(data[i].picUrl) +'?filename='+data[i].name+'"><button class="btn btn-primary"><i class="icon-download"></i>'+Lang.getValByKey("widget/slides", 'slides_code_download')+'</button></a></div>'+
                            '</div>';
                    }else{
                        item += '<div style="visibility: hidden;" class="picture"><img src="'+ picture.getThumbnail(data[i].picUrl) +'" >'+
                            '<div class="download-picture"><a class="download" href="'+ picture.getThumbnail(data[i].picUrl) +'?filename='+data[i].name+'"><button class="btn btn-primary"><i class="icon-download"></i>'+Lang.getValByKey("widget/slides", 'slides_code_download')+'</button></a></div>'+
                            '</div>';
                    }
                }else if(data[i].picUrlID.type.indexOf('pdf') != -1){
                    item += '<div style="visibility: hidden;" class="picture"><embed style="height: 100%;width: 100%" type="application/pdf" src="'+ data[i].picUrl +'" >'+
                        '<div class="download-picture"><a class="download" href="'+ data[i].picUrl +'?filename='+data[i].name+'"><button class="btn btn-primary"><i class="icon-download"></i>'+Lang.getValByKey("widget/slides", 'slides_code_download')+'</button></a></div>'+
                        '</div>';
                }else if(
                    data[i].picUrlID.type.indexOf('msword') != -1 ||
                    data[i].picUrlID.type.indexOf('vnd') != -1
                ){
                    item += '<div style="visibility: hidden;" class="picture">'+
                        '<div style="color: #fff;font-size: 25px;position: relative;top: 50%;margin-top: -20px">'+Lang.getValByKey("widget/slides", 'slides_not_preview')+'</div>'+
                        '<div class="download-picture"><a class="download" href="'+ data[i].picUrl +'?filename='+data[i].name+'"><button class="btn btn-primary"><i class="icon-download"></i>'+Lang.getValByKey("widget/slides", 'slides_code_download')+'</button></a></div>'+
                        '</div>';
                }
            };
            picture.el.find('.picture-box')[0].innerHTML = item;
        },
        resizeEvent: function(data){
            var picture = this;

            picture.el.find('.picture').css({
                'width' : picture.el.find('.position-box').width() - 440
            })

            picture.el.find('.picture-box').css({
                'width': data.length*(picture.el.find('.picture').width())+200
            })
        },
        prevEvent: function(data){
            var picture = this;
            var pictureWidth = picture.el.find('.position-box').width() - 440;

            var eleIndex = picture.el.find('.picture.active').index()
            index = eleIndex;

            index --;
            if(index == -1){
                index = data.length-1;
            }

            picture.el.find('.picture').css('visibility', 'hidden').removeClass('active');
            picture.el.find('.picture-box').css({
                'margin-left': -index*pictureWidth
            });
            picture.el.find('.picture').eq(index).css('visibility', 'visible').addClass('active');

            return index;
        },
        nextEvent: function(data){
            var picture = this;
            var pictureWidth = picture.el.find('.position-box').width() - 440;

            var eleIndex = picture.el.find('.picture.active').index()
            index = eleIndex;

            index ++;
            if(index == data.length){
                index = 0;
            }

            picture.el.find('.picture').css('visibility', 'hidden').removeClass('active');
            picture.el.find('.picture-box').css({
                'margin-left': -index*pictureWidth
            });
            picture.el.find('.picture').eq(index).css('visibility', 'visible').addClass('active');

            return index;
        },
        getImageSuffix: function(image){
            if(!image || (image && image.indexOf('/') == -1)){ return image; }

            return image.split('/')[1];
        },
        getThumbnail:function(image){
            if(image.indexOf('150x150') != -1) {
                var idx = image.lastIndexOf('.');
                var picName = image.substring(0, idx);
                var picType = image.substring(idx, image.length);
                var index = picName.lastIndexOf('_');
                var picUrl = image.substring(0, index);
                image = picUrl + picType;
            }
            return image
        }
    };

    $.fn.picturePreview = function (params, data){
        if(data){
            new plugin(this, params, data)
        }else{
            new plugin(this, null, params)
        };
    };

})(jQuery, window, document);
