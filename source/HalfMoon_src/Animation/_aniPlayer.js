var AniPlayer = (function(){
	var cls = function(name){
		Obj.call(this,name);
		this.dataCollection={};
	};

	cls.prototype = Object.create(Obj.prototype);
	cls.prototype.constructor = cls;
	
	cls.prototype.SetValue(key,frm,value){
		if(!this.dataCollection[key])
			this.dataCollection[key] = [];
		this.dataCollection[key][frm] = mat4.clone(value);
	};
	cls.prototype.GetValue(key,frm,value){
		
		return mat4.clone(this.dataCollection[key][frm]);
	};
	cls.prototype.Flush(){
		this.dataCollection={};
	};
	cls.prototype.Delete(key){
		this.dataCollection[key].length=0;
	};
	
	return cls;
})();