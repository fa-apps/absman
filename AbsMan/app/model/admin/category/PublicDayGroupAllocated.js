Ext.define('AbsMan.model.admin.category.PublicDay.GroupAllocated', {
    extend: 'AbsMan.model.admin.category.PublicDayGroup',


    proxy: {
        type: 'rest',
        baseUrl: 'admin/publicday/group/alloc/',
        url: 'admin/publicday/group/alloc/',
        reader: {
            type : 'array',
            rootProperty: 'data'
        },
        writer: {
            writeAllFields : true
        }
    }

});


