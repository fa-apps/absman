Ext.define('AbsMan.model.main.Notification', {
    extend: 'AbsMan.model.Base',


    fields: [
        { name: 'id', type: 'string' },
        { name: 'date', type: 'date', dateReadFormat: 'Y-m-d H:i:s'},
        { name: 'severity', type: 'string' },
        { name: 'text', type: 'string' }
    ]

});


