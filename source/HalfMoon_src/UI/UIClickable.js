var UIClickable = (function(){
	var cls = function(name,width,height,textureNm,material){
		UIObject.call(this,name,width,height,textureNm,material);
		
		
		this.OnMouseClick = function(event){
			console.log("OnMouseClick");
		};

	};
	
	cls.prototype = Object.create(UIObject.prototype);
	cls.prototype.constructor = cls;
	
	return cls;
})();