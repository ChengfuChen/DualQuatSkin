var ModelPanel = (function(){
	
	var ModelPanel =function(name,titleTex,panelTex,titleWRatio,titleHRatio,
						windowWidth,windowHeight){
		UIWindow.call(this,name,titleTex,panelTex,titleWRatio,titleHRatio,
											windowWidth,windowHeight);
		this.panel.transform.MoveTo([this.titleWidth,0,0]);
		this.listeningZone=[[this.titleWidth,0,windowWidth,windowHeight],[0,0,this.titleWidth,this.titleHeight]];
		
		this.OnMouseDragOver = function(e){
			this.state = UIDRAGSTATE.DragOver;
			SetScreenTranslate([e.mouseEvent.clientX,e.mouseEvent.clientY],this.transform,false,true);
			console.log("OnDragOver");
		};
		
	};
	ModelPanel.prototype = Object.create(UIWindow.prototype);
	ModelPanel.prototype.constructor = ModelPanel;
	return ModelPanel; 
	
})();