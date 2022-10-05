
Ext.define('AbsMan.view.admin.category.GroupLeave', {
    extend: 'AbsMan.view.admin.category.GroupCategory',
    xtype: 'group-leave-panel',
    reference: 'groupLeavePanel',

    requires: [
        'AbsMan.view.admin.category.GroupLeaveModel'
    ],

    viewModel: {
        type: 'groupleavepanel'
    },

    items: [
        {
            xtype : 'grid',
            flex: 1,
            multiSelect: true,
            title: 'Allocated Leave Categories',
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

            columns: [
                { xtype: 'rownumberer'},
                {
                    header: 'Name',
                    flex:1,
                    sortable: true,
                    dataIndex: 'name'
                },{
                    header: 'Description',
                    flex:1,
                    sortable: true,
                    dataIndex: 'text'
                }
            ]
        },
        {
            xtype : 'grid',
            flex: 1,
            multiSelect: true,
            title: 'Available Leave Categories',
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
            columns: [
                { xtype: 'rownumberer'},
                {
                    header: 'Name',
                    flex:1,
                    sortable: true,
                    dataIndex: 'name'
                },{
                    header: 'Description',
                    flex:1,
                    sortable: true,
                    dataIndex: 'text'
                }
            ]
        }
    ]
});




