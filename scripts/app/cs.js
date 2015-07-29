document.addEventListener("DOMContentLoaded", function() {
	var qwikApp = {
		selectedLabel: {},
		selectedLabelDetail: {},
		tabDetail: {}
	};
	chrome.storage.local.get('qwikAppSelectedLabel', function(data) {
		qwikApp.selectedLabel = _.has(data, 'qwikAppSelectedLabel') ? JSON.parse(data.qwikAppSelectedLabel) : {};
		chrome.storage.local.get('qwikAppSelectedLabelDetail', function(data) {
			qwikApp.selectedLabelDetail = _.has(data, 'qwikAppSelectedLabelDetail') ? JSON.parse(data.qwikAppSelectedLabelDetail) : {};
			chrome.storage.local.get('qwikAppTab', function(data) {
				qwikApp.tabDetail = _.has(data, 'qwikAppTab') ? JSON.parse(data.qwikAppTab) : {};
				if(_.size(qwikApp.selectedLabel) > 0 && _.size(qwikApp.selectedLabelDetail) > 0 && _.size(qwikApp.tabDetail) > 0) {
					if(window.location.href === qwikApp.selectedLabelDetail.url) {
						var needToBeSubmitted = false, submitSelector = null, isForm = null;
						_.each(qwikApp.selectedLabelDetail.inputs, function(input, i){
							if( ! _.isEmpty(input.selector) && _.size($(input.selector)) > 0) {
								needToBeSubmitted = true;
								if(submitSelector === null){
									var hasForm = $(input.selector).parents('form');
									if(_.size(hasForm) > 0) {
										submitSelector = $(hasForm);
										isForm = true;
									} else {

									}

								}
								if(input.type === 'radio' || input.type === 'checkbox') {
									$(input.selector).attr('checked', input.value);
								} else {
									$(input.selector).val(input.value);
								}
							}
						});
						if(needToBeSubmitted) {
							console.log('form needs to be submitted');
							console.log('submitSelector: ', submitSelector);
							console.log('isForm: ', isForm);
							if(isForm){
								chrome.storage.local.set({'qwikAppNextProcess': ''});
								$(submitSelector).submit();
							}
						}
					}
				}
			});
		});
	});

});
