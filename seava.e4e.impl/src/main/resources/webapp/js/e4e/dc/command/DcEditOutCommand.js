/**
 * DNet eBusiness Suite. Copyright: Nan21 Electronics SRL. All rights reserved.
 * Use is subject to license terms.
 */
Ext.define("e4e.dc.command.DcEditOutCommand", {
	extend : "e4e.dc.command.AbstractDcSyncCommand",

	dcApiMethod : e4e.dc.DcActionsFactory.EDIT_OUT,
	
	onExecute : function(options) {
		this.dc.fireEvent("onEditOut", this, options);
	},

	isActionAllowed : function() {
		if (e4e.dc.DcActionsStateManager.isEditOutDisabled(this.dc)) {
			this.dc.warning(Main.msg.DC_EDIT_OUT_NOT_ALLOWED, "msg");
			return false;
		}
		return true;
	}
});
