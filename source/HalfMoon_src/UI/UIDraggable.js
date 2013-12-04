var UIDraggable = (function(){
	var cls = function(name,width,height,textureNm,material){
		UIObject.call(this,name,width,height,textureNm,material);
		

		
		
		this.state = UIDRAGSTATE.Sleep;
		
		/* Drag Start */
		var self = this;
		
		
		
		this.OnMouseDragStart = function(e){
			this.state = UIDRAGSTATE.DragStart;
			console.log("OnDragStart");
		};
		
		this.OnMouseDragOver = function(e){
			this.state = UIDRAGSTATE.DragOver;
			SetScreenTranslate([e.mouseEvent.clientX,e.mouseEvent.clientY],this.transform);
			console.log("OnDragOver");
		};
		
		this.OnMouseDragEnd = function(e){
			this.state = UIDRAGSTATE.DragEnd;
			console.log("OnDragEnd");
		};
		
//		//obsolete
//		var myDragStartFnc = function(e){
//
//			
//			
//			if(this.CheckInsideUIElement([e.mouseEvent.clientX,e.mouseEvent.clientY])){
//				this.state = UIDRAGSTATE.DragStart;
//				//e.preventDefault();//this would prevent dragover
//				e.isPublishing = false;
//				this.OnBtnDragStartEvent.publish("OnBtnDragStart",this);
//			}
//
//		};
		
//		var onDragStart = function(e){
//			console.log("?????");
//			
//		}
//		this.OnMouseDragStartEvent.subscribe("OnMouseDragStart",this,onDragStart);

//		this.OnBtnDragStartEvent = new UIDelegate();
//		this.OnBtnDragStart = function(btn){
//
//			//console.log("OnBtnDragStart");
//		};
//		this.OnBtnDragStartEvent.subscribe("OnBtnDragStart",this,this.OnBtnDragStart);
		
//		 /* Drag Over */
//		var myDragOverFnc = function(e){
//			
//			//if(this.dragState == true) {
//			if(this.state == UIDRAGSTATE.DragStart||
//			   this.state == UIDRAGSTATE.DragOver){
//				this.state = UIDRAGSTATE.DragOver;
////				var screenPos = self.mouse2screen([e.mouseEvent.clientX,e.mouseEvent.clientY]);
////				this.transform.MoveTo([screenPos[0],screenPos[1],0]);
//				e.preventDefault();
//				this.SetTranslate([e.mouseEvent.clientX,e.mouseEvent.clientY]);
//				this.OnBtnDragOverEvent.publish("OnBtnDragOver",this);
//			}
//		};
//		this.OnMouseDragOverEvent.subscribe("OnMouseDragOver",this,myDragOverFnc);
//
//		this.OnBtnDragOverEvent = new UIDelegate();
//		this.OnBtnDragOver = function(btn){
//
//			//console.log("OnBtnDragOver");
//		};
//		this.OnBtnDragOverEvent.subscribe("OnBtnDragOver",this,this.OnBtnDragOver);
//		
//		 /* Drag End */
//		var myDragEndFnc = function(e){
//			if(this.state == UIDRAGSTATE.DragStart||
//			   this.state == UIDRAGSTATE.DragOver){
//				this.state = UIDRAGSTATE.DragEnd;
//				e.preventDefault();
//				this.OnBtnDragEndEvent.publish("OnBtnDragEnd",this);
//			}
//	
//		};
//		this.OnMouseDragEndEvent.subscribe("OnMouseDragEnd",this,myDragEndFnc);
//
//		this.OnBtnDragEndEvent = new UIDelegate();
//		this.OnBtnDragEnd = function(btn){
//
//			//console.log("OnBtnDragEnd");
//		};
//		this.OnBtnDragEndEvent.subscribe("OnBtnDragEnd",this,this.OnBtnDragEnd);
		
	};
	
	cls.prototype = Object.create(UIObject.prototype);
	cls.prototype.constructor = cls;
	
	return cls;
})();