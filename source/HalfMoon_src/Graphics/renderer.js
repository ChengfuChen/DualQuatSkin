var Renderer = (function () {
	
	
	
    // constructor
    var cls = function (parameters) {
    	this.Resize = function(vec2){
    		
        	this.Width = vec2[0];
        	this.Height = vec2[1];
        	
        	_gl.viewportWidth = this.Width;
        	_gl.viewportHeight =this.Height;
        	_gl.viewport(0, 0, this.Width,this.Height);

            this.viewports[2] = this.Width;this.viewports[3] = this.Height;
        	
        };
        HalfMoon.renderer.push(this);
    	HalfMoon.SysEvent.Subscribe("CanvasResize:",this,this.Resize);
        var frameBuffers = [];
        var textures = [];
        var renderBuffers = [];
        var _isInitialized = false;
        var _canvas;
        var _gl;
        this.settings = {blend:false,bgColor : [0.6,0.6,0.6,1.0]};
        
        this.Set = function(params){
        	this.settings = params;
        	if(this.settings["blend"]){
        		_gl.blendFunc(_gl.SRC_ALPHA, _gl.ONE);
        		_gl.enable(_gl.BLEND);
        		_gl.disable(_gl.DEPTH_TEST);
        	}else{
                _gl.disable(_gl.BLEND);
                _gl.enable(_gl.DEPTH_TEST);
        	}
        	
        	_gl.clearColor(this.settings["bgColor"][0], this.settings["bgColor"][1], this.settings["bgColor"][2], this.settings["bgColor"][3]);
        };
        
        this.clear = function(){
        	
        	
        };
        
        this.initialize = function(parameters){
            _canvas = parameters.canvas;
            this.canvas = _canvas;
            this.graphic  = new Graphics(_canvas);
            _gl = this.graphic.gl;
            this.Name = parameters.ID;
            this.Width = parameters.Width;
            this.Height = parameters.Height;
            this.viewports = vec4.create();
            this.viewports[2] = this.Width;this.viewports[3] = this.Height;
            this.cam = parameters.cam;
            _isInitialized = true;
        };
        this.initialize(parameters);
        
                     
        
        this.initFrameBuffer = function (gl) {
            var ext = gl.getExtension("OES_texture_float");
            if (!ext)
                alert("Doesnt support OES_texture_float");
            

            for (var i = 0; i < 2; i++) {
                var frameBuffer = gl.createFramebuffer();
                gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
                frameBuffer.width = 256;//parameters.Width;
                frameBuffer.height = 256;//parameters.Height;

                var texture = gl.createTexture();
                gl.bindTexture(gl.TEXTURE_2D, texture);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);//gl.NEAREST);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,gl.NEAREST);//gl.NEAREST); 
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);//CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);//CLAMP_TO_BORDER);
                //gl.generateMipmap(gl.TEXTURE_2D);
                //gl.hint(gl.GL_GENERATE_MIPMAP_HINT,gl.GL_NICEST);
                gl.pixelStorei(gl.UNPACK_COLORSPACE_CONVERSION_WEBGL,gl.NONE);
                gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, frameBuffer.width, frameBuffer.height, 0, gl.RGBA, gl.FLOAT, null);

                var renderBuffer = gl.createRenderbuffer();
                gl.bindRenderbuffer(gl.RENDERBUFFER, renderBuffer);
                gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, frameBuffer.width, frameBuffer.height);

                gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
                gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, renderBuffer);

                gl.bindTexture(gl.TEXTURE_2D, null);
                gl.bindRenderbuffer(gl.RENDERBUFFER, null);
                gl.bindFramebuffer(gl.FRAMEBUFFER, null);


                frameBuffers.push(frameBuffer);
                textures.push(texture);
                renderBuffers.push(renderBuffer);
            }
        };
        this.initFrameBuffer(_gl);
        this.CleanFrameBuffer= function(){frameBuffers = [];};

        this.Swap = function(a,b){
        	
        	var tmpFrameBuffer = frameBuffers[a];
        	frameBuffers[a] = frameBuffers[b];
        	frameBuffers[b] = tmpFrameBuffer;
        	
        	var tmpTex = textures[a];
        	textures[a] = textures[b];
        	textures[b] = tmpTex;
        	
        	var tmpRenderBuffer = renderBuffers[a];
        	renderBuffers[a] = renderBuffers[b];
        	renderBuffers[b] = tmpRenderBuffer;
        };
        


//        this.clone = function() {
//            if (null == obj || "object" != typeof obj) return obj;
//            var copy = obj.constructor();
//            for (var attr in obj) {
//                if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
//            }
//            return copy;
//        };
        this.getTexture = function (index) {
            return textures[index];
        };
        
        this.render2FBO = function(renderObjs,fbo,material,camera){
			fbo.bind();		
			_gl.clearColor(0, 0, 0, 1);
			_gl.clear(_gl.COLOR_BUFFER_BIT | _gl.DEPTH_BUFFER_BIT);
			_gl.viewport(0, 0, fbo.width, fbo.height);     
			
			var mats=[];
			if(material)
				//backup material
				for(var i=0;i<renderObjs.length;i++){
					mats.push(renderObjs[i].material);
					if(material.name=="deferred_diffCol")
						material.setTexture("diffCol",
								renderObjs[i].material.getTexture("diffCol"));
					renderObjs[i].material = material;
				}
			
			
			if(camera){
	            var _cam = this.cam;
	            this.cam = camera;
				this.render(renderObjs);
	            this.cam = _cam;
			}else
				this.render(renderObjs);
			
			if(material)
				//recover material data
				for(var i=0;i<renderObjs.length;i++)
					renderObjs[i].material = mats[i];
			
			
			fbo.unbind(); 
        };
        
        this.render2Buffer = function (renderObjs,camera,bufferIndex) {
                if (frameBuffers.length==0)
                    try {
                        this.initFrameBuffer(_gl);
                    }
                    catch (e) {
                        alert("EEE");

                    }
                    _gl.bindFramebuffer(_gl.FRAMEBUFFER, frameBuffers[bufferIndex]);
            
                    _gl.clear(_gl.COLOR_BUFFER_BIT | _gl.DEPTH_BUFFER_BIT);
                	
//                    _gl.enable(_gl.BLEND);
//                    _gl.blendFunc(_gl.SRC_ALPHA, _gl.ONE);
//                    _gl.disable(_gl.DEPTH_TEST);

                    var _cam = this.cam;
                    this.cam = camera;
                    this.render(renderObjs);
                    this.cam = _cam;


                    _gl.bindTexture(_gl.TEXTURE_2D, null);
                    _gl.bindFramebuffer(_gl.FRAMEBUFFER, null);
        };


        this.render = function (renderObjs) {//renderObjs


        	//_gl.clearColor(_setting["bgColor"][0], _setting["bgColor"][1], _setting["bgColor"][2], _setting["bgColor"][3]);


            for (var i = 0; i < renderObjs.length; i++)

            	renderObjs[i].draw(this);

        };
        this.renderSingle = function (obj) {//renderObjs


        	//_gl.clearColor(_setting["bgColor"][0], _setting["bgColor"][1], _setting["bgColor"][2], _setting["bgColor"][3]);

        	obj.draw(this);

        };
//        this.solve = function (fnc, cam, params) {
//
//
//        	 _gl.viewport(0, 0, parameters.Height, parameters.Width);
//             
//        	 if(params.Clear)//??????????????????????????????????????
//        	 	_gl.clear(_gl.COLOR_BUFFER_BIT | _gl.DEPTH_BUFFER_BIT);
//
//             _gl.enable(_gl.BLEND);
//             _gl.blendFunc(_gl.SRC_ALPHA, _gl.ONE);
//             _gl.disable(_gl.DEPTH_TEST);
//
//             _gl.uniformMatrix4fv(_gl.shader.pMatrixUniform, false, cam.GetPersMatrix());
//            
//                      
//            
//                var front = params.FrontTex;
//                var back = params.BackTex;
//               // var mid = params.MidTex;
//                //var mid = textures[params.MidTex];
//                _gl.uniform1i(_gl.shader.uSolve, params.Solve);
//                _gl.uniform1f(_gl.shader.uDeltaT, 0.1);
//                if (params.ToScreen) {
//                    fnc.call(this, _gl, cam, front, back);
//                }
//                else {
//                    var frameBuffer = frameBuffers[params.DestBufferIndex];
//                        	
//                    _gl.bindFramebuffer(_gl.FRAMEBUFFER, frameBuffer);
//                    fnc.call(this, _gl, cam, front, back); //,frontFrameBuffer,frontTex);
//                    _gl.bindTexture(_gl.TEXTURE_2D, textures[params.DestBufferIndex]);
//                    //_gl.generateMipmap(_gl.TEXTURE_2D);
//                    _gl.bindTexture(_gl.TEXTURE_2D, null);
//                    _gl.bindFramebuffer(_gl.FRAMEBUFFER, null);
//                }
//                   
//        }

    };

    return cls;
})();

//Renderer = Renderer;

