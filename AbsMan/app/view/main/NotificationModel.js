Ext.define('AbsMan.view.main.NotificationModel', {
    extend: 'Ext.app.ViewModel',

    alias: 'viewmodel.notification',


    stores: {

        notificationStore: {

            autoLoad: false,
            autoSync: false,

            pageSize: 0,
            model: 'main.Notification',

            listeners: {
                //load: 'onLoadedRecord',
                //beforeload: 'onBeforeLoadRecord'
            }


        }
    }
});
