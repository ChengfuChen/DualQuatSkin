vertex:
    attribute vec3 aVertexPosition;
    attribute vec2 aTextureCoord;
    attribute vec3 aVertexNormal;

 	uniform bool uFlipY;

    uniform mat4 uMMatrix;
    uniform mat4 uVMatrix;
    uniform mat4 uPMatrix;
    uniform mat4 uNMatrix;

	uniform vec3 uLightVec;
    varying vec3 vLightVecEyeSpace;
	
    varying vec2 vTextureCoord;
    varying vec3 vTransformedNormal;
    varying vec4 vPosition;
	
	
	
    void main(void) {
        vPosition = uVMatrix*uMMatrix * vec4(aVertexPosition, 1.0);
        gl_Position = uPMatrix * vPosition;
		
		
     	vLightVecEyeSpace = (uVMatrix*vec4(uLightVec.xyz,1.0)).xyz;
		vTextureCoord = aTextureCoord;
		if(uFlipY)	{
				vTextureCoord.t = 1.0 - vTextureCoord.t;
		}
        vTransformedNormal = normalize((uNMatrix * vec4(aVertexNormal, 1.0)).xyz);
    }

   

fragment:
    varying vec2 vTextureCoord;
    varying vec3 vTransformedNormal;
    varying vec4 vPosition;
	
    varying vec3 vLightVecEyeSpace;
    uniform mat4 uInvPersMatrix;
    uniform mat4 uVMatrix;
	
	uniform float uFar;
	uniform float uSpecIntensity;
	uniform float uSpecPower;
	
	uniform vec3 uLightVec;
	uniform vec3 uLightCol;
	uniform vec4 uViewport;

	
    uniform samplerCube uEnvTex;
    uniform sampler2D uDepthTex;
    uniform sampler2D uDiffColTex;
    uniform sampler2D uNormalTex;
	
	float DecodeNDCDepth(vec2 coord){
		vec4 rgba_depth =  texture2D(uDepthTex, coord);
		return dot( rgba_depth.rg, vec2(1.0, 1.0 / 256.0))*2.0-1.0;
	}
	float DecodeCamSpaceZDepth(vec2 coord){
		vec4 rgba_depth =  texture2D(uDepthTex, coord);
		float result = dot( rgba_depth.ba, vec2(1.0, 1.0 / 256.0))*2.0-1.0;
		return result*uFar;
	}
	
	float getDepth(vec2 coord) {                          
		vec4 rgba_depth =  texture2D(uDepthTex, coord.xy);
		const vec4 bit_shift = vec4(1.0/(256.0*256.0*256.0), 
								1.0/(256.0*256.0), 1.0/256.0, 1.0);
		float depth = dot(rgba_depth, bit_shift);
		return depth;
	}  
	
	vec3 DiffCol(vec3 N ,vec3 lightVec, vec3 lightCol, vec3 diffCol){
		float diffWeight = max(0.0,dot(N, -lightVec));
		return vec3(diffWeight*diffCol.r,diffWeight*diffCol.g,diffWeight*diffCol.b);
	}
	
	float SpecCol(vec3 pos, vec3 N, vec3 lightVec,float specIntensity, float specPower){
		//vec3 R = normalize(reflect(lightVec, N));
		vec3 halfAngle = normalize(-lightVec-pos);// -lightVec+camPos-pos camPos is zero
		float spec = specIntensity * pow(clamp(dot(halfAngle, N),0.0,1.0),specPower);
		return spec;
	}
	vec3 ReflCol(samplerCube envTex,vec3 N,vec3 pos){
		vec3 eyeVec = normalize(-pos);
		vec3 lookup = reflect(pos,N);
		vec3 reflCol = textureCube(envTex,lookup).xyz;
		return max(0.0,dot(N, eyeVec))*reflCol;
	}
	
    void main(void) {
		
		vec2 screenPos = vec2(gl_FragCoord.x /uViewport.z,
							  gl_FragCoord.y / uViewport.w);	

		float NDCDepth = DecodeNDCDepth(screenPos);   
		
		
		vec4 ndcPos;
		//ndcPos.xy = ((2.0 * gl_FragCoord.xy) - (2.0 * uViewport.xy)) / (uViewport.zw) - 1;
		ndcPos.x = vTextureCoord.s*2.0-1.0;
		ndcPos.y = vTextureCoord.t*2.0-1.0;
		ndcPos.z = NDCDepth;
		ndcPos.w = 1.0;
 		
 		float camspaceZ = DecodeCamSpaceZDepth(screenPos);
 		//vec4 clipspace = vec4(ndcPos * clipspace.w, clipspace.w);
 		vec4 clipSpacePos = vec4(ndcPos.x*-camspaceZ,
 							ndcPos.y * -camspaceZ,
 							ndcPos.z* -camspaceZ, 
 							-camspaceZ);
 		vec4 eyeSpacePos = uInvPersMatrix*clipSpacePos;
 		

        vec3 ambientCol = texture2D(uDiffColTex, vTextureCoord).rgb;
     	vec3 normal = texture2D(uNormalTex, vTextureCoord).xyz;
     	vec3 diffCol = DiffCol(normal,uLightVec,uLightCol,ambientCol);
     	float specWeight = SpecCol(eyeSpacePos.xyz,normal,
     							vLightVecEyeSpace,uSpecIntensity,uSpecPower);
     							
     	vec3 reflCol = ReflCol(uEnvTex,normal,eyeSpacePos.xyz);
        gl_FragColor = vec4(ambientCol*(reflCol*specWeight*0.9+specWeight*uLightCol+diffCol),1.0);
        
        
        
		//vec3 test = textureCube(uEnvTex,normalize(vec3(vTextureCoord.s-0.5,0.5-vTextureCoord.t,-0.2))).xyz;
        //gl_FragColor = vec4(test,1.0);
    }
attributes:
	 ["aVertexPosition","aVertexNormal","aTextureCoord"]
uniforms:
	{"uMMatrix":{"type":"Mat4","value":null},
     "uVMatrix":{"type":"Mat4","value":null},
     "uPMatrix":{"type":"Mat4","value":null},
     "uInvPersMatrix":{"type":"Mat4","value":null},
     "uNMatrix":{"type":"Mat3","value":null},
     "uFlipY":{"type":"Int","value":0},
     "uDiffColTex":{"type":"Int","value":0},
     "uNormalTex":{"type":"Int","value":1},
     "uDepthTex":{"type":"Int","value":2},
     "uEnvTex":{"type":"Int","value":3},
     "uLightVec":{"type":"Float3","value":[0.3,0.3,-0.4]},
     "uLightCol":{"type":"Float3","value":[0.3,0.3,0.0]},
     "uSpecIntensity":{"type":"Float","value":1.0},
     "uSpecPower":{"type":"Float","value":1.0},
     "uViewport":{"type":"Float4","value":null},
     "uFar":{"type":"Float","value":1000}}

