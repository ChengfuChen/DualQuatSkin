var UIElementVideo=(function(){
	var cls = function(name,width,height,videoDef,material){
		UIElement.call(this,name,width,height,null,material);

		
		var _initialize = this.Initialize;//parent initialize
		this.isLoaded = false;
		this.Initialize = function(render){

			_initialize.call(this,render);
		};
		
		this.Update = function(){
			
			
		};
		var _draw = this.draw;//p
		this.draw= function(render){

			_draw.call(this,render);//draw UIElement
		};
		
	};

	cls.prototype = Object.create(UIElement.prototype);
	cls.prototype.constructor = cls;
	return cls;
	
	
	
})();