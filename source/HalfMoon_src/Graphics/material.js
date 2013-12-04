 var Material = (function(){
	var _collection = {};

	var cls = function(name,params){
		this._data = {};
		this._textures = {};
		this.name = name;
		//this.drawables = [];
		_collection[name] = this;
		if(!HalfMoon.materials)
			HalfMoon.materials = _collection;
		var gl = params.gl;
		var vertexShader = params.vertexShader;
		var fragmentShader = params.fragmentShader;
		var attributes = [];
		var uniforms = [];
		for (var attr in params.attributes)
			attributes[attr] = params.attributes[attr];
		for (var name in params.uniforms){
      	  var obj = {};
          for (var attr in params.uniforms[name]) {
        		  obj[attr] = params.uniforms[name][attr];
          }
          uniforms[name] = obj;
		}
		
//		attributes = params.attributes;
//		uniforms = params.uniforms;
		this.shader = params.shader;
		this.params = params;
		
		this.attributes = attributes;
		this.uniforms = uniforms;

		this._shaderProgram = gl.createProgram();
		gl.attachShader(this._shaderProgram, vertexShader);
		gl.attachShader(this._shaderProgram, fragmentShader);
		    
		gl.linkProgram(this._shaderProgram);
		    
		if (!gl.getProgramParameter(this._shaderProgram, gl.LINK_STATUS)) {
		    alert("Could not initialise shaders");
		}
		    
		gl.useProgram(this._shaderProgram);

		for(var i=0;i<attributes.length;i++){
				this._data[attributes[i]] = gl.getAttribLocation(this._shaderProgram,attributes[i]);
			    //gl.enableVertexAttribArray(this._data[attributes[i]]);
		}
		    
		for(var name in uniforms)
				this._data[name] = gl.getUniformLocation(this._shaderProgram,name);
		 	


		
		this.setTexture = function(key, texture){
			if(texture.data)
				this._textures[key] = texture.data;
			else
				this._textures[key] = texture;
			
		};
		this.getTexture = function(key){
			
			return this._textures[key];
			
		}
//		this.set = function(data){
////			???????
////					???????
////							???????
////									???????
////											???????
////													???????
////															???????
//																	
//		 	for(var i=0;i<uniforms.length;i++)
//				if(uniforms[i].name == data.name)
//					uniforms[i].value = data.value;
//			
//		};
		var _this = this;
//		this.clone = function(obj) {
//            if (null == obj || "object" != typeof obj) return obj;
//            var copy = obj.constructor();
//            for (var attr in obj) {
//                if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
//            }
//            return copy;
//        };
		this.clone = function() {
            if (null == _this || "object" != typeof _this) return _this;
            
            var num = _this.name.match(/\d$/);
            if(num)
            	_this.name = this.name.replace(/\d$/g,++num[0]);
            else 
            	_this.name += '0';
            var copy = new _this.constructor(_this.name,_this.params);

            return copy;
        };
        this.rebuilt = function() {
            if (null == _this || "object" != typeof _this) return _this;
            
            var num = _this.name.match(/\d$/);
            if(num)
            	_this.name = this.name.replace(/\d$/g,++num[0]);
            else 
            	_this.name += '0';


            this._shaderProgram = gl.createProgram();
            this.shader.create(gl);
            this.shader.compile(gl);
//            
//    		gl.attachShader(copy._shaderProgram, copy.shader.vertex);
//    		gl.attachShader(copy._shaderProgram, copy.shader.fragment);
//    		gl.linkProgram(copy._shaderProgram);
            _this.params.vertexShader = this.shader.vertex;
            _this.params.fragmentShader = this.shader.fragment;
            var copy = new _this.constructor(_this.name,_this.params);
    		return copy;
        };
		this.TextureFncCB = null;
		this.draw = function(graphic,textureFnc){
			var gl = graphic.gl;
			gl.useProgram(this._shaderProgram);

		 	if(textureFnc)
		 		textureFnc();
		 	else if(this.TextureFncCB)
		 		this.TextureFncCB();
		 	else{

		 		graphic.gl.activeTexture(graphic.gl.TEXTURE0);
		 		if(this._textures["diffCol"])
			 		graphic.gl.bindTexture(graphic.gl.TEXTURE_2D, this._textures["diffCol"]);
		 		else	
		 			graphic.gl.bindTexture(graphic.gl.TEXTURE_2D, null);

		 		graphic.gl.activeTexture(graphic.gl.TEXTURE1);
		 		if(this._textures["ambOcc"])
			 		graphic.gl.bindTexture(graphic.gl.TEXTURE_2D, this._textures["ambOcc"]);
		 		else
		 			graphic.gl.bindTexture(graphic.gl.TEXTURE_2D, null);
		 		
		 	}
		 	
		 	for(var i in this.uniforms){
		 		var data =this.uniforms[i]; 
		 		var name = i;
		 		if(this.uniforms[i].type=="Int")
		 			gl.uniform1i(this._data[name], data.value);
		 		else if(this.uniforms[i].type=="Float")
		 			gl.uniform1f(this._data[name], data.value);
		 		else if(this.uniforms[i].type=="Float2")
		 			gl.uniform2f(this._data[name], data.value[0],data.value[1]);
		 		else if(this.uniforms[i].type=="Float3")
		 			gl.uniform3f(this._data[name], data.value[0],
		 						data.value[1],data.value[2]);
		 		else if(this.uniforms[i].type=="Float4")
		 			gl.uniform4f(this._data[name], data.value[0],
		 						data.value[1],data.value[2],data.value[3]);
		 	};
		};
	};
	cls.prototype._collection = _collection;	

	return cls;
	
})();
//Material = Material;



