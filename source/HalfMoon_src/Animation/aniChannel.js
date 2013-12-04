var AniChannel = (function(){
	var cls = function(aniSource,targetNm,funcNm){
		this.aniSource = aniSource;
		this.targetObj = GetObjByNm (targetNm);
		//this.targetProperty = targetProperty;
		this.SetValue = function(time){
			this.targetObj[funcNm](this.aniSource.GetValue(time));
			//this.targetObj.Update();
		};
	};
	
	return cls;
})();