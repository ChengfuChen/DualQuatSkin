HalfMoon.initialize = function(renderer, callback){

	HalfMoon.scenePanel = new UIScenePanel();
	HalfMoon.boundingBox = new BoundingBox([-1,-1,-1],[1,1,1]);
	HalfMoon.DataManager = new DataManager();

	var attributes,fs,vs, material;
	attributes = ["aVertexPosition","aVertexNormal","aTextureCoord"];

	//////////////////////////////////////////////////////////////////debug
	var shader = new Shader(HalfMoon.sourcePath+"/shaders/debug.shader",
			renderer.graphic.gl,function(sh){

		material = new Material("debug",{gl:renderer.graphic.gl,vertexShader:sh.vertex,
			fragmentShader:sh.fragment,			
			attributes:sh.attributes,
			uniforms:sh.uniforms
		});
	});

	//////////////////////////////////////////////////////////////////Default 
	var shader = new Shader(HalfMoon.sourcePath+"/shaders/default.shader",
			renderer.graphic.gl,function(sh){

		var texture = new Texture(renderer.graphic.gl,"images/gray.png");
		material = new Material("default",{gl:renderer.graphic.gl,vertexShader:sh.vertex,
			fragmentShader:sh.fragment,			
			attributes:sh.attributes,
			uniforms:sh.uniforms
		});
		material.setTexture("diffCol",texture);
	});

	//////////////////////////////////////////////////////////////////Default 
	
	//////////////////////////////////////////////////////////////////Quad
	var shader = new Shader(HalfMoon.sourcePath+"/shaders/quad.shader",
			renderer.graphic.gl,function(sh){
		
		//var texture = new Texture(renderer.graphic.gl,"images/logo.png");
		material = new Material("quad",
			{gl:renderer.graphic.gl,
			vertexShader:sh.vertex,
			fragmentShader:sh.fragment,
			attributes:sh.attributes,
			uniforms:sh.uniforms
			});
	});
	//////////////////////////////////////////////////////////////////Quad
	
	
	
	//////////////////////////////////////////////////////////////////SelectionSh
	
	var shader = new Shader(HalfMoon.sourcePath+"/shaders/selection.shader",
			renderer.graphic.gl,function(sh,shader){
			material = new Material("selection",
			{
				gl:renderer.graphic.gl,vertexShader:sh.vertex,
				fragmentShader:sh.fragment,attributes:sh.attributes,
				uniforms:sh.uniforms,shader:shader
			});
	});
	//////////////////////////////////////////////////////////////////SelectionSh
	
	
	
	//////////////////////////////////////////////////////////////////Deferred
	var shader = new Shader(HalfMoon.sourcePath+"/shaders/deferred_diffCol.shader",
			renderer.graphic.gl,function(sh){
		
		material = new Material("deferred_diffCol",{gl:renderer.graphic.gl,vertexShader:sh.vertex,
			fragmentShader:sh.fragment,attributes:sh.attributes,
			uniforms:sh.uniforms
			});
	});

	
	var shader = new Shader(HalfMoon.sourcePath+"/shaders/deferred_depth.shader",
			renderer.graphic.gl,function(sh){
		
		material = new Material("deferred_depth",
				{gl:renderer.graphic.gl,vertexShader:sh.vertex,
				fragmentShader:sh.fragment,attributes:sh.attributes,
				uniforms:sh.uniforms
			});
	});
	
	var shader = new Shader(HalfMoon.sourcePath+"/shaders/deferred_normal.shader",
			renderer.graphic.gl,function(sh){
		
		material = new Material("deferred_normal",{gl:renderer.graphic.gl,vertexShader:sh.vertex,
			fragmentShader:sh.fragment,attributes:sh.attributes,
			uniforms:sh.uniforms
			});
	});
	var shader = new Shader(HalfMoon.sourcePath+"/shaders/deferred_directionLight.shader",
			renderer.graphic.gl,function(sh){
		
		material = new Material("deferred_directionLight",{gl:renderer.graphic.gl,vertexShader:sh.vertex,
			fragmentShader:sh.fragment,attributes:sh.attributes,
			uniforms:sh.uniforms
			});
	});
	//////////////////////////////////////////////////////////////////Deferred 
	
	
	
};
