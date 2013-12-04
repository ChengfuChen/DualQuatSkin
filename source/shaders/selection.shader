

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
		
		
		if(uFlipY)	{
				vTextureCoord = aTextureCoord;
				vTextureCoord.t = 1.0 - vTextureCoord.t;
		}
        else		vTextureCoord = aTextureCoord;
        vTransformedNormal = normalize((uNMatrix * vec4(aVertexNormal, 1.0)).xyz);
    }
    
fragment:  
    precision mediump float;

    varying vec2 vTextureCoord;
    varying vec3 vTransformedNormal;
    varying vec4 vPosition;

	uniform vec4 uSelectedCol;
	uniform vec4 uBaseCol;
    uniform float uWidth;
    uniform float uHeight;
    uniform float uH;

    uniform float uIndexX;
    uniform float uIndexY;
    
    
    uniform float uBoaderRatioX;
    uniform float uBoaderRatioY;

    void main(void) {
        vec4 fragmentColor = uBaseCol;
		
		float x = mod(vTextureCoord.s*uWidth,uH);
		float y = mod(vTextureCoord.t*uHeight,uH);
		if(x<uBoaderRatioX||y<uBoaderRatioY)
			fragmentColor = vec4(0,0,0,1);

		float indexX = floor(vTextureCoord.s*uWidth/uH);
		float indexY = floor(vTextureCoord.t*uHeight/uH);

		if(indexX==uIndexX&&indexY==uIndexY)
			fragmentColor = uSelectedCol;

		
        gl_FragColor = fragmentColor;
    }
attributes:
	 ["aVertexPosition","aVertexNormal","aTextureCoord"]
uniforms:
	{"uMMatrix":{"type":"Mat4","value":null},
     "uVMatrix":{"type":"Mat4","value":null},
     "uPMatrix":{"type":"Mat4","value":null},
     "uNMatrix":{"type":"Mat3","value":null},
     "uH":{"type":"Float","value":5},
     "uWidth":{"type":"Float","value":1},
     "uHeight":{"type":"Float","value":1},
     "uIndexX":{"type":"Float","value":1},
     "uIndexY":{"type":"Float","value":0},
     "uBoaderRatioX":{"type":"Float","value":5},
     "uBoaderRatioY":{"type":"Float","value":5},
     "uSelectedCol":{"type":"Float4","value":[0.6,0.8,0,0.3]},
     "uBaseCol":{"type":"Float4","value":[0.2,0.5,0,0.2]},
     "uFlipY":{"type":"Int","value":1}}
