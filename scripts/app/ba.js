(function ($) {
	var qwikApp = {
		init : function() {
			var addLabelCb = _.bind(function(){
				this.addLabel();
			}, this);
			$('.addLabel').on('click', function(e) {
				e.preventDefault();
				$('.labels').fadeOut(addLabelCb);
			});
			var addLabelDetailCb = _.bind(function(){
				this.addLabelDetail();
			}, this);
			$('.addLabelDetail').on('click', function(e) {
				e.preventDefault();
				$('.labelDetails').fadeOut(addLabelDetailCb);
			});
			$('.backBtn').on('click', function(){
				$('.labelDetails').fadeOut(function(){
					$('.labels').fadeIn();
				});
			});
			this.getUserData();
		},
		qwikAppData : {
			maximumLabels: 10,
			totalLabels: 0,
			labels: [],
			deletedLabels: [],
			labelDetails: {},
			deletedLabelDetails: {},
			currentLabel: {},
			currentLabelDetail: {}
		},
		getUserData : function() {
			this.syncChromeStorage('get', 'qwikAppData', _.bind(function(data) {
				if( ! _.isEmpty(data)) {
					var storedData = _.has(data, 'qwikAppData') ? JSON.parse(data.qwikAppData) : {};
					_.each(storedData, function(v, i){
						if(_.has(this.qwikAppData, i)) {
							this.qwikAppData[i] = v;
						}
					}, this);
				} else if(_.has(this, 'qwikAppData')) {
					this.syncChromeStorage('set', 'qwikAppData', JSON.stringify(this.qwikAppData));
				}
				this.showLabels();
			}, this));
		},
		showLabels : function() {
			var labelsList = $('.labelsList');
			labelsList.html('');
			if(_.has(this.qwikAppData, 'labels') && _.size(this.qwikAppData.labels) > 0) {
				_.each(this.qwikAppData.labels, function(v, i){
					var id = v.id;
					var name = v.name;
					var li = this.makeElement('li', {class: 'label'});
					var labelText = this.makeElement('div', {class: 'labelText fl m-top-3', 'data-id': id}, name);
					var actions = this.makeElement('div', {class: 'actions fr', 'style': 'display:none'});
					var editIcon = this.makeElement('div', {class: 'edit btn fa fw fa-pencil fl', 'data-id': id});
					var deleteIcon = this.makeElement('div', {class: 'delete btn error m-left-10 fa fw fa-trash fl', 'data-id': id});
					actions.append(editIcon, deleteIcon, this.makeElement('div', {class: 'clearfix'}));
					li.append(labelText, actions, this.makeElement('div', {class: 'clearfix'}));
					labelsList.append(li);
				}, this);
				this.attachActionEvents($('.label'));
				$('.label').on('click', '.labelText', _.bind(function(e) {
					e.preventDefault();
					var label = _.findWhere(this.qwikAppData.labels, {'id': Number($(e.currentTarget).attr('data-id'))});
					if( ! _.isUndefined(label)) {
						$('.labels').fadeOut(_.bind(function(){
							this.showLabelDetails(label);
						}, this));
					}
				}, this)).on('click', '.edit', _.bind(function(e){
					e.preventDefault();
					var label = _.findWhere(this.qwikAppData.labels, {'id': Number($(e.currentTarget).attr('data-id'))});
					if( ! _.isUndefined(label)) {
						$('.labels').fadeOut(_.bind(function(){
							this.editLabel(label);
						}, this));
					}
				}, this)).on('click', '.delete', _.bind(function(e){
					e.preventDefault();
					var cTarget = $(e.currentTarget);
					var currentLabel = cTarget.parents('li');
					if(confirm('Do you want to delete ' + currentLabel.find('.labelText').text() + '?')) {
						var labels = _.filter(this.qwikAppData.labels, function(label){
							return label.id !== Number(cTarget.attr('data-id'));
						});
						this.qwikAppData.labels = labels;
						this.setQwikAppData();
						currentLabel.remove();
						if(labelsList.find('li').length <= 0) {
							labelsList.append(this.makeElement('li', {class: 'no-label'}, 'Oops! Labels not available.'));
						}
					}
				}, this));
			} else {
				labelsList.append(this.makeElement('li', {class: 'no-label'}, 'Oops! Labels not available.'));
			}
		},
		addLabel : function() {
			var addLabelForm = $('.addLabelForm');
			/* clean div content before appding elements */
			addLabelForm.html('');
			var addLabelHeading = this.makeElement('div', {class: 'labelHeading'}, 'Add Label');
			addLabelForm.append(addLabelHeading);
			/* Name */
			var field1 = this.makeElement('div', {class: 'field'});
			var label1 = '';//this.makeElement('label', {for: 'labelName'}, 'Name');
			var input1 = this.makeElement('input', {type: 'text', name: 'labelName', id: 'labelName', value: '', autocomplete: 'off', placeholder: 'Name'});
			field1.append(label1, input1);
			/* Is Visible */
			/*var field2 = this.makeElement('div', {class: 'field'});
			var label2 = this.makeElement('label', {for: 'labelIsVisible'}, 'Is Visible');
			var input2 = this.makeElement('input', {type: 'checkbox', name: 'labelIsVisible', id: 'labelIsVisible'});
			field2.append(label2, input2);*/
			/* Is Disabled */
			/*var field3 = this.makeElement('div', {class: 'field'});
			var label3 = this.makeElement('label', {for: 'labelIsDisabled'}, 'Is Disabled');
			var input3 = this.makeElement('input', {type: 'checkbox', name: 'labelIsDisabled', id: 'labelIsDisabled'});
			field3.append(label3, input3);*/
			/* Position */
			/*var field4 = this.makeElement('div', {class: 'field'});
			var label4 = '';//this.makeElement('label', {for: 'labelPosition'}, 'Position');
			var input4 = this.makeElement('input', {type: 'number', name: 'labelPosition', id: 'labelPosition', value: '0', autocomplete: 'off', placeholder: 'Position', step: 1, min: 0, max: 99, maxlenth: 2});
			field4.append(label4, input4);*/
			/* action buttons */
			var field5 = this.makeElement('div', {class: 'field'});
			var save = this.makeElement('button', {name: 'addLabelSave', 'id': 'addLabelSave', class: 'fl btn success'}, 'Save');
			var cancel = this.makeElement('button', {name: 'addLabelCancel', 'id': 'addLabelCancel', class: 'btn error m-left-10 fl'}, 'Cancel');
			field5.append(save, cancel, this.makeElement('div', {class: 'clearfix'}));
			addLabelForm.append(field1, /*field2, field3, field4,*/ field5);
			addLabelForm.find('#addLabelSave').on('click', _.bind(function() {
				var labelName = $.trim($('#labelName').val());
				var filteredData = _.filter(this.qwikAppData.labels, function(label){
					return labelName === label.name;
				});
				if(_.size(filteredData) <= 0){
					var lastLabel = _.last(this.qwikAppData.labels);
					this.qwikAppData.labels.push({
						id: ! _.isUndefined(lastLabel) ? Number(lastLabel.id) + 1 : 1,
						name: labelName,
						position: 0,
						isVisible: 1,
						isDisabled: 0
					});
					this.setQwikAppData();
					addLabelForm.fadeOut(_.bind(function(){
						$('.labelsList').html(this.makeElement('li', {class: 'no-label'}, 'Loading labels... Please Wait...'));
						$('.labels').fadeIn();
						this.showLabels();
					}, this));
				} else {
					$('#addLabelCancel').trigger('click');
				}
			}, this));
			addLabelForm.find('#addLabelCancel').on('click', _.bind(function() {
				addLabelForm.fadeOut(_.bind(function() {
					$('.labelsList').html(this.makeElement('li', {class: 'no-label'}, 'Loading labels... Please Wait...'));
					$('.labels').fadeIn();
					this.showLabels();
				}, this));
			}, this));
			addLabelForm.fadeIn();
		},
		editLabel : function(label) {
			var addLabelForm = $('.addLabelForm');
			/* clean div content before appding elements */
			addLabelForm.html('');
			var addLabelHeading = this.makeElement('div', {class: 'labelHeading'}, 'Edit Label');
			addLabelForm.append(addLabelHeading);
			/* Name */
			var field1 = this.makeElement('div', {class: 'field'});
			var label1 = '';//this.makeElement('label', {for: 'labelName'}, 'Name');
			var input1 = this.makeElement('input', {type: 'text', name: 'labelName', id: 'labelName', value: label.name, autocomplete: 'off', placeholder: 'Name'});
			field1.append(label1, input1);
			/* Is Visible */
			/*var field2 = this.makeElement('div', {class: 'field'});
			var label2 = this.makeElement('label', {for: 'labelIsVisible'}, 'Is Visible');
			var input2 = this.makeElement('input', {type: 'checkbox', name: 'labelIsVisible', id: 'labelIsVisible'});
			field2.append(label2, input2);*/
			/* Is Disabled */
			/*var field3 = this.makeElement('div', {class: 'field'});
			var label3 = this.makeElement('label', {for: 'labelIsDisabled'}, 'Is Disabled');
			var input3 = this.makeElement('input', {type: 'checkbox', name: 'labelIsDisabled', id: 'labelIsDisabled'});
			field3.append(label3, input3);*/
			/* Position */
			/*var field4 = this.makeElement('div', {class: 'field'});
			var label4 = '';//this.makeElement('label', {for: 'labelPosition'}, 'Position');
			var input4 = this.makeElement('input', {type: 'number', name: 'labelPosition', id: 'labelPosition', value: '0', autocomplete: 'off', placeholder: 'Position', step: 1, min: 0, max: 99, maxlenth: 2});
			field4.append(label4, input4);*/
			/* action buttons */
			var field5 = this.makeElement('div', {class: 'field'});
			var save = this.makeElement('button', {name: 'editLabelSave', 'id': 'editLabelSave', class: 'fl btn success'}, 'Save');
			var cancel = this.makeElement('button', {name: 'editLabelCancel', 'id': 'editLabelCancel', class: 'btn error m-left-10 fl'}, 'Cancel');
			field5.append(save, cancel, this.makeElement('div', {class: 'clearfix'}));
			addLabelForm.append(field1, /*field2, field3, field4,*/ field5);
			addLabelForm.find('#editLabelSave').on('click', _.bind(function() {
				var labelName = $.trim($('#labelName').val());
				var duplicateLabel = _.findIndex(this.qwikAppData.labels, function(labelData){
					return label.id !== labelData.id && labelName === labelData.name;
				});
				var labelIndex = _.findIndex(this.qwikAppData.labels, function(labelData){
					return label.id === labelData.id;
				});
				if(label.name !== labelName && duplicateLabel === -1 && labelIndex > -1) {
					this.qwikAppData.labels[labelIndex].name = labelName;
					this.setQwikAppData();
					addLabelForm.fadeOut(_.bind(function(){
						$('.labelsList').html(this.makeElement('li', {class: 'no-label'}, 'Loading labels... Please Wait...'));
						$('.labels').fadeIn();
						this.showLabels();
					}, this));
				} else {
					$('#editLabelCancel').trigger('click');
				}
			}, this));
			addLabelForm.find('#editLabelCancel').on('click', _.bind(function() {
				addLabelForm.fadeOut(_.bind(function() {
					$('.labelsList').html(this.makeElement('li', {class: 'no-label'}, 'Loading labels... Please Wait...'));
					$('.labels').fadeIn();
					this.showLabels();
				}, this));
			}, this));
			addLabelForm.fadeIn();
		},
		showLabelDetails : function(label) {
			var labelDetailsList = $('.labelDetailsList');
			$('.labelDetailHeading').html('').text(label.name);
			labelDetailsList.html('');
			if(_.has(this.qwikAppData, 'labelDetails') && _.has(this.qwikAppData.labelDetails, label.id) && _.size(this.qwikAppData.labelDetails[label.id]) > 0) {
				_.each(this.qwikAppData.labelDetails[label.id], function(v, i){
					var li = this.makeElement('li', {class: 'labelDetail'});
					var labelText = this.makeElement('div', {class: 'labelText fl m-top-3', 'data-id': v.id, 'data-label-id': label.id}, v.name);
					var actions = this.makeElement('div', {class: 'actions fr', 'style': 'display:none'});
					var editIcon = this.makeElement('div', {class: 'edit btn fa fw fa-pencil fl', 'data-id': v.id, 'data-label-id': label.id});
					var deleteIcon = this.makeElement('div', {class: 'delete btn error m-left-10 fa fw fa-trash fl', 'data-id': v.id, 'data-label-id': label.id});
					actions.append(editIcon, deleteIcon, this.makeElement('div', {class: 'clearfix'}));
					li.append(labelText, actions, this.makeElement('div', {class: 'clearfix'}));
					labelDetailsList.append(li);
				}, this);
			} else {
				labelDetailsList.append(this.makeElement('li', {class: 'no-label'}, 'Oops! Label Details not available.'));
			}
			this.attachActionEvents($('.labelDetail'));
			$('.labelDetail').on('click', '.labelText', _.bind(function(e) {
				e.preventDefault();
				var cTarget = $(e.currentTarget);
				var labelId = cTarget.attr('data-label-id');
				var labelDetailId = cTarget.attr('data-id');
				var labelDetail = _.findWhere(this.qwikAppData.labelDetails[labelId], {'id': Number(LabelDetailId)});
				if( ! _.isUndefined(labelDetail)) {
					chrome.tabs.create({
						url: labelDetail.URL
					}, function(tab) {
						this.syncChromeStorage('set', 'qwikAppTab', tab);
					});
					this.syncChromeStorage('set', 'qwkiAppSelectedLabel', JSON.stringify(label));
					this.syncChromeStorage('set', 'qwkiAppSelectedLabelDetail', JSON.stringify(labelDetail));
				}
			}, this)).on('click', '.edit', _.bind(function(e){
				e.preventDefault();
				var cTarget = $(e.currentTarget);
				var labelId = cTarget.attr('data-label-id');
				var labelDetailId = cTarget.attr('data-id');
				var labelDetail = _.findWhere(this.qwikAppData.labelDetails[labelId], {'id': Number(labelDetailId)});
				if( ! _.isUndefined(label)) {
					$('.labelDetails').fadeOut(_.bind(function(){
						this.editLabelDetail(labelDetail);
					}, this));
				}
			}, this)).on('click', '.delete', _.bind(function(e){
				e.preventDefault();
				var cTarget = $(e.currentTarget);
				var labelId = cTarget.attr('data-label-id');
				var labelDetailId = cTarget.attr('data-id');
				var currentLabelDetail = cTarget.parents('li');
				if(confirm('Do you want to delete ' + currentLabelDetail.find('.labelText').text() + '?')) {
					var labelDetails = _.filter(this.qwikAppData.labelDetails[labelId], function(labelDetail){
						return labelDetail.id !== Number(labelDetailId);
					});
					this.qwikAppData.labelDetails[labelId] = labelDetails;
					this.setQwikAppData();
					currentLabelDetail.remove();
					if(labelDetailsList.find('li').length <= 0) {
						labelDetailsList.append(this.makeElement('li', {class: 'no-label'}, 'Oops! Label Details not available.'));
					}
				}
			}, this));
			$('.labelDetails').fadeIn();
		},
		addLabelDetail: function () {
			var addLabelDetailForm = $('.addLabelDetailForm');
			/* clean div content before appding elements */
			addLabelDetailForm.html('');
			var addLabelHeading = this.makeElement('div', {class: 'labelDetailHeading'}, 'Add Label Detail');
			addLabelDetailForm.append(addLabelHeading);
			/* Name */
			var field1 = this.makeElement('div', {class: 'field'});
			var label1 = '';//this.makeElement('label', {for: 'labelDetailName'}, 'Name');
			var input1 = this.makeElement('input', {type: 'text', class: 'fl', name: 'labelDetailName', id: 'labelDetailName', value: '', autocomplete: 'off', placeholder: 'Name'});
			var input11 = this.makeElement('input', {type: 'text', class: 'm-left-10 fl', name: 'labelDetailUrl', id: 'labelDetailUrl', value: '', autocomplete: 'off', placeholder: 'URL'});
			field1.append(label1, input1, input11, this.makeElement('div', {class: 'clearfix'}));
			/* Is Visible */
			/*var field2 = this.makeElement('div', {class: 'field'});
			var label2 = this.makeElement('label', {for: 'labelDetailIsVisible'}, 'Is Visible');
			var input2 = this.makeElement('input', {type: 'checkbox', name: 'labelDetailIsVisible', id: 'labelDetailIsVisible'});
			field2.append(label2, input2);*/
			/* Is Disabled */
			/*var field3 = this.makeElement('div', {class: 'field'});
			var label3 = this.makeElement('label', {for: 'labelDetailIsDisabled'}, 'Is Disabled');
			var input3 = this.makeElement('input', {type: 'checkbox', name: 'labelDetailIsDisabled', id: 'labelDetailIsDisabled'});
			field3.append(label3, input3);*/
			/* Position */
			/*var field4 = this.makeElement('div', {class: 'field'});
			var label4 = this.makeElement('label', {for: 'labelDetailPosition'}, 'Position');
			var input4 = this.makeElement('input', {type: 'text', name: 'labelDetailPosition', id: 'labelDetailPosition', value: '', autocomplete: 'off'});
			field4.append(label4, input4);*/
			/* inputs */
			var field5 = this.makeElement('div', {class: 'field'});
			var label5 = this.makeElement('label', {for: 'labelDetailInpytType', class: 'fl'}, 'Inputs:');
			var addInputDiv = this.makeElement('div', {class: 'addInput fr'});
			var addInputBtn = this.makeElement('button', {class: 'btn success m-left-10 fl', name: 'addInputBtn', id: 'addInputBtn', type: 'button'}, 'Add Input');
			addInputDiv.append(addInputBtn, this.makeElement('div', {class: 'clearfix'}));
			field5.append(label5, addInputDiv, this.makeElement('div', {class: 'clearfix'}));

			/* action buttons */
			var field6 = this.makeElement('div', {class: 'field'});
			var save = this.makeElement('button', {name: 'addLabelDetailSave', 'id': 'addLabelDetailSave', class: 'fl btn success', type: 'button'}, 'Save');
			var cancel = this.makeElement('button', {name: 'addLabelDetailCancel', 'id': 'addLabelDetailCancel', class: 'btn error m-left-10 fl', type: 'button'}, 'Cancel');
			field6.append(save, cancel, this.makeElement('div', {class: 'clearfix'}));
			addLabelDetailForm.append(field1, /*field2, field3, field4,*/ field5, field6).fadeIn();
			var inputCount = 0;
			var maxInputCount = 5;
			addLabelDetailForm.find('#addInputBtn').on('click', _.bind(function(e) {
				e.preventDefault();
				if(inputCount === maxInputCount) return false;
				inputCount++;
				var field = this.makeElement('div', {class: 'field'});
				var selector = this.makeElement('input', {type: 'text', class: 'inputCol w-100 fl', name: 'selector', placeholder: 'selector'});
				var inputType = this.makeElement('select', {class: 'inputCol w-100 m-left-10 fl', name: 'inpytType'});
				inputType
					.append(this.makeElement('option', {value: 'text'}, 'Text Box'))
					.append(this.makeElement('option', {value: 'password'}, 'Password'))
					.append(this.makeElement('option', {value: 'textarea'}, 'Textarea'))
					.append(this.makeElement('option', {value: 'checkbox'}, 'Checkbox'))
					.append(this.makeElement('option', {value: 'radio'}, 'Radio'))
					.append(this.makeElement('option', {value: 'select'}, 'Dropdown Box'));
				var value = this.makeElement('input', {type: 'text', class: 'inputCol w-100 m-left-10 fl', name: 'value', placeholder: 'value'});
				var deleteBtn = this.makeElement('div', {class: 'inputCol btn error delete m-left-10 m-top-5 fa fw fa-trash fl'});
				field.append(selector, inputType, value, deleteBtn, this.makeElement('div', {class: 'clearfix'}));
				$(field).insertBefore(addLabelDetailForm.find('.field:last'));
				deleteBtn.on('click', function(e) {
					e.preventDefault();
					var cTarget = $(e.currentTarget);
					var currentInputRow = cTarget.parents('.field');
					if(confirm('Do you want to delete this input?')) {
						inputCount--;
						if(inputCount < maxInputCount) {
							$('#addInputBtn').show();
						}
						currentInputRow.remove();
					}
				});
				if(inputCount === maxInputCount) {
					$('#addInputBtn').hide();
				}
			}, this));
			addLabelDetailForm.find('#addLabelDetailSave').on('click', function() {
				alert('add label save clicked!');
			});
			addLabelDetailForm.find('#addLabelDetailCancel').on('click', _.bind(function() {
				addLabelDetailForm.fadeOut(function() {
					$('.labelDetails').fadeIn();
				});
			}, this));
		},
		makeElement: function(str, params, data) {
			var elem = null;
			if(_.isString(str) && ! _.isEmpty(str)) {
				elem = $('<' + str + '>', $.extend({}, params));
				if(_.isString(data) && ! _.isEmpty(data)) {
					elem.text(data);
				}
			}
			return elem;
		},
		attachActionEvents : function(selector) {
			$(selector).on('mouseenter', function(e){
				$(e.currentTarget).find('.actions').show();
			}).on('mouseleave', function(e){
				$(e.currentTarget).find('.actions').hide();
			});
		},
		setQwikAppData: function() {
			this.syncChromeStorage('set', 'qwikAppData', JSON.stringify(this.qwikAppData));
		},
		syncChromeStorage: function(type, key, value) {
			if(_.isString(type) && ! _.isEmpty(type)) {
				if(type === 'set') {
					var obj = {};
					obj[key] = value;
					chrome.storage.local.set(obj);
				} else if(type === 'get' && _.isFunction(value)) {
					chrome.storage.local.get(key, value)
				}
			}
		}
	};
	document.addEventListener("DOMContentLoaded", function() {
		qwikApp.init();
	});
}(window.jQuery));
