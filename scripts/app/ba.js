(function ($) {
	qwikApp = {
		getLabels: function () {

		},
		addLabel: function () {
			var addLabelForm = $('.addLabelForm');
			/* clean div content before appding elements */
			addLabelForm.html('');
			var addLabelHeading = this.creatElement('div', {class: 'labelHeading'}, 'Add Label');
			addLabelForm.append(addLabelHeading);
			/* Name */
			var field1 = this.creatElement('div', {class: 'field'});
			var label1 = this.creatElement('label', {for: 'labelName'}, 'Name');
			var input1 = this.creatElement('input', {type: 'text', name: 'labelName', id: 'labelName', value: '', autocomplete: 'off'});
			field1.append(label1, input1);
			/* Is Visible */
			var field2 = this.creatElement('div', {class: 'field'});
			var label2 = this.creatElement('label', {for: 'labelIsVisible'}, 'Is Visible');
			var input2 = this.creatElement('input', {type: 'checkbox', name: 'labelIsVisible', id: 'labelIsVisible'});
			field2.append(label2, input2);
			/* Is Disabled */
			var field3 = this.creatElement('div', {class: 'field'});
			var label3 = this.creatElement('label', {for: 'labelIsDisabled'}, 'Is Disabled');
			var input3 = this.creatElement('input', {type: 'checkbox', name: 'labelIsDisabled', id: 'labelIsDisabled'});
			field3.append(label3, input3);
			/* Position */
			var field4 = this.creatElement('div', {class: 'field'});
			var label4 = this.creatElement('label', {for: 'labelPosition'}, 'Position');
			var input4 = this.creatElement('input', {type: 'text', name: 'labelPosition', id: 'labelPosition', value: '', autocomplete: 'off'});
			field4.append(label4, input4);
			/* action buttons */
			var field5 = this.creatElement('div', {class: 'field'});
			var save = this.creatElement('button', {name: 'addLabelSave', 'id': 'addLabelSave', class: 'fl btn success'}, 'Save');
			var cancel = this.creatElement('button', {name: 'addLabelCancel', 'id': 'addLabelCancel', class: 'fl btn error', style: 'margin-left:10px'}, 'Cancel');
			field5.append(save, cancel, this.creatElement('div', {class: 'clearfix'}));
			addLabelForm.append(field1, field2, field3, field4, field5);
			$('.addLabelForm').fadeIn();
			this.attachAddLabelActionButtonEvents();
		},
		attachAddLabelActionButtonEvents: function() {
			$('.addLabelForm').find('#addLabelSave').on('click', function() {
				alert('add label save clicked!');
			});
			$('.addLabelForm').find('#addLabelCancel').on('click', _.bind(function() {
				$('.addLabelForm').fadeOut(function() {
					$('.labels').fadeIn();
				});
			}, this));
		},
		editLabel: function (lId) {

		},
		getLabelDetail: function (lId) {

		},
		addLabelDetail: function (lId) {
			var addLabelDetailForm = $('.addLabelDetailForm');
			/* clean div content before appding elements */
			addLabelDetailForm.html('');
			var addLabelHeading = this.creatElement('div', {class: 'labelDetailHeading'}, 'Add Label Detail');
			addLabelDetailForm.append(addLabelHeading);
			/* Name */
			var field1 = this.creatElement('div', {class: 'field'});
			var label1 = this.creatElement('label', {for: 'labelDetailName'}, 'Name');
			var input1 = this.creatElement('input', {type: 'text', name: 'labelDetailName', id: 'labelDetailName', value: '', autocomplete: 'off'});
			field1.append(label1, input1);
			/* Is Visible */
			var field2 = this.creatElement('div', {class: 'field'});
			var label2 = this.creatElement('label', {for: 'labelDetailIsVisible'}, 'Is Visible');
			var input2 = this.creatElement('input', {type: 'checkbox', name: 'labelDetailIsVisible', id: 'labelDetailIsVisible'});
			field2.append(label2, input2);
			/* Is Disabled */
			var field3 = this.creatElement('div', {class: 'field'});
			var label3 = this.creatElement('label', {for: 'labelDetailIsDisabled'}, 'Is Disabled');
			var input3 = this.creatElement('input', {type: 'checkbox', name: 'labelDetailIsDisabled', id: 'labelDetailIsDisabled'});
			field3.append(label3, input3);
			/* Position */
			var field4 = this.creatElement('div', {class: 'field'});
			var label4 = this.creatElement('label', {for: 'labelDetailPosition'}, 'Position');
			var input4 = this.creatElement('input', {type: 'text', name: 'labelDetailPosition', id: 'labelDetailPosition', value: '', autocomplete: 'off'});
			field4.append(label4, input4);
			/* inputs */
			var field5 = this.creatElement('div', {class: 'field'});
			var label5 = this.creatElement('label', {for: 'labelDetailInpytType', class: 'fl'}, 'Inputs:');
			var addInputDiv = this.creatElement('div', {class: 'addInput fr'});
			var inputTypeLabel = this.creatElement('label', {for: 'labelDetailInpytType', class: 'fl'}, 'Type');
			var selectInputType = this.creatElement('select', {class: 'fl', name: 'labelDetailInpytType', id: 'labelDetailInpytType', style: 'margin-left:10px'});
			selectInputType
				.append(this.creatElement('option', {value: 'text'}, 'Text Box'))
				.append(this.creatElement('option', {value: 'password'}, 'Password'))
				.append(this.creatElement('option', {value: 'textarea'}, 'Textarea'))
				.append(this.creatElement('option', {value: 'checkbox'}, 'Checkbox'))
				.append(this.creatElement('option', {value: 'radio'}, 'Radio'))
				.append(this.creatElement('option', {value: 'dropdownbox'}, 'Dropdown Box'));
			var addInputBtn = this.creatElement('button', {class: 'btn success fl', name: 'addInputBtn', id: 'addInputBtn', style: 'margin-left:10px', type: 'button'}, 'Add Input');
			addInputDiv.append(inputTypeLabel, selectInputType, addInputBtn, this.creatElement('div', {class: 'clearfix'}));
			field5.append(label5, addInputDiv, this.creatElement('div', {class: 'clearfix'}));

			/* action buttons */
			var field6 = this.creatElement('div', {class: 'field'});
			var save = this.creatElement('button', {name: 'addLabelDetailSave', 'id': 'addLabelDetailSave', class: 'fl btn success', type: 'button'}, 'Save');
			var cancel = this.creatElement('button', {name: 'addLabelDetailCancel', 'id': 'addLabelDetailCancel', class: 'fl btn error', style: 'margin-left:10px', type: 'button'}, 'Cancel');
			field6.append(save, cancel, this.creatElement('div', {class: 'clearfix'}));
			addLabelDetailForm.append(field1, field2, field3, field4, field5, field6).fadeIn();
			this.attachAddLabelDetailActionButtonEvents();
		},
		attachAddLabelDetailActionButtonEvents: function() {
			$('.addLabelDetailForm').find('#addLabelDetailSave').on('click', function() {
				alert('add label save clicked!');
			});
			$('.addLabelDetailForm').find('#addLabelDetailCancel').on('click', _.bind(function() {
				$('.addLabelDetailForm').fadeOut(function() {
					$('.labelDetails').fadeIn();
				});
			}, this));
		},
		editLabelDetail: function (lId, ldId) {

		},
		validateAddLabel: function () {

		},
		validateEditLabel: function () {

		},
		validateAddLabelDetail: function () {

		},
		validateEditLabelDetail: function () {

		},
		creatElement: function(str, params, data) {
			if(typeof str === 'string' && str !== '') {
				var elem = document.createElement(str);
				var attrs = typeof params === typeof {} && _.size(params) > 0 ? params : {};
				_.each(attrs, function(v, i){
					var attr = document.createAttribute(i);
					attr.value = v;
					elem.setAttributeNode(attr);
				});
				if(data) {
					return $('<' + elem + '>', $.extend({}, params)).text(data);
				}
				return $('<' + elem + '>', $.extend({}, params));
			}
			return null;
		},
		fadeInFadeOut: function(hide, show) {
			if(hide && typeof hide === typeof 'string' && hide !== '') {
				$(hide).fadeOut();
			}
			if(show && typeof show === typeof 'string' && show !== '') {
				$(show).fadeIn();
			}
		},
		init: function() {
			document.getElementById('addLabel').addEventListener('click', function(){
				$('.labels').fadeOut(function(){
					qwikApp.addLabel();
				});
			});
			document.getElementById('addLabelDetail').addEventListener('click', function(){
				$('.labelDetails').fadeOut(function(){
					qwikApp.addLabelDetail();
				});
			});
			/*labels = document.getElementsByClassName('label');
			for(var i = 0; i < labels.length; i++){
				labels[i].addEventListener('mouseover', function(e) {
					var liElm = e.target||e.srcElement;
					var evt = e.fromElement || e.relatedTarget;
					if (evt.parentNode == this || evt == this) return;
					if(e.relatedTarget && e.relatedTarget === this) return;
					liElm.children[1].style.display = 'block';
				});
				labels[i].addEventListener('mouseout', function(e) {
					debugger;
					var liElm = e.target||e.srcElement;
					var evt = e.fromElement || e.relatedTarget;
					if (evt.parentNode == this || evt == this) return;
					if(e.relatedTarget && e.relatedTarget === this) return;
					liElm.children[1].style.display = 'none';
				});
			}*/
			/*$('.label, .labelDetail').on('mouseenter', _.bind(function(e){
				$(e.currentTarget).find('.actions').show();
			}, this)).on('mouseleave', _.bind(function(e){
				$(e.currentTarget).find('.actions').hide();
			}, this));*/
		}
	};
	document.addEventListener("DOMContentLoaded", function() {
		qwikApp.init();
	});
}(window.jQuery));
