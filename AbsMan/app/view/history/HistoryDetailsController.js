
Ext.define('AbsMan.view.history.HistoryDetailsController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.history-details',


    onBeforeLoadRecord: function(store, operation ) {

        store.proxy.url = store.proxy.baseUrl + this.getView().openerRecord.id;

    },

    onLoadedRecord : function() {

        var me = this.getView();
        me.getViewModel().setData(me.openerRecord);

    },

    renderFieldName : function (value) {

        var result = "";
        for (var i = 0 ; i < value.length; i++) {
            if (i == 0) {
                result += value.charAt(i).toUpperCase();
            } else {
                if (value.charCodeAt(i) < 91 ) result += " ";
                result += value.charAt(i);
            }
        }
        return result;
    }

});