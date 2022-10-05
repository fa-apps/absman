
Ext.define('AbsMan.view.admin.category.GroupEntitledModel', {
    extend: 'Ext.app.ViewModel',

    alias: 'viewmodel.groupentitledpanel',


    formulas : {

        removeDisabled: {

            bind: {
                bindTo: '{allocatedGrid.selection}',
                deep: true
            },
            get :function(selection) {
                return  !(selection && !this.get('isReadOnly'));
            }
        },
        addDisabled: {

            bind: {
                bindTo: '{availableGrid.selection}',
                deep: true
            },
            get :function(selection) {
                return  !(selection && !this.get('isReadOnly'));
            }
        }
    },

    stores: {

        allocatedData: {

            autoLoad: false,
            autoSync: false,

            pageSize: 0,
            model: 'admin.category.Entitled.GroupAllocated',
            groupField: 'year',
            groupDir: 'desc',

            sorters: ['validfrom','validto']

        },

        availableData: {

            autoLoad: false,
            autoSync: false,

            pageSize: 0,
            model: 'admin.category.Entitled.GroupAvailable',
            groupField: 'year',
            groupDir: 'desc',

            sorters: ['validfrom','validto'],

            listeners: {
                load: 'onEntitledLoad'
            }

        }
    }



});