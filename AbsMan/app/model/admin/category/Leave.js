Ext.define('AbsMan.model.admin.category.Leave', {
    extend: 'AbsMan.model.Base',


    fields: [

        { name: 'id', type: 'string' },
        { name: 'name', type: 'string' },
        { name: 'text', type: 'string' },
        { name: 'maxvalue', type: 'number' },
        { name: 'autoapprovable', type: 'boolean' },
        { name: 'justificationnotrequired', type: 'boolean' },
        { name: 'absenceunit', type: 'string' },
        { name: 'minabsencelength', type: 'number' },
        { name: 'displayorder', type: 'int' },
        { name: 'lastupdate', type: 'int' }

    ],

    proxy: {
        type: 'rest',
        baseUrl: 'admin/leave/company/',
        url: 'admin/leave/company/',
        reader: {
            type : 'array',
            rootProperty: 'data'
        },
        writer: {
            writeAllFields : true
        }
    },

    validators: {
        name: 'presence'
    }

});


