var Shader = (function(){
    var cls = 	function(path,gl,callback){
    
        var self = this;
        this.path = path;
        this.last_unit = 0;

        HalfMoon.loader.LoadScripts(path,function(source){
        	
            var shaders = self.preprocess(source);
            
            self.create(gl);
//            self.fragment.source = shaders.fragment;
//            self.vertex.source = shaders.vertex;
            self.fragSrc = shaders.fragment;
            self.vertSrc = shaders.vertex;

            self.attributes = JSON.parse(shaders.attributes);
            self.uniforms = JSON.parse(shaders.uniforms);
            self.compile(gl);
            
            callback(self,self);
        	
        });
    };
    
    
    cls.prototype = {
            create: function(gl){
                this.fragment = gl.createShader(gl.FRAGMENT_SHADER);
                this.vertex = gl.createShader(gl.VERTEX_SHADER);
                //this.program = gl.createProgram();
                //gl.attachShader(this.program, this.vertex);
                //gl.attachShader(this.program, this.fragment);
            },
            compile: function(gl,params){
                this.uniform_cache = {};
                this.attrib_cache = {};
                var params = params || {};
                var directives = [
                    '#version 100',
                    'precision mediump float;'
                ];

                for(i in (params.defines || [])){
                    directives.push('#define ' + params.defines[i]);
                }
                directives = directives.join('\n') + '\n';

                var shaders = [this.fragment, this.vertex];
                var src = [this.fragSrc,this.vertSrc];
                for(i in shaders){
                
                    var shader = shaders[i];
                    var source = src[i];
                    for(name in params.values || {}){
                        var re = new RegExp('#define ' + name + ' \\w+', 'm');
                        source = source.replace(re, '#define ' + name + ' ' + params.values[name]);
                    }
                    gl.shaderSource(shader, directives + source);
                    gl.compileShader(shader);
                    if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)){
                       // glee.handleError({
                    	console.log({
                            type: 'shader compile',
                            error: gl.getShaderInfoLog(shader),
                            path: this.path
                    	});
                        //});
                    }
                }
//                gl.linkProgram(this.program);
//                if(!gl.getProgramParameter(this.program, gl.LINK_STATUS)){
//                    //glee.handleError({
//                	console.log({
//                        type: 'program link',
//                        error: gl.getProgramInfoLog(this.program),
//                        path: this.path
//                	});
//                   // });
//                }
            },
            copy: function(){
                return new Shader(null, this.path, {
                    vertex: this.vertex.source,
                    fragment: this.fragment.source,
                });
            },
            preprocess: function(source){
                lines = source.split('\n');
                var shaders = {};
                var current;

                $.each(lines, function(i, line){
                    var type = line.match(/^(\w+):/);
                    if(type){
                        type = type[1];
                        current = shaders[type];
                        if(!current){
                            current = shaders[type] = [];
                        }
                    }
                    
                    else{
                        if(current){
                            current.push({line: i, text: line});
                        }
                    }
                });
                $.each(shaders, function(type, lines){
	                    var shader_source = '';
	                    $.each(lines, function(i, line){
	                    	if(type=="vertex"||type=="fragment")
	                    		shader_source += '#line ' + line.line + '\n' + line.text + '\n';
	                    	else
	                    		shader_source += line.text;
	                    });
	                    shaders[type] = shader_source;
                	
                });
                return shaders;
            },
            unbind: function(){
                Shader.current = null;
                gl.useProgram(null);
            },
            bind: function(){
                Shader.current = this;
                gl.useProgram(this.program);
            },
            getAttribLocation: function(name){
                var attrib_location = this.attrib_cache[name];
                if(attrib_location === undefined){
                    var attrib_location = this.attrib_cache[name] = gl.getAttribLocation(this.program, name);
                }
                return attrib_location;
            },
            getUniformLocation: function(name){
                var uniform_location = this.uniform_cache[name];
                if(uniform_location === undefined){
                    var uniform_location = this.uniform_cache[name] = gl.getUniformLocation(this.program, name);
                }
                return uniform_location;
            },
            sampler: function(name, unit){
                var uniform_location = this.getUniformLocation(name);
                if(uniform_location){
                    var pushed = this.push();
                    gl.uniform1i(uniform_location, unit);
                    this.pop(pushed);
                }
                return this;
            },
            uniform: function(name, value){
                var uniform_location = this.getUniformLocation(name);
                if(uniform_location){
                    if(value === undefined){
                        return gl.getUniform(this.program, uniform_location);
                    }
                    else{
                        var pushed = this.push();
                        if(value.type == 'Mat4'){
                            gl.uniformMatrix4fv(uniform_location, false, value.data);
                        }
                        else if(value.type == 'Mat3'){
                            gl.uniformMatrix3fv(uniform_location, false, value.data);
                        }
                        else if(value.type == 'Vec3'){
                            gl.uniform3f(uniform_location, value.x, value.y, value.z);
                        }
                        else if(typeof(value) == 'number'){
                            gl.uniform1f(uniform_location, value);
                        }
                        else if(typeof(value) == 'object'){
                            gl['uniform' + value.length + 'fv'](uniform_location, value);
                        }
                        this.pop(pushed);
                    }
                }
                return this;
            },
            uniform2f: function(name, x, y){
                var uniform_location = this.getUniformLocation(name);
                if(uniform_location){
                    var pushed = this.push();
                    gl.uniform2f(uniform_location, x, y);
                    this.pop(pushed);
                }
                return this;
            },
            uniform3fv: function(name, value){
                var uniform_location = this.getUniformLocation(name);
                if(uniform_location){
                    var pushed = this.push();
                    gl.uniform3fv(uniform_location, value);
                    this.pop(pushed);
                }
                return this;
            }
        } ;
    
    return cls;
})();
//Shader = Shader;
    