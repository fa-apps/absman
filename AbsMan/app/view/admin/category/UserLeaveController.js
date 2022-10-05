
Ext.define('AbsMan.view.admin.category.UserLeaveController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.adminuserleave',



    init: function () {

        this.leaveStore = this.getView().getViewModel().getStore("subFormData");

    },

    onBeforeExpand : function () {

        this.ownerId = this.view.up().controller.recordId;
        this.parentIsReadOnly = this.getView().up().getViewModel().get('isReadOnly');
        this.parentLoadedSubForms = this.getView().up().getController().loadedSubForms;

        if ( this.leaveStore.loadCount === 0) {
            this.leaveStore.load();
        }
    },

    onExpand : function() {

        this.getView().up().scrollBy(0, this.getView().getY() - this.getView().up().getY() - 40  ,false );
    },

    resetProxy : function() {

        this.leaveStore.getProxy().url =  this.leaveStore.getProxy().baseUrl + this.view.up().controller.recordId;
    },

    onReload : function() {

        this.leaveStore.removeAll();
        this.leaveStore.reload();

    },


    getOldestTimeStamp : function() {

        var oldestTimeStamp = 0;
        Ext.Array.each(this.leaveStore.getData().items, function (record) {
            oldestTimeStamp =  record.get("lastupdate") > oldestTimeStamp ?  record.get("lastupdate") : oldestTimeStamp;
        }, this);

        return oldestTimeStamp;
    },


    onLoad : function() {

        this.parentLoadedSubForms["ulp"] = this.getOldestTimeStamp();

    }

});