Ext.define('AbsMan.view.admin.AdminMainController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.adminmain',


    init : function () {

    },

    checkFormChanged: function () {

        var adminTabs = this.getView().down('admin-panels'),
            currentAdminTab = adminTabs.getActiveTab();


        if (currentAdminTab) {

            adminTabs.fireEvent("tabchange", adminTabs ,currentAdminTab);
        }

    }


});