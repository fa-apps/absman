Ext.define('AbsMan.model.admin.Country', {
    extend: 'AbsMan.model.Base',

    fields: [
        { name: 'id', type: 'string' },
        { name: 'name', type: 'string' },
        { name: 'lastupdate', type: 'int' },
        { name: 'isdeletable', type: 'boolean' },
        { name: 'isreadonly', type: 'boolean' },
        { name: 'isfavorite', type: 'boolean' }
    ],

    proxy: {
        type: 'rest',
        baseUrl: 'admin/country/',
        url: 'admin/country/',
        writer: {
            writeAllFields: true
        }
    },

    validators: {
        name: 'presence'
    }

});


