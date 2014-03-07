/**
 * DNet eBusiness Suite. Copyright: Nan21 Electronics SRL. All rights reserved.
 * Use is subject to license terms.
 */
Ext.define("e4e.dc.command.DcReloadPageCommand", {
	extend : "e4e.dc.command.AbstractDcAsyncCommand",

	dcApiMethod : e4e.dc.DcActionsFactory.RELOAD_PAGE,

	beforeExecute : function() {
		return true;
	},

	onExecute : function(options) {
		var dc = this.dc.store.reload();
	},

	isActionAllowed : function() {
		if (e4e.dc.DcActionsStateManager.isQueryDisabled(this.dc)) {
			this.dc.warning(Main.msg.DC_QUERY_NOT_ALLOWED, "msg");
			return false;
		}
		return true;
	}
});
