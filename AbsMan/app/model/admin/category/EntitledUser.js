Ext.define('AbsMan.model.admin.category.EntitledUser', {
    extend: 'AbsMan.model.admin.category.EntitledUserBase',



    proxy: {
        type: 'rest',
        baseUrl: 'admin/user/entitlements/',
        url: 'admin/user/entitlements/',
        writer: {
            writeAllFields : true
        },
        reader: {
            type : 'json',
            rootProperty: 'data'
        }
    }

});


