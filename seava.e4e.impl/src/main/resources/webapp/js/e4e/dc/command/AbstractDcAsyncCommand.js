/**
 * DNet eBusiness Suite. Copyright: Nan21 Electronics SRL. All rights reserved.
 * Use is subject to license terms.
 */
/**
 * Abstract base class for asynchronous commands. An asynchronous command is one
 * which involves an AJAX call so that the result is not available immediately.
 */
Ext.define("e4e.dc.command.AbstractDcAsyncCommand",
		{

			extend : "e4e.dc.command.AbstractDcCommand",

			onAjaxResult : function(ajaxResult) {

				var m = this.dc['afterDo' + this.dcApiMethod + "Result"];
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
				try {
					Ext.Msg.hide();
				} catch (e) {

				}

				var m = this.dc['afterDo' + this.dcApiMethod + "Success"];
				if (m != undefined && Ext.isFunction(m)) {
					m.call(this.dc, ajaxResult);
				}
				this.dc.fireEvent("afterDo" + this.dcApiMethod + "Success",
						ajaxResult);
			},

			onAjaxFailure : function(ajaxResult) {
				try {
					Ext.Msg.hide();
				} catch (e) {

				}

				this.showAjaxErrors(ajaxResult);

				var m = this.dc['afterDo' + this.dcApiMethod + "Failure"];
				if (m != undefined && Ext.isFunction(m)) {
					m.call(this.dc);
				}
				this.dc.fireEvent("afterDo" + this.dcApiMethod + "Success",
						this.dc, ajaxResult);
			},

			/**
			 * Show Ajax errors
			 */
			showAjaxErrors : function(ajaxResult) {

				try {
					Ext.MessageBox.hide();
				} catch (e) {

				}

				if (ajaxResult.response) {
					var response = ajaxResult.response;
					var msg, withDetails = false;
					if (response.responseText) {
						if (response.responseText.length > 2000) {
							msg = response.responseText.substr(0, 2000);
							withDetails = true;
						} else {
							msg = response.responseText;
						}
					} else {
						msg = "No response received from server.";
					}
					var alertCfg = {
						title : "Server message",
						msg : msg,
						scope : this,
						icon : Ext.MessageBox.ERROR,
						buttons : Ext.MessageBox.OK
					}
					if (withDetails) {
						alertCfg.buttons['cancel'] = 'Details';
						alertCfg['detailedMessage'] = response.responseText;
					}
					Ext.Msg.show(alertCfg);
				}
				if (ajaxResult.batch) {
					var batch = ajaxResult.batch ;
					var msg, withDetails = false;
					
					if (batch.exceptions && batch.exceptions[0] ) {
						if (batch.exceptions[0].error.responseText.length > 2000) {
							msg = batch.exceptions[0].error.responseText.substr(0, 2000);
							withDetails = true;
						} else {
							msg = batch.exceptions[0].error.responseText;
						}
					} else {
						msg = "No response received from server.";
					}
					var alertCfg = {
						title : "Server message",
						msg : msg,
						scope : this,
						icon : Ext.MessageBox.ERROR,
						buttons : Ext.MessageBox.OK
					}
					if (withDetails) {
						alertCfg.buttons['cancel'] = 'Details';
						alertCfg['detailedMessage'] = batch.exceptions[0].error.responseText;
					}
					Ext.Msg.show(alertCfg);
				}

			}

		});