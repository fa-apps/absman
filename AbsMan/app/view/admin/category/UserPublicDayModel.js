
Ext.define('AbsMan.view.admin.category.UserPublicDayModel', {
    extend: 'Ext.app.ViewModel',

    alias: 'viewmodel.adminuserpublicday',


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
            model: 'admin.category.PublicDayUser',
            groupField: 'year',
            groupDir: 'desc',

            listeners: {
                beforeload: 'resetProxy',
                load: 'onLoad'
            }

        }
    }

});