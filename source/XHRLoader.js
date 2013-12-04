
var request = new XMLHttpRequest();

self.addEventListener('message', function(event) {
	request.open(event.data.method,event.data.path);
	request.onreadystatechange = function(){
		if(request.readyState == 4){
			postMessage({
				"jobID": event.data.jobID,
				"value": request.responseText,
				"workerIndex":event.data.workerIndex
			});
		}
	};
	request.send();
},false);