
Ext.define('AbsMan.view.admin.category.UserEntitled', {
    extend: 'Ext.grid.Panel',
    xtype: 'user-entitled-panel',
    reference: 'userEntitledGrid',


    requires: [
        'AbsMan.view.admin.category.UserEntitledModel',
        'AbsMan.view.admin.category.UserEntitledController',
        'AbsMan.view.admin.category.UserEntitledDetails'
    ],

    viewModel: {
        type: 'adminuserentitled'
    },

    controller: 'adminuserentitled',

    iconCls: 'fa fa-cog',

    listeners: {
        beforeexpand: 'onBeforeExpand',
        expand: 'onExpand',
        celldblclick : 'onNameDblClick'

    },

    bind: {
        store: '{subFormData}'
    },

    features: [{
        ftype:'grouping',
        groupHeaderTpl: '<strong>{columnName:capitalize}: {name}</strong> ({rows.length} Item{[values.rows.length > 1 ? "s" : ""]})',
        startCollapsed: false,
        id: 'userEntitlementGrouping'
    }],

    plugins: [{
        ptype: 'cellediting',
        pluginId: 'entitledCellEditorId',
        clicksToEdit: 1
    }],

    flex:1,
    minHeight: 320,

    columns: [
        {
            xtype: 'rownumberer'
        },{
            header: 'Name',
            tooltip: 'Entitled Category Name',
            flex:1,
            sortable: true,
            dataIndex: 'name',
            editor: false,
            listeners: {

            }
        },{
            header: 'Valid From',
            width: 100,
            sortable: true,
            xtype: 'datecolumn',
            dataIndex: 'validfrom',
            format: 'd M Y',
            editor : false
        },{
            header: 'Valid To',
            width: 100,
            sortable: true,
            xtype: 'datecolumn',
            dataIndex: 'validto',
            format: 'd M Y',
            editor : false
        },{
            header: 'Allocated',
            tooltip: 'Allocated',
            width: 80,
            sortable: true,
            xtype: 'numbercolumn',
            dataIndex: 'allocated',
            editor: {
                xtype: 'numberfield',
                allowBlank: false,
                bind: {
                    disabled: '{isReadOnly}'
                }
            }
        },{
            header: 'Taken',
            tooltip: 'Taken',
            width: 80,
            sortable: true,
            xtype: 'numbercolumn',
            dataIndex: 'taken',
            editor: false
        },{
            header: 'Left',
            tooltip: 'Left',
            width: 80,
            sortable: true,
            xtype: 'numbercolumn',
            dataIndex: 'left',
            editor: {
                xtype: 'numberfield',
                allowBlank: false,
                bind: {
                    disabled: '{isReadOnly}'
                }
            }
        },{
            header: 'OD Alloc',
            tooltip: 'On Demand Allocated',
            width: 80,
            sortable: true,
            xtype: 'numbercolumn',
            dataIndex: 'ondemandallocated',
            editor: {
                xtype: 'numberfield',
                allowBlank: false,
                bind: {
                    disabled: '{isReadOnly}'
                }
            },
            bind: {
                hidden: '{!manageOnDemand}'
            }
        },{
            header: 'OD Taken',
            tooltip: 'On Demand Taken',
            width: 80,
            sortable: true,
            xtype: 'numbercolumn',
            dataIndex: 'ondemandtaken',
            editor: false,
            bind: {
                hidden: '{!manageOnDemand}'
            }
        },{
            header: 'OD Left',
            tooltip: 'On Demand Left',
            width: 80,
            sortable: true,
            xtype: 'numbercolumn',
            dataIndex: 'ondemandleft',
            editor: {
                xtype: 'numberfield',
                allowBlank: false,
                bind: {
                    disabled: '{isReadOnly}'
                }
            },
            bind: {
                hidden: '{!manageOnDemand}'
            }
        },{
            header: 'Hide',
            tooltip: 'Hide This Entitled Category',
            dataIndex: 'hidden',
            width: 60,
            sortable: true,
            xtype: 'booleancolumn',
            trueText: 'Yes',
            falseText: 'No',
            editor: {
                xtype: 'combobox',
                editable: false,
                triggerAction: 'all',
                store: [
                    [true, 'Yes'],
                    [false, 'No']
                ],
                bind: {
                    disabled: '{isReadOnly}'
                }
            }
        },{
            header: 'Year',
            width: 60,
            sortable: true,
            xtype: 'datecolumn',
            dataIndex: 'year',
            format: 'Y',
            editor : false,
            hidden: true
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
            text: 'Edit',
            iconCls: 'x-fa fa-edit',
            handler: 'onEdit',
            itemId: 'editButton',
            bind: {
                disabled: '{editDisabled}'
            }
        },{
            text: 'Save',
            iconCls: 'x-fa fa-save',
            handler: 'onSave',
            itemId: 'saveButton',
            bind: {
                disabled: '{saveDisabled}'
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




