Ext.define("e4e.dc.tools.DcReport", {

	/**
	 * Run a report. <br>
	 * config: params, url <br>
	 * param definition: code, name, type, lov, value, mandatory, noEdit
	 */
	run : function(config) {

		var params = config.params;
		var serverUrl = config.url;
		if (config.contextPath) {
			serverUrl += config.contextPath;
		}

		var qs = "";
		for (var i = 0, l = params.length; i < l; i++) {
			var p = params[i];
			if (qs != "") {
				qs += "&";
			}
			qs += p.code + "=" + p.value;
		}

		window.open(serverUrl + "?" + qs, "TestReport",
				"width=800,height=600,adressbar=true").focus();

	},

	/**
	 * Set parameter values from the current record of the linked data-control
	 */
	applyDsFieldValues : function(params, data) {
		for (var i = 0, l = params.length; i < l; i++) {
			var p = params[i];
			if (p.dsField) {
				p.value = data[p.dsField];
			}
		}
	},

	/**
	 * Validate the report parameters
	 */
	isValid : function(params) {
		for (var i = 0, l = params.length; i < l; i++) {
			var p = params[i];
			if (!p.value && p.mandatory && !p.noEdit) {
				return false;
			}
		}
	}

});
