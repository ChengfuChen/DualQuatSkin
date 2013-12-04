var AsyncLoader = (function(){
	var workers = [],jobCollection = [],
	workerNm = "Loader",MAXCONCURRENT = 3;
	idleWorkerIndex = [];

	for(var i=0;i<MAXCONCURRENT;i++){
		var worker = new Worker("XHRLoader.js");
		worker.id = workerNm+i;
		workers.push(worker);
		idleWorkerIndex.push(i);
	}
	
	var cls = function(method,path, callBack){
		var self = this;

		this.doJob = function(job){
			if(idleWorkerIndex.length>0){
				var index = idleWorkerIndex.pop();
				workers[index].postMessage({
				      "jobID": job.id,
				      "workerIndex":index,
				      "method": job.method,
				      "path":job.path
			    });

				job.status = "processing";
			};
		};
		this.findJob = function(){
			for(var index in jobCollection)
				if(jobCollection[index].status=="pending")
					return jobCollection[index];
			
			return null;
		};
		for(var i in workers)
			workers[i].onmessage = function (event) {
		    	if (jobCollection[event.data.jobID]) { 
		    		jobCollection[event.data.jobID].
		    			callBack(event.data.jobID,workers[event.data.workerIndex]["id"],event.data.value); 
		    	}
		    	jobCollection[event.data.jobID].status = "done";
				idleWorkerIndex.push(event.data.workerIndex);
		    	var job = self.findJob();
		    	if(job)
		    		self.doJob(job);
			};
		
		var job={};
		job.id = jobCollection.length;
		job.status = "pending";
		job.method = method;job.path = path;job.callBack = callBack;
		jobCollection.push(job);
		var job = this.findJob();
    	if(job)
    		self.doJob(job);
	}
	return cls;
})();

//AsyncLoader = AsyncLoader;
HalfMoon.asyncLoader = AsyncLoader;





var Loader = (function(){
	var _scriptCounter = 0;
	var _maxscriptCount = 0;
	var _modelCounter = 0;
	var _maxModelCount = 0;
	


		
	var self;
	var cls = function(){
		self = this;
		
	};
	cls.prototype = {
		LoadJSON:function (path, callback) {
	        var request = new XMLHttpRequest();
	        request.open("GET", path);
	        request.onreadystatechange = function () {
	            if (request.readyState == 4) {
	            	callback(JSON.parse(request.responseText));
	            }
	        };
	        request.send();
	    },
		LoadScripts:function (path, callback) {
			_maxscriptCount++;
		    var request = new XMLHttpRequest();
		    request.open("GET", path);
		    request.onreadystatechange = function () {
		        if (request.readyState == 4) {
		        	_scriptCounter++;
		        	//console.log("loadScript:"+path);
		            callback(request.responseText);
		            if(_scriptCounter==_maxscriptCount)
		            	self.OnFinishLoadingScript();
		        }
		    };
		    request.send();
		},
		LoadModel:function (path, shape) {
			_maxModelCount++;
	    	var buffer = path.split('.');
	    	var mode = "";
	    	if(buffer[1]=="obj")
	    		mode = 'obj';
	    	else if(buffer[1]=="json")
	    		mode = 'json';
	    	else{
	    		throw "not supported";
	    		return;
	    	}
	        var request = new XMLHttpRequest();
	        request.open("GET", path);
	        request.onreadystatechange = function () {
	            if (request.readyState == 4) {
	            	_modelCounter++;
	            	shape.isLoaded = true;
	            	if(mode=='json')
	            		shape.load(JSON.parse(request.responseText));
	            	else if(mode=='obj')
	            		shape.load(LoadObj(request.responseText));
	            }
	        };
	        request.send();
	    },
		OnFinishLoadingScript:function(){
			
			
		}
		
			
	};
	
	return cls;
	
	
})();
//Loader = Loader;
HalfMoon.loader = new Loader();