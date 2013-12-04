var HalfMoon = {};
HalfMoon.sourcePath = "";

var buffer = window.location.href.split('/');
for(var i=0;i<buffer.length-1;i++)
	if(i==buffer.length-2)
		HalfMoon.sourcePath+=buffer[i];
	else
		HalfMoon.sourcePath+=buffer[i]+'/';

HalfMoon.Classes = {};
HalfMoon.renderer = [];
HalfMoon.objs = {};
HalfMoon.materials = null;
//HalfMoon.graphObj = {};
HalfMoon.cams = {};
HalfMoon.drawableObj = [];
HalfMoon.uiObj = [];


//HalfMoon.FindIndex = function(array,name){
//	for(var i in array){
//		if(array[i].name == name)
//			return i;
//	}
//};
//HalfMoon.DeleteByNm = function(array,name){
//	var index = HalfMoon.FindIndex(array,name);
//	array.splice(index,1);
//	delete index;
//};

function CheckNm(objs,name){
	var isNameClashed = false;
	for(var i in objs)
		isNameClashed |= (i === name);
	
	if(!isNameClashed)
		return name;
    var num = name.match(/\d$/);
    if(num)
    	name = name.replace(/\d$/g,++num[0]);
    else 
    	name += '0';
    name = CheckNm(objs, name);
    return name;
};	

function _searchByBreadth(obj){
	
	
}

function _searchByDepth(obj,name){
	if(obj[name])
		return obj[name];
	for(var childNm in obj.children)
		_searchByDepth(obj.children[childNm],name);
	
	return undefined;
}


function GetObjByNm(name){
//	var result = null;
//	for(var i=0;i<HalfMoon.objs.length;i++)
//		if(HalfMoon.objs[i].name == name)
//			result = HalfMoon.objs[i];
//	return result;
	
	
	
	return _searchByDepth(HalfMoon.objs,name);
};
function GetObjByFullNm(fullNm){
	var curObj;
	var buffer = fullNm.split("|");
	
	for(var i=0; i<buffer.length;i++)
		if(!buffer[i])//escape in case of starting with ""
		//"|asdf|asdff|" is splited into ["",asdf,asdff,""]
			buffer.splice(i,1);
		
	
	
	for(var i=0; i<buffer.length;i++){
		var name = buffer[i];
		if(i==0){
			curObj = HalfMoon.objs[name];
			continue;
		}
		
		curObj = curObj.children[name];
	}
	
	return curObj;
}
//HalfMoon.loadJS = function(path, cb){
//	$.getScript(path)
//	.done(function(script, textStatus) {
//	  console.log( textStatus );
//		//var graphic = new HalfMoon.Graphics(canvases[0]);
//		//cls.graphics.push(graphic);
//	  	cb();
//	})
//	.fail(function(jqxhr, settings, exception) {
//	 // $( "div.log" ).text( "Triggered ajaxError handler." );
//		console.log("error loading");
//	});
//};

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
};




//HalfMoon.animations = [];
//HalfMoon.animation=null;

HalfMoon.tick = function() {
    requestAnimFrame(HalfMoon.tick);
    HalfMoon.drawScene();
    HalfMoon.animate();
};
var _lastTime = 0;
var Time = {totalTime:0,elapsedTime:0,isRunning:false};
HalfMoon.time = Time;
HalfMoon.animate = function() {
    var timeNow = new Date().getTime();
    if (_lastTime != 0) {
    	Time.elapsedTime = (timeNow - _lastTime)/1000.0;
    	if(Time.isRunning){
    		Time.totalTime += Time.elapsedTime;
    		HalfMoon.SysEvent.Publish("TimeChanged:",Time);
    	}
//    	for(var i=0;i<HalfMoon.animations.length;i++){
//        	var result = HalfMoon.animations[i].call(HalfMoon.animations[i]);
//        	if(result)	HalfMoon.animations.splice(i,1);
//    	}
    }
    _lastTime = timeNow;
};
HalfMoon.draw = null;
//HalfMoon.DrawUI = function(){
//	
//	for(var i in HalfMoon.uiObj)
//		for(var j in HalfMoon.uiObj[i].children)
//			renderer.renderSingle(HalfMoon.uiObj[i].children[j]);
//	
//}
HalfMoon.drawScene = function(cb){

	var renderer = HalfMoon.renderer[0];
	var gl = renderer.graphic.gl;
	//gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	

	if(cb)
		cb();

	gl.enable(gl.DEPTH_TEST);
	gl.disable(gl.BLEND);
	
	var col = renderer.settings["bgColor"];
	gl.clearColor(col[0],col[1],col[2],col[3]);

	var tmp = [];

	for(var i in HalfMoon.drawableObj)
		if(HalfMoon.drawableObj[i].isDrawable)
			tmp.push(HalfMoon.drawableObj[i]);
	
	HalfMoon.DataManager.draw();
	
	renderer.render(tmp);
	HalfMoon.SysEvent.Publish("OnDrawFinish",renderer);

	delete tmp;

    gl.enable(gl.BLEND);
	gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
	gl.disable(gl.DEPTH_TEST);
	
	renderer.render(HalfMoon.uiObj);
    
	gl.disable(gl.BLEND);
    gl.enable(gl.DEPTH_TEST);
};



//HalfMoon.UIroot = new UIMain(HalfMoon.renderer[0].canvas);
Math.degree2Radian = function(x){
	return Math.PI*x/180;
};
Math.radian2Degree = function(x){
	return 180*x/Math.PI;
};
//$.extend(window, pangpang);


