document.addEventListener("DOMContentLoaded", function() {
	init();
});

function init() {
	document.getElementById('addLabel').addEventListener('click', addLabelClickCb);
}

function addLabelClickCb() {
	fadeOut(document.getElementsByClassName('labels')[0], function(){
		addLabel();
	});
}

function addLabel() {
	var addLabelForm = document.getElementsByClassName('addLabelForm')[0];
	addLabelForm.innerHTML = '';
	var addLabelHeading = createElem('div', {class: 'labelHeading'}, 'Add Label');
	addLabelForm.appendChild(addLabelHeading);
	/* Name */
	/*var field1 = createElem('div', {class: 'field'});
	var label1 = createElem('label', {for: 'labelName'}, 'Name');
	field1.appendChild(label1);
	var input1 = createElem('input', {type: 'text', name: 'labelName', id: 'labelName', value: '', autocomplete: 'off'});
	field1.appendChild(input1);
	addLabelForm.appendChild(field1);*/


	fadeOut(document.getElementsByClassName('labels')[0], function() {
		fadeIn(addLabelForm);
	});
}


/* Utility functions */
function createElem(elemStr, paramsObj, text) {
	if(_.isString(elemStr) && ! _.isEmpty(elemStr)) {
		var elem = document.createElement(elemStr);
		if(_.isObject(paramsObj) && _.size(paramsObj) > 0) {
			_.each(paramsObj, function(v, i) {
				elem.setAttribute(i, v);
			});
		}
		if(_.isString(text) && ! _.isEmpty(text)) {
			elem.innerText = text;
		}
		return elem;
	}
	return '';
}
function fadeOut(el, cb){
	el.style.opacity = 1;
	(function fade() {
		if ((el.style.opacity -= .1) < 0) {
			el.style.display = "none";
			if(cb && _.isFunction(cb)) {
				cb();
			}
		} else {
			requestAnimationFrame(fade);
		}
	})();
}

function fadeIn(el, display, cb){
	el.style.opacity = 0;

	(function fade() {
		var val = parseFloat(el.style.opacity);
		if (!((val += .1) > 1)) {
			el.style.opacity = val;
			requestAnimationFrame(fade);
		} else {
			el.style.display = display || "block";
			if(cb && _.isFunction(cb)) {
				cb();
			}
		}
	})();
}
