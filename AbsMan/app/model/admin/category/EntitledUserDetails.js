Ext.define('AbsMan.model.admin.category.EntitledUserDetails', {
    extend: 'AbsMan.model.admin.category.EntitledUserBase',


    proxy: {
        type: 'rest',
        baseUrl: 'admin/user/entitlement/',
        url: 'admin/user/entitlement/',
        writer: {
            writeAllFields : true
        }
    }

});


