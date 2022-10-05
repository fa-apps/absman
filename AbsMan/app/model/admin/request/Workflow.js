Ext.define('AbsMan.model.admin.request.Workflow', {
    extend: 'AbsMan.model.Base',

    fields: [
        { name: 'id', type: 'string' , persist : true},
        { name: 'name', type: 'string' },
        { name: 'text', type: 'string' },
        { name: 'standinapprover', type: 'boolean' },
        { name: 'substitute', type: 'boolean' },
        { name: 'notifier', type: 'boolean' }

    ],

    proxy: {
        type: 'rest',
        baseUrl: 'admin/request/workflow/',
        url: 'admin/request/workflow/',
        writer: {
            writeAllFields : true
        },
        reader : {
            idProperty: 'id',
            type : 'json',
            rootProperty : 'data'
        }
    }

});


