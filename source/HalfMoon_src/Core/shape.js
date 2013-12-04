var Shape = (function(){
	var cls = function(name){
		Obj.call(this,name);
		this.name = name;
		this.isLoaded = false;
		this.RENDERSTATE = {
				Triangles:"Drawing triangles",
				Lines:"Drawing lines"		
		};
		this.shapeRenderState = this.RENDERSTATE.Triangles;
		this.load = function(data){

			this._vertice = new Float32Array(data.vertice);
			if(data.indice)
				this._indice = new Uint16Array(data.indice);
			if(data.normals)
				this._normals = new Float32Array(data.normals);
			if(data.uvs)
				this._uvs = new Float32Array(data.uvs);
			if(data.max)
				this.max = data.max;
			if(data.min)
				this.min=data.min;
		};
		this.isInitialized = false;
		this.initialize = function(gl){
			

		    this._verticeBuffer = gl.createBuffer();
		    this._uvsBuffer = gl.createBuffer();
		    this._normalsBuffer = gl.createBuffer();
		    this._indiceBuffer = gl.createBuffer();
		    
			this.isInitialized = true;
		};
		
		
		this.draw = function(graphics,material){
			
			if(!this._vertice)
				return;
			var gl =graphics.gl;
			if(!this.isInitialized) 
				this.initialize(gl);
			
			
			
			gl.bindBuffer(gl.ARRAY_BUFFER, this._verticeBuffer);
			gl.bufferData(gl.ARRAY_BUFFER, this._vertice, gl.DYNAMIC_DRAW);
			this._verticeBuffer.itemSize = 3;
			this._verticeBuffer.numItems = this._vertice.length / 3;
			
			if(this._normals){
				gl.bindBuffer(gl.ARRAY_BUFFER, this._normalsBuffer);
				gl.bufferData(gl.ARRAY_BUFFER, this._normals, gl.DYNAMIC_DRAW);
				this._normalsBuffer.itemSize = 3;
				this._normalsBuffer.numItems = this._normals.length / 3;
			}
			if(this._indice){
				gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._indiceBuffer);
				gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this._indice, gl.DYNAMIC_DRAW);
				this._indiceBuffer.itemSize = 1;
				this._indiceBuffer.numItems = this._indice.length;
			}
			
			if(this._uvs){
				gl.bindBuffer(gl.ARRAY_BUFFER, this._uvsBuffer);
				gl.bufferData(gl.ARRAY_BUFFER, this._uvs, gl.DYNAMIC_DRAW);
				this._uvsBuffer.itemSize = 2;
				this._uvsBuffer.numItems = this._uvs.length / 2;
			}
			
		    gl.enableVertexAttribArray(material._data["aVertexPosition"]);
			gl.bindBuffer(gl.ARRAY_BUFFER, this._verticeBuffer);
			gl.vertexAttribPointer(material._data["aVertexPosition"], this._verticeBuffer.itemSize, gl.FLOAT, false, 0, 0);
			
			if(typeof material._data["aTextureCoord"]!= "undefined"
				&&material._data["aTextureCoord"]!=-1){
			    gl.enableVertexAttribArray(material._data["aTextureCoord"]);
				gl.bindBuffer(gl.ARRAY_BUFFER, this._uvsBuffer);
				gl.vertexAttribPointer(material._data["aTextureCoord"], this._uvsBuffer.itemSize, gl.FLOAT, false, 0, 0);
			}
			
			if(typeof material._data["aVertexNormal"]!= "undefined"
				&&material._data["aVertexNormal"]!=-1){
			    gl.enableVertexAttribArray(material._data["aVertexNormal"]);
				gl.bindBuffer(gl.ARRAY_BUFFER, this._normalsBuffer);
				gl.vertexAttribPointer(material._data["aVertexNormal"], this._normalsBuffer.itemSize, gl.FLOAT, false, 0, 0);
			}
			if(this.shapeRenderState == this.RENDERSTATE.Triangles){
				gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._indiceBuffer);
				gl.drawElements(gl.TRIANGLES, this._indiceBuffer.numItems, gl.UNSIGNED_SHORT, 0);
			}else
	            gl.drawArrays(gl.LINES, 0, this._verticeBuffer.numItems);
		};
		
	};

	return cls;
 
	
	
})();
//Shape = Shape;


