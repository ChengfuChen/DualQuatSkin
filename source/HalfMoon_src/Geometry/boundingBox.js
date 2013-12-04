var BoundingBox = (function(){
	var _volumes = [];
	var _data = buildCube();
	var _shape = new Shape("BBox"+"quadShape");
	var _isInitialized = false;
	var _worldMatrix = mat4.create();
	mat4.identity(_worldMatrix);
	mat4.scale(_worldMatrix,_worldMatrix,[40,40,40]);
	var _normalMatrix = mat4.create();
	var _initialize = function(gl){
		_shape.load(_data);
	    _isInitialized = true;
	};
	var cls = function(min,max){
		if(min&&max){
			var x = max[0]-min[0], y = max[1]-min[1], z = max[2]-min[2];
			_data = buildCube(x,y,z);
		};
		
		//HalfMoon.drawableObj.push(this);
		this.isDrawable = true;
		var _bounds = [];
		_bounds.push(vec3.create());
		_bounds.push(vec3.create());
		
		_bounds[0][0] = min[0];_bounds[0][1] = min[1];_bounds[0][2] = min[2];
		_bounds[1][0] = max[0];_bounds[1][1] = max[1];_bounds[1][2] = max[2];
		
		this.SetShapeData = function(input){
			_data = input;
			_shape.load(_data);
			_bounds[0][0] = input.min[0];
			_bounds[0][1] = input.min[1];
			_bounds[0][2] = input.min[2];
			_bounds[1][0] = input.max[0];
			_bounds[1][1] = input.max[1];
			_bounds[1][2] = input.max[2];
		}
		
		this.IsCollided = function(obj){
			if(obj.origin&&obj.direction){
				var t0=0.001,t1=1000, r = obj;
				//http://www.cs.utah.edu/~awilliam/box/box.pdf
				var tmin, tmax, tymin, tymax, tzmin, tzmax;
				if (r.direction[0] >= 0) {
					tmin = (_bounds[0][0] - r.origin[0]) / r.direction[0];
					tmax = (_bounds[1][0] - r.origin[0]) / r.direction[0];
				}
				else {
					tmin = (_bounds[1][0] - r.origin[0]) / r.direction[0];
					tmax = (_bounds[0][0] - r.origin[0]) / r.direction[0];
				}
				if (r.direction[1] >= 0) {
					tymin = (_bounds[0][1] - r.origin[1]) / r.direction[1];
					tymax = (_bounds[1][1] - r.origin[1]) / r.direction[1];
				}
				else {
					tymin = (_bounds[1][1] - r.origin[1]) / r.direction[1];
					tymax = (_bounds[0][1] - r.origin[1]) / r.direction[1];
				}
				if ( (tmin > tymax) || (tymin > tmax) )
					return false;
				if (tymin > tmin)
					tmin = tymin;
				if (tymax < tmax)
					tmax = tymax;
				if (r.direction[2] >= 0) {
					tzmin = (_bounds[0][2] - r.origin[2]) / r.direction[2];
					tzmax = (_bounds[1][2] - r.origin[2]) / r.direction[2];
				}
				else {
					tzmin = (_bounds[1][2] - r.origin[2]) / r.direction[2];
					tzmax = (_bounds[0][2] - r.origin[2]) / r.direction[2];
				}
				if ( (tmin > tzmax) || (tzmin > tmax) )
					return false;
				if (tzmin > tmin)
					tmin = tzmin;
				if (tzmax < tmax)
					tmax = tzmax;
				return ( (tmin < t1) && (tmax > t0) );

			}else{
				
				
			}
		};
		_volumes.push(this);
	};
	
	cls.prototype.CheckCollision = function(ray){
		for(var i=0;i<_volumes.length;i++)
			_volumes[i].IsCollide(ray);
		
	};

	cls.prototype.SetShapeBound = function(shape){
		var minX,minY,minZ,maxX,maxY,maxZ;
		    minX=minY=minZ=maxX=maxY=maxZ=0;
		for(var i = 0; shape._vertice.length;i+=3){
			var x = shape._vertice[i],
				y = shape._vertice[i+1],
				z = shape._vertice[i+2];
			if(x<minX) minX = x;
			else if(x>maxX) maxX=x;
			
			if(y<minY) minY = y;
			else if(y>maxY) maxY=y;
			
			if(z<minZ) minZ = z;
			else if(z>maxZ) maxZ=z;
		}
		var x = maxX-minX, y = maxY-minY, z = maxZ-minZ;
		_data = buildCube(x,y,z);
	};
	cls.prototype.draw = function(render,cam,matrix,material){
		var gl =render.graphic.gl;
		if(!_isInitialized) 
			_initialize(gl);
		
		cam = cam||render.cam;
		matrix = matrix||_worldMatrix;
		material = material || HalfMoon.materials["debug"];
		material.draw(render.graphic,function(){});
		
	    gl.uniformMatrix4fv(material._data["uMMatrix"], false, matrix);
	    gl.uniformMatrix4fv(material._data["uVMatrix"], false, cam.GetViewMatrix());
	    gl.uniformMatrix4fv(material._data["uPMatrix"], false, cam.pMatrix);
		mat4.invert(_normalMatrix,matrix);
	    mat4.transpose(_normalMatrix,_normalMatrix);
	    gl.uniformMatrix4fv(material._data["uNMatrix"], false, _normalMatrix);
	    
	    
	    _shape.draw(render.graphic,material);
//		gl.bindBuffer(gl.ARRAY_BUFFER, _verticeBuffer);
//		gl.bufferData(gl.ARRAY_BUFFER, _shape.vertice, gl.DYNAMIC_DRAW);
//		_verticeBuffer.itemSize = 3;
//		_verticeBuffer.numItems = _shape.vertice.length / 3;
//		
//		
//		gl.bindBuffer(gl.ARRAY_BUFFER, _normalsBuffer);
//		gl.bufferData(gl.ARRAY_BUFFER, _shape.normals, gl.DYNAMIC_DRAW);
//		_normalsBuffer.itemSize = 3;
//		_normalsBuffer.numItems = _shape.normals.length / 3;
//
//		
//		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, _indiceBuffer);
//		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, _shape.indice, gl.DYNAMIC_DRAW);
//		_indiceBuffer.itemSize = 1;
//		_indiceBuffer.numItems = _shape.indice.length;
//		
//		
//		gl.bindBuffer(gl.ARRAY_BUFFER, _uvsBuffer);
//		gl.bufferData(gl.ARRAY_BUFFER, _shape.uvs, gl.DYNAMIC_DRAW);
//		_uvsBuffer.itemSize = 2;
//		_uvsBuffer.numItems = _shape.uvs.length / 2;
//		
//	    gl.enableVertexAttribArray(material._data["aVertexPosition"]);
//		gl.bindBuffer(gl.ARRAY_BUFFER, _verticeBuffer);
//		gl.vertexAttribPointer(material._data["aVertexPosition"], _verticeBuffer.itemSize, gl.FLOAT, false, 0, 0);
//		    
//	    gl.enableVertexAttribArray(material._data["aTextureCoord"]);
//		gl.bindBuffer(gl.ARRAY_BUFFER, _uvsBuffer);
//		gl.vertexAttribPointer(material._data["aTextureCoord"], _uvsBuffer.itemSize, gl.FLOAT, false, 0, 0);
//		    
//	    gl.enableVertexAttribArray(material._data["aVertexNormal"]);
//		gl.bindBuffer(gl.ARRAY_BUFFER, _normalsBuffer);
//		gl.vertexAttribPointer(material._data["aVertexNormal"], _normalsBuffer.itemSize, gl.FLOAT, false, 0, 0);
//		    
//		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, _indiceBuffer);
//		
//		//gl.drawElements(gl.TRIANGLES, _indiceBuffer.numItems, gl.UNSIGNED_SHORT, 0);
//
//		gl.drawArrays(gl.TRIANGLES, 0, 3);//
	};
	
	return cls;
})();
//BoundingBox = BoundingBox;
