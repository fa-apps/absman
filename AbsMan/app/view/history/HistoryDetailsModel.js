
Ext.define('AbsMan.view.history.HistoryDetailsModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.history-details',

    stores: {

        actionData: {

            autoLoad: true,
            autoSync: false,
            pageSize: 0,

            model : 'history.HistoryDetail',

            listeners: {
                load: 'onLoadedRecord',
                beforeload: 'onBeforeLoadRecord'
            }
        }


    }
});