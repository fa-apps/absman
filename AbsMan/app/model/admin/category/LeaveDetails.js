Ext.define('AbsMan.model.admin.category.LeaveDetails', {
    extend: 'AbsMan.model.Base',

    fields: [
        { name: 'id', type: 'string' },
        { name: 'name', type: 'string' },
        { name: 'text', type: 'string' },
        { name: 'maxvalue', type: 'number' },
        { name: 'autoapprovable', type: 'boolean' },
        { name: 'justificationnotrequired', type: 'boolean' },
        { name: 'displayorder', type: 'int' },
        { name: 'lastupdate', type: 'int' },
        { name: 'isdeletable', type: 'boolean' },
        { name: 'isreadonly', type: 'boolean' },
        { name: 'absenceunit', type: 'string' },
        { name: 'minabsencelength', type: 'number' },
        { name: 'companyid', type: 'string' }
    ],

    proxy: {
        type: 'rest',
        baseUrl: 'admin/leave/',
        url: 'admin/leave/',
        writer: {
            writeAllFields : true
        }
    },

    validators: {
        name: 'presence'
    }

});


