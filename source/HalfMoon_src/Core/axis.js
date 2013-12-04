var Axis = (function () {

    var cls = function () {
    	
//
//		HalfMoon.drawableObj.push(this);
//		this.isDrawable = true;
		
        this.materialX = HalfMoon.materials["debug"].clone();
        this.materialY = HalfMoon.materials["debug"].clone();
        this.materialZ = HalfMoon.materials["debug"].clone();
        

		this.materialX.uniforms["uColor"].value=[1,0,0];
		this.materialY.uniforms["uColor"].value=[0,1,0];
		this.materialZ.uniforms["uColor"].value=[0,0,1];
        
        this.transform = new Transform("AxisTransform");
        this.shapeXAsis = new Shape("AxisXShape");
        this.shapeYAsis = new Shape("AxisYShape");
        this.shapeZAsis = new Shape("AxisZShape");
        var dataX,dataY,dataZ;
        dataX={};dataY={};dataZ={};
        dataX.vertice =  [// x
                          0.0, 0.0, 0.0,
                          1.0, 0.0, 0.0
                         ];
        dataY.vertice =  [// y
                          0.0, 0.0, 0.0,
                          0.0, 1.0, 0.0,
                         ];
        dataZ.vertice =  [// z
                          0.0, 0.0, 0.0,
                          0.0, 0.0, 1.0,
                         ];
        this.shapeXAsis.load(dataX);
        this.shapeYAsis.load(dataY);
        this.shapeZAsis.load(dataZ);

        this.shapeXAsis.shapeRenderState = this.shapeXAsis.RENDERSTATE.Lines;
        this.shapeYAsis.shapeRenderState = this.shapeYAsis.RENDERSTATE.Lines;
        this.shapeZAsis.shapeRenderState = this.shapeZAsis.RENDERSTATE.Lines;

        this.draw = function (renderer) {
        	var graphic = renderer.graphic;
			
        	this.materialX.draw(graphic);
			this.transform.draw(graphic,this.materialX,renderer.cam);
			this.shapeXAsis.draw(graphic,this.materialX);
			

        	this.materialY.draw(graphic);
			this.transform.draw(graphic,this.materialY,renderer.cam);
			this.shapeYAsis.draw(graphic,this.materialY);
			

        	this.materialZ.draw(graphic);
			this.transform.draw(graphic,this.materialZ,renderer.cam);
			this.shapeZAsis.draw(graphic,this.materialZ);
        };
        
    };
   



    return cls;
})();