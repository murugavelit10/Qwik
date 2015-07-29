document.addEventListener("DOMContentLoaded", function() {
	var qwikApp = {
		selectedLabel: {},
		selectedLabelDetail: {},
		tabDetail: {}
	};
	chrome.storage.local.get('qwkiAppSelectedLabel', function(data) {
		qwikApp.selectedLabel = data;
	});
	chrome.storage.local.get('qwkiAppSelectedLabelDetail', function(data) {
		qwikApp.selectedLabelDetail = data;
	});
	chrome.storage.local.get('qwikAppTab', function(data) {
		qwikApp.tabDetail = data;
	});
	if(_.size(qwikApp.selectedLabel) > 0 && _.size(qwikApp.selectedLabelDetail) > 0 && _.size(qwikApp.tabDetail) > 0) {
		var docURL = document.URL;
		if(docURL === qwikApp.selectedLabelDetail.url) {
			var needToBeSubmitted = false;
			_.each(qwikApp.selectedLabelDetail.inputs, function(input, i){
				if( ! _.isEmpty(input.selector) && _.size($(input.selector)) > 0) {
					needToBeSubmitted = true;
					if(input.type === 'radio' || input.type === 'checkbox') {
						$(input.selector).attr('checked', input.value);
					} else {
						$(input.selector).val(input.value);
					}
				}
			});
			if(needToBeSubmitted) {
				console.log('form needs to be submitted');
			}
		}
	}
});
