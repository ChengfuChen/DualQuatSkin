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


	uniform bool uIsTextureLoaded;
    uniform float uMaterialShininess;

    uniform float uAmbWeight;
    uniform vec3 uAmbientColor;
    
    uniform float uLightWeight;
    uniform vec3 uPointLightingLocation;
    uniform vec3 uPointLightingSpecularColor;
    uniform vec3 uPointLightingDiffuseColor;

	uniform float uTexTileU;
	uniform float uTexTileV;
    uniform sampler2D uSampler;
	uniform sampler2D uAmbColTex;

    void main(void) {
    	if(!uIsTextureLoaded){
    		gl_FragColor = vec4(0.8,0.8,0.8,1.0);
    		return;
    	}
    	
        vec3 lightWeighting;
      
        vec3 lightDirection = normalize(uPointLightingLocation - vPosition.xyz);
        vec3 normal = normalize(vTransformedNormal);

        float specularLightWeighting = 0.0;
        vec3 eyeDirection = normalize(-vPosition.xyz);
        vec3 reflectionDirection = reflect(-lightDirection, normal);

       	specularLightWeighting = pow(max(dot(reflectionDirection, eyeDirection), 0.0), uMaterialShininess);
        
        float diffuseLightWeighting = max(dot(normal, lightDirection), 0.0);
       	lightWeighting = (uAmbientColor+
                uPointLightingSpecularColor * specularLightWeighting
                + uPointLightingDiffuseColor * diffuseLightWeighting)*uLightWeight;
        
		
        vec4 fragmentColor,ambCol;
        fragmentColor = texture2D(uSampler, vec2(vTextureCoord.s*uTexTileU,vTextureCoord.t*uTexTileV));
     	ambCol = texture2D(uAmbColTex, vec2(vTextureCoord.s, vTextureCoord.t));
        gl_FragColor = vec4(ambCol.rbg*uAmbWeight+fragmentColor.rgb * lightWeighting, fragmentColor.a);
    }

attributes:
	 ["aVertexPosition","aVertexNormal","aTextureCoord"]
uniforms:
	{"uMMatrix":{"type":"Mat4","value":null},
     "uVMatrix":{"type":"Mat4","value":null},
     "uPMatrix":{"type":"Mat4","value":null},
     "uNMatrix":{"type":"Mat3","value":null},
     
     "uIsTextureLoaded":{"type":"Int","value":0},
     "uFlipY":{"type":"Int","value":0},
     "uTexTileU":{"type":"Float","value":4},
     "uTexTileV":{"type":"Float","value":4},
     "uSampler":{"type":"Int","value":0},
     "uAmbColTex":{"type":"Int","value":1},
     "uAmbientColor":{"type":"Float3","value":[0.15,0.1,0.1]},
     "uAmbWeight":{"type":"Float","value":0.4},
     "uMaterialShininess":{"type":"Float","value":0.5},
     "uLightWeight":{"type":"Float","value":0.7},
     "uPointLightingLocation":{"type":"Float3","value":[20,300,40]},
     "uPointLightingSpecularColor":{"type":"Float3","value":[0.4,0.4,0.4]},
     "uPointLightingDiffuseColor":{"type":"Float3","value":[0.5,0.5,0.5]}}
