/**
 * DNet eBusiness Suite. Copyright: Nan21 Electronics SRL. All rights reserved.
 * Use is subject to license terms.
 */
Ext.define("e4e.base.SelectCompanyWindow", {
	extend : "Ext.Window",
	_grid_ : null,

	initComponent : function() {

		Ext.apply(this, arguments);

		Ext.apply(this, {
			title : Main.translate("cmp", "selcomp_title"),
			border : true,
			width : 350,
			resizable : false,
			closable : true,
			constrain : true,
			modal : true,			 
			items : {
				xtype : "form",
				frame : true,
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
				items : this._buildItems_(),

				/**
				 * Handler. Run in button scope
				 */
				executeTask : function() {
					var v = this.down('combo').displayTplData[0];
					var cmp = getApplication().getSession().company;

					cmp.id = v.id;
					cmp.code = v.code;
					getApplication().onCompanyChange();
					this.up("window").close();
				}
			}
		});

		this.callParent(arguments);
	},

	_buildItems_ : function() {
		return [{
			name : "companyCode",
			fieldLabel : Main.translate("cmp", "selcomp_companyCode"),
			xtype : "combo",
			selectOnFocus : true,
			forceSelection : true,
			autoSelect : true,
			allowBlank : false,
			allQuery : "*",
			queryMode : 'remote',
			allQuery : "%",
			triggerAction: 'query',
			minChars : 0,
			pageSize : 30,
			id : Ext.id(),
			displayField : "code",			 
			queryMode : 'remote',
			queryDelay : 100,
 
			store : Ext.create('Ext.data.Store', {
				fields : [ "id", "code" ],
				proxy : {
					type : 'ajax',
					api : Main.dsAPI(Main.dsName.COMPANY_LOV, "json"),
					actionMethods : {
						read : 'POST'
					},
					reader : {
						type : 'json',
						root : 'data',
						idProperty : 'id',
						totalProperty : 'totalCount'
					},
					startParam : Main.requestParam.START,
					limitParam : Main.requestParam.SIZE,
					sortParam : Main.requestParam.SORT,
					directionParam : Main.requestParam.SENSE
				}
			}) 
		}];
	}

});
