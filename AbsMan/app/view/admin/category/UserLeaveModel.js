
Ext.define('AbsMan.view.admin.category.UserLeaveModel', {
    extend: 'Ext.app.ViewModel',

    alias: 'viewmodel.adminuserleave',


    stores: {

        subFormData: {

            autoLoad: false,
            autoSync: false,

            pageSize: 0,
            model: 'admin.category.LeaveUser',
            groupField: 'year',
            groupDir: 'desc',

            sorters: ['validfrom','validto'],

            listeners: {
                beforeload: 'resetProxy',
                load: 'onLoad'
            }

        }
    }

});