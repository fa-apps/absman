
Ext.define('AbsMan.view.admin.category.UserEntitledController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.adminuserentitled',



    init: function () {

        this.entitledStore = this.getView().getViewModel().getStore("subFormData");
    },

    onBeforeExpand : function () {

        this.ownerId = this.view.up().controller.recordId;
        this.parentIsReadOnly = this.getViewModel().get('isReadOnly');
        this.parentLoadedSubForms = this.getView().up().getController().loadedSubForms;

        if ( this.entitledStore.loadCount === 0) {
            this.entitledStore.load();
        }
    },

    onExpand : function() {

        this.getView().up().scrollBy(0, this.getView().getY() - this.getView().up().getY() - 40  ,false );
    },

    resetProxy : function() {

        this.entitledStore.getProxy().url =  this.entitledStore.getProxy().baseUrl + this.view.up().controller.recordId;
    },

    onEdit : function() {

        var selectedRecord = this.getView().getSelectionModel().getSelection()[0];

        if (selectedRecord) this.getView().ownerCt.controller.adminPanels.fireEvent("newpanel","adminform-ued-" + selectedRecord.id);

    },


    onNameDblClick : function( view , td , cellIndex , record , tr , rowIndex , e , eOpts ) {

        if (record && !record.dirty && cellIndex == 1) this.getView().ownerCt.controller.adminPanels.fireEvent("newpanel","adminform-ued-" + record.id);

    },

    onSave : function () {

        this.entitledStore.sync();
    },


    onReload : function() {

        this.entitledStore.removeAll();
        this.entitledStore.reload();

    },

    onCancel : function() {

        this.entitledStore.rejectChanges();

    },

    getOldestTimeStamp : function() {

        var oldestTimeStamp = 0,
            oldestLinkedTimeStamp = 0;

        Ext.Array.each(this.entitledStore.getData().items, function (record) {
            oldestTimeStamp =  record.get("categorylastupdate") > oldestTimeStamp ?  record.get("categorylastupdate") : oldestTimeStamp;
            oldestLinkedTimeStamp =  record.get("lastupdate") > oldestLinkedTimeStamp ?  record.get("lastupdate") : oldestLinkedTimeStamp;
        }, this);

        return [oldestTimeStamp,oldestLinkedTimeStamp];
    },


    onStoreUpdate : function() {

        var isDirtyStore =  (this.entitledStore.getNewRecords().length > 0 || this.entitledStore.getUpdatedRecords().length > 0 || this.entitledStore.getRemovedRecords().length > 0),
            saveButton = this.getView().down('#saveButton'),
            cancelButton = this.getView().down('#cancelButton');

        saveButton.setDisabled(!isDirtyStore || this.parentIsReadOnly);
        cancelButton.setDisabled(!isDirtyStore || this.parentIsReadOnly);

        this.parentLoadedSubForms["uep"] = this.getOldestTimeStamp();

    }
});