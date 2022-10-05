Ext.define('AbsMan.view.request.AbsenceModel', {
    extend: 'Ext.app.ViewModel',

    alias: 'viewmodel.abs-req',

    formulas : {

        currentRecord: {
            get: function (get) {
                return get('formData').getAt(0);
            }
        },

        leftToDistributeText: {

            bind: '{totalRemaining}',
            get: function (val) {
                return val != 0 ? "( " + (val < 0 ? "+" : "-") + " " + Math.abs(val) + " )" : "";
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

        totalRemaining: {
            bind: {
                total: '{totalRequest}',
                entitled: '{totalEntitled}',
                other: '{totalOther}'
            },
            get: function (val) {
                return val.total - val.entitled - val.other;
            }
        },

        submitButtonText: {
            bind: '{requestIsValid}',
            get: function (val) {
                return val ? "Submit Request Now" : "Can't Submit Request";
            }
        },

        submitButtonIconCls: {
            bind: '{requestIsValid}',
            get: function (val) {
                return val ? "fa fa-angle-double-right" : "fa fa-exclamation";
            }
        },

        startIsNonWorkingDay: {
            bind: {
                bindTo: '{currentRecord}',
                deep: true
            },
            get: function (val) {
                return val.get("workingDays")[Ext.Date.format(val.get('leavedate'), "w")] == "0";
            }
        },

        endIsNonWorkingDay: {
            bind: {
                bindTo: '{currentRecord}',
                deep: true
            },
            get: function (val) {
                return val.get("workingDays")[Ext.Date.format(val.get('returndate'), "w")] == "0";
            }
        },

        categorySelected: {

            bind: {
                bindTo: '{confirmGrid.selection}',
                deep: true
            },
            get: function (selection) {
                return selection && (selection.get("categoryId") == "publicDayId" || selection.get("categoryId") == "nonWorkingDayId") ? true : !selection;
            }
        },



        requestListUser: {
            bind: {
                bindTo: '{currentRecord}',
                deep: true
            },
            get: function (rec) {
                return  rec.get("userid") == userId ? "My" : rec.get("username") ;
            }
        },

        listPendingPreference: {
            get: function (get) {
                var rec = get('userPreference').findRecord("name", "user.listPending");
                return rec ? rec.get("value") === "true" : false;
            }
        }
    },


    stores: {

        formData: {

            autoLoad: false,
            autoSync: false,

            pageSize: 0,
            model: 'request.Absence',

            listeners: {
                update: 'onFormStoreUpdate'
            }

        },

        entitledCategory: {

            autoLoad: false,
            autoSync: false,

            pageSize: 0,
            model: 'request.EntitledCategory',

            listeners: {
                update: 'checkForm'
            }

        },


        otherCategory: {

            autoLoad: false,
            autoSync: false,

            pageSize: 0,
            model: 'request.OtherCategory',

            listeners: {
                update: 'checkForm'
            }

        },

        leavingTime: {

            fields: [
                {name: 'value', type: 'number'},
                {name: 'text', type: 'string'}
            ]
        },

        returnTime: {

            fields: [
                {name: 'value', type: 'number'},
                {name: 'text', type: 'string'}
            ]
        },

        confirmStore: {

            autoLoad: false,
            autoSync: false,
            fields: [
                {name: "id", type: 'string'},
                {name: 'name', type: 'string'},
                {name: 'categoryId', type: 'string'},
                {name: 'categoryType', type: 'string'},
                {name: 'justification', type: 'string'},
                {name: 'date', type: 'date'},
                {name: 'quantity', type: 'number'}
            ]
        },

        hCalendarRequests: {

            autoLoad: false,
            autoSync: false,
            model: 'ux.HCalendar'

        }
    },

    data : {

        totalRequest : 0,
        totalEntitled: 0,
        totalOther: 0,
        requestIsValid: false,

        scrollBarWidth : 0,
        otherScrollBarIsVisible : false,
        entitledScrollBarIsVisible : false,

        requestUser: "",
        requestUserId : "",

        hCalSelectedRequest: {}
    }

});