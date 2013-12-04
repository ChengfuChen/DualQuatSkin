
fragment:
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