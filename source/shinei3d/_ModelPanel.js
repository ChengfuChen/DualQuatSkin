var ModelPanel = (function(){
	var cls = function(name,width,height,textureNm, size,startPoint, dis, dis2){
		
		UIPanel.call(this,name,width,height,textureNm);
		this.size = size;
		this.startPoint = startPoint;
		this.distance = dis;   //row move distance
		this.distance2 = dis2; //column move distance
		this.moveDis2 = 0; //up&down vertical move distance
		this.rowPointer = 0;
		this.arrows = [];
		this.category = [];
		this.AddRow = function(A) {
			this.category.push(A);
		};
		
		
		
		var childDragStart = function(){
			this.state =this.panelState.Drag;
			
		}
		
		HalfMoon.SysEvent.Subscribe("OnModelBtnDragStart",this,childDragStart);
		
		
		var childDragEnd = function(){

			this.state =this.panelState.Sleep;
		};

		HalfMoon.SysEvent.Subscribe("OnModelBtnDragEnd",this,childDragEnd);
		
		
		
		
		
//		this.moveoverTarget = -1;
		this.Resize = function(vec2){
			// resize panel
//			this.isInitialized = false;
			this.width = 0.92*vec2[0];
			this.height = 0.3*vec2[1];
			this.transform.Scale([vec2[2],vec2[3], 1]);
			this.transform.MoveTo([-0.46*vec2[0],-0.18*vec2[1],-100]);
			
			//resize arrows
			for(var i = 0; i < this.arrows.length; i++) {
//				this.arrows[i].isInitialized = false;
				this.arrows[i].width = 0.04*vec2[0];
				this.arrows[i].height = 0.04*vec2[0];
				this.arrows[i].transform.Scale([vec2[3],vec2[3], 1]);
				this.arrows[i].transform.MoveTo([-(0.45-i*0.05)*vec2[0],-0.2*vec2[1],0]);
			}

			//resize models
			this.size = 0.06*vec2[0];
			this.startPoint = [-0.45*vec2[0],-0.35*vec2[1]];
			this.distance = 0.2*vec2[0];   //row move distance
			this.distance2 = 0.02*vec2[1]; //column move distance
			for(var i = 0; i < this.category.length; i++) {
				for(var j = 0; j < this.category[i].rowContent.length; j++) {
//					this.category[i].rowContent[j].isInitialized = false;
					this.category[i].rowContent[j].width = this.size;
					this.category[i].rowContent[j].height = this.size;
					this.category[i].rowContent[j].transform.Scale([vec2[3],vec2[3], 1]);
//					this.category[i].rowContent[j].draggable.isInitialized = false;
					this.category[i].rowContent[j].draggable.width = this.size;
					this.category[i].rowContent[j].draggable.height = this.size;
					this.category[i].rowContent[j].draggable.transform.Scale([vec2[3],vec2[3], 1]);
					if(this.category[i].rowContent[j].transform.GetPosition()[2] != 20000) {
						var x1 = this.startPoint[0] + i * this.distance2;
						var x2 = this.category[i].moveDis*this.distance + this.category[i].moveDis1*this.distance2;
						var x3 = j * this.distance;
						var y1 = this.startPoint[1];
						var y2 = this.moveDis2*this.distance2;
						var y3 = i * this.distance2;
						this.category[i].rowContent[j].setStartPos([x1 + x2 + x3, y1 + y2 + y3, this.category[i].z]);
						this.category[i].rowContent[j].setTargetPos([x1 + x2 + x3, y1 + y2 + y3, this.category[i].z]);
					}
				}
			}
			
		};
		HalfMoon.SysEvent.Subscribe("CanvasResize:",this,this.Resize);
	
		this.ColMove = function(moveEvent){
			if(moveEvent == "up") {
				var downmost = this.rowPointer;
				if(downmost > 0){
			  		for(var i = 1; i < this.category[this.rowPointer].rowContent.length-1; i++) {
			 			this.category[this.rowPointer].rowContent[i].SetActive(false);
			 		}
					this.rowPointer -= 1;
//					this.moveDis2 += this.distance2;
					this.moveDis2 += 1;
					for(var i = 0; i < this.category.length; i++)
//						this.category[i].moveDis1 += this.distance2; 
						this.category[i].moveDis1 += 1;
					for(var i = 1; i < this.category[this.rowPointer].rowContent.length-1; i++) {
			 			this.category[this.rowPointer].rowContent[i].SetActive(true);
//			 			if(i >= this.category[this.rowPointer].colPointer && i<= this.category[this.rowPointer].colPointer+4) {
//			 				if(this.category[this.rowPointer].rowContent[i].isLoaded == false) {
//				 				var _texture = new Texture(HalfMoon.renderer[0].graphic.gl,this.category[this.rowPointer].rowContent[i].sourcePath);
//								this.category[this.rowPointer].rowContent[i].material.setTexture("diffCol",_texture);
//								this.category[this.rowPointer].rowContent[i].SetDraggableTexture(this.category[this.rowPointer].rowContent[i].sourcePath);
//								this.category[this.rowPointer].rowContent[i].isLoaded = true;
//			 				}
//			 			}
			 				
			 		}

					for(var i = 0; i < this.category.length; i++) {
				    	var y1 = this.startPoint[1];
				    	var y2 = i*this.distance2;
				    	var y3 = this.moveDis2*this.distance2;
				    	var z = this.category[i].z;
						for(var j = 0; j < this.category[i].rowContent.length; j++) {
						 	var x1 = this.startPoint[0];
					    	var x2 = j*this.distance + i*this.distance2;
					    	var x3 = this.category[i].moveDis*this.distance + this.category[i].moveDis1*this.distance2;
					    	if(i < this.rowPointer)
					    		this.category[i].rowContent[j].setTargetPos([x1 + x2 + x3, y1 + y2 + y3, 20000]);
					    	else
						    	this.category[i].rowContent[j].setTargetPos([x1 + x2 + x3, y1 + y2 + y3, z]);
						}
					}
			    }
			}

            if(moveEvent == "down") {
            	var upmost = this.rowPointer;
				if(upmost < (this.category.length - 1)) {
			  		for(var i = 1; i < this.category[this.rowPointer].rowContent.length-1; i++) {
			 			this.category[this.rowPointer].rowContent[i].SetActive(false);
			 		}
					this.rowPointer += 1;
//					this.moveDis2 -= this.distance2;
					this.moveDis2 -= 1;
					for(var i = 0; i < this.category.length; i++)
//						this.category[i].moveDis1 -= this.distance2;
						this.category[i].moveDis1 -= 1;
					for(var i = 1; i < this.category[this.rowPointer].rowContent.length-1; i++) {
			 			this.category[this.rowPointer].rowContent[i].SetActive(true);
//			 			if(i >= this.category[this.rowPointer].colPointer && i<= this.category[this.rowPointer].colPointer+4) {
//			 				if(this.category[this.rowPointer].rowContent[i].isLoaded == false) {
//				 				var _texture = new Texture(HalfMoon.renderer[0].graphic.gl,this.category[this.rowPointer].rowContent[i].sourcePath);
//								this.category[this.rowPointer].rowContent[i].material.setTexture("diffCol",_texture);
//								this.category[this.rowPointer].rowContent[i].SetDraggableTexture(this.category[this.rowPointer].rowContent[i].sourcePath);
//								this.category[this.rowPointer].rowContent[i].isLoaded = true;
//			 				}
//			 			}
			 		}

					for(var i = 0; i < this.category.length; i++) {
				    	var y1 = this.startPoint[1];
				    	var y2 = i*this.distance2;
				    	var y3 = this.moveDis2*this.distance2;
				    	var z = this.category[i].z;
						for(var j = 0; j < this.category[i].rowContent.length; j++) {
						 	var x1 = this.startPoint[0];
					    	var x2 = j*this.distance + i*this.distance2;
					    	var x3 = this.category[i].moveDis*this.distance + this.category[i].moveDis1*this.distance2;
					    	if(i < this.rowPointer)
					    		this.category[i].rowContent[j].setTargetPos([x1 + x2 + x3, y1 + y2 + y3, 20000]);
					    	else
						    	this.category[i].rowContent[j].setTargetPos([x1 + x2 + x3, y1 + y2 + y3, z]);
						}
					}
                }
            }	
		};
		
		this.RowMove = function(moveEvent){
			if(moveEvent == "left") {
				var rightmost = this.category[this.rowPointer].colPointer + 4;
				if(rightmost < (this.category[this.rowPointer].rowContent.length - 1)) {
					
//					this.category[this.rowPointer].rowContent[this.category[this.rowPointer].colPointer].isDrawable = false;
//					this.category[this.rowPointer].rowContent[this.category[this.rowPointer].colPointer+5].isDrawable = true;
					
					this.category[this.rowPointer].colPointer += 1;
//					this.category[this.rowPointer].moveDis -= this.distance;
					this.category[this.rowPointer].moveDis -= 1;
				    
//					if(this.category[this.rowPointer].rowContent[this.category[this.rowPointer].colPointer+4].isLoaded == false) {
//						var _texture = new Texture(HalfMoon.renderer[0].graphic.gl,this.category[this.rowPointer].rowContent[this.category[this.rowPointer].colPointer+4].sourcePath);
//						this.category[this.rowPointer].rowContent[this.category[this.rowPointer].colPointer+4].material.setTexture("diffCol",_texture);
//						this.category[this.rowPointer].rowContent[this.category[this.rowPointer].colPointer+4].SetDraggableTexture(this.category[this.rowPointer].rowContent[this.category[this.rowPointer].colPointer+4].sourcePath);
//						this.category[this.rowPointer].rowContent[this.category[this.rowPointer].colPointer+4].isLoaded = true;
//					}
					
					for(var i = 0; i < this.category[this.rowPointer].rowContent.length; i++) {
				    	var a = this.startPoint[0];
				    	var b = i*this.distance;
				    	var c = this.category[this.rowPointer].moveDis*this.distance;
				    	var z = this.category[this.rowPointer].z;
				    	this.category[this.rowPointer].rowContent[i].setTargetPos([a + b + c, this.startPoint[1],z]);
	
				    }
			    }
			}
				
			if(moveEvent == "right") {
				var leftmost = this.category[this.rowPointer].colPointer;
				if(leftmost > 0) {
//					this.category[this.rowPointer].moveDis += this.distance;
					
//					this.category[this.rowPointer].rowContent[this.category[this.rowPointer].colPointer+4].isDrawable = false;
//					this.category[this.rowPointer].rowContent[this.category[this.rowPointer].colPointer-1].isDrawable = true;
					
					this.category[this.rowPointer].moveDis += 1;
					this.category[this.rowPointer].colPointer -= 1;
					
//					if(this.category[this.rowPointer].rowContent[this.category[this.rowPointer].colPointer].isLoaded == false) {
//						var _texture = new Texture(HalfMoon.renderer[0].graphic.gl,this.category[this.rowPointer].rowContent[this.category[this.rowPointer].colPointer].sourcePath);
//						this.category[this.rowPointer].rowContent[this.category[this.rowPointer].colPointer].material.setTexture("diffCol",_texture);
//						this.category[this.rowPointer].rowContent[this.category[this.rowPointer].colPointer].SetDraggableTexture(this.category[this.rowPointer].rowContent[this.category[this.rowPointer].colPointer].sourcePath);
//						this.category[this.rowPointer].rowContent[this.category[this.rowPointer].colPointer].isLoaded = true;
//					}
					
					for(var i = 0; i < this.category[this.rowPointer].rowContent.length; i++) {
				    	var a = this.startPoint[0];
				    	var b = i*this.distance;
				    	var c = this.category[this.rowPointer].moveDis*this.distance;
				    	var z = this.category[this.rowPointer].z;
				    	this.category[this.rowPointer].rowContent[i].setTargetPos([a + b + c, this.startPoint[1],z]);
				    }
			    }
			}		
		};
	};
	cls.prototype = Object.create(UIPanel.prototype);
	cls.prototype.constructor = cls;
	return cls; 
})();

var UIRow = (function(){
	var cls = function(name, z){
		this.name = name;
		this.rowContent = [];
		this.colPointer = 0;
		this.moveDis = 0; //left&right horizontal move distance
		this.moveDis1 = 0; //up&down horizontal move distance
		this.z = z;
		this.AddModel = function(A) {
			this.rowContent.push(A);
		};
		
	};
	return cls; 
})();

//ModelPanel = ModelPanel;