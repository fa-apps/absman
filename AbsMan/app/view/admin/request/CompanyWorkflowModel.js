
Ext.define('AbsMan.view.admin.request.CompanyWorkflowModel', {
    extend: 'Ext.app.ViewModel',

    alias: 'viewmodel.companyworkflowpanel',



    stores: {

        subFormData: {

            autoLoad: false,
            autoSync: false,

            pageSize: 0,
            model: 'admin.request.Workflow',

            listeners: {
                load: 'onStoreUpdate',
                update: 'onStoreUpdate'
            }

        }
    }



});