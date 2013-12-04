vertex:
    attribute vec3 aVertexPosition;
    attribute vec2 aTextureCoord;
    attribute vec3 aVertexNormal;

 	uniform bool uFlipY;

    uniform mat4 uMMatrix;
    uniform mat4 uVMatrix;
    uniform mat4 uPMatrix;
    uniform mat4 uNMatrix;

    varying vec2 vTextureCoord;
    varying vec3 vTransformedNormal;
    varying vec4 vPosition;
	
	
    void main(void) {
        vPosition = uVMatrix*uMMatrix * vec4(aVertexPosition, 1.0);
        gl_Position = uPMatrix * vPosition;
		
		
		vTextureCoord = aTextureCoord;
		if(uFlipY)	{
				vTextureCoord.t = 1.0 - vTextureCoord.t;
		}
        vTransformedNormal = normalize((uVMatrix*uNMatrix * vec4(aVertexNormal, 1.0)).xyz);
    }                       

fragment:
	//#ifdef GL_ES
	//precision highp float;
	//#endif          

    uniform sampler2D uSampler;
    varying vec3 vTransformedNormal;
    
	void main() {         
		gl_FragColor = vec4(0.5 * (vTransformedNormal.xyz + 1.0),1.0);
	}
attributes:
	 ["aVertexPosition","aVertexNormal","aTextureCoord"]
uniforms:
					{"uMMatrix":{"type":"Mat4","value":null},
		             "uVMatrix":{"type":"Mat4","value":null},
		             "uPMatrix":{"type":"Mat4","value":null},
		             "uNMatrix":{"type":"Mat3","value":null},
		             "uSampler":{"type":"Int","value":0},
		             "uFlipY":{"type":"Int","value":0}}