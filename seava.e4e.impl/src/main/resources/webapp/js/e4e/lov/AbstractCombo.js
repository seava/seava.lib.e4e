/**
 * DNet eBusiness Suite. Copyright: Nan21 Electronics SRL. All rights reserved.
 * Use is subject to license terms.
 */

Ext.define("e4e.lov.AbstractCombo", {
	extend : "Ext.form.field.ComboBox",
	alias : "widget.xcombo",

	// DNet properties

	/**
	 * 
	 * Link to the dc-view fields to filter the records in this combo.
	 * 
	 * Example: ,filterFieldMapping: [{lovField:"...lovFieldName", dsField:
	 * "...dsFieldName"} ]
	 * 
	 * Or: ,filterFieldMapping: [{lovField:"...lovFieldName", value: "...static
	 * value"} ]
	 */
	filterFieldMapping : null,

	/**
	 * Specify what values should this combo return to the dc-record.
	 * 
	 * @type Array
	 */
	retFieldMapping : null,

	_dataProviderFields_ : null,
	_dataProviderName_ : null,
	_dummyValue_ : null,
	_editFrame_ : null,
	openFrame : null,
	_isLov_ : true,
	_onFocusValue_ : null,

	/**
	 * Data-control view type this field belongs to. Injected by the
	 * corresponding view builder.
	 */
	_dcView_ : null,

	/**
	 * Data model signature - record constructor.
	 * 
	 * @type Ext.data.Model
	 */
	recordModel : null,

	recordModelFqn : null,
	/**
	 * Parameters model signature - record constructor.
	 * 
	 * @type Ext.data.Model
	 */
	paramModel : null,
	/**
	 * Parameters model instance
	 */
	params : null,

	// defaults
	triggerAction : "query",
	matchFieldWidth : false,
	pageSize : 20,
	autoSelect : true,
	minChars : 0,
	queryMode : "remote",

	trigger1Cls : Ext.baseCSSPrefix + 'x-form-trigger',
	trigger2Cls : Ext.baseCSSPrefix + 'form-search-trigger',

	defaultListConfig : {
		minWidth : 70,
		width : 230,
		shadow : "sides",
		autoScroll : true
	},

	autoScroll : true,

	initComponent : function() {
		this._createStore_();
		if (!Ext.isEmpty(this.paramModel)) {
			this.params = Ext.create(this.paramModel, {});
		}
		if (this.retFieldMapping == null) {
			this.retFieldMapping = [];
		}
		if (this.dataIndex) {
			this.retFieldMapping[this.retFieldMapping.length] = {
				lovField : this.displayField,
				dsField : this.dataIndex
			};
		} else if (this.paramIndex) {
			this.retFieldMapping[this.retFieldMapping.length] = {
				lovField : this.displayField,
				dsParam : this.paramIndex
			};
		}
		this.on("select", this.assertValue, this);

		this.on("focus", function() {
			this._onFocusValue_ = this.getRawValue();
		}, this);

		this.callParent(arguments);
	},

	onTrigger2Click : function() {
		if (this._editFrame_ == null) {
			alert("No destination frame specified.");
			return;
		} else {
			if (this._editFrame_.custom == undefined) {
				this._editFrame_.custom = false;
			}
		}
		getApplication().showFrame(
				this._editFrame_.name,
				{
					url : Main.buildUiPath(this._editFrame_.bundle,
							this._editFrame_.name, this._editFrame_.custom),
					tocElement : this._editFrame_.tocElement
				});
	},

	_createStore_ : function() {
		if (this._dataProviderName_ == null) {
			if (Ext.isFunction(this.recordModel)) {
				this.recordModelFqn = this.recordModel.$className;
			}
			this._dataProviderName_ = this.recordModelFqn.substring(
					this.recordModelFqn.lastIndexOf('.') + 1,
					this.recordModelFqn.length);
		}
		this.store = Ext.create("Ext.data.Store", {
			model : this.recordModel,
			remoteSort : true,
			autoLoad : false,
			autoSync : false,
			clearOnPageLoad : true,
			pageSize : this.pageSize,
			proxy : {
				type : 'ajax',
				api : Main.dsAPI(this._dataProviderName_, "json"),
				model : this.recordModel,
				extraParams : {
					params : {}
				},
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
					totalProperty : 'totalCount',
					messageProperty : 'message'
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
		});
	},

	_getTargetRecord_ : function() {
		var drec = null;
		var dcv = this._dcView_;

		if (this.inEditor && dcv._dcViewType_ != "edit-propgrid"
				&& dcv._dcViewType_ != "filter-propgrid") {
			if (dcv && dcv._dcViewType_ == "bulk-edit-field") {
				/*
				 * is a bulk editor for one ds field in a property grid
				 */
				drec = dcv.getSource();
			} else {
				drec = this._targetRecord_;
			}
		} else {
			if (dcv._dcViewType_ == "edit-form"
					|| dcv._dcViewType_ == "edit-propgrid") {
				drec = dcv._controller_.getRecord();
			} else if (dcv._dcViewType_ == "filter-form"
					|| dcv._dcViewType_ == "filter-propgrid") {
				drec = dcv._controller_.getFilter();
			}
		}
		return drec;
	},

	/**
	 * Map fields from the combo-record received as argument (crec) to the
	 * target record according to fieldMappings
	 * 
	 * @param {}
	 *            crec Combo selected record
	 */
	_mapReturnFields_ : function(crec) {
		var dcv = this._dcView_;
		var drec = null;
		var targetIsFilter = false;

		if (this.inEditor && dcv._dcViewType_ != "edit-propgrid"
				&& dcv._dcViewType_ != "filter-propgrid") {
			if (dcv && dcv._dcViewType_ == "bulk-edit-field") {
				/*
				 * is a bulk editor for one ds field in a property grid
				 */
				drec = dcv.getSource();
				this._mapReturnFieldsExecuteBulkEdit_(crec, drec);
			} else {
				drec = this._targetRecord_;
				this._mapReturnFieldsExecute_(crec, drec);
			}
		} else {
			if (dcv._dcViewType_ == "edit-form"
					|| dcv._dcViewType_ == "edit-propgrid") {
				drec = dcv._controller_.getRecord();
			}
			if (dcv._dcViewType_ == "filter-form"
					|| dcv._dcViewType_ == "filter-propgrid") {
				drec = dcv._controller_.getFilter();
				targetIsFilter = true;
			}
			this._mapReturnFieldsExecute_(crec, drec, dcv._controller_
					.getParams(), targetIsFilter);
		}
	},

	_mapReturnFieldsExecuteBulkEdit_ : function(crec, recdata) {
		if (!recdata) {
			return;
		}
		if (this.retFieldMapping != null) {
			for (var i = this.retFieldMapping.length - 1; i >= 0; i--) {

				var retDataIndex = null;
				var nv = null;
				isParam = !Ext.isEmpty(this.retFieldMapping[i]["dsParam"]);
				if (isParam) {
					retDataIndex = this.retFieldMapping[i]["dsParam"];
					ov = prec.get(retDataIndex);
				} else {
					retDataIndex = this.retFieldMapping[i]["dsField"];
					ov = recdata[retDataIndex];
				}

				if (crec && crec.data) {
					nv = crec.data[this.retFieldMapping[i]["lovField"]];
					recdata[retDataIndex] = nv;
				} else {

				}
			}
		}
	},

	/**
	 * Params:<br>
	 * crec: combo selected record <br>
	 * drec - Controller data-record. <br>
	 * The current record or current filter based on the view-type context <br>
	 * prec - Controller params record
	 */
	_mapReturnFieldsExecute_ : function(crec, drec, prec, targetIsFilter) {
		if (!drec) {
			return;
		}
		if (this.retFieldMapping != null) {
			var nv, ov, isParam, rawv = this.getRawValue();

			for (var i = this.retFieldMapping.length - 1; i >= 0; i--) {

				var retDataIndex = null;
				isParam = !Ext.isEmpty(this.retFieldMapping[i]["dsParam"]);
				if (isParam) {
					retDataIndex = this.retFieldMapping[i]["dsParam"];
					ov = prec.get(retDataIndex);
				} else {
					retDataIndex = this.retFieldMapping[i]["dsField"];
					ov = drec.get(retDataIndex);
				}

				if (crec && crec.data) {
					nv = crec.data[this.retFieldMapping[i]["lovField"]];
					if (nv != ov) {
						if (isParam) {
							this._dcView_._controller_.setParamValue(
									retDataIndex, nv);
						} else {
							if (targetIsFilter) {
								this._dcView_._controller_.setFilterValue(
										retDataIndex, nv);
							} else {
								drec.set(retDataIndex, nv);
							}
						}
					}
				} else {

					if (retDataIndex == this.dataIndex) {
						if (this._validateListValue_ && rawv != ov) {
							rawv = null;
							this.setRawValue(rawv);
						}
						if (rawv != ov) {
							if (isParam) {
								this._dcView_._controller_.setParamValue(
										retDataIndex, rawv);
							} else {
								if (targetIsFilter) {
									this._dcView_._controller_.setFilterValue(
											retDataIndex, rawv);
								} else {
									drec.set(retDataIndex, rawv);
								}
							}
						}

					} else {
						if ((ov != null && ov != "")) {
							if (isParam) {
								this._dcView_._controller_.setParamValue(
										retDataIndex, null);
							} else {
								if (targetIsFilter) {
									this._dcView_._controller_.setFilterValue(
											retDataIndex, null);
								} else {
									drec.set(retDataIndex, null);
								}
							}
						}
					}
				}
			}
		}
	},

	_mapFilterFields_ : function(bp) {

		var drec = null;
		var dcv = this._dcView_;
		var prec = dcv._controller_.getParams();

		if (this.inEditor) {
			drec = this._targetRecord_;
			this._mapFilterFieldsExecute_(bp, drec, prec);
		} else {
			if (dcv._dcViewType_ == "edit-form") {
				drec = dcv._controller_.getRecord();
			}
			if (dcv._dcViewType_ == "filter-form") {
				drec = dcv._controller_.getFilter();
			}
			this._mapFilterFieldsExecute_(bp, drec, prec);
		}
	},

	/**
	 * Parameters: bp: base params for the store
	 * 
	 * drec - Controller data-record. The current record or current filter based
	 * on the view-type context prec - Controller params record
	 */
	_mapFilterFieldsExecute_ : function(bp, drec, prec) {
		if (!drec) {
			return;
		}
		if (this.filterFieldMapping != null) {
			var len = this.filterFieldMapping.length;
			for (var i = 0; i < len; i++) {
				var isLovMemberParam = !Ext
						.isEmpty(this.filterFieldMapping[i]["lovParam"]);
				var _val = null;

				if (this.filterFieldMapping[i]["value"] != undefined) {
					_val = this.filterFieldMapping[i]["value"];
				} else {
					if (!Ext.isEmpty(this.filterFieldMapping[i]["dsParam"])) {
						_val = prec.get(this.filterFieldMapping[i]["dsParam"])
					} else {
						_val = drec.get(this.filterFieldMapping[i]["dsField"])
					}
				}

				if (_val == null) {
					_val = "";
				}

				if (isLovMemberParam) {
					this.params.set(this.filterFieldMapping[i]["lovParam"],
							_val);
				} else {
					bp[this.filterFieldMapping[i]["lovField"]] = _val;
				}

			}
		}
	},

	/**
	 * Default proxy-exception handler
	 */
	proxyException : function(proxy, response, operation, eOpts) {
		this.showAjaxErrors(response, eOpts);
	},

	/**
	 * Show errors to user. TODO: Externalize it as command.
	 */
	showAjaxErrors : function(response, options) {
		var msg = null;
		if (response.responseText) {
			msg = response.responseText;
		}
		Main.serverMessage(msg);
	},

	// **************************************************
	// *********************** OVERRIDES ****************
	// **************************************************

	doQuery : function(queryString, forceAll, rawQuery) {
		var bp = {};
		var extraParams = this.store.proxy.extraParams;
		bp[this.displayField] = queryString + "*";

		if (this.filterFieldMapping != null) {
			this._mapFilterFields_(bp);
			this.queryCaching = false;
		}
		extraParams[Main.requestParam.FILTER] = Ext.encode(bp);
		if (this.params != null) {
			extraParams[Main.requestParam.PARAMS] = Ext
					.encode(this.params.data);
		}
		this.callParent(arguments);
	},

	assertValue : function() {
		var me = this;
		var val = me.getRawValue(), rec;

		rec = this.findRecord(this.displayField, val);

		if (rec) {
			this._mapReturnFields_(rec);
			if (val == rec.get(this.displayField)
					&& this.value == rec.get(this.valueField)) {
				return;
			}
			val = rec.get(this.valueField || this.displayField);

			if (this.getRawValue() != val) {
				this.setValue(val);
			}
		} else {
			if (this.forceSelection) {

				if (val != this._onFocusValue_) {

					this.setRawValue(null);
					if (val.length > 0 && val != this.emptyText) {
						this.applyEmptyText();
					} else {
						this.clearValue();
					}
					this._mapReturnFields_(null);

				}
			}
		}

		if (this.isExpanded) {
			this.collapse();
		}

	},

	onKeyUp : function(e, t) {
		var key = e.getKey();
		var kbs = Main.keyBindings.dc;
		var dcv = this._dcView_;
		// bindigs to check
		var btc = null;

		// ignore query related keyboard shortcuts
		if (dcv._dcViewType_ == "filter-form"
				|| dcv._dcViewType_ == "filter-propgrid") {
			btc = [ kbs.doEnterQuery, kbs.doClearQuery, kbs.doQuery,
					kbs.doEditOut ];
			var l = btc.length;
			for (var i = 0; i < l; i++) {
				var b = btc[i];
				if (key == b.key && e.shiftKey == b.shift
						&& e.ctrlKey == b.ctrl && e.altKey == b.alt) {
					return;
				}
			}
		}

		// ignore edit related keyboard shortcuts
		if (dcv._dcViewType_ == "edit-form"
				|| dcv._dcViewType_ == "edit-propgrid") {
			btc = [ kbs.doNew, kbs.doCopy, kbs.doCancel, kbs.doSave,
					kbs.doEditOut, kbs.nextRec, kbs.prevRec, kbs.nextPage,
					kbs.prevPage ];
			var l = btc.length;
			for (var i = 0; i < l; i++) {
				var b = btc[i];
				if (key == b.key && e.shiftKey == b.shift
						&& e.ctrlKey == b.ctrl && e.altKey == b.alt) {
					return;
				}
			}
		}
		this.callParent(arguments);
	}

});