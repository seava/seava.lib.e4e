/**
 * DNet eBusiness Suite. Copyright: Nan21 Electronics SRL. All rights reserved.
 * Use is subject to license terms.
 */
Ext.define("e4e.dc.command.DcEnterQueryCommand", {
	extend : "e4e.dc.command.AbstractDcSyncCommand",

	dcApiMethod : e4e.dc.DcActionsFactory.ENTER_QUERY,

	onExecute : function(options) {
		this.dc.fireEvent("onEnterQuery", this, options);
	}
});
