/**
 * DNet eBusiness Suite. Copyright: Nan21 Electronics SRL. All rights reserved.
 * Use is subject to license terms.
 */
Ext.define("e4e.dc.command.DcNextRecCommand", {
	extend : "e4e.dc.command.AbstractDcSyncCommand",

	dcApiMethod : e4e.dc.DcActionsFactory.NEXT_REC,

	onExecute : function(options) {
		var dc = this.dc;
		if (dc.selectedRecords.length <= 1) {
			var crtIdx = dc.store.indexOf(dc.record);
			if (++crtIdx >= dc.store.getCount()) {
				this.dc.info(Main.msg.AT_LAST_RECORD, "msg");
			} else {
				dc.setRecord(dc.store.getAt(crtIdx), true);
			}
		} else {
			var crtIdx = dc.selectedRecords.indexOf(dc.record);
			if (++crtIdx >= dc.selectedRecords.length) {
				this.dc.info(Main.msg.AT_LAST_RECORD, "msg");
			} else {
				dc.setRecord(dc.selectedRecords[crtIdx], false);
			}
		}
	},

	isActionAllowed : function() {
		if (e4e.dc.DcActionsStateManager.isNextRecDisabled(this.dc)) {
			this.dc.warning(Main.msg.DC_RECORD_CHANGE_NOT_ALLOWED, "msg");
			return false;
		}
		return true;
	}
});
