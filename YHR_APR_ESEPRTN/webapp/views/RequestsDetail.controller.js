sap.ui
		.controller(
				"sap.abp.eSeparation.approve.views.RequestsDetail",
				{

					// /*
					// * Called when a controller is instantiated and its View
					// controls (if available)
					// * are already created. Can be used to modify the View
					// before it is displayed,
					// * to bind event handlers and do other one-time
					// initialization.
					// * @memberOf views.RequestsDetail
					// */
					onInit : function() {
						this.oDateFormat = sap.ui.core.format.DateFormat
								.getDateTimeInstance({
									pattern : "yyyyMMdd"
								});
						this.router = sap.ui.core.UIComponent
								.getRouterFor(this);
						this.router.attachRoutePatternMatched(
								this._handleRouteMatched, this);
						this.oDataModel = sap.ui.getCore().byId("app")
								.getModel('esepApr');

						this.detailModel = new sap.ui.model.json.JSONModel();
						this.getView().setModel(this.detailModel, "detail");
						this.picModel = new sap.ui.model.json.JSONModel();
						this.getView().setModel(this.picModel, "pic");
						this.sepHeaderModel = new sap.ui.model.json.JSONModel();
						this.getView().setModel(this.sepHeaderModel,
								'sepHeader');
						this.notesModel = new sap.ui.model.json.JSONModel();
						this.getView().setModel(this.notesModel, 'notes');
						this.createAttachModel = new sap.ui.model.json.JSONModel();
						this.getView().setModel(this.createAttachModel,
								'attachment');
						var userModel = new sap.ui.model.json.JSONModel();
						this.getView().setModel(userModel, 'user');

						this.oDataModel.read("/Emp_f4Set", null, null, true,
								function(oData, response) {
									userModel.setData(oData);
									userModel.refresh(true);
								});

						this.createData = {
							"results" : []
						};
						this.notesData = {
							"results" : []
						};
						this.count;
					},

					_handleRouteMatched : function(evt) {
						if (evt.getParameter("name") !== 'ReqDetail') {
							return;
						}

						this.pernr = evt.getParameter("arguments").pernr;
						this.earqn = evt.getParameter("arguments").request;
						var thisInst = this;

						var detailModel = this.detailModel;

						this.oDataModel.read("EmployeePhotoSet('" + this.pernr
								+ "')/$value", null, null, false, function(
								oData, response) {
							thisInst.picModel.setData({
								"url" : response.requestUri
							});
							thisInst.picModel.refresh(true);
						});
						this.oDataModel.read("Request_detailsSet(Pernr='"
								+ this.pernr + "',Earqn='" + this.earqn + "')",
								null, null, false, function(oData, response) {
									detailModel.setData(oData);
									detailModel.refresh(true);
								});

						this.oDataModel.read(
								"Separation_notesSet?$filter=Pernr eq '"
										+ this.pernr + "' and Earqn eq '"
										+ this.earqn + "'", null, null, false,
								function(oData, oResponse) {
									thisInst.notesModel.setData(oData);
									thisInst.notesModel.refresh(true);
								});

						this.oDataModel
								.read(
										"Separation_headerSet(Pernr='"
												+ this.pernr + "',Earqn='"
												+ this.earqn + "')",
										null,
										null,
										false,
										function(oData, oResponse) {
											oData.LEAVEBAL_UPDATED = +oData.LEAVEBAL_UPDATED;
											thisInst.sepHeaderModel
													.setData(oData);
											thisInst.sepHeaderModel
													.refresh(true);
											if(oData.Fftranstype === "PA"){
												thisInst.getView().byId("RBP-2").setSelected(true);
											}else{
												thisInst.getView().byId("RBP-1").setSelected(true);
											}
											
											var lvbal = thisInst.getView().byId("off_ElbLwds").getValue();
											thisInst.getView().byId("off_Leaveadjbsal").setText(lvbal); 
											
											
										});

						this.oDataModel
								.read(
										"/Separation_attachmentSet?$filter=Pernr eq '"
												+ this.pernr
												+ "' and Earqn eq '"
												+ this.earqn + "'",
										null,
										null,
										false,
										function(oData, oResponse) {

											for (var i = 0; i < oData.results.length; i++) {
												oData.results[i].Url = thisInst.oDataModel.sServiceUrl
														+ "/Sep_attachmentSet(Pernr='"
														+ thisInst.pernr
														+ "',Earqn='"
														+ thisInst.earqn
														+ "',Easqn='"
														+ oData.results[i].Easqn
														+ "')/$value";
											}
											thisInst.createAttachModel
													.setData(oData);
											thisInst.createAttachModel
													.refresh(true);
										});
						this.onPlwdChange();
						
			    // /////////////// START - Code Added by Amit on 13-08-2022 /////////////////
						this.getView().byId("RB2-1").setSelected(false);
						this.getView().byId("RB2-2").setSelected(false);
						this.getView().byId("RB2-3").setSelected(false);
						this.getView().byId("RB2-4").setSelected(false);
						this.getView().byId("RB2-5").setSelected(false);
		    	// /////////////// END - Code Added by Amit on 13-08-2022  /////////////////	
		    	
						if (thisInst.sepHeaderModel.oData.LastWork === thisInst.sepHeaderModel.oData.LastWorkSys_HOD2
								&& thisInst.sepHeaderModel.oData.LastWorkSys_HOD2 !== "") {
							this.getView().byId("RB2-5").setSelected(true);
							/*
							 * var vLwdHod =
							 * sap.abp.eSeparation.approve.Common.formatDate(thisInst.sepHeaderModel.oData.LastWork);
							 * this.getView().byId("dateRelieveId").setValue(vLwdHod);
							 * this.onPlwdChange();
							 */
						} else if (thisInst.sepHeaderModel.oData.LastWork === thisInst.sepHeaderModel.oData.LastWorkSys_HOD
								&& thisInst.sepHeaderModel.oData.LastWorkSys_HOD !== "") {
							this.getView().byId("RB2-4").setSelected(true);
							/*
							 * var vLwdHod =
							 * sap.abp.eSeparation.approve.Common.formatDate(thisInst.sepHeaderModel.oData.LastWork);
							 * this.getView().byId("dateRelieveId").setValue(vLwdHod);
							 * this.onPlwdChange();
							 */
						} else if (thisInst.sepHeaderModel.oData.LastWork === thisInst.sepHeaderModel.oData.LastWorkSys_RM1
								&& thisInst.sepHeaderModel.oData.LastWorkSys_RM1 !== "") {
							this.getView().byId("RB2-3").setSelected(true);
							/*
							 * var vLwdRm1 =
							 * sap.abp.eSeparation.approve.Common.formatDate(thisInst.sepHeaderModel.oData.LastWork);
							 * this.getView().byId("dateRelieveId").setValue(vLwdRm1);
							 * this.onPlwdChange();
							 */
						} else if (thisInst.sepHeaderModel.oData.LastWork === thisInst.sepHeaderModel.oData.R_eardt
								&& thisInst.sepHeaderModel.oData.R_eardt !== "") {
							this.getView().byId("RB2-1").setSelected(true);
							/*
							 * var vLwdEmp =
							 * sap.abp.eSeparation.approve.Common.formatDate(thisInst.sepHeaderModel.oData.LastWork);
							 * this.getView().byId("dateRelieveId").setValue(vLwdEmp);
							 * this.onPlwdChange();
							 */
						} else if (thisInst.sepHeaderModel.oData.LastWork === thisInst.sepHeaderModel.oData.LastWorkSys
								&& thisInst.sepHeaderModel.oData.LastWorkSys !== "") {
							this.getView().byId("RB2-2").setSelected(true);
							/*
							 * var vLwdSys =
							 * sap.abp.eSeparation.approve.Common.formatDate(thisInst.sepHeaderModel.oData.LastWork);
							 * this.getView().byId("dateRelieveId").setValue(vLwdSys);
							 * this.onPlwdChange();
							 */
						}
						var data = this.createAttachModel.getData();
						if(data != null && data != undefined && data.results != null && data.results != undefined ){
							this.item = data.results.length;
						}
					},

					onPlwdChange : function() {
						var sPLWdate = this.sepHeaderModel.oData.LastWorkSys;
						var eResignDt = this.sepHeaderModel.oData.DtReg;
						var date = this.getView().byId("dateRelieveId")
								.getDateValue();
						var dateRelieveEditble = this.getView().byId(
								"dateRelieveId").getEditable();
						var date1 = this.oDateFormat.format(new Date(date));
						var ntcpDiffDays;
						var oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
						// var firstDate = new Date(2008,01,12);
						// var secondDate = new Date(2008,01,22);
						var empResignDt = new Date(eResignDt.substring(0, 4)
								+ "-" + eResignDt.substring(4, 6) + "-"
								+ eResignDt.substring(6));
						var firstDate = new Date(sPLWdate.substring(0, 4), +"-"
								+ sPLWdate.substring(4, 6), sPLWdate
								.substring(6));
						var secondDate = new Date(date1.substring(0, 4) + "-"
								+ date1.substring(4, 6) + "-"
								+ date1.substring(6));
						var today = new Date();
						if ((today > secondDate)
								&& (dateRelieveEditble === true || dateRelieveEditble === "true")) {
							sap.m.MessageToast
									.show("'Proposed last working day' should not be past date");
							return;
						} else if ((firstDate < secondDate)
								&& (dateRelieveEditble === true || dateRelieveEditble === "true")) {
							sap.m.MessageToast
									.show("'Proposed last working day' should not be greater than 'Last working day proposed by System'");
							return;
							/*
							 * sap.m.MessageBox.show("'Proposed last working
							 * day' should not be greater than 'Last working day
							 * proposed by System'", { icon:
							 * sap.m.MessageBox.Icon.ERROR, title: "Error
							 * Message" } ); return;
							 */
						}
						if (empResignDt > secondDate) {
							ntcpDiffDays = Math.round(Math.abs((secondDate
									.getTime() - empResignDt.getTime())
									/ (oneDay)));
						} else {
							ntcpDiffDays = Math.round(Math.abs((empResignDt
									.getTime() - secondDate.getTime())
									/ (oneDay)));
						}
						var ntcp = ntcpDiffDays + 1;
						this.getView().byId("tNtcp").setText(ntcp);

						// var shntDiffDays =
						// Math.round(Math.abs((firstDate.getTime() -
						// secondDate.getTime())/(oneDay)));
						// var shortNotice = shntDiffDays + 1 -
						// this.sepHeaderModel.oData.LeaveBal;
						var shortNotice = this.sepHeaderModel.oData.NtcprdOffer
								- ntcp; // -
						// this.sepHeaderModel.oData.LeaveBal;
						// //
						// Removed
						// leave
						// balance
						// from
						// short
						// notice
						// calculation
						// as
						// requested
						// by
						// business
						this.getView().byId("shortNotice").setText(shortNotice);
						var shortNoticeWvr = this.getView().byId(
								"shortNoticeWvr").getValue();
						if ((shortNoticeWvr < 0 || shortNoticeWvr > shortNotice)
								&& this.getView().byId("shortNoticeWvr")
										.getVisible() === true) {
							sap.m.MessageToast
									.show("Please enter correct 'Short Notice Waiver' value");
							return;
						}
						
						var leaveadjASN = this.getView().byId("leaveadjASN")
						.getValue();
						if ((leaveadjASN < 0 || leaveadjASN > shortNotice || leaveadjASN > shortNotice)
								&& this.getView().byId("shortNoticeWvr")
										.getVisible() === true) {
							sap.m.MessageToast
									.show("Please enter correct 'Adjustment of Leave against Short Notice' value");
							return;
						}
						
						var shortNoticeDdctn = shortNotice - shortNoticeWvr - leaveadjASN;
						this.getView().byId("shortNoticeDdctn").setText(
								shortNoticeDdctn);
					},

					onFnfCheckhand : function() {
						if (this.getView().byId("sumbitIDCard").getSelected() === false
								|| this.getView().byId("fandF").getSelected() === false) {
							sap.m.MessageBox.show(
									"Please check above two checkboxes", {
										icon : sap.m.MessageBox.Icon.ERROR,
										title : "Error Message"
									});
							this.getView().byId("fnfCheckhand").setDateValue();
							return;
						}
						var date = this.getView().byId("fnfCheckhand")
								.getDateValue();
						var date1 = this.oDateFormat.format(new Date(date));
						var secondDate = new Date(date1.substring(0, 4) + "-"
								+ date1.substring(4, 6) + "-"
								+ date1.substring(6));
						var today = new Date();
						if (today < secondDate) {
							sap.m.MessageBox
									.show(
											"'Full and Final cheque handed over Date' should not be future date",
											{
												icon : sap.m.MessageBox.Icon.ERROR,
												title : "Error Message"
											});
							this.getView().byId("fnfCheckhand").setDateValue();
							return;
						}
					},

					onLwdRdb : function() {
						if (this.getView().byId("RB2-1").getSelected() === true) {
							var vLwdEmp = this.getView().byId("tLwdEmp")
									.getText();
							this.getView().byId("dateRelieveId").setValue(
									vLwdEmp);
							this.onPlwdChange();
						} else if (this.getView().byId("RB2-2").getSelected() === true) {
							var vLwdSys = this.getView().byId("tLwdSys")
									.getText();
							this.getView().byId("dateRelieveId").setValue(
									vLwdSys);
							this.onPlwdChange();
						} else if (this.getView().byId("RB2-3").getSelected() === true) {
							var vLwdRm1 = this.getView().byId("tLwdRm1")
									.getText();
							this.getView().byId("dateRelieveId").setValue(
									vLwdRm1);
							this.onPlwdChange();
						} else if (this.getView().byId("RB2-4").getSelected() === true) {
							var vLwdHod = this.getView().byId("tLwdHod")
									.getText();
							this.getView().byId("dateRelieveId").setValue(
									vLwdHod);
							this.onPlwdChange();
						} else if (this.getView().byId("RB2-5").getSelected() === true) {
							var vLwdHod2 = this.getView().byId("tLwdHod2")
									.getText();
							this.getView().byId("dateRelieveId").setValue(
									vLwdHod2);
							this.onPlwdChange();
						}
					},

					onshrtNtcWvr : function(oEvent) {
						var shrtNt = this.getView().byId("shortNotice")
								.getText();
						var shrtNWvr = this.getView().byId("shortNoticeWvr")
								.getValue();
						var leaveadjASN = this.getView().byId("leaveadjASN")
						.getValue();
						/*
						 * var epos = shrtNWvr.indexOf("e"); if ((epos !== -1 ||
						 * shrtNWvr === "") &&
						 * this.getView().byId("shortNoticeWvr").getVisible()
						 * === true){ sap.m.MessageToast.show("Please enter
						 * correct 'Short Notice Waiver' Value"); return; } var
						 * shrtNWvrNo = +shrtNWvr; var shrtNtNo = +shrtNt;
						 * if((shrtNWvr < 0 || shrtNWvrNo > shrtNtNo) &&
						 * this.getView().byId("shortNoticeWvr").getVisible()
						 * === true){ sap.m.MessageToast.show("Please enter
						 * correct 'Short Notice Waiver' value"); return; }
						 */
						var shrtNDdct = shrtNt - shrtNWvr - leaveadjASN;
						this.getView().byId("shortNoticeDdctn").setText(
								shrtNDdct);
					},

					onUpdLvBal : function() {
						var updLvBal = this.getView().byId("updLvBal")
								.getValue();
						if ((updLvBal < 0 || updLvBal > 99)
								&& this.getView().byId("updLvBal").getVisible() === true) {
							sap.m.MessageToast
									.show("Please enter correct 'Updated Leave Balance'");
							// this.getView().byId("updLvBal").setValue("");
							return;
						} else {
							this.getView().byId("lvBal").setText(updLvBal);
						}
					},

					onShrtNtcDedctnChng : function(oEvent) {
						var val = oEvent.getParameter("value");
						this.getView().byId("shortNoticeDdctn").setText(val);
					},

					onUpdELvBalAsLwd : function() {
						var updLvBal = this.getView().byId("off_ElbLwds").getValue();

						if ((updLvBal < 0 || updLvBal > 99)
								&& this.getView().byId("updLvBal").getVisible() === true) {
							sap.m.MessageToast
									.show("Please enter correct 'Updated Leave Balance'");
							return;
						} else {
							this.getView().byId("off_Leaveadjbsal").setText(updLvBal);
						}
					},
					/*
					 * onNtcpdRdb: function() { if
					 * (this.getView().byId("RB1-1").getSelected() === true){
					 * this.getView().byId("i_ntcpd").setEditable(false); } else
					 * if (this.getView().byId("RB1-2").getSelected() === true){
					 * this.getView().byId("i_ntcpd").setEditable(true); } },
					 */

					onCallPDF : function(e) {
						var protocol = window.location.protocol;
						var host = window.location.host;
						// var url =
						// "https://sapfioridev.abpnews.net:8200/sap/opu/odata/sap/YHR_ESEP_APPROVAL_SRV/Call_smartformSet('"
						// +
						// this.earqn +"')/$value";
						
						if (this.sepHeaderModel.oData.Role === "PC" || this.sepHeaderModel.oData.Role === "PF"){	//"Added by Lakshmana on 08.01.2020 for Offboarding 2nd phase CR-31
							var url = protocol
							+ "//"
							+ host
							+ "/sap/opu/odata/sap/YHR_ESEP_APPROVAL_SRV/Call_Clearance_FormSet(Pernr='"
							+ this.sepHeaderModel.oData.Pernr + "',Earqn='" + this.sepHeaderModel.oData.Earqn + "')/$value";
						}else if(this.sepHeaderModel.oData.Role === "PA" || this.sepHeaderModel.oData.Role === "PB"){	//"Added by Lakshmana on 08.01.2020 for Offboarding 2nd phase CR-31
							var url = protocol
							+ "//"
							+ host
							+ "/sap/opu/odata/sap/YHR_ESEP_APPROVAL_SRV/Payrol_formSet(Pernr='"
							+ this.sepHeaderModel.oData.Pernr + "',Earqn='" + this.sepHeaderModel.oData.Earqn + "')/$value";
						}
						var encodeUrl = encodeURI(url);
						sap.m.URLHelper.redirect(encodeUrl, true);
					},

					onForward : function(e) {

						var thisInst = this;
						var core = sap.ui.getCore();
						var oForwardFragment = sap.ui.xmlfragment(
								"sap.abp.eSeparation.approve.views.Forward",
								this);
						this.getView().addDependent(oForwardFragment);
						core.byId("remarkForwardId").setMaxLength(240);

						var dialog = new sap.m.Dialog({
							title : "Remarks",
							contentWidth : "30rem",
							content : [ oForwardFragment ],
							leftButton : new sap.m.Button({
								text : 'Ok',
								press : function() {
									if (core.byId("userSelectId")
											.getSelectedKey() !== "") {
										thisInst._create(core.byId(
												"remarkForwardId").getValue(),
												'F', core.byId("userSelectId")
														.getSelectedKey());
										dialog.close();
									} else {
										sap.m.MessageToast
												.show('User is mandatory');
									}
								}
							}),
							rightButton : new sap.m.Button({
								text : 'Cancel',
								press : function() {
									dialog.close();
								}
							}),
							afterClose : function() {
								dialog.destroy();
							}
						});

						dialog.open();
					},

					// ////////////////////////////////////////////////////////////////////////////////////////
					// ////////////////////////////////// On Save
					// ////////////////////////////////////////////
					// ////////////////////////////////////////////////////////////////////////////////////////
					onSave : function(e) {

						var thisInst = this;

						var date = this.getView().byId("fnfCheckhand")
								.getDateValue();
						var date1 = this.oDateFormat.format(new Date(date));
						/*
						 * if (date == null || date1 === "19700101"){
						 * sap.m.MessageBox.show("'Full and Final cheque handed
						 * over Date' should not be blank", { icon:
						 * sap.m.MessageBox.Icon.ERROR, title: "Error Message" } );
						 * return; }
						 */
						var secondDate = new Date(date1.substring(0, 4) + "-"
								+ date1.substring(4, 6) + "-"
								+ date1.substring(6));
						var today = new Date();
						/*
						 * if (today < secondDate){ sap.m.MessageBox.show("'Full
						 * and Final cheque handed over Date' should not be
						 * future date", { icon: sap.m.MessageBox.Icon.ERROR,
						 * title: "Error Message" } ); return; }
						 */

						var appRemark = this.getView().byId("ta_appRemark")
								.getValue();
						var remarkVisble = this.getView().byId("ta_appRemark")
								.getVisible();
						if ((appRemark === "" || appRemark === " ")
								&& remarkVisble === true) {
							sap.m.MessageBox.show("Please enter Remarks", {
								icon : sap.m.MessageBox.Icon.ERROR,
								title : "Error Message"
							});
							return;
						}

						var textArea = new sap.m.TextArea({
							rows : 4,
							width : "100%",
							maxLength : 240,
							placeholder : 'Add remarks',
							visible : false
						});

						/////////////Start code - added on 31 Aug 2023 ////////////
						var uRole = this.sepHeaderModel.oData.Role;
						var uploadCount = this.getView().byId("uploadCollId").getItems().length;
						
						if (uRole === "PA" || uRole === "PB" || uRole === "FF" || uRole === "PF"){
							if(uploadCount === 0){
							sap.m.MessageBox.show("Please attach the F & F calculation file", {
								icon : sap.m.MessageBox.Icon.ERROR,
								title : "Error Message"
							});
							return;
						}}
						
							///////////// End Code - added on 31 Aug 2023 ////////////
						
						var text = new sap.m.Text({
							rows : 4,
							width : "100%",
							maxLength : 240,
							text : 'Do you want to Save the Request?',
							visible : true
						});

						var dialog = new sap.m.Dialog({
							title : "Confirmation",
							contentWidth : "30rem",
							content : [ text ],
							leftButton : new sap.m.Button({
								text : 'Yes',
								press : function() {
									/* thisInst._create(textArea.getValue(),'R',''); */
									thisInst._create('', 'S', '');
									dialog.close();
								}
							}),
							rightButton : new sap.m.Button({
								text : 'No',
								press : function() {
									dialog.close();
								}
							}),
							afterClose : function() {
								dialog.destroy();
							}
						}).addStyleClass("sapUiPopupWithPadding");

						dialog.open();
					},
					// ////////////////////////////////////////////////////////////////////////////////////////
					// ////////////////////////////////////////////////////////////////////////////////////////
					// ////////////////////////////////////////////////////////////////////////////////////////

					onApprove : function(e) {

						var thisInst = this;

						var date = this.getView().byId("fnfCheckhand")
								.getDateValue();
						var date1 = this.oDateFormat.format(new Date(date));
						if ((date == null || date1 === "19700101")
								&& this.getView().byId("fnfCheckhand")
										.getVisible() === true) {
							sap.m.MessageBox
									.show(
											"'Full and Final cheque handed over Date' should not be blank",
											{
												icon : sap.m.MessageBox.Icon.ERROR,
												title : "Error Message"
											});
							return;
						}
						var secondDate = new Date(date1.substring(0, 4) + "-"
								+ date1.substring(4, 6) + "-"
								+ date1.substring(6));
						var today = new Date();
						if ((today < secondDate)
								&& this.getView().byId("fnfCheckhand")
										.getVisible() === true) {
							sap.m.MessageBox
									.show(
											"'Full and Final cheque handed over Date' should not be future date",
											{
												icon : sap.m.MessageBox.Icon.ERROR,
												title : "Error Message"
											});
							return;
						}

						var appRemark = this.getView().byId("ta_appRemark")
								.getValue();
						var remarkRequired = this.getView()
								.byId("lb_appRemark").getRequired();
						var remarkvis = this.getView().byId("lb_appRemark")
								.getVisible();
						if ((appRemark === "" || appRemark === " ")
								&& remarkRequired === true
								&& remarkvis === true) {
							sap.m.MessageBox.show("Please enter Remarks", {
								icon : sap.m.MessageBox.Icon.ERROR,
								title : "Error Message"
							});
							return;
						};
						
						if( (appRemark !== "" && appRemark !== " ")
								&& appRemark.length < 2){
							sap.m.MessageBox.show("Please enter Remarks properly", {
								icon : sap.m.MessageBox.Icon.ERROR,
								title : "Error Message"
							});
							return;
						};

						var clrncRemark = this.getView().byId("ta_clrncRemark")
								.getValue();
						var clrncRemarkvis = this.getView().byId(
								"ta_clrncRemark").getVisible();
						if ((clrncRemark === "" || clrncRemark === " ")
								&& clrncRemarkvis === true) {
							sap.m.MessageBox.show("Please enter Remarks", {
								icon : sap.m.MessageBox.Icon.ERROR,
								title : "Error Message"
							});
							return;
						}
						
							/////////////Start code - added on 31 Aug 2023 ////////////
						var uRole = this.sepHeaderModel.oData.Role;
						var uploadCount = this.getView().byId("uploadCollId").getItems().length;
						
						if (uRole === "PA" || uRole === "PB" || uRole === "FF" || uRole === "PF"){
							if(uploadCount === 0){
							sap.m.MessageBox.show("Please attach the F & F calculation file", {
								icon : sap.m.MessageBox.Icon.ERROR,
								title : "Error Message"
							});
							return;
						}}
						
							///////////// End Code - added on 31 Aug 2023 ////////////

						var popupMsg = "";
						if (this.sepHeaderModel.oData.Role === "R2"
								|| this.sepHeaderModel.oData.Role === "R3") {
							popupMsg = 'Do you want to Approve the Request?';
						} else {
							popupMsg = 'Do you want to Proceed the Request?';
						}

						var textArea = new sap.m.TextArea({
							rows : 4,
							width : "100%",
							maxLength : 240,
							text : 'Add remarks',
							visible : false
						});

						var text = new sap.m.Text({
							rows : 4,
							width : "100%",
							maxLength : 240,
							text : popupMsg,
							visible : true
						});
												
						var dialog = new sap.m.Dialog({
							title : "Confirmation",
							contentWidth : "30rem",
							content : [ text ],
							leftButton : new sap.m.Button({
								text : 'Yes',
								press : function() {
									/* thisInst._create(textArea.getValue(),'A',''); */
									thisInst._create('', 'A', '');
									dialog.close();
								}
							}),
							rightButton : new sap.m.Button({
								text : 'No',
								press : function() {
									dialog.close();
								}
							}),
							afterClose : function() {
								dialog.destroy();
							}
						}).addStyleClass("sapUiPopupWithPadding");

						dialog.open();
					},

					onReject : function(e) {

						var thisInst = this;
						var appRemark = this.getView().byId("ta_appRemark")
								.getValue();
						var remarkVisble = this.getView().byId("ta_appRemark")
								.getVisible();
						if ((appRemark === "" || appRemark === " ")
								&& remarkVisble === true) {
							sap.m.MessageBox.show("Please enter Remarks", {
								icon : sap.m.MessageBox.Icon.ERROR,
								title : "Error Message"
							});
							return;
						}

						var textArea = new sap.m.TextArea({
							rows : 4,
							width : "100%",
							maxLength : 240,
							placeholder : 'Add remarks',
							visible : false
						});

						var text = new sap.m.Text({
							rows : 4,
							width : "100%",
							maxLength : 240,
							text : 'Do you want to Reject the Request?',
							visible : true
						});
						
						var dialog = new sap.m.Dialog({
							title : "Confirmation",
							contentWidth : "30rem",
							content : [ text ],
							leftButton : new sap.m.Button({
								text : 'Yes',
								press : function() {
									/* thisInst._create(textArea.getValue(),'R',''); */
									thisInst._create('', 'R', '');
									dialog.close();
								}
							}),
							rightButton : new sap.m.Button({
								text : 'No',
								press : function() {
									dialog.close();
								}
							}),
							afterClose : function() {
								dialog.destroy();
							}
						}).addStyleClass("sapUiPopupWithPadding");

						dialog.open();
					},

					_create : function(remarks, status, user) {

						var thisInst = this;

						var notesData = this.notesModel.getData();
						var attachData = this.createAttachModel.getData();
						// var date =
						// this.getView().byId("dateRelieveId").getValue();
						// Getting Value Of From Date
						var date = this.getView().byId("dateRelieveId")
								.getDateValue();
						var dateRelieveEditble = this.getView().byId(
								"dateRelieveId").getEditable();
						var date1 = this.oDateFormat.format(new Date(date));
						var shortNotice = this.getView().byId("shortNotice")
								.getText();
						var shortNoticeWvr = this.getView().byId(
								"shortNoticeWvr").getValue();
						var tNtcp = this.getView().byId("tNtcp").getText();
						var leaveADJ = this.getView().byId("leaveadjASN")
								.getValue();
						var remark = this.getView().byId("ta_appRemark")
								.getValue();
						if (remark === ""
								&& (this.getView().byId("ta_clrncRemark")
										.getValue() !== "" && this.getView()
										.byId("ta_clrncRemark").getValue() !== " ")) {
							remark = this.getView().byId("ta_clrncRemark")
									.getValue();
						}

						var sPLWdate = this.sepHeaderModel.oData.LastWorkSys;
						var firstDate = new Date(sPLWdate.substring(0, 4) + "-"
								+ sPLWdate.substring(4, 6) + "-"
								+ sPLWdate.substring(6));
						var secondDate = new Date(date1.substring(0, 4) + "-"
								+ date1.substring(4, 6) + "-"
								+ date1.substring(6));
						var today = new Date();
						if ((today > secondDate)
								&& (dateRelieveEditble === true || dateRelieveEditble === "true")) {
							sap.m.MessageBox
									.show(
											"'Proposed last working day' should not be past date",
											{
												icon : sap.m.MessageBox.Icon.ERROR,
												title : "Error Message"
											});
							return;
						} else if ((firstDate < secondDate)
								&& (dateRelieveEditble === true || dateRelieveEditble === "true")) {
							sap.m.MessageBox
									.show(
											"'Proposed last working day' should not be greater than 'Last working day proposed by System'",
											{
												icon : sap.m.MessageBox.Icon.ERROR,
												title : "Error Message"
											});
							return;
						}

						// soc offboaard process validation

						var ElbLwds = "";
						var ElbLwdsRIp = "";
						var Leaveadjbsal = "";
						var Ffsaltopay = "";
						var FfsaltopayRIp = "";
						var lta = "";
						var ltaRIp = "";
						var Gratuity = "";
						var GratuityRIp = "";
						var Nightalownc = "";
						var NightalowncRIp = "";
						var Exgratia = "";
						var ExgratiaRIp = "";
						var Salhldaywrk = "";
						var SalhldaywrkRIp = "";
						var Ffamount = "";
						var Fftranstype = "";

						var oElbLwds = this.getView().byId("off_ElbLwds");
						if (oElbLwds && oElbLwds.getVisible()) {
							var Error = this.validation("off_ElbLwds");
							if (Error > 0) {
								sap.m.MessageBox.show(
										"Please enter mandatory fields", {
											icon : sap.m.MessageBox.Icon.ERROR,
											title : "Error Message"
										});
								return ;
							}else {
								var ElbLwds = oElbLwds.getValue()
							}
						}
						var oElbLwdsRIp = this.getView().byId("off_ElbLwdsRIp");
						if (oElbLwdsRIp && oElbLwdsRIp.getVisible()) {
							var Error = this.validation("off_ElbLwdsRIp")
							if (Error > 0) {
									sap.m.MessageBox.show(
											"Please enter mandatory fields", {
												icon : sap.m.MessageBox.Icon.ERROR,
												title : "Error Message"
											});
									return ;
								}else {
								var ElbLwdsRIp = oElbLwdsRIp.getValue()
							}
						}
						var oLeaveadjbsal = this.getView().byId("off_Leaveadjbsal");
						if (oLeaveadjbsal && oLeaveadjbsal.getVisible()) {
							var Leaveadjbsal = oLeaveadjbsal.getText();
						}
						var oFfsaltopay = this.getView().byId("off_Ffsaltopay");
						if (oFfsaltopay && oFfsaltopay.getVisible()) {
							var Error = this.validation("off_Ffsaltopay");
							if (Error > 0) {
								sap.m.MessageBox.show(
										"Please enter mandatory fields", {
											icon : sap.m.MessageBox.Icon.ERROR,
											title : "Error Message"
										});
								return ;
							}else {
							var Ffsaltopay = oFfsaltopay.getValue();
							}
						}
						var oFfsaltopayRIp = this.getView().byId("off_FfsaltopayRIp");
						if (oFfsaltopayRIp && oFfsaltopayRIp.getVisible()) {
							var Error = this.validation("off_FfsaltopayRIp");
							if (Error > 0) {
								sap.m.MessageBox.show(
										"Please enter mandatory fields", {
											icon : sap.m.MessageBox.Icon.ERROR,
											title : "Error Message"
										});
								return ;
							}else {
								var FfsaltopayRIp = oFfsaltopayRIp.getValue();
							}
						}
						var oLta = this.getView().byId("off_lta");
						if (oLta && oLta.getVisible()) {
							var Error = this.validation("off_lta");
							if (Error > 0) {
								sap.m.MessageBox.show(
										"Please enter mandatory fields", {
											icon : sap.m.MessageBox.Icon.ERROR,
											title : "Error Message"
										});
								return ;
							}else {
								var lta = oLta.getSelectedKey();
							}
						}
						var oLtaRIp = this.getView().byId("off_ltaRIp");
						if (oLtaRIp && oLtaRIp.getVisible()) {
							var Error = this.validation("off_ltaRIp");
							if (Error > 0) {
								sap.m.MessageBox.show(
										"Please enter mandatory fields", {
											icon : sap.m.MessageBox.Icon.ERROR,
											title : "Error Message"
										});
								return ;
							}else {
								var ltaRIp = oLtaRIp.getValue();
							}
						}
						var oGratuity = this.getView().byId("off_Gratuity");
						if (oGratuity && oGratuity.getVisible()) {
							var Error = this.validation("off_Gratuity");
							if (Error > 0) {
								sap.m.MessageBox.show(
										"Please enter mandatory fields", {
											icon : sap.m.MessageBox.Icon.ERROR,
											title : "Error Message"
										});
								return ;
							}else {
								var Gratuity = oGratuity.getSelectedKey();
							}
						}
						var oGratuityRIp = this.getView().byId("off_GratuityRIp");
						if (oGratuityRIp && oGratuityRIp.getVisible()) {
							var Error = this.validation("off_GratuityRIp");
							if (Error > 0) {
								sap.m.MessageBox.show(
										"Please enter mandatory fields", {
											icon : sap.m.MessageBox.Icon.ERROR,
											title : "Error Message"
										});
								return ;
							}else {
								var GratuityRIp = oGratuityRIp.getValue();
							}
						}
						var oNightalownc = this.getView().byId("off_Nightalownc");
						if (oNightalownc && oNightalownc.getVisible()) {
							var Error = this.validation("off_Nightalownc");
							if (Error > 0) {
								sap.m.MessageBox.show(
										"Please enter mandatory fields", {
											icon : sap.m.MessageBox.Icon.ERROR,
											title : "Error Message"
										});
								return ;
							}else {
								var Nightalownc = oNightalownc.getValue();
							}
						}
						var oNightalowncRIp = this.getView().byId("off_NightalowncRIp");
						if (oNightalowncRIp && oNightalowncRIp.getVisible()) {
							var Error = this.validation("off_NightalowncRIp");
							if (Error > 0) {
								sap.m.MessageBox.show(
										"Please enter mandatory fields", {
											icon : sap.m.MessageBox.Icon.ERROR,
											title : "Error Message"
										});
								return ;
							}else {
								var NightalowncRIp = oNightalowncRIp.getValue();
							}
						}
						var oExgratia = this.getView().byId("off_Exgratia");
						if (oExgratia && oExgratia.getVisible()) {
							var Error = this.validation("off_Exgratia");
							if (Error > 0) {
								sap.m.MessageBox.show(
										"Please enter mandatory fields", {
											icon : sap.m.MessageBox.Icon.ERROR,
											title : "Error Message"
										});
								return ;
							}else {
								var Exgratia = oExgratia.getValue();
							}
						}
						var oExgratiaRIp = this.getView().byId("off_ExgratiaRIp");
						if (oExgratiaRIp && oExgratiaRIp.getVisible()) {
							var Error = this.validation("off_ExgratiaRIp");
							if (Error > 0) {
								sap.m.MessageBox.show(
										"Please enter mandatory fields", {
											icon : sap.m.MessageBox.Icon.ERROR,
											title : "Error Message"
										});
								return ;
							}else {
								var ExgratiaRIp = oExgratiaRIp.getValue();
							}
						}
						var oSalhldaywrk = this.getView().byId("off_Salhldaywrk");
						if (oSalhldaywrk && oSalhldaywrk.getVisible()) {
							var Error = this.validation("off_Salhldaywrk");
							if (Error > 0) {
								sap.m.MessageBox.show(
										"Please enter mandatory fields", {
											icon : sap.m.MessageBox.Icon.ERROR,
											title : "Error Message"
										});
								return ;
							}else {
								var Salhldaywrk = oSalhldaywrk.getValue();
							}
						}
						var oSalhldaywrkRIp = this.getView().byId("off_SalhldaywrkRIp");
						if (oSalhldaywrkRIp && oSalhldaywrkRIp.getVisible()) {
							var Error = this.validation("off_SalhldaywrkRIp");
							if (Error > 0) {
								sap.m.MessageBox.show(
										"Please enter mandatory fields", {
											icon : sap.m.MessageBox.Icon.ERROR,
											title : "Error Message"
										});
								return ;
							}else {
								var SalhldaywrkRIp = oSalhldaywrkRIp.getValue();
							}
						}
						var oFfamount = this.getView().byId("off_Ffamount");
						if (oFfamount && oFfamount.getVisible()) {
							var Error = this.validation("off_Ffamount");
							if (Error > 0) {
								sap.m.MessageBox.show(
										"Please enter mandatory fields", {
											icon : sap.m.MessageBox.Icon.ERROR,
											title : "Error Message"
										});
								return ;
							}else {
								var Ffamount = oFfamount.getValue();
							}
						}
						var oRBP1 = this.getView().byId("RBP-1");
						if (oRBP1 && oRBP1.getVisible()) {
							var Fftranstype = "";
							oRBP1.getSelected() === true ? Fftranstype = "EL"
									: Fftranstype = "PA";
						}

						// eoc offboard process validation

						/*
						 * var epos = shortNoticeWvr.indexOf("e"); if ((epos !==
						 * -1 || shortNoticeWvr === "") &&
						 * this.getView().byId("shortNoticeWvr").getVisible()
						 * === true){ sap.m.MessageBox.show("Please enter
						 * correct 'Short Notice Waiver' value", { icon:
						 * sap.m.MessageBox.Icon.ERROR, title: "Error Message" } );
						 * return; }
						 */
						var shortNoticeWvrNo = +shortNoticeWvr;
						var shortNoticeNo = +shortNotice;
						if ((shortNoticeWvr < 0 || shortNoticeWvrNo > shortNoticeNo)
								&& this.getView().byId("shortNoticeWvr")
										.getVisible() === true) {
							sap.m.MessageBox
									.show(
											"Please enter correct 'Short Notice Waiver' value",
											{
												icon : sap.m.MessageBox.Icon.ERROR,
												title : "Error Message"
											});
							return;
						}
						var shortNoticeDdctn = this.getView().byId(
								"shortNoticeDdctn").getText();

						/*
						 * var clearance =
						 * this.getView().byId("clearance").getSelectedKey();
						 */
						var clearance = "";

						var rc_rspnsblts = "";
						var rc_docMail = "";
						var rc_matrlManls = "";
						var rc_deptAssts = "";

						var fc_loans = "";
						var fc_advOutstnd = "";
						var fc_compLeasAcmdtn = "";
						var fc_dueOutstndCopertv = "";
						var fc_recvrExsMobRembrsmnt = "";

						var ic_desktop = "";
						var ic_laptop = "";
						var ic_dtCard = "";
						var ic_mobil = "";
						var ic_sim = "";
						var ic_extHdd = "";
						var ic_dvdWrtr = "";
						var ic_addMobil = "";
						var ic_addSim = "";
/*						var ic_actvDirctry = "";
						var ic_dtopCntrl = "";
						var ic_emailId = "";
						var ic_grpEmlIdownshp = "";
						var ic_sapId = "";
						var ic_atexId = "";
						var ic_essId = "";
						var ic_intrntAcsPlcy = "";
						var ic_othrApps = "";*/

						var ac_cupbrdKy = "";
						var ac_drwrKy = "";
						var ac_cbinKy = "";
						var ac_spike = "";
						var ac_spFurntr = "";
						var ac_carUsgWithdrwl = "";

						var ec_camera = "";
						var ec_lens = "";
						var ec_speedlight = "";
						var ec_laptop = "";
						var ec_dataCard = "";
						var ec_voicRcrdr = "";
						var ec_ipad = "";
						var ec_tab = "";
						var ec_headPhone = "";
						var ec_hdd = "";
						var dc_camb_chgr = "";
						var dc_someid = "";
						var dc_onsitools = "";
						var dc_drives = "";
						var dc_vpn_acc = "";
						var dc_email_dact = "";
						var dc_cms_login = "";

						var idCard = false, holdRelLeterV= false, fandF = false, mgr_clearance = "", it_clearance = "", finance_clearance = "", editor_clearance = "", admin_clearance = "";
						// db_clearance = "", em_clearance ="", de_clearance ="" ;

						switch (this.sepHeaderModel.oData.Role) {
						case "RC":
							mgr_clearance = clearance;

							rc_rspnsblts = this.getView().byId("rc_rspnsblts")
									.getSelectedKey();
							rc_docMail = this.getView().byId("rc_docMail")
									.getSelectedKey();
							rc_matrlManls = this.getView()
									.byId("rc_matrlManls").getSelectedKey();
							rc_deptAssts = this.getView().byId("rc_deptAssts")
									.getSelectedKey();

							if (rc_rspnsblts === "" || rc_rspnsblts === " "
									|| rc_docMail === "" || rc_docMail === " "
									|| rc_matrlManls === ""
									|| rc_matrlManls === " "
									|| rc_deptAssts === ""
									|| rc_deptAssts === " ") {
								sap.m.MessageBox.show(
										"Please fill Mandatory fields", {
											icon : sap.m.MessageBox.Icon.ERROR,
											title : "Error Message"
										});
								return;
							}
							break;
						case "IC":
							it_clearance = clearance;

							ic_desktop = this.getView().byId("ic_desktop")
									.getSelectedKey();
							ic_laptop = this.getView().byId("ic_laptop")
									.getSelectedKey();
							ic_dtCard = this.getView().byId("ic_dtCard")
									.getSelectedKey();
							ic_mobil = this.getView().byId("ic_mobil")
									.getSelectedKey();
							ic_sim = this.getView().byId("ic_sim")
									.getSelectedKey();
							ic_extHdd = this.getView().byId("ic_extHdd")
									.getSelectedKey();
							ic_dvdWrtr = this.getView().byId("ic_dvdWrtr")
									.getSelectedKey();
							ic_addMobil = this.getView().byId("ic_addMobil")
									.getSelectedKey();
							ic_addSim = this.getView().byId("ic_addSim")
									.getSelectedKey();
/*							ic_actvDirctry = this.getView().byId(
									"ic_actvDirctry").getSelectedKey();
							ic_dtopCntrl = this.getView().byId("ic_dtopCntrl")
									.getSelectedKey();
							ic_emailId = this.getView().byId("ic_emailId")
									.getSelectedKey();
							ic_grpEmlIdownshp = this.getView().byId(
									"ic_grpEmlIdownshp").getSelectedKey();
							ic_sapId = this.getView().byId("ic_sapId")
									.getSelectedKey();
							ic_atexId = this.getView().byId("ic_atexId")
									.getSelectedKey();
							ic_essId = this.getView().byId("ic_essId")
									.getSelectedKey();
							ic_intrntAcsPlcy = this.getView().byId(
									"ic_intrntAcsPlcy").getSelectedKey();
							ic_othrApps = this.getView().byId("ic_othrApps")
									.getSelectedKey();*/

							if (ic_desktop === "" || ic_desktop === " "
									|| ic_laptop === "" || ic_laptop === " "
									|| ic_dtCard === "" || ic_dtCard === " "
									|| ic_mobil === "" || ic_mobil === " "
									|| ic_sim === "" || ic_sim === " "
									|| ic_extHdd === "" || ic_extHdd === " "
									|| ic_dvdWrtr === "" || ic_dvdWrtr === " "
									|| ic_addMobil === ""
									|| ic_addMobil === " " || ic_addSim === ""
									|| ic_addSim === " "
/*									|| ic_actvDirctry === ""
									|| ic_actvDirctry === " "
									|| ic_dtopCntrl === ""
									|| ic_dtopCntrl === " "
									|| ic_emailId === "" || ic_emailId === " "
									|| ic_grpEmlIdownshp === ""
									|| ic_grpEmlIdownshp === " "
									|| ic_sapId === "" || ic_sapId === " "
									|| ic_atexId === "" || ic_atexId === " "
									|| ic_essId === "" || ic_essId === " "
									|| ic_intrntAcsPlcy === ""
									|| ic_intrntAcsPlcy === " "
									|| ic_othrApps === ""
									|| ic_othrApps === " "*/
										) {
								sap.m.MessageBox.show(
										"Please fill Mandatory fields", {
											icon : sap.m.MessageBox.Icon.ERROR,
											title : "Error Message"
										});
								return;
							}
							break;
						case "EC":
							editor_clearance = clearance;

							ic_desktop = this.getView().byId("ic_desktop")
									.getSelectedKey();
							ic_mobil = this.getView().byId("ic_mobil")
									.getSelectedKey();
							ic_sim = this.getView().byId("ic_sim")
									.getSelectedKey();
							ec_camera = this.getView().byId("ec_camera")
									.getSelectedKey();
							ec_lens = this.getView().byId("ec_lens")
									.getSelectedKey();
							ec_speedlight = this.getView()
									.byId("ec_speedlight").getSelectedKey();
							ec_laptop = this.getView().byId("ec_laptop")
									.getSelectedKey();
							ec_dataCard = this.getView().byId("ec_dataCard")
									.getSelectedKey();
							ec_voicRcrdr = this.getView().byId("ec_voicRcrdr")
									.getSelectedKey();
							ec_ipad = this.getView().byId("ec_ipad")
									.getSelectedKey();
							ec_tab = this.getView().byId("ec_tab")
									.getSelectedKey();
							ec_headPhone = this.getView().byId("ec_headPhone")
									.getSelectedKey();
							ec_hdd = this.getView().byId("ec_hdd")
									.getSelectedKey();
							dc_camb_chgr = this.getView().byId("dc_camb_chgr")
									.getSelectedKey();

							if (ic_desktop === "" || ic_desktop === " "
									|| ic_mobil === "" || ic_mobil === " "
									|| ic_sim === "" || ic_sim === " "
									|| ec_camera === "" || ec_camera === " "
									|| ec_lens === "" || ec_lens === " "
									|| ec_speedlight === ""
									|| ec_speedlight === " "
									|| ec_laptop === "" || ec_laptop === " "
									|| ec_dataCard === ""
									|| ec_dataCard === " "
									|| ec_voicRcrdr === ""
									|| ec_voicRcrdr === " " || ec_ipad === ""
									|| ec_ipad === " " || ec_tab === ""
									|| ec_tab === " " || ec_headPhone === ""
									|| ec_headPhone === " " || ec_hdd === ""
									|| ec_hdd === " " || dc_camb_chgr === " "
									|| dc_camb_chgr === ""
									) {
								sap.m.MessageBox.show(
										"Please fill Mandatory fields", {
											icon : sap.m.MessageBox.Icon.ERROR,
											title : "Error Message"
										});
								return;
							}
							break;
							
						/////// Start Code added for print and digital editorial clearance by amit ///////////
							case "DB":
							// db_clearance = clearance;

							dc_someid = this.getView().byId("dc_someid")
									.getSelectedKey();
							dc_onsitools = this.getView().byId("dc_onsitools")
									.getSelectedKey();
							dc_drives = this.getView().byId("dc_drives")
									.getSelectedKey();
							if (dc_someid === "" || dc_someid === " "
									|| dc_onsitools === "" || dc_onsitools === " "
									|| dc_drives === "" || dc_drives === " "
									) {
								sap.m.MessageBox.show(
										"Please fill Mandatory fields", {
											icon : sap.m.MessageBox.Icon.ERROR,
											title : "Error Message"
										});
								return;
							}
							break;
							
							case "EM":
							// em_clearance = clearance;

							dc_cms_login = this.getView().byId("dc_cms_login")
									.getSelectedKey();
							if (dc_cms_login === "" || dc_cms_login === " "
									) {
								sap.m.MessageBox.show(
										"Please fill Mandatory fields", {
											icon : sap.m.MessageBox.Icon.ERROR,
											title : "Error Message"
										});
								return;
							}
							break;
							
							case "DE":
							// de_clearance = clearance;

							ic_desktop = this.getView().byId("ic_desktop")
									.getSelectedKey();
							ec_laptop = this.getView().byId("ec_laptop")
									.getSelectedKey();
							ec_dataCard = this.getView().byId("ec_dataCard")
									.getSelectedKey();
							dc_vpn_acc  = this.getView().byId("dc_vpn_acc")
									.getSelectedKey();
							dc_email_dact = this.getView().byId("dc_email_dact")
									.getSelectedKey();
							dc_cms_login = this.getView().byId("dc_cms_login")
									.getSelectedKey();

							if (ic_desktop === "" || ic_desktop === " "
									|| ec_laptop === "" || ec_laptop === " "
									|| ec_dataCard === "" || ec_dataCard === " "
									|| dc_vpn_acc === ""
									|| dc_vpn_acc === " " || dc_email_dact === ""
									|| dc_email_dact === " " || dc_cms_login === ""
									|| dc_cms_login === " "
									) {
								sap.m.MessageBox.show(
										"Please fill Mandatory fields", {
											icon : sap.m.MessageBox.Icon.ERROR,
											title : "Error Message"
										});
								return;
							}
							break;
							
				/////// End Code added for print and digital editorial clearance by amit ///////////
							
						case "FC":
							finance_clearance = clearance;

							fc_loans = this.getView().byId("fc_loans")
									.getSelectedKey();
							fc_advOutstnd = this.getView()
									.byId("fc_advOutstnd").getSelectedKey();
							fc_compLeasAcmdtn = this.getView().byId(
									"fc_compLeasAcmdtn").getSelectedKey();
							fc_dueOutstndCopertv = this.getView().byId(
									"fc_dueOutstndCopertv").getSelectedKey();
							fc_recvrExsMobRembrsmnt = this.getView().byId(
									"fc_recvrExsMobRembrsmnt").getSelectedKey();

							if (fc_loans === "" || fc_loans === " "
									|| fc_advOutstnd === ""
									|| fc_advOutstnd === " "
									|| fc_compLeasAcmdtn === ""
									|| fc_compLeasAcmdtn === " "
									|| fc_dueOutstndCopertv === ""
									|| fc_dueOutstndCopertv === " "
									|| fc_recvrExsMobRembrsmnt === ""
									|| fc_recvrExsMobRembrsmnt === " ") {
								sap.m.MessageBox.show("c", {
									icon : sap.m.MessageBox.Icon.ERROR,
									title : "Error Message"
								});
								return;
							}
							break;
						case "AC":
							admin_clearance = clearance;

							ac_cupbrdKy = this.getView().byId("ac_cupbrdKy")
									.getSelectedKey();
							ac_drwrKy = this.getView().byId("ac_drwrKy")
									.getSelectedKey();
							ac_cbinKy = this.getView().byId("ac_cbinKy")
									.getSelectedKey();
							ac_spike = this.getView().byId("ac_spike")
									.getSelectedKey();
							ac_spFurntr = this.getView().byId("ac_spFurntr")
									.getSelectedKey();
							ac_carUsgWithdrwl = this.getView().byId(
									"ac_carUsgWithdrwl").getSelectedKey();

							if (ac_cupbrdKy === "" || ac_cupbrdKy === " "
									|| ac_drwrKy === "" || ac_drwrKy === " "
									|| ac_cbinKy === "" || ac_cbinKy === " "
									|| ac_spike === "" || ac_spike === " "
									|| ac_spFurntr === ""
									|| ac_spFurntr === " "
									|| ac_carUsgWithdrwl === ""
									|| ac_carUsgWithdrwl === " ") {
								sap.m.MessageBox.show(
										"Please fill Mandatory fields", {
											icon : sap.m.MessageBox.Icon.ERROR,
											title : "Error Message"
										});
								return;
							}
							break;
							
							
						case "PF":
							pf_sumbitIDCard = this.getView().byId("sumbitIDCard").getSelected();
							pf_holdRelLeter = this.getView().byId("holdRelLeter").getSelected();
							if (pf_holdRelLeter === true) {
								holdRelLeterV = true;
							}
							if (pf_sumbitIDCard === true) {
								idCard =true;
							} else{
								sap.m.MessageBox.show(
										"Please fill Mandatory fields", {
											icon : sap.m.MessageBox.Icon.ERROR,
											title : "Error Message"
										});
								return;
							}
							break;
							
							
						case "PC":
							if (this.getView().byId("sumbitIDCard")
									.getSelected() === true) {
								idCard = true;
							} else if (this.getView().byId("sumbitIDCard")
									.getSelected() === false) {
								idCard = false;
//								if (this.getView().byId("ta_clrncRemark")
//										.getValue() === ""
//										|| this.getView()
//												.byId("ta_clrncRemark")
//												.getValue() === " ") {
//									sap.m.MessageBox
//											.show(
//													"Please enter Remarks",
//													{
//														icon : sap.m.MessageBox.Icon.ERROR,
//														title : "Error Message"
//													});
//									return;
//								}
							}
//							if (this.getView().byId("fandF").getSelected() === true) {
//								fandF = "X";
//							} else if (this.getView().byId("fandF")
//									.getSelected() === false) {
//								fandF = " ";
//								if (this.getView().byId("ta_clrncRemark")
//										.getValue() === ""
//										|| this.getView()
//												.byId("ta_clrncRemark")
//												.getValue() === " ") {
//									sap.m.MessageBox
//											.show(
//													"Please enter Remarks",
//													{
//														icon : sap.m.MessageBox.Icon.ERROR,
//														title : "Error Message"
//													});
//									return;
//								}
//							}
							break;
						default:
							clearance = "";
							idCard = false;
							holdRelLeterV = false;
							fandF = false;
						}

//						var LEAVEBAL_UPDATED = this.getView().byId("updLvBal")
//								.getValue();
//						if ((LEAVEBAL_UPDATED < 0 || LEAVEBAL_UPDATED > 99)
//								&& this.getView().byId("updLvBal").getVisible() === true) {
//							sap.m.MessageBox
//									.show(
//											"Please enter correct 'Updated Leave Balance'",
//											{
//												icon : sap.m.MessageBox.Icon.ERROR,
//												title : "Error Message"
//											});
//							return;
//						}
					//	var cdate = this.getView().byId("fnfCheckhand")
					//			.getDateValue();
					//	var CHEQUE_DATE = this.oDateFormat.format(new Date(
					//			cdate));

						var data = {
							"Pernr" : this.pernr,
							"Earqn" : this.earqn,
							"A_eardt" : date1,
							"Earba" : remarks,
							"Flag" : status,
							"FwdEaaid" : user,
							// "DtReg": this.sepHeaderModel.oData.DtReg,
							"LastWork" : date1,// //////////////
							// "LastWorkSys":
							// this.sepHeaderModel.oData.LastWorkSys,
							// "LeaveBal": this.sepHeaderModel.oData.LeaveBal,
							"ShortNotice" : shortNotice,// //////////////
							"remark" : remark,// //////////////
							// "SHORTNOTICE_EMP":
							// this.sepHeaderModel.oData.SHORTNOTICE_EMP,
							// "REMARK_EMP":
							// this.sepHeaderModel.oData.REMARK_EMP,
							// "SHORTNOTICE_RM1": this.sepHeaderModel.oData.,
							// "REMARK_RM1": this.sepHeaderModel.oData.,
							// "SHORTNOTICE_RM2": this.sepHeaderModel.oData.,
							// "REMARK_RM2": this.sepHeaderModel.oData.,
							// "SHORTNOTICE_RM3": this.sepHeaderModel.oData.,
							// "REMARK_RM3": this.sepHeaderModel.oData.,
							// "SHORTNOTICE_HOD": this.sepHeaderModel.oData.,
							// "REMARK_HOD": this.sepHeaderModel.oData.,
							// "SHORTNOTICE_HR_HEAD":
							// this.sepHeaderModel.oData.,
							// "REMARK_HR_HEAD": this.sepHeaderModel.oData.,

							"Role" : this.sepHeaderModel.oData.Role,
							"MGR_CLEARANCE" : mgr_clearance,
							"IT_CLEARANCE" : it_clearance,
							"FINANCE_CLEARANCE" : finance_clearance,
							"EDITOR_CLEARANCE" : editor_clearance,
							"ADMIN_CLEARANCE" : admin_clearance,
							// "DB_CLEARANCE" : db_clearance,
							// "EM_CLEARANCE" : em_clearance,
							"ICARD_CLEARANCE" : idCard,
								"RL_FLAG" : holdRelLeterV,
							//"FINAL_SETTLMENT_DONE" : fandF,
							"NoticePeriod" : tNtcp,
							"Leaveadj" : leaveADJ,
							"SHORTNOTICE_Waiver" : shortNoticeWvr,
							"SHORTNOTICE_Deduction" : shortNoticeDdctn,
							// "SHORTNOTICE_HOD2": SHORTNOTICE_HOD2,
							// "REMARK_HOD2": REMARK_HOD2,
							// "LastWorkSys_HOD2": LastWorkSys_HOD2,
							//"LEAVEBAL_UPDATED" : LEAVEBAL_UPDATED,
							//"CHEQUE_DATE" : CHEQUE_DATE,
							// "SHORTNOTICE_Waiver_HOD2":
							// SHORTNOTICE_Waiver_HOD2,
							// "SHORTNOTICE_Deduction_HOD2":
							// SHORTNOTICE_Deduction_HOD2,
							"rc_rspnsblts" : rc_rspnsblts,
							"rc_docMail" : rc_docMail,
							"rc_matrlManls" : rc_matrlManls,
							"rc_deptAssts" : rc_deptAssts,
							"fc_loans" : fc_loans,
							"fc_advOutstnd" : fc_advOutstnd,
							"fc_compLeasAcmdtn" : fc_compLeasAcmdtn,
							"fc_dueOutstndCopertv" : fc_dueOutstndCopertv,
							"fc_recvrExsMobRembrsmnt" : fc_recvrExsMobRembrsmnt,
							"ic_desktop" : ic_desktop,
							"ic_laptop" : ic_laptop,
							"ic_dtCard" : ic_dtCard,
							"ic_mobil" : ic_mobil,
							"ic_sim" : ic_sim,
							"ic_extHdd" : ic_extHdd,
							"ic_dvdWrtr" : ic_dvdWrtr,
							"ic_addMobil" : ic_addMobil,
							"ic_addSim" : ic_addSim,
/*							"ic_actvDirctry" : ic_actvDirctry,
							"ic_dtopCntrl" : ic_dtopCntrl,
							"ic_emailId" : ic_emailId,
							"ic_grpEmlIdownshp" : ic_grpEmlIdownshp,
							"ic_sapId" : ic_sapId,
							"ic_atexId" : ic_atexId,
							"ic_essId" : ic_essId,
							"ic_intrntAcsPlcy" : ic_intrntAcsPlcy,
							"ic_othrApps" : ic_othrApps,*/
							"ac_cupbrdKy" : ac_cupbrdKy,
							"ac_drwrKy" : ac_drwrKy,
							"ac_cbinKy" : ac_cbinKy,
							"ac_spike" : ac_spike,
							"ac_spFurntr" : ac_spFurntr,
							"ac_carUsgWithdrwl" : ac_carUsgWithdrwl,
							"ec_camera" : ec_camera,
							"ec_lens" : ec_lens,
							"ec_speedlight" : ec_speedlight,
							"ec_laptop" : ec_laptop,
							"ec_dataCard" : ec_dataCard,
							"ec_voicRcrdr" : ec_voicRcrdr,
							"ec_ipad" : ec_ipad,
							"ec_tab" : ec_tab,
							"ec_headPhone" : ec_headPhone,
							"ec_hdd" : ec_hdd,
							"Dc_camb_chgr" : dc_camb_chgr,
							"Dc_someid" : dc_someid,
							"Dc_onsitools" : dc_onsitools,
							"Dc_drives" : dc_drives,
							"Dc_vpn_acc" : dc_vpn_acc,
							"Dc_email_dact" : dc_email_dact,
							"Dc_cms_login" : dc_cms_login,
							"Separation_notes_nav" : this.notesData.results, // notesData.results,
							"Separation_attach_nav" : this.createData.results,
							//new  fields added offboard process 
							"ElbLwd": ElbLwds,
							"Leaveadjbsal":Leaveadjbsal,
							"Ffsaltopay": Ffsaltopay,
							"Lta":lta,
							"Gratuity": Gratuity,
							"Nightalownc":Nightalownc,
							"Exgratia":Exgratia,
							"Salhldaywrk": Salhldaywrk,
							"Ffamount": Ffamount,
							"Fftranstype": Fftranstype,
							"ElbLwdRmks": ElbLwdsRIp,
							"FfsaltopayRmks": FfsaltopayRIp,
							"LtaRmks":ltaRIp,
							"GratuityRmks": GratuityRIp,
							"NightalowncRmks":NightalowncRIp,
							"ExgratiaRmks":ExgratiaRIp ,
							"SalhldaywrkRmks": SalhldaywrkRIp
						// attachData.results
						};

						sap.ui.core.BusyIndicator.show(0);
						setTimeout(
								jQuery
										.proxy(
												function() {
													thisInst.oDataModel
															.create(
																	"/Separation_headerSet",
																	data,
																	null,
																	function(
																			oData,
																			oResponse) {
																		sap.ui.core.BusyIndicator
																				.hide();
																		if (status === 'A') {
																			var msg = "Request Number "
																					+ oData.Earqn
																					+ " is successfully approved";
																		} else if (status === 'R') {
																			var msg = "Request Number "
																					+ oData.Earqn
																					+ " is successfully rejected";
																		} else if (status === 'S') {
																			var msg = "Request Number "
																					+ oData.Earqn
																					+ " is successfully Saved";
																		} else {
																			var msg = "Request Number "
																					+ oData.Earqn
																					+ " is successfully forwaded";
																		}
																		sap.m.MessageBox
																				.show(
																						msg,
																						{
																							icon : sap.m.MessageBox.Icon.SUCCESS,
																							title : "Success Message",
																							actions : [ sap.m.MessageBox.Action.OK ],
																							onClose : function(
																									oAction) {
																								thisInst.createData = {
																									"results" : []
																								};
																								thisInst.notesData = {
																									"results" : []
																								};
																								thisInst.router
																										.navTo('ReqMaster');
																								var protocol = window.location.protocol;
																								var host = window.location.host;
																								thisInst.oDataModel.read("/Emp_headerSet",
																										null, null, false, function(oData, response) {
																											  // check if the result is a number
																											  if (isNaN(oData.results.length)){
																												  thisInst.count = parseInt(oData.results.length);
																											  } else{
																												  thisInst.count = oData.results.length;
																											  }
																										});
																									if(thisInst.count == "0"){
																								//		thisInst.router.navTo('ReqInitial', {
																								//			pernr : 0,
																								//			request:0
																								//		});
																										window.location.href = protocol + "//" + host + "/sap/bc/ui5_ui5/ui2/ushell/shells/abap/Fiorilaunchpad.html#Shell-home";
																									};
																							}
																						});
																	},
																	function(
																			oError) {
																		sap.ui.core.BusyIndicator
																				.hide();
																		var errMsg = "An error occurred while processing the request.";
																		try {
																			var json = JSON
																					.parse(oError.response.body);
																			errMsg = json.error.message.value;
																		} catch (e) {
																			if (oError && oError.message) {
																				errMsg = oError.message;
																			}
																		}
																		sap.m.MessageBox
																				.show(
																						errMsg,
																						{
																							icon : sap.m.MessageBox.Icon.ERROR,
																							title : "Error Message",
																							actions : [ sap.m.MessageBox.Action.OK ]
																						});
																	});
												}, this), 0);

					},
					addNotes : function() {

						var data = this.notesModel.getData();
						var thisInst = this;

						var textArea = new sap.m.TextArea({
							rows : 4,
							width : "100%",
							placeholder : 'Add note'
						});

						var dialog = new sap.m.Dialog({
							title : "Add notes",
							contentWidth : "30rem",
							content : [ textArea ],
							leftButton : new sap.m.Button({
								text : 'Ok',
								press : function() {
									if (textArea.getValue() !== "") {
										thisInst.notesData.results.push({
											"Eaiod" : "",
											"Eaibu" : "",
											"Earmk" : textArea.getValue(),
											"Flag" : ""
										});
										data.results.push({
											"Eaiod" : "",
											"Eaibu" : "",
											"Earmk" : textArea.getValue(),
											"Flag" : ""
										});
										thisInst.notesModel.setData(data);
										thisInst.notesModel.refresh(true);
									}
									dialog.close();
								}
							}),
							rightButton : new sap.m.Button({
								text : 'Cancel',
								press : function() {
									dialog.close();
								}
							}),
							afterClose : function() {
								dialog.destroy();
							}
						}).addStyleClass("sapUiPopupWithPadding");

						dialog.open();
					},

					onChangeAttachment : function(e) {
						var oUploadCollection = e.getSource();

						this.item = this.item + 1;
						var oFiles = e.getParameters().files;
						this.fileSize = oFiles[0].size / 1000000;

						this.fileType = oFiles[0].type;

						var oServiceUrl = this.oDataModel.sServiceUrl;
						oUploadCollection.setUploadUrl(oServiceUrl
								+ "/Sep_attachmentSet");
						
						//File URL
						var fUrl = oServiceUrl + "/Sep_attachmentSet(Pernr='" + this.pernr + "',Earqn='" + this.earqn + "',Easqn='" + this.item + "')/$value";
						
						// Header Token
						var oCustomerHeaderToken = new sap.m.UploadCollectionParameter(
								{
									name : "x-csrf-token",
									value : window.header_xcsrf_token
								});
						// Header Slug
						var oCustomerHeaderSlug = new sap.m.UploadCollectionParameter(
								{
									name : "slug",
									value : this.item + "/"
											+ e.getParameter("files")[0].name
									//		+ "/" + this.fileSize														//Deleted by Lakshmana P for CR-31: Offboarding 2nd phase
											+ "/" + this.fileSize + "/" + this.pernr + "/" + this.earqn + "/" +	fUrl	//Deleted by Lakshmana P for CR-31: Offboarding 2nd phase
								});

						oUploadCollection
								.addHeaderParameter(oCustomerHeaderToken);
						oUploadCollection
								.addHeaderParameter(oCustomerHeaderSlug);
					},

					onUploadAttachment : function(oEvent) {
						var data = this.createAttachModel.getData();
						var thisInst = this;
						var easqn = this.item.toString();

						data.results
								.push({
									"Easqn" : easqn,
									"Filename" : oEvent.getParameters().files[0].fileName,
									"Mimetype" : oEvent.getParameters().files[0].headers['content-type'],
									"Url" : oEvent.getParameters().files[0].headers.location,
									"Pernr" : thisInst.pernr,
									"Flag" : 'X',
									"Eaiod" : "",
									"Eaiot" : "",
									"Earqn" : "",
									"Uname" : ""
								});

						this.createData.results
								.push({
									"Easqn" : easqn,
									"Filename" : oEvent.getParameters().files[0].fileName,
									"Mimetype" : oEvent.getParameters().files[0].headers['content-type'],
									"Url" : oEvent.getParameters().files[0].headers.location,
									"Pernr" : thisInst.pernr,
									"Flag" : 'X',
									"Eaiod" : "",
									"Eaiot" : "",
									"Earqn" : "",
									"Uname" : ""
								});

						this.createAttachModel.setData(data);
						sap.m.MessageToast.show("Upload successful");
					},

					handleTypeMissmatch : function(oEvent) {

						var oFiles = oEvent.getParameters().files;
						var fileType = oFiles[0].fileType;

						var aFileTypes = oEvent.getSource().getFileType();
						jQuery.each(aFileTypes, function(key, value) {
							aFileTypes[key] = "*." + value;
						});
						var sSupportedFileTypes = aFileTypes.join(", ");
						sap.m.MessageToast
								.show("The file type *."
										+ fileType
										+ " is not supported. Choose one of the following types: "
										+ sSupportedFileTypes);
					},

					onFileDeleted : function(oEvent) {
						this._deleteItemById(oEvent.getParameter("documentId"));
					},
					
					// checkDone1 : function(oEvent) {
					// sap.m.MessageBox.information("Your Relieving Letter On Hold");
					// },

					_deleteItemById : function(sItemToDeleteId) {
						debugger;
						var easqn;
						var pernr;

						var oData = this.getView().byId("uploadCollId")
								.getModel('attachment').getData();
						var aItems = jQuery.extend(true, {}, oData).results;
						jQuery
								.each(
										aItems,
										function(index) {
											if (aItems[index]
													&& aItems[index].Easqn === sItemToDeleteId) {
												easqn = aItems[index].Easqn;
												pernr = aItems[index].Pernr;
												aItems.splice(index, 1);
											}
										});
						this.getView().byId("uploadCollId").getModel(
								'attachment').setData({
							"results" : aItems
						});
						this.item = this.item - 1;
						this.oDataModel.remove("/Separation_attachmentSet(Pernr='"
												+ pernr + "',Earqn='" + this.earqn + "',Easqn='"
												+ easqn + "')",
										null,
										null,
										function(oData, oResponse) {
											debugger;
										},
										function(oError) {
											var errMsg = "An error occurred while deleting the attachment.";
											try {
												var json = JSON
														.parse(oError.response.body);
												errMsg = json.error.message.value;
											} catch (e) {
												if (oError && oError.message) {
													errMsg = oError.message;
												}
											}
											sap.m.MessageBox
													.show(
															errMsg,
															{
																icon : sap.m.MessageBox.Icon.ERROR,
																title : "Error Message",
																actions : [ sap.m.MessageBox.Action.OK ]
															});
										});
					},

					onNotesDelete : function(oEvent) {
						var data = this.notesModel.getData();

						var oList = oEvent.getSource(), oItem = oEvent
								.getParameter("listItem"), sPath = oItem
								.getBindingContext('notes').getPath();
						var index = sPath.substring(sPath.lastIndexOf('/') + 1,
								sPath.length);

						data.results[index].Flag = 'X';
						this.notesModel.setData(data);
						this.notesModel.refresh(true);
					},

					

					validation : function(id) {
						var Error = 0;
						if(id === "off_lta" || id === "off_Gratuity"){
							var value = this.getView().byId(id).getSelectedKey();
							var visible = this.getView().byId(id).getEnabled();
						} else{
							var value = this.getView().byId(id).getValue();
							var visible = this.getView().byId(id).getEditable();
						}
						if ((value === "" || value === " ") && visible === true) {
						   Error = Error + 1;
						} else {
							Error;
						}
						
						return Error;
/*						if (Error > 0) {
							sap.m.MessageBox.show(
									"Please enter mandatory fields", {
										icon : sap.m.MessageBox.Icon.ERROR,
										title : "Error Message"
									});
							return ;
						} else {
							return ;
						}*/

					}

				/**
				 * Similar to onAfterRendering, but this hook is invoked before the controller's
				 * View is re-rendered (NOT before the first rendering! onInit() is used for
				 * that one!).
				 * 
				 * @memberOf views.RequestsDetail
				 */
				// onBeforeRendering: function() {
				//
				// },
				/**
				 * Called when the View has been rendered (so its HTML is part of the document).
				 * Post-rendering manipulations of the HTML could be done here. This hook is the
				 * same one that SAPUI5 controls get after being rendered.
				 * 
				 * @memberOf views.RequestsDetail
				 */
				// onAfterRendering: function() {
				//
				// },
				/**
				 * Called when the Controller is destroyed. Use this one to free resources and
				 * finalize activities.
				 * 
				 * @memberOf views.RequestsDetail
				 */
				// onExit: function() {
				//
				// }
				});