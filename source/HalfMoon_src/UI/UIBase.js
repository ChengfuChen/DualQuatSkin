var UIDelegate = (function(){
	
	var UIDelegate = function(){
		this.pool = [];

	};
    UIDelegate.prototype.subscribe=function(event,obj,fn) {
    	if(!this.pool.length)
    		this.pool.push({eventNm:event,subscriber:[{obj:obj,func:fn}]});
    	else{
    		var isFinded = false;
    		for(var i=0;i<this.pool.length;i++)
    			if(this.pool[i].eventNm==event){
    				this.pool[i].subscriber.push({obj:obj,func:fn});
    				isFinded = true;
    				break;
    			}
    		if(!isFinded)
    			this.pool.push({eventNm:event,subscriber:[{obj:obj,func:fn}]});
    	};	
    };
    
    UIDelegate.prototype.unsubscribe=function(event,obj,fn) {
    	
		var isFinded = false;
		for(var i=0;i<this.pool.length;i++)
			if(this.pool[i].eventNm==event){
				this.pool[i].subscriber.push({obj:obj,func:fn});
				for(var j=0;j<this.pool[i].subscriber.length;j++)
					if(this.pool[i].subscriber[j].obj==obj&&
					   this.pool[i].subscriber[j].func==fn){
						this.pool[i].subscriber.splice(j,1);
						return;
					}
			}//end of is eventNm
		
    };
    
    UIDelegate.prototype.publish=function(event,value) {
        for(var i=0;i<this.pool.length;i++)
        	if(this.pool[i].eventNm==event)
        		for(var j=0;j<this.pool[i].subscriber.length;j++){
        			var callee =  this.pool[i].subscriber[j];
        			if(callee.obj[callee.func.name])
        				callee.obj[callee.func.name].call(callee.obj,value);
        			else
        				callee.func.call(callee.obj,value);
        		}
        	else if(this.pool[i].eventNm=="ALL:")
        		for(var j=0;j<this.pool[i].subscriber.length;j++){
        			var callee =  this.pool[i].subscriber[j];
        			if(callee.obj[callee.func.name])
        				callee.obj[callee.func.name].call(callee.obj,value);
        			else
        				callee.func.call(callee.obj,value);
        		}
    };
	return UIDelegate;
})();

var UIBase = (function(){
	var UIBase = function(name){
		HierachyDrawableObj.call(this,name);
		this.type="UI";
		this.isActive = true;
		this.capturePhaseEvents = new UIDelegate();
		this.bubblePhaseEvents = new UIDelegate();
		
		this._UIPointerCache = {ray:{origin:vec3.create(),
									direction:vec3.create()},
								//matrix:mat4.create(),
								intersection:vec3.create()};
		
		this.listeningZone = [];
		//this.hotZone =[0,0,0,0];
		this.AddEventListener = function(evt,callback,isCapturePhase){
			if(isCapturePhase==null)
				this.bubblePhaseEvents.subscribe(evt,this,callback);
			else if(isCapturePhase)
				this.capturePhaseEvents.subscribe(evt,this,callback);
			else
				this.bubblePhaseEvents.subscribe(evt,this,callback);
		};
		
		this.RemoveEventListener = function(evt,callback){
			this.bubblePhaseEvents.unsubscribe(evt,this,callback);
			this.capturePhaseEvents.unsubscribe(evt,this,callback);
		};
		
		
		
		//http://www.w3school.com.cn/xmldom/met_element_dispatchevent.asp
		this.DispatchEvent = function(event){//????
			if(event.defaultPrevented)
				return false;
			
			return true;
		};
		
		function eventHandler (event){
			if(event.target.fullName!=event.curTarget.fullName)
				return;
			
			if(event.type == 'OnMouseClick'&&this["OnMouseClick"])
				this.OnMouseClick(event);
			
			if(this["OnMouseDragStart"])
				switch(event.type){
					case 'OnMouseDragStart':
						this.OnMouseDragStart(event);
					break;
					case 'OnMouseDragOver':
						this.OnMouseDragOver(event);
					break;
					case 'OnMouseDragEnd':
						this.OnMouseDragEnd(event);
					break;
				}
		};
		this.bubblePhaseEvents.subscribe("ALL:",this,eventHandler);
		
//		
//		this.OnMouseClickEvent = new UIDelegate();
//		this.OnMouseClick = function(e){
//			console.log("click");
//		};
//		this.OnMouseClickEvent.subscribe("OnMouseClick",this,this.OnMouseClick);
//		
//		
//		this.OnMouseDragStartEvent = new UIDelegate();
//		this.OnMouseDragStart = function(e){
//			console.log("dragstart");
//		};
//		
//		this.OnMouseDragStartEvent.subscribe("OnMouseDragStart",this,this.OnMouseDragStart);
//
//		
//		
//		this.OnMouseDragOverEvent = new UIDelegate();
//		this.OnMouseDragOver = function(e){
//			console.log("dragOver");
//		};
//		this.OnMouseDragOverEvent.subscribe("OnMouseDragOver",this,this.OnMouseDragOver);
//
//		
//		this.OnMouseDragEndEvent = new UIDelegate();
//		this.OnMouseDragEnd = function(e){
//			console.log("dragEnd");
//		};
//		this.OnMouseDragEndEvent.subscribe("OnMouseDragEnd",this,this.OnMouseDragEnd);
//		
	

//		this.OnMouseDownEvent = new UIDelegate();
//		this.OnMouseDown = function(e){
//			
//		};
//		this.OnMouseDownEvent.subscribe("OnMouseDown",this,this.OnMouseDown);
//
//		this.OnMouseUpEvent = new UIDelegate();
//		this.OnMouseUp = function(e){
//			
//		};
//		this.OnMouseUpEvent.subscribe("OnMouseUp",this,this.OnMouseUp);
//
//		
//		
//		this.OnMouseMoveEvent = new UIDelegate();
//		this.OnMouseMove = function(e){
//			
//		};
//		this.OnMouseMoveEvent.subscribe("OnMouseMove",this,this.OnMouseMove);
//

//
//		
//		this.OnMouseDoubleClickEvent = new UIDelegate();
//		this.OnMouseDoubleClick = function(e){
//			
//		};
//		this.OnMouseDoubleClickEvent.subscribe("OnMouseDoubleClick",this,this.OnMouseDoubleClick);
//
//		

		
	};

	UIBase.prototype = Object.create(HierachyDrawableObj.prototype);
	UIBase.prototype.constructor = UIBase;
	return UIBase;
})();


//UIBase = UIBase;