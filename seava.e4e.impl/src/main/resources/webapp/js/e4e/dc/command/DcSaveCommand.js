/**
 * DNet eBusiness Suite. Copyright: Nan21 Electronics SRL. All rights reserved.
 * Use is subject to license terms.
 */
Ext.define("e4e.dc.command.DcSaveCommand", {
	extend : "e4e.dc.command.AbstractDcAsyncCommand",

	dcApiMethod : e4e.dc.DcActionsFactory.SAVE,

	errorTpl : Ext.create('Ext.XTemplate', [
			'<ul style="list-style-type: none;padding:0; margin:0;">',
			'<tpl for=".">', '<li style="list-style-type: none;">',
			'<span class="field-name">', Main.translate("ds", "fld"),
			' `{fieldTitle}` </span>', '<span class="error">{message}</span>',
			'</li></tpl></ul>' ]),

 

	onExecute : function(options) {
		if (this.dc.params != null) {
			this.dc.store.proxy.extraParams.params = Ext.JSON
					.encode(this.dc.params.data);
		}
		Main.working();
		this.dc.store.sync({
			callback : function(batch, options) {
				this.onAjaxResult({
					batch : batch,
					options : options,
					success : !batch.hasException
				});
			},
			scope : this,
			options : options
		});
	},

	onAjaxSuccess : function(ajaxResult) {
		this.callParent(arguments);
		this.dc.fireEvent("afterDoCommitSuccess", this.dc,
				ajaxResult.options.options);
	},

	isActionAllowed : function() {
		if (e4e.dc.DcActionsStateManager.isSaveDisabled(this.dc)) {
			this.dc.info(Main.msg.DC_SAVE_NOT_ALLOWED, "msg");
			return false;
		}
				
		var res = true;
		var dc = this.dc;
		if (!dc.multiEdit) {
			res = this.isValid(dc.getRecord());
		} else {
			if (!this.isValid(dc.store.getUpdatedRecords())) {
				res = false;
			} 
			if (!this.isValid(dc.store.getAllNewRecords())) {
				res = false;
			}
		}
		if (!res) {
			this.dc.info(Main.msg.INVALID_FORM, "msg");
			return false;
		} 		
		return true;
	},

	/**
	 * Add the translated field name to the error info.
	 * 
	 * @param {}
	 *            item
	 * @param {}
	 *            idx
	 * @param {}
	 *            len
	 */
	addFieldNameToError : function(item, idx, len) {
		var v = Main.translateModelField(this.dc._trl_, item.field);
		item["fieldTitle"] = v;
	},

	/**
	 * Validate the given list of records
	 * 
	 * @param {}
	 *            recs
	 * @return {Boolean}
	 */
	isValid : function(recs) {
		if (!Ext.isArray(recs)) {
			recs = [ recs ];
		}
		var len = recs.length;
		var errors = null;
		for (var i = 0; i < len; i++) {
			errors = recs[i].validate();
			if (!errors.isValid()) {
				errors.each(this.addFieldNameToError, this);

				Ext.Msg.show({
					title : 'Invalid data',
					msg : this.errorTpl.apply(errors.getRange()),
					icon : Ext.MessageBox.ERROR,
					buttons : Ext.MessageBox.OK
				});
				return false;
			}
		}
		return true;
	}
});
