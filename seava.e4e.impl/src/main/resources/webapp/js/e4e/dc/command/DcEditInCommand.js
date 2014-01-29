/**
 * DNet eBusiness Suite. Copyright: Nan21 Electronics SRL. All rights reserved.
 * Use is subject to license terms.
 */
Ext.define("e4e.dc.command.DcEditInCommand", {
	extend : "e4e.dc.command.AbstractDcSyncCommand",

	onExecute : function(options) {
		this.dc.fireEvent("onEditIn", this, options);
	}
});
