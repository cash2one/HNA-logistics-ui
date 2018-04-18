!function(e,t,i,s){function a(t,s,a){this.w=e(i),this.el=e(t),this.options=e.extend({},d,s),this.init(a)}var o,n="ontouchstart"in i,l=function(){var e=i.createElement("div"),s=i.documentElement;if(!("pointerEvents"in e.style))return!1;e.style.pointerEvents="auto",e.style.pointerEvents="x",s.appendChild(e);var a=t.getComputedStyle&&"auto"===t.getComputedStyle(e,"").pointerEvents;return s.removeChild(e),!!a}(),d={listNodeName:"ol",itemNodeName:"li",rootClass:"dd",listClass:"dd-list",itemClass:"dd-item",dragClass:"dd-dragel",handleClass:"dd-handle",collapsedClass:"dd-collapsed",placeClass:"dd-placeholder",noDragClass:"dd-nodrag",emptyClass:"dd-empty",iconOpen:"icon-Open",iconClose:"icon-Close",iconSeat:"icon-inoperable",group:0,threshold:20,maxDepth:5,isRoot:!1,isSearch:!0,searchUrl:"",resetNode:"",searchInput:s,searchKeyNodes:s,searchTip:"",deleteNodes:s,addChildNodes:s,clickNode:s,loadFirstNode:s,collapseAllNode:s,childUrl:"",newItemUid:"",isMove:!1,isOperate:!1,id:"id",orgShortName:"orgShortName",name:"name",userCount:"userCount",parentId:"parentId",parameter:0,isTree:!0,treeScrollHeight:"",callback:function(){},newNodeText:"新增组织",maxDepthText:"当前组织只支持添加到第5级！"};a.prototype={init:function(i,s){var a=this,o={expandBtn:'button[data-action="expand"]',collapseBtn:'button[data-action="collapse"]',newNodes:"new-nodes",expandBtnHTML:'<button data-action="expand" class="'+a.options.iconOpen+' ic-open" type="button"></button>',collapseBtnHTML:'<button data-action="collapse" class="'+a.options.iconClose+' ic-close" type="button"></button>',seatBtnHTML:'<button data-action="seat" class="'+a.options.iconSeat+' ic-seat" type="button"></button>',collapseAllBtnHTML:'<button data-action="collapseAll" class="'+a.options.iconClose+' ic-close" type="button"></button>',newNodesHTML:'<li class="new-nodes dd-item dd3-item"><div class="dd3-content">'+a.options.newNodeText+"</div></li>"};this.options=e.extend({},o,a.options),1==a.options.isRoot?e.ajax({url:a.options.childUrl+0,type:"GET",async:!0,dataType:"json",success:function(e){0==e.errorCode&&a.dataInit(a.el,e.data,s)}}):a.dataInit(a.el,null,s),a.reset(),a.el.data("nestable-group",this.options.group),a.placeEl=e('<div class="'+a.options.placeClass+'"/>'),a.el.on("click","button",function(t){if(!a.dragEl){var i=e(t.currentTarget),s=i.data("action"),o=i.parent(a.options.itemNodeName),n=o.data("uid");"collapse"===s&&a.collapseItem(o,i),"expand"===s&&(a.expandItem(o),0==o.children("ol").find("."+a.options.itemClass).length&&a.appendChildData(o,n))}}),1==a.options.isSearch&&a.retrieval(),a.el.on("click","div.dd3-content",function(t){a.getNodes(e(this))}),a.el.on("click","li.add-node",function(t){a.addNewNodes(e(this))}),a.el.on("click","li.delete-node",function(t){var i=e(this).parent().parent().parent();a.el.find(".dd-item").removeClass("click"),i.addClass("click"),a.el.find(".dd3-content").removeClass("active"),i.children("div.dd3-content").addClass("active");var s,o=i.find(".user-count span").text();i.hasClass("dd-collapsed")&&"block"!==i.children("ol").css("display")?s=1:(s=i.find(".dd-item").length,1==i.find(".dd-item").length&&i.find(".dd-item").hasClass("new-nodes")&&(s=0)),a.el.find(".new-nodes").remove(),a.options.deleteNodes(i.data("uid"),s,Number(o),i.parent().parent())});var l=function(t){var i=e(t.target);if(!i.hasClass(a.options.handleClass)){if(i.closest("."+a.options.noDragClass).length)return;i=i.closest("."+a.options.handleClass)}i.length&&!a.dragEl&&(a.isTouch=/^touch/.test(t.type),a.isTouch&&1!==t.touches.length||(t.preventDefault(),a.dragStart(t.touches?t.touches[0]:t)))},d=function(e){a.dragEl&&(e.preventDefault(),a.dragMove(e.touches?e.touches[0]:e))},r=function(e){a.dragEl&&(e.preventDefault(),a.dragStop(e.touches?e.touches[0]:e,i))};if(1==a.options.isMove);else{n&&(a.el[0].addEventListener("touchstart",l,!1),t.addEventListener("touchmove",d,!1),t.addEventListener("touchend",r,!1),t.addEventListener("touchcancel",r,!1));a.el.on("mousedown",l),a.w.on("mousemove",d),a.w.on("mouseup",r)}},dataInit:function(e,t,i){var s=this,a=s.options.isRoot;if(null==t&&s.options.callback(!1),e.addClass("dd"),1==a){s.appendItem(e,t),s.appendChildData(s.el.children().children("li"),1);var o=s.el.find("."+s.options.itemClass).first();s.getFirstNodes(o),s.el.find(".operate").eq(0).children().find(".delete-node").remove(),s.el.find("."+s.options.itemClass).children("."+s.options.handleClass).remove()}else s.appendChildData(e,s.options.parameter,i);1==s.options.isRoot&&(s.el.find("."+s.options.handleClass).remove(),s.el.children().children().find(".operate").addClass("root-item"),s.el.children().children().find(".dd3-content").addClass("root"))},addNewNodes:function(t){var s=this,a=t.parent().parent(),o=a.parent("li"),n='<input type="hidden" name="organizationId" data-value=""/>';e(n).remove(),s.el.after(n),e('input[name="organizationId"]').data("value",o.data("uid")),t.parents("ol").length>4?e(i).promptBox({isDelay:!0,contentDelay:s.options.maxDepthText,type:"warning",manualClose:!0}):(s.appendChildData(o,o.data("uid"),!0),o.addClass("dd-collapsed"),s.options.addChildNodes(o.data("uid")))},appendChildData:function(t,s,a){s||(s=0);var o=this,n=o.options.childUrl+s;e.ajax({url:n,type:"GET",async:!0,dataType:"json",success:function(s){0==s.errorCode?o.appendItem(t,s.data,a):e(i).promptBox({isDelay:!0,contentDelay:s.msg,type:"errer",manualClose:!0})}})},appendItem:function(t,i,a){t.hasClass("dd")&&t.find("ol").remove();for(var o=this,n=e('<ol class="dd-list"></ol>'),l="",d=0;d<i.length;d++){1==i[d].leaf?(l+='<li class="dd-item dd3-item"  title="'+i[d][o.options.orgShortName]+'" data-uid="'+i[d][o.options.id]+'">',1==o.options.isTree&&(l+=this.options.seatBtnHTML)):(l+='<li class="dd-item dd3-item dd-collapsed" title="'+i[d][o.options.orgShortName]+'"  data-uid="'+i[d][o.options.id]+'">',1==o.options.isTree&&(l+=this.options.expandBtnHTML,l+='<button class="'+o.options.iconClose+'" data-action="collapse" type="button" style="display:none;"></button>'));var r=i[d][o.options.userCount]==s?"":i[d][o.options.userCount];1==o.options.isRoot?l+='<div class="dd3-content" title="'+i[d][o.options.orgShortName]+'" data-name="'+i[d][o.options.orgShortName]+'" data-orgname="'+i[d][o.options.orgShortName]+'"><span class="item-text">'+i[d][o.options.orgShortName]+'</span><div class="user-count"><span>'+r+"</span></div></div>":0==d&&0==i[0][o.options.parentId]?(l+='<div class="dd3-content active" title="'+i[d][o.options.orgShortName]+'" data-name="'+i[d][o.options.orgShortName]+'" data-orgname="'+i[d][o.options.orgShortName]+'"><span class="item-text">'+i[d][o.options.orgShortName]+'</span><div class="user-count"><span>'+r+"</span></div></div>","object"==typeof a?o.options.loadFirstNode(a.value):o.options.loadFirstNode(i[0][o.options.id])):l+='<div class="dd3-content" title="'+i[d][o.options.orgShortName]+'"  data-name="'+i[d][o.options.orgShortName]+'" data-orgname="'+i[d][o.options.orgShortName]+'"><span class="item-text">'+i[d][o.options.orgShortName]+'</span><div class="user-count"><span>'+r+"</span></div></div>",1!=o.options.isOperate&&(l+='<a class="operate" data-parent="'+i[d][o.options.parentId]+'"><ul>',1==o.options.isTree&&(l+='<li class="add-node icon-add"></li>'),i[d].isSystem||(l+='<li class="delete-node icon-delete"></li>'),l+="</ul></a>"),0==o.options.isMove&&(l+='<a class="dd-handle handle-move icon-remov"></a>'),1!=i[d].leaf&&(l+='<ol class="dd-list" style="display:none;"></ol>'),l+="</li>"}if(t.hasClass("dd-item")&&t.find("ol").remove(),n.append(l),t.append(n),this.treeIsRoot(),o.mouseoverEvent(),1==a)t.children(o.options.expandBtn).hide(),t.children(o.options.collapseBtn).show(),e("."+o.options.newNodes).length>0&&e("."+o.options.newNodes).remove(),t.addClass("click"),t.children("ol").append(o.options.newNodesHTML),o.el.find(".dd3-content").removeClass("active"),e("."+o.options.newNodes).find(".dd3-content").addClass("active"),t.removeClass("click"),this.treeIsRoot(),e(".new-nodes").offset().top-40>o.scrollHeight().height()?o.el.scrollTop(80+40*(e(".dd-item").length+1)):e(".new-nodes").offset().top<200?o.el.scrollTop(80):0==o.el.scrollTop()?o.el.scrollTop(0):o.el.scrollTop(0+o.el.scrollTop());else if("object"==typeof a){var p=e('.dd-item[data-uid="'+a.value+'"]');if(o.el.find(".dd3-content").removeClass("active"),p.children(".dd3-content").addClass("active"),1==p.parent().find(".dd-item").length){var c=p.parent().parent().children('button[data-action="seat"]');c.after('<button style="display: none;" data-action="expand" class="'+o.options.iconOpen+' ic-open" type="button"></button>'),c.after(o.options.collapseBtnHTML),c.remove()}e(".dd-item").each(function(t){e(".dd-item").eq(t).data("uid")==a.value&&(e(".dd-item").eq(t).offset().top-40>o.scrollHeight().height()?o.el.scrollTop(80+40*(t+1)):o.el.scrollTop(0))})}else if("number"==typeof a){var p=e('.dd-item[data-uid="'+a+'"]');if(o.el.find(".dd3-content").removeClass("active"),p.children(".dd3-content").addClass("active"),0==p.find(".dd-item").length){var h=p.children('button[data-action="collapse"]');h.after(o.options.seatBtnHTML),p.children('button[data-action="expand"]').remove(),h.remove()}e(".dd-item").each(function(t){e(".dd-item").eq(t).data("uid")==a&&(e(".dd-item").eq(t).offset().top-40>o.scrollHeight().height()?o.el.scrollTop(80+40*(t+1)):o.el.scrollTop(0))})}},mouseoverEvent:function(){function i(){a.el.slimscroll({height:a.scrollHeight().height()}),a.el.slimscroll({height:a.scrollHeight().height()})}var s,a=this;e(".dd3-content").mouseenter(function(){s=e(this).next(".operate"),s.show(),e(this).hasClass("active")&&e(this).parent().addClass("click"),s.next("."+a.options.handleClass).show().mouseenter(function(){s.show(),s.next("."+a.options.handleClass).show(),e(this).parent().children(".dd3-content").hasClass("active")&&e(this).parent().addClass("click")}),s.mouseenter(function(){s.show(),s.next("."+a.options.handleClass).show(),e(this).parent().children(".dd3-content").hasClass("active")&&e(this).parent().addClass("click")})}).mouseleave(function(){s=e(this).next(".operate"),s.hide(),e(this).hasClass("active")&&e(this).parent().removeClass("click"),s.next("."+a.options.handleClass).hide().mouseleave(function(){s.hide(),s.next("."+a.options.handleClass).hide(),e(this).parent().children(".dd3-content").hasClass("active")&&a.el.find(".dd-item").removeClass("click")}),s.mouseleave(function(){s.hide(),s.next("."+a.options.handleClass).hide(),e(this).parent().children(".dd3-content").hasClass("active")&&a.el.find(".dd-item").removeClass("click")})}),i(),e(t).on("resize",i)},scrollHeight:function(){var e,t=this;return t.options.treeScrollHeight.length>1?t.options.treeScrollHeight.each(function(i){0!=t.options.treeScrollHeight.eq(i).height()&&(e=t.options.treeScrollHeight.eq(i))}):e=t.options.treeScrollHeight,e},getNodes:function(t){var i=this;i.options.searchInput!=s&&i.options.searchInput.val(""),i.el.find(".dd3-content").removeClass("active"),t.addClass("active"),e(".list-box").html(""),i.el.find(".dd-item").removeClass("click"),t.parent().addClass("click"),i.options.clickNode!=s&&i.options.clickNode(t.parent(".dd-item").data("uid"))},getFirstNodes:function(e){var t=this;e.children(".dd3-content").addClass("active"),1==t.options.isSearch&&t.options.loadFirstNode(e.data("uid"))},resetTreeGroup:function(){var t=this;t.el.empty(),1==t.options.isRoot?e.ajax({url:t.options.childUrl+0,type:"GET",async:!0,dataType:"json",success:function(e){0==e.errorCode&&t.dataInit(t.el,e.data)}}):t.dataInit(t.el,null)},resetSearchNode:function(){var t,i=this;"object"==typeof(t=0==i.options.newItemUid.length?e(i.options.newItemUid.selector).data():i.options.newItemUid.data())&&(t=t.value);var s=i.options.resetNode+t,a=!1;!function(){i.resetTreeGroup(),a=!0}(),1==a&&e.ajax({url:s,type:"GET",async:!0,dataType:"json",success:function(e){if(0==e.errorCode){var s=e.data.parentIds;1==i.options.isRoot?s.splice(0,0,1):s.splice(0,0,0),i.appendRetrievalChildData(i.el.find("li[data-uid="+s[0]+"]"),s[0],s,t)}}})},resetAllGroup:function(){var t,i=this;i.options.childUrl;t=0==i.options.newItemUid.length?e(i.options.newItemUid.selector).data():i.options.newItemUid.data(),i.el.empty(),i.init(null,t)},resetGroup:function(){var t,i=this,s=e('input[name="organizationId"]').data();t=0==i.options.newItemUid.length?e(i.options.newItemUid.selector).data():i.options.newItemUid.data(),s="object"==typeof s?s.value:"",i.appendChildData(e('.dd-item[data-uid="'+s+'"]'),s,t),e('.dd-item[data-uid="'+s+'"]').addClass("dd-collapsed"),e(".new-nodes").remove(),this.treeIsRoot()},resetDeleteGroup:function(){var t,i=this;"object"==typeof(t=0==i.options.newItemUid.length?e(i.options.newItemUid.selector).data():i.options.newItemUid.data())&&(t=t.value);var s=e('.dd-item[data-uid="'+t+'"]').parent().parent().data("uid");i.appendChildData(e('.dd-item[data-uid="'+s+'"]'),s,t)},retrieval:function(){function a(e,i){var s=c.find("li"),a=e||t.event,n=a.keyCode;if(n>=65&&n<=90||n>=48&&n<=57||n>=96&&n<=111||n>=186&&n<=222||8==n||46==n||32==n)o(i),-1!=m&&(m=-1);else if(38==n||40==n)40==n&&(m++,-1!=m&&s.eq(m).removeClass("active"),m==s.length&&(m=0)),38==n&&(-1!=m?(s.eq(m).removeClass("active"),m--):m=s.length-1,-1==m&&(m=s.length-1)),s.removeClass("active"),s.eq(m).addClass("active"),d=s.eq(m).text(),p.val(d),c.scrollTop(26*m),26*m>200?c.scrollTop(26*m):c.scrollTop(0);else if(13==n){if(-1!=m){d=s.eq(m).text(),p.val(d);var h=-1==s.eq(m).data("pids").toString().indexOf(",")?s.eq(m).data("pids").toString():c.find(".active").data("pids").split(","),u=c.find(".active").data("sid"),f=1==h?h:h[0];r.appendRetrievalChildData(r.el.find("li[data-uid="+f+"]"),f,h,u,c),m=-1}else d=p.val(),p.val(d),p.get(0).blur(),l(i);c.slimscroll({height:0})}}function o(t){var a,o=r.el.find(".dd3-content.active").parent().data("uid")||0;""!=t?t!=s&&0!=t.length&&(a=r.options.searchUrl.indexOf("usergroups")>-1?r.options.searchUrl+"?q="+t:r.options.searchUrl+"?q="+t+"&porgid="+o,e.ajax({url:a,type:"GET",async:!0,dataType:"json",success:function(s){function a(e,t){return t=t.toLowerCase(),t.replace(e,function(e){return e.toUpperCase()})}if(0==s.errorCode){var o=s.data;c.empty(),c.show();var l="";if(null!=o){if(0==o.length){c.slimscroll({height:30});var d=Lang.getValByKey("common","common_tree_search");c[0].innerHTML='<li><span style="color: red;">'+d+"</span></li>"}else if(0!=o.length){c.show();for(var r=0;r<o.length;r++){var p=0==o[r].parentIds.length?0:o[r].parentIds,h=/[a-z]/i,m=/[A-Z]/g,u=1==h.test(o[r].name)?a(m,o[r].name):o[r].name,f=1==h.test(o[r].shortName)?a(m,o[r].shortName):o[r].shortName,v=1==h.test(o[r].code)?a(m,o[r].code):o[r].code;t=1==h.test(t)?a(m,t):t,-1!=u.indexOf(t)?l+='<li data-sid="'+o[r].id+'" data-pids="'+p+'"><span>'+o[r].name+"</span></li>":-1!=f.indexOf(t)?l+='<li data-sid="'+o[r].id+'" data-pids="'+p+'"><span>'+o[r].shortName+"</span></li>":-1!=v.indexOf(t)&&(l+='<li data-sid="'+o[r].id+'" data-pids="'+p+'"><span>'+o[r].code+"</span></li>")}c[0].innerHTML=l,c.slimscroll({height:200}),c.find("li").first().addClass("active"),n()}}else c.slimscroll({height:0}),c.hide(),c[0].innerHTML=""}else e(i).promptBox({isDelay:!0,contentDelay:s.msg,type:"errer",manualClose:!0})}})):(c[0].innerHTML="",c.hide(),c.slimscroll({height:0}))}function n(){c.on("mouseenter","li",function(t){c.find("li").removeClass("active"),e(this).addClass("active")}),c.on("click","li",function(){p.val(e(this).text());var t=[];-1==e(this).data("pids").toString().indexOf(",")?t.push(e(this).data("pids").toString()):t=e(this).data("pids").split(",");var i=e(this).data("sid"),s=-1==e(this).data("pids").toString().indexOf(",")?t:t[0];r.appendRetrievalChildData(r.el.find("li[data-uid="+s+"]"),s,t,i,c),c.slimscroll({height:0})})}function l(t){var s=r.el.find(".dd3-content.active").parent().data("uid")||0;""!=t&&e.ajax({url:r.options.searchUrl+"?q="+t+"&porgid="+s,type:"GET",async:!0,dataType:"json",success:function(s){if(0==s.errorCode)if(null!=s.data){if(0!=s.data.length){c.empty();var a=s.data[0].id,o=s.data[0].parentIds;r.appendRetrievalChildData(r.el.find("li[data-uid="+o[0]+"]"),o[0],o,a,c),r.options.searchInput.val(t)}}else e(i).promptBox({isDelay:!0,contentDelay:r.options.searchTip,type:"errer",manualClose:!0});else e(i).promptBox({isDelay:!0,contentDelay:s.msg,type:"errer",manualClose:!0})}})}var d,r=this,p=r.options.searchInput,c=e('<ul class="press-word list-box" style="display:none;"></ul>');p.next(".slimScrollDiv").length>0&&(p.next(".slimScrollDiv").remove(),p.next("i").remove()),p.after(e('<i class="icon-search search-group"></i>')),p.after(c);var h=Lang.getValByKey("common","common_tree_search");p.on("mouseenter",function(e){0!=c.find("li").length&&(c.show(),1==c.find("span").length&&c.find("span").text()==h?c.slimscroll({height:30}):c.slimscroll({height:200})),a(e,p.val())}).on("mouseleave",function(){c.hide(),c.slimscroll({height:0})}),c.on("mouseenter",function(){c.show(),1==c.find("span").length&&c.find("span").text()==h?c.slimscroll({height:30}):c.slimscroll({height:200})}).on("mouseleave",function(){c.hide(),e(".slimScrollBar").remove(),c.slimscroll({height:0})}),p.on("keyup",function(e){a(e,p.val())}),e(".search-group").on("click",function(){l(p.val())});var m=-1;this.treeIsRoot()},appendRetrievalChildData:function(t,a,o,n,l){var d,r=o.length,p=this,c=p.options.childUrl+a,h=[];return r--,"string"==typeof o?h.push(o):h=o,d=o.length-r-1,p.el.find("li[data-uid="+h[d]+"]").find('button[data-action="expand"]').hide(),p.el.find("li[data-uid="+h[d]+"]").find('button[data-action="collapse"]').show(),r>-1&&e.ajax({url:c,type:"GET",async:!0,dataType:"json",success:function(a){0==a.errorCode?(l!=s&&l.hide(),p.appendItem(t,a.data),1==o.length&&p.options.searchKeyNodes(n),l!=s&&l.empty(),e(".dd3-content").removeClass("active"),e(".dd-item[data-uid="+n+"]").children(".dd3-content").addClass("active"),h.shift(),p.appendRetrievalChildData(p.el.find("li[data-uid="+h[d]+"]"),h[d],h,n),e(".dd-item[data-uid="+n+"]")[0]!=s&&e(".dd-item").each(function(t){e(".dd-item").eq(t).data("uid")==n&&(e(".dd-item").eq(t).offset().top-40>p.scrollHeight().height()?p.el.scrollTop(80+40*(t+1)):p.el.scrollTop(0))})):e(i).promptBox({isDelay:!0,contentDelay:a.msg,type:"errer",manualClose:!0})}}),r},serialize:function(){var t=this;return step=function(i,s){var a=[];return i.children(t.options.itemNodeName).each(function(){var i=e(this),o=e.extend({},i.data()),n=i.children(t.options.listNodeName);n.length&&(o.children=step(n,s+1)),a.push(o)}),a},step(t.el.find(t.options.listNodeName).first(),0)},serialise:function(){return this.serialize()},reset:function(){this.mouse={offsetX:0,offsetY:0,startX:0,startY:0,lastX:0,lastY:0,nowX:0,nowY:0,distX:0,distY:0,dirAx:0,dirX:0,dirY:0,lastDirX:0,lastDirY:0,distAxX:0,distAxY:0},this.isTouch=!1,this.moving=!1,this.dragEl=null,this.dragRootEl=null,this.dragDepth=0,this.hasNewRoot=!1,this.pointEl=null},treeIsRoot:function(){var t=this.options.isRoot,i=this;1==t&&(this.el.children().children().children().find('button[data-action="collapseAll"]')&&this.el.children().children().children('button[data-action="collapseAll"]').remove(),this.el.children().children().append(i.options.collapseAllBtnHTML),this.el.children().children().children('[data-action="collapse"]').remove(),this.el.children().children().children('[data-action="expand"]').remove(),e('button[data-action="collapseAll"]').on("click",function(){i.buttonCollapseAll(),i.options.collapseAllNode!=s&&i.options.collapseAllNode(1)}))},expandItem:function(e){e.removeClass(this.options.collapsedClass),e.children('[data-action="expand"]').hide(),e.children('[data-action="collapse"]').show(),e.children(this.options.listNodeName).show()},collapseItem:function(e,t){e.children(this.options.listNodeName).length&&(e.addClass(this.options.collapsedClass),e.children('[data-action="collapse"]').hide(),e.children('[data-action="expand"]').show(),e.children(this.options.listNodeName).hide()),t!=s&&t.parent().parent().parent().siblings().find("ol").remove(),this.treeIsRoot()},expandAll:function(){var t=this;t.el.find(t.options.itemNodeName).each(function(){t.expandItem(e(this))})},collapseAll:function(t){var i=this,s=this.options.isRoot;i.el.find(i.options.itemNodeName).each(function(){1==s?(i.collapseItem(e(this).children(),t),e(this).children('[data-action="expand"]').show(),e(this).children('[data-action="collapse"]').hide()):i.collapseItem(e(this),t)}),1==s&&i.expandItem(this.el.children().children("li")),this.treeIsRoot()},buttonCollapseAll:function(){var t=this,i=this.options.isRoot;t.el.find(t.options.itemNodeName).each(function(){t.collapseItem(e(this))}),1==i&&t.expandItem(this.el.children().children("li")),this.treeIsRoot(),e(".dd3-content").removeClass("active"),t.el.children().children().children(".dd3-content").addClass("active")},setParent:function(t){t.children(this.options.listNodeName).length&&(t.prepend(e(this.options.expandBtnHTML)),t.prepend(e(this.options.collapseBtnHTML)),t.find('button[data-action="seat"]').remove()),t.children('[data-action="expand"]').hide(),this.treeIsRoot()},unsetParent:function(t){t.removeClass(this.options.collapsedClass),t.children("[data-action]").remove(),t.children(this.options.listNodeName).remove(),t.prepend(e(this.options.seatBtnHTML))},dragStart:function(t){var a=this.mouse,n=e(t.target),l=n.closest(this.options.itemNodeName);this.placeEl.css("height",l.height()),a.offsetX=t.offsetX!==s?t.offsetX:t.pageX-n.offset().left,a.offsetY=t.offsetY!==s?t.offsetY:t.pageY-n.offset().top,a.startX=a.lastX=t.pageX,a.startY=a.lastY=t.pageY,this.dragRootEl=this.el,this.dragEl=e(i.createElement(this.options.listNodeName)).addClass(this.options.listClass+" "+this.options.dragClass),this.dragEl.css("width",l.width()),l.after(this.placeEl),l[0].parentNode.removeChild(l[0]),l.appendTo(this.dragEl),e(i.body).append(this.dragEl),this.dragEl.css({left:t.pageX-a.offsetX-e("."+this.options.itemClass).width()+60,top:t.pageY-a.offsetY}),o=this.placeEl.prev().data("uid"),this.el.find("li.dd-item").removeClass("moving"),this.dragEl.children().addClass("moving");var d,r,p=this.dragEl.find(this.options.itemNodeName);for(d=0;d<p.length;d++)(r=e(p[d]).parents(this.options.listNodeName).length)>this.dragDepth&&(this.dragDepth=r)},dragStop:function(t,s){var a=this,n=this.dragEl.children(this.options.itemNodeName).first();n[0].parentNode.removeChild(n[0]);var l=[],d=[];if(this.placeEl.parent().parent().find(".dd3-content").each(function(){l.push(e(this).text()),d.push(e(this).data("name"))}),-1==e.inArray(n.find(".dd3-content").text(),l)||-1==e.inArray(n.find(".dd3-content").data("name"),d)){var r=this.placeEl.prev().data("uid");a.placeEl.replaceWith(n),a.placeEl.remove(),o!=r&&(a.el.trigger("change"),a.hasNewRoot&&a.dragRootEl.trigger("change")),a.reset()}else e(i).promptBox({isDelay:!0,contentDelay:Lang.getValByKey("widget/nestable","nestable_prompt_tip"),type:"errer",manualClose:!0}),a.resetTreeGroup()},dragMove:function(s){var a,o,n,d,r,p=this.options,c=this.mouse;this.dragEl.css({left:s.pageX-c.offsetX-e("."+this.options.itemClass).width()+60,top:s.pageY-c.offsetY}),c.lastX=c.nowX,c.lastY=c.nowY,c.nowX=s.pageX,c.nowY=s.pageY,c.distX=c.nowX-c.lastX,c.distY=c.nowY-c.lastY,c.lastDirX=c.dirX,c.lastDirY=c.dirY,c.dirX=0===c.distX?0:c.distX>0?1:-1,c.dirY=0===c.distY?0:c.distY>0?1:-1;var h=Math.abs(c.distX)>Math.abs(c.distY)?1:0;if(!c.moving)return c.dirAx=h,void(c.moving=!0);if(c.dirAx!==h?(c.distAxX=0,c.distAxY=0):(c.distAxX+=Math.abs(c.distX),0!==c.dirX&&c.dirX!==c.lastDirX&&(c.distAxX=0),c.distAxY+=Math.abs(c.distY),0!==c.dirY&&c.dirY!==c.lastDirY&&(c.distAxY=0)),c.dirAx=h,c.dirAx&&c.distAxX>=p.threshold){if(c.distAxX=0,n=this.placeEl.prev(p.itemNodeName),c.distX>0&&n.length&&!n.hasClass(p.collapsedClass)){a=n.find(p.listNodeName).last(),r=this.placeEl.parents(p.listNodeName).length;this.dragEl.children(this.options.itemNodeName).first().hasClass(p.collapsedClass)||r+this.dragDepth<=p.maxDepth&&(a.length?(a=n.children(p.listNodeName).last(),a.append(this.placeEl)):(a=e("<"+p.listNodeName+"/>").addClass(p.listClass),a.append(this.placeEl),n.append(a),this.setParent(n)))}if(c.distX<0){d=this.placeEl.next(p.itemNodeName);1==this.options.isRoot?1==this.placeEl.parents("li").length?this.placeEl.replaceWith(this.placeEl):1==this.placeEl.parents("ol").length?this.placeEl.replaceWith(this.placeEl):(o=this.placeEl.parent(),this.placeEl.closest(p.itemNodeName).after(this.placeEl),o.children().length||this.unsetParent(o.parent())):d.length||(o=this.placeEl.parent(),this.placeEl.closest(p.itemNodeName).after(this.placeEl),o.children().length||this.unsetParent(o.parent()))}}var m=!1;if(l||(this.dragEl[0].style.visibility="hidden"),this.pointEl=e(i.elementFromPoint(s.pageX-i.body.scrollLeft,s.pageY-(t.pageYOffset||i.documentElement.scrollTop))),l||(this.dragEl[0].style.visibility="visible"),this.pointEl.hasClass(p.handleClass)&&(this.pointEl=this.pointEl.parent(p.itemNodeName)),this.pointEl.hasClass(p.emptyClass))m=!0;else if(!this.pointEl.length||!this.pointEl.hasClass(p.itemClass))return;var u=this.pointEl.closest("."+p.rootClass),f=this.dragRootEl.data("nestable-id")!==u.data("nestable-id");if(!c.dirAx||f||m){if(f&&p.group!==u.data("nestable-group"))return;if((r=this.dragDepth-1+this.pointEl.parents(p.listNodeName).length)>p.maxDepth)return;var v=s.pageY<this.pointEl.offset().top+this.pointEl.height()/2;o=this.placeEl.parent(),m?(a=e(i.createElement(p.listNodeName)).addClass(p.listClass),a.append(this.placeEl),this.pointEl.replaceWith(a)):v?this.pointEl.parent().parent().hasClass("dd")&&1==this.options.isRoot?this.placeEl.replaceWith(this.placeEl):this.pointEl.before(this.placeEl):this.pointEl.after(this.placeEl),o.children().length||this.unsetParent(o.parent()),this.dragRootEl.find(p.itemNodeName).length||this.dragRootEl.append('<div class="'+p.emptyClass+'"/>'),f&&(this.dragRootEl=u,this.hasNewRoot=this.el[0]!==this.dragRootEl[0])}}},e.fn.nestable=function(t,i){var s=this,o=this;return s.each(function(){var s=e(this).data("nestable");s?"string"==typeof t&&"function"==typeof s[t]&&(o=s[t]()):(e(this).data("nestable",new a(this,t,i)),e(this).data("nestable-id",(new Date).getTime()))}),o||s}}(window.jQuery||window.Zepto,window,document);