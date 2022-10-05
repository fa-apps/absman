
Ext.define('AbsMan.view.admin.AdminCompanyController', {
    extend: 'AbsMan.view.admin.AdminFormController',

    alias: 'controller.admincompany',


    initControls: function(record) {

        this.initWorkingDaysControl(record);
        this.resetMinAbsLenStore(record.get('absenceunit'));
        this.initAbsUnitControl();

    },

    initWorkingDaysControl : function(record) {

        var wdays = record.get('workingdays').split(','),
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
    },

    initAbsUnitControl : function() {

        this.getView().down('#absenceUnit').on("change",'onAbsUnitChange', this);
    },

    onAbsUnitChange : function(rgroup, newValue, oldValue) {

        this.resetMinAbsLenStore(newValue.absenceunit);
    },

    resetMinAbsLenStore: function(unit) {

        var minAbsLenCombo = this.getView().down('#minAbsenceLength');
            store = unit === 0 ? 'minAbsLengthDays' : 'minAbsLengthHours';

        minAbsLenCombo.bindStore(this.getViewModel().getStore(store));

    },

    forceReload: function(items) {

        console.log(items);
    }

});