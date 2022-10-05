
Ext.define('AbsMan.view.admin.membership.UserMembership', {
    extend: 'Ext.Panel',
    xtype: 'user-membership-panel',


    requires: [
        'AbsMan.view.admin.membership.UserMembershipModel',
        'AbsMan.view.admin.membership.UserMembershipController',
        'AbsMan.view.util.PickUser'
    ],

    viewModel: {
        type: 'adminusermembership'
    },

    controller: 'adminusermembership',

    iconCls: 'fa fa-cog',

    listeners: {
        beforeexpand: 'onBeforeExpand',
        expand: 'onExpand'
    },

    layout: {
        type: 'hbox',
        align: 'stretch'
    },

    defaults: {
        margin: 5,
        frame: true
    },

    flex:1,
    minHeight: 320,

    items: [
        {
            xtype : 'grid',
            flex: 1,
            multiSelect: true,
            title: 'Member Of Groups',
            bind: {
                store: '{allocatedData}'
            },
            viewConfig : {
                plugins: {
                    ptype: 'gridviewdragdrop',
                    containerScroll: true,
                    dragGroup: "ddgroup1",
                    dropGroup: "ddgroup2",
                    pluginId: 'ddgrid1'
                },
                listeners: {
                    drop: 'onAllocatedDrop'
                }
            },
            columns: [
                { xtype: 'rownumberer'},
                {
                    header: 'Name',
                    flex:1,
                    sortable: true,
                    dataIndex: 'name'
                },{
                    header: 'Default Group',
                    dataIndex: 'isdefaultgroup',
                    width: 110,
                    trueText: 'Yes',
                    falseText: 'No',
                    sortable: true,
                    xtype: 'booleancolumn'
                }
            ]
        },
        {
            xtype : 'grid',
            flex: 1,
            multiSelect: true,
            title: 'Available Groups',
            bind: {
                store: '{availableData}'
            },
            viewConfig : {
                plugins: {
                    ptype: 'gridviewdragdrop',
                    containerScroll: true,
                    dragGroup: "ddgroup2",
                    dropGroup: "ddgroup1",
                    pluginId:  'ddgrid2'
                },
                listeners: {
                    drop: 'onAvailableDrop',
                    beforedrop: 'onBeforeDrop'
                }
            },

            columns: [
                { xtype: 'rownumberer'},
                {
                    header: 'Name',
                    flex:1,
                    sortable: true,
                    dataIndex: 'name'
                },{
                    header: 'Default Group',
                    dataIndex: 'isdefaultgroup',
                    width: 110,
                    trueText: 'Yes',
                    falseText: 'No',
                    sortable: true,
                    xtype: 'booleancolumn'
                }
            ]
        }
    ],


    dockedItems: [{
        xtype: 'toolbar',
        dock: 'top',
        itemId: 'top-bar',
        defaults: {
            baseCls: 'x-btn x-btn-default-small ',
            cls: 'absman-small-button'
        },
        items: [{
            text: 'Add Available',
            iconCls: 'x-fa fa-plus',
            handler: 'onAdd',
            itemId: 'addButton',
            bind: {
                disabled: '{isReadOnly}'
            }
        },{
            text: 'Remove Allocated',
            iconCls: 'x-fa fa-minus',
            handler: 'onRemove',
            itemId: 'removeButton',
            bind: {
                disabled: '{isReadOnly}'
            }
        },{
            text: 'Save',
            iconCls: 'x-fa fa-save',
            handler: 'onSave',
            itemId: 'saveButton',
            bind: {
                disabled: '{isReadOnly}'
            }
        },{
            text: 'Cancel',
            iconCls: 'x-fa fa-undo',
            handler: 'onCancel',
            itemId: 'cancelButton',
            bind: {
                disabled: '{isReadOnly}'
            }
        },'->', {
            text: 'Reload',
            iconCls: 'x-fa fa-refresh',
            tooltip: 'Click here to reload. <br>All modifications will be lost!',
            handler: 'onReload',
            itemId: 'reloadButton'
        }]
    }]

});




