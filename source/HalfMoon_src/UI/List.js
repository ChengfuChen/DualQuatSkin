var List = (function(){
	var List =function(name,width,height,textureNm){
		
		UIObject.call(this,name,width,height,textureNm);
		var _draw = this.draw;

		this.draw = function(render){

			_draw.call(this,render);//parent draw
		};
	
	};
	List.prototype = Object.create(UIObject.prototype);
	List.prototype.constructor = List;
	return List; 
	
})();