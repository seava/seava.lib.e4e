/**
 * DNet eBusiness Suite. Copyright: Nan21 Electronics SRL. All rights reserved.
 * Use is subject to license terms.
 */
Ext.define("e4e.dc.command.DcEditInCommand", {
	extend : "e4e.dc.command.AbstractDcSyncCommand",

	dcApiMethod : e4e.dc.DcActionsFactory.EDIT_IN,

	onExecute : function(options) {
		var dc = this.dc;
		if (dc.trackEditMode) {
			dc.isEditMode = true;
		}
		dc.fireEvent("onEditIn", dc, options);
	},

	isActionAllowed : function() {
		if (this.dc.record == null) {
			this.dc.warning(Main.msg.NO_CURRENT_RECORD, "msg");
			return false;
		}
		return true;
	}
});
