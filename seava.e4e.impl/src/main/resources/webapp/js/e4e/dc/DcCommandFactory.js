/**
 * DNet eBusiness Suite. Copyright: Nan21 Electronics SRL. All rights reserved.
 * Use is subject to license terms.
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
			result["do" + n] = Ext.create("e4e.dc.command.Dc" + n + "Command",
					{
						dc : dc
					});
		}
		return result;
	}

};
