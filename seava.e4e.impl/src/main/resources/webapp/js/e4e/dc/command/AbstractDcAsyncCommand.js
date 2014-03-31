/**
 * DNet eBusiness Suite. Copyright: Nan21 Electronics SRL. All rights reserved.
 * Use is subject to license terms.
 */
/**
 * Abstract base class for asynchronous commands. An asynchronous command is one
 * which involves an AJAX call so that the result is not available immediately.
 */
Ext.define("e4e.dc.command.AbstractDcAsyncCommand", {
	extend : "e4e.dc.command.AbstractDcCommand",

	onAjaxResult : function(ajaxResult) {
		var _m = "afterDo" + this.dcApiMethod + "Result";
		var m = this.dc[_m];
		if (m != undefined && Ext.isFunction(m)) {
			m.call(this.dc, ajaxResult);
		}
		if (ajaxResult.success === true) {
			this.onAjaxSuccess(ajaxResult);
		} else {
			this.onAjaxFailure(ajaxResult);
		}
	},

	onAjaxSuccess : function(ajaxResult) {
		Ext.Msg.hide();
		var _m = "afterDo" + this.dcApiMethod + "Success";
		var m = this.dc[_m];
		if (m != undefined && Ext.isFunction(m)) {
			m.call(this.dc, ajaxResult);
		}
		this.dc.fireEvent(_m, ajaxResult);
	},

	onAjaxFailure : function(ajaxResult) {
		Ext.Msg.hide();
		var _m = "afterDo" + this.dcApiMethod + "Failure";
		this.showAjaxErrors(ajaxResult);
		var m = this.dc[_m];
		if (m != undefined && Ext.isFunction(m)) {
			m.call(this.dc);
		}
		this.dc.fireEvent("afterDo" + this.dcApiMethod + "Success", this.dc,
				ajaxResult);
	},

	/**
	 * Show Ajax errors
	 */
	showAjaxErrors : function(ajaxResult) {
		var msg = null;

		if (ajaxResult.response) {
			msg = ajaxResult.response.responseText;
		} else if (ajaxResult.operation) {
			var err = ajaxResult.operation.error;
			if (err) {
				msg = err.responseText;
			}
		} else if (ajaxResult.batch) {
			var b = ajaxResult.batch;
			if (b.exceptions && b.exceptions[0]) {
				msg = b.exceptions[0].error.responseText;
			}
		}
		Main.serverMessage(msg);
	},

	/**
	 * Private helper function to update values of the given target model (can
	 * be the current filter, current record or the params instance ) with
	 * values returned from server after an AJAX call passed in the source
	 * argument
	 * 
	 * ctrl: Behavior control flags
	 */
	_updateModel : function(target, source, ctrl) {
		var dirty = target.dirty;
		target.beginEdit();
		if (ctrl && ctrl.targetType == "filter") {
			for ( var p in source) {
				this.dc.setFilterValue(p, source[p]);
			}
		} else if (ctrl && ctrl.targetType == "params") {
			for ( var p in source) {
				target.setParamValue(p, source[p]);
			}
		} else {
			for ( var p in source) {
				target.set(p, source[p]);
			}
		}
		target.endEdit();
		if (!dirty) {
			target.commit();
		}
	}

});