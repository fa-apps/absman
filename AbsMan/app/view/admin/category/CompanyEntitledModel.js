
Ext.define('AbsMan.view.admin.category.CompanyEntitledModel', {
    extend: 'Ext.app.ViewModel',

    alias: 'viewmodel.companyentitledpanel',



    stores: {

        subFormData: {

            autoLoad: false,
            autoSync: false,

            pageSize: 0,
            model: 'admin.category.Entitled',
            groupField: 'year',
            groupDir: 'desc',

            sorters: ['validfrom','validto'],

            listeners: {
                load: 'onStoreUpdate',
                update: 'onStoreUpdate'
            }

        }
    }



});