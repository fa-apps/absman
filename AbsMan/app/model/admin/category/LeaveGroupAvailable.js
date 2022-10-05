Ext.define('AbsMan.model.admin.category.Leave.GroupAvailable', {
    extend: 'AbsMan.model.admin.category.LeaveGroup',


    proxy: {
        type: 'rest',
        baseUrl: 'admin/leave/group/avail/',
        url: 'admin/leave/group/avail/',
        reader: {
            type : 'array',
            rootProperty: 'data'
        },
        writer: {
            writeAllFields : true
        }
    }

});


