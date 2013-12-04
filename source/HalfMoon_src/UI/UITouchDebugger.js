var UITouchDebugger=(function(){
	var cls = function(name,width,height,textureNm){
		UIObject.call(this,name,width,height,textureNm);
		this.touches=[];
		this.isActive = false;
		this.SetTouches = function(touches){
			this.touches = touches;
		};
		var _draw = this.draw;
		
		this.draw= function(render){
			var i, len = this.touches.length;
			for (i=0; i<len; i++) {
				var touch = this.touches[i];
			    var px = touch.pageX;
			    var py = touch.pageY;
			    this.SetTranslate([px,py]);
				_draw.call(this,render);
				//console.log(len);
			}
			
		
		};
	}
	
	cls.prototype = Object.create(UIObject.prototype);
	cls.prototype.constructor = cls;
	return cls;
})();