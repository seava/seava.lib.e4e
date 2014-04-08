/**
 * DNet eBusiness Suite. Copyright: Nan21 Electronics SRL. All rights reserved.
 * Use is subject to license terms.
 */
Ext.define("e4e.dc.tools.DcExportWindow", {
	extend : "Ext.Window",
	title : Main.translate("cmp", "exp_title"),
	border : true,
	width : 350,
	resizable : false,
	closable : true,
	constrain : true,
	modal : true,
	_grid_ : null,

	items : {
		xtype : "form",
		frame : true,
		defaultType : "textfield",
		bodyPadding : 10,
		defaults : {
			anchor : "-20"
		},
		buttonAlign : "center",
		fieldDefaults : {
			labelAlign : "right",
			labelWidth : 100,
			msgTarget : "side",
			selectOnFocus : true,
			allowBlank : false
		},

		buttons : [ {
			text : Main.translate("tlbitem", "ok__lbl"),
			formBind : true,
			disabled : true,
			handler : function() {
				this.up("form").executeTask();
			}
		} ],

		items : [ {
			name : "fld_format",
			fieldLabel : Main.translate("cmp", "exp_format"),
			xtype : "combo",
			forceSelection : true,
			triggerAction : "all",
			store : [ "csv", "html", "xml", "json" ],
			value : "csv"
		}, {
			fieldLabel : Main.translate("cmp", "exp_columns"),
			xtype : "radiogroup",
			columns : 1,
			items : [ {
				name : "fld_columns",
				boxLabel : Main.translate("cmp", "exp_col_visible"),
				inputValue : 'visible',
				checked : true
			}, {
				name : "fld_columns",
				boxLabel : Main.translate("cmp", "exp_col_all"),
				inputValue : 'all'
			} ]
		} ],

		/**
		 * Handler. Run in button scope
		 */
		executeTask : function() {

			var form = this.getForm();
			var wdw = this.up("window");
			var grid = wdw._grid_;
			var val = form.getValues();
			var ctrl = grid._controller_;

			var _exp = {
				title : grid._printTitle_,
				layout : val.fld_layout
			};
			var url = Main.dsAPI(ctrl.dsName, val.fld_format);
			var _p = ctrl.buildRequestParamsForQuery();

			var sortCols = "";
			var sortDirs = "";
			var first = true;
			ctrl.store.sorters.each(function(item, idx, len) {
				if (!first) {
					sortCols += ",";
					sortDirs += ",";
				}
				sortCols += item.property;
				sortDirs += item.direction || "ASC";
				first = false;
			}, this);

			_p[Main.requestParam.SORT] = sortCols;
			_p[Main.requestParam.SENSE] = sortDirs;

			var cm = null;
			if (val.fld_columns != "all") {
				cm = grid.down('headercontainer').getVisibleGridColumns();
			} else {
				cm = grid.down('headercontainer').getGridColumns();
			}

			var len = cm.length;
			var _cols = [];
			for (var i = 0; i < len; i++) {
				_cols[_cols.length] = {
					name : cm[i].dataIndex,
					title : cm[i].text.replace(",", " "),
					width : cm[i].width,
					mask : cm[i]._mask_
				}
			}
			_exp.columns = _cols;
			_p[Main.requestParam.EXPORT_INFO] = Ext.encode(_exp);
			_p["download"] = false;

			Ext.Msg.progress(Main.translate("msg", "working"));
			Ext.Ajax.request({
				url : url["exportdata"],
				params : _p,
				success : function(response) {
					Ext.Msg.hide();
					var r = Ext.decode(response.responseText);
					var opts = "adress=yes, width=710, height=450,"
							+ "scrollbars=yes, resizable=yes, menubar=yes";
					var v = window.open(Main.urlDownload + "/" + r.file,
							'Export', opts);
					v.focus();
				},
				failure : function(response) {
					Ext.Msg.hide();
					Main.serverMessage(response.responseText);
				}
			});
			return;
		}
	}

});
