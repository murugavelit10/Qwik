var getLocation = function(href) {
	var l = document.createElement("a");
	l.href = href;
	return l;
};
var needRedirect = false;
var qwikApp = {
	selectedLabel: {},
	selectedLabelDetail: {},
	tabDetail: {}
};
chrome.storage.local.get('qwikAppTabRedirect', function(data) {
	needRedirect = _.has(data, 'qwikAppTabRedirect') ? data.qwikAppTabRedirect : false;
	if(needRedirect) {
		chrome.storage.local.get('qwikAppSelectedLabel', function(data) {
			qwikApp.selectedLabel = _.has(data, 'qwikAppSelectedLabel') ? JSON.parse(data.qwikAppSelectedLabel) : {};
			chrome.storage.local.get('qwikAppSelectedLabelDetail', function(data) {
				qwikApp.selectedLabelDetail = _.has(data, 'qwikAppSelectedLabelDetail') ? JSON.parse(data.qwikAppSelectedLabelDetail) : {};
				if( ! _.isEmpty(qwikApp.selectedLabelDetail.redirectUrl)) {
					if(confirm('Do you want to redirect to ' + qwikApp.selectedLabelDetail.redirectUrl + '?')) {
						chrome.storage.local.remove(['qwikAppSelectedLabel', 'qwikAppSelectedLabelDetail', 'qwikAppTab', 'qwikAppTabAuth', 'qwikAppTabRedirect']);
						window.location.href = qwikApp.selectedLabelDetail.redirectUrl;
					}
				}
			});
		});
	}
});
document.addEventListener("DOMContentLoaded", function() {
	chrome.storage.local.get('qwikAppSelectedLabel', function(data) {
		qwikApp.selectedLabel = _.has(data, 'qwikAppSelectedLabel') ? JSON.parse(data.qwikAppSelectedLabel) : {};
		chrome.storage.local.get('qwikAppSelectedLabelDetail', function(data) {
			qwikApp.selectedLabelDetail = _.has(data, 'qwikAppSelectedLabelDetail') ? JSON.parse(data.qwikAppSelectedLabelDetail) : {};
			chrome.storage.local.get('qwikAppTab', function(data) {
				qwikApp.tabDetail = _.has(data, 'qwikAppTab') ? JSON.parse(data.qwikAppTab) : {};
				if(_.size(qwikApp.selectedLabel) > 0 && _.size(qwikApp.selectedLabelDetail) > 0/* && _.size(qwikApp.tabDetail) > 0*/) {
					var currLoc = window.location, chkLoc = getLocation(qwikApp.selectedLabelDetail.url);
					if(currLoc.origin === chkLoc.origin && currLoc.pathname === chkLoc.pathname) {
						chrome.storage.local.set({'qwikAppTabAuth': false});
						if( ! _.isEmpty(qwikApp.selectedLabelDetail.redirectUrl)) {
							chrome.storage.local.set({'qwikAppTabRedirect': false});
						}
						var needToBeSubmitted = false, submitSelector = null, isForm = null;
						_.every(qwikApp.selectedLabelDetail.inputs, function(input, i){
							if( ! _.isEmpty(input.selector) && _.size($(input.selector)) > 0) {
								if(submitSelector === null){
									needToBeSubmitted = true;
									var hasForm = $(input.selector).parents('form');
									if(_.size(hasForm) > 0) {
										submitSelector = $(hasForm);
										isForm = true;
									} else {
										// TODO
										// handle form submit if form not available
									}

								}
								if(input.type === 'radio' || input.type === 'checkbox') {
									$(input.selector).attr('checked', input.value);
								} else {
									$(input.selector).val(input.value);
								}
							} else {
								chrome.storage.local.get('qwikAppTabRedirect', function(data) {
									needRedirect = _.has(data, 'qwikAppTabRedirect') ? data.qwikAppTabRedirect : false;
								});
								return false;
							}
							return true;
						});
						if(needToBeSubmitted) {
							console.log('form needs to be submitted');
							console.log('submitSelector: ', submitSelector);
							console.log('isForm: ', isForm);
							if(isForm){
								chrome.storage.local.set({'qwikAppTabAuth': true});
								if( ! _.isEmpty(qwikApp.selectedLabelDetail.redirectUrl)) {
									chrome.storage.local.set({'qwikAppTabRedirect': true});
								}
								var submitBtn = $(submitSelector).find('[type=submit]');
								if(submitBtn) {
									submitBtn.trigger('click');
								} else {
									$(submitSelector).submit();
								}
							}
						}
					}
				}
			});
		});
	});

});
