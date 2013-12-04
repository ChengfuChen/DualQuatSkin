//var _eventManager = new Event();
//var _sysEventManager = new SysEvent();
//_eventManager.subscribe("CanvasResize:", function(value) {
//	for(var i=0;i<HalfMoon.renderer.length;i++)
//		HalfMoon.renderer[i].Resize(value[0],value[1]);
	
//});

//_eventManager.subscribe("CanvasResize:", function(value) {
	
//	for(var i=0;i<HalfMoon.cams.length;i++)
//		HalfMoon.cams[i].Resize(value[0],value[1]);
//});

//_eventManager.subscribe("TimeChanged:", function(value) {
//	for(var i=0;i<HalfMoon.cams.length;i++)
//		HalfMoon.cams[i].Resize(value[0],value[1]);
//});

//var _uiSysEventManager = new UISysEvent();

HalfMoon.SysEvent = new SysEvent();
//HalfMoon.UserEvent = _eventManager;
HalfMoon.UISysEvent = new UISysEvent();
