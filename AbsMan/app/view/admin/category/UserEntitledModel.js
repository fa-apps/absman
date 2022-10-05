
Ext.define('AbsMan.view.admin.category.UserEntitledModel', {
    extend: 'Ext.app.ViewModel',

    alias: 'viewmodel.adminuserentitled',

    formulas : {

        editDisabled: {

            bind: {
                bindTo: '{userEntitledGrid.selection}',
                deep: true
            },
            get :function(selection) {

                return !(selection && !this.get('isReadOnly') && !selection.dirty);

            }
        }
    },


    stores: {

        subFormData: {

            autoLoad: false,
            autoSync: false,

            pageSize: 0,
            model: 'admin.category.EntitledUser',
            groupField: 'year',
            groupDir: 'desc',

            sorters: ['validfrom','validto'],

            listeners: {
                beforeload: 'resetProxy',
                load: 'onStoreUpdate',
                update: 'onStoreUpdate'
            }

        }
    }

});