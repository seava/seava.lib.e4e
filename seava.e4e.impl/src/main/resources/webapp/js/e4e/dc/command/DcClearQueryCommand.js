/**
 * DNet eBusiness Suite. Copyright: Nan21 Electronics SRL. All rights reserved.
 * Use is subject to license terms.
 */
Ext.define("e4e.dc.command.DcClearQueryCommand", {
	extend : "e4e.dc.command.AbstractDcSyncCommand",

	dcApiMethod : e4e.dc.DcActionsFactory.CLEAR_QUERY,

	onExecute : function(options) {

		var dc = this.dc;
		dc.advancedFilter = null;
		var f = dc.filter;

		var fcf = {};
		var fcp = {};

		if (dc.flowContext) {
			fcf = dc.flowContext.filter;
			fcp = dc.flowContext.params;
		}

		// reset fields
		for ( var k in dc.filter.data) {
			if (fcf[k] === undefined) {
				dc.setFilterValue(k, null, false, "clearQuery");
			} else {
				dc.setFilterValue(k, fcf[k], false, "clearQuery");
			}
		}

		// reset params used for filter
		var p = dc.params;
		if (p) {
			for ( var k in p.data) {
				if (p.fields.get(k).forFilter === true) {
					if (fcp[k] === undefined) {
						dc.setParamValue(k, null, false, "clearQuery");
					} else {
						dc.setParamValue(k, fcp[k], false, "clearQuery");
					}
				}
			}
		}

		// apply context filter
		if (dc.dcContext) {
			dc.dcContext._updateChildFilter_();
		}
	}

});