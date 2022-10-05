
Ext.define('AbsMan.view.admin.AdminForm', {
    extend: 'Ext.form.Panel',
    xtype: 'adminform-panel',

    requires: [
        'AbsMan.view.admin.AdminFormController'
    ],


    trackResetOnLoad: true,

    listeners: {
        beforeclose: 'onBeforeClose',
        afterrender: 'initView'
    },

    closable: true,
    scrollable : true,
    bodyPadding: 10,

    dockedItems: [{
        xtype: 'toolbar',
        dock: 'top',
        itemId: 'top-bar',
        defaults: {
            baseCls: 'x-btn x-btn-default-small ',
            cls: 'absman-small-button'
        },
        items: [{
            text: 'Save & Close',
            iconCls: 'x-fa fa-save',
            handler: 'onAdminFormSaveAndClose',
            bind: {
                disabled: '{!saveEnabled}'
            }
        }, {
            text: 'Save',
            iconCls: 'x-fa fa-save',
            handler: 'onAdminFormSave',
            bind: {
                disabled: '{!saveEnabled}'
            }
        }, {
            text: 'Close',
            iconCls: 'x-fa fa-close',
            handler: 'onAdminFormClose'
        }, {
            itemId: 'delete-button',
            text: 'Delete',
            iconCls: 'x-fa fa-trash-o',
            handler: 'onAdminFormDelete',
            bind: {
                disabled: '{!deleteEnabled}'
            }

        }, '->', {
            itemId: 'favorite-button',
            text: 'Favorites',
            tooltip: 'Click here to add or remove this form to your favorites',
            handler: 'onAdminFormAddRemoveFavorite',
            bind: {
                disabled: '{isNewRecord}',
                iconCls : '{favoriteIconCls}'
            }

        }, {
            text: 'Reload',
            iconCls: 'x-fa fa-refresh',
            tooltip: 'Click here to reload the form. <br>All modifications will be lost!',
            handler: 'onAdminFormReload'
        }]
    }]

});