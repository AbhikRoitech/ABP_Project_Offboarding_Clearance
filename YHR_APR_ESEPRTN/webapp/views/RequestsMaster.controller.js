sap.ui.controller("sap.abp.eSeparation.approve.views.RequestsMaster", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf views.RequestsMaster
*/
	onInit: function() {
		this.router = sap.ui.core.UIComponent.getRouterFor(this);
		
		this.oDataModel = sap.ui.getCore().byId("app").getModel('esepApr');
		this.reqModel = new sap.ui.model.json.JSONModel();
    	this.getView().setModel(this.reqModel,"request");
    	var reqModel = this.reqModel;

		this.oDataModel.read("/Emp_headerSet", null, null, false,
				function(oData, response) {
					// set the odata JSON as data of JSON model
					reqModel.setData(oData);
					reqModel.refresh(true);
				});
		this.flag = true;
		
    		if (sap.ui.Device.system.phone) {
    			this.router.attachRoutePatternMatched(this._handleReturn, this);
    		} else {
    			this.router.attachRoutePatternMatched(this._handleRouteMatched,
    					this);
    		}
        
	},

	_handleReturn : function(evt) {
		
		if (evt.getParameter("name") !== "ReqMaster") {
			return;
		}

		var list = this.getView().byId("listReqId");
		var selectedItem = list.getSelectedItem();
		list.setSelectedItem(selectedItem, false);
	},

	_handleRouteMatched : function(evt) {
		
		if (evt.getParameter("name") !== "ReqMaster") {
			return;
		}
		
    	var reqModel = this.reqModel;
		
		sap.ui.core.BusyIndicator.show(0)
		setTimeout(jQuery.proxy(function() {
		if(this.flag === false){
		this.oDataModel.read("/Emp_headerSet", null, null, false,
				function(oData, response) {
					// set the odata JSON as data of JSON model
					reqModel.setData(oData);
					reqModel.refresh(true);
				});
			}
		this.flag = false
		var data =  this.reqModel.getData();
		if(data.results && data.results.length !== 0){
		var list = this.getView().byId("listReqId");
		var selectedItem = list.getItems()[0];
		list.setSelectedItem(selectedItem,true);
		
		this.router.navTo('ReqDetail', {
			pernr : data.results[0].Pernr,
			request: data.results[0].Earqn
		});
		}else{
			this.router.navTo('ReqInitial', {
				pernr : 0,
				request:0
			});
		}
		sap.ui.core.BusyIndicator.hide();
		}, this), 0);
	},
	
	onListItemSelectEmp: function(e){
		var path = e.getSource().getSelectedItem().getBindingContext('request').sPath;
		var data = this.reqModel.getProperty(path);
		this.router.navTo('ReqDetail',{
			pernr: data.Pernr,
			request:data.Earqn
		})
	},
	
	onHandleRefresh : function(evnt) {
		var thisInst = this;
    	var reqModel = this.reqModel;
		this.oDataModel.read("/Emp_headerSet", null, null, false,
				function(oData, response) {
					// set the odata JSON as data of JSON model
					reqModel.setData(oData);
					reqModel.refresh(true);
					thisInst.getView().byId("pullId").hide();
					sap.m.MessageToast.show('Refresh completed');				
			}, function(oError) {
				thisInst.getView().byId("pullId").hide();
				sap.m.MessageToast.show('Refresh could not be done');
			});
	},
/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf views.RequestsMaster
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf views.RequestsMaster
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf views.RequestsMaster
*/
//	onExit: function() {
//
//	}

});