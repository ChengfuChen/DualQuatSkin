function GenNoiseTextureRGBA(gl, w, h) {       
  var texture = gl.createTexture();
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  var b = new ArrayBuffer(w*h*4);
  var pixels = new Uint8Array(b);
  for(var y=0; y<h; y++) {
    for(var x=0; x<w; x++) {
      pixels[(y*w + x)*4+0] = Math.floor(255 * Math.random());
      pixels[(y*w + x)*4+1] = Math.floor(255 * Math.random());
      pixels[(y*w + x)*4+2] = Math.floor(255 * Math.random());
      pixels[(y*w + x)*4+3] = Math.floor(255 * Math.random());
    }
  } 
  gl.texImage2D(
    gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, pixels
  );
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);   
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
  gl.bindTexture(gl.TEXTURE_2D, null);  
  
  texture.width = w;
  texture.height = h; 
  return texture;
};

function FBO(gl, width, height) {     
	  this.gl = gl;
	  this.width = width;
	  this.height = height;
	  this.fbo = gl.createFramebuffer();
	  this.depthBuffer = gl.createRenderbuffer();
	  this.colorBuffer = gl.createTexture();
	  
	  gl.activeTexture(gl.TEXTURE0);
	  gl.bindTexture(gl.TEXTURE_2D, this.colorBuffer);  
	  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); //LINEAR_MIPMAP_LINEAR
	  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	  //gl.generateMipmap(gl.TEXTURE_2D)
	  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA,
	                width, height, 0,
	                gl.RGBA, gl.UNSIGNED_BYTE, null);
	  gl.bindFramebuffer(gl.FRAMEBUFFER, this.fbo);
	  gl.bindRenderbuffer(gl.RENDERBUFFER, this.depthBuffer);
	  gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, width, height);
	  gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, this.depthBuffer);
	  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.colorBuffer, 0);
	  if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) {
	    throw "Incomplete frame buffer object.";
	  }

	  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
};    

FBO.prototype.bind = function() {
	  this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.fbo);
};

FBO.prototype.unbind = function() {
	  this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
}; 