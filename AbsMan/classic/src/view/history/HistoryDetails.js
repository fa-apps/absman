
Ext.define('AbsMan.view.history.HistoryDetails', {
    extend: 'Ext.window.Window',
    xtype: 'historydetails-panel',

    requires: [
        'AbsMan.view.history.HistoryDetailsController',
        'AbsMan.view.history.HistoryDetailsModel'
    ],

    viewModel: {
        type: 'history-details'
    },

    controller: 'history-details',

    layout: {
        type: 'vbox',
        align: 'stretch',
        padding : 0
    },

    title: 'History Details',
    bodyPadding: 10,
    width: 600,
    height: 400,
    modal: true,
    animate: true,
    animateTarget: null,

    items: [{
        xtype: 'displayfield',
        fieldLabel:'Action Text',
        labelAlign: "left",
        labelSeparator: ':',
        bind : '{text}'
    },{
        xtype: 'displayfield',
        fieldLabel:'Action Type',
        labelAlign: "left",
        labelSeparator: ':',
        bind : '{type}'
    },{
        xtype: 'displayfield',
        fieldLabel:'Action By',
        labelAlign: "left",
        labelSeparator: ':',
        bind : '{user}'
    },{
        xtype: 'displayfield',
        fieldLabel:'Action Date',
        labelAlign: "left",
        labelSeparator: ':',
        bind : '{date}'
    },{
        xtype: 'gridpanel',
        bind : {
            store: '{actionData}'
        },
        flex:2,
        columns: [
            {text: 'Affected Field', flex: 1, sortable: true, dataIndex: 'affectedfield', renderer : 'renderFieldName'},
            {text: 'Old Value', flex: 1, sortable: true, dataIndex: 'oldvalue'},
            {text: 'New Value', flex: 1, sortable: true, dataIndex: 'newvalue'}
        ]
    }]
});

