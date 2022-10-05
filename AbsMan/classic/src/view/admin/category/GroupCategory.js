
Ext.define('AbsMan.view.admin.category.GroupCategory', {
    extend: 'Ext.Panel',
    xtype: 'group-category-panel',

    requires: [
        'AbsMan.view.admin.category.GroupCategoryController'
    ],

    controller: 'groupcategorypanel',

    iconCls: 'fa fa-cog',

    listeners: {
        focusenter: 'onFocus',
        beforeexpand: 'onBeforeExpand',
        expand: 'onExpand'
    },

    height: 400,
    layout: {
        type: 'hbox',
        align: 'stretch'
    },

    defaults: {
        margin: 5,
        frame: true
    },


    flex:1,

    dockedItems: [{
        xtype: 'toolbar',
        dock: 'top',
        itemId: 'top-bar',
        defaults: {
            baseCls: 'x-btn x-btn-default-small ',
            cls: 'absman-small-button'
        },
        items: [{
            text: 'Remove Allocated',
            iconCls: 'x-fa fa-minus',
            handler: 'onRemove',
            itemId: 'removeButton',
            bind: {
                disabled: '{removeDisabled}'
            }
        },{
            text: 'Add Available',
            iconCls: 'x-fa fa-plus',
            handler: 'onAdd',
            itemId: 'addButton',
            bind: {
                disabled: '{addDisabled}'
            }
        },{
            text: 'Save',
            iconCls: 'x-fa fa-save',
            handler: 'onSave',
            itemId: 'saveButton',
            disabled: true
        },{
            text: 'Cancel',
            iconCls: 'x-fa fa-undo',
            handler: 'onCancel',
            itemId: 'cancelButton',
            disabled: true
        },'->', {
            text: 'Reload',
            iconCls: 'x-fa fa-refresh',
            tooltip: 'Click here to reload. <br>All modifications will be lost!',
            handler: 'onReload',
            itemId: 'reloadButton'
        }]
    }]


});




