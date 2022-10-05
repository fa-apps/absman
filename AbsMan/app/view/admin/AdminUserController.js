
Ext.define('AbsMan.view.admin.AdminUserController', {
    extend: 'AbsMan.view.admin.AdminFormController',
    alias: 'controller.adminuser',


    init: function() {

        var me = this.getView();

        this.currentTarget = null;

        me.on("selectuser", function (userSelection) {

            var user = userSelection[0];

            this.currentTarget.setValue(user.get("name"));
            this.getView().query("#" + this.currentTarget.itemId + "Id")[0].setValue(user.get("id"));

        }, this);

        this.callParent();
    },


    selectUser : function(user) {

        this.currentTarget = user;

        var userSelection = new AbsMan.view.util.PickUser({
            allowMultiple: false,
            opener: this.getView(),
            openerEvent: "selectuser",
            title : "Please select: " + user.getFieldLabel()
        });

        userSelection.show();

    },

    initControls : function () {

        this.initWorkingDaysControl();

    },

    initWorkingDaysControl : function() {

        var wdays = this.formStore.getAt(0).get('workingdays').split(','),
            wdaysControl = this.getView().down('#workingDaysControl');

        Ext.Array.each(wdaysControl.items.items, function (panel) {

            var cb = panel.items.items[0],
                nf = panel.items.items[1],
                day = cb.itemId.split('-'),
                dayIndex = day[1];

            cb.setValue(wdays[dayIndex] != "0");
            nf.setValue(wdays[dayIndex]);
            cb.on("change", this.onWorkingDaySwitch ,this);
            nf.on("change", this.onWorkingDayChange ,this);

        },this);
    },

    onWorkingDaySwitch : function( workingDaySwitch, newValue) {

        var workingDay = workingDaySwitch.nextSibling();

        workingDay.suspendEvents();
        workingDay.setValue(newValue ? 100 : 0);
        workingDay.resumeEvents();

        this.updateWorkingDays();
    },

    onWorkingDayChange: function( workingDay , newValue ) {

        var workingDaySwitch = workingDay.previousSibling();

        workingDaySwitch.suspendEvents();
        workingDaySwitch.setValue(newValue != 0 );
        workingDaySwitch.resumeEvents();

        this.updateWorkingDays();
    },

    updateWorkingDays: function () {

        var wdays =[],
            wdaysControl = this.getView().down('#workingDaysControl');

        Ext.Array.each(wdaysControl.items.items, function (panel) {

            var cb = panel.items.items[0],
                nf = panel.items.items[1],
                day = cb.itemId.split('-'),
                dayIndex = day[1];

            wdays[dayIndex] = nf.getValue();

        },this);

        this.getView().down('#workingDays').setValue(wdays.join());

    },

    OnApplyEntityDisplayNameFormat: function() {

        var viewModel = this.getView().getViewModel(),
            template = new Ext.Template(viewModel.get('lists.displayNameFormat'), { disableFormats: true });

        viewModel.set('currentRecord.displayname', template.apply({
            firstname: viewModel.get('currentRecord.firstname'),
            lastname: viewModel.get('currentRecord.lastname'),
            title: viewModel.get('currentRecord.title')
        }));

    }

});