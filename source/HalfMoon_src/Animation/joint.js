var Joint = (function(){
    var _axis,_shape,_scale,_data,_material,
    	_isInitialized = false, primaryAxis = "x";
	var cls = function(params){
		HierachyDrawableObj.call(this,params.name);
		//this.params = params;
		this.length = params._length?params._length:0;
        this.transform = new Transform(params.name+"Transform");
        this._scaleX = this.length?this.length:0;
        this.rotOrder = params.rotOrder;
        this.axisOffset = params.axisOffset;
        this.direction = params.direction;
        this.rotInitMat = mat4.create();
		this._localDiffMat = mat4.create();
		this.InitMat = mat4.create();
        this.offsetMat = mat4.create();
        this.offsetMat[0] = this._scaleX;
        mat4.rotateY(this.offsetMat, this.offsetMat, Math.degree2Radian(-90));
        this.offsetMat[10] *= this._scaleX;
        this.offsetMat[6]  *= this._scaleX;
        this.offsetMat[2]  *= this._scaleX;
        if(params.direction)
				mat4.rotateToVec(this.rotInitMat,'z',params.direction);
        if(!_isInitialized)
        	this.Initialize();
	};
	cls.prototype = Object.create(HierachyDrawableObj.prototype);
	cls.prototype.constructor = cls;
	   
	cls.prototype.Initialize = function(){

	    _axis = new Axis();
		_material = HalfMoon.materials["debug"].clone();
		_data={};    
        _shape = new Shape("JointShape");
        _scale = 0.3;
        _data.vertice = [
                        //Front
                        0.0, 	_scale, 	_scale,
                        1.0, 	0.0,		0.0,
                        1.0, 	0.0,		0.0,
                        0.0, 	-_scale, 	_scale,
                        0.0, 	-_scale, 	_scale,
                        0.0, 	_scale, 	_scale,
                        
                        //Back
                        0.0, 	_scale, 	-_scale,
                        1.0, 	0.0,		0.0,
                        1.0, 	0.0,		0.0,
                        0.0, 	-_scale, 	-_scale,
                        0.0, 	-_scale, 	-_scale,
                        0.0, 	_scale, 	-_scale,
                        
                        //Up
                        0.0, 	_scale, 	_scale,
                        1.0, 	0.0,		0.0,
                        1.0, 	0.0,		0.0,
                        0.0, 	_scale, 	-_scale,
                        0.0, 	_scale, 	-_scale,
                        0.0, 	_scale, 	_scale,
                        
                        //Down
                        0.0, 	-_scale, 	_scale,
                        1.0, 	0.0,		0.0,
                        1.0, 	0.0,		0.0,
                        0.0, 	-_scale, 	-_scale,
                        0.0, 	-_scale, 	-_scale,
                        0.0, 	-_scale, 	_scale
                        
            ];
        _shape.load(_data);
        _shape.shapeRenderState = _shape.RENDERSTATE.Lines;
        _isInitialized = true;
	};
	
	var _isSkeletonIntialized = false;
	function skeletonInitialize(parent){

		mat4.multiply(parent.InitMat,
				parent.InitMat,
				parent._localDiffMat);		
		
		for(var childNm in parent.children){
			var child = parent.children[childNm];
		

			
			child.InitMat = mat4.clone(parent.InitMat);
			skeletonInitialize(child);
		};
		
		_isSkeletonIntialized = true;
	};
	
	var _setLocalDiffMatSubscriber = function(who){

		var parent = who.parent, child=who.child,inverseMat = mat4.create();
		
		//escape when arent joint
		if(!(parent instanceof Joint&& child instanceof Joint))
			return;
	
		mat4.invert(inverseMat,parent.rotInitMat);
		mat4.multiply(child._localDiffMat,inverseMat,child.rotInitMat);
		child._localDiffMat[14] = parent._scaleX;
		
		//child.transform.worldMatrix = child._localDiffMat;
		delete inverseMat;
	};

	HalfMoon.SysEvent.Subscribe("ChildrenChanged:",cls,_setLocalDiffMatSubscriber);

	var _draw = cls.prototype.draw;
	
//
//	cls.prototype.convert2World = function (renderer){
//    	if(!_isSkeletonIntialized)
//    		skeletonInitialize(this);
//    	
//    	if(this.parent)
//        	mat4.multiply(this.parentMat,
//        				this.parent.transform.globalMatrix,
//        				this._localDiffMat);	
//		
//    	mat4.multiply(this.transform.globalMatrix,
//    			this.parentMat,this.transform.worldMatrix);
//	};
	
	cls.prototype.draw = function (renderer) {
    	var graphic = renderer.graphic;

    	if(!_isSkeletonIntialized)
    		skeletonInitialize(this);
    	
    	
    	if(this.parent){
        	mat4.multiply(this.parentMat,
        				this.parent.transform.globalMatrix,
        				this._localDiffMat);	
		}
    	else{
    		
    	}
    	
    	_material.draw(graphic);
		this.transform.draw(graphic,_material,renderer.cam,
							this.parentMat,this.offsetMat);
		_shape.draw(graphic,_material);
		
    	_axis.transform.worldMatrix=this.transform.globalMatrix;
    	_axis.draw(renderer);
    	
		_draw.call(this,renderer);
    };
	return cls;
	
})();