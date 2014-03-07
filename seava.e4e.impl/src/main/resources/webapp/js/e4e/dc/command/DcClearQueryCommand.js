/**
 * DNet eBusiness Suite. Copyright: Nan21 Electronics SRL. All rights reserved.
 * Use is subject to license terms.
 */
Ext.define("e4e.dc.command.DcClearQueryCommand", {
	extend : "e4e.dc.command.AbstractDcSyncCommand",

	dcApiMethod : e4e.dc.DcActionsFactory.CLEAR_QUERY,
	
	onExecute : function(options) {
		var dc = this.dc;

		for ( var k in dc.filter.data) {
			dc.setFilterValue(k, null, false, "clearQuery");
		}
		
		var p = dc.params;
		if (p) {
			for ( var k in dc.params.data) {
				if (p.fields.get(k).forFilter === true) {
					dc.setParamValue(k, null, false, "clearQuery");	
				}
			}
		}
		
		if (dc.dcContext) {
			dc.dcContext._updateChildFilter_();
		}
	}

});