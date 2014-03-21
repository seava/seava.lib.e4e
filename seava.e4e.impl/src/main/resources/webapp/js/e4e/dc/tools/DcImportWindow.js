/**
 * DNet eBusiness Suite. Copyright: Nan21 Electronics SRL. All rights reserved.
 * Use is subject to license terms.
 */
Ext.define("e4e.dc.tools.DcImportWindow", {
	extend : "Ext.Window",
	title : Main.translate("cmp", "imp_dp_title"),
	border : true,
	width : 500,
	resizable : false,
	closable : true,
	constrain : true,
	modal : true,
	items : {
		xtype : "form",
		layout : "anchor",
		frame : true,
		url : Main.urlDs + "/import",
		defaultType : "textfield",
		buttonAlign : "center",
		bodyPadding : 10,
		defaults : {
			anchor : "-20"
		},

		fieldDefaults : {
			labelAlign : "right",
			labelWidth : 100,
			msgTarget : "side",
			selectOnFocus : true,
			allowBlank : false
		},

		items : [ {
			xtype : "label",
			html : Main.translate("cmp", "imp_dp_desc")
		}, {
			fieldLabel : Main.translate("cmp", "imp_dp_loc"),
			name : "dataPackage",
			padding : "10 0 0 0"
		} ],

		buttons : [ {
			text : Main.translate("tlbitem", "ok__lbl"),
			formBind : true,
			disabled : true,
			handler : function() {
				var form = this.up("form").getForm();
				form.url = Main.urlDs + "/import";
				if (form.isValid()) {
					Main.working();
					form.submit({						
						success : function(form, action) {
							Ext.Msg.hide();
							Main.info(Main.translate("cmp", "imp_dp_success"));
							this.up("window").close();
						},
						failure : function(form, action) {							 
							Main.serverMessage(action.response.responseText);
						},
						scope : this
					});
				}
			}
		} ]
	}

});
