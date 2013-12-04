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
		//depth = (mvMat*vec4(aVertexPosition,1.0)).z/uFar;
		depth = (mvMat*vec4(aVertexPosition,1.0)).z;
		if(uFlipY)	{
				vTextureCoord = aTextureCoord;
				vTextureCoord.t = 1.0 - vTextureCoord.t;
		}
        else		
				vTextureCoord = aTextureCoord;
		vVSPos = gl_Position;
	}                        

fragment:
	//#ifdef GL_ES
	//precision highp float;
	//#endif          
	uniform mat4 uPMatrix;
	
	uniform float uNear;
	uniform float uFar;
	varying float depth;   
	varying vec3 vN;     
	varying vec4 vVSPos;  
	
	vec2 EncodeDepth( float fDepth ) {
	    vec2 vResult;
	    // Input depth must be mapped to 0..1 range
	    //fDepth = fDepth / uFar;
	    // R = Basis = 8 bits = 256 possible values
	    // G = fractional part with each 1/256th slice
	    vResult.xy = fract( vec2( fDepth, fDepth * 256.0)).xy;
	    return vResult;
    }
	
	//from http://spidergl.org/example.php?id=6
	vec4 packDepth(const in float depth) {
		const vec4 bit_shift = vec4(256.0*256.0*256.0, 256.0*256.0, 256.0, 1.0);
		const vec4 bit_mask  = vec4(0.0, 1.0/256.0, 1.0/256.0, 1.0/256.0);
		vec4 res = fract(depth * bit_shift);
		res -= res.xxyz * bit_mask;
		return res;    		
	}

	void main() {         
		float ndcspaceZ = (uPMatrix[2][2] * depth + uPMatrix[2][3]) / -depth;
		gl_FragData[0].rg = EncodeDepth((ndcspaceZ+1.0)*0.5);
		gl_FragData[0].ba = EncodeDepth((depth/uFar+1.0)*0.5);
		//gl_FragData[0] = packDepth(-depth);
		//gl_FragData[0].r = -depth/uFar;
	}
attributes:
	 ["aVertexPosition","aVertexNormal","aTextureCoord"]
uniforms:
	{"uMMatrix":{"type":"Mat4","value":null},
     "uVMatrix":{"type":"Mat4","value":null},
     "uPMatrix":{"type":"Mat4","value":null},
     "uNMatrix":{"type":"Mat3","value":null},
     "uNear":{"type":"Float","value":0},
     "uFar":{"type":"Float","value":1000}}