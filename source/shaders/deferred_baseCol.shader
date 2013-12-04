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
        vTransformedNormal = normalize((uNMatrix * vec4(aVertexNormal, 1.0)).xyz);
    }

   

fragment:

 	//precision mediump float;

    varying vec2 vTextureCoord;
    varying vec3 vTransformedNormal;
    varying vec4 vPosition;


    uniform sampler2D uSampler;


    void main(void) {

        vec4 fragmentColor;
        fragmentColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));
     
        gl_FragColor = vec4(fragmentColor.rgb * lightWeighting, fragmentColor.a);
    }


