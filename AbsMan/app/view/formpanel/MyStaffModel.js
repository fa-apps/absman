

Ext.define('AbsMan.view.formpanel.MyStaffModel', {
    extend: 'Ext.app.ViewModel',

    alias: 'viewmodel.my-staff',

    formulas : {

        currentRecord: {
            get: function (get) {
                return get('groupData').getAt(0);
            }
        },


        listPendingPreference: {
            get: function (get) {
                var rec = get('userPreference') ? get('userPreference').findRecord("name", "myStaff.listPending"): null;
                return rec ? rec.get("value") === "true" : false;
            }
        }

    },



    stores: {

        groupData: {

            autoLoad: false,
            autoSync: false,

            pageSize: 0,
            model: 'formpanel.EmpGroup'
        },


        groupTree : {

            fields: [
                {name: 'id', type: 'string'},
                {name: 'text', type: 'string'}
            ],

            type: 'tree',
            autoLoad: false,
            autoSync: false,
            proxy: {
                type: 'rest',
                baseUrl: 'staff/group',
                url: 'staff/group',
                writer: {
                    allowSingle: true,
                    writeAllFields: true
                }
            }
        },


        gCalendarData: {

            autoLoad: false,
            autoSync: false,

            pageSize: 0,
            model: 'ux.GCalendar'
        }

    },

    data: {
        requestListUser: 'My'
    }

});