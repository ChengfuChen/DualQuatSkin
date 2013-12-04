var PopupPanel = (function(){
	var cls =function(name,width,height,textureNm){
		
		UIPanel.call(this,name,width,height,textureNm);
		
		var self = this;
		
		this.popLeft = new UIBtn("popLeft",width/6,height,"images/1.png");
        this.AddChild(this.popLeft);
		
		this.popRight = new UIBtn("popRight",width/6,height,"images/2.png");
        this.AddChild(this.popRight);
        
		this.popUp = new UIBtn("popUp",width/6,height,"images/3.png");
        this.AddChild(this.popUp);
        
		this.popDown = new UIBtn("popDown",width/6,height,"images/4.png");
        this.AddChild(this.popDown);
        
		this.popRotate = new UIBtn("popRotate",width/6,height,"images/5.png");
        this.AddChild(this.popRotate);
       
		this.popDelete = new UIBtn("popDelete",width/7,height,"images/6.png");
        this.AddChild(this.popDelete);
		
		this.SetDisplay = function(isOn, position){
			if(isOn && position){
				this.transform.MoveTo(position);
				this.popLeft.transform.MoveTo([position[0],position[1],0]);
				this.popRight.transform.MoveTo([position[0]+width/6,position[1],0]);
				this.popUp.transform.MoveTo([position[0]+width/3,position[1],0]);
				this.popDown.transform.MoveTo([position[0]+width/2,position[1],0]);
				this.popRotate.transform.MoveTo([position[0]+2*width/3,position[1],0]);
				this.popDelete.transform.MoveTo([position[0]+5*width/6,position[1],0]);
				
				this.isDrawable = true;
			}else {
				this.isDrawable = false;
			}

			this.SetActive(isOn);
		};
		
		
		this.popDelete.OnBtnClick = function(btn){
			self.SetDisplay(false, null);
		};
		this.popDelete.OnBtnClickEvent.subscribe("OnBtnClick",self.popDelete,self.popDelete.OnBtnClick);
		
		this.popLeft.OnBtnClick = function(btn){
			HalfMoon.SysEvent.Publish("PopUpPanel:PopLeft:OnBtnClick",null);
		};
		this.popLeft.OnBtnClickEvent.subscribe("OnBtnClick",self.popLeft,self.popLeft.OnBtnClick);

		this.popRight.OnBtnClick = function(btn){
			HalfMoon.SysEvent.Publish("PopUpPanel:PopRight:OnBtnClick",null);
		};
		this.popRight.OnBtnClickEvent.subscribe("OnBtnClick",self.popRight,self.popRight.OnBtnClick);
		
		this.popUp.OnBtnClick = function(btn){
			HalfMoon.SysEvent.Publish("PopUpPanel:PopUp:OnBtnClick",null);
		};
		this.popUp.OnBtnClickEvent.subscribe("OnBtnClick",self.popUp,self.popUp.OnBtnClick);
		
		this.popDown.OnBtnClick = function(btn){
			HalfMoon.SysEvent.Publish("PopUpPanel:PopDown:OnBtnClick",null);
		};
		this.popDown.OnBtnClickEvent.subscribe("OnBtnClick",self.popDown,self.popDown.OnBtnClick);
		
		this.popRotate.OnBtnClick = function(btn){
			HalfMoon.SysEvent.Publish("PopUpPanel:PopRotate:OnBtnClick",null);
		};
		this.popRotate.OnBtnClickEvent.subscribe("OnBtnClick",self.popRotate,self.popRotate.OnBtnClick);
	};

	cls.prototype = Object.create(UIPanel.prototype);
	cls.prototype.constructor = cls;
	return cls; 
	
})();

//PopupPanel = PopupPanel;