/**
 * DNet eBusiness Suite. Copyright: Nan21 Electronics SRL. All rights reserved.
 * Use is subject to license terms.
 */
/**
 * Creates a form with an upload field and a set of extra fields to be submitted
 * to the server.
 * 
 */
Ext.define("e4e.base.FileUploadWindow2", {
	extend : "Ext.Window",

	_description_ : null,

	_uploadUrl_ : null,

	_handler_ : null,

	/**
	 * Extra fields configuration object as valid Extjs.form.field definition
	 * 
	 * Example: { name1 : { xtype:"hidden", value: "aa", }, name2:{
	 * xtype:"textfield" , value: "x", fieldLabel :"Enter new name for file" }
	 * ..... }
	 * 
	 * The field names are constructed as "_p_"+nameX. A generic upload servlet
	 * on server-side will collect all these params in a java.util.Map and pass
	 * them to the delegate processor. Also will try to inject into the delegate
	 * the parameters if appropriate setters exist.
	 */
	_fields_ : null,

	_succesCallbackFn_ : null,
	_succesCallbackScope_ : null,

	initComponent : function(config) {
		var cfg = {
			title : Main.translate("msg", "upload_title"),
			border : true,
			width : 450,
			resizable : true,
			closable : true,
			closeAction : "hide",
			constrain : true,
			modal : true,
			buttonAlign : "center",
			layout : "fit",
			items : [ {
				xtype : "form",
				padding : 5,
				frame : true,
				fileUpload : true,
				buttonAlign : "center",
				fieldDefaults : {
					labelAlign : "right",
					labelWidth : 140
				},
				items : this._buildFieldsConfig_()
			} ],
			buttons : [ {
				xtype : "button",
				text : Main.translate("msg", "upload_btn"),
				scope : this,
				handler : this.doUpload
			} ],
			_uploadUrl_ : Main.urlUpload + "/" + this._handler_
		};
		Ext.apply(cfg, config);
		Ext.apply(this, cfg);

		this.callParent(arguments);
	},

	_buildFieldsConfig_ : function() {
		var _items = [];
		if (this._description_ != null) {
			_items[_items.length] = {
				xtype : "label",
				text : this._description_
			};
		}
		_items[_items.length] = {
			xtype : "fileuploadfield",
			name : "file",
			fieldLabel : Main.translate("msg", "upload_file"),
			anchor : "-10",
			selectOnFocus : true,
			allowBlank : false
		};
		for ( var k in this._fields_) {
			if (this._fields_.hasOwnProperty(k)) {
				var v = this._fields_[k];
				v["name"] = k;
				_items[_items.length] = v;
			}
		}
		return _items;
	},

	getButton : function() {
		return this.items.get(0).buttons[0];
	},

	getFileField : function() {
		return this.items.get(0).items.get(1);
	},

	getForm : function() {
		return this.items.get(0).getForm();
	},

	doUpload : function(btn, evnt) {
		if (this.getForm().isValid()) {
			this.getForm().submit(
					{
						url : this._uploadUrl_,
						waitMsg : Main.translate("msg", "uploading"),
						scope : this,
						success : function(form, action) {
							try {
								Ext.Msg.hide();
							} catch (e) {

							}
							this.close();
							if (this._succesCallbackFn_ != null) {
								this._succesCallbackFn_
										.call(this._succesCallbackScope_
												|| this);
							}
						},
						failure : function(form, action) {
							try {
								Ext.Msg.hide();
							} catch (e) {

							}
							switch (action.failureType) {
							case Ext.form.Action.CLIENT_INVALID:
								Main.error("INVALID_FORM");
								break;
							case Ext.form.Action.CONNECT_FAILURE:
								Main.error(action.response.responseText);
								break;
							case Ext.form.Action.SERVER_INVALID:
								Main.error(action.response.responseText);
							}
							// this.close();
						}
					});
		} else {
			Main.error("INVALID_FORM");
		}
	}

});