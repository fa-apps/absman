Ext.define('AbsMan.model.admin.category.Entitled', {
    extend: 'AbsMan.model.Base',


    fields: [

        { name: 'id', type: 'string' },
        { name: 'name', type: 'string' },
        { name: 'text', type: 'string' },
        { name: 'defaultvalue', type: 'number' },
        { name: 'validfrom', type: 'date', dateFormat:'Y-m-d'},
        { name: 'validto', type: 'date', dateFormat:'Y-m-d'},
        { name: 'enforcevalidity', type: 'boolean' },
        { name: 'autoexpires', type: 'boolean' },
        { name: 'ondemanddefaultvalue', type: 'number' },
        { name: 'autoincrement', type: 'string' },
        { name: 'absenceunit', type: 'string' },
        { name: 'minabsencelength', type: 'number' },
        { name: 'displayorder', type: 'int' },
        { name: 'year', type: 'string'},
        { name: 'lastupdate', type: 'int' },
        { name: 'manageondemand', type: 'boolean' }
    ],

    proxy: {
        type: 'rest',
        baseUrl: 'admin/entitled/company/',
        url: 'admin/entitled/company/',
        reader: {
            type : 'array',
            rootProperty: 'data'
        },
        writer: {
            writeAllFields : true
        }
    }


});


