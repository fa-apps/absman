
Ext.define('AbsMan.view.admin.category.CompanyPublicDay', {
    extend: 'AbsMan.view.admin.category.CompanyCategory',
    xtype: 'company-publicday-panel',
    reference: 'companyPublicDayPanel',

    requires: [
        'AbsMan.view.admin.category.CompanyPublicDayModel',
        'AbsMan.view.admin.category.CompanyPublicDayController',
        'AbsMan.view.admin.category.PublicDayDetails'
    ],

    viewModel: {
        type: 'companypublicdaypanel'
    },

    controller: 'companypublicdaypanel',

    features: [{
        ftype:'grouping',
        enableGroupingMenu: false,
        groupHeaderTpl: '<strong>{columnName:capitalize}: {name}</strong> ({rows.length} Item{[values.rows.length > 1 ? "s" : ""]})'
    }],

    columns: [
        {
            xtype: 'rownumberer'
        },{
            header: 'Name',
            width: 260,
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
            header: 'Date',
            width: 120,
            sortable: true,
            xtype: 'datecolumn',
            dataIndex: 'date',
            format: 'd M Y',
            editor : {
                xtype: 'datefield',
                format: 'd/m/Y',
                bind: {
                    disabled: '{isReadOnly}'
                }
            }
        },{
            header: 'Length',
            dataIndex: 'pdlength',
            width: 160,
            sortable: true,
            editor: {
                xtype: 'combobox',
                triggerAction: 'all',
                autoSelect: true,
                editable: false,
                valueField: 'id',
                displayField: 'text',
                emptyText: 'Please select...',
                bind: {
                    store: '{publicDayLength}',
                    disabled: '{isReadOnly}'
                }
            },
            renderer: 'publicDayLengthRender'
        },{
            flex: 1
        }
    ]

});




