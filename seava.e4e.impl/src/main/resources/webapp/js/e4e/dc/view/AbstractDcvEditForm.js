/**
 * DNet eBusiness Suite. Copyright: Nan21 Electronics SRL. All rights reserved.
 * Use is subject to license terms.
 */
Ext.define("e4e.dc.view.AbstractDcvEditForm", {
	extend : "e4e.dc.view.AbstractDc_Form",

	// **************** Properties *****************

	/**
	 * Flag to automatically disable form fields if the data-control is marked
	 * as read-only.
	 */
	_shouldDisableWhenDcIsReadOnly_ : true,

	/**
	 * Specify how to apply the form disable when shouldDisableWhenDcIsReadOnly
	 * property is true. Possible values are : fields - call disable on all
	 * fields (default value) panel - disable the form panel elems - call
	 * disable on all elements
	 * 
	 */
	_disableModeWhenDcIsReadOnly_ : "fields",

	/**
	 * Component builder
	 */
	_builder_ : null,

	/**
	 * Helper property to identify this dc-view type as edit form.
	 */
	_dcViewType_ : "edit-form",

	/**
	 * Array of image fields. Kept separately to manage binding.
	 */
	_images_ : null,

	/**
	 * Flag to automatically acquire focus when create new record.
	 */
	_acquireFocusInsert_ : true,

	/**
	 * Flag to automatically acquire focus when edit a record
	 */
	_acquireFocusUpdate_ : true,

	// **************** Public API *****************

	/**
	 * Returns the builder associated with this type of component. Each
	 * predefined data-control view type has its own builder. If it doesn't
	 * exist yet attempts to create it.
	 */
	_getBuilder_ : function() {
		if (this._builder_ == null) {
			this._builder_ = new e4e.dc.view.DcvEditFormBuilder({
				dcv : this
			});
		}
		return this._builder_;
	},

	_setShouldDisableWhenDcIsReadOnly_ : function(v, immediate) {
		this._shouldDisableWhenDcIsReadOnly_ = v;
		if (immediate && v) {
			this._doDisableWhenDcIsReadOnly_();
		}
	},

	// **************** Defaults and overrides *****************

	frame : true,
	border : true,
	bodyPadding : '8px 5px 3px 5px',
	maskOnDisable : false,
	layout : "fit",
	buttonAlign : "left",
	bodyCls : 'dcv-edit-form',
	trackResetOnLoad : false,
	fieldDefaults : {
		labelAlign : "right",
		labelWidth : 100
	},

	defaults : {
		frame : false,
		border : false,
		bodyBorder : false,
		bodyStyle : " background:transparent "
	},

	initComponent : function() {
		this._initTranslation_();
		this._runElementBuilder_();
		this.callParent(arguments);
		this._registerListeners_();
	},

	/**
	 * After the form is rendered invoke the record binding. This is necessary
	 * as the form may be rendered lazily(delayed) and the data-control may
	 * already have a current record set.
	 */
	afterRender : function() {
		this.callParent(arguments);
		this._syncBinding_();
		this._bindParams_();
		this._registerKeyBindings_();

		// acquire first time focus

		if (this._controller_.record && this._controller_.record.phantom
				&& this._acquireFocusInsert_) {
			(new Ext.util.DelayedTask(this._gotoFirstNavigationItem_, this))
					.delay(200);
		}
		if (this._controller_.record && !this._controller_.record.phantom
				&& this._acquireFocusUpdate_) {
			(new Ext.util.DelayedTask(this._gotoFirstNavigationItem_, this))
					.delay(200);
		}
	},

	_syncBinding_ : function() {
		if (this._controller_ && this._controller_.getRecord()) {
			this._onBind_(this._controller_.getRecord());
		} else {
			this._onUnbind_(null);
		}
	},

	beforeDestroy : function() {
		this._elems_.each(function(item, idx, len) {
			delete item._dcView_;
		}, this);
		this.callParent(arguments);
	},
	// **************** Private API *****************

	/**
	 * Register event listeners
	 */
	_registerListeners_ : function() {
		var ctrl = this._controller_;
		var store = ctrl.store;

		// controller listeners

		this.mon(ctrl, "onEditIn", function() {
			this._syncBinding_();
		}, this);
		this.mon(ctrl, "recordChange", this._onController_recordChange_, this);
		this.mon(ctrl, "recordReload", this._onController_recordReload_, this);
		this.mon(ctrl, "readOnlyChanged", function() {
			this._applyStates_(this._controller_.getRecord());
		}, this);
		this.mon(ctrl, "parameterValueChanged", this._onParameterValueChanged_,
				this);

		if (this._acquireFocusInsert_) {
			this.mon(ctrl, "afterDoNew", this._gotoFirstNavigationItem_, this);
		}
		if (this._acquireFocusUpdate_) {
			this.mon(ctrl, "onEditIn", this._gotoFirstNavigationItem_, this);
			this.mon(ctrl, "afterDoSaveSuccess", function() {
				this._gotoFirstNavigationItem_();
			}, this);
		}

		// store listeners

		this.mon(store, "update", this._onStore_update_, this);

		if (this._controller_.commands.doSave) {
			this._controller_.commands.doSave.beforeExecute = Ext.Function
					.createInterceptor(
							this._controller_.commands.doSave.beforeExecute,
							function() {
								if (this._shouldValidate_()
										&& !this.getForm().isValid()) {
									this._controller_.error(
											Main.msg.INVALID_FORM, "msg");
									return false;
								} else {
									return true;
								}
							}, this, -1);
		}
	},

	_gotoFirstNavigationItem_ : function() {
		var f = this.down("textfield");
		if (f) {
			f.focus();
		}
	},

	/**
	 * Update the bound record when the store data is updated.
	 */
	_onStore_update_ : function(store, rec, op, modFieldNames, eopts) {
		if (this.getForm().getRecord() === rec) {
			this._updateBound_(rec, op, modFieldNames);
		}
	},

	/**
	 * When the current record of the data-control is changed bind it to the
	 * form.
	 */
	_onController_recordChange_ : function(evnt) {
		var newRecord = evnt.newRecord;
		var newIdx = evnt.newIdx;
		if (newRecord != this.getForm()._record) {
			this._onUnbind_();
			this._onBind_(newRecord);
		}
	},

	_onController_recordReload_ : function(evnt) {
		var r = evnt.record;
		if (this.getForm()._record == r) {
			this._applyStates_(r);
		}
	},

	/**
	 * Bind the current record of the data-control to the form.
	 * 
	 */
	_onBind_ : function(record) {
		var ctrl = this._controller_;
		if (ctrl.trackEditMode && !ctrl.isEditMode) {
			return;
		}
		if (record) {
			if (this.disabled) {
				this.enable();
			}
			if (this._images_ != null) {
				for (var i = 0, l = this._images_.length; i < l; i++) {
					var img = this._getElement_(this._images_[i]);
					img.setSrc(record.get(img.dataIndex));
				}
			}
			var fields = this.getForm().getFields();
			var trackResetOnLoad = this.getForm().trackResetOnLoad;
			fields.each(function(field) {
				this._onBindField_(field, record, trackResetOnLoad);
			}, this);
			this.getForm()._record = record;
			this._applyStates_(record);
			this.getForm().isValid();
		}
		this._afterBind_(record);
	},

	_onBindField_ : function(field, record, trackResetOnLoad) {
		if (field.dataIndex) {
			var _v = record.get(field.dataIndex);
			if (field.formatDate) {
				field.setRawValue(field.formatDate(_v));
			} else if (field.isCheckbox === true) {
				field.suspendEvents();
				field.setValue(_v);
				field.resumeEvents();
			} else {
				field.setRawValue(_v);
			}
			if (trackResetOnLoad) {
				field.resetOriginalValue();
			}
		}
	},

	/**
	 * Un-bind the record from the form.
	 */
	_onUnbind_ : function() {
		var ctrl = this._controller_;
		if (ctrl.trackEditMode && !ctrl.isEditMode) {
			return;
		}
		var _r = this.getForm()._record;
		if (_r) {
			if (this._images_ != null) {
				for (var i = 0, l = this._images_.length; i < l; i++) {
					var img = this._getElement_(this._images_[i]);
					img.setSrc("");
				}
			}
			this.getForm().getFields().each(function(field) {
				if (field.dataIndex) {
					field.setRawValue(null);
					field.clearInvalid();
				}
			});
			if (!this.disabled) {
				this.disable();
			}
			this.getForm()._record = null;
		}

		this._afterUnbind_(_r);
	},

	/**
	 * When the record has been changed in any way other than user interaction,
	 * update the fields of the form with the changed values from the model.
	 * Such change may happen by custom code snippets updating the model in a
	 * beginEdit-endEdit block, reload record from server, service methods which
	 * returns changed record data from server, etc.
	 * 
	 */
	_updateBound_ : function(record, op, modFieldNames) {
		var ctrl = this._controller_;
		if (ctrl.trackEditMode && !ctrl.isEditMode) {
			return;
		}
		var msg = "null";
		if (record) {
			var fields = this.getForm().getFields();
			if (modFieldNames) {
				var l = modFieldNames.length;
				for (var i = 0; i < l; i++) {
					var field = this._findFieldByDataIndex(fields,
							modFieldNames[i]);
					this._updateBoundField_(field, record, op);
				}
			} else {
				fields.each(function(field) {
					this._updateBoundField_(field, record, op);
				}, this);
			}
		}
	},

	_updateBoundField_ : function(field, record, op) {
		if (field && field.dataIndex) {
			var nv = record.data[field.dataIndex];
			// if it is a cancel changes operation blindly reset the raw value
			// of the field
			// Otherwise go through the real setValue to allow to trigger change
			// events
			if (op == "reject") {
				if (field.formatDate) {
					field.setRawValue(field.formatDate(nv));
				} else {
					field.setRawValue(nv);
				}
				field.clearInvalid();
			} else {
				if (!(field.hasFocus && field.isDirty)) {
					if (field._isLov_) {
						var fs = field.forceSelection;
						field.forceSelection = false;
						field.setValue(nv);
						field.forceSelection = fs;
					} else {
						field.setValue(nv);
					}
				}
			}
		}
	},

	/**
	 * Helper method to find a form field by its dataIndex property.
	 */
	_findFieldByDataIndex : function(fields, dataIndex) {
		var items = fields.items, i = 0, len = items.length;

		for (; i < len; i++) {
			if (items[i]["dataIndex"] == dataIndex) {
				return items[i];
			}
		}
		return null;
	},

	/**
	 * The edit-form specific state rules. The flow is: If the fields are marked
	 * with noInsert, noUpdate or noEdit these rules are applied and no other
	 * option checked If no such constraint, the _canSetEnabled_ function is
	 * checked for each element.
	 * 
	 */
	_onApplyStates_ : function(record) {
		// the form has been disabled by the (un)bind.
		// Nothing to change
		if (record == null || record == undefined) {
			return;
		}
		if (this._shouldDisableWhenDcIsReadOnly_
				&& this._controller_.isReadOnly()) {
			this._doDisableWhenDcIsReadOnly_();
			return;
		}
		if (record.phantom) {
			this._elems_.each(function(item_, index, length) {
				var item = this._get_(item_.name);
				if (!item) {
					return;
				}
				if (item._visibleFn_ != undefined) {
					item.setVisible(this._canSetVisible_(item.name, record));
				}
				if (item.noEdit === true || item.noInsert === true) {
					item._disable_();
				} else {
					if (item._enableFn_ != undefined) {
						item._setDisabled_(!this._canSetEnabled_(item.name,
								record));
					} else {
						item._enable_();
					}
				}
			}, this);
		} else {
			this._elems_.each(function(item_, index, length) {
				var item = this._get_(item_.name);
				if (!item) {
					return;
				}
				if (item._visibleFn_ != undefined) {
					item.setVisible(this._canSetVisible_(item.name, record));
				}
				if (item.noEdit === true || item.noUpdate === true) {
					item._disable_();
				} else {
					if (item._enableFn_ != undefined) {
						item._setDisabled_(!this._canSetEnabled_(item.name,
								record));
					} else {
						item._enable_();
					}
				}
			}, this);
		}

	},

	_doDisableWhenDcIsReadOnly_ : function() {
		if (this._shouldDisableWhenDcIsReadOnly_
				&& this._controller_.isReadOnly()) {
			this["_doDisableWhenDcIsReadOnly_"
					+ this._disableModeWhenDcIsReadOnly_ + "_"]();
		}
	},

	_doDisableWhenDcIsReadOnly_fields_ : function() {
		this.getForm().getFields().each(this._disableElement_);
	},

	_doDisableWhenDcIsReadOnly_panel_ : function() {
		this.disable();
	},

	_doDisableWhenDcIsReadOnly_elems_ : function() {
		this._elems_.each(this._disableElement_);
	},

	_disableElement_ : function(e) {
		e._disable_();
	},

	_registerKeyBindings_ : function() {
		var map = new Ext.util.KeyMap({
			target : this.getEl(),
			eventName : 'keydown',
			processEvent : function(event, source, options) {
				return event;
			},
			binding : [
					Ext.apply(KeyBindings.values.dc.doNew, {
						fn : function(keyCode, e) {
							e.stopEvent();
							this._controller_.doNew();
						},
						scope : this
					}),
					Ext.apply(KeyBindings.values.dc.doCancel, {
						fn : function(keyCode, e) {
							e.stopEvent();
							this._controller_.doCancel();
							if (this._controller_.record == null) {
								this.focus();
							}
						},
						scope : this
					}),
					Ext.apply(KeyBindings.values.dc.doSave, {
						fn : function(keyCode, e) {
							e.stopEvent();
							this._controller_.doSave();
						},
						scope : this
					}),
					Ext.apply(KeyBindings.values.dc.doCopy, {
						fn : function(keyCode, e) {
							e.stopEvent();
							this._controller_.doCopy();
							this._controller_.doEditIn();
						},
						scope : this
					}),
					Ext.apply(KeyBindings.values.dc.doEditOut, {
						fn : function(keyCode, e) {
							e.stopEvent();
							this._controller_.doEditOut();
						},
						scope : this
					}),
					Ext.apply(KeyBindings.values.dc.nextRec, {
						fn : function(keyCode, e) {
							e.stopEvent();
							this._controller_.doNextRec();
						},
						scope : this
					}),
					Ext.apply(KeyBindings.values.dc.prevRec, {
						fn : function(keyCode, e) {
							e.stopEvent();
							this._controller_.doPrevRec();
						},
						scope : this
					}),
					Ext.apply(KeyBindings.values.dc.nextPage, {
						fn : function(keyCode, e) {
							e.stopEvent();
							this._controller_.doNextPage();
						},
						scope : this
					}),
					Ext.apply(KeyBindings.values.dc.prevPage, {
						fn : function(keyCode, e) {
							e.stopEvent();
							this._controller_.doPrevPage();
						},
						scope : this
					}),

					Ext.apply(KeyBindings.values.dc.doEnterQuery, {
						fn : function(keyCode, e) {
							e.stopEvent();
							if (!this._controller_.trackEditMode
									|| !this._controller_.isEditMode) {
								this._controller_.doEnterQuery();
							}
						},
						scope : this
					}),
					Ext.apply(KeyBindings.values.dc.doClearQuery, {
						fn : function(keyCode, e) {
							e.stopEvent();
							if (!this._controller_.trackEditMode
									|| !this._controller_.isEditMode) {
								this._controller_.doClearQuery();
							}
						},
						scope : this
					}),
					Ext.apply(KeyBindings.values.dc.doQuery, {
						fn : function(keyCode, e) {
							e.stopEvent();
							if (!this._controller_.trackEditMode
									|| !this._controller_.isEditMode) {
								this._controller_.doQuery();
							}
						},
						scope : this
					}) ]
		});
	}

});