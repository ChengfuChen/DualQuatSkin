var DataManager = (function(){
	var _dataCollection = {},_pos=vec3.create(),_mat=mat4.create();
	var cls = function(){
		
		function updateHierachyTrans(node){
			
			node.transform.globalMatrix;
			node.transform.worldMatrix;
			
			for(var i in node.children){
				var child = node.children[i];
				mat4.multiply(child.transform.globalMatrix,
							node.transform.globalMatrix,
							child.transform.worldMatrix);
				updateHierachyTrans(child);
			}
			
		};

		function updateUITrans(node){
			
			node.transform.globalMatrix;
			node.transform.worldMatrix;
			
			for(var i in node.children){
				var child = node.children[i];
				if(child.scalable===true)
					mat4.multiply(child.transform.globalMatrix,
							node.transform.globalMatrix,
							child.transform.worldMatrix);
				else{
					//mat4.identity(_mat);
					mat4.extractScale(_mat,node.transform.globalMatrix);
					mat4.multiply(child.transform.globalMatrix,
							_mat,
							child.transform.worldMatrix);
				}
				updateUITrans(child);
			}
			
		};
		
		this.OnDataChange = function(trans,channelNm,fncCallBack){
			if(!_dataCollection[trans.name])
				_dataCollection[trans.name] = [];
			var entry = {};
			entry.obj = trans; 
			entry.channelNm = channelNm;
			entry.fncCallBack = fncCallBack;
			
			_dataCollection[trans.name].push(entry);

			HalfMoon.SysEvent.Publish("DataChanged:",entry);
		};
		
		this.ManuallyUpdate = function(trans){
			if(_dataCollection[trans.name]){
				_dataCollection[trans.name][0].obj.Update();
				delete _dataCollection[trans.name];
			}
		}
		
		
		this.Update = function(){
			
			
		};
		this.draw = function(){
			var collection=[];// for collecting obj needed for hierachy update
			for(var i in _dataCollection){
				var trans = _dataCollection[i][0].obj;
				trans.Update();//update trans world matrix
				if(trans.input&&
					trans.input instanceof HierachyObj){
					
					if(trans.input.parent){
						mat4.multiply(trans.globalMatrix,//update trans globalmatrix
								trans.input.parent.transform.globalMatrix,
								trans.worldMatrix);
					}else{
						mat4.copy(trans.globalMatrix,trans.worldMatrix);
					}
					
					collection.push(trans.input);
				}
			}
			_dataCollection = {};
			
			if(collection.length==0) return;
			
			for(var i = 0; i<collection.length;i++){
				for(var j = 0; j<collection.length;j++){
					if(i===j) continue;
					if(collection[j].isAncestorOf(collection[i]))//delete child
						collection.splice(i,1);
				}
			}
			for(var i = 0; i<collection.length;i++)
				if(collection[i].type==="UI")
					updateUITrans(collection[i]);
				else
					updateHierachyTrans(collection[i]);
			
		};
		
	};
	
	return cls;
})();
//DataManager = DataManager;