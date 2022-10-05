Ext.define('AbsMan.model.history.HistoryDetail', {
    extend: 'Ext.data.Model',


    fields: [
        { name: 'affectedfield', type: 'string'},
        { name: 'oldvalue', type: 'string'},
        { name: 'newvalue', type: 'string'}
    ],

    proxy: {
        type: 'ajax',
        baseUrl: 'admin/history/',
        url: 'admin/history/',
        reader : {
            type : 'array'
        }
    }

});


