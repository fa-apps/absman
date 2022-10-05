
Ext.define('AbsMan.view.admin.category.CompanyLeaveModel', {
    extend: 'Ext.app.ViewModel',

    alias: 'viewmodel.companyleavepanel',



    stores: {

        subFormData: {

            autoLoad: false,
            autoSync: false,

            pageSize: 0,
            model: 'admin.category.Leave',

            listeners: {
                load: 'onStoreUpdate',
                update: 'onStoreUpdate'
            }

        }
    }



});