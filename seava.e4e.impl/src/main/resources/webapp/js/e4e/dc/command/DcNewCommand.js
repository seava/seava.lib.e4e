/**
 * DNet eBusiness Suite. Copyright: Nan21 Electronics SRL. All rights reserved.
 * Use is subject to license terms.
 */
Ext.define("e4e.dc.command.DcNewCommand", {
	extend : "e4e.dc.command.AbstractDcSyncCommand",

	dcApiMethod : e4e.dc.DcActionsFactory.CREATE,

	onExecute : function(options) {
		var dc = this.dc;
		var store = dc.store;

		if (!dc.multiEdit && dc.isDirty()) {
			this.dc.warning(Main.msg.DIRTY_DATA_FOUND, "msg");
		}

		var r = dc.newRecordInstance();
		if (dc.dcContext) {
			dc.dcContext._applyContextData_(r);
		}

		var cr = dc.record;
		if (cr != null) {
			dc.setRecord(r, true);
			var idx = store.indexOf(cr);
			store.insert(idx + 1, r);
		} else {

			dc.setRecord(r, true);
			dc.store.add(r);
		}
  
	},

	isActionAllowed : function() {
		if (e4e.dc.DcActionsStateManager.isNewDisabled(this.dc)) {
			this.dc.warning(Main.msg.DC_NEW_NOT_ALLOWED, "msg");
			return false;
		}
		return true;
	}
});