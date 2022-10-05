Ext.define('AbsMan.model.history.History', {
    extend: 'AbsMan.model.Base',


    fields: [
        { name: 'id', type: 'string' },
        { name: 'user', type: 'string' },
        { name: 'text', type: 'string' },
        { name: 'type', type: 'string' },
        { name: 'date', type: 'date' }
    ],

    proxy: {
        type: 'ajax',
        baseUrl: 'admin/history/',
        url: 'admin/history/',
        reader : {
            type : 'json',
            rootProperty : 'data'
        }
    }

});


