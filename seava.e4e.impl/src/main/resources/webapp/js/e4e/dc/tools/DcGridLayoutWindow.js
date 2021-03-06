/**
 * DNet eBusiness Suite. Copyright: Nan21 Electronics SRL. All rights reserved.
 * Use is subject to license terms.
 */
Ext.define("e4e.dc.tools.DcGridLayoutWindow$Model", {
	extend : 'Ext.data.Model',
	fields : [ {
		name : "id",
		type : "string",
		useNull : true
	}, {
		name : "owner",
		type : "string"
	}, {
		name : "name",
		type : "string"
	}, {
		name : "cmp",
		type : "string"
	}, {
		name : "cmpType",
		type : "string"
	}, {
		name : "value",
		type : "string"
	} ]
});

Ext.define("e4e.dc.tools.DcGridLayoutWindow", {
	extend : "Ext.Window",
	_selectedId_ : null,
	_elems_ : null,
	_grid_ : null,

	initComponent : function() {
		this._elems_ = new Ext.util.MixedCollection();

		this._buildItems_();

		Ext.apply(this, arguments);

		Ext.apply(this, {
			closable : true,
			closeAction : 'hide',
			bodyStyle : "padding:10 10 8 5;",
			title : Main.translate("dcGridLayout", "title"),
			width : 400,
			height : 200,
			modal : true,
			buttonAlign : "center",
			items : [ this._elems_.get("panel_manage") ],
			buttons : [ this._elems_.get("btn_apply"),
					this._elems_.get("btn_cancel") ],
			rbar : [ this._elems_.get("btn_save"), this._elems_.get("btn_del"),
					"-", this._elems_.get("btn_share"), "->",
					this._elems_.get("btn_saveas")

			]
		});

		this.callParent(arguments);
	},

	/**
	 * Get the element with the given name
	 */
	_getElement_ : function(name) {
		return Ext.getCmp(this._elems_.get(name).id);

	},

	/**
	 * Get the element configuration with the given name
	 */
	_getElementConfig_ : function(name) {
		return this._elems_.get(name);
	},

	/* ============== handlers ============== */

	/**
	 * Save the selected configuration
	 */
	_doSave_ : function() {
		var s = this._getElement_("fld_views").store;
		var r = s.getById(this._selectedId_);
		r.set("value", Ext.JSON.encode(this._grid_._getViewState_()));
		s.commitChanges();
		this.close();
	},

	_doSaveAs_ : function() {
		Ext.Msg.prompt(Main.translate("dcGridLayout", "saveAs__lbl"), Main.translate("dcGridLayout", "name"), this._onDoSaveAs_, this);
	},

	/**
	 * Save configuration with the given name
	 */
	_onDoSaveAs_ : function(btn, name) {
		if (btn != "ok") {
			return;
		}
		var n = name.trim();
		if (!n) {
			Main.error("invalid_form");
			return true;
		}

		Ext.Ajax.request({
			url : Main.dsAPI(Main.dsName.VIEW_STATE, "json").create,
			method : "POST",
			params : {
				data : Ext.JSON.encode({
					name : name,
					value : Ext.JSON.encode(this._grid_._getViewState_()),
					cmp : this._grid_.stateId,
					cmpType : "frame-dcgrid"
				})
			},
			success : function(response, opts) {
				this.close();
			},
			failure : function(response, opts) {
				Main.error(response.responseText);
			},
			scope : this
		});
	},

	/**
	 * Share the selected configuration with other users
	 */
	_doShare_ : function() {
		alert("Temporarily disabled");
	},

	/**
	 * Delete the selected configuration
	 */
	_doDelete_ : function() {
		var s = this._getElement_("fld_views").store;
		s.remove(s.getById(this._selectedId_));
	},

	/**
	 * Apply the selected view configuration to the grid
	 */
	_doApply_ : function() {
		var _store = this._getElement_("fld_views").store;
		var _rec = _store.getById(this._selectedId_);
		var _value = Ext.JSON.decode(_rec.get("value"));
		this._grid_._applyViewState_(_value);
		this.close();
	},

	/**
	 * Cancel operations.
	 */
	_doCancel_ : function() {
		this.close();
	},

	/**
	 * Prepare query to load states
	 */
	onBeforeLoadStates : function(store, op, eOpts) {
		var p = {};
		p.params = Ext.encode({
			hideMine : this._getElement_("fld_hide_mine").checked,
			hideOthers : this._getElement_("fld_hide_others").checked
		});
		p.data = Ext.encode({
			cmp : this._grid_.stateId
		});
		store.proxy.extraParams.params = p.params;
		store.proxy.extraParams.data = p.data;
	},

	_applyButtonStates_ : function(record) {
		if (record) {
			this._getElement_("btn_apply").enable();
		} else {
			this._getElement_("btn_apply").disable();
		}
		if (record) {
			var _owner = record.data.owner;
			var _user = getApplication().getSession().user.code;
			if (_owner == _user) {
				this._getElement_("btn_save").enable();
				this._getElement_("btn_del").enable();
				this._getElement_("btn_share").enable();

			}
		} else {
			this._getElement_("btn_save").disable();
			this._getElement_("btn_del").disable();
			this._getElement_("btn_share").disable();
		}
	},

	/* ============= build elements ================ */

	_buildItems_ : function() {

		this._buildFields_();
		this._buildButtons_();

		this._elems_.add("panel_manage", {
			xtype : "container",
			layout : {
				type : "form"
			},
			items : [ this._elems_.get("fld_views"),
					this._elems_.get("fld_hide_mine"),
					this._elems_.get("fld_hide_others")

			],
			id : Ext.id()
		});
	},

	/**
	 * Build form buttons.
	 */
	_buildButtons_ : function() {
		this._elems_.add("btn_apply", {
			text : Main.translate("dcGridLayout", "apply__lbl"),
			tooltip : Main.translate("dcGridLayout", "apply__tlp"),
			xtype : "button",
			disabled : true,
			handler : this._doApply_,
			scope : this,
			id : Ext.id()
		});
		this._elems_.add("btn_cancel", {
			text : Main.translate("dcGridLayout", "cancel__lbl"),
			tooltip : Main.translate("dcGridLayout", "cancel__tlp"),
			xtype : "button",
			handler : this._doCancel_,
			scope : this,
			id : Ext.id()
		});

		this._elems_.add("btn_saveas", {
			text : Main.translate("dcGridLayout", "saveAs__lbl"),
			tooltip : Main.translate("dcGridLayout", "saveAs__tlp"),
			xtype : "button",
			handler : this._doSaveAs_,
			scope : this,
			id : Ext.id()
		});
		this._elems_.add("btn_save", {
			text : Main.translate("dcGridLayout", "save__lbl"),
			tooltip : Main.translate("dcGridLayout", "save__tlp"),
			xtype : "button",
			disabled : true,
			handler : this._doSave_,
			scope : this,
			id : Ext.id()
		});
		this._elems_.add("btn_del", {
			text : Main.translate("dcGridLayout", "delete__lbl"),
			tooltip : Main.translate("dcGridLayout", "delete__tlp"),
			xtype : "button",
			disabled : true,
			handler : this._doDelete_,
			scope : this,
			id : Ext.id()
		});
		this._elems_.add("btn_share", {
			text : "Share",
			xtype : "button",
			disabled : true,
			handler : this._doShare_,
			scope : this,
			id : Ext.id()
		});
	},

	/**
	 * Build form fields.
	 */
	_buildFields_ : function() {
		this._elems_.add("fld_views", {

			name : "companyCode",
			fieldLabel : Main.translate("dcGridLayout", "layout"),
			xtype : "combo",
			selectOnFocus : true,
			forceSelection : true,
			autoSelect : true,
			allowBlank : false,
			allQuery : "*",
			queryMode : 'remote',
			allQuery : "%",
			triggerAction : 'query',
			minChars : 0,
			pageSize : 30,
			id : Ext.id(),
			displayField : "name",
			queryMode : 'remote',
			remoteSort : true,
			remoteFilter : true,
			queryDelay : 100,

			listeners : {
				select : {
					scope : this,
					fn : function(combo, recs, eOpts) {
						this._selectedId_ = recs[0].data.id;

						this._applyButtonStates_(recs[0]);
					}
				}
			},
			listConfig : {
				getInnerTpl : function() {
					return "<span>{name} <br> "
							+ " <b>By</b><i>{owner}</i></span>";
				},
				width : 250
			},

			store : Ext.create('Ext.data.Store', {
				model : 'e4e.dc.tools.DcGridLayoutWindow$Model',
				autoSync : true,
				listeners : {
					beforeload : {
						scope : this,
						fn : this.onBeforeLoadStates
					}
				},
				proxy : {
					type : 'ajax',
					api : Main.dsAPI(Main.dsName.VIEW_STATE_LOV, "json"),
					actionMethods : {
						create : 'POST',
						read : 'POST',
						update : 'POST',
						destroy : 'POST'
					},
					reader : {
						type : 'json',
						root : 'data',
						idProperty : 'id',
						totalProperty : 'totalCount'
					},
					writer : {
						type : 'json',
						encode : true,
						root : "data",
						allowSingle : false,
						writeAllFields : true
					},
					listeners : {
						"exception" : {
							fn : this.proxyException,
							scope : this
						}
					},
					startParam : Main.requestParam.START,
					limitParam : Main.requestParam.SIZE,
					sortParam : Main.requestParam.SORT,
					directionParam : Main.requestParam.SENSE
				}

			})

		});

		this._elems_.add("fld_hide_mine", {
			fieldLabel : Main.translate("dcGridLayout", "hideMine"),
			xtype : "checkbox",
			listeners : {
				change : {
					scope : this,
					fn : function(field, nv, ov) {
						this._getElement_("fld_views").store.load();
					}
				}
			},
			id : Ext.id()
		});

		this._elems_.add("fld_hide_others", {
			fieldLabel : Main.translate("dcGridLayout", "hideOther"),
			xtype : "checkbox",
			listeners : {
				change : {
					scope : this,
					fn : function(field, nv, ov) {
						this._getElement_("fld_views").store.load();
					}
				}
			},
			id : Ext.id()
		});

		this._elems_.add("fld_name", {
			fieldLabel : "Name",
			xtype : "textfield",
			id : Ext.id()
		});

		this._elems_.add("fld_public", {
			fieldLabel : "Public",
			xtype : "checkbox",
			id : Ext.id()
		});
	}

});