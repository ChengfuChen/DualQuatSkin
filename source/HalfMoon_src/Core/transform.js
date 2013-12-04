var Transform = (function(){
	var tmpMat = mat4.create();
	var cls = function(name){

		Obj.call(this,name);
		this.worldMatrix = mat4.create();
		this.globalMatrix = mat4.create();
		this._normalMatrix = mat4.create();
		
		this.pivot = vec3.create();
		this.position = vec3.create();
		this.rotation = vec3.create();
		this.scale = vec3.create();
		this._quat = quat.create();
		quat.identity(this._quat);
		vec3.set(this.scale,1,1,1);
		this._rotMatrix = mat4.create();
		this._scaleMatrix = mat4.create();
		
		
		var _del = this.del;
		this.del = function(){			
			_del();
		};
	};

	
	cls.prototype = Object.create(Obj.prototype);
	cls.prototype.constructor = cls;
	
	cls.prototype.SetTx = function(value){
		this.position[0] = value;
		HalfMoon.DataManager.OnDataChange(this,"translateX");
	};
	cls.prototype.SetTy = function(value){
		this.position[1] = value;
		HalfMoon.DataManager.OnDataChange(this,"translateY");
	};
	cls.prototype.SetTz = function(value){
		this.position[2] = value;
		HalfMoon.DataManager.OnDataChange(this,"translateZ");
	};
	
	function rot2Quat (result,rot){
		quat.identity(result);
		var tmp=quat.create(),order="xyz";
		for(var i=0;i<order.length;i++){
			switch(order[i]){
				case 'x':
					var x = typeof rot[0] === 'undefined'?rot.rx:rot[0];
					if( typeof x != 'undefined' )
						quat.setAxisAngle(result,[1,0,0],x);
					break;
				case 'y':
					var y =  typeof rot[1] === 'undefined'?rot.ry:rot[1];
					if(typeof y != 'undefined'){
						quat.setAxisAngle(tmp,[0,1,0],y);
						quat.multiply(result,tmp,result);
					}
					break;
				case 'z':
					var z =  typeof rot[2] === 'undefined'?rot.rz:rot[2];
					if(typeof z != 'undefined'){
						quat.setAxisAngle(tmp,[0,0,1],z);
						quat.multiply(result,tmp,result);
					}
					break;
			}
		}
		tmp.length=0;
		delete tmp;
		return result;
	}
	
	
	cls.prototype.SetRotation = function(value){
		
		vec3.copy(this.rotation,value);
		rot2Quat(this._quat,this.rotation);
		mat4.fromQuat(this._rotMatrix,this._quat);
		HalfMoon.DataManager.OnDataChange(this,"rotation");
	};
	cls.prototype.SetQuat = function(value){
		quat.copy(this._quat,value);
		mat4.fromQuat(this._rotMatrix,this._quat);
		HalfMoon.DataManager.OnDataChange(this,"rotation");
	};
	
	cls.prototype.GetPosition = function(){
		return this.position;
	};
	cls.prototype.GetRotation = function(){			
		return this.rotation;
	};
	cls.prototype.GetRotationMatrix = function(){

		return this._rotMatrix;
	};
	cls.prototype.GetWorldMatrix = function(){
		this.Update();
		return this.worldMatrix;
	};
	
	cls.prototype.SetWorldMatrix = function(mat){
		mat4.copy(this.worldMatrix,mat);
		this.position[0] = mat[12];
		this.position[1] = mat[13];
		this.position[2] = mat[14];
		
		//????????????????????????Matrix decomposition is needed
		//http://en.wikipedia.org/wiki/QR_decomposition
		
		mat3.fromMat4(this._rotMatrix,this.worldMatrix);
	};
	cls.prototype.SetRotationMatrix = function(mat){

		mat4.copy(this._rotMatrix,mat);
		this._rotMatrix[12] = this._rotMatrix[13] = this._rotMatrix[14] = 0;
		HalfMoon.DataManager.OnDataChange(this,"this._rotMatrix");
	};
	cls.prototype.Update = function(){
		
		mat4.identity(this.worldMatrix);		
		mat4.translate(this.worldMatrix, this.worldMatrix, this.pivot);

		
		mat4.multiply(this.worldMatrix,this._scaleMatrix,this.worldMatrix);
		
		mat4.multiply(this.worldMatrix,this._rotMatrix,this.worldMatrix);
//		this.worldMatrix[12] = this.position[0];
//		this.worldMatrix[13] = this.position[1];
//		this.worldMatrix[14] = this.position[2];
		
		//mat4.translate(this.worldMatrix, this.worldMatrix, this.position);
		mat4.identity(tmpMat);//??????????????????????Need optimize
		mat4.translate(tmpMat,tmpMat,this.position);
		mat4.multiply(this.worldMatrix,tmpMat,this.worldMatrix);
		
		
	};
	cls.prototype.Move = function(translation){
		//if(!pivot){
			
			vec3.add(this.position,this.position, translation);
		//}

		HalfMoon.DataManager.OnDataChange(this,"position");
	};
	
	cls.prototype.MoveTo = function(translation){
		vec3.set(this.position,translation[0],translation[1],translation[2]);
		HalfMoon.DataManager.OnDataChange(this,"position");
	};
	
	cls.prototype.ScaleTo = function(scale){
//		if(pivot)
//			this.pivot = pivot;
		vec3.set(this.scale,scale[0],scale[1],scale[2]);

		mat4.identity(this._scaleMatrix);	
		mat4.scale(this._scaleMatrix,this._scaleMatrix,this.scale);
		
		HalfMoon.DataManager.OnDataChange(this,"scale");
	};
	cls.prototype.Scale = function(scale){
		
		vec3.mul(this.scale,this.scale, scale);

		mat4.identity(this._scaleMatrix);	
		mat4.scale(this._scaleMatrix,this._scaleMatrix,this.scale);
		HalfMoon.DataManager.OnDataChange(this,"scale");
		
	};

	
	cls.prototype.Rotate = function(rotate,order){
//		if(pivot)
//			this.pivot = pivot;
		if(!order)
			order = "XYZ";
		vec3.add(this.rotation,this.rotation,rotate);
		
		quat.rotateX(this._quat,this._quat,rotate[0]);
		quat.rotateY(this._quat,this._quat,rotate[1]);
		quat.rotateZ(this._quat,this._quat,rotate[2]);

		mat4.fromQuat(this._rotMatrix,this._quat);

		HalfMoon.DataManager.OnDataChange(this,"this._rotMatrix");
	};
	cls.prototype.RotateTo = function(rotate,order){
//		if(pivot)
//			this.pivot = pivot;
		if(!order)
			order = "XYZ";
		vec3.set(this.rotation,rotate[0],rotate[1],rotate[2]);
		quat.identity(this._quat);
		quat.rotateX(this._quat,this._quat,rotate[0]);
		quat.rotateY(this._quat,this._quat,rotate[1]);
		quat.rotateZ(this._quat,this._quat,rotate[2]);
		
		mat4.fromQuat(this._rotMatrix,this._quat);

		HalfMoon.DataManager.OnDataChange(this,"this._rotMatrix");
	};
	//???????????? deprecated offsetMat
	cls.prototype.draw = function(graphics,material,cam,parentMat,offsetMat){
		if(!parentMat&&!offsetMat){
//		    graphics.gl.uniformMatrix4fv(material._data["uMMatrix"], false, this.worldMatrix);
//		    this.globalMatrix = mat4.clone(this.worldMatrix);
			graphics.gl.uniformMatrix4fv(material._data["uMMatrix"], false, this.globalMatrix);
		}
		else if(!offsetMat){
			mat4.multiply(this.globalMatrix,parentMat,this.worldMatrix);
		    graphics.gl.uniformMatrix4fv(material._data["uMMatrix"], false, this.globalMatrix);
		}else if(!parentMat){
			mat4.multiply(tmpMat,this.worldMatrix,offsetMat);
		    graphics.gl.uniformMatrix4fv(material._data["uMMatrix"], false, tmpMat);
		}else{
			
			mat4.multiply(this.globalMatrix,parentMat,this.worldMatrix);
			mat4.multiply(tmpMat,this.globalMatrix,offsetMat);
			
		    graphics.gl.uniformMatrix4fv(material._data["uMMatrix"], false, tmpMat);
		}
	    graphics.gl.uniformMatrix4fv(material._data["uVMatrix"], false, cam.GetViewMatrix());
	    graphics.gl.uniformMatrix4fv(material._data["uPMatrix"], false, cam.pMatrix);
		if(material._data["uNMatrix"]){
		    mat4.invert(this._normalMatrix,this.worldMatrix);
		    mat4.transpose(this._normalMatrix,this._normalMatrix);
		    graphics.gl.uniformMatrix4fv(material._data["uNMatrix"], false, this._normalMatrix);
		}
	};
//	cls.prototype = Object.create(Obj.prototype);
//	cls.prototype.constructor = cls;
	return cls;
})();

