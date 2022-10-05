
Ext.define('AbsMan.view.request.RequestList', {
    extend: 'Ext.grid.Panel',
    xtype: 'requestlist',


    requires: [
        'AbsMan.view.request.RequestListController',
        'AbsMan.view.request.RequestListModel',
        'Ext.ux.grid.PageSize'
    ],

    viewModel: {
        type: 'requestlist'
    },

    controller: 'requestlist',

    iconCls: 'fa fa-th',
    frame: true,
    minHeight: 250,
    scrollable: true,

    selModel: {
        mode: 'MULTI'
    },


    listeners: {

        rowdblclick: 'onRowDoubleClick'
    },

    bind: {

        store: '{requestListData}',
        title: '{requestListUser} {staff}{pending}{title}'
    },

    columns: [{
        header: 'View',
        width: 70,
        sortable: false,
        xtype: 'actioncolumn',
        menuDisabled: true,
        align: 'center',
        iconCls: 'x-fa fa-info',
        handler: 'onViewDetails'
    }, {
        header: 'Request For',
        flex: 1,
        sortable: true,
        dataIndex: 'user',
        bind: {
            hidden: '{!showUserCol}'
        }
    }, {
        header: 'Start Date',
        width: 140,
        sortable: true,
        dataIndex: 'leavedate',
        tooltip: 'Start Date',
        xtype: 'datecolumn',
        format: 'j M Y'
    }, {
        header: 'Leaving Time',
        tooltip: 'Leaving Time',
        width: 40,
        sortable: true,
        dataIndex: 'leavetime',
        align: "center"
    }, {
        header: 'End Date',
        width: 140,
        sortable: true,
        dataIndex: 'returndate',
        tooltip: 'End Date',
        xtype: 'datecolumn',
        format: 'j M Y'
    }, {
        header: 'Return Time',
        tooltip: 'Return Time',
        width: 40,
        sortable: true,
        dataIndex: 'returntime',
        align: "center"
    }, {
        header: 'Total',
        tooltip: 'Total Days/hours',
        width: 120,
        sortable: true,
        xtype: 'numbercolumn',
        dataIndex: 'totalrequest',
        format: "0.##",
        align: "center"
    }, {
        header: 'Status',
        flex: 1,
        sortable: true,
        dataIndex: 'status'
    }, {
        header: 'Approver',
        flex: 1,
        sortable: true,
        dataIndex: 'approver',
        bind: {
            hidden: '{!showApproverCol}'
        }
    }, {
        header: 'Request Date',
        sortable: true,
        dataIndex: 'requestdate',
        width: 160,
        tooltip: 'Request Date',
        xtype: 'datecolumn',
        format: 'j M y H:i'

    }],

    dockedItems: [{
        xtype: 'toolbar',
        dock: 'top',
        itemId: 'top-bar',
        items: [, '->',
            {
                xtype: 'segmentedbutton',
                defaults: {
                    width: 120,
                    listeners: {
                        click: "onListTypeClick"
                    },
                    baseCls: 'x-btn x-btn-default-small ',
                    cls: 'absman-small-button'
                },
                items: [{
                    itemId: 'PendingButtonId',
                    text: 'Pending Only',
                    iconCls: 'x-fa fa-exclamation',
                    value: true,
                    bind: {
                        pressed: "{listPendingPreference}"
                    }
                }, {
                    text: ' All Requests',
                    iconCls: 'x-fa fa-th',
                    value: false,
                    bind: {
                        pressed: "{!listPendingPreference}"
                    }
                }]
            }, {
                xtype: "button",
                iconCls: 'x-fa fa-heart-o',
                baseCls: 'x-btn x-btn-default-small ',
                cls: 'absman-small-button',
                preference: "listPending",
                handler: "saveUserPreference",
                tooltip: "Remember filter selection"
            }, {
                xtype: "button",
                baseCls: 'x-btn x-btn-default-small ',
                cls: 'absman-small-button',
                iconCls: 'x-fa fa-refresh',
                handler: 'onReload'
            }
        ]
    },{
        xtype: 'pagingtoolbar',
        dock: 'bottom',
        bind: {
            store: '{requestListData}'
        },
        pageSize: 25,
        displayInfo: true,
        displayMsg: 'Displaying items {0} - {1} of {2}',
        plugins: 'pagesize',
        emptyMsg: "No item to display"
    }]


});




