
Ext.define('AbsMan.view.admin.category.CompanyCategoryController', {
    extend: 'Ext.app.ViewController',


    init: function () {

        this.categoryStore = this.getView().getViewModel().getStore("subFormData");

    },


    onBeforeExpand : function () {

        this.resetProxy();
        this.ownerId = this.view.up().controller.recordId;
        this.parentIsReadOnly = this.getView().up().getViewModel().getStore('formData').getAt(0).data.isreadonly;
        this.parentLoadedSubForms = this.getView().up().getController().loadedSubForms;

        if ( this.categoryStore.loadCount === 0) {
            this.categoryStore.load();
            this.onStoreUpdate();
        }
    },


    onExpand : function() {

        this.getView().up().scrollBy(0, this.getView().getY() - this.getView().up().getY() - 40  ,false );
    },


    resetProxy : function() {

        this.categoryStore.getProxy().url =  this.categoryStore.getProxy().baseUrl + this.view.up().controller.recordId;
    },


    onFocus : function () {

        this.resetProxy();
    },

    onSave : function () {

        this.categoryStore.sync({
            scope: this,
            success: function (batch, options) {

                Ext.Array.each(batch.getOperations(), function (operation) {

                    var response = Ext.JSON.decode(operation.getResponse().responseText);

                    if (response.success) {

                        operation.getRecords()[0].set("lastupdate", response.lastupdate, {dirty: false});

                        AbsMan.util.mess(response.mess || "Record saved.");

                    } else {

                        AbsMan.util.mess(response.mess || "Record not saved.",  AbsMan.util.ERROR);
                    }

                }, this );
            },
            failure: function () {

                AbsMan.util.mess("Server Error",  AbsMan.util.CRITICAL);
            }
        });

    },

    onReload : function() {

      this.categoryStore.removeAll();
      this.categoryStore.reload();

    },

    onCancel : function() {

      this.categoryStore.rejectChanges();

    },

    onBeforeSort : function() {

        this.resetProxy();
    },

    getOldestTimeStamp : function() {

        var oldestTimeStamp = 0;
        Ext.Array.each(this.categoryStore.getData().items, function (record) {
            oldestTimeStamp =  record.get("lastupdate") > oldestTimeStamp ?  record.get("lastupdate") : oldestTimeStamp;
        }, this);

        return oldestTimeStamp;
    },

    onStoreUpdate : function() {

        var isDirtyStore =  (this.categoryStore.getNewRecords().length > 0 || this.categoryStore.getUpdatedRecords().length > 0 || this.categoryStore.getRemovedRecords().length > 0),
            addButton = this.getView().down('#addButton'),
            editButton = this.getView().down('#editButton'),
            saveButton = this.getView().down('#saveButton'),
            cancelButton = this.getView().down('#cancelButton'),
            isSelected = this.getView().getSelectionModel().getCount() != 0;

        addButton.setDisabled(isDirtyStore || this.parentIsReadOnly);
        editButton.setDisabled(!isSelected && !isDirtyStore ? true : isDirtyStore|| this.parentIsReadOnly);
        saveButton.setDisabled(!isDirtyStore || this.parentIsReadOnly);
        cancelButton.setDisabled(!isDirtyStore || this.parentIsReadOnly);

        this.onLoad();

    },

    onSelect : function() {

        var isDirtyStore =  (this.categoryStore.getNewRecords().length > 0 || this.categoryStore.getUpdatedRecords().length > 0 || this.categoryStore.getRemovedRecords().length > 0),
            editButton = this.getView().down('#editButton');

        editButton.setDisabled(isDirtyStore || this.parentIsReadOnly);

    }

});