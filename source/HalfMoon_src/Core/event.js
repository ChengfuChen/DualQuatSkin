//var Event  = (function(){
//	 return function(){
//		 this.name = "Event";
//			var _pool = [];
//		    this.subscribe=function(event,fn) {
//		    	if(!_pool.length)
//		    		_pool.push({eventNm:event,funcPool:[fn]});
//		    	else{
//		    		var isFinded = false;
//		    		for(var i=0;i<_pool.length;i++)
//		    			if(_pool[i].eventNm==event){
//		    				_pool[i].funcPool.push(fn);
//		    				isFinded = true;
//		    				break;
//		    			}
//		    		if(!isFinded)
//		    			_pool.push({eventNm:event,funcPool:[fn]});
//		    	};
//		    			
//		    };
//		    this.publish=function(event,value) {
//		        for(var i=0;i<_pool.length;i++)
//		        	if(_pool[i].eventNm==event)
//		        		for(var j=0;j<_pool[i].funcPool.length;j++)
//		        			_pool[i].funcPool[j].call(this,value);
//		    };
//		};
//})();
//Event = Event;
var SysEvent  = (function(){
	 return function(){
		 	this.name = "SysEvent";
			var _pool = [];
		    this.Subscribe=function(event,obj,fn) {
		    	if(!_pool.length)
		    		_pool.push({eventNm:event,subscriber:[{obj:obj,func:fn}]});
		    	else{
		    		var isFinded = false;
		    		for(var i=0;i<_pool.length;i++)
		    			if(_pool[i].eventNm==event){
		    				_pool[i].subscriber.push({obj:obj,func:fn});
		    				isFinded = true;
		    				break;
		    			}
		    		if(!isFinded)
		    			_pool.push({eventNm:event,subscriber:[{obj:obj,func:fn}]});
		    	};
		    			
		    };
		    this.UnSubscribe = function(event,obj){
		    	for(var i=0;i<_pool.length;i++)
	    			if(_pool[i].eventNm==event){
	    				for(var j=0;j<_pool[i].subscriber.length;j++){
	    					var tmp = _pool[i].subscriber[j];
	    					if(tmp.obj == obj)
	    						_pool[i].subscriber.splice(j,1);
	    				}

	    			}
		    	
		    };
		    
		    this.Publish=function(event,value) {
		        for(var i=0;i<_pool.length;i++)
		        	if(_pool[i].eventNm==event)
		        		for(var j=0;j<_pool[i].subscriber.length;j++){
		        			var callee =  _pool[i].subscriber[j];
		        			callee.func.call(callee.obj,value);
		        		}
		    };
		};
})();

HalfMoon.SysEvent = new SysEvent();
////call pool 
//for(var i=0;i<_pool.length;i++)
//    	if(_pool[i].eventNm==event)
//    		for(var j=0;j<_pool[i].subscriber.length;j++){
//    			var callee =  _pool[i].subscriber[j];
//    			callee.func.call(callee.obj,value,root);
//    		}
//

//if(root.children==0)
//	event.eventPhase++;



//this.Subscribe=function(event,obj,fn) {
//if(!_pool.length)
//	_pool.push({eventNm:event,subscriber:[{obj:obj,func:fn}]});
//else{
//	var isFinded = false;
//	for(var i=0;i<_pool.length;i++)
//		if(_pool[i].eventNm==event){
//			_pool[i].subscriber.push({obj:obj,func:fn});
//			isFinded = true;
//			break;
//		}
//	if(!isFinded)
//		_pool.push({eventNm:event,subscriber:[{obj:obj,func:fn}]});
//};
//		
//};
//this.UnSubscribe = function(event,obj){
//for(var i=0;i<_pool.length;i++)
//	if(_pool[i].eventNm==event){
//		for(var j=0;j<_pool[i].subscriber.length;j++){
//			var tmp = _pool[i].subscriber[j];
//			if(tmp.obj == obj)
//				_pool[i].subscriber.splice(j,1);
//		}
//
//	}
//
//};


//UISysEvent =  UISysEvent;
//// Your code can publish and subscribe to events as:
//EventManager.subscribe("tabClicked", function() {
//    // do something
//});
//
//EventManager.publish("tabClicked");