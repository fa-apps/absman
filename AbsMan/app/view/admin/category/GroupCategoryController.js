
Ext.define('AbsMan.view.admin.category.GroupCategoryController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.groupcategorypanel',

    init: function () {

        this.allocatedStore = this.getView().getViewModel().getStore("allocatedData");
        this.availableStore = this.getView().getViewModel().getStore("availableData");

        this.saveButton = this.getView().down('#saveButton');
        this.cancelButton = this.getView().down('#cancelButton');
        this.resetView();


        //this.parentDirtySubForms = this.getView().up().getController().dirtySubForms;
    },

    disableDDGrids: function () {

        Ext.Array.each(this.getView().items.items, function (item) {
            Ext.Array.each(item.items.items, function (subitem) {
                Ext.Array.each(subitem.plugins, function(plugin) {
                    if (plugin.ptype == 'gridviewdragdrop') {
                        plugin.disable();
                    }
                });
            });
        });
    },

    onBeforeExpand : function () {

        this.resetProxies();

        this.ownerId = this.view.up().controller.recordId;
        if ( this.allocatedStore.loadCount === 0) {
            this.allocatedStore.load();
            this.availableStore.load();
        }

        this.parentLoadedSubForms = this.getView().up().getController().loadedSubForms;
        this.parentDirtySubForms = this.getView().up().getController().dirtySubForms;
        this.parentIsReadOnly = this.getView().up().getViewModel().getStore('formData').getAt(0).get("isreadonly");

        if (this.parentIsReadOnly) this.disableDDGrids();
        
    },

    onExpand : function() {

        this.getView().up().scrollBy(0, this.getView().getY() - this.getView().up().getY() - 40  ,false );

    },

    resetProxies : function() {

        this.allocatedStore.getProxy().url =  this.allocatedStore.getProxy().baseUrl + this.view.up().controller.recordId;
        this.availableStore.getProxy().url =  this.availableStore.getProxy().baseUrl + this.view.up().controller.recordId;
    },

    onFocus : function () {

        this.resetProxies();
    },

    onAdd : function () {

        var selected = this.getView().items.items[1].getSelection();
        Ext.Array.each(selected, function(rec) {
            this.allocatedStore.add(rec);
            this.availableStore.remove(rec);
            var wasRemoved = this.removedCategories.indexOf(rec.id);
            wasRemoved != -1 ? this.removedCategories.splice(wasRemoved,1) : this.addedCategories.push(rec.id);
        },this);

        this.groupingWorkaround(0,'grouping1');
        this.onDataChanged();

    },

    onRemove : function () {

        var selected = this.getView().items.items[0].getSelection(),
            unremovable = this.getUnremovable(selected);

        if (unremovable.length) {
            this.alertUnremovableRecords(unremovable);
        }
        else {
            Ext.Array.each(selected, function(rec) {
                this.allocatedStore.remove(rec);
                this.availableStore.add(rec);
                var wasAdded = this.addedCategories.indexOf(rec.id);
                wasAdded != -1 ? this.addedCategories.splice(wasAdded, 1) : this.removedCategories.push(rec.id);
            },this);
        }

        this.groupingWorkaround(1,'grouping2');
        this.onDataChanged();

    },

    getUnremovable : function (records) {

        var unremovable = [];
        Ext.Array.each(records, function(rec) {

            if (!rec.get("isremovable"))  unremovable.push(rec.get("name"));

        },this);

        return unremovable;

    },

    alertUnremovableRecords : function (unremovable) {

        Ext.MessageBox.show({
            title:'Error!',
            msg: 'Cannot remove ' + unremovable.join(", ") + ' from the Allocated list!',
            buttons: Ext.MessageBox.OK,
            scope: this,
            icon: Ext.MessageBox.ERROR
        });
    },

    onSave : function () {

        Ext.Ajax.request({
            scope: this,
            url: this.allocatedStore.proxy.url,
            method: "PUT",
            jsonData: {
                added: this.addedCategories,
                removed: this.removedCategories
            },
            success: function (ajaxResponse) {

                var response = Ext.decode(ajaxResponse.responseText);

                if (response.success ) {

                    if (response.newid ) {

                        this.getRecords()[0].setId(response.newid);
                    }

                    if (response.mess) {

                        AbsMan.util.mess(response.mess);
                    }

                    if (this.getView()) {
                        this.resetView();
                        this.parentDirtySubForms[this.getView().shortType] = false;
                        this.getView().up().getController().checkDirtySubForm();
                    }
                } else {

                    if (response.mess) {

                        AbsMan.util.mess(response.mess, 2);
                    }
                }
            },
            failure: function(ajaxResponse) {

                AbsMan.util.mess("Server Error " + ajaxResponse.status, 3);
            }
        });
    },

    onReload : function() {

        this.allocatedStore.removeAll();
        this.availableStore.removeAll();
        this.allocatedStore.reload();
        this.availableStore.reload();
        this.resetView();
        this.parentDirtySubForms[this.getView().shortType] = false;
        this.getView().up().getController().checkDirtySubForm();

    },

    resetView:  function () {

        this.isDirtyStores = false;
        this.addedCategories = [];
        this.removedCategories = [];
        this.saveButton.setDisabled(true);
        this.cancelButton.setDisabled(true);
    },

    onCancel : function() {

        this.onReload();
    },

    onBeforeSort : function() {

        this.resetProxies();
    },

    onBeforeDrop : function(node, data) {

        var unremovable = this.getUnremovable(data.records);
        if (unremovable.length) {
            this.alertUnremovableRecords(unremovable);
            return false;
        }
        else {
            return true;
        }
    },

    onAvailableDrop : function(node, data, dropRec, dropPosition) {

        Ext.Array.each(data.records, function(rec) {
            var wasAdded = this.addedCategories.indexOf(rec.id);
            wasAdded != -1 ? this.addedCategories.splice(wasAdded, 1) : this.removedCategories.push(rec.id);
        },this);

        this.groupingWorkaround(1,'grouping2');
        this.onDataChanged();
    },

    onAllocatedDrop : function(node, data) {

        Ext.Array.each(data.records, function(rec) {
            var wasRemoved = this.removedCategories.indexOf(rec.id);
            wasRemoved != -1 ? this.removedCategories.splice(wasRemoved,1) : this.addedCategories.push(rec.id);
        },this);

        this.groupingWorkaround(0,'grouping1');
        this.onDataChanged();
    },

    groupingWorkaround : function (gridIndex,group) {

        var grouping = this.getView().items.items[gridIndex].getView().getFeature(group);

        if (grouping) grouping.expandAll();

    },

    getOldestTimeStamp : function() {

        var oldestTimeStamp = 0;

        Ext.Array.each(this.allocatedStore.getData().items, function (record) {
            oldestTimeStamp =  record.get("lastupdate") > oldestTimeStamp ?  record.get("lastupdate") : oldestTimeStamp;
        }, this);

        Ext.Array.each(this.availableStore.getData().items, function (record) {
            oldestTimeStamp =  record.get("lastupdate") > oldestTimeStamp ?  record.get("lastupdate") : oldestTimeStamp;
        }, this);

        return oldestTimeStamp;
    },


    onEntitledLoad : function() {

        this.getView().shortType = "gep";

        if ( !this.allocatedStore.isLoaded()) {
            Ext.Function.defer(this.onEntitledLoad, 50, this);
            return true;
        }
        this.parentLoadedSubForms["gep"] = this.getOldestTimeStamp();
        this.parentDirtySubForms["gep"] = false;
    },

    onLeaveLoad : function() {

        this.getView().shortType = "glp";

        if ( !this.allocatedStore.isLoaded()) {
            Ext.Function.defer(this.onEntitledLoad, 50, this);
            return true;
        }
        this.parentLoadedSubForms["glp"] = this.getOldestTimeStamp();
        this.parentDirtySubForms["glp"] = false;
    },

    onPublicDayLoad : function() {

        this.getView().shortType = "gpd";

        if ( !this.allocatedStore.isLoaded()) {
            Ext.Function.defer(this.onEntitledLoad, 50, this);
            return true;
        }
        this.parentLoadedSubForms["gpd"] = this.getOldestTimeStamp();
        this.parentDirtySubForms["gpd"] = false;
    },

    onDataChanged: function () {

        this.isDirtyStores =  !( !this.addedCategories.length && !this.removedCategories.length);
        this.saveButton.setDisabled(!this.isDirtyStores || this.parentIsReadOnly);
        this.cancelButton.setDisabled(!this.isDirtyStores || this.parentIsReadOnly);
        this.parentDirtySubForms[this.getView().shortType] = this.isDirtyStores;

        this.getView().up().getController().checkDirtySubForm()

    }
});