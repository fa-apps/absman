Ext.define('AbsMan.store.Notification', {
    extend: 'Ext.data.Store',

    alias: 'store.notification',


    fields: [
        { name: 'id', type: 'string' },
        { name: 'date', type: 'string' },
        { name: 'severity', type: 'string' },
        { name: 'text', type: 'string' }
    ],

    proxy: {
        type: 'sessionstorage',
        id  : 'notificationProxyId'
    }

});