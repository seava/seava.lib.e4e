/**
 * DNet eBusiness Suite. Copyright: Nan21 Electronics SRL. All rights reserved.
 * Use is subject to license terms.
 */
/**
 * Base panel used for data-control views. It serves as base class for
 * edit-forms and filter-forms.
 */
Ext.define("e4e.dc.view.AbstractDc_Form", {
	extend : "Ext.form.Panel",

	mixins : {
		elemBuilder : "e4e.base.Abstract_View",
		dcViewSupport : "e4e.dc.view.AbstractDc_View"
	},

	// **************** Properties *****************

	/**
	 * Translations class
	 */
	_trl_ : null,

	// **************** Public API *****************

	/**
	 * Helper method to disable all fields.
	 */
	_disableAllFields_ : function() {
		this.getForm().getFields().each(function(item, index, length) {
			item._disable_();
		});
	},

	/**
	 * Helper method to enable all fields.
	 */
	_enableAllFields_ : function() {
		this.getForm().getFields().each(function(item, index, length) {
			item._enable_();
		});
	},

	/**
	 * There may be situations when a form should not validate. For example a
	 * data-control may have one form for insert and another one to edit an
	 * existing record. These forms may have different rules to validate (for
	 * example some fields are mandatory on insert but not on update others on
	 * update but not on insert). Override this function to implement the
	 * decision rules when to invoke the form validation.
	 * 
	 */
	_shouldValidate_ : function() {
		return true;
	},

	/**
	 * For the given field names apply the enabled / disabled state based on the
	 * provided business rules
	 */
	_setFieldsEnabledState_ : function(names, model) {
		if (!model) {
			return;
		}
		var l = names.length;
		for (var i = 0; i < l; i++) {
			var n = names[i];
			var b = !this._canSetEnabled_(n, model);
			this._getElement_(n)._setDisabled_(b);
		}
	},

	/**
	 * For the given field names apply the visible / hidden state based on the
	 * provided business rules
	 */
	_setFieldsVisibleState_ : function(names, model) {
		if (!model)
			return;
		var fields = this.getForm().getFields();
		for (var i = 0, l = names.length; i < l; i++) {
			var n = names[i];
			var b = this._canSetVisible_(n, model);
			this._getElement_(n).setVisible(b);
		}
	},

	_canSetEnabled_ : function(name, model) {
		var fn = this._elems_.get(name)._enableFn_;
		if (fn) {
			return fn.call(this, this._controller_, model);
		} else {
			return true;
		}
	},

	_canSetVisible_ : function(name, model) {
		var fn = this._elems_.get(name)._visibleFn_;
		if (fn) {
			return fn.call(this, this._controller_, model);
		} else {
			return true;
		}
	},

	/**
	 * Helper method to disable the specified fields.
	 */
	_disableElements_ : function(elemNamesArray) {
		for (var i = 0, l = elemNamesArray.length; i < l; i++) {
			this._get_(elemNamesArray[i])._disable_();
		}
	},

	/**
	 * Deprecated
	 */
	_disableFields_ : function(fldNamesArray) {
		this._disableElements_(fldNamesArray);
	},

	/**
	 * Generic validation method which displays an message box for the user.
	 */
	_isValid_ : function() {
		if (this.getForm().isValid()) {
			return true;
		} else {
			this._controller.error(Main.msg.INVALID_FORM, "msg");
			return false;
		}
	},

	// **************** Defaults and overrides *****************

	beforeDestroy : function() {
		// call the contributed helpers from mixins
		this._beforeDestroyDNetDcView_();
		this._beforeDestroyDNetView_();
		this.callParent(arguments);
	},

	// **************** Private methods *****************

	/**
	 * Post-processor run to inject framework specific settings into the
	 * elements.
	 * 
	 */
	_postProcessElem_ : function(item, idx, len) {
		item["_dcView_"] = this;
		if (item.fieldLabel == undefined && item.noLabel !== true) {
			Main.translateField(this._trl_, this._controller_._trl_, item);
		}
		return true;
	},

	/**
	 * Initialize translation class.
	 */
	_initTranslation_ : function() {
		var _trlFqn = this.$className.replace(".ui.extjs.", ".i18n.");
		try {
			if (_trlFqn != this.$className) {
				this._trl_ = Ext.create(_trlFqn);
			}
		} catch (e) {
			// no translation file, ignore
		}
	},

	/**
	 * Translate a frame element.
	 * 
	 * @param {}
	 *            key
	 * @return {}
	 */
	translate : function(key) {
		if (this._trl_ && this._trl_[key]) {
			return this._trl_[key];
		} else {
			return key;
		}
	}

});