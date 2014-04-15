/**
 * DNet eBusiness Suite. Copyright: Nan21 Electronics SRL. All rights reserved.
 * Use is subject to license terms.
 */
Ext.define("e4e.dc.tools.DcFilterWindow", {
	extend : "Ext.Window",

	/**
	 * Target grid on which this advanced filter operates.
	 */
	_grid_ : null,

	/**
	 * The filter grid component.
	 */
	_filterGrid_ : null,

	/**
	 * Filter grid's store
	 */
	_filterStore_ : null,

	/**
	 * Fields combo store
	 */
	_fieldStore_ : null,

	initComponent : function(config) {
		this._buildElements_();
		var cfg = {
			title : Main.translate("dcFilter", "title"),
			border : true,
			width : 500,
			// height:200,
			closeAction : "destroy",
			closable : true,
			constrain : true,
			layout : "fit",
			buttonAlign : "center",
			modal : true,
			items : this._filterGrid_,
			buttons : this._buildButtons_()
		};

		Ext.apply(this, cfg, config);
		this.callParent(arguments);
	},

	_onApply_ : function() {
		var ctrl = this._grid_._controller_;
		var _g = this._grid_; //
		var fr = [];

		//
		this._filterStore_.data.each(function(item, idx, len) {
			var _f = this._fieldStore_.findRecord("title", item.data.title, 0,
					false, true, true);
			var r = {
				fieldName : _f.data.name,
				operation : item.data.operation,
				value1 : item.data.value1,
				value2 : item.data.value2
			}
			fr[fr.length] = r;
		}, this);
		ctrl.advancedFilter = fr;
		ctrl.doQuery();
		this._filterStore_.commitChanges();
		this.close();
	},

	_onClear_ : function() {
		this._filterStore_.removeAll();
		this._grid_._controller_.advancedFilter = null;
		this._grid_._controller_.doQuery();
		this.close();
	},

	_onRemove_ : function() {
		this._filterStore_.remove(this._filterGrid_.getSelectionModel()
				.getSelection());
		var r = this._filterStore_.first();
		this._filterGrid_.getSelectionModel().select(r);
	},

	_onAdd_ : function() {
		this._filterStore_.add({});
		var r = this._filterStore_.last();
		this._filterGrid_.getSelectionModel().select(r);
	},

	_onCopy_ : function() {
		var s = this._filterGrid_.getSelectionModel().getSelection()[0].data;
		this._filterStore_.add({
			field : s.field,
			title : s.title,
			operation : s.operation,
			value1 : s.value1,
			value2 : s.value2
		});
		var r = this._filterStore_.last();
		this._filterGrid_.getSelectionModel().select(r);
	},

	_buildElements_ : function() {

		var af = this._grid_._controller_.advancedFilter;
		var dc = this._grid_._controller_;

		var _items = [];
		if (af != null && Ext.isArray(af)) {
			for (var i = 0, len = af.length; i < len; i++) {
				var r = {
					field : af[i].fieldName,
					title : dc.translateModelField(af[i].fieldName),
					operation : af[i].operation,
					value1 : af[i].value1,
					value2 : af[i].value2
				}
				_items[_items.length] = r;
			}
		}

		this._filterStore_ = Ext.create("Ext.data.Store", {
			fields : [ "field", "title", "operation", "value1", "value2" ],
			data : {
				"items" : _items
			},
			proxy : {
				type : "memory",
				reader : {
					type : "json",
					root : "items"
				}
			}
		});

		this._filterGrid_ = Ext.create("Ext.grid.Panel", {
			height : 200,
			plugins : [ Ext.create('Ext.grid.plugin.CellEditing', {
				clicksToEdit : 1
			}) ],
			store : this._filterStore_,
			dockedItems : [ {
				xtype : 'toolbar',
				dock : 'top',
				items : this._buildFilterGridActions_()
			} ],
			columns : this._buildFilterGridColumns_()
		});
	},

	/**
	 * Create window level buttons.
	 */
	_buildButtons_ : function() {
		return [ {
			text : Main.translate("dcFilter", "apply__lbl"),
			tooltip : Main.translate("dcFilter", "apply__tlp"),
			// iconCls : "icon-action-filter",
			scope : this,
			handler : this._onApply_
		}, {
			text : Main.translate("dcFilter", "clear__lbl"),
			tooltip : Main.translate("dcFilter", "clear__tlp"),
			// iconCls : "icon-action-rollback",
			scope : this,
			handler : this._onClear_
		} ];
	},

	/**
	 * Build toolbar actions.
	 */
	_buildFilterGridActions_ : function() {
		return [ {
			text : Main.translate("dcFilter", "new__lbl"),
			tooltip : Main.translate("dcFilter", "new__tlp"),
			scope : this,
			handler : this._onAdd_
		}, {
			text : Main.translate("dcFilter", "copy__lbl"),
			tooltip : Main.translate("dcFilter", "copy__tlp"),
			scope : this,
			handler : this._onCopy_
		}, {
			text : Main.translate("dcFilter", "delete__lbl"),
			tooltip : Main.translate("dcFilter", "delete__tlp"),
			scope : this,
			handler : this._onRemove_
		} ]
	},

	/**
	 * Build the filter-grid columns.
	 */
	_buildFilterGridColumns_ : function() {
		var _data = [];
		var _trl = this._grid_._controller_._trl_;

		this._grid_._controller_.filter.fields.each(function(item, idx, len) {
			if (!item.name.endsWith("_From") && !item.name.endsWith("_To")) {
				var _n = item.name;
				var _t = Main.translateModelField(_trl, _n);
				_data[_data.length] = {
					name : _n,
					title : _t,
					type : item.type
				}
			}
		})

		this._fieldStore_ = Ext.create("Ext.data.Store", {
			fields : [ "name", "title", "type" ],
			data : _data
		});

		return [
				{
					text : Main.translate("dcFilter", "field"),
					dataIndex : "title",
					width : 150,
					editor : {
						xtype : "combo",
						selectOnFocus : true,
						typeAhead : true,
						queryMode : "local",
						valueField : "title",
						displayField : "title",
						store : this._fieldStore_
					}
				},
				{
					text : Main.translate("dcFilter", "op"),
					dataIndex : "operation",
					editor : {
						xtype : "combo",
						selectOnFocus : true,
						typeAhead : true,
						queryMode : "local",
						store : [ "=", "<>", "<", "<=", ">", ">=", "like",
								"not like", "in", "not in", "between" ]
					}
				}, {
					text : Main.translate("dcFilter", "val1"),
					dataIndex : "value1",
					editor : {
						xtype : "textfield",
						selectOnFocus : true
					}
				}, {
					text : Main.translate("dcFilter", "val2"),
					dataIndex : "value2",
					editor : {
						xtype : "textfield",
						selectOnFocus : true
					}
				} ];
	}

});