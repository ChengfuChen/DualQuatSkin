var Wall = (function(){
	var cls = function(name,width,height,cellSize,textureFullNm){
		
		QuadSelect.call(this,name,null,width,height,cellSize);

		var defaultMat,texture;
		this.isLoaded = false;
		var self = this;
		this.OnTextureLoaded = function(){
			self.isLoaded = true;
			defaultMat.uniforms["uIsTextureLoaded"].value= true;
		};
		
		var _isInitialized = false;
		this.Initialize = function(gl){
			if(!HalfMoon.textures[textureFullNm])
				texture = new Texture(gl,textureFullNm,this.OnTextureLoaded);
			else
				texture = HalfMoon.textures[textureFullNm];
			
			defaultMat = HalfMoon.materials["default"].clone();
			defaultMat.setTexture("diffCol",texture);
			_isInitialized = true;
		}
		
		this.WallState = {
			NONE:"",
			WALL:"render default",
			QUADSELECT:"quad selecting"
		};
		this.renderState = this.WallState.QUADSELECT;
		var _draw = this.draw;
		
		var _selectionMat = this.material;
		
		var onFinishDraw = function(render){//on engine finishing draw 

			if(this.renderState==this.WallState.QUADSELECT){

				var gl =  render.graphic.gl;
				
				gl.enable(gl.BLEND);
			    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
			    gl.disable(gl.DEPTH_TEST);
			    
				this.material = _selectionMat;
				
				_draw.call(this,render);
				
			    gl.disable(gl.BLEND);
			    gl.enable(gl.DEPTH_TEST);
			}
			
		};
		var _oldRenderState = null;
		
//		var _onSelected = this.OnSelected;
//		this.OnSelected = function(){
//			if(this.renderState==this.WallState.QUADSELECT)
//				_onSelected.call(this);
//			else
//				_onNotSelected.call(this);
//			
//		};
//		var _onNotSelected = this.OnSelected;
//		this.OnNotSelected = function(){
//				_onNotSelected.call(this);
//		};
		HalfMoon.SysEvent.Subscribe("OnDrawFinish",this,onFinishDraw);
		
		this.draw = function(render){
			if(!_isInitialized)
				this.Initialize(render.graphic.gl);
			
			if(this.state == this.quadState.EXIT)
				this.renderState = this.WallState.WALL;
			else if(this.state == this.quadState.ENTER)
				this.renderState = this.WallState.QUADSELECT;
			
			
			if(this.renderState==this.WallState.WALL){
				this.material = defaultMat;
				
				_draw.call(this,render);
			};
			
		};
		
	};
	
	return cls;
	
	
	
})();