/**
 * DNet eBusiness Suite. Copyright: Nan21 Electronics SRL. All rights reserved.
 * Use is subject to license terms.
 */
Ext.define("e4e.base.KeyboardShortcutsWindow", {

	extend : "Ext.Window",
	title : Main.translate("cmp", "keyshortcut_title"),
	border : true,
	height : 350,
	width : 500,
	layout : 'fit',
	resizable : true,

	bodyPadding : 20,
	closable : true,
	constrain : true,
	modal : true,
	autoScroll : true,

	initComponent : function() {

		var _s = "style=\"padding: 2px 5px 2px 5px;\"";
		var _t = [
				'<table border=1 cellspacing=0>',
				'<tpl for=".">',
				'<tr><td ' + _s + '><i>{key}</i></td><td ' + _s
						+ '>{desc}</td></tpl></table>',
				'<p>' + Main.translate("keyshortcut", "desc") + '</p>' ];

		this.tpl = new Ext.XTemplate(_t);
		var kb = [];
		for ( var k in KeyBindings.values.dc) {
			var b = KeyBindings.values.dc[k];
			var txt = (b.ctrl) ? "Ctrl-" : "";
			txt += (b.alt) ? "Alt-" : "";
			txt += (b.shift) ? "Shift-" : "";
			txt += b.keyText
			kb[kb.length] = {
				key : txt,
				desc : Main.translate("keyshortcut", k)
			}
		}
		this.data = kb;
		this.callParent(arguments);
	}

});