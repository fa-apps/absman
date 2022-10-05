
Ext.define('AbsMan.view.admin.AdminsPanelModel', {
    extend: 'Ext.app.ViewModel',

    alias: 'viewmodel.adminspanel',

    stores: {

        subFormData: {

            autoLoad: false,
            autoSync: false,
            remoteSort: true,
            model: 'admin.Admins'
        },

        adminsRoles: {

            autoLoad: false,
            autoSync: false,
            model: 'admin.AdminsRole'
        }
    }

});