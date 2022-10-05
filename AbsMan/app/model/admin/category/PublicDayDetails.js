Ext.define('AbsMan.model.admin.category.PublicDayDetails', {
    extend: 'AbsMan.model.Base',

    fields: [

        { name: 'id', type: 'string' },
        { name: 'name', type: 'string' },
        { name: 'date', type: 'date', dateFormat:'Y-m-d'},
        { name: 'pdlength', type: 'int' },
        { name: 'companyid', type: 'string' },
        { name: 'displayorder', type: 'int' },
        { name: 'lastupdate', type: 'int' },
        { name: 'isdeletable', type: 'boolean' },
        { name: 'isreadonly', type: 'boolean' }

    ],

    proxy: {
        type: 'rest',
        baseUrl: 'admin/publicday/',
        url: 'admin/publicday/',
        writer: {
            writeAllFields : true
        }
    },

    validators: {
        name: 'presence'
    }

});


