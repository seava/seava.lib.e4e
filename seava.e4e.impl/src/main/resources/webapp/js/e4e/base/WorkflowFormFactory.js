/**
 * DNet eBusiness Suite. Copyright: Nan21 Electronics SRL. All rights reserved.
 * Use is subject to license terms.
 */
e4e.base.WorkflowFormFactory = {

	createStartForm : function(processDefinitionId) {

		var succesFn = function(response, options) {
			var w = new e4e.base.WorkflowFormWithHtmlWindow({
				html : response.responseText,
				_wfConfig_ : {
					type : "startform",
					processDefinitionId : processDefinitionId
				}
			});
			w.show();
		};

		Ext.Ajax.request({
			url : Main.wfProcessDefinitionAPI(processDefinitionId).form,
			method : "GET",
			success : succesFn,
			failure : function() {
				alert('error');
			},
			scope : this
		});

	},

	createTaskForm : function(taskId) {

		var succesFn = function(response, options) {

			var w = new e4e.base.WorkflowFormWithHtmlWindow({
				html : response.responseText,
				_wfConfig_ : {
					type : "taskform",
					taskId : taskId
				}
			});
			w.show();
		};

		Ext.Ajax.request({
			url : Main.wfTaskAPI(taskId).form,
			method : "GET",
			success : succesFn,
			failure : function() {
				alert('error');
			},
			scope : this
		});
	}
};
