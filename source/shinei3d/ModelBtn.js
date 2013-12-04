var ModelBtn = (function(){
	var cls = function(name,width,height,inputData){
		//this.Modeltype;
		var self = this;
		if(typeof inputData == 'string') {
			this.Modeltype = "2D";
			UIObject.call(this,name,width,height,inputData);
			this.draggable = new UIDraggable(name+"_draggable",width,height,inputData);
			
		}else{
			this.Modeltype = "3D";
		    var trans,texture,shape,obj;
			
		    shape = new Shape(inputData.ShapeNm);
		    //HalfMoon.loader.LoadModel(inputData.Shape,shape); 
		    var modelPath = HalfMoon.sourcePath+"/"+inputData.Shape;
		    HalfMoon.asyncLoader("GET",modelPath, function (id,workerID,sMessage) {
			    console.log(id+":"+workerID+"|"+modelPath);
            	shape.isLoaded = true;
			    self.isInitialized = false;
			    shape.load(LoadObj(sMessage));
		    });
		    trans = new Transform(inputData.Transform);
			obj = new Pangpang(inputData.ObjNm,shape,trans,
					HalfMoon.materials[inputData.Material].clone());//HalfMoon.materials["quad"]
			
			
			var _onTextureLoaded = obj.OnTextureLoaded;
			obj.OnTextureLoaded = function(){
				self.isInitialized = false;
				_onTextureLoaded.call(this);
				
			};
			
			
			var texPrefix = inputData.TexturePath;
			for(var i in inputData.Texture){
				var textureFullNm = texPrefix+inputData.Texture[i];
				if(!HalfMoon.textures[textureFullNm])
					texture = new Texture(inputData.renderObj.graphic.gl,
														   textureFullNm,
														   obj.OnTextureLoaded);
				else
					texture = HalfMoon.textures[textureFullNm];
				
				
				obj.material.setTexture(i,texture);
			}
			obj.isDrawable = false;

			//animation definition
			var rot = 3;
			var _aniScript = function(time){
				
				this.transform.Rotate([0,Math.degree2Radian(rot),0]);
//				if(this.transform.rotation[1]>6.28)
//					return true;
			};
			var _animation = new Animation("test1",obj);
		    this.obj = obj;
//			var rot = 3;
//			var animation = function(time){
//				
//				this.transform.Rotate([0,Math.degree2Radian(rot),0]);
//				if(this.transform.rotation[1]>10000)
//					return true;
//			};
// 			var ani = new Animation("test1",obj);
//			ani.Set(animation); 
//			ani.Delete(animation);
			UIObject.call(this,name,width,height,[obj]);

			this.draggable = new UIDraggable(name+"_draggable",width,height,null,this.material);

		}
			
			

		var _this = this;
		this.isActive = false;
		this.draggable.isDrawable = false;
		this.draggable.isActive = false; // control if user can new a draggable object for ModelBtn
		var parentPos = [];
		var childPos = [];
		this.sourcePath;
		this.isLoaded = false;
		
		var state = {
				Sleep : "Sleep",
				Drag: "Drag",
	            Moving: "Moving",
	            NoMoving: "NoMoving"	
		};
		this.modelBtnState = state.Sleep;
		
		
//		this.AddChild(this.draggable);
//		//this.draggable.SetParent(this);
		
		this.SetDraggableTexture = function(textureNm) {
			var _texture = new Texture(HalfMoon.renderer[0].graphic.gl,textureNm);
			this.draggable.material.setTexture("diffCol",_texture);
		};
		
		this.SetActive = function(boolean){
			_this.isActive = boolean;
			_this.draggable.isActive = boolean;
		};
		this.setStartPos = function(pos) {
			this.currentPos = pos;
			this.transform.MoveTo([pos[0],pos[1],pos[2]]);
			this.draggable.transform.MoveTo([pos[0],pos[1],pos[2]]);
		};
		
        /*roll in roll out event*/
		this.OnBtnRollIn = function(){

			
			if(_this.obj){
				_animation.Set(_aniScript); 
				_this.updateState = _this.initialState.ALWAYS;
			}
		};
		this.OnBtnRollInEvent.subscribe("OnBtnRollIn",this,this.OnBtnRollIn);
		
		this.OnBtnRollOut= function(){


			if(_this.obj){//"_this" is for ModelBtn; "this" is for pangpang obj
				_animation.Delete(_aniScript); 
				
				var aniScript = function(time){
					
					this.transform.Rotate([0,Math.degree2Radian(rot),0]);
					var current = Math.radian2Degree(this.transform.rotation[1]);
					var tmp = current%360;
					//console.log(tmp);
					if(tmp<1){
						this.transform.RotateTo([0,0,0]);
						if(_animation.aniFuncs.length==1)
							_this.updateState = _this.initialState.LOADING;
						return true;
					}
				};
				_animation.Set(aniScript);
			}
		};
		this.OnBtnRollOutEvent.subscribe("OnBtnRollOut",this,this.OnBtnRollOut);
		
		/*drag event */
		this.draggable.OnBtnDragStart = function(){
			if(_this.draggable.isActive) {
				_this.modelBtnState = _this.draggable.draggableState = state.Drag;
				_this.draggable.isDrawable = true;
				
				 HalfMoon.SysEvent.Publish("OnModelBtnDragStart",null);

			}
			
		};
		this.draggable.OnBtnDragStartEvent.subscribe("OnBtnDragStart",this.draggable,this.draggable.OnBtnDragStart);

		this.draggable.OnBtnDragOver = function(){

		};
		this.draggable.OnBtnDragOverEvent.subscribe("OnBtnDragOver",this.draggable,this.draggable.OnBtnDragOver);
		
		this.draggable.OnBtnDragEnd = function(){
//			_this.draggable.isUpdatable = true;
//			childPos = _this.draggable.transform.GetPosition();
//			parentPos = _this.transform.GetPosition();
			_this.modelBtnState = _this.draggable.draggableState = state.Moving;
			_this.draggable.isActive = false;
			parentPos[0] = _this.transform.GetPosition()[0];
			parentPos[1] = _this.transform.GetPosition()[1];
			parentPos[2] = _this.transform.GetPosition()[2];
			childPos[0] = _this.draggable.transform.GetPosition()[0];
			childPos[1] = _this.draggable.transform.GetPosition()[1];
			childPos[2] = _this.draggable.transform.GetPosition()[2];
			HalfMoon.SysEvent.Publish("OnModelBtnDragEnd",null);
		};
		this.draggable.OnBtnDragEndEvent.subscribe("OnBtnDragEnd",this.draggable,this.draggable.OnBtnDragEnd);
		
		/* click event */
//		var myClickFnc = function(e){
////			console.log("X:" + e.mouseEvent.clientX + "Y:" + e.mouseEvent.clientY);
////			console.log("worldX:" + (e.mouseEvent.clientX-HalfMoon.UIRoot.width/2) + "worldY:" + (-(e.mouseEvent.clientY - HalfMoon.UIRoot.height/2)));
//			var tmpMatrix = mat4.create();
////			var vector = [(e.mouseEvent.clientX-HalfMoon.UIRoot.width/2),
////			              -(e.mouseEvent.clientY - HalfMoon.UIRoot.height/2),
////			              -40];
//			
//			var screenPos = _this.mouse2screen([e.mouseEvent.clientX,e.mouseEvent.clientY]);
//			var vector = [screenPos[0],screenPos[1],-40];
//			
//			mat4.invert(tmpMatrix,this.transform.worldMatrix);
//			vec3.transformMat4(vector,vector,tmpMatrix);
//			
//			if(vector[0] > 0 && vector[0] < this.width && vector[1] < 0 && vector[1] > -this.height) {
////				console.log("UIBTN clicked!!");
//				e.preventDefault();
//				this.OnBtnClickEvent.publish("OnBtnClick",this);
//			}
//		};
//		this.OnMouseClickEvent.subscribe("OnMouseClick",this,myClickFnc);
//
//		this.OnBtnClickEvent = new UIDelegate();
//		this.OnBtnClick = function(btn){
//
//			console.log("OnBtnClicked");
//		};
//		this.OnBtnClickEvent.subscribe("OnBtnClick",this,this.OnBtnClick);
		
		
		/*update function*/
        var _updateFnc = this.draggable.Update;
		this.draggable.Update = function(elapsed) {

			switch(_this.modelBtnState) {
				case 'Sleep':
					_this.draggable.isDrawable = false;
				break;
//				
//				case 'Drag':
//					_updateFnc.call(_this.draggable,elapsed);
//				break;
			
				case 'Moving':
					childPos[0] += (parentPos[0]-childPos[0])/15;
					childPos[1] += (parentPos[1]-childPos[1])/15;
					_this.draggable.transform.MoveTo([childPos[0],childPos[1],0]);
					if(Math.abs(parentPos[0]-childPos[0]) < 0.5 && Math.abs(parentPos[1]-childPos[1]) < 0.5) {
						_this.modelBtnState = _this.draggable.draggableState = state.Sleep;
						_this.draggable.isActive = true;
					}
				break;
				
				case 'NoMoving':
					_this.draggable.transform.MoveTo([parentPos[0],parentPos[1],0]);
					_this.modelBtnState = _this.draggable.draggableState = state.Sleep;
					_this.draggable.isActive = true;
				break;
				

			};
			
			
		};
		
		var speed;
		this.Update = function(elapsed) {
			if(!this.targetPos)
				return;
//			if(this.Modeltype == "3D") 
//				speed = 100;
//			else
				speed = 15;
		    this.currentPos[0] += (this.targetPos[0] - this.currentPos[0])/speed;
		    this.currentPos[1] += (this.targetPos[1] - this.currentPos[1])/speed;
		    this.transform.MoveTo([this.currentPos[0], this.currentPos[1], this.targetPos[2]]);
		    if(this.modelBtnState == 'Sleep')
				this.draggable.transform.MoveTo([this.transform.GetPosition()[0],this.transform.GetPosition()[1],0]);
		};

	};
	cls.prototype = Object.create(UIObject.prototype);
	cls.prototype.constructor = cls;
	return cls;
})();

//ModelBtn = ModelBtn;