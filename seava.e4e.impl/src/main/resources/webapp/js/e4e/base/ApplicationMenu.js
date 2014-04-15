/**
 * DNet eBusiness Suite. Copyright: Nan21 Electronics SRL. All rights reserved.
 * Use is subject to license terms.
 */
Ext.ns("e4e.base");

/**
 * Contributed menus
 */
e4e.base.ApplicationMenu$ContributedMenus = [];

/**
 * Themes
 */
e4e.base.ApplicationMenu$Themes = [ {
	text : Main.translate("appmenuitem", "theme_aqua__lbl"),
	handler : function() {
		getApplication().changeCurrentTheme("dnet-theme-aqua");
	}
} ]

/**
 * Languages
 */
e4e.base.ApplicationMenu$Languages = [ {
	text : "English",
	handler : function() {
		getApplication().changeCurrentLanguage("en");
	}
}, {
	text : "Română",
	handler : function() {
		getApplication().changeCurrentLanguage("ro");
	}
} ]

/**
 * Help items
 */
e4e.base.ApplicationMenu$HelpItems = [

		{
			text : Main.translate("appmenuitem", "tools__lbl"),
			menu : new Ext.menu.Menu(
					{
						items : [
								{
									text : Main
											.translate("dcImp", "title"),
									handler : function() {
										Ext.create(
												"e4e.dc.tools.DcImportWindow",
												{}).show();
									}
								},

								{
									text : Main.translate("appmenuitem",
											"upload_imp__lbl"),
									handler : function() {
										(new e4e.base.FileUploadWindow(
												{
													_handler_ : "dsCsvImport",
													_fields_ : {
														dsName : {
															xtype : "combo",
															fieldLabel : Main
																	.translate(
																			"cmp",
																			"dsName"),
															labelSeparator : "*",
															selectOnFocus : true,
															forceSelection : true,
															allowBlank : false,
															autoSelect : true,
															pageSize : 30,
															id : Ext.id(),
															displayField : "name",
															queryMode : 'remote',
															allQuery : "%",
															triggerAction : 'query',
															minChars : 0,
															matchFieldWidth : false,
															width : 350,
															listConfig : {
																width : 300
															},
															store : Ext
																	.create(
																			'Ext.data.Store',
																			{
																				fields : [
																						"id",
																						"name" ],
																				listeners : {
																					beforeload : {
																						fn : function(
																								store,
																								op,
																								eOpts) {
																							store.proxy.extraParams.data = Ext
																									.encode({
																										name : op.params.query
																												+ "%"
																									});
																						}
																					}
																				},
																				proxy : {
																					type : 'ajax',
																					api : Main
																							.dsAPI(
																									Main.dsName.DS_LOV,
																									"json"),
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
														},
														separator : {
															xtype : "combo",
															store : [ ";", "," ],
															value : ",",
															width : 250,
															fieldLabel : Main
																	.translate(
																			"cmp",
																			"csv_cfg_separator"),
															allowBlank : false,
															labelSeparator : "*"
														},
														quoteChar : {
															xtype : "combo",
															store : [ '"' ],
															value : '"',
															width : 250,
															fieldLabel : Main
																	.translate(
																			"cmp",
																			"csv_cfg_quote"),
															allowBlank : false,
															labelSeparator : "*"
														}
													},
													_succesCallbackScope_ : this,
													_succesCallbackFn_ : function() {
														// this._controller_.doQuery();
													}
												})).show();
									}
								} ]
					})
		}, "-", {
			text : Main.translate("appmenuitem", "frameInspector__lbl"),
			handler : function() {
				(new e4e.base.FrameInspector({})).show();
			}
		}, {
			text : Main.translate("cmp", "keyshortcut_title"),
			handler : function() {
				Ext.create("e4e.base.KeyboardShortcutsWindow", {}).show();
			}
		}, "-", {
			text : Main.translate("appmenuitem", "about__lbl"),
			handler : function() {
				(new Ext.Window({
					bodyPadding : 10,
					title : Main.translate("appmenuitem", "about__lbl"),
					tpl : e4e.base.TemplateRepository.APP_ABOUT,
					data : {
						product : Main.productInfo
					},
					closable : true,
					modal : true,
					resizable : false
				})).show();
			}
		} ]

/**
 * User account management
 */
e4e.base.ApplicationMenu$UserAccount = [ {
	text : Main.translate("appmenuitem", "changepswd__lbl"),
	handler : function() {
		(new e4e.base.ChangePasswordWindow({})).show();
	}
} /*
	 * , { text : Main.translate("appmenuitem", "selectCompany__lbl"), handler :
	 * function() { (new e4e.base.SelectCompanyWindow({})).show(); } }
	 */];

/**
 * Session management
 */
e4e.base.ApplicationMenu$SessionControl = [ {
	text : Main.translate("appmenuitem", "login__lbl"),
	handler : function() {
		getApplication().doLockSession();
	}
}, {
	text : Main.translate("appmenuitem", "logout__lbl"),
	handler : function() {
		getApplication().doLogout();
	}
} ];

/**
 * Main application menu items
 */
e4e.base.ApplicationMenu$Items_ClientUser = [ {
	xtype : "splitbutton",
	text : Main.translate("appmenuitem", "myaccount__lbl"),
	menu : new Ext.menu.Menu({
		items : [ {
			text : Main.translate("appmenuitem", "theme__lbl"),
			menu : new Ext.menu.Menu({
				items : e4e.base.ApplicationMenu$Themes
			})
		}, {
			text : Main.translate("appmenuitem", "lang__lbl"),
			menu : new Ext.menu.Menu({
				items : e4e.base.ApplicationMenu$Languages
			})
		}, "-" ].concat(e4e.base.ApplicationMenu$UserAccount)
	})
}, {
	xtype : "splitbutton",
	text : Main.translate("appmenuitem", "session__lbl"),
	menu : new Ext.menu.Menu({
		items : e4e.base.ApplicationMenu$SessionControl
	})
}, {
	xtype : "splitbutton",
	text : Main.translate("appmenuitem", "help__lbl"),
	menu : new Ext.menu.Menu({
		items : e4e.base.ApplicationMenu$HelpItems
	})

} ];

e4e.base.ApplicationMenu$Items_SystemUser = [ {
	xtype : "splitbutton",
	text : Main.translate("appmenuitem", "myaccount__lbl"),
	menu : new Ext.menu.Menu({
		items : [ {
			text : Main.translate("appmenuitem", "theme__lbl"),
			menu : new Ext.menu.Menu({
				items : e4e.base.ApplicationMenu$Themes
			})
		}, {
			text : Main.translate("appmenuitem", "lang__lbl"),
			menu : new Ext.menu.Menu({
				items : e4e.base.ApplicationMenu$Languages
			})
		} ]
	})
}, {
	xtype : "splitbutton",
	text : Main.translate("appmenuitem", "session__lbl"),
	menu : new Ext.menu.Menu({
		items : e4e.base.ApplicationMenu$SessionControl
	})
}, {
	xtype : "splitbutton",
	text : Main.translate("appmenuitem", "help__lbl"),
	menu : new Ext.menu.Menu({
		items : e4e.base.ApplicationMenu$HelpItems
	})

} ];

/**
 * Database menus
 */
Ext.define("e4e.base.DBMenu", {
	extend : "Ext.menu.Menu"
});

/**
 * Application header.
 */
Ext.define("e4e.base.ApplicationMenu", {
	extend : "Ext.toolbar.Toolbar",

	padding : 0,
	height : 50,
	ui : "appheader",

	systemMenu : null,
	systemMenuAdded : null,

	dbMenu : null,
	dbMenuAdded : null,

	/**
	 * Set the user name in the corresponding element.
	 */
	setUserText : function(v) {
		var _i = this.items.get("e4e.menu.ApplicationMenu$Item$UserName");
		if (_i) {
			_i.setText(v);
		}
	},

	/**
	 * Set the client name in the corresponding element.
	 */
	setClientText : function(v) {
		var _v = (!Ext.isEmpty(v)) ? v : "--";
		var _i = this.items.get("e4e.menu.ApplicationMenu$Item$ClientName");
		if (_i) {
			_i.setText(_v);
		}
	},

	/**
	 * Set the default company name in the corresponding element.
	 */
	setCompanyText : function(v) {
		var _v = (!Ext.isEmpty(v)) ? v : "--";
		var _i = this.items.get("e4e.menu.ApplicationMenu$Item$CompanyName");
		if (_i) {
			_i.setText(_v);
		}
	},

	/**
	 * Create the application logo element using the URL set in Main.logoUrl
	 */
	_createAppLogo_ : function() {
		return {
			xtype : "container",
			height : 48,
			width : 120,
			style : "background: url('" + Main.logo
					+ "') no-repeat ;background-position:center;  "
		}
	},

	/**
	 * Create the application's product info element using the corresponding
	 * properties
	 */
	_createAppInfo_ : function() {
		return {
			xtype : "tbtext",
			id : "e4e.menu.ApplicationMenu$Item$ProductInfo",
			text : "<span>" + Main.productInfo.name + " </span><br><span>"
					+ Main.translate("appmenuitem", "version__lbl") + ": "
					+ Main.productInfo.version + "</span></span>"
		};
	},

	/**
	 * Create the header's left part
	 */
	_createLeft_ : function() {
		return [ this._createAppLogo_(), {
			xtype : "tbspacer",
			width : 10
		} ];
	},

	/**
	 * Create the header's middle part
	 */
	_createMiddle_ : function() {
		var _dbm = [];
		if (Main.navigationTopMenus != null) {
			_dbm = this._createMenus_(Main.navigationTopMenus);
		}
		if (getApplication().session.user.systemUser === true) {
			return _dbm.concat(e4e.base.ApplicationMenu$Items_SystemUser);
		} else {

			return _dbm.concat(e4e.base.ApplicationMenu$Items_ClientUser);
		}
	},

	/**
	 * Create the header's right part
	 */
	_createRight_ : function() {
		return [ "->", {
			xtype : "tbtext",
			id : "e4e.menu.ApplicationMenu$Item$UserLabel",
			text : Main.translate("appmenuitem", "user__lbl")
		}, {
			xtype : "tbtext",
			id : "e4e.menu.ApplicationMenu$Item$UserName",
			text : "--",
			style : "font-weight:bold;"
		}, "-", {
			xtype : "tbtext",
			id : "e4e.menu.ApplicationMenu$Item$ClientLabel",
			text : Main.translate("appmenuitem", "client__lbl")
		}, {
			xtype : "tbtext",
			id : "e4e.menu.ApplicationMenu$Item$ClientName",
			text : "--",
			style : "font-weight:bold;"
		}, {
			xtype : "tbspacer",
			width : 20
		}, this._createAppInfo_() ];
	},

	initComponent : function(config) {

		var _items = [].concat(this._createLeft_(), this._createMiddle_(), this
				._createRight_());

		this.systemMenuAdded = false;

		var cfg = {
			border : false,
			frame : false,
			items : _items
		};

		Ext.apply(this, cfg);
		this.callParent(arguments);

		this.on("afterrender", function() {
			Ext.Function.defer(this._insertDBMenus_, 500, this);
		}, this);
	},

	/**
	 * System client menu management. A system client can manage application
	 * clients (tenants). This feature will be moved in future to a stand-alone
	 * system module where a platform administrator can manage clients as well
	 * as other platform level management tasks.
	 */
	createSystemMenu : function() {
		var list = Main.systemMenus;
		if (!Ext.isEmpty(list) && Ext.isArray(list)) {
			var _items = [];
			for (var i = 0; i < list.length; i++) {
				var e = list[i];
				var t = e.labelKey.split("/");
				var b = e.bundle;
				var f = e.frame;
				var _item = {
					text : Main.translate(t[0], t[1]),
					_bundle : e.bundle,
					_frame : e.frame,
					handler : function() {
						getApplication().showFrameByName(this._bundle,
								this._frame);
					}
				}
				_items[_items.length] = _item;
			}
		}

		var _menu = {
			xtype : "splitbutton",
			text : Main.translate("appmenuitem", "system__lbl"),
			menu : new Ext.menu.Menu({
				items : _items
			})
		};
		this.systemMenu = Ext.create('Ext.button.Split', _menu);
	},

	/**
	 * Add the system client menu to the menu bar
	 */
	addSystemMenu : function() {
		if (!this.systemMenuAdded) {
			this.createSystemMenu();
			// if (this.dbMenu == null) {
			this.insert(2, this.systemMenu);
			// } else {
			// this.insert(2 + this.dbMenu.length, this.systemMenu);
			// }
			this.systemMenuAdded = true;
		}
	},

	/**
	 * Remove the system client menu from the menu bar
	 */
	removeSystemMenu : function() {
		if (this.systemMenuAdded) {
			this.remove(this.systemMenu);
			this.systemMenuAdded = false;
			this.systemMenu = null;
		}
	},

	/**
	 * Insert menu elements loaded from database.
	 */
	_insertDBMenus_ : function() {
		if (this.rendered && this.dbMenu != null && this.dbMenuAdded !== true) {
			var l = this.dbMenu.length;
			for (var i = 0; i < l; i++) {
				this.insert(2 + i, this.dbMenu[i]);
			}
			this.dbMenuAdded = true;
		}
	},

	/**
	 * Create a menu item which opens a standard application frame.
	 */
	_createFrameMenuItem_ : function(config) {
		var bundle_ = config.bundle;
		var frame_ = config.frame;
		var title_ = config.title;
		return {
			text : title_,
			handler : function() {
				var bundle = bundle_;
				var frame = frame_;
				var path = Main.buildUiPath(bundle, frame, false);
				getApplication().showFrame(frame, {
					url : path
				});
			}
		};
	},

	/**
	 * Create an array of menus from an array of configuration objects
	 */
	_createMenus_ : function(cfgArray) {
		var _m = [];
		for (var i = 0; i < cfgArray.length; i++) {
			var e = cfgArray[i];
			if (!e.text) {
				e.text = e.title;
			}
			_m[_m.length] = this._createMenu_(e);
		}
		return _m;
	},

	/**
	 * Create a menu from configuration object
	 */
	_createMenu_ : function(config) {
		return Ext.apply(
				{
					maybeShowMenu : function() {
						if (!this.menu.loader._isLoaded_) {
							if (!this.menu.loader._isLoading_) {
								this.menu.loader.load();
							}
							return false;
						} else {
							var me = this;
							if (me.menu && !me.hasVisibleMenu()
									&& !me.ignoreNextClick) {
								me.showMenu();
							}
						}
					},
					menu : {
						loader : this._createLoader_({
							menu : config.name
						}, true)
					}
				}, config);

	},

	/**
	 * Create a menu-item from configuration object
	 */
	_createMenuMenuItem_ : function(config) {
		return {
			text : config.title,
			deferExpandMenu : function() {
				if (!this.menu.loader._isLoaded_) {
					if (!this.menu.loader._isLoading_) {
						this.menu.loader.load();
					}
					return false;
				} else {
					var me = this;

					if (!me.menu.rendered || !me.menu.isVisible()) {
						me.parentMenu.activeChild = me.menu;
						me.menu.parentItem = me;
						me.menu.parentMenu = me.menu.ownerCt = me.parentMenu;
						me.menu.showBy(me, me.menuAlign,
								((!Ext.isStrict && Ext.isIE) || Ext.isIE6) ? [
										-2, -2 ] : undefined);
					}
				}
			},
			menu : {
				loader : this._createLoader_({
					menuItemId : config.db_id || config.id
				}, true)
			}
		};
	},

	/**
	 * Create a database menu items loader.
	 */
	_createLoader_ : function(params, autoload) {
		return {
			url : Main.dsAPI(Main.dsName.MENU_ITEM, "json").read,
			renderer : 'data',
			autoLoad : autoload,
			_isLoaded_ : false,
			_isLoading_ : false,
			listeners : {
				scope : this,
				beforeload : {
					fn : function(loader, options, eopts) {
						loader._isLoaded_ = false;
						loader._isLoading_ = true;
					}
				},
				load : {
					fn : function(loader, response, options, eopts) {
						var res = Ext.JSON.decode(response.responseText).data;
						var mitems = [];
						for (var i = 0; i < res.length; i++) {
							var e = res[i];
							if (e.leaf) {
								mitems.push(this._createFrameMenuItem_({
									db_id : e.id,
									title : e.text,
									text : e.text,
									frame : e.frame,
									bundle : e.bundle
								}));
							} else {
								mitems.push(this._createMenuMenuItem_({
									db_id : e.id,
									title : e.text,
									text : e.text
								}));
							}
						}
						loader.target.add(mitems);
						loader._isLoaded_ = true;
						loader._isLoading_ = false;
					}
				}
			},
			ajaxOptions : {
				method : "POST"

			},
			params : {
				data : Ext.JSON.encode(params),
				orderBy : Ext.JSON.encode([ {
					property : "sequenceNo",
					direction : "ASC"
				} ])
			}

		};
	}

});
