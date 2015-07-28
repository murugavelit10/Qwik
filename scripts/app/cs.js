document.addEventListener("DOMContentLoaded", function() {
	console.log('content script called!! ', new Date());
	chrome.storage.sync.get('qwikAppData', function(data) {
		console.log('current data: ', data);
	});
});
