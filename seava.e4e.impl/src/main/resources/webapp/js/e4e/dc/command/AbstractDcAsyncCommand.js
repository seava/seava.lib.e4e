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
	 * details = { title, message }
	 */
	showError : function(config) {
		var cfg = config || {};
		var t = cfg.title || "Server message";
		var m = cfg.message || "No response received from server.";
		var d = m;
		var withDetails = false;

		if (m.length > 2000) {
			m = m.substr(0, 2000);
			withDetails = true;
		}
		var alertCfg = {
			title : t,
			msg : m,
			scope : this,
			icon : Ext.MessageBox.ERROR,
			buttons : Ext.MessageBox.OK
		}
		if (withDetails) {
			alertCfg.buttons['cancel'] = 'Details';
			alertCfg['detailedMessage'] = d;
		}
		Ext.MessageBox.hide();
		Ext.Msg.show(alertCfg);
	},

	/**
	 * Show Ajax errors
	 */
	showAjaxErrors : function(ajaxResult) {
		if (ajaxResult.response) {
			this.showError({
				message : ajaxResult.response.responseText
			});
			return;
		}
		if (ajaxResult.batch) {
			var b = ajaxResult.batch;
			if (b.exceptions && b.exceptions[0]) {
				this.showError({
					message : b.exceptions[0].error.responseText
				});
				return;
			}
		}
		this.showError({});
	}

});