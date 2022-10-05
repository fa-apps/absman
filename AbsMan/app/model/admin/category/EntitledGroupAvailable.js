Ext.define('AbsMan.model.admin.category.Entitled.GroupAvailable', {
    extend: 'AbsMan.model.admin.category.EntitledGroup',


    proxy: {
        type: 'rest',
        baseUrl: 'admin/entitled/group/avail/',
        url: 'admin/entitled/group/avail/',
        reader: {
            type : 'array',
            rootProperty: 'data'
        },
        writer: {
            writeAllFields : true
        }
    }

});


