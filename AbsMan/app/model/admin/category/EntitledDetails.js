Ext.define('AbsMan.model.admin.category.EntitledDetails', {
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
        { name: 'displayorder', type: 'int' },
        { name: 'lastupdate', type: 'int' },
        { name: 'isdeletable', type: 'boolean' },
        { name: 'isreadonly', type: 'boolean' },
        { name: 'absenceunit', type: 'string' },
        { name: 'minabsencelength', type: 'number' },
        { name: 'manageondemand', type: 'boolean' },
        { name: 'companyid', type: 'string' }
    ],

    proxy: {
        type: 'rest',
        baseUrl: 'admin/entitled/',
        url: 'admin/entitled/',
        writer: {
            writeAllFields : true
        }
    },

    validators: {
        name: 'presence'
    }

});


