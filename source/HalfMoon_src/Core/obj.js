var Obj = (function(){
	
	var cls = function(name){
		this.name = name;
		this.name = CheckNm(HalfMoon.objs,this.name);
		HalfMoon.objs[this.name] = this;
		this.input=null;
		this.outputs=null;
		
	};
	cls.prototype.GetSibling = function(){
		if(this.parent==null)
			return HalfMoon.objs;
		
		return this.parent.children;
	};
	cls.prototype.Read = function(json){

	};
	cls.prototype.Write = function(json){

	};
	return cls;
})();

var HierachyObj = (function(){
	var cls = function(name){
		Obj.call(this,name);
		this.children = {};
		this.parent = null;
		this.fullName = this.name;
	};
	
	cls.prototype = Object.create(Obj.prototype);
	cls.prototype.constructor = cls;
	
	function getFullNameRecursive(out,curObj){
		if(curObj.parent != null){
			out.name = curObj.parent.name + '|' + out.name;
			getFullNameRecursive(out,curObj.parent);
		}
	};
	
	cls.prototype.isAncestorOf = function(obj){
//		var a = "MainUI|HTMLWindow",//this.fullName
//			b = "MainUI|HTMLWindow|panel";//obj.fullName
//		//Testing code "|" is or operator, use "\|" instead
//		var re = new RegExp("\\|", "g");
//		var c = a.replace(re,"\\|");
//			d = b.replace(re,"\\|");
//			
//		var matcher;
//		eval("matcher=/"+d+"/");
//		var result = a.match(matcher);//==null a.match b
//		
//		eval("matcher=/"+c+"/");
//		result = b.match(matcher);//!=null b.match a
		
		var re = new RegExp("\\|", "g");
		var c = this.fullName.replace(re,"\\|");
		var matcher;
		eval("matcher=/"+c+"/");
		var result = obj.fullName.match(matcher)!=null?true:false;//!=null b.match a
		return result;
	};
	cls.prototype.lengthOfChildren = function(){
		
		var size = 0, key;
	    for (key in this.children) {
	        if (this.children.hasOwnProperty(key)) size++;
	    }
	    return size;
	};
	cls.prototype.SetFullNameRecursive = function(node){
		var result = {name:node.name};
		getFullNameRecursive(result,node);
		node.fullName = result.name;
		
		for(var i in node.children)
			this.SetFullNameRecursive(node.children[i]);
	};
	cls.prototype.SetParent = function(parent){
		
		if(parent != null)
			if(HalfMoon.objs[this.name])
				delete HalfMoon.objs[this.name];
		else
			if(parent.children[this.name])
				delete parent.children[this.name];
		
		
		this.parent = parent;
		if(parent == null){
			this.name = CheckNm(HalfMoon.objs,this.name);
			HalfMoon.objs[this.name] = this;
		}else{
			this.name = CheckNm(this.GetSibling(),this.name);
			parent.children[this.name] = this;
			this.SetFullNameRecursive(this);
		}
		
		HalfMoon.SysEvent.Publish("ChildrenChanged:",{parent:this.parent,child:this});
	};
	cls.prototype.AddChild = function(child){

		child.name = CheckNm(this.children,child.name);
		
		this.children[child.name] = child;
		child.parent = this;
		
		child.SetFullNameRecursive(child);
		
		
		HalfMoon.SysEvent.Publish("ChildrenChanged:",{parent:this,child:child});
	};
	cls.prototype.Delete = function(){
		
		this.children={};
		
		if(this.parent)
			for(var i in this.parent.children)
				if(this.parent.children[i]==this)
					delete this.parent.children[i];
		else
			for(var i in HalfMoon.objs)
				if(HalfMoon.objs[i]==this)
					delete HalfMoon.objs[i];
	};
	return cls;	
})();

var HierachyDrawableObj = (function(){
	var cls = function(name){
		HierachyObj.call(this,name);
		this.isDrawable = true;
		//deprecated
		this.parentMat = mat4.create();
		
	};
	cls.prototype = Object.create(HierachyObj.prototype);
	cls.prototype.constructor = cls;
	cls.prototype.draw = function(renderer){
		
		for(var i in this.children)
			//if(this.children[i].isDrawable)
				this.children[i].draw(renderer);
	};
	return cls;
})();
