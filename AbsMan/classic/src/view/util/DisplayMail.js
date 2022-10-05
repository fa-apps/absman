
Ext.define('AbsMan.view.util.DisplayMail', {
    extend: 'Ext.window.Window',
    xtype: 'display-email-panel',

    xrequires: [

        'AbsMan.view.util.MessController',
        'AbsMan.view.util.MessModel'
    ],

    viewModel: {
        type: 'display-email-panel'
    },

    controller: 'display-email-panel',

    layout: {
        type: 'vbox',
        align: 'stretch'
    },


    listeners: {

    },

    title: '',
    bodyPadding: 10,
    width: 900,
    height: 400,
    modal: true,
    animate: true,
    animateTarget: null,

    items: [{
        xtype: 'container',
        margin: '10 0 10 0',
        layout: 'hbox',
        items: [{
            xtype: 'textfield',
            fieldLabel: 'Select user',
            width: 350,
            reference : 'pickUserSearchText',
            enableKeyEvents : true,
            listeners: {
                specialkey: 'onSpecialKey',
                keyup: 'onKeyUp'
            }
        }, {
            xtype: 'button',
            text: 'Search...',
            handler: 'onSearchClick',
            margin: '0 0 0 10'
        },{
            flex: 1
        },{
            xtype: 'button',
            text: 'Select',
            handler: 'onSelectClick',
            margin: '0 0 0 10',
            width: 150,
            bind: {
                disabled: '{!currentUser}'
            }
        }]
    },{
        xtype: 'gridpanel',
        reference: 'userPickGrid',
        iconCls: 'fa fa-user',
        selModel: {
            mode: 'SINGLE'
        },
        bind: {
            store: '{userData}',
            title: '{currentUser.name}'
        },
        listeners: {
            itemdblclick : 'onSelectClick'
        },
        columns: [
            {header: 'Number', flex:.7, sortable: true, dataIndex: 'number'},
            {header: 'Title', flex:.5, sortable: true, dataIndex: 'title'},
            {header: 'Last Name', flex: 1.4, sortable: true, dataIndex: 'last'},
            {header: 'First Name', flex: 1.4, sortable: true, dataIndex: 'first'},
            {header: 'Email', flex: 1, sortable: true, dataIndex: 'email'},
            {header: 'Country', flex: 1, sortable: true, dataIndex: 'country'},
            {header: 'Entity', flex: 1, sortable: true, dataIndex: 'company'}
        ],
        forceFit : true,
        flex: 1,
        scrollable: true,
        reserveScrollbar: true,

        dockedItems: [{
            xtype: 'pagingtoolbar',
            dock: 'bottom',
            pageSize: 10,
            displayInfo: true,
            displayMsg: 'Displaying items {0} - {1} of {2}',
            emptyMsg: "No items to display",
            plugins: 'pagesize',
            bind: {
                store: '{userData}'
            }
        }]
    }]
});