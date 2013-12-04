function BuildASFRecursively(joint, hierarchyObj, data, nameList){

	for(var i=0; i < hierarchyObj.children.length;i++){
		var childParams = GetJointParams((hierarchyObj.children[i]).name,data);
		var child = new Joint(childParams);

		joint.AddChild(child);
		nameList[child.name] = child.fullName;
		
		BuildASFRecursively(child, hierarchyObj.children[i], data,nameList);
	}
};

function GetJointParams(JointNm,data){
	var result;
	for(var i=0;i<data.length;i++){
		var entry =data[i];	

		//entry.name has \r in the end of the string
		//Fuck it is annoying
		if(entry.name.replace(/[\r]+/g,"")== JointNm){
		
			result =    {name: JointNm, 
						 position: [data[i]._length,0,0],
						 direction: data[i].direction,
						 axisOffset:[Math.degree2Radian(data[i].axis[0]),
						             Math.degree2Radian(data[i].axis[1]),
						             Math.degree2Radian(data[i].axis[2])],
						 _length:data[i]._length, 
						 rotOrder:data[i].axisRotOrder
						 };
		
			return result;
		}
	}
	return null;
};


function Amc2Frames(data){
	var frames = [];
	var pose;
	var dataLength = data.length;
	for(var i=0;i<dataLength;i++){
		
		if(data[i].jointName == "root"){
			if(i!=0)
				frames.push(pose);
			pose = {};
		};
		for(var element in data[i].dof)
			data[i].dof[element] = parseFloat(data[i].dof[element]);
		
		pose[data[i].jointName]=(data[i].dof);
		
		for(var dofNm in data[i].dof)
			if(dofNm=="rx"||dofNm=="ry"||dofNm=="rz")
				data[i].dof[dofNm] = Math.degree2Radian(data[i].dof[dofNm]);
		
		var rot = quat.create();
		var rx = data[i].dof.rx||0,
			ry = data[i].dof.ry||0,
			rz = data[i].dof.rz||0;
		
		
		quat.rot2Quat(rot,[rx,ry,rz]);
		pose[data[i].jointName].quat4 = rot;
	}
	
	return frames;
};

function Frames2Channels(frames){
	var framesLength = frames.length;
	var channels={};
	
	for(var frameIndex=0;frameIndex<framesLength;frameIndex++)
		for(var jointNm in frames[frameIndex]){
			if(!channels[jointNm])//create channels[jointNm]
				channels[jointNm] = {};
			
			for(var dofNm in frames[frameIndex][jointNm]){
				//if channels[jointNm][dof] doesnt exist we create one
				if(!channels[jointNm][dofNm]){
					channels[jointNm][dofNm]=[];
				}
				
				var value=frames[frameIndex][jointNm][dofNm];
				
				channels[jointNm][dofNm][frameIndex] = value;
			}
			
			
		}
	
	return channels;
};


///Convert ASF space animation into joint space
function ASFQuat2JointQuat(channels,nameList){
	
	for(var jointNm in channels){
		var jointData = channels[jointNm];
		var framesLength = jointData.quat4.length;
		for(var frameIndex=0;frameIndex<framesLength;frameIndex++){
				var asfQuat =  jointData.quat4[frameIndex];
				if(!asfQuat) continue;
				var joint = GetObjByFullNm(nameList[jointNm]);
				
				if(!joint.axisOffset) break;
				
				var asf2World = quat.create(),inv = quat.create();
				quat.rot2Quat(asf2World,joint.axisOffset);
				inv=quat.clone(asf2World);
				quat.conjugate(asf2World, asf2World);
				quat.mul(asfQuat, asfQuat, asf2World);
				quat.mul(asfQuat, inv, asfQuat);
				
				var world2Joint =quat.create();
				quat.setFromMat4(world2Joint,joint.rotInitMat);
				quat.conjugate(inv, world2Joint);
				quat.mul(asfQuat, asfQuat, world2Joint);
				quat.mul(asfQuat, inv, asfQuat);
				
				channels[jointNm]["quat4"][frameIndex] = asfQuat;
		}
	}
	
}