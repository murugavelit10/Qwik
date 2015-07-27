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
			deletedLabelDetails: {}
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
					var li = this.creatElement('li', {class: 'label'});
					var labelText = this.creatElement('div', {class: 'labelText fl m-top-3', 'data-id': id}, name);
					var actions = this.creatElement('div', {class: 'actions fr', 'style': 'display:none'});
					var editIcon = this.creatElement('div', {class: 'edit btn fa fw fa-pencil fl', 'data-id': id});
					var deleteIcon = this.creatElement('div', {class: 'delete btn error fa fw fa-trash fl', 'data-id': id, 'style': 'margin-left:10px'});
					actions.append(editIcon, deleteIcon, this.creatElement('div', {class: 'clearfix'}));
					li.append(labelText, actions, this.creatElement('div', {class: 'clearfix'}));
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
							labelsList.append(this.creatElement('li', {class: 'no-label'}, 'Oops! Labels not available.'));
						}
					}
				}, this));
			} else {
				labelsList.append(this.creatElement('li', {class: 'no-label'}, 'Oops! Labels not available.'));
			}
		},
		addLabel : function() {
			var addLabelForm = $('.addLabelForm');
			/* clean div content before appding elements */
			addLabelForm.html('');
			var addLabelHeading = this.creatElement('div', {class: 'labelHeading'}, 'Add Label');
			addLabelForm.append(addLabelHeading);
			/* Name */
			var field1 = this.creatElement('div', {class: 'field'});
			var label1 = '';//this.creatElement('label', {for: 'labelName'}, 'Name');
			var input1 = this.creatElement('input', {type: 'text', name: 'labelName', id: 'labelName', value: '', autocomplete: 'off', placeholder: 'Name'});
			field1.append(label1, input1);
			/* Is Visible */
			/*var field2 = this.creatElement('div', {class: 'field'});
			var label2 = this.creatElement('label', {for: 'labelIsVisible'}, 'Is Visible');
			var input2 = this.creatElement('input', {type: 'checkbox', name: 'labelIsVisible', id: 'labelIsVisible'});
			field2.append(label2, input2);*/
			/* Is Disabled */
			/*var field3 = this.creatElement('div', {class: 'field'});
			var label3 = this.creatElement('label', {for: 'labelIsDisabled'}, 'Is Disabled');
			var input3 = this.creatElement('input', {type: 'checkbox', name: 'labelIsDisabled', id: 'labelIsDisabled'});
			field3.append(label3, input3);*/
			/* Position */
			/*var field4 = this.creatElement('div', {class: 'field'});
			var label4 = '';//this.creatElement('label', {for: 'labelPosition'}, 'Position');
			var input4 = this.creatElement('input', {type: 'number', name: 'labelPosition', id: 'labelPosition', value: '0', autocomplete: 'off', placeholder: 'Position', step: 1, min: 0, max: 99, maxlenth: 2});
			field4.append(label4, input4);*/
			/* action buttons */
			var field5 = this.creatElement('div', {class: 'field'});
			var save = this.creatElement('button', {name: 'addLabelSave', 'id': 'addLabelSave', class: 'fl btn success'}, 'Save');
			var cancel = this.creatElement('button', {name: 'addLabelCancel', 'id': 'addLabelCancel', class: 'fl btn error', style: 'margin-left:10px'}, 'Cancel');
			field5.append(save, cancel, this.creatElement('div', {class: 'clearfix'}));
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
						$('.labelsList').html(this.creatElement('li', {class: 'no-label'}, 'Loading labels... Please Wait...'));
						$('.labels').fadeIn();
						this.showLabels();
					}, this));
				} else {
					$('#addLabelCancel').trigger('click');
				}
			}, this));
			addLabelForm.find('#addLabelCancel').on('click', _.bind(function() {
				addLabelForm.fadeOut(_.bind(function() {
					$('.labelsList').html(this.creatElement('li', {class: 'no-label'}, 'Loading labels... Please Wait...'));
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
			var addLabelHeading = this.creatElement('div', {class: 'labelHeading'}, 'Edit Label');
			addLabelForm.append(addLabelHeading);
			/* Name */
			var field1 = this.creatElement('div', {class: 'field'});
			var label1 = '';//this.creatElement('label', {for: 'labelName'}, 'Name');
			var input1 = this.creatElement('input', {type: 'text', name: 'labelName', id: 'labelName', value: label.name, autocomplete: 'off', placeholder: 'Name'});
			field1.append(label1, input1);
			/* Is Visible */
			/*var field2 = this.creatElement('div', {class: 'field'});
			var label2 = this.creatElement('label', {for: 'labelIsVisible'}, 'Is Visible');
			var input2 = this.creatElement('input', {type: 'checkbox', name: 'labelIsVisible', id: 'labelIsVisible'});
			field2.append(label2, input2);*/
			/* Is Disabled */
			/*var field3 = this.creatElement('div', {class: 'field'});
			var label3 = this.creatElement('label', {for: 'labelIsDisabled'}, 'Is Disabled');
			var input3 = this.creatElement('input', {type: 'checkbox', name: 'labelIsDisabled', id: 'labelIsDisabled'});
			field3.append(label3, input3);*/
			/* Position */
			/*var field4 = this.creatElement('div', {class: 'field'});
			var label4 = '';//this.creatElement('label', {for: 'labelPosition'}, 'Position');
			var input4 = this.creatElement('input', {type: 'number', name: 'labelPosition', id: 'labelPosition', value: '0', autocomplete: 'off', placeholder: 'Position', step: 1, min: 0, max: 99, maxlenth: 2});
			field4.append(label4, input4);*/
			/* action buttons */
			var field5 = this.creatElement('div', {class: 'field'});
			var save = this.creatElement('button', {name: 'editLabelSave', 'id': 'editLabelSave', class: 'fl btn success'}, 'Save');
			var cancel = this.creatElement('button', {name: 'editLabelCancel', 'id': 'editLabelCancel', class: 'fl btn error', style: 'margin-left:10px'}, 'Cancel');
			field5.append(save, cancel, this.creatElement('div', {class: 'clearfix'}));
			addLabelForm.append(field1, /*field2, field3, field4,*/ field5);
			addLabelForm.find('#editLabelSave').on('click', _.bind(function() {
				var labelName = $.trim($('#labelName').val());
				var duplicateLabel = _.findIndex(this.qwikAppData.labels, function(labelData){
					return label.id !== labelData.id && label.name === labelData.name;
				});
				var labelIndex = _.findIndex(this.qwikAppData.labels, function(labelData){
					return label.id === labelData.id;
				});
				if(label.name !== labelName && duplicateLabel === -1 && labelIndex > -1) {
					this.qwikAppData.labels[labelIndex].name = labelName;
					this.setQwikAppData();
					addLabelForm.fadeOut(_.bind(function(){
						$('.labelsList').html(this.creatElement('li', {class: 'no-label'}, 'Loading labels... Please Wait...'));
						$('.labels').fadeIn();
						this.showLabels();
					}, this));
				} else {
					$('#editLabelCancel').trigger('click');
				}
			}, this));
			addLabelForm.find('#editLabelCancel').on('click', _.bind(function() {
				addLabelForm.fadeOut(_.bind(function() {
					$('.labelsList').html(this.creatElement('li', {class: 'no-label'}, 'Loading labels... Please Wait...'));
					$('.labels').fadeIn();
					this.showLabels();
				}, this));
			}, this));
			addLabelForm.fadeIn();
		},
		showLabelDetails : function(labelId, labelName) {
			var labelDetailsList = $('.labelDetailsList');
			$('.labelDetailHeading').html('').text(labelName);
			labelDetailsList.html('');
			if(_.has(this.qwikAppData, 'labelDetails') && _.has(this.qwikAppData.labelDetails, labelName) && _.size(this.qwikAppData.labelDetails[labelName]) > 0) {
				_.each(this.qwikAppData.labelDetails[labelName], function(v, i){
					var id = v.id;
					var name = v.name;
					var li = this.creatElement('li', {class: 'labelDetail'});
					var labelText = this.creatElement('div', {class: 'labelText fl m-top-3', 'data-id': id}, name);
					var actions = this.creatElement('div', {class: 'actions fr', 'style': 'display:none'});
					var editIcon = this.creatElement('div', {class: 'edit btn fa fw fa-pencil fl'});
					var deleteIcon = this.creatElement('div', {class: 'delete btn error fa fw fa-trash fl', 'style': 'margin-left:10px'});
					actions.append(editIcon, deleteIcon, this.creatElement('div', {class: 'clearfix'}));
					li.append(labelText, actions, this.creatElement('div', {class: 'clearfix'}));
					labelDetailsList.append(li);
				}, this);
			} else {
				var li = this.creatElement('li', {class: 'no-label'}, 'Oops! Label Details not available.');
				labelDetailsList.append(li);
			}
			this.attachActionEvents($('.labelDetail'));
			$('.labelDetails').fadeIn();
		},
		addLabelDetail: function () {
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
			addLabelDetailForm.find('#addLabelDetailSave').on('click', function() {
				alert('add label save clicked!');
			});
			addLabelDetailForm.find('#addLabelDetailCancel').on('click', _.bind(function() {
				addLabelDetailForm.fadeOut(function() {
					$('.labelDetails').fadeIn();
				});
			}, this));
		},
		creatElement: function(str, params, data) {
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
					chrome.storage.sync.set(obj);
				} else if(type === 'get' && _.isFunction(value)) {
					chrome.storage.sync.get(key, value)
				}
			}
		}
	};
	document.addEventListener("DOMContentLoaded", function() {
		qwikApp.init();
	});
}(window.jQuery));
