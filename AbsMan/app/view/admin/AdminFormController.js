
Ext.define('AbsMan.view.admin.AdminFormController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.adminform',

    init: function() {

        var me = this.getView(),
            panelItemId = me.itemId.split('-'),
            adminFormType = panelItemId.shift(),
            treeItemId = panelItemId.join('-'),
            shortType = panelItemId.shift(),
            recordId = panelItemId.join('-'),
            formStore = me.getViewModel().getStore('formData');

        this.isNewRecord = false;
        this.isDeletable = false;
        this.isFavorite = false;
        this.adminTree = Ext.ComponentQuery.query('#admintree-panel')[0];
        this.adminPanels = Ext.ComponentQuery.query('admin-panels[itemId=adminpanels]')[0];
        this.recordId = recordId;
        this.adminFormType = adminFormType;
        this.treeItemId = treeItemId;
        this.shortType = shortType;
        this.formStore = formStore;
        this.loadedSubForms = {};
        this.dirtySubForms = {};


    },

    initView: function() {

        this.formStore.load();

    },

    onLoadedRecord : function(store,records) {

        var record = records[0];

        if (record.get('success') == false) {

            AbsMan.util.mess(record.get('mess') || record.get('code') ||  "Error during load operation", AbsMan.util.ERROR);

            Ext.Function.defer(this.adminFormClose, 10, this);
        }
        else {

            this.isNewRecord = record.get('id').substr(0, 2) === "0-";
            this.isDeletable = record.get('isdeletable');
            this.isFavorite = record.get('isfavorite');

            if (record.get('lists')) this.getView().getViewModel().set("lists", record.get('lists'));

            this.initControls(record);
        }

        store.proxy.url = store.proxy.baseUrl;
        return true;
    },


    resetProxy: function() {

        this.formStore.getProxy().url =  this.formStore.getProxy().baseUrl + this.recordId;
    },


    checkForm: function() {

        //console.log('checking admin form', this);

        if (this.formStore.isLoaded()) {

            var url = this.formStore.getProxy().baseUrl,
                currentRecord = this.formStore.getAt(0),
                lastupdate = currentRecord ? currentRecord.get('lastupdate') : null;

            if (lastupdate && !this.isNewRecord) {

                Ext.Ajax.request({
                    scope: this,
                    url: url + 'check/' + this.recordId,
                    params: {
                        lastupdate : lastupdate,
                        subforms : Ext.JSON.encode(this.loadedSubForms)
                    },
                    success: function (response) {

                        var responseData = Ext.JSON.decode(response.responseText);

                        if (responseData.success) {

                            if (responseData.isoutdated) {

                                Ext.Msg.show({
                                    scope: this,
                                    title: this.view.getTitle(),
                                    msg: 'Content have been changed since you opened this form! Reload now?',
                                    buttons: Ext.Msg.YESNO,
                                    icon: Ext.MessageBox.QUESTION,
                                    fn: function (btn) {
                                        if (btn == 'yes') this.onAdminFormReload() ;
                                    }
                                });
                            }
                            else if (responseData.oodSubForms && responseData.oodSubForms.length != 0) {

                                Ext.Array.each(responseData.oodSubForms, function (subForm) {

                                    var form = this.getView().down(AbsMan.subFormRoutes[subForm]),
                                        store = form.getViewModel().getStore('subFormData') || form.getViewModel().getStore('availableData'),
                                        controller = form.getController();

                                    if (store) {
                                        if (store.getNewRecords().length == 0 && store.getUpdatedRecords().length == 0 && store.getRemovedRecords().length == 0) {
                                            controller.onReload();
                                        }
                                        else {
                                            Ext.Msg.show({
                                                scope: this,
                                                title: this.view.getTitle(),
                                                msg: form.getTitle() + ' content have been changed! Reload now?',
                                                buttons: Ext.Msg.YESNO,
                                                icon: Ext.MessageBox.QUESTION,
                                                fn: function (btn) {
                                                    if (btn == 'yes') controller.onReload();
                                                }
                                            });
                                        }
                                    }
                                }, this);

                            }
                            currentRecord.set("isdeletable", responseData.isdeletable);
                            this.isDeletable = responseData.isdeletable;

                        } else {

                            AbsMan.util.mess(responseData.mess || responseData.code || responseData.reason || "Error during check operation", AbsMan.util.ERROR);

                            Ext.MessageBox.show({
                                title: 'Closing!',
                                msg: 'The record is no more available! This form will now close.',
                                buttons: Ext.MessageBox.OK,
                                scope: this,
                                fn: function (btn) {
                                    if (btn === 'ok') {
                                        this.adminFormClose()
                                    }
                                },
                                icon: Ext.MessageBox.WARNING
                            });
                        }
                    }
                });
            }
        }
    },


    onAdminFormSaveAndClose: function () {

        this.adminFormSave('close');

    },

    onAdminFormSave: function () {

        this.adminFormSave('none');

    },

    reloadForm: function(formId) {

        this.adminPanels.fireEvent("newpanel",formId);

    },

    adminFormSave: function (nextAction) {

        if (this.getView().getForm().isValid()) {

            this.adminSubFormSave(nextAction);

            this.formStore.sync({
                scope: this,

                success: function (batch, options) {


                    Ext.Array.each(batch.getOperations(), function (operation) {

                        var response = Ext.JSON.decode(operation.getResponse().responseText);

                        if (response.newnode) {

                            if (response.newnode != 'none') this.adminTree.fireEvent("newnode", response.newnode);

                            var formId = this.adminFormType + '-' + this.shortType + '-' + response.id;

                            if (nextAction != 'close') Ext.Function.defer(this.reloadForm, 10, this, [formId]);

                            nextAction = 'close';

                        } else {

                            var nameField = this.getView().getForm().findField('name');

                            if (nameField) this.adminTree.fireEvent("nodechange", this.treeItemId, nameField.value);
                        }

                        if (nextAction == 'close') {

                            Ext.Function.defer(this.adminFormClose, 10, this);
                        }
                        else if (nextAction == 'reload') {

                            Ext.Function.defer(this.adminFormClose, 10, this);
                            Ext.Function.defer(this.reloadForm, 100, this, [this.getView().itemId]);
                        }
                        else {

                            this.setLastUpdate(response.lastupdate);
                        }

                        AbsMan.util.mess(response.mess || "Record Saved successfully.");

                    }, this);
                },
                failure: function (batch) {

                    var response = Ext.JSON.decode(batch.getOperations()[0].getResponse().responseText);

                    AbsMan.util.mess(response.mess || "Record not saved.", AbsMan.util.ERROR);
                }
            });
        }
    },

    setLastUpdate : function(lastupdate) {

        this.view.form.setValues({'lastupdate': lastupdate});
    },

    adminSubFormSave: function (nextAction) {

        Ext.Object.each(this.dirtySubForms, function (subForm, value) {

            if (value) {

                var view = this.getView().down(AbsMan.subFormRoutes[subForm]);
                view.getController().onSave();
            }

        }, this);


        if (!this.getViewModel().get('isDirtyRecord') && nextAction == 'close') {

            Ext.Function.defer(this.adminFormClose, 100, this);

        }

    },

    onBeforeClose: function () {

        var currentRecord = this.formStore.getAt(0),
            hasDirtySubForm = this.getViewModel().get('hasDirtySubForm');

        if (!currentRecord.get('isreadonly')) {

            if (currentRecord.dirty  && !hasDirtySubForm) {

                if (!(Object.keys(currentRecord.modified).length == 1 && currentRecord.modified.hasOwnProperty('isfavorite'))) {

                    this.confirmClose();
                    return false;
                }
            }
            else if (hasDirtySubForm) {

                this.confirmClose();
                return false;
            }
        }

        return true
    },

    onAdminFormClose: function () {

        var currentRecord = this.formStore.getAt(0),
            hasDirtySubForm = this.getViewModel().get('hasDirtySubForm');

        if (!currentRecord.get('isreadonly')) {

            if (currentRecord.dirty && !hasDirtySubForm) {

                if (!(Object.keys(currentRecord.modified).length == 1 && currentRecord.modified.hasOwnProperty('isfavorite'))) {

                    this.confirmClose();
                    return;
                }
            }
            else if (hasDirtySubForm) {

                this.confirmClose();
                return;
            }
        }

        this.adminFormClose();
    },


    adminFormClose : function () {

        this.getView().destroy();
    },


    confirmClose : function () {

        Ext.MessageBox.show({
            title:'Save Changes?',
            msg: 'You are closing a form that has unsaved changes. Save changes now?',
            buttons: Ext.MessageBox.YESNOCANCEL,
            scope: this,
            fn: function (btn) {

                if (btn === 'yes') {

                    this.adminFormSave('close');
                }
                else if (btn === 'no') {

                    this.adminFormClose()
                }
            },
            icon: Ext.MessageBox.QUESTION
        });
    },

    confirmDelete : function () {

        Ext.MessageBox.show({
            title:'Please Confirm!',
            msg: 'Please confirm definitive destruction for this record? The operation is unrecoverable!',
            buttons: Ext.MessageBox.OKCANCEL,
            scope: this,
            fn: function (btn) {
                if (btn === 'ok') {
                    this.adminFormDelete();
                }
            },
            icon: Ext.MessageBox.WARNING
        });
    },


    onAdminFormDelete: function () {

        this.confirmDelete();
    },

    adminFormDelete: function () {

        this.formStore.getAt(0).erase({
            scope: this,
            success: function (record, operation) {

                var response = Ext.JSON.decode(operation.getResponse().responseText);

                if (this.isFavorite) {
                    this.adminTree.fireEvent("deletefavorite", this.treeItemId);
                }

                if (response.updateitems) {

                    this.reloadSubForm(response.updateitems);
                }
                else {

                    this.adminTree.fireEvent("deletenode", this.treeItemId);
                }

                Ext.Function.defer(this.adminFormClose, 10, this);

                AbsMan.util.mess(response.mess || "Record removed successfully.");
            },
            failure: function (record, operation) {

                var response = Ext.JSON.decode(operation.getResponse().responseText);

                AbsMan.util.mess(response.mess || "Record not removed.", AbsMan.util.ERROR);
            }
        });
    },


    onAdminFormAddRemoveFavorite: function () {

        if ( !this.isFavorite ) {
            this.addFavorite();
        }
        else {
            this.removeFavorite();
        }
    },

    addFavorite: function() {

        var me = this.view,
            favoriteTextField = me.getForm().findField('name') || me.getForm().findField('displayname') || { value: 'Not Available'} ;

        Ext.Ajax.request({
            scope: this,
            url: 'admin/favorite/add/' + this.treeItemId,
            params: { text: favoriteTextField.value},
            success: function (response) {

                var responseData = Ext.decode(response.responseText);

                this.adminTree.fireEvent("newfavorite", responseData.newnode);
                this.isFavorite = true;
                this.formStore.getAt(0).set("isfavorite",true);
            },
            failure: function (response) {
                //todo ;
            }
        });
    },

    removeFavorite: function () {

        this.adminTree.fireEvent("deletefavorite", this.treeItemId );
        this.isFavorite = false;
        this.formStore.getAt(0).set("isfavorite",false);

    },

    onAdminFormReload: function () {

        var currentRecord = this.formStore.getAt(0);
        if (currentRecord && currentRecord.dirty === true && currentRecord.get('isreadonly') == false) {
            if ( Object.keys(currentRecord.modified).length == 1 && currentRecord.modified.hasOwnProperty('isfavorite')) {

                Ext.Function.defer(this.adminFormClose, 10, this);
                Ext.Function.defer(this.reloadForm, 100, this , [this.getView().itemId]);
            }
            else {

                this.confirmReload();
            }
        }
        else {

            Ext.Function.defer(this.adminFormClose, 10, this);
            Ext.Function.defer(this.reloadForm, 100, this , [this.getView().itemId]);
        }
    },


    confirmReload : function () {

        Ext.MessageBox.show({
            title:'Save Changes?',
            msg: 'You are reloading a form that has unsaved changes. Save changes now?',
            buttons: Ext.MessageBox.YESNOCANCEL,
            scope: this,
            fn: function (btn) {
                if (btn === 'yes') {
                    this.adminFormSave('reload');
                }
                else if (btn === 'no') {
                    Ext.Function.defer(this.adminFormClose, 10, this);
                    Ext.Function.defer(this.reloadForm, 100, this , [this.getView().itemId]);
                }
            },
            icon: Ext.MessageBox.QUESTION
        });
    },


    onNameChange : function(event, element) {
        alert('who is name change caller?');
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
                            }, this);
                        }
                    }
                }
            }
        }, this);
    },

    checkDirtySubForm: function() {

        var hasDirtySubForm = false;

        Ext.Object.eachValue(this.dirtySubForms, function (value) {

            if (value) {
                hasDirtySubForm = true;
            }

        }, this);

        this.getViewModel().set('hasDirtySubForm', hasDirtySubForm);
        if (!this.getViewModel().get('isReadOnly') && this.getView().getForm().isValid()) {
            this.getViewModel().set('saveEnabled', hasDirtySubForm || this.getViewModel().get('isDirtyRecord'));
        }

    }

});