Ext.define('AbsMan.model.formpanel.EmpGroup', {
    extend: 'AbsMan.model.Base',


    fields: [
        { name: 'id', type: 'string' },
        { name: 'companyid', type: 'string' },
        { name: 'name', type: 'string' },
        { name: 'type', type: 'string'},
        { name: 'lastupdate', type: 'int' },
        { name: 'isdefault', type: 'boolean' }
    ],

    proxy: {
        type: 'rest',
        baseUrl: 'staff/',
        url: 'staff/',
        reader: {
            type: 'json',
            rootProperty: 'data'
        }
    },

    validators: {
        name: {
            type: 'length',
            min: 2,
            max: 256,
            minOnlyMessage: "Minimum 2 characters required.",
            maxOnlyMessage: "Maximum 256 characters allowed."
        }
    }

});


