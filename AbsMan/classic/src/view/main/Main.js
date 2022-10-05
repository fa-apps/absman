
Ext.define('AbsMan.view.main.Main', {
    extend: 'Ext.panel.Panel',
    xtype: 'layout-border',

    requires: [

        'AbsMan.view.main.MainController',
        'AbsMan.view.main.MainModel',
        'AbsMan.view.main.User',
        'AbsMan.view.appmenu.AppMenu'
    ],

    controller: 'main',
    viewModel: {
        type: 'main'
    },

    itemId: "mainPanelId",
    layout: 'border',
    bodyBorder: false,

    defaults: {
        //collapsible: true,
        bodyPadding: 10
    },
    ui: 'navigation',
    items: [{
        region: 'north',
        header : false,
        title: 'Absence Management',
        height: 45,
        cls : 'banner-bg',
        bodyStyle: 'background: transparent;',
        layout: {
            type: 'hbox',
            pack: 'start',
            align: 'stretch'
        },
        defaults: {
            bodyStyle: 'background: transparent;',
            bodyPadding : 0
        },
        items : [{
            width: 350,
            html: 'Absence Management',
            bodyCls: 'top-banner-logo'
        },{ flex: 1 },{
            xtype: 'top-user-panel'
        }]
    }/*,
    {
        title: 'Footer',
        region: 'south',
        height: 180,
        minHeight: 75,
        maxHeight: 150,
        html: '<p>Footer content</p>',
        split: true,
        collapsed: true
    }*/,
    {
        title: ' ',
        region:'west',
        width: 44,
        minWidth: 44,
        maxWidth: 240,
        xtype:'app-menu',
        bodyPadding: 0,
        split: false,
        collapsible: false
    },
    {
        title: ' ',
        header: false,
        split: true,
        region: 'center',
        xtype: 'content-panels'

    }]

});

