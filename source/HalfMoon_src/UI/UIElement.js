var UIElement = (function(){
	var cls = function(name,width,height,textureNm,material){
		UIBase.call(this,name);
		//var _isVideo = false;
		this.uiElementState = UIELEMENTSTATE.Texture2D;
		
		this.updateState = UIELEMENT_INITIALSTATE.LOADING;
		
		this.isDrawable = true;
		this.isUpdatable =true;
		this.width = width;
		this.height = height;
		this.scalable = true;
        
		this.data = {};
		this.data.uvs =[0.0, 1.0,
                  0.0, 0.0,
                  1.0, 1.0,
                  1.0, 0.0];
		
		this.data.indice = [0,1,2,1,3,2];
		this.data.normals = [0,0,1,
		                0,0,1,
		                0,0,1,
		                0,0,1];
		//this.hotZone =[0,0,this.width,this.height];
		this.listeningZone = [[0,0,this.width,this.height]];
		this.transform = new Transform(this.name+"Trans");
		this.transform.input = this;
		this.shape = new Shape(this.name+"quadShape");

		if(material){
			this.material = material;
		}else if(HalfMoon.materials){
			this.material = HalfMoon.materials["quad"].clone();
		}
		//this.material.drawables.push(this);
		
		if(textureNm){

			if(typeof textureNm === 'string'&&
					textureNm.match(/^[\w_\./]+(png|jpg|gif)$/)){
				var ext = textureNm.split(".")[1];
	
				var isVideo = (ext=="png"||ext=="gif"||ext=="jpg")?false:true;
				
				if(!isVideo){
					this.texture= new Texture(HalfMoon.renderer[0].graphic.gl,textureNm);
				}else{
					this.uiElementState = UIELEMENTSTATE.Video;
					
					this.texture= new Texture(HalfMoon.renderer[0].graphic.gl,textureNm,
									null,"VideoTexture");//callback is null;
				}
			}else if(typeof textureNm === 'function'){//HTML canvas code
				if(!HalfMoon.canvas2d)
					HalfMoon.canvas2d = document.createElement("canvas");
				//_isVideo = false;
				this.uiElementState = UIELEMENTSTATE.HTML;
				this.texture= new Texture(HalfMoon.renderer[0].graphic.gl,
										textureNm,null,"HTMLTexture",this.width,this.height);
			}
			this.material.setTexture("diffCol",this.texture);
		};
		//HalfMoon.objs.push(this);
		this.data.vertice = [0,0,0,
				                0,-this.height,0,
				                this.width,0,0,
				                this.width,-this.height,0];
		this.shape.load(this.data);
		this.isInitialized = false;
		
		this.Initialize = function(render){
//			this.data.vertice = [0,0,0,
//					                0,-this.height,0,
//					                this.width,0,0,
//					                this.width,-this.height,0];
//			this.shape.load(this.data);
			this.isInitialized = true;
		};
		this.Update = function(width,height){//callback Update
		
			if(this.uiElementState == UIELEMENTSTATE.HTML)
				this.texture.HTML.UpdateHTML(width,height);
			
		};
		var _draw = this.draw;//parent draw from HierachyObj
		this.draw = function(render){
//			if(this.isUpdatable)
//				this.Update();
			if(!this.isDrawable)
				return;
			
			if(this.uiElementState == UIELEMENTSTATE.Video)//is video
				this.texture.video.UpdateVideo();
			var graphic = render.graphic;
			var cam = HalfMoon.UIRoot.uiCam;
			var gl =  graphic.gl;
			
		    //gl.enable(gl.BLEND);
		   // gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
		   // gl.disable(gl.DEPTH_TEST);
		    
			if(this.updateState == UIELEMENT_INITIALSTATE.LOADING){
				
				
			}else if (this.updateState == UIELEMENT_INITIALSTATE.INITIAL){
				if(!this.isInitialized)
					this.Initialize.call(this,render);
			}else{//ALWAYS
				this.Initialize.call(this,render);
			}
			

			this.material.draw(graphic);
			//this.transform.draw(graphic,this.material,cam,this.parent.transform.globalMatrix);
			this.transform.draw(graphic,this.material,cam);
			
			this.shape.draw(graphic,this.material);

		    //gl.disable(gl.BLEND);
		    //gl.enable(gl.DEPTH_TEST);
		    
		    
		    
		    _draw.call(this,render);//draw children
		};
	};
	cls.prototype = Object.create(UIBase.prototype);
	cls.prototype.constructor = cls;
	return cls;
})();