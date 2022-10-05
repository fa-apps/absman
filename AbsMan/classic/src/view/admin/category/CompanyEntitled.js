
Ext.define('AbsMan.view.admin.category.CompanyEntitled', {
    extend: 'AbsMan.view.admin.category.CompanyCategory',
    xtype: 'company-entitled-panel',
    reference: 'companyEntitledPanel',

    requires: [
        'AbsMan.view.admin.category.CompanyEntitledModel',
        'AbsMan.view.admin.category.CompanyEntitledController',
        'AbsMan.view.admin.category.EntitledDetails'
    ],

    viewModel: {
        type: 'companyentitledpanel'
    },

    controller: 'companyentitledpanel',

    features: [{
        ftype:'grouping',
        groupHeaderTpl: '<strong>{columnName:capitalize}: {name}</strong> ({rows.length} Item{[values.rows.length > 1 ? "s" : ""]})',
        startCollapsed: false,
        id: 'entitledGrouping'
    }],

    columns: [
        {
            xtype: 'rownumberer'
        },{
            header: 'Name',
            tooltip: 'Name',
            flex:1,
            sortable: true,
            dataIndex: 'name',
            editor: {
                xtype: 'textfield',
                allowBlank: false,
                bind: {
                    disabled: '{isReadOnly}'
                }
            }
        },{
            header: 'Description',
            tooltip: 'Description',
            sortable: true,
            dataIndex: 'text',
            flex: 1,
            editor: {
                xtype: 'textfield',
                allowBlank: true,
                bind: {
                    disabled: '{isReadOnly}'
                }
            }
        },{
            header: 'Default',
            tooltip: 'Default Value',
            dataIndex: 'defaultvalue',
            width: 60,
            sortable: true,
            xtype: 'numbercolumn',
            editor: {
                xtype: 'numberfield',
                allowBlank: false,
                bind: {
                    disabled: '{isReadOnly}'
                }
            }
        },{
            header: 'Valid From',
            tooltip: 'Valid From',
            width: 120,
            sortable: true,
            xtype: 'datecolumn',
            dataIndex: 'validfrom',
            format: 'd M Y',
            editor : {
                xtype: 'datefield',
                format: 'd/m/Y',
                bind: {
                    disabled: '{isReadOnly}'
                }
            }
        },{
            header: 'Valid To',
            tooltip: 'Valid To',
            width: 120,
            sortable: true,
            xtype: 'datecolumn',
            dataIndex: 'validto',
            format: 'd M Y',
            editor : {
                xtype: 'datefield',
                format: 'd/m/Y',
                bind: {
                    disabled: '{isReadOnly}'
                }
            }
        },{
            header: 'Enforce',
            tooltip: 'Enforce Validity Expiration',
            dataIndex: 'enforcevalidity',
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
                    [true,'Yes'],
                    [false,'No']
                ],
                bind: {
                    disabled: '{isReadOnly}'
                }
            }
        },{
            header: 'Auto Expires',
            tooltip: 'Auto Expires',
            dataIndex: 'autoexpires',
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
            header: 'On Demand Default',
            tooltip: 'On Demand Default Value',
            width: 60,
            sortable: true,
            xtype: 'numbercolumn',
            dataIndex: 'ondemanddefaultvalue',
            editor: {
                xtype: 'numberfield',
                allowBlank: false,
                bind: {
                    disabled: '{isReadOnly}'
                }
            },
            bind: {
                hidden: '{!currentRecord.manageondemand}'
            }
        },{
            header: 'Auto Increments',
            tooltip: 'Auto Increments',
            dataIndex: 'autoincrement',
            width: 50,
            sortable: true,
            editor: {
                xtype: 'textfield',
                allowBlank: true,
                bind: {
                    disabled: '{isReadOnly}'
                }
            }
        }
    ]

});




