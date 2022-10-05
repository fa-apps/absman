Ext.define('AbsMan.model.admin.Admins', {
    extend: 'AbsMan.model.Base',

    fields: [
        { name: 'id', type: 'string' , persist : true},
        { name: 'user', type: 'string' },
        { name: 'userid', type: 'string' },
        { name: 'rolename', type: 'string'},
        { name: 'roleid', type: 'int' },
        { name: 'iseditable', type: 'boolean' },
        { name: 'isdeletable', type: 'boolean' }
    ],

    proxy: {
        type: 'rest',
        baseUrl: 'admin/admins/',
        url: 'admin/admins/',
        writer: {
            writeAllFields : true
        },
        reader : {
            idProperty: 'id',
            type : 'json',
            rootProperty : 'data'
        }
    }

});


