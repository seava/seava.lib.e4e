Ext.ns("e4e.base");
KeyBindings = {

	/**
	 * Return a textual representation of the given keyboard shortcut
	 * definition.
	 */
	toString : function(b) {
		var r = "";
		if (b.ctrl) {
			r += "Ctrl "
		}
		if (b.shift) {
			r += "Shift "
		}
		if (b.alt) {
			r += "Alt "
		}
		r += b.keyText;
		return r;
	},

	/**
	 * Global keyboard shortcuts
	 */
	values : {
		dc : {
			doNew : {
				keyText : "F2",
				key : Ext.EventObject.F2,
				ctrl : false,
				shift : false,
				alt : false
			},
			doCopy : {
				keyText : "F3",
				key : Ext.EventObject.F3,
				ctrl : false,
				shift : false,
				alt : false
			},
			doDelete : {
				keyText : "F4",
				key : Ext.EventObject.F4,
				ctrl : false,
				shift : false,
				alt : false
			},
			doCancel : {
				keyText : "Z",
				key : Ext.EventObject.Z,
				ctrl : true,
				shift : true,
				alt : false
			},
			doEnterQuery : {
				keyText : "F7",
				key : Ext.EventObject.F7,
				ctrl : false,
				shift : false,
				alt : false
			},
			doClearQuery : {
				keyText : "F7",
				key : Ext.EventObject.F7,
				ctrl : false,
				shift : true,
				alt : false
			},
			doQuery : {
				keyText : "F8",
				key : Ext.EventObject.F8,
				ctrl : false,
				shift : false,
				alt : false
			},
			doSave : {
				keyText : "F10",
				key : Ext.EventObject.F10,
				ctrl : false,
				shift : false,
				alt : false
			},
			doEditIn : {
				keyText : "Enter",
				key : Ext.EventObject.ENTER,
				ctrl : true,
				shift : false,
				alt : false
			},
			doEditOut : {
				keyText : "ESC",
				key : Ext.EventObject.ESC,
				ctrl : false,
				shift : false,
				alt : false
			},
			nextRec : {
				keyText : "Down",
				key : Ext.EventObject.DOWN,
				ctrl : true,
				shift : false,
				alt : false
			},
			prevRec : {
				keyText : "Up",
				key : Ext.EventObject.UP,
				ctrl : true,
				shift : false,
				alt : false
			},
			nextPage : {
				keyText : "Down",
				key : Ext.EventObject.DOWN,
				ctrl : false,
				shift : false,
				alt : true
			},
			prevPage : {
				keyText : "Up",
				key : Ext.EventObject.UP,
				ctrl : false,
				shift : false,
				alt : true
			}
		},

		app : {
			gotoNextTab : {
				keyText : "T",
				key : Ext.EventObject.T,
				ctrl : true,
				shift : true,
				alt : false
			}
		}
	},

	keyEventBelongsToKeyBindings : function(e) {
		for ( var k in this.values.dc) {
			var b = this.values.dc[k];
			if (e.getKey() === b.key && e.altKey === b.alt
					&& e.shiftKey === b.shift && e.ctrlKey === b.ctrl) {
				return b;
			}
		}
		return null;
	},

	createFrameKeyMap : function(theFrameInstance) {
		return new Ext.util.KeyMap({
			target : document.body,
			eventName : "keydown",
			processEvent : function(event, source, options) {
				return event;
			},
			binding : [ Ext.apply(this.values.dc.doEnterQuery, {
				fn : function(keyCode, e) {
					e.stopEvent();
					var ctrl = theFrameInstance._getRootDc_();
					ctrl.doEnterQuery();
				},
				scope : this
			}), Ext.apply(this.values.dc.doClearQuery, {
				fn : function(keyCode, e) {
					e.stopEvent();
					var ctrl = theFrameInstance._getRootDc_();
					ctrl.doClearQuery();
					ctrl.doEnterQuery();
				},
				scope : this
			}), Ext.apply(this.values.dc.doQuery, {
				fn : function(keyCode, e) {
					e.stopEvent();
					var ctrl = theFrameInstance._getRootDc_();
					ctrl.doQuery();
				},
				scope : this
			}), Ext.apply(this.values.dc.doNew, {
				fn : function(keyCode, e) {
					// console.log("indexFrame.doNew");
					e.stopEvent();
					var ctrl = theFrameInstance._getRootDc_();
					ctrl.doNew();
				},
				scope : this
			}), Ext.apply(this.values.dc.doCancel, {
				fn : function(keyCode, e) {
					e.stopEvent();
					var ctrl = theFrameInstance._getRootDc_();
					ctrl.doCancel();
				},
				scope : this
			}), Ext.apply(this.values.dc.doSave, {
				fn : function(keyCode, e) {
					e.stopEvent();
					var ctrl = theFrameInstance._getRootDc_();
					ctrl.doSave();
				},
				scope : this
			}), Ext.apply(this.values.dc.doCopy, {
				fn : function(keyCode, e) {
					e.stopEvent();
					var ctrl = theFrameInstance._getRootDc_();
					ctrl.doCopy();
					ctrl.doEditIn();
				},
				scope : this
			}), Ext.apply(this.values.dc.doEditIn, {
				fn : function(keyCode, e) {
					e.stopEvent();
					var ctrl = theFrameInstance._getRootDc_();
					ctrl.doEditIn();
				},
				scope : this
			}), Ext.apply(this.values.dc.doEditOut, {
				fn : function(keyCode, e) {
					e.stopEvent();
					var ctrl = theFrameInstance._getRootDc_();
					ctrl.doEditOut();
				},
				scope : this
			}), Ext.apply(this.values.dc.nextRec, {
				fn : function(keyCode, e) {
					// console.log("indexFrame.nextRec");
					e.stopEvent();
					var ctrl = theFrameInstance._getRootDc_();
					ctrl.setNextAsCurrent();
				},
				scope : this
			}), Ext.apply(this.values.dc.prevRec, {
				fn : function(keyCode, e) {
					// console.log("indexFrame.prevRec");
					e.stopEvent();
					var ctrl = theFrameInstance._getRootDc_();
					ctrl.setPreviousAsCurrent();
				},
				scope : this
			}), Ext.apply(this.values.dc.nextPage, {
				fn : function(keyCode, e) {
					// console.log("indexFrame.nextPage");
					e.stopEvent();
					theFrameInstance._getRootDc_().nextPage();
				},
				scope : this
			}), Ext.apply(this.values.dc.prevPage, {
				fn : function(keyCode, e) {
					// console.log("indexFrame.prevPage");
					e.stopEvent();
					theFrameInstance._getRootDc_().previousPage();
				},
				scope : this
			}) ]
		});
	},

	createMainKeyMap : function() {

		return new Ext.util.KeyMap({
			target : document.body,
			eventName : "keydown",
			processEvent : function(event, source, options) {
				return event;
			},
			binding : [ Ext.apply(this.values.app.gotoNextTab, {
				fn : function(keyCode, e) {
					e.stopEvent();
					getApplication().gotoNextTab();
				},
				scope : this
			}), Ext.apply(this.values.dc.doClearQuery, {
				fn : function(keyCode, e) {
					e.stopEvent();
					var frame = __application__.getActiveFrameInstance();
					if (frame) {
						ctrl = frame._getRootDc_();
						ctrl.doClearQuery();
						ctrl.doEnterQuery();
					}
				},
				scope : this
			}), Ext.apply(this.values.dc.doEnterQuery, {
				fn : function(keyCode, e) {
					e.stopEvent();
					var frame = __application__.getActiveFrameInstance();
					if (frame) {
						ctrl = frame._getRootDc_();
						ctrl.doEnterQuery();
					}
				},
				scope : this
			}), Ext.apply(this.values.dc.doQuery, {
				fn : function(keyCode, e) {
					e.stopEvent();
					var frame = __application__.getActiveFrameInstance();
					if (frame) {
						ctrl = frame._getRootDc_();
						ctrl.doQuery();
					}
				},
				scope : this
			}), Ext.apply(this.values.dc.doNew, {
				fn : function(keyCode, e) {
					e.stopEvent();
					var frame = __application__.getActiveFrameInstance();
					if (frame) {
						ctrl = frame._getRootDc_();
						ctrl.doNew();
					}
				},
				scope : this
			}), Ext.apply(this.values.dc.doCancel, {
				fn : function(keyCode, e) {
					e.stopEvent();
					var frame = __application__.getActiveFrameInstance();
					if (frame) {
						ctrl = frame._getRootDc_();
						ctrl.doCancel();
					}
				},
				scope : this
			}), Ext.apply(this.values.dc.doSave, {
				fn : function(keyCode, e) {
					e.stopEvent();
					var frame = __application__.getActiveFrameInstance();
					if (frame) {
						ctrl = frame._getRootDc_();
						ctrl.doSave();
					}
				},
				scope : this
			}), Ext.apply(this.values.dc.doCopy, {
				fn : function(keyCode, e) {
					e.stopEvent();
					var frame = __application__.getActiveFrameInstance();
					if (frame) {
						ctrl = frame._getRootDc_();
						ctrl.doCopy();
						ctrl.doEditIn();
					}
				},
				scope : this
			}), Ext.apply(this.values.dc.doEditIn, {
				fn : function(keyCode, e) {
					e.stopEvent();
					var frame = __application__.getActiveFrameInstance();
					if (frame) {
						ctrl = frame._getRootDc_();
						ctrl.doEditIn();
					}
				},
				scope : this
			}), Ext.apply(this.values.dc.doEditOut, {
				fn : function(keyCode, e) {
					e.stopEvent();
					var frame = __application__.getActiveFrameInstance();
					if (frame) {
						ctrl = frame._getRootDc_();
						ctrl.doEditOut();
					}
				},
				scope : this
			}), Ext.apply(this.values.dc.nextRec, {
				fn : function(keyCode, e) {
					// console.log("indexMain.nextRec");
					e.stopEvent();
					var frame = __application__.getActiveFrameInstance();
					if (frame) {
						ctrl = frame._getRootDc_();
						ctrl.setNextAsCurrent();
					}
				},
				scope : this
			}), Ext.apply(this.values.dc.prevRec, {
				fn : function(keyCode, e) {
					// console.log("indexMain.prevRec");
					e.stopEvent();
					var frame = __application__.getActiveFrameInstance();
					if (frame) {
						ctrl = frame._getRootDc_();
						ctrl.setPreviousAsCurrent();
					}
				},
				scope : this
			}), Ext.apply(this.values.dc.nextPage, {
				fn : function(keyCode, e) {
					// console.log("indexMain.nextPage");
					e.stopEvent();
					var frame = __application__.getActiveFrameInstance();
					if (frame) {
						ctrl = frame._getRootDc_();
						ctrl.nextPage();
					}
				},
				scope : this
			}), Ext.apply(this.values.dc.prevPage, {
				fn : function(keyCode, e) {
					// console.log("indexMain.prevPage");
					e.stopEvent();
					var frame = __application__.getActiveFrameInstance();
					if (frame) {
						ctrl = frame._getRootDc_();
						ctrl.previousPage();
					}
				},
				scope : this
			}) ]
		});

	}

};