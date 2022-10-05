
Ext.define('AbsMan.view.formpanel.MyStaff', {
    extend: 'Ext.form.Panel',
    xtype: 'my-staff',


    requires: [
        'AbsMan.view.request.RequestList',
        'AbsMan.view.formpanel.MyStaffController',
        'AbsMan.view.formpanel.MyStaffModel',
        'AbsMan.view.util.PickUser',
        'AbsMan.view.ux.GCalendar'
    ],

    controller: 'my-staff',
    viewModel: {
        type: 'my-staff'
    },

    iconCls: 'x-fa fa-sitemap',
    title: 'My Staff',
    closable: true,
    scrollable: true,


    layout: {
        type: 'vbox',
        pack: 'start',
        align: 'stretch'
    },
    bodyPadding : '0 10 0 0',


    items: [
        {
            minHeight: 380,
            margin: '0 0 10 0',
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            defaults: {
                frame: true
            },
            items: [
                {
                    collapsible: true,
                    collapseDirection: 'left',
                    flex: .3,
                    margin : '0 10 0 0',
                    title: 'My Staff Groups',


                    xtype: 'treepanel',
                    itemId: 'myStaffTreePanelId',
                    rootVisible: false,
                    animate: true,
                    reserveScrollbar: true,
                    useArrows: true,


                    bind: {
                        store:  '{groupTree}'
                    },

                    tools: [{
                        type: 'refresh',
                        handler: 'onReloadForm'
                    }, {
                        type: 'plus',
                        handler: 'onAddGroup',
                        tooltip: 'Create a new group'
                    }],

                    listeners: {
                        select: 'onClick'
                    },

                    plugins: {
                        ptype: 'cellediting',
                        clicksToEdit: 0,
                        listeners: {
                            beforeedit: 'onItemBeforeEdit',
                            edit: 'onItemEdit'
                        }
                    },

                    viewConfig: {
                        reserveScrollbar: true,
                        markDirty: false,
                        plugins: {
                            ptype: 'treeviewdragdrop',
                            containerScroll: true
                        },
                        listeners: {
                            beforedrop: 'onBeforeDrop',
                            drop: 'onDrop'
                        }
                    },

                    hideHeaders: true,

                    columns: [{
                        text: 'Name',
                        xtype: 'treecolumn',
                        flex: 1,
                        sortable: true,
                        editor: {
                            xtype: 'textfield',
                            allowBlank: false
                        },
                        scrollable: true,
                        dataIndex: 'text'
                    },{
                        width: 30,
                        sortable: false,
                        menuDisabled: true,
                        xtype: 'actioncolumn',
                        align: 'center',
                        iconCls: 'x-fa fa-ellipsis-v',
                        handler: 'onActionClick',
                        isDisabled: function (view, rowIdx, colIdx, item, record) {  return record.id == 'newGroupId' ;}
                    },  { width: 10 }]


                }, {
                    flex:1,
                    xtype: 'tabpanel',
                    region: 'center',
                    itemId: 'myStaffSchedulePanelsId',
                    activeItem : 0,
                    resizeTabs: true,
                    collapsible: false,
                    enableTabScroll: true,
                    border: false,
                    defaults: {
                        bodyPadding: 10,
                        scrollable: "y"
                    },
                    listeners: {
                        tabchange: 'onScheduleTabChange'
                    }

                }
            ]

        }, {
            itemId: "requestListId",
            xtype: "requestlist",
            listType: 'staff',
        }
    ]

});




