var UIWindow = (function(){
	var cls =function(name,titleTex,panelTex,titleWRatio,titleHRatio,
						windowWidth,windowHeight){

		this.Resize = function(windowWidth,windowHeight){
			
			this.titleWidth = titleWRatio*this.width;
			this.titleHeight = titleHRatio*this.height;
			this.panelWidth = this.width;
			this.panelHeight = (1-titleHRatio)*this.height;
		};
		this.width = windowWidth;this.height = windowHeight;

		this.Resize(this.width,this.height);
		
		this.titleWRatio = titleWRatio;this.titleHRatio=titleHRatio;
		UIDraggable.call(this,name,this.titleWidth,this.titleHeight,titleTex);
		this.panel = 
			new UIElement("panel",this.panelWidth,this.panelHeight,panelTex);
	
		
		this.width = windowWidth;this.height = windowHeight;
		this.initialWidth = this.width; this.initialHeight = this.height;
		//this.panel.parent = this.parent;
//		this.panel.transform = this.transform;
//		function childChanged(who){
//			if(who.child.fullName!=this.fullName) return;
//			
//			this.panel.parent = this.parent;
//			
//		};
//		HalfMoon.SysEvent.Subscribe("ChildrenChanged:",this,childChanged);

		this.panel.transform.MoveTo([0,-this.titleHeight,0]);
		
		this.AddChild(this.panel);
		
		this.listeningZone=[[0,this.titleHeight,windowWidth,windowHeight],[0,0,this.titleWidth,this.titleHeight]];
		
		
		this.SetLayout = function(w0,w1,h0,h1){
			
			//this.SetScale([1,1]);
			//return;
			if(!this.layout)
				this.layout = new UILayout(this,w0,w1,h0,h1);
			else
				this.layout.Update();
			
			//SetParentOffset([this.layout.w0dist,this.layout.h0dist],this.transform);
			//this.SetScale(this.layout.scale);
		};
		
		
//		var _draw = this.draw;//p
//		this.draw= function(render){
//
//			//this.panel.draw(render);
//			_draw.call(this,render);//draw UIElement
//		};
		
	};
	cls.prototype = Object.create(UIPanel.prototype);
	cls.prototype.constructor = cls;
	return cls; 
	
})();