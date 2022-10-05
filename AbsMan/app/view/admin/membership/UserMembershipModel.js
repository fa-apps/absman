
Ext.define('AbsMan.view.admin.membership.UserMembershipModel', {
    extend: 'Ext.app.ViewModel',

    alias: 'viewmodel.adminusermembership',


    stores: {

        allocatedData: {

            autoLoad: false,
            autoSync: false,
            remoteSort: false,
            pageSize: 0,
            model: 'admin.membership.UserMemberOf',
            listeners: {
                "beforeload" : 'resetAllocatedProxy'
            }
        },

        availableData: {

            autoLoad: false,
            autoSync: false,
            remoteSort: false,
            pageSize: 0,
            model: 'admin.membership.UserNotMemberOf',
            listeners: {
                "beforeload" : 'resetAvailableProxy'
            }
        }
    }

});