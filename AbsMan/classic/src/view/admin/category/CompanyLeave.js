
Ext.define('AbsMan.view.admin.category.CompanyLeave', {
    extend: 'AbsMan.view.admin.category.CompanyCategory',
    xtype: 'company-leave-panel',
    reference: 'companyLeavePanel',

    requires: [
        'AbsMan.view.admin.category.CompanyLeaveModel',
        'AbsMan.view.admin.category.CompanyLeaveController',
        'AbsMan.view.admin.category.LeaveDetails'
    ],

    viewModel: {
        type: 'companyleavepanel'
    },

    controller: 'companyleavepanel',

    viewConfig : {
        plugins: {
            ptype: 'gridviewdragdrop',
            containerScroll: false,
            dragGroup: "ddgroup1",
            dropGroup: "ddgroup1",
            pluginId: 'companyLeaveDDId'
            //TODO https://www.sencha.com/forum/showthread.php?304250-Grid-CellEditing-clashes-with-Drag-and-Drop
        }
    },

    columns: [
        {
            xtype: 'rownumberer'
        },{
            header: 'Name',
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
            sortable: true,
            dataIndex: 'text',
            flex:1,
            editor: {
                xtype: 'textfield',
                allowBlank: true,
                bind: {
                    disabled: '{isReadOnly}'
                }
            }

        },{
            header: 'Max Value',
            dataIndex: 'maxvalue',
            flex:.3,
            sortable: false,
            xtype: 'numbercolumn',
            editor: {
                xtype: 'numberfield',
                allowBlank: false,
                bind: {
                    disabled: '{isReadOnly}'
                }
            }

        },{
            header: 'Auto Approvable',
            dataIndex: 'autoapprovable',
            flex:.3,
            sortable: false,
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
            header: 'Justification Not Required',
            dataIndex: 'justificationnotrequired',
            flex:.3,
            sortable: false,
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
        }
    ]

});




