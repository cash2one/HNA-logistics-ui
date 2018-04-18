!function(e,t){if(e.cleanData){var i=e.cleanData;e.cleanData=function(t){for(var n,r=0;null!=(n=t[r]);r++)try{e(n).triggerHandler("remove")}catch(e){}i(t)}}else{var n=e.fn.remove;e.fn.remove=function(t,i){return this.each(function(){return i||(!t||e.filter(t,[this]).length)&&e("*",this).add([this]).each(function(){try{e(this).triggerHandler("remove")}catch(e){}}),n.call(e(this),t,i)})}}e.widget=function(t,i,n){var r,a=t.split(".")[0];t=t.split(".")[1],r=a+"-"+t,n||(n=i,i=e.Widget),e.expr[":"][r]=function(i){return!!e.data(i,t)},e[a]=e[a]||{},e[a][t]=function(e,t){arguments.length&&this._createWidget(e,t)};var o=new i;o.options=e.extend(!0,{},o.options),e[a][t].prototype=e.extend(!0,o,{namespace:a,widgetName:t,widgetEventPrefix:e[a][t].prototype.widgetEventPrefix||t,widgetBaseClass:r},n),e.widget.bridge(t,e[a][t])},e.widget.bridge=function(i,n){e.fn[i]=function(r){var a="string"==typeof r,o=Array.prototype.slice.call(arguments,1),s=this;return r=!a&&o.length?e.extend.apply(null,[!0,r].concat(o)):r,a&&"_"===r.charAt(0)?s:(a?this.each(function(){var n=e.data(this,i),a=n&&e.isFunction(n[r])?n[r].apply(n,o):n;if(a!==n&&a!==t)return s=a,!1}):this.each(function(){var t=e.data(this,i);t?t.option(r||{})._init():e.data(this,i,new n(r,this))}),s)}},e.Widget=function(e,t){arguments.length&&this._createWidget(e,t)},e.Widget.prototype={widgetName:"widget",widgetEventPrefix:"",options:{disabled:!1},_createWidget:function(t,i){e.data(i,this.widgetName,this),this.element=e(i),this.options=e.extend(!0,{},this.options,this._getCreateOptions(),t);var n=this;this.element.bind("remove."+this.widgetName,function(){n.destroy()}),this._create(),this._trigger("create"),this._init()},_getCreateOptions:function(){return e.metadata&&e.metadata.get(this.element[0])[this.widgetName]},_create:function(){},_init:function(){},destroy:function(){this.element.unbind("."+this.widgetName).removeData(this.widgetName),this.widget().unbind("."+this.widgetName).removeAttr("aria-disabled").removeClass(this.widgetBaseClass+"-disabled ui-state-disabled")},widget:function(){return this.element},option:function(i,n){var r=i;if(0===arguments.length)return e.extend({},this.options);if("string"==typeof i){if(n===t)return this.options[i];r={},r[i]=n}return this._setOptions(r),this},_setOptions:function(t){var i=this;return e.each(t,function(e,t){i._setOption(e,t)}),this},_setOption:function(e,t){return this.options[e]=t,"disabled"===e&&this.widget()[t?"addClass":"removeClass"](this.widgetBaseClass+"-disabled ui-state-disabled").attr("aria-disabled",t),this},enable:function(){return this._setOption("disabled",!1)},disable:function(){return this._setOption("disabled",!0)},_trigger:function(t,i,n){var r,a,o=this.options[t];if(n=n||{},i=e.Event(i),i.type=(t===this.widgetEventPrefix?t:this.widgetEventPrefix+t).toLowerCase(),i.target=this.element[0],a=i.originalEvent,a)for(r in a)r in i||(i[r]=a[r]);return this.element.trigger(i,n),!(e.isFunction(o)&&!1===o.call(this.element[0],i,n)||i.isDefaultPrevented())}}}(jQuery),function(e){"use strict";"function"==typeof define&&define.amd?define(["jquery"],e):e(jQuery)}(function(e,t){"use strict";e.widget("mf.manifest",{options:{formatDisplay:function(e,t,i){return i?i.html():e},formatRemove:function(){return"x"},formatValue:function(e,t,i,n){return n?n.text():e},marcoPolo:!1,onAdd:null,onChange:null,onHighlight:null,onHighlightRemove:null,onRemove:null,onSelect:null,onSelectRemove:null,required:!1,separator:",",values:null,valuesName:null},_marcoPoloOptions:function(){var e=this,t=e.options;return{onFocus:function(){t.marcoPolo.onFocus&&t.marcoPolo.onFocus.call(this),e._resizeInput()},onRequestAfter:function(){e.$container.parent().removeClass("mf_busy"),t.marcoPolo.onRequestAfter&&t.marcoPolo.onRequestAfter.call(this)},onRequestBefore:function(){e.$container.parent().addClass("mf_busy"),t.marcoPolo.onRequestBefore&&t.marcoPolo.onRequestBefore.call(this)},onSelect:function(i,n){var r=!0;t.marcoPolo.onSelect&&(r=t.marcoPolo.onSelect.call(this,i,n)),!1!==r&&e.add(i,n,!0,!1)},required:t.required}},keys:{BACKSPACE:8,DELETE:46,DOWN:40,END:35,ENTER:13,HOME:36,LEFT:37,RIGHT:39,UP:38},_create:function(){var t,i,n=this,r=n.options;n.$input=i=n.element.addClass("mf_input"),n.inputName="mf_"+(i.attr("name")||e.now()),n.$container=e('<div class="mf_container" />'),n.$list=e('<ol class="mf_list" />').attr({"aria-atomic":"false","aria-live":"polite","aria-multiselectable":"true",id:n.inputName+"_list",role:"listbox"}),n.$measure=e('<span class="mf_measure" />'),n.mousedown=!1,n.mpMousedown=!1,n.inputOriginals={"aria-owns":i.attr("aria-owns"),role:i.attr("role"),width:i.css("width")},r.marcoPolo?(t=i.val(),i.val(""),n._bindMarcoPolo(),i.attr("aria-owns",i.attr("aria-owns")+" "+n.$list.attr("id")),i.val(t)):i.attr({"aria-owns":n.$list.attr("id"),role:"combobox"}),n._bindInput()._bindList()._bindContainer()._bindDocument(),i.wrap(n.$container).before(n.$list).after(n.$measure),n.$container=i.parent(),r.values&&n.add(r.values,null,!1,!0),n._addInputValues()._styleMeasure()._resizeInput()},_setOption:function(t,i){var n=this,r=n.$input;switch(t){case"marcoPolo":n.options.marcoPolo?i?r.marcoPolo("option",e.extend({},i,n._marcoPoloOptions())):r.marcoPolo("destroy"):i&&(n._bindMarcoPolo(e.extend({},i,n._marcoPoloOptions())),r.marcoPolo("list").insertAfter(r.parent()));break;case"required":n.options.marcoPolo&&r.marcoPolo("option","required",i);break;case"values":n.add(i,null,!1,!1);break;case"valuesName":n.$list.find("input:hidden.mf_value").attr("name",i+"[]")}e.Widget.prototype._setOption.apply(n,arguments)},_bindMarcoPolo:function(i){var n=this,r=n.$input,a=n.options;return i===t&&(i=e.extend({},a.marcoPolo,n._marcoPoloOptions())),r.marcoPolo(i),r.marcoPolo("list").bind("mousedown.manifest",function(){n.mpMousedown=!0}),n},_bindInput:function(){var t=this,i=t.$input,n=t.options,r=n.marcoPolo&&0===n.marcoPolo.minChars,a=[t.keys.UP,t.keys.DOWN,t.keys.HOME,t.keys.END];return i.bind("keydown.manifest",function(o){if(t._resizeInput(),!n.required&&t._isSeparator(o.which))return o.preventDefault(),void(i.val()&&t.add(i.val(),null,!0,!1));if(o.which===t.keys.ENTER)return void o.preventDefault();if(!(i.val()||r&&-1!==e.inArray(o.which,a)))switch(o.which){case t.keys.BACKSPACE:case t.keys.DELETE:var s=t._selected();s.length?t.remove(s):t._selectPrev();break;case t.keys.LEFT:case t.keys.UP:t._selectPrev();break;case t.keys.RIGHT:case t.keys.DOWN:t._selectNext();break;case t.keys.HOME:t._selectFirst();break;case t.keys.END:t._selectLast();break;default:t._removeSelected()}}).bind("keypress.manifest",function(e){!n.required&&t._isSeparator(String.fromCharCode(e.which))&&(e.preventDefault(),i.val()&&t.add(i.val(),null,!0,!1))}).bind("keyup.manifest",function(){t._resizeInput()}).bind("paste.manifest",function(){setTimeout(function(){t._resizeInput(),!n.required&&i.val()&&t.add(t._splitBySeparator(i.val()),null,!0,!1)},1)}).bind("blur.manifest",function(){setTimeout(function(){t.mousedown||t._removeSelected(),t.mpMousedown||(n.marcoPolo&&n.required?t._resizeInput():i.val()&&t.add(i.val(),null,!0,!1))},1)}),t},_bindList:function(){var t=this;return t.$list.delegate("li","mouseover",function(){t._addHighlight(e(this))}).delegate("li","mouseout",function(){t._removeHighlight(e(this))}).delegate("li","mousedown",function(){t.mousedown=!0}).delegate("li","click",function(i){e(i.target).is("a.mf_remove")?(t._removeSelected(),t.remove(e(this)),i.preventDefault()):t._toggleSelect(e(this))}),t},_bindContainer:function(){var e=this;return e.$container.bind("click.manifest",function(){e.$input.focus()}),e},_bindDocument:function(){var t=this,i=t.$input;return e(document).bind("mouseup.manifest",function(n){t.mousedown&&(t.mousedown=!1,e(n.target).is("li.mf_item, li.mf_item *")||t._removeSelected()),t.mpMousedown&&(t.mpMousedown=!1,t.options.required?t._resizeInput():i.val()&&t.add(i.val(),null,!0,!1))}),t},container:function(){return this.$container},list:function(){return this.$list},add:function(t,i,n,r){for(var a,o=this,s=o.$input,l=o.options,u=e.isArray(t)?t:[t],c=e(),d=e(),h=e(),f=function(t,i,n){c.html(t),d.html(i),h.val(n),c.append(d,h),e.when(o._trigger("add",[a,c,!!r])).then(function(e){!1!==e&&(c.appendTo(o.$list),r||o._trigger("change",["add",a,c]))})},m=0,p=u.length;m<p;m++)a=u[m],"string"==typeof a&&(a=e.trim(a)),!a||e.isPlainObject(a)&&e.isEmptyObject(a)||(c=e(l.verification&&!l.verification.test(a)?'<li class="mf_item mf-error" role="option" aria-selected="false" />':'<li class="mf_item" role="option" aria-selected="false" />'),d=e('<a href="#" class="mf_remove" title="Remove" />'),h=e('<input type="hidden" class="mf_value" />'),l.valuesName?h.attr("name",l.valuesName+"[]"):h.attr("name",s.attr("name")+"_values[]"),c.data("manifest",a),e.when(l.formatDisplay.call(s,a,c,i),l.formatRemove.call(s,d,c),l.formatValue.call(s,a,h,c,i)).then(f));n&&o._clearInputValue()},_addInputValues:function(){var t=this,i=t.$input,n=i.data("values"),r=i.val(),a=[];return n?a=e.isArray(n)?n:[n]:r&&(a=t._splitBySeparator(r)),a.length&&t.add(a,null,!0,!0),t},remove:function(t){var i=this,n=e();n=t instanceof jQuery?t:i.$list.children(t),n.each(function(){var t=e(this),n=t.data("manifest");e.when(i._trigger("remove",[n,t])).then(function(e){!1!==e&&(i._isSelected(t)&&i._removeSelect(t),t.remove(),i._trigger("change",["remove",n,t]))})})},values:function(){var t=this,i=t.$list,n=[];return i.find("input:hidden.mf_value").each(function(){n.push(e(this).val())}),n},packValues:function(){var t=this,i=t.options,n=t.$list,r={errorCode:0,data:[]};return n.find("input:hidden.mf_value").each(function(){i.verification&&!i.verification.test(e(this).val())&&(r.errorCode=1e4),r.data.push(e(this).val())}),r},destroy:function(){var i=this,n=i.$input;i.options.marcoPolo&&n.marcoPolo("destroy"),i.$list.remove(),i.$measure.remove(),n.unwrap().removeClass("mf_input").val(i._joinWithSeparator(i.values())),e.each(i.inputOriginals,function(e,i){i===t?n.removeAttr(e):n.attr(e,i)}),e(document).unbind(".manifest"),e.Widget.prototype.destroy.apply(i,arguments)},_styleMeasure:function(){var e=this,t=e.$input;return e.$measure.css({"font-family":t.css("font-family"),"font-size":t.css("font-size"),"font-style":t.css("font-style"),"font-variant":t.css("font-variant"),"font-weight":t.css("font-weight"),left:-9999,"letter-spacing":t.css("letter-spacing"),position:"absolute","text-transform":t.css("text-transform"),top:-9999,"white-space":"nowrap",width:"auto","word-spacing":t.css("word-spacing")}),e},_measureText:function(e){var t,i=this.$measure;return t=e.replace(/&/g,"&amp;").replace(/\s/g,"&nbsp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"),i.html(t),i.width()},_maxInputWidth:function(){var e=this,t=e.$container,i=e.$input;return t.width()-(i.outerWidth(!0)-i.width())},_resizeInput:function(){var e,t=this,i=t.$input;return e=t._measureText(i.val()+"---"),i.width(Math.min(e,t._maxInputWidth())),t},_clearInputValue:function(){var e=this,t=e.$input;return e.options.marcoPolo?t.marcoPolo("change",null):t.val(""),e._resizeInput(),e},_isSeparator:function(t){var i=this.options.separator;return e.isArray(i)?-1!==e.inArray(t,i):t===i},_separators:function(t){var i=this.options.separator,n=e.isArray(i)?i:[i];return t&&(n=e.grep(n,function(e){return"string"==typeof e})),n},_firstSeparator:function(e){return this._separators(e).shift()},_splitBySeparator:function(t){var i=this._separators(!0),n=t;return i.length&&(n=t.split(new RegExp("[\\"+i.join("\\")+"]")),n=e.map(n,e.trim)),n},_joinWithSeparator:function(e){var t=this._firstSeparator(!0)||"";return e.join(t+" ")},_firstItem:function(){return this.$list.children("li:first")},_lastItem:function(){return this.$list.children("li:last")},_highlighted:function(){return this.$list.children("li.mf_highlighted")},_addHighlight:function(e){var t=this;return e.length?(t._removeHighlighted(),e.addClass("mf_highlighted"),t._trigger("highlight",[e.data("marcoPolo"),e]),t):t},_removeHighlight:function(e){var t=this;return e.length?(e.removeClass("mf_highlighted"),t._trigger("highlightRemove",[e.data("marcoPolo"),e]),t):t},_removeHighlighted:function(){return this._removeHighlight(this._highlighted())},_selected:function(){return this.$list.children("li.mf_selected")},_isSelected:function(e){return e.hasClass("mf_selected")},_addSelect:function(e){var t=this;return e.length?(t._removeSelected(),e.addClass("mf_selected").attr({"aria-selected":"true",id:t.inputName+"_selected"}),t.$list.attr("aria-activedescendant",e.attr("id")),t._trigger("select",[e.data("marcoPolo"),e]),t):t},_removeSelect:function(e){var t=this;return e.length?(e.removeClass("mf_selected").attr("aria-selected","false").removeAttr("id"),t.$list.removeAttr("aria-activedescendant"),t._trigger("selectRemove",[e.data("marcoPolo"),e]),t):t},_removeSelected:function(){return this._removeSelect(this._selected())},_toggleSelect:function(e){return this._isSelected(e)?this._removeSelect(e):this._addSelect(e)},_selectPrev:function(){var t=this,i=t._selected(),n=e();return n=i.length?i.prev():t._lastItem(),n.length&&t._addSelect(n),t},_selectNext:function(){var e=this,t=e._selected(),i=t.next();return i.length?e._addSelect(i):e._removeSelect(t)},_selectFirst:function(){return this._addSelect(this._firstItem())},_selectLast:function(){return this._addSelect(this._lastItem())},_trigger:function(e,t){var i=this,n="on"+e.charAt(0).toUpperCase()+e.slice(1),r=i.widgetEventPrefix.toLowerCase()+e.toLowerCase(),a=i.options[n];return i.element.trigger(r,t),a&&a.apply(i.element,t)}})});