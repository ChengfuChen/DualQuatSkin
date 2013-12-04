var UIScenePanel = (function(){
	
	
	var cls = function(){
		UIBase.call(this,"ScenePanel");
		
		this.isActive = false;
		this.SetActive = function(isActive){
			this.isActive = isActive;
			//HalfMoon.UISysEvent.Capture("OnActiveChange",this,isActive);
		};
		var move = function(value){
			
		};
		
		var dragOver = function(value){
			
		};
		
		
		this.OnMouseClick = function(e){

			HalfMoon.SysEvent.Publish("ScenePanel:OnMouseClick",e);
		};
		
		this.OnMouseMove = function(e){


			HalfMoon.SysEvent.Publish("ScenePanel:OnMouseMove",e);
		};
		
		this.OnMouseDragStart = function(e){

			HalfMoon.SysEvent.Publish("ScenePanel:OnMouseDragStart",e);
		};
		this.OnMouseDragEnd = function(e){

			HalfMoon.SysEvent.Publish("ScenePanel:OnMouseDragEnd",e);
		};
		this.OnMouseDragOver = function(e){

			HalfMoon.SysEvent.Publish("ScenePanel:OnMouseDragOver",e);
		};
//		this.OnMouseClickEvent.subscribe("OnMouseClick",this,this.OnMouseClick);
//		this.OnMouseMoveEvent.subscribe("OnMouseMove",this,this.OnMouseMove);
//		this.OnMouseDragStartEvent.subscribe("OnMouseDragStart",this,this.OnMouseDragStart);
//		this.OnMouseDragEndEvent.subscribe("OnMouseDragEnd",this,this.OnMouseDragEnd);
//		this.OnMouseDragOverEvent.subscribe("OnMouseDragOver",this,this.OnMouseDragOver);
	};
	

	cls.prototype = Object.create(HierachyDrawableObj.prototype);
	cls.prototype.constructor = cls;
//	HalfMoon.UISysEvent.Subscribe("OnMouseMove",this,move);
//	HalfMoon.UISysEvent.Subscribe("OnMouseDragOver",this,dragOver);
	return cls;
	
})();
//UIScenePanel = UIScenePanel;