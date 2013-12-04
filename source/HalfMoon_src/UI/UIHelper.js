var UIDRAGSTATE = {
		DragStart:"DragStart",
		DragOver:"DragOver",
		DragEnd:"DragEnd",
		Sleep:"Sleeping"
};

var UIOBJSTATE = {
		RollIn:"roll in",
		RollOut:"roll out"
};

var PANELSTATE = {
		Sleep : "Sleep",
		Drag: "Dragging",
        Moving: "Moving",
        Active:"Active",
        Hide:"Hide"
};


var UIELEMENTSTATE = {
	Video:"video",	HTML:"html",Texture2D:"2dTex",Obj3D:"3dObj"
};

var UIELEMENT_INITIALSTATE = {
	    LOADING : "in loading without intialize function",
	    INITIAL : "initialize once",
	    ALWAYS : "keep initial function run for every draw circle"
	};
//
//function Screen2World(out,screenPos){
//	
//	var cam = HalfMoon.UIRoot.uiCam;
//	//out.point[0] = (screenPos[0]-HalfMoon.UIRoot.width/2);
//	//out.point[1] = -(screenPos[1]-HalfMoon.UIRoot.height/2);
//	cam.GetRay(screenPos[0],screenPos[1],out.point,out.direction);
//		
//};
//
//function World2Screen(out,worldPos,isPersp){
//	if(!isPersp){
//		out[0] = (worldPos[0]+HalfMoon.UIRoot.width/2);
//		out[1] = -worldPos[1]+HalfMoon.UIRoot.height/2;
//	}
//};


//preparing cam position
function GetPerspUICamPos(cam,camZ){
	var result =vec3.create();
	var deltaY = Math.tan(cam.fov*0.5)*camZ;
	var deltaX = cam.aspectRatio*deltaY;
	vec3.set(result,deltaX,-deltaY,camZ);
	return result;
};

function GetOffsetXYWithPersp(cam,objDepth){
	var result =vec3.create();
	var deltaY = Math.tan(cam.fov*0.5)*camZ;
	var deltaX = cam.aspectRatio*deltaY;
	vec3.set(result,deltaX,-deltaY,camZ);
	return result;
};


function UpdateLayout(node){
	
	if(node.layout){//window has layout, panel doesnt
		node.layout.Update();
		SetParentOffset([node.layout.w0dist,node.layout.h0dist],node.transform);
		if(node.scalable&&node.layout.scalable)
			node.SetScale(node.layout.scale);

		if(node instanceof UIWindow&&node.scalable&&node.layout.scalable){
			node.Resize(node.width,node.height);
			node.Update(node.titleWidth,node.titleHeight);
			node.panel.Update(node.panelWidth,node.panelHeight);
		}
		//else
			//node.Update(node.width,node.height);
	}
	for(var i in node.children)
		UpdateLayout(node.children[i]);
}

var cx=10,cy=10,degStart=0,deltaCenter=20,colDelta = 1/360.0,txt=90;
var waitingCirclingHTML = function(canvas,ctx){
	
	function clear() {
	    ctx.save();
	    
	    ctx.setTransform(1, 0, 0, 1, 0, 0);
	    ctx.clearRect(0, 0, canvas.width, canvas.height);
	    
	    ctx.restore();
	}
	function drawCircle(deg,deltaCenter,cx,cy,w,h) {   
	    ctx.save();
	    
	    //ctx.translate(cx, cy); // pivot point
	    ctx.rotate(deg * Math.PI/180); // rotate square in radians
	    ctx.translate(deltaCenter, -h*0.5); // pivot point
	    ctx.fillStyle="rgba(255, 255, 255,"+
	    					0.5*(Math.sin(0.01*deg)+1).toString()+");";
	    ctx.fillRect(0, 0, w, h);
	    
	    ctx.restore();
	}
	//clear();
	//canvas.width = 100;
	//canvas.height= 100;

	ctx.font = 'normal 30px sans-serif';
	ctx.fillStyle = "white";
	ctx.fillText(txt.toString(), 23, 50);
	ctx.translate(40, 40); 
	degStart += 10*(HalfMoon.time.elapsedTime);
	var delta = 360/16.0;
    for(var i=0;i<16;i++){
        var deg =degStart+ i*delta;
        drawCircle(deg,deltaCenter,cx,cy,20,4);
    }
};

//Calculate Offset in 2d screen
function SetParentOffset(offset,transform){
//	var _pos = vec3.create(),result = vec3.create(),
//		cam = HalfMoon.UIRoot.uiCam,t=0,
//		height = HalfMoon.UIRoot.height,
//		width = HalfMoon.UIRoot.width;
	if(!transform.input.offset)
		vec3.set(transform.position,0,0,0);
	else
		vec3.set(transform.position,-transform.input.offset[0],
									-transform.input.offset[1],0);

		
	var deltaMove = vec3.create();

	deltaMove[0] = offset[0];
	deltaMove[1] = -offset[1];
		
	transform.Move(deltaMove);
}
////Calculate Offset in 2d screen obsoleted, following code projecting pixel offset to 
////3D movement
//function SetParentOffset(offset,transform){
//	var _pos = vec3.create(),result = vec3.create(),
//		cam = HalfMoon.UIRoot.uiCam,t=0,
//		height = HalfMoon.UIRoot.height,
//		width = HalfMoon.UIRoot.width;
//	if(!transform.input.offset)
//		vec3.set(transform.position,0,0,0);
//	else
//		vec3.set(transform.position,-transform.input.offset[0],
//									-transform.input.offset[1],0);
//	//A.projecting parent pos on screen
//		//1.Get parent origin in world space
//		if(transform.input.parent)
//			vec3.transformMat4(_pos,transform.position, 
//				transform.input.parent.transform.globalMatrix);
//		//2. Trans into view space
//		vec3.transformMat4(_pos, _pos,cam.GetViewMatrix());
//		//3. Get Ray origin =Zero;
//		vec3.normalize(result,_pos);
//		//4. Projection
//		//Ray: P = origin + t*dir;
//		//Plane: P * N + d = 0; //d is distance from world zero
//		//Solution: t = -(origin*N+d)/(dir*N); // in eye space d>0 for this case d=-pos[2]
//		//P = origin + t*dir;
//		t = _pos[2]/vec3.dot(result,[0,0,1]);
//		vec3.scale(result,result,t);//P = result
//	
//	//B.Get deltaMove by projecting deltaXY onto the plane in parent space
//		var deltaMove = vec3.create();//Taking that plane as resolution plane
//		//Get normalX and normalY by dividing with resolution
//		offset[0] *= 1/width;offset[1] *= 1/height;
//		//t = -_pos[2]*Math.tan(cam.fov*0.5);// y=t=d*tan(fov*0.5)=d since tan45=1;
//		t = -_pos[2]*2;
//		deltaMove[1] = offset[1]*t;//=normalY*y;
//		deltaMove[0] = offset[0]*(width/height)*t;//=normalX*aspectRatio*y;
//		
//	//vec3.sub(deltaMove,deltaMove,transform.position);
//	//return result;
//	transform.Move(deltaMove);
//	//console.log(transform.position);
//}

function SetScreenTranslate(screenPos,transform,constrainX,constrainY){
	var out={origin:[0,0,0],direction:[0,0,1]},
		_pos = vec3.create();
		deltaMove = vec3.create();
	//Screen2World(this.worldPos,screenPos);

	var cam = HalfMoon.UIRoot.uiCam;
	


	cam.GetRay(screenPos[0],screenPos[1],out.origin,out.direction,true);
	
	//1.Transform into eye space
	if(transform.input.parent)
		vec3.transformMat4(_pos, transform.position, 
				transform.input.parent.transform.globalMatrix);
		
	vec3.transformMat4(_pos, _pos,cam.GetViewMatrix());
	
	//2.Calculate deltaMove in eye space
	
		//Ray: P = origin + t*dir;
		//Plane: P * N + d = 0; //d is distance from world zero
		//Solution: t = -(origin*N+d)/(dir*N); // in eye space d>0 for this case d=-pos[2]
		//P = origin + t*dir;
	var t=0;
	t = (-vec3.dot(out.origin,[0,0,1])+_pos[2])/vec3.dot(out.direction,[0,0,1]);
	vec3.scale(deltaMove,out.direction,t);
	vec3.add(deltaMove,deltaMove,out.origin);
		//deltaMove = finalPos - originPos
	vec3.sub(deltaMove, deltaMove, _pos);
	
	//3.transforming deltaMove into worldSpace
	vec3.transformMat4(deltaMove, deltaMove,cam.transform.GetRotationMatrix());
	
	if(constrainX) deltaMove[0]=0;
	if(constrainY) deltaMove[1]=0;
	transform.Move(deltaMove);
	transform.input.offsetPos = vec3.clone(transform.position);
};