var Animation = (function(){
	var cls = function(name,target){
		Obj.call(this,name);
		this.target = target;
		this.aniChannels = [];
		this.aniFuncs = [];
		this.PLAYSTATE={play:"Play",stop:"Stop",pause:"pause"};
		this.playstate = this.PLAYSTATE.stop;

		this._initialTime = 0;this._oldPlayState = this.playstate;
		HalfMoon.SysEvent.Subscribe("TimeChanged:",this,this.Update);
	};

	cls.prototype = Object.create(Obj.prototype);
	cls.prototype.constructor = cls;
	
	cls.prototype.Set = function(func){
		this.aniFuncs.push(func);
	};
	cls.prototype.Delete = function(func){
		for(var i in this.aniFuncs){
			if(this.aniFuncs[i]==func)
				this.aniFuncs.splice(i,1);
		}
	};
	cls.prototype.Import = function(channel){
		this.aniChannels.push(channel);
	};
	cls.prototype.Update = function(time){
		//console.log(time);
		if(this.playstate==this.PLAYSTATE.stop){
			this._initialTime = 0;
			return;
		}
		else if(this.playstate==this.PLAYSTATE.play&&
				this._oldPlayState==this.PLAYSTATE.stop)//first hit play
			this._initialTime = time.totalTime;
		

		this._oldPlayState = this.playstate;
		
		var timeInSec = time.totalTime-this._initialTime;
		for(var i = 0; i<this.aniFuncs.length;i++){
			var result = this.aniFuncs[i].call(this.target,timeInSec);
			if(result)
				this.aniFuncs.splice(i,1);
		}
		for(var i = 0; i<this.aniChannels.length;i++)
			this.aniChannels[i].SetValue(timeInSec);
	};

	return cls;
})();