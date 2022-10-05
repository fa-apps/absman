
Ext.define('AbsMan.view.admin.category.GroupPublicDay', {
    extend: 'AbsMan.view.admin.category.GroupCategory',
    xtype: 'group-publicday-panel',
    reference: 'groupPublicDayPanel',

    requires: [
        'AbsMan.view.admin.category.GroupPublicDayModel'
    ],

    viewModel: {
        type: 'grouppublicdaypanel'
    },

    items: [
        {
            xtype : 'grid',
            flex: 1,
            multiSelect: true,
            title: 'Allocated Public Days',
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
                    header: 'Date',
                    width: 100,
                    sortable: true,
                    xtype: 'datecolumn',
                    dataIndex: 'date',
                    format: 'd M Y'
                }
            ]
        },
        {
            xtype : 'grid',
            flex: 1,
            multiSelect: true,
            title: 'Available Public Days',
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
                { xtype: 'rownumberer'},
                {
                    header: 'Name',
                    flex:1,
                    sortable: true,
                    dataIndex: 'name'
                },{
                    header: 'Date',
                    width: 100,
                    sortable: true,
                    xtype: 'datecolumn',
                    dataIndex: 'date',
                    format: 'd M Y'
                }
            ]
        }
    ]
});




