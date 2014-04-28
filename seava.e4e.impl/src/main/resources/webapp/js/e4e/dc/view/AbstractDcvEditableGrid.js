/**
 * DNet eBusiness Suite. Copyright: Nan21 Electronics SRL. All rights reserved.
 * Use is subject to license terms.
 */
Ext.define("e4e.dc.view.AbstractDcvEditableGrid", {
	extend : "e4e.dc.view.AbstractDc_Grid",

	// **************** Properties *****************

	/**
	 * Component builder
	 */
	_builder_ : null,

	/**
	 * Flag to switch on/off bulk edit feature
	 */
	_noBulkEdit_ : false,

	/**
	 * Array with field names which are allowed to be bulk-edited.
	 */
	_bulkEditFields_ : null,

	/**
	 * Bulk-editor window.
	 */
	_bulkEditWindow_ : null,

	/**
	 * Ensure the data-control is configured with multiEdit = true otherwise the
	 * grid cannot edit more than one record at a time.
	 */
	_enforceMultiEditDc_ : true,

	/**
	 * Helper property to identify this dc-view type as editable grid.
	 */
	_dcViewType_ : "edit-grid",

	// **************** Public API *****************

	/**
	 * Returns the builder associated with this type of component. Each
	 * predefined data-control view type has its own builder. If it doesn't
	 * exist yet attempts to create it.
	 */
	_getBuilder_ : function() {
		if (this._builder_ == null) {
			this._builder_ = new e4e.dc.view.DcvEditableGridBuilder({
				dcv : this
			});
		}
		return this._builder_;
	},

	/**
	 * Show the bulk-edit window
	 */
	_doBulkEdit_ : function() {
		if (this._controller_.selectedRecords.length == 0) {
			Ext.Msg.show({
				title : "No records selected",
				msg : "Select the records for "
						+ "which you want to apply the changes.",
				icon : Ext.MessageBox.INFO,
				buttons : Ext.Msg.OK
			});
			return;
		}
		if (this._bulkEditWindow_ == null) {
			this._bulkEditWindow_ = new e4e.dc.tools.DcBulkEditWindow({
				_grid_ : this
			});
		}
		this._bulkEditWindow_.show();
	},

	// **************** Defaults and overrides *****************

	/**
	 * 
	 * Override the parent method to add specific functions
	 * 
	 */
	_buildToolbox_ : function(bbitems) {
		this.callParent(arguments);
		if (!this._noBulkEdit_ && this._bulkEditFields_ != null
				&& this._bulkEditFields_.length > 0) {
			bbitems.push("-");
			bbitems.push(this._elems_.get("_btnBulkEdit_"));
		}
	},

	_getBtnBulkEditCfg_ : function() {
		return c = {
			// xtype : "button",
			id : Ext.id(),
			text : Main.translate("dcvgrid", "upd__tlp"),
			handler : this._doBulkEdit_,
			scope : this
		};
	},

	/**
	 * Override parent to add specific elements.
	 */
	_defineDefaultElements_ : function() {
		this.callParent(arguments);
		this._elems_.add("_btnBulkEdit_", this._getBtnBulkEditCfg_());
	},

	beforeEdit : function(context) {
		if (this._controller_.readOnly) {
			return false;
		}
	},

	beforeDestroy : function() {
		this._columns_.each(function(item, idx, len) {
			delete item._dcView_;
			if (item.editor) {
				delete item.editor._dcView_;
			}
		}, this)
		this.callParent(arguments);
	},

	// **************** Private methods *****************

	initComponent : function(config) {
		if (this._enforceMultiEditDc_ && !this._controller_.multiEdit) {
			alert("Editable grids should be used with"
					+ " data-controls having multiEdit enabled.");
		}
		this._initDcGrid_();
		var cfg = this._createDefaultGridConfig_();

		this.plugins = [ Ext.create('Ext.grid.plugin.CellEditing', {
			clicksToEdit : 1,
			pluginId : 'cellEditingPlugin'
		}) ];

		Ext.apply(cfg, {
			selModel : {
				mode : "MULTI",
				listeners : {
					"select" : {
						scope : this,
						fn : function(sm, record, index, eOpts) {
							var ctrl = this._controller_;
							ctrl.selectRecord(record, {
								fromGrid : true,
								grid : this
							});
						}
					},

					"deselect" : {
						scope : this,
						fn : function(sm, record, index, eOpts) {
							var ctrl = this._controller_;
							ctrl.deSelectRecord(record, {
								fromGrid : true,
								grid : this
							});
						}
					},

					"beforedeselect" : {
						scope : this,
						fn : function(sm, record, index, eopts) {
							if (record == this._controller_.record
									&& !this._controller_.dcState
											.isRecordChangeAllowed()) {
								return false;
							}
						}
					}

				}

			}
		});

		if (this._noPaginator_) {
			this._noBulkEdit_ = true;
		}

		Ext.apply(this, cfg);
		this.callParent(arguments);
		this._registerListeners_();
		this._registerKeyBindings_();

		this.on("edit", this._afterEdit_, this);

	},

	/**
	 * Override the Register event listeners
	 */
	_registerListeners_ : function() {

		var ctrl = this._controller_;
		var store = ctrl.store;

		this.mon(ctrl, "selectionChange", this._onController_selectionChange,
				this);
		this.mon(store, "load", this._onStore_load_, this);
		this.mon(store, "write", this._gotoFirstNavigationItem_, this);
		this.mon(store, "remove", this._gotoFirstNavigationItem_, this);
		this.mon(ctrl, "onEditOut", this._gotoFirstNavigationItem_, this);
		this.mon(ctrl, "afterDoQuerySuccess", function(dc, ajaxResult) {
			var o = ajaxResult.options;
			if (!o || o.initiator != "dcContext") {
				this._gotoFirstNavigationItem_();
			}

		}, this);
	},

	_afterEdit_ : function(editor, e, eOpts) {

	},

	_registerKeyBindings_ : function() {
		var map = new Ext.util.KeyMap({
			target : this.view,
			eventName : 'itemkeydown',
			processEvent : function(view, record, node, index, event) {
				event.view = view;
				event.sm = view.getSelectionModel();
				event.store = view.getStore();
				event.record = record;
				event.index = index;
				return event;
			},
			binding : [
					Ext.apply(KeyBindings.values.dc.doEnterQuery, {
						fn : function(keyCode, e) {
							e.stopEvent();
							this._controller_.doEnterQuery();
						},
						scope : this
					}),
					Ext.apply(KeyBindings.values.dc.doClearQuery, {
						fn : function(keyCode, e) {
							e.stopEvent();
							this._controller_.doClearQuery();
							this._controller_.doEnterQuery();
						},
						scope : this
					}),
					Ext.apply(KeyBindings.values.dc.doQuery, {
						fn : function(keyCode, e) {
							e.stopEvent();
							this._controller_.doQuery();
						},
						scope : this
					}),
					Ext.apply(KeyBindings.values.dc.doNew, {
						fn : function(keyCode, e) {
							e.stopEvent();
							this._controller_.doNew();
						},
						scope : this
					}),
					Ext.apply(KeyBindings.values.dc.doCancel, {
						fn : function(keyCode, e) {
							e.stopEvent();
							this._controller_.doCancel();
							this.view.focus();
						},
						scope : this
					}),
					Ext.apply(KeyBindings.values.dc.doSave, {
						fn : function(keyCode, e) {
							e.stopEvent();
							this._controller_.doSave();
						},
						scope : this
					}),
					Ext.apply(KeyBindings.values.dc.doDelete, {
						fn : function(keyCode, e) {
							e.stopEvent();
							this._controller_.doDelete();
						},
						scope : this
					}),
					Ext.apply(KeyBindings.values.dc.doCopy, {
						fn : function(keyCode, e) {
							e.stopEvent();
							this._controller_.doCopy();
						},
						scope : this
					}),
					Ext.apply(KeyBindings.values.dc.nextPage, {
						fn : function(keyCode, e) {
							e.stopEvent();
							this._controller_.doNextPage();
						},
						scope : this
					}),
					Ext.apply(KeyBindings.values.dc.prevPage, {
						fn : function(keyCode, e) {
							// console.log("AbstractDcvGrid.prevPage");
							e.stopEvent();
							this._controller_.doPrevPage();
						},
						scope : this
					}),
					{
						// Start editing the first
						// editable column of the
						// selected row
						key : Ext.EventObject.ENTER,
						ctrl : false,
						shift : false,
						alt : false,
						fn : function(keyCode, e) {
							e.stopEvent();
							var r = this._controller_.record;
							if (r) {
								var _c = null;
								if (r.phantom) {
									var _q = 'gridcolumn:not([hidden]):'
											+ 'not([noEdit]):not([noInsert])';
									_c = this.query(_q);
								} else {
									var _q = 'gridcolumn:not([hidden])'
											+ ':not([noEdit]):not([noUpdate])';
									_c = this.query(_q);
								}
								if (_c != null && _c[0]) {
									this.getPlugin("cellEditingPlugin")
											.startEdit(r, _c[0]);
								}
							}
						},
						scope : this
					} ]
		});
	}
});