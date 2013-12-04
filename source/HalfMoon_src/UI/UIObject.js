var UIObject = (function(){
	var cls = function(name,width,height,textureNm,material){
		if(typeof textureNm == 'string'||
			typeof textureNm == 'function'){//HTML canvas texture
				UIElement.call(this,name,width,height,textureNm,material);
		}
		else//textureNm is renderalbe objs
			UIElement3D.call(this,name,width,height,textureNm,material);

        var self = this;
        
		this.objState = UIOBJSTATE.RollOut;
        this.worldPos = vec3.create();
        this.offsetPos = vec3.create();
        this.screenPos = vec2.create();
        this.viewport = vec4.create();
        this.scale = vec3.create();
        this._pos = vec4.create();
        this.canMoveOutside = false;
        
        this.initialWidth = this.width;
        this.initialHeight = this.height;
        
		var _draw = this.draw;
		this.draw = function(render){
			this.render = render;
			_draw.call(this,render);//draw UIElement
		};
		this.GetTranslate = function(){
			//World2Screen(this.screenPos,this.transform.position);
			//return this.screenPos;


			var cam = HalfMoon.UIRoot.uiCam,
				viewProj = mat4.create();
			
			//from world to clip space
			mat4.multiply(viewProj,cam.pMatrix,cam.GetViewMatrix());
			vec4.set(this._pos, this.transform.position[0],
								this.transform.position[1],
								this.transform.position[2],1);
			vec4.transformMat4(this._pos,this._pos,viewProj);
			//clipSpace to NDC space
			vec4.scale(this._pos,this._pos,1/this._pos[3]);

			//windowSpace = 0.5*(ndc.xy+1)*viewport.zw;
			
			this.screenPos[0] = 0.5*(this._pos[0]+1)*this.render.viewports[3];
			this.screenPos[1] = 0.5*(this._pos[1]+1)*this.render.viewports[4];
			
		};

		
		this.SetTranslate = function(position){
			this.transform.position[0] = position[0];
			this.transform.position[1] = -position[1];
		};
		
		this.GetScale = function(){
			this.scale = vec3.clone(this.transform.scale);
			return this.scale;
		};
		this.SetScale = function(scale){
			//this.scale= vec3.clone(scale);
			//this.scale[2] = scale[0];
			this.scale[0] = scale[0];
			this.scale[1] = scale[1];
			
			this.transform.ScaleTo([this.scale[0],this.scale[1],
			                        this.transform.scale[2]]);
			this.width =this.initialWidth*this.scale[0];
			this.height=this.initialHeight*this.scale[1];
			
		};
		
		this.SetLayout = function(w0,w1,h0,h1){
			if(!this.layout)
				this.layout = new UILayout(this,w0,w1,h0,h1);
			else
				this.layout.Update();
			
			//this.SetTranslate([this.layout.w0dist,this.layout.h0dist]);
			SetParentOffset([this.layout.w0dist,this.layout.h0dist],this.transform);
			this.SetScale(this.layout.scale);
		};
		
		this.SetDepth = function(depth){
			this.transform.MoveTo([	this.transform.position[0],
			                    	this.transform.position[1],
			                       depth]);
		};
		
		this.SetRotation = function(rot){
			this.transform.Rotate(rot);
		};
		
	};
	cls.prototype = Object.create(UIElement.prototype);
	cls.prototype.constructor = cls;
	return cls;
})();