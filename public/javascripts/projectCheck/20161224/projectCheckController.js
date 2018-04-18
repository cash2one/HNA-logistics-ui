easySpa.require([
    'public/common/pictureController.js',
    'widget/prompt',
    'widget/select',
    'widget/parseUrl',
    'widget/slimscroll/',
    'widget/slides',
], function () {
    app.controller('projectCheckCtrl', [
        '$scope',
        'projectCheckService',
        'projectCheckView',
        'pictureService',
        function ($scope, projectCheckService, projectCheckView, pictureService) {
            $scope.projectId = window.parseUrl.getParams().id;
            $scope.identityName = sessionStorage.getItem('identityName');
            $scope.identity = sessionStorage.getItem('identity');
            $scope.isPass = Number(sessionStorage.getItem('isPass'));
            $scope.projectAction = sessionStorage.getItem('projectAction');
            $scope.qaFiles = [];
            $scope.checkResult = 'qa';
            $scope.showCheckInput = false;
            $scope.questionId = '';
            $scope.checkResultOpinion = '';
            $scope.qaList = [];
            $scope.pictureModel = {
                edit: true, // 是否编辑状态
                uploadShow: true, // 是否显示上传按钮图标
                picture: [], // 图片存放地址
                accept:'image/jpg,image/jpeg,image/png,image/bmp,image/tiff,application/pdf'
            };
            var checkResultData = {
                data: [
                    {
                        name: '拒绝',
                        code: 'false',
                    },
                    {
                        name: '同意',
                        code: 'true',
                    },
                ],
            };
            selectFactory({
                data: checkResultData,
                id: 'checkResult',
                showTextField: 'name',
                attrTextField: {
                    'ng-value': 'code',
                },
                defaultText: '',
                attrTextId: function (code) {
                    $scope.checkResultCode = code;
                    $scope.$apply();
                },
                attrTextModel: function (value) {
                    $scope.checkResultName = value;
                    $scope.$apply();
                },
            });
    
            $scope.goback = function () {
                var backPath = sessionStorage.getItem('detailPath');
                top.location.href = 'http://' + location.host + backPath + '&tab=1';
            };
    
            $scope.getApprvoalInfo = function () {
                var type = sessionStorage.getItem('identityName');
                projectCheckService.getApprvoalInfo({ urlParams: { type: type }, seatParams: { projectId: $scope.projectId } }, function (res) {
                    $scope.approvalInfo = res.data;
                    $scope.qaList = res.data.projectQuestionDtoList;
                    var picList = res.data.projectQuestionDtoList.map(function (item) { return item.projectFileDtos; });
                    for (var i = 0, len = picList.length; i < len; i++) {
                        for (var j = 0; j < picList[i].length; j++) {
                            $scope.pictureModel.picture.push({
                                name: picList[i][j].fileName,
                                picUrl: picList[i][j].filePath,
                                picUrlID: {
                                    id: picList[i][j].fileId,
                                    path: picList[i][j].filePath,
                                    type: picList[i][j].contentType,
                                },
                            });
                        }
                    }
                    $scope.checkResultOpinion = res.data.msg;
                    $scope.isPass = res.data.isPass;
                    $scope.checkResult = res.data.isPass === 'null' ? 'qa' : res.data.isPass.toString();
                });
            };
    
            $scope.getFile = function (files) {
                for (var i = 0; i < files.length; i++) {
                    var result = pictureService.uploadFile($scope.pictureModel, files[i]);
                    if (!result) { return; }
                    if (result.errorlocal) {
                        $(document).promptBox({ isDelay: true, contentDelay: result.errorlocal, type: 'errer', manualClose: true });
                    } else {
                        $scope.uploadDisabled = true;
                        result.then(function (res) {
                            if (res.data.errorCode === 0) {
                                // res.data.data为图片对应的 picUrlID
                                $scope.uploadDisabled = false;
                                $scope.pictureModel = pictureService.updateModel($scope.pictureModel, res.data.data);
                                $scope.qaFiles.push(res.data.data);
                                $(document).promptBox({ isDelay: true, contentDelay: res.data.msg, type: 'success' });
                            } else {
                                $(document).promptBox({ isDelay: true, contentDelay: res.data.msg, type: 'errer', manualClose: true });
                            }
                        });
                    }
                }
            };
    
            $scope.getPictureUrl = function (fileid) {
                $('#slides').picturePreview({ pictureId: fileid }, $scope.pictureModel.picture);
            };
    
            $scope.delFile = function (index) {
                $(document).promptBox({
                    title: '提示',
                    type: 'success',
                    content: {
                        tip: '确认删除此文件?',
                    },
                    operation: [
                        {
                            type: 'submit',
                            description: Lang.getValByKey('common', 'common_pagination_confirm'),
                            application: 'confirm',
                            operationEvent: function () {
                                $scope.pictureModel.picture.splice(index, 1);
                                $scope.qaFiles.splice(index, 1);
                                $(document).promptBox('closePrompt');
                                $(document).promptBox({ isDelay: true, contentDelay: '删除成功！', type: 'success', manualClose: false });
                                $scope.$apply();
    
                                /* var questionId = e.target.parentNode.parentNode.parentNode.accessKey;
                                var parentIndex = e.target.parentNode.parentNode.parentNode.id;
                                $scope.qaList[parentIndex].projectFileDtos.splice(index, 1);
                                $scope.answerContent = $scope.qaList[parentIndex].answerContent;
                                $scope.fileIds = $scope.qaList[parentIndex].projectFileDtos.map(function (item) {
                                    return item.fileId;
                                });
                                projectCheckService.postAnswer({ seatParams: { projectId: $scope.projectId, questionId: $scope.questionId }, urlParams: { answerContent: $scope.answerContent, fileIds: $scope.fileIds.join(',') } }, function (res) {
                                    if (res.errorCode === 0) {
                                        $scope.getApprvoalInfo();
                                        $(document).promptBox('closePrompt');
                                        $(document).promptBox({ isDelay: true, contentDelay: '删除成功！', type: 'success', manualClose: false });
                                    } else {
                                        $(document).promptBox({ isDelay: true, contentDelay: res.msg, type: 'errer' });
                                    }
                                }); */
                            },
                        },
                    ],
                });
            };
    
            $scope.$watch('checkResult', function (newVal, oldVal) {
                if (newVal !== 'qa') {
                    $scope.opinionHolder = '';
                    $scope.formError = false;
                }
                if (newVal === 'qa' || oldVal === 'qa') {
                    $scope.checkResultOpinion = '';
                }
            });
            $scope.$watch('checkResultOpinion', function (newVal) {
                if (newVal !== '') {
                    $scope.formError = false;
                }
            });
    
            $scope.answerQuestion = function (id, index) {
                $scope.questionId = id;
                $scope.showCheckInput = true;
                var contentStr = $scope.qaList[index].content;
                contentStr = contentStr.indexOf('...') !== -1 ? contentStr.substr(contentStr.indexOf('...') + 3) : contentStr;
                $scope.opinionHolder = '回复主题：' + contentStr.substr(0, 10) + '...';
            };
    
            $scope.cancelAnswer = function () {
                $scope.questionId = '';
                $scope.opinionHolder = '';
                $scope.checkResultOpinion = '';
                $scope.showCheckInput = false;
            };
    
            $scope.postQuestion = function () {
                projectCheckService.postQuestion({ seatParams: { projectId: $scope.projectId }, urlParams: { content: $scope.checkResultOpinion, type: $scope.identityName } }, function (res) {
                    if (res.errorCode === 0) {
                        $scope.questionId = '';
                        $scope.opinionHolder = '';
                        $scope.showCheckInput = false;
                        $scope.getApprvoalInfo();
                        var qaContentHtml = $(window.frames.iframe.document).find('.check-qa');
                        qaContentHtml.scrollTop(qaContentHtml[0].scrollHeight);
                    } else {
                        $(document).promptBox({ isDelay: true, contentDelay: res.msg, type: 'errer' });
                    }
                });
            };
    
            $scope.postAnswer = function () {
                var fileIds = [];
                if ($scope.qaFiles.length) {
                    fileIds = $scope.qaFiles.map(function (item) { return item.id; });
                }
                // var type = $scope.identity === '0' ? 0 : $scope.identityName;
                projectCheckService.postAnswer({ seatParams: { projectId: $scope.projectId, questionId: $scope.questionId }, urlParams: { questionId: $scope.questionId, content: $scope.opinionHolder + $scope.checkResultOpinion, type: $scope.identityName, fileIds: fileIds.join(',') } }, function (res) {
                    if (res.errorCode === 0) {
                        $scope.questionId = '';
                        $scope.opinionHolder = '';
                        $scope.showCheckInput = false;
                        $scope.qaFiles = [];
                        $scope.getApprvoalInfo();
                        var qaContentHtml = $(window.frames.iframe.document).find('.check-qa');
                        qaContentHtml.scrollTop(qaContentHtml[0].scrollHeight);
                    } else {
                        $(document).promptBox({ isDelay: true, contentDelay: res.msg, type: 'errer' });
                    }
                });
            };
    
            $scope.checkDone = function () {
                if (!$scope.checkResultOpinion) {
                    $scope.formError = true;
                    return;
                }
                console.log($scope.checkResult, $scope.projectAction);
                if ($scope.checkResult === 'qa') {
                    if ($scope.projectAction === '2') {
                        if ($scope.questionId) {
                            $scope.postAnswer();
                        } else {
                            $scope.postQuestion();
                        }
                    }
                    if ($scope.projectAction === '1') {
                        $scope.postAnswer();
                    }
                } else {
                    var params = {
                        type: $scope.identityName,
                        msg: $scope.checkResultOpinion,
                        isPass: $scope.checkResult,
                    };
                    projectCheckService.postOpinion({ seatParams: { projectId: $scope.projectId }, urlParams: params }, function (res) {
                        if (res.errorCode === 0) {
                            $(document).promptBox({ isDelay: true, contentDelay: res.msg, type: 'success' });
                            if ($scope.checkResult === 'true') {
                                $scope.goback();
                            } else {
                                top.location.href = 'http://' + location.host + sessionStorage.getItem('managePath');
                            }
                        }
                    });
                }
            };
    
            $scope.getApprvoalInfo();
    
        },
    ]);
});

