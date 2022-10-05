Ext.define('AbsMan.model.admin.AdminsRole', {
    extend: 'AbsMan.model.Base',

    fields: [
        { name: 'id', type: 'int' },
        { name: 'name', type: 'string' }
    ],

    proxy: {
        type: 'rest',
        url: 'admin/adminsroles',

        reader : {
            type : 'json',
            rootProperty : 'data'
        }
    }

});


