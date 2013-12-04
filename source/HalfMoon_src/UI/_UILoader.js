var UILoader = (function(){
    var UIloader= function(){};
    UIloader.prototype.load = function (path, callback) {
        var request = new XMLHttpRequest();
        request.open("GET", path);
        request.onreadystatechange = function () {
            if (request.readyState == 4) {
            	callback(request.responseText);
            }
        };
        request.send();
    }; 
    return UIloader;
})();