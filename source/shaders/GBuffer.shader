vertex:
	attribute vec3 aVertexPosition;
    attribute vec2 aTextureCoord;
    attribute vec3 aVertexNormal;

 	uniform bool uFlipY;
	uniform mat4 uPMatrix;
	uniform mat4 uMMatrix;  	
	uniform mat4 uVMatrix;
	uniform mat4 uNMatrix;  	
	uniform float uNear;
	uniform float uFar;

	varying vec3 vN;
	varying vec2 vTextureCoord;
	varying float depth;                                            
	varying vec4 vVSPos;
	void main() {	
		mat4 mvMat = uVMatrix * uMMatrix;
		gl_Position = uPMatrix*mvMat*vec4(aVertexPosition,1.0);		
		vN = normalize((uNMatrix * vec4(aVertexNormal, 1.0)).xyz);
		
		//linear depth in camera space (0..far)
		depth = (mvMat*vec4(aVertexPosition,1.0)).z/uFar;
		
		if(uFlipY)	{
				vTextureCoord = aTextureCoord;
				vTextureCoord.t = 1.0 - vTextureCoord.t;
		}
        else		
				vTextureCoord = aTextureCoord;
		vVSPos = mvMat * vec4(aVertexPosition,1.0);
	}                        

fragment:
	#ifdef GL_ES
	precision highp float;
	#endif          
	uniform float uNear;
	uniform float uFar;

	varying float depth;   
	varying vec3 vN;     
	varying vec4 vVSPos;  

	//from http://spidergl.org/example.php?id=6
	vec4 packDepth(const in float depth) {
		const vec4 bit_shift = vec4(256.0*256.0*256.0, 256.0*256.0, 256.0, 1.0);
		const vec4 bit_mask  = vec4(0.0, 1.0/256.0, 1.0/256.0, 1.0/256.0);
		vec4 res = fract(depth * bit_shift);
		res -= res.xxyz * bit_mask;
		return res;    		
	}

	void main() {         
		gl_FragData[0] = packDepth(-depth);
	}
