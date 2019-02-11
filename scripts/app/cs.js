var getLocation = function(href) {
	var l = document.createElement("a");
	l.href = href;
	return l;
};
var cleanValues = function() {
	chrome.storage.local.remove(['qwikAppSelectedLabel', 'qwikAppSelectedLabelDetail', 'qwikAppTab', 'qwikAppTabAuth', 'qwikAppTabRedirect']);
};
var needRedirect = false;
var qwikApp = {
	selectedLabel: {},
	selectedLabelDetail: {},
	tabDetail: {}
};
var dataCount = 0;
chrome.storage.local.get('qwikAppSelectedLabel', function(data) {
	dataCount++;
	qwikApp.selectedLabel = _.has(data, 'qwikAppSelectedLabel') ? JSON.parse(data.qwikAppSelectedLabel) : {};
});
chrome.storage.local.get('qwikAppSelectedLabelDetail', function(data) {
	dataCount++;
	qwikApp.selectedLabelDetail = _.has(data, 'qwikAppSelectedLabelDetail') ? JSON.parse(data.qwikAppSelectedLabelDetail) : {};
});
chrome.storage.local.get('qwikAppTab', function(data) {
	dataCount++;
	qwikApp.tabDetail = _.has(data, 'qwikAppTab') ? JSON.parse(data.qwikAppTab) : {};
});
var doRedirect = function() {
	if(_.has(qwikApp.selectedLabelDetail, 'redirectUrl') && ! _.isEmpty(qwikApp.selectedLabelDetail.redirectUrl)) {
		cleanValues();
		if(confirm('Do you want to redirect to "' + qwikApp.selectedLabelDetail.redirectUrl + '"?')) {
			window.location.href = qwikApp.selectedLabelDetail.redirectUrl;
		}
	}
};
chrome.storage.local.get('qwikAppTabRedirect', function(data) {
	needRedirect = _.has(data, 'qwikAppTabRedirect') ? data.qwikAppTabRedirect : false;
	if(needRedirect) {
		doRedirect();
	}
});
var t;
document.addEventListener("DOMContentLoaded", function() {
	t = setTimeout(checkDataLoad, 1000);
});
function checkDataLoad() {
	if(dataCount < 3) return false;
	clearTimeout(t);
	dataCount = 0;
	if(_.size(qwikApp.selectedLabel) > 0 && _.size(qwikApp.selectedLabelDetail) > 0/* && _.size(qwikApp.tabDetail) > 0*/) {
		var currLoc = window.location, chkLoc = getLocation(qwikApp.selectedLabelDetail.url);
		if(currLoc.origin === chkLoc.origin && currLoc.pathname === chkLoc.pathname) {
			chrome.storage.local.set({'qwikAppTabAuth': false});
			// init qwikAppTabRedirect to false
			chrome.storage.local.set({'qwikAppTabRedirect': false});
			var needToBeSubmitted = false, submitSelector = null, submitBtnSelector = null, isForm = null;
			_.every(qwikApp.selectedLabelDetail.inputs, function(input, i){
				if( ! _.isEmpty(input.selector) && _.size($(input.selector)) > 0) {
					if(submitSelector === null && isForm === null){
						needToBeSubmitted = true;
						var hasForm = $(input.selector).parents('form');
						if(_.size(hasForm) > 0) {
							submitSelector = $(hasForm);
							isForm = true;
						} else {
							// TODO
							// handle form submit if form not available
							isForm = false;
						}

					}
					if(input.type === 'submit') {
						submitBtnSelector = $(input.selector)
					} else if(input.type === 'radio' || input.type === 'checkbox') {
						$(input.selector).attr('checked', input.value);
					} else {
						$(input.selector).val(input.value);
					}
				} else {
					chrome.storage.local.get('qwikAppTabRedirect', function(data) {
						needRedirect = _.has(data, 'qwikAppTabRedirect') ? data.qwikAppTabRedirect : false;
						if(needRedirect) {
							doRedirect();
						}
					});
					return false;
				}
				return true;
			});
			if(needToBeSubmitted) {
				var isRedirectEnabled = false;
				chrome.storage.local.set({'qwikAppTabAuth': true});
				if(_.has(qwikApp.selectedLabelDetail, 'redirectUrl') && ! _.isEmpty(qwikApp.selectedLabelDetail.redirectUrl)) {
					isRedirectEnabled = true
					chrome.storage.local.set({'qwikAppTabRedirect': true});
				}
				if(isForm){
					if(submitBtnSelector) {
						if(!isRedirectEnabled) {
							cleanValues();
						}
						submitBtnSelector.trigger('click');
					} else {
						var submitBtn = $(submitSelector).find('[type=submit]');
						if(submitBtn.length > 0) {
							if(!isRedirectEnabled) {
								cleanValues();
							}
							submitBtn.trigger('click');
						} else {
							if(!isRedirectEnabled) {
								cleanValues();
							}
							$(submitSelector).submit();
						}
					}
				} else {
					// TODO
					// handle the form submission when there is no form element present
					if(submitBtnSelector) {
						if(!isRedirectEnabled) {
							cleanValues();
						}
						submitBtnSelector.trigger('click');
					} else {
						console.log('Not able to submit form due to not configuring submit button!')
					}
				}
			} else {
				if(_.has(qwikApp.selectedLabelDetail, 'redirectUrl') && ! _.isEmpty(qwikApp.selectedLabelDetail.redirectUrl)) {
					// commenting out below statement as it looks like not required
					// chrome.storage.local.set({'qwikAppTabRedirect': true});
					// form no need to be submitted
					// then try to redirect if redirect url is present
					doRedirect();
				} else {
					chrome.storage.local.set({'qwikAppTabRedirect': false});
				}
			}
		}
	}
}
