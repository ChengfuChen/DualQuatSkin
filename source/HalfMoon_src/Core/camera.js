var Camera = (function(){
	 // constructor
    var cls = function (parameters) {
		//Obj.call(this,parameters.name);
    	HierachyDrawableObj.call(this,parameters.name);
		this.Resize = function(vec2){
        	this.aspectRatio = vec2[0]/vec2[1];
        	this.width = vec2[0];
        	this.height = vec2[1];
        	if (this.isPersp)
        		mat4.perspective(this.pMatrix,this.fov, this.aspectRatio, this.near, this.far);
        	else
            	 mat4.ortho(this.pMatrix,-this.width/2, this.width/2, -this.height/2, this.height/2, this.near, this.far);
        	
        };
        //this.name = parameters.name;
        if(HalfMoon.cams[this.name]){
        	
            var num = this.name.match(/\d$/);
            if(num)
            	this.name = this.name.replace(/\d$/g,++num[0]);
            else 
            	this.name += '0';
        }
        
    	HalfMoon.cams[this.name] = this;
    	
    	HalfMoon.SysEvent.Subscribe("CanvasResize:",this,this.Resize);
        this.pMatrix = mat4.create();
        var _vMatrix = mat4.create();
        var _invPMatrix = mat4.create();
        this.isPersp = parameters.isPersp;

        this.GetInvPerspMatrix = function(){
        	mat4.invert(_invPMatrix, this.pMatrix);
        	return _invPMatrix;
        };
        this.GetViewMatrix = function(){
        	//this.transform.Update();
        	mat4.invert(_vMatrix, this.transform.worldMatrix);
        	return _vMatrix;
        };
        this.GetProjMatrix = function(){
        	return this.pMatrix;
        };
        
        this.transform = new Transform(parameters.name+"Trans");
        
        this.fov = parameters.fov;
        this.near = parameters.near;
        this.far = parameters.far;
    	this.width = parameters.width; this.height = parameters.height;
        this.aspectRatio = this.width/this.height;
        var _initialize = false;
        
        
        this.Initialize = function () {

          
            if (this.isPersp)
                mat4.perspective(this.pMatrix,this.fov, this.aspectRatio, this.near, this.far);
            else
                mat4.ortho(this.pMatrix,-this.width/2, this.width/2, -this.height/2, this.height/2, this.near, this.far);

            _initialized = true;
        };
        this.LookAt = function(position,target, up){
        	var tmp = mat4.create();
        	
        	mat4.lookAt(tmp,position,target,up);

        	_vMatrix=mat4.clone(tmp);
        	mat4.invert(tmp,tmp);
        	this.transform.SetWorldMatrix(tmp);
        	
        	delete tmp;
        };
        this.GetRay = function (winx,winy,vecOrigin,vecDir,isCamSpace) {
        	this.transform.Update();//???????????????????????????????
        	//tranform to world coord
        	var window_y =  - winy + this.height*0.5;
			var window_x =    winx - this.width*0.5;
			
			vec3.set(vecOrigin,0,0,0);
			
			if(this.isPersp){
			
				var norm_x = window_x / (this.width*0.5);
				var norm_y = window_y / (this.height*0.5);
				var near = 0.1;
				
				
				var nearHeight = near * Math.tan(this.fov*0.5);
				var aspect = this.width / this.height;
				
				vec3.set(vecDir,norm_x * nearHeight * aspect,
								norm_y * nearHeight,
								-near);
			}else{
				vec3.set(vecOrigin,window_x,window_y,0);
				vec3.set(vecDir,0,0,-1);
        	}
			
			if(isCamSpace) return;
			
			//invViewMatrix transform camspace into worldSpace
			var invViewMatrix = mat4.create();
			mat4.copy(invViewMatrix,this.transform.worldMatrix);
			//????????????????????? Quaternion for rotation
			vec3.transformMat4(vecOrigin, vecOrigin,invViewMatrix);
			invViewMatrix[12] = invViewMatrix[13] = invViewMatrix[14] = 0;
			vec3.transformMat4(vecDir, vecDir,invViewMatrix);
			
			vec3.normalize(vecDir,vecDir);
		};
        
        this.Initialize();
    };

    return cls;
	
	
})();

//Camera = Camera;