Ext.define('AbsMan.view.request.Pending', {
    extend: 'Ext.tab.Panel',
    xtype: 'pending-req',


    requires: [
        'AbsMan.view.request.RequestList',
        'AbsMan.view.request.PendingModel',
        'AbsMan.view.request.PendingController'
    ],
    viewModel: {
        type: 'pending'
    },

    controller: 'pending',


    iconCls: 'fa fa-exclamation',
    frame: false,
    title: 'Pending Actions',
    closable: true,


   // todo show as backup approver
    items: [
      /*  {
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            defaults: {


            },
            items: [
                {
                    xtype: 'dataview',
                    flex:1,
                    tpl: [
                        '<ul class="pending-type-panel">',
                        '<tpl for=".">',
                        '<li class="{pendingType} selected">{PendingCount} {pendingText}</li>',
                        '</tpl>',
                        '</ul>'
                    ],
                    itemSelector: "pending-type-panel",
                    listeners: {
                        click: {
                            element: 'el',
                            fn: "selectPendingType"
                        }
                    },
                    bind: {
                        store: '{pendingData}'
                    }
                }
            ]
        }, */
        {
            itemId: "requestListId",
            xtype: "requestlist",
            minHeight: 250,
            scrollable: true,
            listType: 'pending',
            flex:1,
            title: "Approver pending actions",
            bind: {
                title: "Approver pending actions ({currentRecord.approver})"
            }
        },{
            itemId: "standinRequestListId",
            xtype: "requestlist",
            minHeight: 250,
            scrollable: true,
            listType: 'standin-pending',
            flex:1,
            title: "Stand-In Approver pending actions",
            bind: {
                title: "Stand-In Approver pending actions ({currentRecord.standIn})"
            }
        },{
            itemId: "substituteRequestListId",
            xtype: "requestlist",
            minHeight: 250,
            scrollable: true,
            listType: 'substitute-pending',
            flex:1,
            title: "Substitute pending actions",
            bind: {
                title: "Substitute pending actions ({currentRecord.substitute})"
            }
        },{
            itemId: "notifiedRequestListId",
            xtype: "requestlist",
            minHeight: 250,
            scrollable: true,
            listType: 'notified',
            flex:1,
            title: 'Notified actions'
        }
    ]


});




