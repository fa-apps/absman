Ext.define('AbsMan.model.admin.category.LeaveUser', {
    extend: 'AbsMan.model.Base',

    fields: [
        { name: 'id', type: 'string' },
        { name: 'name', type: 'string' },
        { name: 'text', type: 'string' },
        { name: 'maxvalue', type: 'number' },
        { name: 'autoapprovable', type: 'boolean' },
        { name: 'justificationnotrequired', type: 'boolean' },
        { name: 'displayorder', type: 'int' },
        { name: 'lastupdate', type: 'int' }

    ],

    proxy: {
        type: 'rest',
        baseUrl: 'admin/user/leave/',
        url: 'admin/user/leave/',
        reader: {
            type : 'array',
            rootProperty: 'data'
        },
        writer: {
            writeAllFields : true
        }
    }
});
