
Ext.define('AbsMan.view.history.HistoryPanelModel', {
    extend: 'Ext.app.ViewModel',

    alias: 'viewmodel.historypanel',

    stores: {

        subFormData: {

            autoLoad: false,
            autoSync: false,
            remoteSort: true,

            model: 'history.History'
        }
    }

});