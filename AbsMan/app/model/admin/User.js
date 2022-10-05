Ext.define('AbsMan.model.admin.User', {
    extend: 'AbsMan.model.BaseUser',


    proxy: {
        type: 'rest',
        baseUrl: 'admin/user/',
        url: 'admin/user/',
        writer: {
            writeAllFields : true
        }
    },

    validators: {
        name: 'presence'
    }

});


