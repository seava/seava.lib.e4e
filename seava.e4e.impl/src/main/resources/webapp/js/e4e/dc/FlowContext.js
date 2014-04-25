Ext.define("e4e.dc.FlowContext", {

	mixins : {
		observable : 'Ext.util.Observable'
	},

	dc : null,

	/**
	 * Filter values
	 */
	filter : null,

	/**
	 * Record values
	 */
	record : null,

	/**
	 * Param values
	 */
	params : null,

	setRecordValues : function(o) {
		this.record = o;
		return this;
	},

	setFilterValues : function(o) {
		this.filter = o;
		for ( var k in o) {
			this.dc.setFilterValue(k, o[k]);
		}
		return this;
	},

	setParamValues : function(o) {
		this.params = o;
		for ( var k in o) {
			this.dc.setParamValue(k, o[k]);
		}
		return this;
	},

	setRecordValue : function(k, v) {
		if (this.record == null) {
			this.record = {};
		}
		this.record[k] = v;
		return this;
	},

	setFilterValue : function(k, v) {
		if (this.filter == null) {
			this.filter = {};
		}
		this.dc.setFilterValue(k, v);
		return this;
	},

	setParamValue : function(k, v) {
		if (this.params == null) {
			this.params = {};
		}
		this.dc.setParamValue(k, v);
		return this;
	},

	reset : function() {
		this.record = null;
		this.filter = null;
		this.params = null;
		return this;
	}

});
