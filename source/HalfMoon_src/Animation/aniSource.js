var AniSource = (function(){
	var cls = function(name,cb){
		Obj.call(this,name);
		this.cb = cb;
		
	};

	cls.prototype = Object.create(Obj.prototype);
	cls.prototype.constructor = cls;
	cls.prototype.GetValue = function(time){
		var value = this.cb.call(this,time);
		return value;
	};

	return cls;
	
})();

var AniRawData = (function(){
	var _frameRate = 0.0166667;
	var cls = function(name,data){
		AniSource.call(this,name);
		this.data = data;
	};
	cls.prototype = Object.create(AniSource.prototype);
	cls.prototype.constructor = cls;
	cls.prototype.FindNearestFrame = function(obj){
		if(!this.data[obj.frmIndex]){
			obj.frmIndex++;
			this.FindNearestFrame(obj);
		}
		else
			return;
	};
	cls.prototype.GetValue = function(time){
		var frmIndex = Math.floor(time/_frameRate);
		if(frmIndex>=this.data.length)
			frmIndex %= this.data.length;
		var obj = {frmIndex:frmIndex};
		this.FindNearestFrame(obj);
		return this.data[obj.frmIndex];
	};
	return cls;
})();