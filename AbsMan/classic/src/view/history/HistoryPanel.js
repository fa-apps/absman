
Ext.define('AbsMan.view.history.HistoryPanel', {
    extend: 'Ext.grid.Panel',
    xtype: 'history-panel',

    requires: [
        'AbsMan.view.history.HistoryPanelModel',
        'AbsMan.view.history.HistoryPanelController'
    ],

    viewModel: {
        type: 'historypanel'
    },

    controller: 'historypanel',

    iconCls: 'fa fa-history',

    bind: {
        store: '{subFormData}'
    },

    listeners: {
        beforeexpand: 'onBeforeExpand',
        focusenter: 'onFocus',
        expand: 'onExpand'
    },

    reference: 'historyGrid',

    columns: [

        {header: 'Date', width: 210, sortable: true, dataIndex: 'date', xtype:'datecolumn', format:'D d M Y H:i:s T'},
        {header: 'Name', width: 180, sortable: true, dataIndex: 'user'},
        {header: 'Type', width: 150, sortable: true, dataIndex: 'type'},
        {header: 'Action', flex: 1, sortable: true, dataIndex: 'text'},
        {
            menuDisabled: true,
            header: 'Details',
            sortable: false,
            xtype: 'actioncolumn',
            width: 70,
            align: 'center',
            items: [{
                iconCls: 'fa fa-binoculars',
                handler: 'showHistoryDetails'
            }]
        }

    ],

    flex: 1,
    height: 300,


    dockedItems: [{
        xtype: 'pagingtoolbar',
        dock: 'bottom',
        bind: {
            store: '{subFormData}'
        },
        pageSize: 25,
        displayInfo: true,
        displayMsg: 'Displaying topics {0} - {1} of {2}',
        emptyMsg: "No items to display"
    }]


});




