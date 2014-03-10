/**
 * DNet eBusiness Suite. Copyright: Nan21 Electronics SRL. All rights reserved.
 * Use is subject to license terms.
 */
/**
 * Abstract base class for any kind of command. Do not directly subclass this
 * one but use one of the provided children depending on what type of command
 * you need. See the synchronous and asynchronous commands for details.
 */
Ext.define("e4e.dc.command.AbstractDcCommand", {

	/**
	 * Data-control on which this command is invoked.
	 * 
	 * @type e4e.dc.AbstractDc
	 */
	dc : null,

	/**
	 * DC API method which delegates to this command
	 * 
	 * @type String
	 */
	dcApiMethod : null,

	/**
	 * Flag to set if this command needs explicit confirmation from the user in
	 * order to execute.
	 */
	confirmByUser : false,

	locked : false,

	/**
	 * User confirmation message title.
	 */
	confirmMessageTitle : "",

	/**
	 * User confirmation message body.
	 */
	confirmMessageBody : "Please confirm action",

	/**
	 * Constructor
	 */
	constructor : function(config) {
		config = config || {};
		Ext.apply(this, config);
		this.callParent(arguments);
	},

	/**
	 * Template method where subclasses or external contexts can provide
	 * additional logic. If it returns false the execution is stopped.
	 */
	beforeExecute : function(options) {
		return true;
	},

	/**
	 * Template method where subclasses or external contexts can provide
	 * additional logic. Called after the execution is finished. ATTENTION:
	 * Commands which initiate AJAX calls do not have the result of the remote
	 * call available here. Provide callbacks for such situations.
	 */
	afterExecute : function(options) {
		if (this.dcApiMethod != null) {
			var m = this.dc["afterDo" + this.dcApiMethod];
			if (m != undefined && Ext.isFunction(m)) {
				m.call(this.dc, options);
			}

			this.dc.fireEvent("afterDo" + this.dcApiMethod, this.dc, options);
		}
	},

	/**
	 * Provide whatever extra-logic to check if the command can be executed.
	 */
	canExecute : function(options) {
		return true;
	},

	/**
	 * Default routine which ask confirmation from the user to proceed. Called
	 * if confirmByUser = true.
	 */
	confirmExecute : function(btn, options) {
		if (!btn) {
			if (confirm(this.confirmMessageBody)) {
				options.confirmed = true;
				this.execute(options);
			}
		}
	},

	needsConfirm : function(options) {
		return this.confirmByUser;
	},

	/**
	 * Calls the appropriate method from the action-state manager.
	 */
	isActionAllowed : function(options) {
		return true;
	},

	/**
	 * Command execution entry point.
	 */
	execute : function(options) {
		try {
			options = options || {};
			if (!this.isActionAllowed(options)) {
				return;
			}

			/*
			 * workaround to enable createInterceptor return false beeing
			 * handled correctly Seems that returnValue=false in
			 * Ext.Function.createInterceptor returns null not the specified
			 * false Used by AbstractDcvForm to inject its own form validation
			 * result.
			 */
			var x = this.beforeExecute(options);
			if (x === false || x == -1) {
				return false;
			}

			if (this.needsConfirm(options) && options.confirmed !== true) {
				this.confirmExecute(null, options);
				return;
			}

			this.onExecute(options);

			this.afterExecute(options);
		} catch (e) {
			Main.error(e);
			throw e;
		}
	},

	/**
	 * Empty template method meant to be overriden by the subclasses.
	 * 
	 */
	onExecute : function(options) {
		alert("Unimplemented onExecute!");
	}

});
