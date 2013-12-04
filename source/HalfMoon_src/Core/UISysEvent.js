

var UIEvt = (function(){
	var cls = function(){
		this.PreventDefault = function(){
			if(!this.cancelable) return;
			
			this.defaultPrevented  = true;
			this.mouseEvent.preventDefault();
			
		};
		this.StopPropagation = function(){
			
			this.capturing = false;
			this.bubbling = false;
			this.mouseEvent.stopPropagation();
		};
		
		this.InitEvent = function(type,e,cancelable){
			this.eventPhase = 1;
			this.capturing = true;
			this.bubbling = true;
			this.defaultPrevented  = false;
			
			this.cancelable = cancelable||false;
			
			this.mouseEvent = e;
			this.target=null;
			this.curTarget=null;
			this.type=type;
		};
	};
	
	return cls;
})();



var UISysEvent  = (function(){
	var draggable,
		rootRay = {origin:vec3.create(),direction:vec3.create()},tmpMat = mat4.create();
	var cls = function(){
	 	this.name = "UISysEvent";
		
	 	this.findPanel = true;
		var _pool = [];
		var self = this;
		this.event = new UIEvt();
		var 
			//cam = null,
			//intersection = vec3.create(),//in obj Space
			
			//parentRay = {origin:vec3.create(),direction:vec3.create()},
			//curMat = mat4.create(),
			
			closetPoint, // in obj Space
			closestNod,camPos;// in obj space
		
		

		
//		
//		
//		//return true when a is closer
//		function getCloser2Cam(a,b){
//			vec3.sub(a,a,camPos);
//			vec3.sub(b,b,camPos);
//			var result = vec3.squaredLength(a)>vec3.squaredLength(b)?
//						true:false;
//			return result;
//		};
		
	};

	//ray is in parentNode space
	function offsetMethod(parentRay,curNode){
		vec3.copy(curNode._UIPointerCache.ray.origin,parentRay.origin);
		vec3.copy(curNode._UIPointerCache.ray.direction,parentRay.direction);
		vec3.copy(curNode._UIPointerCache.intersection,curNode.parent._UIPointerCache.intersection);
		var xoffset =curNode.transform.position[0],
			yoffset =curNode.transform.position[1],
			isInside=false;
		
		curNode._UIPointerCache.intersection[0] -=xoffset;
		curNode._UIPointerCache.intersection[1] -= yoffset;
    	isInside = false;
    	for(var i=0;i<curNode.listeningZone.length;i++)
    		isInside |=(curNode._UIPointerCache.intersection[0] >= curNode.listeningZone[i][0] &&
    				curNode._UIPointerCache.intersection[0] <= curNode.listeningZone[i][2] && 
    				curNode._UIPointerCache.intersection[1] <= curNode.listeningZone[i][1]&& 
    				curNode._UIPointerCache.intersection[1] >= -curNode.listeningZone[i][3]);
    		
    	
    	return isInside;
	};
	//ray in parentNode space
	function rayTraceMethod(parentRay,curNode){
		vec3.copy(curNode._UIPointerCache.ray.origin,parentRay.origin);
		vec3.copy(curNode._UIPointerCache.ray.direction,parentRay.direction);
		
		//getting inverse matrix transforming ray from parent to child
		mat4.invert(tmpMat,curNode.transform.worldMatrix);
		//mat4.mul(curNode._UIPointerCache.matrix,parentMat, tmpMat);
		vec3.transformMat4(curNode._UIPointerCache.ray.origin, 
						   curNode._UIPointerCache.ray.origin,tmpMat);
						   //curNode._UIPointerCache.matrix);
		//mat4.copy(tmpMat,curNode._UIPointerCache.matrix);
		tmpMat[12] = tmpMat[13] = tmpMat[14] = 0;
		vec3.transformMat4(curNode._UIPointerCache.ray.direction, 
						curNode._UIPointerCache.ray.direction,tmpMat);
		
		if(curNode.fullName==HalfMoon.UIRoot.fullName){
			//hierachyData = {origin:origin,direction:direction,matrix:mat};
			
			//return true;
		}
		
		//Ray: P = origin + t*dir;
		//Plane: P * N + d = 0;
		//Solution: t = -(origin*N+d)/(dir*N)
		//P = origin + t*dir;
		
		var t = 0;
		t = -vec3.dot(curNode._UIPointerCache.ray.origin,[0,0,1])/vec3.dot(curNode._UIPointerCache.ray.direction,[0,0,1]);
		vec3.scale(curNode._UIPointerCache.intersection,curNode._UIPointerCache.ray.direction,t);
		vec3.add(curNode._UIPointerCache.intersection,curNode._UIPointerCache.ray.origin,curNode._UIPointerCache.intersection);
		
		var isInside = false;
		var test;
		for(var i=0;i<curNode.listeningZone.length;i++)
			isInside|=(curNode._UIPointerCache.intersection[0] >= curNode.listeningZone[i][0] && 
				curNode._UIPointerCache.intersection[0] <= curNode.listeningZone[i][2] && 
				curNode._UIPointerCache.intersection[1] <= curNode.listeningZone[i][1] && 
				curNode._UIPointerCache.intersection[1] >= -curNode.listeningZone[i][3]);
		
//		console.log(curNode._UIPointerCache.intersection[0] >= curNode.listeningZone[0][0]);
//		console.log(curNode._UIPointerCache.intersection[0] <= curNode.listeningZone[0][2]);
//		console.log(curNode._UIPointerCache.intersection[1] <= curNode.listeningZone[0][1]);
//		console.log(curNode._UIPointerCache.intersection[1] >= -curNode.listeningZone[0][3]);
//		if(isInside){
//			//hierachyData = {origin:origin,direction:direction,matrix:mat};
//		}
		return isInside;
	}
	cls.prototype.initialize = function(event){
		var cam = HalfMoon.UIRoot.uiCam;
		
		mat4.identity(HalfMoon.UIRoot._UIPointerCache.matrix);
		//ray in worldSpace
		cam.GetRay(event.mouseEvent.clientX,
				   event.mouseEvent.clientY,
				   rootRay.origin,
				   rootRay.direction);
		
		//camPos for nearest
		//camPos = vec3.clone(cam.transform.position);//??????????????????
		
		if(event.type=="OnMouseMove")return;//for debug
		
		this.findPanel = event.type=="OnMouseMove"?true:false;//escape for mousemove
		
		if(event.type != "OnMouseDragOver"&&event.type != "OnMouseDragEnd")
			event.target = this.findTarget(HalfMoon.UIRoot);
		else if(draggable==null&&
				(event.type=="OnMouseDragOver"||event.type=="OnMouseDragEnd")){
			event.PreventDefault();
			event.StopPropagation();
			return false;
		}else
			event.target = draggable;
		
		if((event.type=="OnMouseDragStart"||
				event.type=="OnMouseDragEnd"||
				event.type=="OnMouseDragOver")
				&&event.target["OnMouseDragStart"])//instanceof UIDraggable) 
			draggable = event.target;
		else	
			draggable = null;
		
		console.log(event.target.fullName+":"+event.type);
		if(event.target.fullName==HalfMoon.UIRoot.fullName)
			event.capturing = false;
		
		return true;
	};
	//ray is in parentNode space
	cls.prototype.findTarget = function (curNode){
		var result,
		closestNod=null;
		var selectedChildren =[],
			zoffset =curNode.transform.position[2];
		if(curNode.transform.rotation[0]==0&&
			curNode.transform.rotation[1]==0&&
			curNode.transform.rotation[2]==0&&
			zoffset==0&&curNode.fullName!=HalfMoon.UIRoot.fullName){// if in the same plane
			
				
				if(!curNode.parent)
					closestNod = offsetMethod(rootRay,curNode)==true?curNode:null;
				//if inside curNode
				else if(offsetMethod(curNode.parent._UIPointerCache.ray,curNode)){
						closestNod = curNode;
					
				}//end of if inside curNode
			
			
				
		}else{ //is not in the same plane
			 	
				if(!curNode.parent)
					closestNod = rayTraceMethod(rootRay,curNode)==true?curNode:null;
				//if inside curNode
				else if(rayTraceMethod(curNode.parent._UIPointerCache.ray,curNode)){
						closestNod = curNode;
					
				}//end of if inside curNode
			 
		 }//end of is not in the same plane
			
		if(closestNod==null)//ray hit the parent but not the children
			return curNode.parent;// parent would be the target
		else if(closestNod.lengthOfChildren()==0)//end of branches
			return curNode;//curNode is target
		else{
			if(!(self.findPanel&&closestNod instanceof UIPanel)){
		    	for(var i in closestNod.children)//find the target recursively
		    		if(closestNod.children[i].isActive){
		    			 result = this.findTarget(closestNod.children[i]);
		    			 if(result.fullName!=closestNod.fullName)
		    				 break;
//		    			 else
//		    					// if old child is closer then get the old one
//				    			// in curNode space
//		    				 result=getCloser2Cam(ray.intersection,ray.origin)?
//				    						closestNod:{node:curNode,ray:ray};
		    		}
			}else
				return closestNod;
		};

		return result;
	};
	
	function capture(event,node) {

    	
    	if(!event.capturing){
    		//console.log(event.target);
    		return;
    	}else if(node.lengthOfChildren()!=0)
	    	event.curTarget = node;
    		//call children
	    	for(var i in node.children){
	    		var child = node.children[i];
	    		if(child.isActive){
	    			//if(child.CheckInsideUIElement([event.mouseEvent.clientX,event.mouseEvent.clientY]))
	    				//[event+"Event"].publish(event);
	    			capture(event,child);
	    			//call capturing phase function
	    			child["capturePhaseEvents"].publish(event.type,event);
	    			
	    			//child.DispatchEvent(event);
	    		}
	    	}

    };
    function bubble(event,child) {
    	event.curTarget = child;
    	child["bubblePhaseEvents"].publish(event.type,event);
    	if(child.parent!=null&&
    			//escape UIMain since no handler for MainUI
    			child.parent.fullName!=HalfMoon.UIRoot.fullName&&
    			event.bubbling){
    		bubble(event,child.parent);
    	}

    };
	cls.prototype.Publish = function(event,node) {
		//event.InitEvent(evtStr,e);
    	if(!this.initialize(event))
    		return;
    	if(event.target==null)return;
    	
    	if(event.target.fullName==HalfMoon.UIRoot.fullName) return;//Can activate scene panel here
		capture(event,node);
		if(event.bubbling)
			bubble(event,event.target);
	};
	
	//Add draw rect for panel using html5 2d canvas
	
	cls.prototype.CreateEvent = function(evtStr,e){
		this.event.InitEvent(evtStr,e);
		return this.event;
	};
	 return cls;
})();
HalfMoon.UISysEvent = new UISysEvent();
