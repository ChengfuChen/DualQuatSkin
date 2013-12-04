vertex:
    attribute vec3 aVertexPosition;

    uniform mat4 uMMatrix;
    uniform mat4 uVMatrix;
    uniform mat4 uPMatrix;

    varying vec4 vPosition;
	
    void main(void) {
        vPosition = uVMatrix*uMMatrix * vec4(aVertexPosition, 1.0);
        gl_Position = uPMatrix * vPosition;
    }

   

fragment:

    uniform vec3 uColor;
    void main(void) {
    	gl_FragColor = vec4(uColor,1.0);
        
    }

attributes:
	 ["aVertexPosition"]
uniforms:
	{"uMMatrix":{"type":"Mat4","value":null},
     "uVMatrix":{"type":"Mat4","value":null},
     "uPMatrix":{"type":"Mat4","value":null},
     "uColor":{"type":"Float3","value":[0.9,0.9,0.9]}}
