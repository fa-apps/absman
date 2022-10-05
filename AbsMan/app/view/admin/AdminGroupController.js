
Ext.define('AbsMan.view.admin.AdminGroupController', {
    extend: 'AbsMan.view.admin.AdminFormController',

    alias: 'controller.admingroup',

    initControls : function () {


        this.initWorkingDaysControl();
    },


    initWorkingDaysControl : function() {

        var wdays = this.formStore.getAt(0).get('workingdays').split(','),
            wdaysControl = this.getView().down('#workingDaysControl');

        Ext.each(wdaysControl.items.items, function (cb) {
            cb.setValue(wdays[cb.name.substr(cb.name.length - 1, 1)] != "0");
        });

        wdaysControl.on("change",this.onWorkingDaysChange,this);
    },


    onWorkingDaysChange : function(cbgroup, newValue) {

        var wdays=[0,0,0,0,0,0,0];
        for(var cb in newValue){
            wdays[cb.substr(cb.length-1,1)]=newValue[cb];
        }
        this.getView().down('#workingDays').setValue(wdays.join(','));
    }



});