var UIElement3D = (function(){
	var _cam = new Camera({isPersp:true,fov:Math.degree2Radian(45), near:0.1,far:3000.0,
		name:"renderBufCam",width:32,height:32});
	var UIElement3D = function(name,width,height,objs,material){
		
		UIElement.call(this,name,width,height,null,material);
		//HalfMoon.uiObj.push(this);
		
		var _colFBO = null;
		
		
		

		_cam.transform.MoveTo([0,100,300]);
		
		HalfMoon.SysEvent.UnSubscribe("CanvasResize:",_cam);

		var _draw = this.draw;//p
		var _initialize = this.Initialize;//parent initialize
		this.isLoaded = false;
		this.Initialize = function(render){
			if(objs&&!material){//for sharing material we don't need to redraw
				if(!_colFBO)
					_colFBO = new FBO(render.graphic.gl,this.width,this.height);
				
				
				render.graphic.gl.viewport(0, 0, this.width,this.height);
				//render.graphic.gl.clearColor(0, 0, 0, 0);
				render.render2FBO(objs,_colFBO,null,_cam);
				this.material.setTexture("diffCol",_colFBO.colorBuffer);
				render.graphic.gl.viewport(0, 0, render.graphic.gl.viewportWidth, 
												render.graphic.gl.viewportHeight);
			};
			_initialize.call(this,render);
		};
		
		this.Update = function(){
			
			
		};
		
		this.draw= function(render){

			
			if(objs&&objs[0].shape.isLoaded&&this.updateState ==UIELEMENT_INITIALSTATE.LOADING)
				this.updateState = UIELEMENT_INITIALSTATE.INITIAL;
			_draw.call(this,render);//draw UIElement
		};
		
	};

	UIElement3D.prototype = Object.create(UIElement.prototype);
	UIElement3D.prototype.constructor = UIElement3D;
	return UIElement3D;
})();
