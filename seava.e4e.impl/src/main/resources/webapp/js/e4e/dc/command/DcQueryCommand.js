/**
 * DNet eBusiness Suite. Copyright: Nan21 Electronics SRL. All rights reserved.
 * Use is subject to license terms.
 */
Ext.define("e4e.dc.command.DcQueryCommand", {
	extend : "e4e.dc.command.AbstractDcAsyncCommand",

	dcApiMethod : e4e.dc.DcActionsFactory.RUN_QUERY,

 

	onExecute : function(options) {
		var dc = this.dc;
		var _p = dc.buildRequestParamsForQuery();
		Ext.apply(dc.store.proxy.extraParams, _p);
		dc.store.load({
			callback : function(records, operation, success) {
				this.onAjaxResult({
					records : records,
					response : operation.response,
					operation : operation,
					options : options,
					success : success
				});
			},
			scope : this,
			options : options,
			page : 1
		});
	},

	isActionAllowed : function() {
		if (e4e.dc.DcActionsStateManager.isQueryDisabled(this.dc)) {
			this.dc.warning(Main.msg.DC_QUERY_NOT_ALLOWED, "msg");
			return false;
		}
		var res = true;
		var dc = this.dc;
		if (!dc.filter.isValid()) {
			this.dc.error(Main.msg.INVALID_FILTER, "msg");
			res = false;
		}		
		return res;
	}
});
