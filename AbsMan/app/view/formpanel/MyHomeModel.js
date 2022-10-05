

Ext.define('AbsMan.view.formpanel.MyHomeModel', {
    extend: 'Ext.app.ViewModel',

    alias: 'viewmodel.my-home',

    formulas: {

        currentRecord: {
            get: function (get) {
                //console.log(get('formData').getAt(0).get('notes'));
                return get('formData').getAt(0);
            }
        },

        unit: {
            bind: {
                bindTo: '{currentRecord.absenceunit}',
                deep: true
            },
            get: function (val) {
                return val == 0 ? 'Days' : 'Hours';
            }
        },

        listPendingPreference: {
            get: function (get) {
                var rec = get('userPreference') ? get('userPreference').findRecord("name", "user.listPending") : null;
                return rec ? rec.get("value") === "true" : false;
            }
        },

        daysLeft: {
            bind: {
                left: '{currentRecord.entitledLeft}',
                unit: '{currentRecord.absenceunit}'
            },
            get: function (val) {
                return val.left + " " + ( val.unit == 0 ? 'day' : 'hour' ) + ( val.left > 1 ? 's' : '');
            }

        },

        requestIsValid: {
            bind: {
                tot: '{totalRequest}',
                pds: '{publicDaysCount}',
                cat: '{usableCategories}'
            },
            get: function (val) {
                return val.tot && (val.tot != val.pds) && val.cat.length
            }
        }


    },


    stores: {

        formData: {

            autoLoad: false,
            autoSync: false,

            pageSize: 0,
            model: 'formpanel.MyHome'
        },


        entitlementData: {

            autoLoad: false,
            autoSync: false,

            pageSize: 0,
            model: 'formpanel.Entitlement'
        },


        hCalendarData: {

            autoLoad: false,
            autoSync: false,

            pageSize: 0,
            model: 'ux.HCalendar'
        },

        categoryComboData: {


            autoLoad: false,
            autoSync: false,
            fields: ['id', 'name', 'left']

        }


    },

    data: {

        requestListUser: 'My',
        hCalSelectedRequest: {},

        totalRequest: 0,
        leavedate: null,
        returndate: null,
        usableCategories: [],
        suggestedCategory: null,
        publicDaysCount: null,
        publicDays: [],
        totalEntitledDays: null,

        editingProfile: false
    }

});