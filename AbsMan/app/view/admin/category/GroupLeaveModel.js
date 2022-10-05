
Ext.define('AbsMan.view.admin.category.GroupLeaveModel', {
    extend: 'Ext.app.ViewModel',

    alias: 'viewmodel.groupleavepanel',


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
            model: 'admin.category.Leave.GroupAllocated',
            groupField: 'year',
            groupDir: 'desc',

            sorters: ['orderby']

        },

        availableData: {

            autoLoad: false,
            autoSync: false,

            pageSize: 0,
            model: 'admin.category.Leave.GroupAvailable',
            groupField: 'year',
            groupDir: 'desc',


            sorters: ['orderby'],

            listeners: {
                load: 'onLeaveLoad'
            }

        }
    }



});