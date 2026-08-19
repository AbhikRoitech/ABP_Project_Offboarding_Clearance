jQuery.sap.declare("sap.abp.eSeparation.approve.Common");

sap.abp.eSeparation.approve.Common = {

	onNavBack : function(e) {
		if (sap.ui.Device.system.phone) {
			var oHistory = sap.ui.core.routing.History.getInstance();
			var sPreviousHash = oHistory.iHistoryPosition;
			window.history.go(-sPreviousHash);
		} else {
			var router = sap.ui.core.UIComponent.getRouterFor(this);
			router.navTo('home');
		}
	},

	formatDate : function(oDate) {
		if (oDate != undefined && oDate != null) {
			var year = oDate.substring(0, 4);
			var month = oDate.substring(4, 6);
			var date = oDate.substring(6);

			oDate = date + "." + month + "." + year;
		}

		return oDate;
	},
	
	getGender : function (oGender) {
		
		if (oGender != undefined && oGender != null) {
			
			if (oGender == '1'){
				oGender = 'Male';
			}
			else if (oGender == '2'){
				oGender = 'Female';
			}
		}
		return oGender;
	},
	
	formatDelFromToDate : function(oDate) {
		if (oDate != undefined || oDate != null) {
			var year = oDate.substring(0, 4);
			var month = oDate.substring(4);

			oDate = month + "." + year;
		}

		return oDate;
	},

	formatTime : function(oTime) {
		if (oTime != undefined && oTime != null && oTime != "") {
			var hour = oTime.substring(0, 2);
			var min = oTime.substring(2, 4);
			var sec = oTime.substring(4, 6);

			oTime = hour + ":" + min + ":" + sec;
		}

		return oTime;
	},

	formatDelete: function(flag, oRole){
		if( flag==="X" && ( oRole==="PA" || oRole==="FF" || oRole==="PB" ) ){
			return true;
		}else{
			return false;
		}
	},
	
	vis_emplwd : function(oRole){
		if(oRole==="RM" ||oRole==="RW" ||oRole==="R2" || oRole==="R3" || oRole==="HD" || oRole==="H2" || oRole==="HR" || oRole==="HH"){
			return true;
		}else{
			return false;
		}
	},
	
	vis_slwd : function(oRole){
		if(oRole==="RM" ||oRole==="RW" || oRole==="R2" || oRole==="R3" || oRole==="HD" || oRole==="H2" || oRole==="HR" || oRole==="HH"){
			return true;
		}else{
			return false;
		}
	},
	
	visLwdRm1 : function(oRole){
		if(oRole==="R2" || oRole==="R3" || oRole==="HD" || oRole==="H2" || oRole==="HR" || oRole==="HH"){
			return true;
		}else{
			return false;
		}
	},
	
	visLwdHod : function(oRole){
		if(oRole==="H2" || oRole==="HR" || oRole==="HH"){
			return true;
		}else{
			return false;
		}
	},
	
	visLwdHod2 : function(oRole, oLastWorkSys_HOD2){
		if((oRole==="HR" || oRole==="HH") && (oLastWorkSys_HOD2 !=='') && (oLastWorkSys_HOD2 ==='00:00:00')){
			return true;
		}else{
			return false;
		}
	},
	
	vis_lvBal : function(oRole){
		if(oRole==="RM" ||oRole==="RW" || oRole==="R2" || oRole==="R3" || oRole==="HD" || oRole==="H2" || oRole==="HR" || oRole==="HH" || oRole==="PC" || oRole==="HF" || oRole==="PF"){
			return true;
		}else{
			return false;
		}
	},
	
	vis_empShNt : function(oRole){
		if(oRole==="RM" ||oRole==="RW" || oRole==="R2" || oRole==="R3" || oRole==="HD" || oRole==="H2" || oRole==="HR" || oRole==="HH"){
			return true;
		}else{
			return false;
		}
	},
	
	vis_ShNtWvr : function(oRole){
		if(oRole==="HD" || oRole==="H2" || oRole==="HH" || oRole==="PC" || oRole==="HR" || oRole==="PC" || oRole==="HF" || oRole==="PF"){
			return true;
		}else{
			return false;
		}
	},
	
	vis_ShNtWvrEdit : function(oRole){
		if(oRole==="HD" || oRole==="H2" || oRole==="HH"){
			return true;
		}else{
			return false;
		}
	},
	
	vis_ShNtDedction : function(oRole){
		if(oRole==="HD" || oRole==="H2" || oRole==="HH" || oRole==="PC" || oRole==="HR"  || oRole==="PC" || oRole==="HF" || oRole==="PF"){
			return true;
		}else{
			return false;
		}
	},
	
	vis_sepReason : function(oRole){
		if(oRole==="RM" ||oRole==="RW" || oRole==="R2" || oRole==="R3" || oRole==="HD" || oRole==="H2" || oRole==="HR" || oRole==="HH"){
			return true;
		}else{
			return false;
		}
	},
	
	vis_empRmrk : function(oRole, oREMARK_EMP){
		if((oRole==="RM" ||oRole==="RW" || oRole==="R2" || oRole==="R3" || oRole==="HD" || 
				oRole==="H2" || oRole==="HR" || oRole==="HH" || oRole==="PC" || oRole==="PF" || oRole==="HF" ) && (oREMARK_EMP !=='')){
			return true;
		}else{
			return false;
		}
	},
	
	vis_rm1Rmrk : function(oRole, oREMARK_RM1){
		if((oRole==="R2"  || oRole==="R3" || oRole==="HD" || oRole==="H2" || oRole==="HR" || oRole==="HH" || oRole==="PC" || oRole==="HF" || oRole==="PF") && (oREMARK_RM1 !=='')){
			return true;
		}else{
			return false;
		}
	},

	vis_rm2Rmrk : function(oRole, oREMARK_RM2){
		if((oRole==="R3" || oRole==="HD" || oRole==="H2" || oRole==="HR" || oRole==="HH" || oRole==="PC" || oRole==="HF" || oRole==="PF") && (oREMARK_RM2 !=='')){
			return true;
		}else{
			return false;
		}
	},
	
	vis_rm3Rmrk : function(oRole, oREMARK_RM3){
		if((oRole==="HD" || oRole==="H2" || oRole==="HR" || oRole==="HH" || oRole==="PC" || oRole==="HF" || oRole==="PF") && (oREMARK_RM3 !=='')){
			return true;
		}else{
			return false;
		}
	},
	
	vis_hodRmrk : function(oRole, oREMARK_HOD){
		if((oRole==="H2" || oRole==="HR" || oRole==="HH" || oRole==="PC" || oRole==="HF" || oRole==="PF") && (oREMARK_HOD !=='')){
			return true;
		}else{
			return false;
		}
	},
	
	vis_hod2Rmrk : function(oRole, oREMARK_HOD2){
		if((oRole==="HR" || oRole==="HH" || oRole==="PC" || oRole==="HF" || oRole==="PF") && (oREMARK_HOD2 !=='')){
			return true;
		}else{
			return false;
		}
	},
	
	vis_hrRmrk : function(oRole, oREMARK_HRBP){
		if((oRole==="HH" || oRole==="PC" || oRole==="HF" || oRole==="PF") && (oREMARK_HRBP !=='')){
			return true;
		}else{
			return false;
		}
	},
	
	vis_hrHeadRmrk : function(oRole, oREMARK_HR_HEAD){
		if((oRole==="PC" || oRole==="HF" || oRole==="PF") && (oREMARK_HR_HEAD !=='')){
			return true;
		}else{
			return false;
		}
	},
	
	vis_lwd : function(oRole){
	//	if(oRole==="RM" || oRole==="RM1" || oRole==="R2"  || oRole==="R3" || oRole==="A012"){
	//	if(oRole==="RM" || oRole==="R2" || oRole==="R3" || oRole==="HD" || oRole==="HR" || oRole==="HH"){
		if(oRole==="R2" || oRole==="R3" ||  oRole === "HR" ){
			return false;
		}else{
			return true;
		}
	},
	
	edit_lwd : function(oRole){
		if(oRole==="RM" || oRole==="HD" || oRole==="H2" || oRole==="HH"){
			return true;
		}else{
			return false;
		}
	},
//	soc chaged done by dharmesh on 18/12/2019 {
	
	edit_offboard_fiedls:function(oRole){
		// || oRole==="HF"
		if( oRole==="HD" || oRole==="H2" || oRole==="HH"){
			return true;
		}else{
			return false;
		}
		
	},
	vis_offboard_fiedls:function(oRole){
		
		if( oRole==="HD" || oRole==="H2" || oRole==="HH"  || oRole==="HF" || oRole==="PC"  || oRole==="PF" || oRole==="HR"  ){
			return true;
		}else{
			return false;
		}
		
	},
	
	vis_offboard_process:function(oRole){
		
		if( oRole==="PB" || oRole==="PC" || oRole==="FF"  || oRole==="PA" || oRole==="HF" || oRole==="PF" ){
			return true;
		}else{
			return false;
		}
		
	},
	vis_offboard_process_radio:function(oRole){
		
		if( oRole==="PB" || oRole==="PC" || oRole==="FF"  || oRole==="PA" || oRole==="HF" || oRole==="PF" || oRole==="HR" || oRole==="HH" ){
			return true;
		}else{
			return false;
		}
		
	},
	vis_offboard_process_ffa:function(oRole){
		
		if(oRole==="PB"  || oRole==="FF"  || oRole==="PA" || oRole==="PF"){
			return true;
		}else{
			return false;
		}
		
	},
	edit_offboard : function(oRole){
		if(oRole==="PC" || oRole==="HH" || oRole==="H2" ){
			return true;
		}else{
			return false;
		}
	},
	mand_offboard : function(oRole){
		if(oRole==="PC " || oRole==="HH"){
			return true;
		}else{
			return false;
		}
	},
	edit_offboard_payroll : function(oRole){
		if(oRole==="PC" ) {
			return true;
		}else{
			return false;
		}
	},

	edit_offboard_hrhead : function(oRole){
		if(oRole==="HH" || oRole === "HR" || oRole === "HF" || oRole === "PA" || oRole === "PB") {
			return true;
		}else{
			return false;
		}
	},
	
	edit_offboard_el: function(oRole){
		if(oRole==="PC" || oRole === "HF") {
			return true;
		}else{
			return false;
		}
	},

	edit_offboard_ff: function(oRole){
		if(oRole==="HF" || oRole==="PC" ) {
			return true;
		}else{
			return false;
		}
	},
	
	edit_offboard_lta: function(oRole){
		if(oRole==="PC" || oRole === "HF" ) {
			return true;
		}else{
			return false;
		}
	},
	edit_offboard_gt: function(oRole){
		if(oRole==="PC" || oRole === "HF" ) {
			return true;
		}else{
			return false;
		}
	},
	edit_offboard_na: function(oRole){
		if( oRole === "HF" || oRole==="PC" ) {
			return true;
		}else{
			return false;
		}
	},
	edit_offboard_ex: function(oRole){
		if( oRole === "HF" || oRole==="PC") {
			return true;
		}else{
			return false;
		}
	},
	edit_offboard_shw: function(oRole){
		if(oRole === "HF" || oRole==="PC" ) {
			return true;
		}else{
			return false;
		}
	},
	edit_offboard_ffa: function(oRole){
		if(oRole === "PA" || oRole === "FF"  ) {
			return true;
		}else{
			return false;
		}
	},
	requiredIdCard: function(oRole){
		if(oRole === "PF") {
			return true;
		}else{
			return false;
		}
	},

	vis_ElbLwdsRIp : function(oRole){
		if(oRole==="HF" || oRole ==="PC"){
			return true;
		}else{
			return false;
		}
	},

	vis_FfsaltopayRIp : function(oRole){
		if(oRole==="HF"){
			return true;
		}else{
			return false;
		}
	},

	vis_ltaRIp : function(oRole){
		if(oRole==="HF" || oRole ==="PC"){
			return true;
		}else{
			return false;
		}
	},

	vis_GratuityRIp : function(oRole){
		if(oRole==="HF" || oRole ==="PC"){
			return true;
		}else{
			return false;
		}
	},

	vis_NightalowncRIp : function(oRole){
		if(oRole==="HF"){
			return true;
		}else{
			return false;
		}
	},

	vis_ExgratiaRIp : function(oRole){
		if(oRole==="HF"){
			return true;
		}else{
			return false;
		}
	},

	vis_SalhldaywrkRIp : function(oRole){
		if(oRole==="HF"){
			return true;
		}else{
			return false;
		}
	},

	vis_remarks_offboard_pers : function(oRole){
		if(oRole==="HF" || oRole ==="PA" || oRole ==="FF" || oRole ==="PB" ){
			return true;
		}else{
			return false;
		}
	},
	vis_remarks_offboard_hrhd: function(oRole){
		if(  oRole ==="PA" || oRole ==="FF" || oRole ==="PB"|| oRole === "PF" ){
			return true;
		}else{
			return false;
		}
	},
	vis_remarks_offboard_fin: function(oRole){
		if( oRole ==="PB" || oRole === "PF"  ){
			return true;
		}else{
			return false;
		}
	},
	vis_remarks_offboard_payroll: function(oRole){
		if(oRole==="FF" || oRole === "PF"){
			return true;
		}else{
			return false;
		}
	},
	
	
	// } eoc chaged done by dharmesh on 18/12/2019
	
	vis_rbtnEmpSys : function(oRole){
		if(oRole==="RM" || oRole==="HD" || oRole==="H2" || oRole==="HH"){
			return true;
		}else{
			return false;
		}
	},
	
	vis_rbtnRm1 : function(oRole){
		if(oRole==="HD" || oRole==="H2" || oRole==="HH"){
			return true;
		}else{
			return false;
		}
	},
	
	vis_rbtnHod : function(oRole){
		if(oRole==="H2" || oRole==="HH"){
			return true;
		}else{
			return false;
		}
	},
	
	vis_rbtnHod2 : function(oRole, oLastWorkSys_HOD2){
		if((oRole==="HH" ) && (oLastWorkSys_HOD2 !=='') && (oLastWorkSys_HOD2 ==='00:00:00')){
			return true;
		}else{
			return false;
		}
	},
	
	vis_rmShNt : function(oRole){
		if(oRole==="R2" || oRole==="R3" || oRole==="HD" || oRole==="H2"   || oRole==="HR" || oRole==="HH"){
			return true;
		}else{
			return false;
		}
	},
	
	vis_ShNt : function(oRole){
		if(oRole==="RM" ||oRole==="RW" || oRole==="R2" || oRole==="R3" || oRole==="HD" || oRole==="H2" || oRole==="HR" || oRole==="HH" || oRole==="PC" || oRole==="HF" || oRole==="PF" ){
			return true;
		}else{
			return false;
		}
	},
	
	vis_ntcprd : function(oRole){
		if(oRole==="RM" ||oRole==="RW" || oRole==="R2" || oRole==="R3" || oRole==="HD" || oRole==="H2" || oRole==="HR" || oRole==="HH" || oRole==="PC" || oRole==="HF" || oRole==="PF" ){
			 
			return true;
		}else{
			return false;
		}
	},
	
	vis_ntcprdSrvd : function(oRole){
		if(oRole==="HD" || oRole==="H2" || oRole==="HR" || oRole==="HH"){
			return true;
		}else{
			return false;
		}
	},
	
	vis_clrnc : function(oRole){
		//if(oRole==="IC" || oRole==="EC" || oRole==="FC" || oRole==="AC" || oRole==="RC" || oRole==="PC" || oRole==="HF" || oRole==="PA" || oRole==="FF" || oRole==="PB" || oRole==="PF"){
		if(oRole==="IC" || oRole==="EC" || oRole==="FC" || oRole==="AC" || oRole==="RC" || oRole==="PC" || oRole==="HF" || oRole==="PF" || oRole==="DB" || oRole==="EM" || oRole==="DE"){
			return true;
		}else{
			return false;
		}
	},
	
	vis_clrnComments : function(oRole, oREMARK_CLEARANCE){
		if((oRole==="PC" || oRole==="HF" || oRole==="PF" || oRole==="PA" || oRole==="PB") && (oREMARK_CLEARANCE !=='')){
			return true;
		}else{
			return false;
		}
	},
	
// Begin of Drop down values visibility
	editClrnc : function(oRole){
		if(oRole==="EC"){
			return true;
		}else{
			return false;
		}
	},
	
	infrClrnc : function(oRole){
		if(oRole==="AC"){
			return true;
		}else{
			return false;
		}
	},
	
	itClrnc : function(oRole){
		if(oRole==="IC"){
			return true;
		}else{
			return false;
		}
	},
	
	finClrnc : function(oRole){
		if(oRole==="FC"){
			return true;
		}else{
			return false;
		}
	},
	
	fnctnClrnc : function(oRole){
		if(oRole==="RC"){
			return true;
		}else{
			return false;
		}
	},
// End of Drop down values visibility
	vis_UpdLvBal : function(oRole){
		if(oRole==="PC"){
			return false;
		}else{
			return false;
		}
	},
	
	vis_fnfCheckhand : function(oRole){
		if(oRole==="PC"){
			return false;
		}else{
			return false;
		}
	},
	
	disp_clrncText : function(oRole){
		var text = "";
		switch(oRole) {
		    case "RC":
		        text = "Clearance / No Objection from Function after receiving the respective Handover / Documents / Materials / Assets / SAP ID de-activation etc.";
		        break;
		    case "IC":
		        text = "Clearance / No Objection from IT department after receiving the respective Handover / Documents / Materials / Assets / etc.";
		        break;
		    case "EC":
		        text = "Clearance / No Objection from Editorial Services department after receiving the respective Handover / Documents / Materials / Assets / etc.";
		        break;
		    case "FC":
		        text = "Clearance / No Objection from Finance department after receiving the respective Handover / Documents / Materials / Assets / etc.";
		        break;
		    case "AC":
		        text = "Clearance / No Objection from Infrastructure department after receiving the respective Handover / Documents / Materials / Assets / etc.";
		        break;
		    case "PC":
		        text = "Clearance / No Objection from Personnel department after receiving the respective Handover / Documents / Materials / Assets / etc.";
		        break;
		    default:
		        text = "";
		}
		return text;
	},
	
	vis_submCard : function(oRole){
		if(oRole==="PC" || oRole==="HF" || oRole==="PF" || oRole==="PA" || oRole==="FF" || oRole==="PB" ){
			return true;
		}else{
			return false;
		}
	},
	
	vis_holdRelLeter : function(oRole){
		if(oRole==="PF" || oRole==="PB"){
			return true;
		}else{
			return false;
		}
	},
	
	// reqHoldRelLeter: function(oRole){
	// 	if(oRole === "PF") {
	// 		return true;
	// 	}else{
	// 		return false;
	// 	}
	// },
	
	enbl_HoldRelLeter : function(oRole){
		if(oRole === "PF"){
			return true;
		}else{
			return false;
		}
	},
	
		/// Starts code for Print Digital and Editorial  18-01-2023/////
		
	itClrnc1 : function(oRole){
		if(oRole==="IC" || oRole==="EC"){
			return true;
		}else{
			return false;
		}
	},
	
	itClrnc2 : function(oRole){
		if(oRole==="IC" || oRole==="EC" || oRole==="DE"){
			return true;
		}else{
			return false;
		}
	},
	
	vis_dbmae : function(oRole){
		if(oRole==="DB"){
			return true;
		}else{
			return false;
		}
	},
	
	vis_cmslogin : function(oRole){
		if(oRole==="EM" || oRole==="DE"){
			return true;
		}else{
			return false;
		}
	},

	editClrnc1 : function(oRole){
		if(oRole==="EC" || oRole==="DE"){
			return true;
		}else{
			return false;
		}
	},
	
	vis_digiEdit : function(oRole){
		if(oRole==="DE"){
			return true;
		}else{
			return false;
		}
	},
	/// Ends code for Print Digital and Editorial 02-02-2023 /////
	
	vis_fandf : function(oRole){
		if(oRole==="PC"){
			return false;
		}else{
			return false;
		}
	},
	
	vis_Rmrk : function(oRole){
		if(oRole==="RM" ||oRole==="RW" || oRole==="HD" || oRole==="H2" || oRole==="HH" || oRole==="R2" || oRole==="R3" || oRole==="HR" || oRole==="PA" || oRole==="FF" || oRole==="PB"){
			return true;
		}else{
			return false;
		}
	},
	rmrk_required : function(oRole){
		if(oRole==="RM" ||oRole==="RW" || oRole==="HD" || oRole==="H2" || oRole==="HH"){
			return true;
		}else{
			return true;
		}
	},
	
	vis_Reject : function(oRole){
//		if(oRole==="RM" || oRole==="HD" || oRole==="H2" || oRole==="HH" || oRole ==="PA" || oRole ==="FF" || oRole ==="PB" ||oRole==="RW"){
//		if( oRole ==="PA" || oRole ==="FF" || oRole ==="PP" ||oRole==="RW"){
		if(oRole==="RW"){
			return true;
		}else{
			return false;
		}
	},
	
	vis_Save : function(oRole){
		if(oRole==="PA" || oRole==="PB" || oRole==="PC" || oRole==="PF" || oRole==="FF"){
			return true;
		}else{
			return false;
		}
	},
	
	vis_Print : function(oRole){
		if(oRole==="PA" || oRole==="PB" || oRole==="PC"|| oRole==="PF"){
			return true;
		}else{
			return false;
		}
	},
	vis_Attachment : function(oRole){
		if(oRole==="PA" || oRole==="PB" || oRole==="FF" || oRole==="PF"){
			return true;
		}else{
			return false;
		}
	},
	
	vis_AttachmentBtn : function(oRole){
		if(oRole==="PA" || oRole==="FF" || oRole==="PB"){
			return true;
		}else{
			return false;
		}
	},
	
	enb_Print : function(oStatus){
		if(oStatus==="save"){
			return true;
		}else{
			return false;
		}
	},
	
	enbl_submCard : function(oValue, oStatus, oRole){
		//if((oStatus === "save" && oValue === "X" && oRole === "PC" )|| (oStatus === "save" && oValue === "X" && oRole != "PF")){
		if( oRole === "PC" || oRole === "PF"){
		//if(oRole === "PF"){
			return true;
		}else{
			return false;
		}
	},
	
	enbl_fandf : function(oValue, oStatus){
		if(oStatus === "save" && oValue === "X"){
			return false;
		}else{
			return false;
		}
	},
	
	dis_LwdLabel : function(oRole){
		var title = "";
		if(oRole==="RM" || oRole==="R2" || oRole==="R3" ||oRole==="RW"){
			title = "Last Working Day proposed by RM 1";
		}else if(oRole==="HD"){
			title = "Last Working Day proposed by Editor/Departmental Head";
		}else if(oRole==="H2" || oRole==="HR"){
			title = "Last Working Day proposed by Exec. Editor/Functional Head";
		}else if(oRole==="HH"){
			title = "Last Working Day proposed by HR Head";
		}else if(oRole==="IC" || oRole==="EC" || oRole==="FC" || oRole==="AC" || oRole==="RC" || oRole==="PC" || oRole==="HF" || oRole==="PA" || oRole==="FF" || oRole==="PB" || oRole==="PF"){
			title = "Approved Last Working Day";
		}else{
			title = "Last Working Day";
		}
		return title;
	},
	
	disp_approveText : function(oRole){
		var title = "";
		if(oRole==="IC" || oRole==="EC" || oRole==="FC" || oRole==="AC" || oRole==="RC" || oRole==="DB" || oRole==="EM" || oRole==="DE"){
			title = "Submit";
		}else if(oRole==="PC"){
			title = "Submit Offboarding Inputs";
		}else if(oRole==="HF"){
			title = "Approve Offboarding Inputs";
		}else if(oRole==="PA"){
			title = "Submit Full & Final Calculations";
		}else if(oRole==="FF"){
			title = "Approve Full & Final Calculations";
		}else if(oRole==="PF"){
			title = "Identity Card Received";
		}else if(oRole==="PB"){
			title = "Complete Offboarding Process";
		}else if(oRole==="R2" || oRole==="R3" || oRole==="HR"){
			title = "Proceed";
		}else{
			title = "Approve";
		}
		return title;
	},
	
	disAppTitle : function(oRole){
		var title = "";
		if(oRole==="IC" || oRole==="EC" || oRole==="FC" || oRole==="AC" || oRole==="RC" || oRole==="PC" || oRole==="DB" || oRole==="EM" || oRole==="DE"){
			title = "Exit Clearance";
		}else{
			title = "Approve Offboarding";
		}
		return title;
	},
	
	dis_title : function(oRole){
		var title = "";
		if(oRole==="IC" || oRole==="EC" || oRole==="FC" || oRole==="AC" || oRole==="RC" || oRole==="PC" || oRole==="DB" || oRole==="EM" || oRole==="DE"){
			title = "Clearance Details";
		}else{
			title = "Offboarding Details";
		}
		return title;
	}
};