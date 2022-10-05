Ext.define('AbsMan.model.admin.category.Leave.GroupAllocated', {
    extend: 'AbsMan.model.admin.category.LeaveGroup',


    proxy: {
        type: 'rest',
        baseUrl: 'admin/leave/group/alloc/',
        url: 'admin/leave/group/alloc/',
        reader: {
            type : 'array',
            rootProperty: 'data'
        },
        writer: {
            writeAllFields : true
        }
    }

});


