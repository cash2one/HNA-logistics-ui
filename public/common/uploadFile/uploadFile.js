easySpa.use(['widget/select','widget/prompt','widget/slides']);
(function ($, window, document, undefined ){
    var backResult = [];
    var fileNameRight = false;

    function plugin(elm,param){
        var that = this;

        that.$elm = $(elm);

        that.param = $.extend({}, param);

        that.init();
    }

    plugin.prototype = {
        init: function(){
            var that = this;
            that.loadHTMLCss(); //加载HTML和CSS

            if(!that.param.edit){ $(".addButton").hide();}  //非可编辑状态添加附件按钮隐藏

            if(that.param.edit){
                that.fileTypes = that.getFileType();
                that.fileTypeCode = that.fileTypes.data[0].code;

                $("#clickBtn").attr("disabled", true);
                $("#clickBtn").css("background-color", "#ccc");
                $("#clickBtn").css("border-color", "#ccc");

                that.checkUpload(true);

                $("#fileNameInp").val("");
                $("#projectFile").val("");
                $("#upload_fileType").val(that.fileTypes.data[0].name);
                $("#fileDescribeInp").val("");

                $("#addDataTr").show();
            }else{
                $("#addDataTr").hide();
            }

            that.orderFileData = that.getOrderFile();

            that.getForEachData(that.orderFileData);

            that.handle(); //视图事件监听
        },

        loadHTMLCss :function(){
            var that = this;

            that.use({
                url:'public/common/uploadFile/uploadFile.css',
                type:'css'
            });
            that.use({
                url:'public/common/uploadFile/uploadFile.html',
                type:'html',
                append:that.param.append
            });
        },

        getOrderFile :function (){ //获取附件信息
            var that = this;

            var params = {
                url:that.param.getOrderFile.url,
                type:that.param.getOrderFile.type,
                data:that.param.getOrderFile.param
            };
            var orderFileDatas = JSON.parse(that.useHttp(params));
            return orderFileDatas.data
        },

        getForEachData :function (data){ //附件数据遍历
            var that = this;

            var resetData = that.getResetDataFormat(data),
                fileDownloadName;

            $("#tableContainerId tbody .add-data").remove();

            if(resetData.length > 0){
                backResult.splice(0,backResult.length);
                resetData.forEach(function(value,index){
                    if(!value.fileUrl && value.path){
                        value.fileUrl = value.path
                    }
                    if(!value.fileId && value.id){
                        value.fileId = value.id
                    }
                    var fCode,backData;
                    that.param.system ==="tradeOrder" ?
                        backData={
                            type:value.code,
                            remark:value.desciption,
                            name:value.fileName,
                            fileId:value.id,
                            orderNo:value.orderNo
                        } :
                        backData= {
                            code:value.code,
                            desciption:value.desciption,
                            fileName:value.fileName,
                            fileId:value.id,
                            orderNo:value.orderNo
                        };
                    backResult.push(backData);
                    if(value.fileRandomName){
                        var idx = value.fileRandomName.lastIndexOf('.');
                        fCode= value.fileRandomName.substring(idx + 1, value.fileRandomName.length).toUpperCase();
                    }
                    if(value.name){
                        var idx = value.name.lastIndexOf('.');
                        fCode= value.name.substring(idx + 1, value.name.length).toUpperCase();
                    }
                    if(fCode==='DOC' || fCode=='DOCX' || fCode==='DOT' || fCode==='DOTX'){
                        value.type = 'application/msword'
                    }else if(fCode==='XLS' || fCode==='XLT' || fCode==='XLSX' || fCode==='XLTX'){
                        value.type = 'application/vnd.ms-excel'
                    }else if(fCode === 'JPG' || fCode === 'JPEG' || fCode === 'PNG' || fCode === 'BMP' || fCode === 'TIFF') {
                        value.type = 'image';
                    }else if (fCode === 'PDF'){
                        value.type = 'pdf';
                    }
                    if(!value.fileType && value.type){
                        value.fileType = value.type
                    }
                    if(value.fileName.indexOf('.')<0){
                        var idx = value.fileRandomName.lastIndexOf('.');
                        fileDownloadName = value.fileName+'.'+ value.fileRandomName.substring(idx + 1, value.fileRandomName.length);
                    }else{
                        fileDownloadName= value.fileRandomName
                    }
                    var html = '<tr class="add-data"><td >'+value.fileName+'</td>'+
                        '<td>'+value.fileTypeName+'</td>'+
                        '<td>'+value.desciption+'</td>'+
                        '<td data-fileUrl="'+value.fileUrl.toString()+'" ' +
                        ' data-fileId="'+value.fileId.toString()+'" '+
                        ' data-fileType="'+value.fileType+'" '+
                        ' data-name="'+value.fileRandomName+'" '+'';
                    if(value.type && value.type.includes("image")){
                        html += '><img class="imgFilePic" style="margin-top: 10px" src="'+value.fileUrl+'" width="50">';
                    }else if(value.type && value.type.includes("pdf")){
                        html += '><img style="margin-top: 10px;" src="../public/img/PDF.svg" width="50">';
                    }else if(value.type && value.type.includes("tiff")){
                        html += '><img style="margin-top: 10px;" src="../public/img/tiff.svg" width="50">';
                    }else if(value.type && value.type.includes("vnd")){
                        html += '><img style="margin-top: 10px;" src="../public/img/excel.svg" width="50">';
                    }else if(value.type && value.type.includes("msword")){
                        html += '><img style="margin-top: 10px;" src="../public/img/word.svg" width="50">';
                    }
                    html += '<p style="margin-top: -14px"><span class="textPreview">预览</span>';
                    if(that.param.edit){
                        html +='<span class="textDelete" data-status="'+value.orderStatus+'" id=' + value.id + '>删除</span>';
                    }
                    html +='<a href="'+ that.getThumbnail(value.fileUrl) +'?filename='+fileDownloadName+'" class="textDownload" download>下载</a></p></td></tr>';
                    $("#tableContainerId tbody #addDataTr").before(html);
                });
            }
        },

        getResetDataFormat :function(data){
            var that = this ;

            var rDatas = [];

            if(that.param.system ==="tradeOrder" && that.param.orderNo){
                data.forEach(function(value){
                    var rData = {id:'', code:'', desciption:'', fileName:'',
                        orderNo:'', fileId:'', fileRandomName:'', type:'',
                        orderStatus:'', fileUrl:'', fileType:'', fileTypeName:''};

                    rData.id = value.id;
                    rData.code = value.type;

                    if(!value.remark && value.desciption){
                        rData.desciption = value.desciption
                    }else if(value.remark){
                        rData.desciption = value.remark;
                    }
                    if(!value.fileName && value.name){
                        rData.fileName = value.name
                    }else{
                        rData.fileName = value.fileName;
                    }
                    rData.fileId = value.fileId;
                    rData.fileRandomName = value.fileRandomName;
                    rData.fileType = value.fileType;
                    rData.orderStatus = value.orderStatus;
                    if(!value.fileUrl && value.path){
                        rData.fileUrl = value.path
                    }else{
                        rData.fileUrl = value.fileUrl;
                    }
                    rData.fileTypeName = value.fileTypeName;
                    rDatas.push(rData);
                })
            }else{
                rDatas = data
            }
            return rDatas
        },

        getThumbnail :function(image){ //预览获取原图
            if(image.indexOf('150x150') != -1) {
                var idx = image.lastIndexOf('.');
                var picType = image.substring(idx, image.length);
                if (picType !== ".doc" && picType !== ".docx" && picType !== ".dot" &&
                    picType !== ".dotx" && picType !== ".xls" && picType !== ".xlsx" &&
                    picType !== ".xlt" && picType !== ".xltx" && picType !== ".pdf") {
                    var picName = image.substring(0, idx);
                    var index = picName.lastIndexOf('_');
                    var picUrl = image.substring(0, index);
                    image = picUrl + picType;
                }
            }

            return image
        },

        handle:function(){
            var that = this;

            $("#clickBtn").on("click",function(){ //点击添加附件按钮显示添加对话框，清除对话框内容
                if(that.param.edit){
                    that.fileTypes = that.getFileType();
                    that.fileTypeCode = that.fileTypes.data[0].code;

                    $("#clickBtn").attr("disabled", true);
                    $("#clickBtn").css("background-color", "#ccc");
                    $("#clickBtn").css("border-color", "#ccc");

                    that.checkUpload(true);

                    $("#fileNameInp").val("");
                    $("#projectFile").val("");
                    $("#upload_fileType").val(that.fileTypes.data[0].name);
                    $("#fileDescribeInp").val("");

                    $("#addDataTr").show();
                }else{
                    $("#addDataTr").hide();
                }
            });

            $("#upload_fileType").on("click", function(e) { //添加中获取文件类型
                Select.sharePool['upload_fileType'] = null;
                $("#upload_fileType").unbind();
                selectFactory({
                    data: [],
                    id: "upload_fileType",
                    defaultText:'',
                    onSearchValueChange: function (attachEvent, data) {
                        var fileTypeValues = that.getCurrentFileType(data);
                        attachEvent.setData(fileTypeValues);
                    },
                    attrTextModel: function(name, data) {
                        that.fileTypeCode = that.getCodeByName(name, data);
                        $("#upload_fileType").val(name);
                    }
                }).open();
            });

            $("#fileNameInp").on("blur", function (e){ //鼠标移除名称输入框进行名称校验
                fileNameRight = false;
                var fileName = $("#fileNameInp").val(),
                    reg = /^([\w\u4E00-\u9FA5_\-\s]+)+$/;

                if(reg.test(fileName)){
                    if(that.param.orderNo) {
                        that.checkFileName(fileName, function (res) {
                            if (!res.data) {
                                fileNameRight = true;
                                that.checkUpload(false);
                                return $("#inputNameErrorVal").val('已有该文件名！');
                            }else{
                                $("#inputNameErrorVal").val('');
                                that.checkUpload(true);
                            }
                        });
                    }else{
                        $("#inputNameErrorVal").val('');
                        that.checkUpload(true);
                    }
                }else if(fileName){
                    fileNameRight = true;
                    that.checkUpload(false);
                    return $("#inputNameErrorVal").val('请输入中英文、数字、“-_”、空格');
                }else{
                    $("#inputNameErrorVal").val('');
                    that.checkUpload(true);
                }
            });

            $("#projectFile").on('change', function(e){ //点击上传附件进行文件上传
                var fileName = $("#fileNameInp").val().trim(),
                    fileDescribe = $("#fileDescribeInp").val(),
                    fileTypeName = $("#upload_fileType").val(),

                    option = {'maxSize': 10 * 1024 * 1024},
                    file = (e.srcElement || e.target).files[0];

                $("#projectFile").val("");
                if(fileNameRight){
                    $("#fileNameInp").focus();
                    return;
                }
                if(!fileTypeName && !that.fileTypeCode){
                    $("#upload_fileType").focus();
                    return $(document).promptBox({
                        isDelay: true,
                        contentDelay: "类型不能为空",
                        type: "errer",
                        time: 3000
                    });
                }
                if(file == undefined){
                    return false;
                }
                if (file.size > option.maxSize) {
                    return $(document).promptBox({
                        isDelay: true,
                        contentDelay: '单个文件最大支持10M!',
                        type: 'errer',
                        manualClose: true,
                        time: 3000
                    });
                }
                if (file.size == 0) {
                    return $(document).promptBox({
                        isDelay: true,
                        contentDelay: '文件不能为空！',
                        type: 'errer',
                        manualClose: true,
                        time: 3000
                    });
                }

                var fileUrl,fileData;
                if(file.type.indexOf('image') != -1){
                    fileUrl = '/api/v1/sys/files/upload/' + 'pic';
                }else{
                    fileUrl = '/api/v1/sys/files/upload/' + 'file';
                }
                fileData = new FormData();
                fileData.append('file', file);

                $('#progress').text("0%");
                $('progress').attr({value : 0 , max : 100});

                $.ajax({
                    type:'POST',
                    url:fileUrl,
                    data: fileData,
                    processData: false,
                    contentType: false,
                    xhr: function(){
                        $(".uploadBtn").css("display", "none");
                        $(".proDiv").css("display", "block");
                        var myXhr = $.ajaxSettings.xhr();
                        if(myXhr.upload){
                            myXhr.upload.addEventListener('progress',that.progressHandlingFunction, false);
                        }
                        return myXhr;
                    },
                    success:function(res){
                        $("#clickBtn").attr("disabled", false);
                        $("#clickBtn").css("background-color", "#3BAFDA");
                        $("#clickBtn").css("border-color", "#3BAFDA");

                        if(res.errorCode === 0){
                            $(".uploadBtn").css("display", "block");
                            $(".proDiv").css("display", "none");
                            fileName ? fileName : fileName = res.data.name
                            res.data.fileName = fileName;
                            res.data.fileRandomName = res.data.name;
                            res.data.desciption = fileDescribe;
                            res.data.code = that.fileTypeCode;
                            res.data.fileTypeName = fileTypeName;
                            res.data.orderStatus = that.param.orderStatus;
                            res.data.orderNo = that.param.orderNo;
                            var config;
                            that.param.system ==="tradeOrder" ?
                                config={
                                    type:res.data.code,
                                    fileId:res.data.id,
                                    name:res.data.fileName,
                                    remark:res.data.desciption,
                                    orderNo:res.data.orderNo
                                } :
                                config= {
                                    code:res.data.code,
                                    fileId:res.data.id,
                                    fileName:res.data.fileName,
                                    desciption:res.data.desciption,
                                    orderNo:res.data.orderNo
                                };
                            if(that.param.orderNo) {
                                that.addOrderFile(JSON.stringify(config), function (rs) {
                                    if (rs.errorCode === 0) {
                                        $(document).promptBox({
                                            isDelay: true,
                                            contentDelay: '添加成功！',
                                            type: 'success'
                                        });
                                        that.orderFileData.push(res.data);
                                        that.getForEachData(that.orderFileData);
                                    } else {
                                        $(document).promptBox({
                                            isDelay: true,
                                            contentDelay: rs.msg,
                                            type: "errer",
                                            time: 3000
                                        });
                                    }
                                });
                            }else{
                                that.orderFileData.push(res.data);
                                that.getForEachData(that.orderFileData);
                            }
                            $("#addDataTr").hide();
                        }else{
                            $(document).promptBox({
                                isDelay: true,
                                contentDelay: res.msg,
                                type: "errer",
                                time: 3000
                            });
                        }
                    }
                });
            });

            $("#tableContainerId tbody").delegate(".textDelete","click", function(e){ //点击删除进行附件删除
                var trIndex = $(this).parents('td').parent('tr').index();
                var currentStatus = $(this).attr('data-status');

                if(currentStatus !== that.param.orderStatus && that.param.system !=="tradeOrder"){
                    return $(document).promptBox({
                        isDelay: true,
                        contentDelay: "该附件在之前状态下上传，不能删除！",
                        type: "errer",
                        time: 3000
                    });
                }
                $(document).promptBox({
                    title: '提示',
                    type: 'warning',
                    content: {
                        tip: '确认删除选中文件?'
                    },
                    operation: [
                        {
                            type: 'submit',
                            description: Lang.getValByKey('common', 'common_page_delete'),
                            application: 'delete',
                            operationEvent: function () {
                                that.delOrderFile(e.target.id, function(res){
                                    that.orderFileData && that.orderFileData.splice(trIndex,1);
                                    that.getForEachData(that.orderFileData);
                                    $(document).promptBox('closePrompt');
                                    $(document).promptBox({
                                        isDelay: true,
                                        contentDelay: '删除成功！',
                                        type: 'success'
                                    });
                                });
                            }
                        }
                    ]
                });
            });

            $("#tableContainerId tbody").delegate(".textPreview","click", function(e){ //点击预览按钮进行图片预览
                var tdDom = $(this).parents('td');

                var dataName = tdDom.attr('data-name'),
                    dataFileUrl = tdDom.attr('data-fileUrl'),
                    dataFileId = tdDom.attr('data-fileId'),
                    dataFileType = tdDom.attr('data-fileType');

                var typeImageFlag,
                    typePdfFlag,
                    pictures = [];

                if(dataFileType.includes("image")){
                    typeImageFlag = true;
                    typePdfFlag=false
                }else if(dataFileType.includes("pdf")){
                    typeImageFlag = false;
                    typePdfFlag=true
                }else{
                    return $(document).promptBox({
                        isDelay: true,
                        contentDelay: "该文件暂不支持预览！",
                        type: "errer",
                        time: 3000
                    });
                }
                var pictureCfg = {
                    name:dataName,
                    picUrl:dataFileUrl,
                    picUrlID:{
                        id:dataFileId,
                        name:dataName,
                        path:dataFileUrl,
                        type:dataFileType
                    },
                    typeImage:typeImageFlag,
                    typePdf:typePdfFlag
                };

                pictures.push(pictureCfg);
                $('#slides').picturePreview({pictureId : dataFileId}, pictures);
            });

            $("#tableContainerId tbody").delegate(".imgFilePic","click", function(e){//点击图片直接进行图片预览
                var tdDom = $(this).parents('td');

                var dataName = tdDom.attr('data-name'),
                    dataFileUrl = tdDom.attr('data-fileUrl'),
                    dataFileId = tdDom.attr('data-fileId'),
                    dataFileType = tdDom.attr('data-fileType');

                var pictures = [];
                var pictureCfg = {
                    name:dataName,
                    picUrl:dataFileUrl,
                    picUrlID:{
                        id:dataFileId,
                        name:dataName,
                        path:dataFileUrl,
                        type:dataFileType
                    },
                    typeImage:true,
                    typePdf:false
                };

                pictures.push(pictureCfg);
                $('#slides').picturePreview({pictureId : dataFileId}, pictures);
            });
        },

        getCurrentFileType :function(q){
            var that = this;

            q = q ? q : '';
            var config = {
                q: q,
                orderStatus:that.param.orderStatus
            };
            var data = that.getFileType(config);
            return data;
        },

        getCodeByName :function(name, data) {
            var that = this;

            if(!data) {
                data = that.getFileType()
            }
            if(!name) {
                return;
            }
            data = data.data;
            for(var index = 0; index < data.length; index++) {
                var currentName = data[index].name;
                if($.trim(currentName) == $.trim(name) || $.trim(data[index].name) == $.trim(name)) {
                    return  data[index].code
                }
            }
            return "无匹配结果";
        },

        progressHandlingFunction: function(e){
            var loaded = e.loaded,
                total = e.total;

            for (var i=0 ; i < loaded ; i= i+10){
                $('progress').attr({value : i , max : total});
                var percent = i / total*100;
                $('#progress').text(percent.toFixed(1)+ "%");
            }
        },

        checkUpload : function(flag){ //判断是否可以上传
            if(flag){
                $("#fileNameInp").css("border", "1px solid #BDBDBD");
                $(".uploadBtn").css("background-color", "#3BAFDA");
                $(".uploadBtn").css("border", "1px solid #3BAFDA");
                $(".uploadBtn").css("cursor", "pointer");
                $("#projectFile").css("cursor", "pointer");
                $("#projectFile").attr("disabled", false);
            }else{
                $("#fileNameInp").css("border", "1px solid #f00");
                $(".uploadBtn").css("background-color", "#ccc");
                $(".uploadBtn").css("border", "#ccc");
                $(".uploadBtn").css("cursor", "not-allowed");
                $("#projectFile").css("cursor", "not-allowed");
                $("#projectFile").attr("disabled", true);
            }
        },

        checkFileName : function (name,callBack){ //校验附件名称是否重复
            var that = this ;

            var config={
                orderNo:that.param.ckeckFileName.param.orderNo,
                fileName:name
            };
            var params = {
                url:that.param.ckeckFileName.url,
                type:that.param.ckeckFileName.type,
                data:config
            };
            var res = that.useHttp(params);

            callBack(JSON.parse(res));
        },

        delOrderFile :function (id,callBack){ //删除附件接口调用
            var that = this;
            var delUrl;

            if(that.param.system ==="tradeOrder"){
                delUrl = '/api/v1/trd/order/files/'+that.param.orderNo+'/'+id+'/delete'
            }else{
                delUrl = '/api/v1/order/files/'+that.param.orderNo+'/'+id+'/delete'
            }
            var params = {
                url:delUrl,
                type:that.param.delOrderFile.type,
                data:that.param.delOrderFile.param
            };
            var res = that.useHttp(params);
            callBack(JSON.parse(res));
        },

        addOrderFile :function (config,callBack){ //添加附件接口调用
            var that = this;

            var params = {
                url:that.param.addOrderFile.url,
                type: that.param.addOrderFile.type,
                data:config
            };
            var res = that.useHttp(params);
            callBack(JSON.parse(res));
        },

        getFileType:function(config){ //获取文件类型调用接口
            var that = this ;

            config ? config : config = { q: '',orderStatus:that.param.orderStatus};
            var params = {
                url: that.param.orderFileType.url,
                type: that.param.orderFileType.type,
                data:config
            };
            var resultData = JSON.parse(that.useHttp(params));
            return resultData
        },

        use: function(config, callback){
            $.ajax({
                url: config.url,
                type: "get",
                dataType: 'html',
                async:false,
                success: function(data){
                    if(config.type && config.type.toLowerCase() == 'css'){
                        var styleEle = document.createElement("style");
                        styleEle.innerHTML = data;
                        $('head')[0].append(styleEle);
                    }else if(config.type && config.type.toLowerCase() == 'html'){
                        $(config.append).html(data);
                    }
                }
            })
        },

        useHttp :function(param){
            return $.ajax({
                url: param.url,
                datatype: 'json',
                data:param.data,
                contentType:'application/json; charset=utf-8',
                type: param.type,
                cache: false,
                async: false
            }).responseText;
        }
    };

    $.fn.uploadBox = function (param){
        new plugin(this, param);

        return backResult
    }

})(jQuery, window, document);