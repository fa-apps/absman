
Ext.define('AbsMan.view.admin.category.GroupPublicDayModel', {
    extend: 'Ext.app.ViewModel',

    alias: 'viewmodel.grouppublicdaypanel',


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
            model: 'admin.category.PublicDay.GroupAllocated',
            groupField: 'year',
            groupDir: 'desc',

            sorters: ['date']

        },

        availableData: {

            autoLoad: false,
            autoSync: false,

            pageSize: 0,
            model: 'admin.category.PublicDay.GroupAvailable',
            groupField: 'year',
            groupDir: 'desc',

            sorters: ['date'],

            listeners: {
                load: 'onPublicDayLoad'
            }

        }
    }



});