jQuery.sap.require("sap.ui.core.UIComponent");
jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("sap.abp.eSeparation.approve.Common");
jQuery.sap.declare("sap.abp.eSeparation.approve.Component");

sap.ui.core.UIComponent
		.extend(
				"sap.abp.eSeparation.approve.Component",
				{
					metadata : {
						includes : [],
						dependencies : { // external dependencies
							libs : [ "sap.ui.ux3", "sap.m",
									"sap.suite.ui.commons" ],
							components : []
						},
						routing : {

							config : {
								viewType : "XML",
								viewPath : "sap.abp.eSeparation.approve.views",
								targetAggregation : "masterPages",
								clearTarget : false
							},

							routes : [ {
								pattern : "",
								name : "ReqMaster",
								view : "RequestsMaster",
								targetControl : "splitAppId",
								targetAggregation : "masterPages",
								clearTarget : false,
								subroutes : [ {
									pattern : "{pernr}/:request:",
									name : "ReqDetail",
									view : "RequestsDetail",
									targetAggregation : "detailPages"
								},{
									pattern : "{pernr}/:request:/No Data Found",
									name : "ReqInitial",
									view : "ReqInitial",
									targetAggregation : "detailPages"
								} ]
							} ]

						}
					},

					init : function() {
						jQuery.sap.require("sap.m.routing.RouteMatchedHandler");
						jQuery.sap.require("sap.ui.core.routing.HashChanger");

/////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////    Begin of Addin Launchpad buttons   ///////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////
						  // call the base component's init function
						 //UIComponent.prototype.init.apply(this, arguments);
						
						  var oRendererExt = jQuery.sap.getObject("sap.ushell.renderers.fiori2.RendererExtensions");
						  
						  //Add Language Buttons
						  this.addLanguageButtons(oRendererExt);
/////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////    End of Addin Launchpad buttons   ///////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////

						var mConfig = this.getMetadata().getConfig();

						var oRootPath = jQuery.sap
								.getModulePath("sap.abp.eSeparation.approve");

						// set device model
						var oDeviceModel = new sap.ui.model.json.JSONModel(
								{
									isTouch : sap.ui.Device.support.touch,
									isNoTouch : !sap.ui.Device.support.touch,
									isPhone : sap.ui.Device.system.phone,
									isNoPhone : !sap.ui.Device.system.phone,
									listMode : sap.ui.Device.system.phone ? "None"
											: "SingleSelectMaster",
									listItemType : sap.ui.Device.system.phone ? "Active"
											: "Inactive"
								});
						oDeviceModel.setDefaultBindingMode("OneWay");
						this.setModel(oDeviceModel, "device");

						// call createContent

						sap.ui.core.UIComponent.prototype.init.apply(this,
								arguments);

						this._router = this.getRouter();
						// initialize the router

						this._routeHandler = new sap.m.routing.RouteMatchedHandler(
								this._router);
						this._router.initialize();

					},

					createContent : function() {

						var oView = sap.ui.view({
									id : "app",
									viewName : "sap.abp.eSeparation.approve.views.SplitApp",
									type : sap.ui.core.mvc.ViewType.XML,
									viewData : {
										component : this
									}
								});
						
						var protocol = window.location.protocol;
						var host = window.location.host;	
						
						var oEssMssModel = new sap.ui.model.odata.ODataModel(
								protocol + "//" + host + "/sap/opu/odata/sap/YHR_ESEP_APPROVAL_SRV",
								true);
						
						oEssMssModel._request  ({
				            requestUri: oEssMssModel.sServiceUrl,
				                  method: "GET",
				                  headers:
				                      {"X-Requested-With": "XMLHttpRequest",
				                       "Content-Type": "application/atom+xml",
				                       "DataServiceVersion": "2.0",       
				                       "X-CSRF-Token":"Fetch"   
				                      }           
				               },
				                function (data, response)
				                {
				                     window.header_xcsrf_token = response.headers['x-csrf-token'];
				                }
				         )
						oEssMssModel.setDefaultCountMode(sap.ui.model.odata.CountMode.None);
						oEssMssModel.setDefaultBindingMode(sap.ui.model.BindingMode.TwoWay);
						
						oView.setModel(oEssMssModel, 'esepApr'); // Main
						return oView;
					},

/////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////    Begin of Addin Launchpad buttons   ///////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////
					 addLanguageButtons: function(oRendererExt) {
					
/*					  var toolbar = new sap.m.Toolbar({
					    content: [
					    new sap.m.ToolbarSpacer(),
					    new sap.m.Button({
					      icon: $.sap.getModulePath("com.bluefin.demoshellplugin", "/images/nl.png"),
					      text: "Nederlands",
					      press: jQuery.proxy(function (){
					          this.updateUrl("nl");
					      }, this)
					    }),
					    new sap.m.Button({
					      icon: $.sap.getModulePath("com.bluefin.demoshellplugin", "/images/uk.png"),
					      text: "Help",
					      press: jQuery.proxy(function (){
					          this.updateUrl("en");
					      }, this)
					    })
					  ]
					  });
					  oRendererExt.addSubHeader(toolbar);*/
					  
					var bar = new sap.m.Bar({contentRight: [new sap.m.Button({text: "Help",
								press: function () {
							//	sap.m.MessageToast.show("Pressed");
/*								var protocol = window.location.protocol;
								var host = window.location.host;	
								var url = protocol + "//" + host + "/sap/opu/odata/sap/YHR_HELP_MANUAL_SRV/FileSet('Leave_Attendance.pdf')/$value";
								var encodeUrl = encodeURI(url);
								sap.m.URLHelper.redirect(encodeUrl,true);*/
								

									var hReg = new sap.ui.core.HTML("");
									var h = '430px';
									var w = '830px'; 
						
									var protocol = window.location.protocol;
									var host = window.location.host;
									
									var client = jQuery.sap.getUriParameters().get("sap-client");
									var language = jQuery.sap.getUriParameters().get("sap-ui-language");
									var inputs = document.cookie.split("sap-client=");
									var client1 = inputs[1].split(";");
									var saplang = inputs[0].split("sap-language=");
									var saplang1 = saplang[1].split("&");
									if( language == null ){
									language = saplang1[0];
									}
									if( client == null ){
									client = client1[0];
									}
									
									var src = protocol + "//" + host + "/sap/bc/ui5_ui5/sap/yhr_lvattmanual/index.html?sap-client=" + client + "&sap-ui-language=" + language + "&sap-ui-xx-devmode=true";
									var oContent = '<iframe src="' + src + '" width="' + w + '" height="' + h + '"></iframe>';
									hReg.setContent(oContent);
									if (!this.dialog){	
									this.dialog = new sap.m.Dialog({
										contentWidth  : '840px',
										draggable: true,
										contentHeight : '440px',
										horizontalScrolling : true,
										resizable: true,
										stretch : true,
										stretchOnPhone :true,
										verticalScrolling: true,
										content : hReg,
										width: '850px',
										height: '450px',
										beginButton: new sap.m.Button({ text: 'Close',
																		press: function () {
																		this.dialog.close();
																	}.bind(this)
																})
									});
									
										//to get access to the global model
									//	this.getView().addDependent(this.dialog);
									}
									this.dialog.open();
								
								
								
								
								}})
								]});
								
					var oRenderer = sap.ushell.Container.getRenderer("fiori2");
					oRenderer.showSubHeader([bar.getId()], false, ["app"]);
					
					},
					
					updateUrl: function(sLanguage) {
						var protocol = window.location.protocol;
						var host = window.location.host;	
						var url = protocol + "//" + host + "/sap/opu/odata/sap/YHR_HELP_MANUAL_SRV/FileSet('Leave_Attendance.pdf')/$value";
						var encodeUrl = encodeURI(url);
						sap.m.URLHelper.redirect(encodeUrl,true);
					},
/////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////    End of Addin Launchpad buttons   ///////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////

					exit : function() {
						sap.ui.getCore().byId("app").destroy();
					}

				});