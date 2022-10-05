
Ext.define('AbsMan.view.admin.category.GroupEntitled', {
    extend: 'AbsMan.view.admin.category.GroupCategory',
    xtype: 'group-entitled-panel',
    reference: 'groupEntitledPanel',

    requires: [
        'AbsMan.view.admin.category.GroupEntitledModel'
    ],

    viewModel: {
        type: 'groupentitledpanel'
    },

    items: [
        {
            xtype : 'grid',
            flex: 1,
            multiSelect: true,
            title: 'Allocated Entitled Categories',
            reference: 'allocatedGrid',
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
            features: [{
                ftype:'grouping',
                groupHeaderTpl: '<strong>{columnName:capitalize}: {name}</strong> ({rows.length} Item{[values.rows.length > 1 ? "s" : ""]})',
                startCollapsed: false,
                id: 'grouping1'
            }],
            columns: [
                { xtype: 'rownumberer'},
                {
                    header: 'Name',
                    flex:1,
                    sortable: true,
                    dataIndex: 'name'
                },{
                    header: 'Default',
                    dataIndex: 'defaultvalue',
                    width: 60,
                    sortable: true,
                    xtype: 'numbercolumn'
                },{
                    header: 'Valid From',
                    width: 90,
                    sortable: true,
                    xtype: 'datecolumn',
                    dataIndex: 'validfrom',
                    format: 'd M Y'
                },{
                    header: 'Valid To',
                    width: 90,
                    sortable: true,
                    xtype: 'datecolumn',
                    dataIndex: 'validto',
                    format: 'd M Y'
                }
            ]
        },
        {
            xtype : 'grid',
            flex: 1,
            multiSelect: true,
            title: 'Available Entitled Categories',
            reference: 'availableGrid',
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
            features: [{
                ftype:'grouping',
                groupHeaderTpl: '<strong>{columnName:capitalize}: {name}</strong> ({rows.length} Item{[values.rows.length > 1 ? "s" : ""]})',
                startCollapsed: false,
                id: 'grouping2'
            }],
            columns: [
                {
                    xtype: 'rownumberer'
                },{
                    header: 'Name',
                    flex:1,
                    sortable: true,
                    dataIndex: 'name'
                },{
                    header: 'Default',
                    dataIndex: 'defaultvalue',
                    width: 60,
                    sortable: true,
                    xtype: 'numbercolumn'
                },{
                    header: 'Valid From',
                    width: 90,
                    sortable: true,
                    xtype: 'datecolumn',
                    dataIndex: 'validfrom',
                    format: 'd M Y'
                },{
                    header: 'Valid To',
                    width: 90,
                    sortable: true,
                    xtype: 'datecolumn',
                    dataIndex: 'validto',
                    format: 'd M Y'
                }
            ]
        }
    ]

});




