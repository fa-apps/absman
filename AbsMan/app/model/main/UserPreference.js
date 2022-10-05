Ext.define('AbsMan.model.main.UserPreference', {
    extend: 'AbsMan.model.Base',


    fields: [
        { name: 'id', type: 'string' },
        { name: 'name', type: 'string' },
        { name: 'value', type: 'string' }
    ],

    proxy: {
        type: 'ajax',
        baseUrl: 'user/preference/',
        url: 'user/preference/',
        reader : {
            type : 'json',
            rootProperty : 'data'
        },
        writer: {
            writeAllFields: true
        }
    }

});


