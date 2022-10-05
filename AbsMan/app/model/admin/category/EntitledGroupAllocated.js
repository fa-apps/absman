Ext.define('AbsMan.model.admin.category.Entitled.GroupAllocated', {
    extend: 'AbsMan.model.admin.category.EntitledGroup',


    proxy: {
        type: 'rest',
        baseUrl: 'admin/entitled/group/alloc/',
        url: 'admin/entitled/group/alloc/',
        reader: {
            type : 'array',
            rootProperty: 'data'
        },
        writer: {
            writeAllFields : true
        }
    }

});


