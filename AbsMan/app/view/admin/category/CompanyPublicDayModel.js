
Ext.define('AbsMan.view.admin.category.CompanyPublicDayModel', {
    extend: 'Ext.app.ViewModel',

    alias: 'viewmodel.companypublicdaypanel',

    data: {
        publicDayLength: [
            [0,'Whole Day'],
            [1,'Morning'],
            [2,'Afternoon']
        ]
    },

    stores: {

        subFormData: {

            autoLoad: false,
            autoSync: false,

            pageSize: 0,
            model: 'admin.category.PublicDay',
            groupField: 'year',
            groupDir: 'desc',

            sorters: 'date',

            listeners: {
                load: 'onStoreUpdate',
                update: 'onStoreUpdate'
            }

        }
    }



});