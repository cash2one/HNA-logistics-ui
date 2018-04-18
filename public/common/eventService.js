app.factory('eventServiceFactory', ['easyHttp', function(easyHttp) {
    var eventQueue = {},
        dispatchQueue = {},
        callbackList = {};
    function runDispatchQueue() {
            for(var eventName in dispatchQueue) {
                if(eventQueue[eventName]) {
                    eventQueue[eventName](dispatchQueue[eventName]);
                    delete dispatchQueue[eventName];
                }
            }
    }
    function context() {
        this.data = {};
        this.put = function(key, value) {
            this.data[key] = value;
        }
        this.get = function(key) {
            return this.data[key];
        }
    }
    var eventService = {
        context: null,
        getContext: function() {
            if(!this.context) {
                this.context = new context();
            }
            return this.context;
        },
        putContext: function(eventName, context) {
            callbackList[eventName] ? callbackList[eventName](context) : null;
        },
        on: function(eventName, event) {
            eventQueue[eventName] = event;
            runDispatchQueue();
        },
        dispatch: function(eventName, data, callback) {
            if(callback) {
                callbackList[eventName] = callback;
            }
            if(eventQueue[eventName]) {
                eventQueue[eventName](data);//如果消息存在直接消化
            } else {
                dispatchQueue[eventName] = data;//如果消息还没有被注册先放到队列当中等待消化
            }
        }
    };
    var eventServiceFactory = {
        createEventService: function() {
            var func = function() {};
            func.prototype = eventService;
            return new func;
        }
    }
    return eventServiceFactory;
}]);