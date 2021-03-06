/**
 * DNet eBusiness Suite. Copyright: Nan21 Electronics SRL. All rights reserved.
 * Use is subject to license terms.
 */
Ext.define("e4e.dc.command.DcRpcFilterCommand", {
	extend : "e4e.dc.command.AbstractDcAsyncCommand",

	dcApiMethod : e4e.dc.DcCommandFactory.RPC_FILTER,

	/**
	 * Call a service on the data-source filter.
	 * 
	 * @param serviceName:
	 *            The name of the data-source service to be executed.
	 * @param options:
	 *            Specifications regarding the execution of this task. Command
	 *            specific attributes: Attributes of specs:
	 *            <li> namr: Name of the server-side RPC </li>
	 *            <li> modal: Boolean flag to show a progress bar during the
	 *            execution of the request to block user interaction.
	 *            <li> context: object with variables you may need in your
	 *            callbacks
	 *            <li> callbacks: Object specifying callback functions to be
	 *            invoked Attributes of callbacks :
	 *            <li>successFn: Callback to execute on successful execution</li>
	 *            <li>successScope: scope of the successFn</li>
	 *            <li>silentSuccess: do not fire the
	 *            afterDoServiceFilterSuccess event</li>
	 *            <li>failureFn: callback to execute on failure</li>
	 *            <li>failureScope: scope of the failureFn</li>
	 *            <li>silentFailure: do not fire the
	 *            <code>afterDoServiceFailure</code> event</li>
	 *            The arguments passed to these functions are described in the
	 *            afterDoServiceFilterSuccess() and
	 *            afterDoServiceFilterFailure() methods which actually invoke
	 *            them.
	 * 
	 */
	onExecute : function(options) {
		var dc = this.dc;
		var serviceName = options.name;
		var s = options || {};
		var p = {
			data : Ext.encode(dc.filter.data)
		};
		if (dc.params != null) {
			p["params"] = Ext.encode(dc.params.data);
		}
		p[Main.requestParam.SERVICE_NAME_PARAM] = serviceName;
		p["rpcType"] = "filter";
		if (s.modal) {
			Main.working();
		}
		Ext.Ajax.request({
			url : Main.dsAPI(dc.dsName, "json").service,
			method : "POST",
			params : p,
			success : this.onAjaxSuccess,
			failure : this.onAjaxFailure,
			scope : this,
			options : options
		});
	}

	/**
	 * Method called after a successful execution of the service. Successful
	 * means that server returns a 200 status code and the success attribute in
	 * the returning json is set to true. It first invokes the task specific
	 * callback then fires the associated event. Both type of callback methods (
	 * the one specified in callbacks and the handler of the fired event) will
	 * be passed the data-control instance (this) followed by the arguments of
	 * this method. If you need a certain callback to be executed each time,
	 * attach an event listener to the fired event.
	 * 
	 * @param response:
	 *            the server response object as received from the ajax request
	 * @param serviceName:
	 *            the name of service which has been executed.
	 * @param specs:
	 *            Specifications regarding the execution of this task.
	 * @See doService()
	 * 
	 */
	,
	onAjaxSuccess : function(response, options) {
		try {
			Ext.Msg.hide();
		} catch (e) {

		}
		var o = options.options || {}, name = o.name, s = o || {};
		var dc = this.dc;
		var r = Ext.decode(response.responseText);

		if (r.success) {
			// filter
			this._updateModel(dc.filter, r.data, {targetType:"filter"});
			// params
			if (r.params) {
				this._updateModel(dc.params, r.params, {targetType:"params"});
			}
		}

		if (s.callbacks && s.callbacks.successFn) {
			s.callbacks.successFn.call(s.callbacks.successScope || dc, dc,
					response, name, options);
		}
		if (!(s.callbacks && s.callbacks.silentSuccess === true)) {
			dc.fireEvent("afterDoServiceFilterSuccess", dc, response, name,
					options);
		}
	}

	/**
	 * Method called when execution of the service fails. Failure means that
	 * server returns anything except a 200 class status code or the success
	 * attribute in the returning json is set to false. It first invokes the
	 * task specific callback then fires the associated event. Both type of
	 * callback methods ( the one specified in callbacks and the handler of the
	 * fired event) will be passed the data-control instance (this) followed by
	 * the arguments of this method. If you need a certain callback to be
	 * executed each time, attach an event listener to the fired event.
	 * 
	 * @param response:
	 *            the server response object as received from the ajax request
	 * @param serviceName:
	 *            the name of service which has been executed.
	 * @param specs:
	 *            Specifications regarding the execution of this task.
	 * @See doService()
	 */
	,
	onAjaxFailure : function(response, options) {
		try {
			Ext.Msg.hide();
		} catch (e) {

		}
		var o = options.options || {}, serviceName = o.name, s = o || {};
		var dc = this.dc;
		Main.serverMessage(response.responseText);
		if (s.callbacks && s.callbacks.failureFn) {
			s.callbacks.failureFn.call(s.callbacks.failureScope || dc, dc,
					response, serviceName, options);
		}
		if (!(s.callbacks && s.callbacks.silentFailure === true)) {
			dc.fireEvent("afterDoServiceFilterFailure", dc, response, name,
					options);
		}
	}

});
