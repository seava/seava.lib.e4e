/**
 * DNet eBusiness Suite. Copyright: Nan21 Electronics SRL. All rights reserved.
 * Use is subject to license terms.
 */
Ext.define("e4e.dc.command.DcDeleteCommand", {
	extend : "e4e.dc.command.AbstractDcAsyncCommand",

	dcApiMethod : e4e.dc.DcActionsFactory.DELETE,

	constructor : function(config) {
		this.callParent(arguments);
		this.confirmByUser = true;
		this.confirmMessageTitle = Main.translate("msg", "dc_confirm_action");
		this.confirmMessageBody = Main.translate("msg",
				"dc_confirm_delete_selection");
	},

	onExecute : function(options) {
		var dc = this.dc;
		dc.store.remove(dc.getSelectedRecords());
		if (!dc.multiEdit) {
			dc.store.sync({
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
		} else {
			dc.doDefaultSelection();
		}
	},

	onAjaxSuccess : function(ajaxResult) {
		this.callParent(arguments);
		this.dc.doDefaultSelection();
		this.dc.fireEvent("afterDoCommitSuccess", this.dc,
				ajaxResult.options.options);
	},

	isActionAllowed : function() {
		if (e4e.dc.DcActionsStateManager.isDeleteDisabled(this.dc)) {
			this.dc.warning(Main.msg.DC_DELETE_NOT_ALLOWED, "msg");
			return false;
		}
		return true;
	}

});