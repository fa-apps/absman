
Ext.define('AbsMan.view.admin.membership.UserMembershipController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.adminusermembership',

    init: function () {

        this.allocatedStore = this.getView().getViewModel().getStore("allocatedData");
        this.availableStore = this.getView().getViewModel().getStore("availableData");
        this.addedCategories = [];
        this.removedCategories = [];

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

        //this.resetProxies();
        this.ownerId = this.view.up().controller.recordId;
        if ( this.allocatedStore.loadCount === 0) {
            this.allocatedStore.load();
            this.availableStore.load();
        }

        this.parentLoadedSubForms = this.getView().up().getController().loadedSubForms;
        this.parentIsReadOnly = this.getView().up().getViewModel().getStore('formData').getAt(0).data.isreadonly;
        if (this.parentIsReadOnly) this.disableDDGrids();

    },

    onExpand : function() {

        this.getView().up().scrollBy(0, this.getView().getY() - this.getView().up().getY() - 40  ,false );
    },

    resetAllocatedProxy : function() {

        this.allocatedStore.getProxy().url =  this.allocatedStore.getProxy().baseUrl + this.view.up().controller.recordId;
    },

    resetAvailableProxy : function() {

        this.availableStore.getProxy().url =  this.availableStore.getProxy().baseUrl + this.view.up().controller.recordId;
    },

    onFocus : function () {

        //this.resetProxies();
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
    },

    getUnremovable : function (records) {

        var unremovable = [];
        Ext.Array.each(records, function(rec) {
            if (rec.data.isdefaultgroup)  unremovable.push(rec.data.name)
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

        // call to UserController setMemberOfAction

        Ext.Ajax.request({
            scope: this,
            url: this.allocatedStore.proxy.url,
            method: "PUT",
            jsonData: {
                added: this.addedCategories,
                removed: this.removedCategories
            },
            success: function (response) {

                this.addedCategories = [];
                this.removedCategories = [];

                var responseText = Ext.JSON.decode(response.responseText);

                Ext.Array.each(['user-entitled-panel','user-leave-panel','user-publicday-panel'], function (panel) {
                    var store = this.getView().nextSibling(panel).getStore();
                    if (store.isLoaded()) store.reload();
                }, this);

                this.getView().up().getViewModel().getStore('formData').getAt(0).set("lastupdate",responseText.lastupdate);

            },
            failure: function (response) {
                console.log('server-side failure with status code ' + response.status);
                //todo error
            }
        });
    },


    reloadSubForm : function (subForm) {

        var formIds = Ext.isArray(subForm[2]) ? subForm[2] : [subForm[2]],
            formType = subForm[1],
            subPanelType = subForm[0];


        Ext.Array.forEach(formIds, function (formId) {

            var formPanel = Ext.ComponentQuery.query('#adminform-' + formType + '-' + formId)[0];

            if (formPanel) {
                var subPanel = formPanel.down(AbsMan.subFormRoutes[subPanelType]);
                if (subPanel) {

                    if (subPanel.store) {

                        if (subPanel.getStore().isLoaded()) subPanel.getStore().reload();

                    } else {

                        var subSubPanels = subPanel.items.items;

                        if (subSubPanels) {

                            Ext.Array.forEach(subSubPanels, function (subSubPanel) {
                                if (subSubPanel.store) {

                                    if (subSubPanel.getStore().isLoaded()) subSubPanel.getStore().reload();
                                }
                            }, this );
                        }
                    }
                }
            }
        }, this );

    },

    onReload : function() {

        this.allocatedStore.removeAll();
        this.availableStore.removeAll();
        this.allocatedStore.reload();
        this.availableStore.reload();
        this.addedCategories = [];
        this.removedCategories = [];

    },

    onCancel : function() {

        /*
         this.allocatedStore.rejectChanges();
         this.availableStore.rejectChanges();
         this.addedCategories = [];
         this.removedCategories = [];
         */

        this.onReload();

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
    },


    onAllocatedDrop : function(node, data) {

        Ext.Array.each(data.records, function(rec) {
            var wasRemoved = this.removedCategories.indexOf(rec.id);
            wasRemoved != -1 ? this.removedCategories.splice(wasRemoved,1) : this.addedCategories.push(rec.id);
        },this);

        this.groupingWorkaround(0,'grouping1');

    },

    groupingWorkaround : function (gridIndex,group) {

        var grouping = this.getView().items.items[gridIndex].getView().getFeature(group);

        if (grouping) grouping.expandAll();

    }

});