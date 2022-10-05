
Ext.define('AbsMan.view.history.HistoryPanelController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.historypanel',

    init: function () {

        this.historyStore = this.getView().getViewModel().getStore("subFormData");
    },

    onBeforeExpand : function () {

        this.resetProxy();
        this.ownerId = this.view.up().controller.recordId;
        this.ownerShortType = this.view.up().controller.shortType;

        if ( !this.view.ownerCt.controller.isNewRecord && this.historyStore.loadCount === 0) {
            this.historyStore.load();
        }
    },

    onExpand : function() {

        this.getView().up().scrollBy(0, this.getView().getY() - this.getView().up().getY() - 40  ,false );

    },

    showHistoryDetails : function(grid, rowIndex, colIndex) {

        var rec = grid.getStore().getAt(rowIndex),
            historyDetailsPanel = new AbsMan.view.history.HistoryDetails();

        grid.getSelectionModel().select(rowIndex);
        historyDetailsPanel.openerRecord = rec.data;
        historyDetailsPanel.show();
    },


    resetProxy : function() {

        this.historyStore.getProxy().url =  this.historyStore.getProxy().baseUrl + this.view.up().controller.shortType+ "/" + this.view.up().controller.recordId;
    },


    onFocus : function () {

        this.resetProxy();
    },



    onBeforeSort : function() {

        this.resetProxy();
    }


});