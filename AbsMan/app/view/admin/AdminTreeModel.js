
Ext.define('AbsMan.view.admin.AdminTreeModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.admintree',



    stores: {

        adminTreeStore: {

            fields: [
                { name: 'id', type: 'string' },
                { name: 'name', type: 'string' },
                { name: 'type', type: 'string' },
                { name: 'editable', type: 'boolean' }
            ],
            type: 'tree',

            autoLoad: true,
            autoSync: false,

            proxy: {
                type: 'rest',
                url: 'admin/favorite',
                baseUrl: 'admin/favorite'
            }
        }
    }
});