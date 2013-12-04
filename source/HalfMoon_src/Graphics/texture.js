var Texture = (function(){
	var _collection = {}, myCanvasContext;
	var cls = function (gl,path,callbackFnc,type,width,height){
		this.callbackFnc = callbackFnc;
		this.type = type == null?"2DTexture":type;//????????should it be undefined?
		var self = this;
		this.name = path;
		if(!HalfMoon.textures)
			HalfMoon.textures = _collection;
		
	
//		this.Get2dCtx = function(){
//			
//			return myCanvasContext;
//		};
//		this.SetCanvasCode = function(jsCode){
//			eval(jsCode);
//			this.Get2dCtx().drawImage(this.data.image,0,0); 
//		    gl.bindTexture(gl.TEXTURE_2D, this.data);
//		    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,
//	        						gl.UNSIGNED_BYTE,HalfMoon.canvas2d);
//
//		};
		
		this.SetCanvas2d = function(canvas){
			HalfMoon.canvas2d = canvas;
			myCanvasContext = HalfMoon.canvas2d.getContext("2d");
		};
		
	    this.data = gl.createTexture();
        
	    if(this.type=="3DTexture"||this.type=="HTMLTexture"){
	    	if(!width) {this.width = 256; this.height =256;}
	    	else {this.width = width;this.height = height;}
	    }	
        if(this.type=="VideoTexture"){
	    	this.video = document.createElement('video');
	    	this.video.autoplay = false;
	    	this.video.src = path;
	    	this.video.preload = "auto";
	    	
	    	this.video.StartVideo = function(){};
	        this.video.FinishVideo = function(){};
	      
	        this.video.UpdateVideo = function(){
	        	
	        	gl.bindTexture(gl.TEXTURE_2D, self.data);
	        	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
	        	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,
	        	        		gl.UNSIGNED_BYTE, self.video);
	        };
	        this.video.addEventListener("canplaythrough", this.video.StartVideo, true);
	        this.video.addEventListener("ended", this.video.FinishVideo, true);
		}else if(this.type=="HTMLTexture"&&typeof path === 'function'){
			//eval(path);
			this.HTML = path;
			this.HTML.UpdateHTML = function(width,height){//will be called from outside
				self.width=width;self.height=height;
				myCanvasContext = HalfMoon.canvas2d.getContext("2d");
				myCanvasContext.clearRect(0, 0, HalfMoon.canvas2d.width, HalfMoon.canvas2d.height);
				HalfMoon.canvas2d.width = self.width;
				HalfMoon.canvas2d.height = self.height;
				self.HTML.call(this,HalfMoon.canvas2d,myCanvasContext,self.width,self.height);
			    gl.bindTexture(gl.TEXTURE_2D, self.data);
			    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,
		        						gl.UNSIGNED_BYTE,HalfMoon.canvas2d);
			};
			this.HTML.UpdateHTML(self.width,self.height);
		}
	    else
	    	this.data.image = new Image();
		

	    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
	    gl.bindTexture(gl.TEXTURE_2D, this.data);
	    //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
	    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        
        
	    var _this = this;
	    var set2DTextureParams = function(gl){
	       // gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
	        gl.bindTexture(gl.TEXTURE_2D, _this.data);
	        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, _this.data.image);
	        gl.generateMipmap(gl.TEXTURE_2D);
	        gl.bindTexture(gl.TEXTURE_2D, null);
	    };
	    var setVideoTextureParams = function(gl){;
		    
	    };
			
	    var set3DTextureParams = function(gl){
	    	
//	    	var texture = gl.createTexture();
//	        gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
//	        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
//	        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
//	        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
//	        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
//
//	        var faces = [["_xPlus.jpg", gl.TEXTURE_CUBE_MAP_POSITIVE_X],
//	                     ["_xMinus.jpg", gl.TEXTURE_CUBE_MAP_NEGATIVE_X],
//	                     ["_yPlus.jpg", gl.TEXTURE_CUBE_MAP_POSITIVE_Y],
//	                     ["_yMinus.jpg", gl.TEXTURE_CUBE_MAP_NEGATIVE_Y],
//	                     ["_zPlus.jpg", gl.TEXTURE_CUBE_MAP_POSITIVE_Z],
//	                     ["_zMinus.jpg", gl.TEXTURE_CUBE_MAP_NEGATIVE_Z]];
//	        for (var i = 0; i < faces.length; i++) {
//	            var face = faces[i][1];
//	            var image = new Image();
//	            image.onload = function(texture, face, image) {
//	                return function() {
//	                    gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
//	                    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
//	                    gl.texImage2D(face, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
//	                }
//	            } (texture, face, image);
//	            image.src = "images/skybox"+faces[i][0];
//	        }
//	        _this.data =  texture;
	    	
	    	
	    
	    	var texture = gl.createTexture();
	        gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
	        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	        
	        
	        //??????????????????????????????????
	        HalfMoon.canvas2d.width = 512;//this.width; 
	        HalfMoon.canvas2d.height = 512;//this.height;
	        //var myCanvasContext = HalfMoon.canvas2d.getContext("2d"); // Get canvas 2d context
	        
	        myCanvasContext.drawImage(_this.data.image, 1024, 512, 512,512,0,0,512,512); 	      
	        gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
	        gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, HalfMoon.canvas2d);
	        
	        myCanvasContext.drawImage(_this.data.image, 0, 512, 512,512,0,0,512,512); 
	        gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
	        gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_X, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, HalfMoon.canvas2d);
	        
	        myCanvasContext.drawImage(_this.data.image, 512, 1024, 512,512,0,0,512,512); 
	        gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
	        gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Y, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, HalfMoon.canvas2d);
	        
	        myCanvasContext.drawImage(_this.data.image, 512,0, 512,512, 0,0,512,512); 
	        gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
	        gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, HalfMoon.canvas2d);
	        
	        myCanvasContext.drawImage(_this.data.image, 512, 512,512,512,0,0,512,512); 
	        gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
	        gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Z, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, HalfMoon.canvas2d);
	        
	        
	        myCanvasContext.drawImage(_this.data.image, 1536, 512,512,512,0,0,512,512); 
	        gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
	        gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, HalfMoon.canvas2d);

	        _this.data = texture;

//	        //out of range
//	        gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
//	        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, _this.data.image);
//	        gl.copyTexSubImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X, 
//	        				0,//level
//	        				1024,//xoffset
//	        				512,//yoffset
//	        				0,500,
//	        				2,//width
//	        				2);
//	        _this.data = texture;
//	        //Type error
//	        gl.texSubImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_X, 
//	        				0,//level
//	        				0,//xoffset
//	        				512,//yoffset
//	        				512,//width
//	        				512,//height
//	        				gl.RGBA,//format
//	        				gl.UNSIGNED_BYTE,//type
//	        				_this.data.image);
//	        gl.texSubImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Y, 
//		    				0,//level
//		    				512,//xoffset
//		    				0,//yoffset
//		    				512,//width
//		    				512,//height
//		    				gl.RGBA,//format
//		    				gl.UNSIGNED_BYTE,//type
//		    				_this.data.image);
//	        gl.texSubImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, 
//		    				0,//level
//		    				512,//xoffset
//		    				1024,//yoffset
//		    				512,//width
//		    				512,//height
//		    				gl.RGBA,//format
//		    				gl.UNSIGNED_BYTE,//type
//		    				_this.data.image);
//	        gl.texSubImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Z, 
//		    				0,//level
//		    				512,//xoffset
//		    				512,//yoffset
//		    				512,//width
//		    				512,//height
//		    				gl.RGBA,//format
//		    				gl.UNSIGNED_BYTE,//type
//		    				_this.data.image);
//	        gl.texSubImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, 
//		    				0,//level
//		    				1536,//xoffset
//		    				512,//yoffset
//		    				512,//width
//		    				512,//height
//		    				gl.RGBA,//format
//		    				gl.UNSIGNED_BYTE,//type
//		    				_this.data.image);
		};
			
	    if(this.type!="VideoTexture"&&this.type!="HTMLTexture"){
		    this.data.image.onload = function () {
		    	if(_this.type=="2DTexture")
		    		set2DTextureParams(gl,_this.data);//this = image
		    	else if(_this.type=="3DTexture")
		    		set3DTextureParams(gl,_this.data);
	
				_collection[_this.name] = _this.data;
				
				if(_this.callbackFnc)
					_this.callbackFnc.call(this);
		    };
		    this.data.image.src = path;
	    }else{
	    	
	    	
	    	
	    }
	    
	    

	};

	cls.prototype._collection = _collection;
	return cls;
	
})();
//Texture = Texture;