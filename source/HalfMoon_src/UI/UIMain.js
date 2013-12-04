
//var UIEvt = (function(){//??????????????????????????merge with UISysEvent
//	var cls = function(){
//		this.preventDefault = function(){
//			
//			this.mouseEvent.preventDefault();
//			
//		};
//		this.stopPropagation = function(){
//			
//			this.capturing = false;
//			this.bubbling = false;
//		};
//		
//		this.InitEvent = function(type,e){
//			this.eventPhase = 1;
//			this.capturing = true;
//			this.bubbling = false;
//			this.mouseEvent = e;
//			this.target=null;
//			this.curTarget=null;
//			this.type=type;
//		};
//		
//	};
//	
//	return cls;
//})();
var UIMain = (function(){
	var cls = function(canvas,cam){
		HierachyDrawableObj.call(this,"MainUI");
		this._UIPointerCache = {ray:{origin:vec3.create(),
			direction:vec3.create()},
			matrix:mat4.create(),
			intersection:vec3.create()};
		HalfMoon.UIRoot = this;
		//HalfMoon.UIRoot.AddChild(HalfMoon.scenePanel);
		HalfMoon.uiObj.push(this);
		var _panels = [];
		var _cam = cam;
		this.camZ = canvas.height*0.5;
		
		function initialCam(){
			if(_cam.isPersp){
				var delta = GetPerspUICamPos(_cam,this.camZ);
				_cam.transform.MoveTo(delta);
				this.listeningZone = [[0,0,delta[0]*2,-delta[1]*2]];
			}else{//?????????????following code producing error
				_cam.transform.MoveTo([-canvas.width*0.5,-canvas.height*0.5,this.camZ]);
				this.listeningZone = [[0,0,canvas.width,canvas.height]];
	
			}
		}
		initialCam.call(this);
		HalfMoon.DataManager.ManuallyUpdate(_cam.transform);
		
		this.transform = new Transform(this.name+"Trans");
		HalfMoon.UIRoot.uiCam = _cam;
		HalfMoon.UIRoot.width = canvas.width;
		HalfMoon.UIRoot.height = canvas.height;
		var self = this;
		//var event = new UIEvt();
		
		
		this.Resize = function(vec2){
			HalfMoon.UIRoot.width = vec2[0];
			HalfMoon.UIRoot.height = vec2[1];
			this.camZ = canvas.height*0.5;
			initialCam.call(this);
			UpdateLayout(this);
		};

		
		HalfMoon.SysEvent.Subscribe("CanvasResize:",this,this.Resize);
		
		var OnChildrenChange = function(who){
			if(who.parent.name!="MainUI")
				return;
			_panels = [];
			for(var i in this.children){
				if(this.children[i] instanceof UIPanel )//||
//				   (typeof ModelPanel != "undefined"
//					   	&&this.children[i] instanceof ModelPanel )|| 
//				   (typeof PopupPanel!= "undefined"
//					    &&this.children[i] instanceof PopupPanel))
					_panels.push(this.children[i]);
			};
		};

		HalfMoon.SysEvent.Subscribe("ChildrenChanged:",this,OnChildrenChange);
		
		canvas.onmousedown = function(e){
			//event.InitEvent("OnMouseDown",e);
			var evt = HalfMoon.UISysEvent.CreateEvent("OnMouseDown",e);
			HalfMoon.UISysEvent.Publish(evt,self);
		};
		
		canvas.onmouseup = function(e){
			//event.InitEvent("OnMouseUp",e);
			var evt = HalfMoon.UISysEvent.CreateEvent("OnMouseUp",e);
		    HalfMoon.UISysEvent.Publish(evt,self);
		};
		
//		//obsolete
//		var checkPanel = function(e){
//			var mousePos =[e.clientX,e.clientY];
//			mousePos = self.mouse2screen(mousePos);
//			var result = false, isPanelOnDragging = false;
//			for(var i in _panels){
//				var isOnPanel = _panels[i].IsOverPanel(mousePos);
//				if(_panels[i].state==_panels[i].panelState.Drag&&//?????????????????
//						!isOnPanel){
//					_panels[i].SetActive(true);
//					result |= true;
//					isPanelOnDragging = true;
//				}else{
//					//if(_panels[i].name == "ModelPanel")
//					//console.log(_panels[i].name+": "+isOnPanel);
//					_panels[i].SetActive(isOnPanel);
//					result |= isOnPanel;
//				}
//			}
//			//console.log("is on scene?"+!result);
//			if(isPanelOnDragging) HalfMoon.scenePanel.SetActive(true);
//			else HalfMoon.scenePanel.SetActive(!result);
//			
//		};
		canvas.onmousemove = function(e){
			//event.InitEvent("OnMouseMove",e);
			//checkPanel(e);//???????????????????????????????????????
			var evt = HalfMoon.UISysEvent.CreateEvent("OnMouseMove",e);
			HalfMoon.UISysEvent.Publish(evt,self);
		};

		canvas.onclick = function(e){ 
			//console.log(e.clientX);
			//event.InitEvent("OnMouseClick",e);
			var evt = HalfMoon.UISysEvent.CreateEvent("OnMouseClick",e);
			HalfMoon.UISysEvent.Publish(evt,self);
		};

//		canvas.ondblclick = function(e){
//			event.InitEvent("OnMouseDoubleClick",e);
//			HalfMoon.UISysEvent.Publish(event,self);
//		};

		canvas.ondragstart = function(e){
			//event.InitEvent("OnMouseDragStart",e);
			var evt = HalfMoon.UISysEvent.CreateEvent("OnMouseDragStart",e);
			
			HalfMoon.UISysEvent.Publish(evt,self);
			//e.preventDefault();
			e.stopPropagation();
			
		};
		
		canvas.ondragend= function(e){
			//event.InitEvent("OnMouseDragEnd",e);
			var evt = HalfMoon.UISysEvent.CreateEvent("OnMouseDragEnd",e);
			
			HalfMoon.UISysEvent.Publish(evt,self);
			
		};
		canvas.ondragover= function(e){
			//event.InitEvent("OnMouseDragOver",e);
			//checkPanel(e);
			var evt = HalfMoon.UISysEvent.CreateEvent("OnMouseDragOver",e);
			//these make ondragend event more efficient
			e.preventDefault();
			e.stopPropagation();
			
			HalfMoon.UISysEvent.Publish(evt,self);
		};
		/////////////////////////////////
		canvas.ontouchstart= function(e){
			//event.InitEvent("OnMouseDragStart",e);
			var evt = HalfMoon.UISysEvent.CreateEvent("OnMouseDragStart",e);
			HalfMoon.UISysEvent.Publish(evt,self);
		};
		
		canvas.ontouchmove= function(e){
			//event.InitEvent("OnMouseDragOver",e);
			//checkPanel(e);
			//HalfMoon.UISysEvent.Publish("OnMouseMove",self,event);
			var evt = HalfMoon.UISysEvent.CreateEvent("OnMouseDragOver",e);
			HalfMoon.UISysEvent.Publish(evt,self);
		};
		
		canvas.ontouchend= function(e){
			//event.InitEvent("OnMouseDragEnd",e);
			var evt = HalfMoon.UISysEvent.CreateEvent("OnMouseDragEnd",e);
			HalfMoon.UISysEvent.Publish(evt,self);
		};
		
		canvas.ontouchtap = function(e){ 
			//event.InitEvent("OnMouseClick",e);
			var evt = HalfMoon.UISysEvent.CreateEvent("OnMouseClick",e);
			HalfMoon.UISysEvent.Publish(evt,self);
		};

		canvas.addEventListener('touchstart', canvas.ontouchstart);
		canvas.addEventListener('touchmove', canvas.ontouchmove);
		canvas.addEventListener('touchend', canvas.ontouchend);
	};

	cls.prototype = Object.create(HierachyDrawableObj.prototype);
	cls.prototype.constructor = cls;
//	cls.prototype.mouse2screen = function(mousePos){
//		var result = 
//    		[(mousePos[0]-HalfMoon.UIRoot.width/2),
//            -(mousePos[1]-HalfMoon.UIRoot.height/2)];
//    	return result;
//	}
	cls.prototype.ResizeRecursively = function(node){
		for(var i in node.children){
			var child = node.children[i];
			
			if(child.layout){
				child.layout.Update();
				SetScreenTranslate(child.layout.origin,child.transform);
				child.transform.Scale([child.layout.scale[0],child.layout.scale[0],1]);
			}
			ResizeRecursively(child);
		}
	};
	return cls;
	
	
})();
//UIMain = UIMain;