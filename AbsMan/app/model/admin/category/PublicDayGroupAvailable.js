Ext.define('AbsMan.model.admin.category.PublicDay.GroupAvailable', {
    extend: 'AbsMan.model.admin.category.PublicDayGroup',


    proxy: {
        type: 'rest',
        baseUrl: 'admin/publicday/group/avail/',
        url: 'admin/publicday/group/avail/',
        reader: {
            type : 'array',
            rootProperty: 'data'
        },
        writer: {
            writeAllFields : true
        }
    }

});


