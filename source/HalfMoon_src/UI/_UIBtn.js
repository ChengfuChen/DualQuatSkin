var UIBtn = (function(){
	var cls = function(name,width,height,textureNm){
		UIObject.call(this,name,width,height,textureNm);
		var self = this;
		var myClickFnc = function(e){
//			
//			var inSide = this.CheckInsideUIElement([e.mouseEvent.clientX,e.mouseEvent.clientY]);
//			if(inSide)
			if(this.objState==UIOBJSTATE.RollIn){
				e.preventDefault();
				this.OnBtnClickEvent.publish("OnBtnClick",this);
			}
		};
		this.OnMouseClickEvent.subscribe("OnMouseClick",this,myClickFnc);

		this.OnBtnClickEvent = new UIDelegate();
		this.OnBtnClick = function(btn){

			//console.log("OnBtnClicked");
		};
		this.OnBtnClickEvent.subscribe("OnBtnClick",this,this.OnBtnClick);

	};
	cls.prototype = Object.create(UIObject.prototype);
	cls.prototype.constructor = cls;
	return cls;
})();
//UIBtn = UIBtn;