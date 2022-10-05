
Ext.define('AbsMan.view.admin.AdminContent', {
    extend: 'Ext.tab.Panel',
    xtype: 'admin-panels',

    requires: [
		'AbsMan.view.admin.AdminContentController',
        'AbsMan.view.admin.AdminCountry',
        'AbsMan.view.admin.AdminCompany',
        'AbsMan.view.admin.AdminGroup',
        'AbsMan.view.admin.AdminUser',
        'Ext.ux.TabReorderer'
    ],

    plugins: 'tabreorderer',

    controller: 'admincontent',

    defaults: {
        bodyPadding: 10
    },

    itemId: 'adminpanels',
    activeItem : 0,
    maxTabWidth: 200,
    resizeTabs: true,
    collapsible: false,
    enableTabScroll: true,
    border: false,
    items: {
        title: 'Admin Home',
        iconCls : 'x-fa fa-gears',
        itemId: 'adminhometab',
        closable : false,
        html: '<h2>Main Admin</h2><p>TODO: last actions, most frequented, search,</p>'


    }

});