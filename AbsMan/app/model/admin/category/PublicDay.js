Ext.define('AbsMan.model.admin.category.PublicDay', {
    extend: 'AbsMan.model.Base',


    fields: [

        { name: 'id', type: 'string' },
        { name: 'name', type: 'string' },
        { name: 'date', type: 'date', dateFormat:'Y-m-d'},
        { name: 'pdlength', type: 'int' },
        { name: 'displayorder', type: 'int' },
        { name: 'year', type: 'string'},
        { name: 'lastupdate', type: 'int' }

    ],

    proxy: {
        type: 'rest',
        baseUrl: 'admin/publicday/company/',
        url: 'admin/publicday/company/',
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


