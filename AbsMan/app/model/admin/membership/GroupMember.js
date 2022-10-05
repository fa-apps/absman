Ext.define('AbsMan.model.admin.membership.GroupMember', {
    extend: 'AbsMan.model.Base',

    fields: [
        { name: 'id', type: 'string' },
        { name: 'displayname', type: 'string' },
        { name: 'firstname', type: 'string' },
        { name: 'lastname', type: 'string' },
        { name: 'title', type: 'string' },
        { name: 'email', type: 'string' },
        { name: 'number', type: 'string' },
        { name: 'enabled', type: 'boolean' },
        { name: 'lastupdate', type: 'int' },
        { name: 'companyid', type: 'string' }
    ],

    proxy: {
        type: 'rest',
        baseUrl: 'admin/group/member/',
        url: 'admin/group/member/',
        writer: {
            writeAllFields : true
        },
        reader: {
            type : 'array',
            rootProperty: 'data'
        }
    },

    validators: {
        name: 'presence'
    }

});


