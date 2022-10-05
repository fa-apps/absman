
Ext.define('AbsMan.view.admin.category.UserPublicDayController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.adminuserpublicday',



    init: function () {

        this.publicDayStore = this.getView().getViewModel().getStore("subFormData");

    },

    onBeforeExpand : function () {

        this.ownerId = this.view.up().controller.recordId;
        this.parentIsReadOnly = this.getView().up().getViewModel().get('isReadOnly');
        this.parentLoadedSubForms = this.getView().up().getController().loadedSubForms;

        if ( this.publicDayStore.loadCount === 0) {
            this.publicDayStore.load();
        }
    },

    onExpand : function() {

        this.getView().up().scrollBy(0, this.getView().getY() - this.getView().up().getY() - 40  ,false );
    },

    resetProxy : function() {

        this.publicDayStore.getProxy().url =  this.publicDayStore.getProxy().baseUrl + this.view.up().controller.recordId;
    },




    onReload : function() {

        this.publicDayStore.removeAll();
        this.publicDayStore.reload();

    },


    publicDayLengthRender : function (value,metaData,record) {

        return this.getViewModel().getData().publicDayLength[value][1];

    },


    getOldestTimeStamp : function() {

        var oldestTimeStamp = 0;
        Ext.Array.each(this.publicDayStore.getData().items, function (record) {
            oldestTimeStamp =  record.get("lastupdate") > oldestTimeStamp ?  record.get("lastupdate") : oldestTimeStamp;
        }, this);

        return oldestTimeStamp;
    },


    onLoad : function() {

        this.parentLoadedSubForms["upd"] = this.getOldestTimeStamp();

    }
});