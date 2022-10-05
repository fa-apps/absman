
Ext.define('AbsMan.view.main.Content', {
    extend: 'Ext.tab.Panel',
    xtype: 'content-panels',

    controller: 'content-panel',

    requires: [
        'AbsMan.view.main.ContentController',
        'AbsMan.view.formpanel.MyHome',
        'Ext.ux.TabReorderer'
    ],

    plugins: 'tabreorderer',

    itemId: 'tabpanels',
    activeItem : 0,
    resizeTabs: true,
    collapsible: false,
    minTabWidth: 105,
    tabWidth: 135,
    margin: '0 0 0 0',

    enableTabScroll: true,
    border: 0,
    items: [{
        xtype: 'my-home',
        itemId: 'HomePanelId',
        closable : false
    }]

});