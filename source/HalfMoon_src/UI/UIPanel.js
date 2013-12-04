var UIPanel = (function(){
	var cls =function(name,width,height,textureNm){
		
		UIObject.call(this,name,width,height,textureNm);
		var _draw = this.draw;
		this.hasBound = true;
		
	
		
		this.state = PANELSTATE.Sleep;

		
		this.SetActive = function(isActive){
			this.isActive = isActive;
			//HalfMoon.UISysEvent.Capture("OnActiveChange",this,isActive);
		};
		
//		this.IsOverPanel = function(point){
//			var currentPos = this.transform.GetPosition();
//			//if point inside panel, in UIPanel world coord
//			if(point[0]>=currentPos[0]&&point[0]<=currentPos[0]+this.width&&
//			   point[1]>=currentPos[1]-this.height&&point[1]<=currentPos[1])
//				return true;
//			else
//				return false;
//		};
		
		this.IsOverPanel = function(point){
			var result = (point[0]>=0&&point[0]<=this.width&&
					point[1]<=0&&point[1]>=-this.height)?true:false;
			return result;
		};
		
		this.draw = function(render){
			//If child is out of bound cancel rendering
			for (var i in this.children) {
				var childLeftUpper =  this.children[i].transform.GetPosition();
				
				
				var childRightLower = [childLeftUpper[0]+this.children[i].width,
							                   childLeftUpper[1]-this.children[i].height];
				
				if(this.IsOverPanel(childLeftUpper)&&this.IsOverPanel(childRightLower)){
					if(!(this.children[i] instanceof UIDraggable))
						this.children[i].isDrawable = true;
				}else{
					if(this.hasBound) {
						if(!this.children[i].canMoveOutside)
							// if children are not allowed to out of panel,escape draw
							this.children[i].isDrawable = false;
						
					} else // panel don't allow to draw any child when children outofbound 
						this.children[i].isDrawable = false;
				}

				
			}
	
			_draw.call(this,render);//parent draw
		};
	
	};
	cls.prototype = Object.create(UIObject.prototype);
	cls.prototype.constructor = cls;
	return cls; 
	
})();

//UIPanel = UIPanel;