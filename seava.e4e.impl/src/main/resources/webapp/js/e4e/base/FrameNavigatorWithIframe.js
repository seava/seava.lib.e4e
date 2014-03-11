/**
 * DNet eBusiness Suite. Copyright: Nan21 Electronics SRL. All rights reserved.
 * Use is subject to license terms.
 */
e4e.base.FrameNavigatorWithIframe = {

	/**
	 * Maximum number of tabs (application frames) which are allowed to be
	 * opened at a certain moment. Use -1 for unlimited.
	 * 
	 * @type Integer
	 */
	maxOpenTabs : -1,

	/**
	 * When open a new frame, until the translation files are loaded, set the
	 * tab title as the frame fully qualified name or its simple name
	 */
	titleAsSimpleName : true,

	/**
	 * Lookup the application frame instance.
	 * 
	 * @param {}
	 *            frame
	 * @return {}
	 */
	getFrameInstance : function(frame) {
		var theIFrame = window.frames[Constants.CMP_ID.FRAME_IFRAME_PREFIX
				+ frame];
		var theFrameInstance = null;
		if (theIFrame) {
			theFrameInstance = theIFrame.theFrameInstance;
		}
		return theFrameInstance;
	},

	/**
	 * Check if the given frame is already open.
	 * 
	 * @param {}
	 *            frame Frame name
	 * @return {}
	 */
	isFrameOpened : function(frame) {
		return !Ext.isEmpty(document
				.getElementById(Constants.CMP_ID.FRAME_IFRAME_PREFIX + frame))
	},

	/**
	 * Check if the given application frame is active, i.e. the corresponding
	 * tab panel is active.
	 * 
	 * @param {}
	 *            frame
	 * @return {}
	 */
	isFrameActive : function(frame) {
		return (getApplication().getViewBody().getActiveTab().getId() == Constants.CMP_ID.FRAME_TAB_PREFIX);
	},

	/**
	 * Show the given frame. If it is open activate it otherwise open a new tab
	 * and load it there.
	 * 
	 * @param {}
	 *            frame
	 * @param {}
	 *            params
	 */
	showFrame : function(frame, params) {
		this._showFrameImpl(frame, params);
	},

	/**
	 * Internal implementation function.
	 * 
	 * @param {}
	 *            frame
	 * @param {}
	 *            params
	 */
	_showFrameImpl : function(frame, params) {

		if (!(params && params.url)) {
			alert("Programming error: params.url not specified in showFrame!");
			return;
		}

		var resourceType = (params.resourceType) ? params.resourceType : "";
		var tabID = Constants.CMP_ID.FRAME_TAB_PREFIX + resourceType + frame;
		var ifrID = Constants.CMP_ID.FRAME_IFRAME_PREFIX + resourceType + frame;
		var vb = getApplication().getViewBody();

		var tabTtl = frame;
		if (this.titleAsSimpleName) {
			tabTtl = tabTtl.substring(tabTtl.lastIndexOf('.') + 1,
					tabTtl.length);
		}

		if (Ext.isEmpty(document.getElementById(ifrID))
				&& !Ext.isEmpty(window.frames[ifrID])) {
			delete window.frames[ifrID];
		}

		if (this.isFrameOpened(frame)) {
			if (!this.isFrameActive(frame)) {
				vb.setActiveTab(tabID);
			}
		} else {
			if (this.maxOpenTabs > 0
					&& ((vb.items.getCount() + 1) == this.maxOpenTabs)) {
				Ext.Msg
						.alert(
								'Warning',
								'You have reached the maximum number of opened tabs ('
										+ (this.maxOpenTabs)
										+ ').<br> It is not allowed to open more tabs.');
				return;
			}

			var _odfn = function() {
				Ext.destroy(window.frames[this.n21_iframeID].__theViewport__);
				Ext.destroy(window.frames[this.n21_iframeID].theFrameInstance);
				try {
					delete window.frames[this.n21_iframeID];
				} catch (e) {
				}
				this.callParent();
			};

			var beforeCloseFn = function(tab, eOpts) {
				if (window.frames[this.n21_iframeID].theFrameInstance.isDirty()) {

					return confirm("Frame contains un-saved changes which will be lost.\n Would you like to close frame anyway? ");
				}
				return true;
			};

			var _p = new Ext.Panel(
					{
						onDestroy : _odfn,
						title : tabTtl,
						id : tabID,
						n21_iframeID : ifrID,
						autoScroll : true,
						layout : 'fit',
						closable : true,
						listeners : {
							beforeclose : {
								fn : beforeCloseFn
							}
						},
						html : '<div style="width:100%;height:100%;overflow: hidden;" id="div_'
								+ frame
								+ '" ><iframe id="'
								+ ifrID
								+ '" name="'
								+ ifrID
								+ '" src="'
								+ params.url
								+ '" style="border:0;width:100%;height:100%;overflow: hidden" FRAMEBORDER="no"></iframe></div>'
					});
			vb.add(_p);
			vb.setActiveTab(tabID);
		}
	}
};
