<script type="x-shader/x-vertex" id="showDepth-vs">    
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

</script>
<script type="x-shader/x-fragment" id="showDepth-fs"> 
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
		gl_FragData[0].r = -depth/uFar;
	}
</script>  
<script type="x-shader/x-vertex" id="ssao-vs">  
    attribute vec3 aVertexPosition;
    attribute vec2 aTextureCoord;
    attribute vec3 aVertexNormal;
	
 	uniform bool uFlipY;
	uniform mat4 uPMatrix;
	uniform mat4 uMMatrix;  	
	uniform mat4 uVMatrix;
	uniform mat4 uNMatrix;  

	varying vec3 vNormal;
	varying vec2 vTextureCoord;  

	void main() {	
		mat4 mvMat = uVMatrix * uMMatrix;
		gl_Position = uPMatrix*mvMat*vec4(aVertexPosition,1.0);		
		vNormal = (uNMatrix * vec4(aVertexNormal, 1.0)).xyz;
		
	   	vTextureCoord = aTextureCoord;
		if(uFlipY)	{
				vTextureCoord = aTextureCoord;
				vTextureCoord.t = 1.0 - vTextureCoord.t;
		}
	}
</script>
<script type="x-shader/x-fragment" id="ssao-fs">  
	#ifdef GL_ES
	precision highp float;
	#endif    
	uniform sampler2D uDepthTex;
	uniform sampler2D uNoiseTex;  
	varying vec3 vNormal;

	uniform mat4 uPMatrix;
	uniform vec2 uNoiseScale;
	uniform float uNear;
	uniform float uFar;            
	uniform float uFov;
	uniform float uAspectRatio;    
	uniform vec3 uKernel[16];   
	
	varying vec2 vTextureCoord;   

	const int kernelSize = 16;  
	const float radius = 0.1;      

	float unpackDepth(const in vec4 rgba_depth) {
		const vec4 bit_shift = vec4(1.0/(256.0*256.0*256.0), 1.0/(256.0*256.0), 1.0/256.0, 1.0);
		float depth = dot(rgba_depth, bit_shift);
		return depth;
	}                

	vec3 getViewRay(vec2 tc) {
		float hfar = 2.0 * tan(uFov/2.0) * uFar;
		float wfar = hfar * uAspectRatio;    
		vec3 ray = vec3(wfar * (tc.x - 0.5), hfar * (tc.y - 0.5), -uFar);    
		return ray;                      
	}         
	           
	//linear view space depth
	float getDepth(vec2 coord) {                          
		return unpackDepth(texture2D(uDepthTex, coord.xy));
	}    
	
	void main() {          
		vec2 screenPos = vec2(gl_FragCoord.x / 1024.0, gl_FragCoord.y / 512.0);		                 
		//screenPos.y = 1.0 - screenPos.y;   
		
		
		float linearDepth = getDepth(screenPos);          
		vec3 origin = getViewRay(screenPos) * linearDepth;   
				
		vec3 normal = normalize(vNormal);   
				
		vec3 rvec = texture2D(uNoiseTex, screenPos.xy * uNoiseScale).xyz * 2.0 - 1.0;
	    vec3 tangent = normalize(rvec - normal * dot(rvec, normal));
	    vec3 bitangent = cross(normal, tangent);
		mat3 tbn = mat3(tangent, bitangent, normal);        
		
		float occlusion = 0.0;
		for(int i = 0; i < kernelSize; ++i) {    	 
			vec3 sample = origin + (tbn * uKernel[i]) * radius;
		    vec4 offset = uPMatrix * vec4(sample, 1.0);		
			offset.xy /= offset.w;
			offset.xy = offset.xy * 0.5 + 0.5;        
		    float sampleDepth = -sample.z/uFar;
			float depthBufferValue = getDepth(offset.xy);				              
			float range_check = abs(linearDepth - depthBufferValue);
			if (range_check < radius && depthBufferValue <= sampleDepth) {
				occlusion +=  1.0;
			}
			
		}         
		   
		occlusion = 1.0 - occlusion / float(kernelSize);
                                   
		vec3 lightPos = vec3(10.0, 10.0, 10.0);
        vec3 L = normalize(lightPos);
		float NdotL = abs(dot(normal, L));
		vec3 diffuse = vec3(NdotL);
		vec3 ambient = vec3(1.0);
	    gl_FragColor.rgb = vec3((diffuse*0.2 + ambient*0.8) * occlusion);
		//gl_FragColor.rgb = normal;
	    gl_FragColor.a = 1.0;   
	}
</script>  
<script type="x-shader/x-fragment" id="blur-fs">  
	#ifdef GL_ES
	precision highp float;
	#endif    
	uniform sampler2D uSampler;
	uniform vec2 uTexelSize;
	varying vec2 vTextureCoord; 	 	

	void main() {
		vec3 result = vec3(0.0);
		for (int i = 0; i < 4; ++i) {
			for (int j = 0; j < 4; ++j) {
				vec2 offset = vec2(uTexelSize.x * float(j), uTexelSize.y * float(i));
				result += texture2D(uSampler, vTextureCoord + offset).rgb;
			}
		}
		       
		gl_FragColor.rgb = vec3(result * 0.0625); 
		gl_FragColor.a = 1.0;
	}
</script>


<script id="selectionShader-vs" type="x-shader/x-vertex">
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
</script>
<script id="selectionShader-fs" type="x-shader/x-fragment">
    precision mediump float;

    varying vec2 vTextureCoord;
    varying vec3 vTransformedNormal;
    varying vec4 vPosition;

    uniform float uWidth;
    uniform float uHeight;
    uniform float uH;

    uniform float uIndexX;
    uniform float uIndexY;

    void main(void) {
        vec4 fragmentColor = vec4(0.2,0.5,0.0,1.0);
		
		float x = mod(vTextureCoord.s*uWidth,uH);
		float y = mod(vTextureCoord.t*uHeight,uH);
		if(x<0.1||y<0.1)
			fragmentColor = vec4(0,0,0,1);

		float indexX = floor(vTextureCoord.s*uWidth/uH);
		float indexY = floor(vTextureCoord.t*uHeight/uH);

		if(indexX==uIndexX&&indexY==uIndexY)
			fragmentColor = vec4(1,0,0,1);

		
        gl_FragColor = fragmentColor;
    }
</script>

