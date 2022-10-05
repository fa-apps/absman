Ext.define('AbsMan.view.appmenu.AppMenu', {
    extend: 'Ext.panel.Panel',
    xtype: 'app-menu',


    requires: [
        'AbsMan.view.appmenu.AppMenuController',
        'AbsMan.view.appmenu.AppMenuModel'
    ],

    controller: 'tree-list',

    iconCls: 'fa fa-angle-right',

    viewModel: {
        type: 'tree-list'
    },

    header: {
        listeners : {
            click: 'onToggleMicro'
        }
    },

    layout: {
        type: 'vbox',
        align: 'stretch',
        animate: true,
        style: 'z-index: 1',
        animatePolicy: {
            x: true,
            width: true
        }
    },
    cls: 'treelist-with-nav',
    border: false,
    scrollable: 'y',

    zIndex:1,
    items: [{
        xtype: 'treelist',
        ui: 'nav',
        micro: true,
        expanderFirst: false,
        highlightPath : true,
        expanderOnly: false,
        reference: 'treelist',
        bind: '{navItems}',
        listeners: {
            selectionchange: 'onAppMenuClick'
        }
    }]
});
