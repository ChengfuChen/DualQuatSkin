var UILayout = (function(){
	var UILayout = function(node,w0,h0,w1,h1){
		this.w0 = w0;this.w1 = w1;this.w2 = 1-this.w0-this.w1;
		this.h0 = h0;this.h1 = h1;this.h2 = 1-this.h1-this.h0;
		this.name = node.fullName;
		this.scalable = w1?true:false;
		this.Update =function(){
			//Dimension in Pixel
			this.w0dist = node.parent.width*this.w0;
			this.h0dist = node.parent.height*this.h0;
			if(this.scalable){
				this.w1dist = node.parent.width*this.w1;
				this.h1dist = node.parent.height*this.h1;
				
				this.scale = [this.w1dist/node.initialWidth,this.h1dist/node.initialHeight];
			}
			this.origin = [node.parent.transform.position[0]+this.w0dist,
			               node.parent.transform.position[1]+this.h0dist];
			
		};
		this.Update();
		
	};
	
	return UILayout;
	
})();