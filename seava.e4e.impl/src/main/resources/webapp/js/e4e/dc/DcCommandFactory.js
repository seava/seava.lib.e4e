/**
 * DNet eBusiness Suite. Copyright: Nan21 Electronics SRL. All rights reserved.
 * Use is subject to license terms.
 */
/**
 * RpcDataList contributed by Jan Fockaert
 * 
 */
e4e.dc.DcCommandFactory = {

	RPC_DATA : "RpcData",
	RPC_DATALIST : "RpcDataList",
	RPC_FILTER : "RpcFilter",

	/**
	 * List of command names which are not registered as actions either as they
	 * are internal DC commands or not managed as actions.
	 */
	commandNames : function() {
		return [ this.RPC_DATA, this.RPC_DATALIST, this.RPC_FILTER ];
	},

	/**
	 * Create an object of actions for the given data-control and list of action
	 * names.
	 */
	createCommands : function(dc, names) {

		var result = {};
		for (var i = 0, l = names.length; i < l; i++) {
			var n = names[i];
			result["do" + n] = this["create" + n + "Command"](dc);
		}
		return result;
	},

	createQueryCommand : function(dc) {
		return new e4e.dc.command.DcQueryCommand({
			dc : dc
		});
	},

	createClearQueryCommand : function(dc) {
		return new e4e.dc.command.DcClearQueryCommand({
			dc : dc
		});
	},

	createNewCommand : function(dc) {
		return new e4e.dc.command.DcNewCommand({
			dc : dc
		});
	},

	createCopyCommand : function(dc) {
		return new e4e.dc.command.DcCopyCommand({
			dc : dc
		});
	},

	createSaveCommand : function(dc) {
		return new e4e.dc.command.DcSaveCommand({
			dc : dc
		});
	},

	createCancelCommand : function(dc) {
		return new e4e.dc.command.DcCancelCommand({
			dc : dc
		});
	},

	createDeleteCommand : function(dc) {
		return new e4e.dc.command.DcDeleteCommand({
			dc : dc
		});
	}

	,
	createRpcDataCommand : function(dc) {
		return new e4e.dc.command.DcRpcDataCommand({
			dc : dc
		});
	},

	createRpcDataListCommand : function(dc) {
		return new e4e.dc.command.DcRpcDataListCommand({
			dc : dc
		});
	},

	createRpcFilterCommand : function(dc) {
		return new e4e.dc.command.DcRpcFilterCommand({
			dc : dc
		});
	},

	createEditInCommand : function(dc) {
		return new e4e.dc.command.DcEditInCommand({
			dc : dc
		});
	},

	createEditOutCommand : function(dc) {
		return new e4e.dc.command.DcEditOutCommand({
			dc : dc
		});
	},

	createPrevRecCommand : function(dc) {
		return new e4e.dc.command.DcPrevRecCommand({
			dc : dc
		});
	},

	createNextRecCommand : function(dc) {
		return new e4e.dc.command.DcNextRecCommand({
			dc : dc
		});
	},

	createReloadRecCommand : function(dc) {
		return new e4e.dc.command.DcReloadRecCommand({
			dc : dc
		});
	},

	createReloadPageCommand : function(dc) {
		return new e4e.dc.command.DcReloadPageCommand({
			dc : dc
		});
	}
};
