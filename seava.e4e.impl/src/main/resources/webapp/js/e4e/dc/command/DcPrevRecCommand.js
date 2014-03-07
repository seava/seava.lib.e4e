/**
 * DNet eBusiness Suite. Copyright: Nan21 Electronics SRL. All rights reserved.
 * Use is subject to license terms.
 */
Ext.define("e4e.dc.command.DcPrevRecCommand", {
	extend : "e4e.dc.command.AbstractDcSyncCommand",

	dcApiMethod : e4e.dc.DcActionsFactory.PREV_REC,

	onExecute : function(options) {
		var dc = this.dc;
		if (dc.selectedRecords.length <= 1) {
			var crtIdx = dc.store.indexOf(dc.record);
			if (--crtIdx < 0) {
				this.dc.info(Main.msg.AT_FIRST_RECORD, "msg");
			} else {
				dc.setRecord(dc.store.getAt(crtIdx), true);
			}
		} else {
			var crtIdx = dc.selectedRecords.indexOf(dc.record);
			if (--crtIdx < 0) {
				this.dc.info(Main.msg.AT_FIRST_RECORD, "msg");
			} else {
				dc.setRecord(dc.selectedRecords[crtIdx]);
			}
		}
	},

	isActionAllowed : function() {
		if (e4e.dc.DcActionsStateManager.isPrevRecDisabled(this.dc)) {
			this.dc.info(Main.msg.DC_RECORD_CHANGE_NOT_ALLOWED, "msg");
			return false;
		}
		return true;
	}

});
