/**
 * The main application class. An instance of this class is created by app.js when it
 * calls Ext.application(). This is the ideal place to handle application launch and
 * initialization details.
 */
Ext.define('AbsMan.Application', {
    extend: 'Ext.app.Application',
    
    name: 'AbsMan',


    requires: [
        'AbsMan.view.request.Absence',
        'AbsMan.view.admin.AdminMain',
        'AbsMan.view.request.Pending',
        'AbsMan.view.request.StaffRequests',
        'AbsMan.view.formpanel.MyStaff',
        'AbsMan.view.main.Notification'
    ],


    controllers : [
        'Navigation'
    ],

    stores: [
        'AbsMan.store.Notification'
    ],

    defaultToken : 'tabpanels',

    init: function () {

        Ext.get(window).on('beforeunload', this.onBeforeUnload, this, {normalized: false}); //todo test normalized & firefox

    },


    onBeforeUnload: function () {

        var notifications = Ext.Array.map(AbsMan.getApplication().getStore("Notification").getData().items,
            function (item) {
                var res = item.data;
                res.id = null;
                return res;
            }, this );

        sessionStorage.setItem("notificationProxyId", Ext.JSON.encode(notifications));

    },


    launch: function () {

        //console.log(userId);

        //console.log(Ext.JSON.decode(sessionStorage.getItem("notificationProxyId")));

        var notifData = sessionStorage.getItem("notificationProxyId");

        if (notifData) AbsMan.getApplication().getStore("Notification").setData(Ext.JSON.decode(notifData));

        Ext.Ajax.on('requestcomplete', function (conn, serverResponse, options) {

            //console.log(serverResponse);

            var response = Ext.JSON.decode(serverResponse.responseText);
            if (!response.success && response.code == "SESSION_IDLE_TIMEOUT") {
                window.location.reload();
            }
        });


        AbsMan.formRoutes = {
            cou: 'admincountry-panel',
            com: 'admincompany-panel',
            gro: 'admingroup-panel',
            pub: 'publicday-detailspanel',
            ent: 'entitled-detailspanel',
            lea: 'leave-detailspanel',
            use: 'adminuser-panel',
            ued: 'user-entitled-details-panel'
        };

        AbsMan.subFormRoutes = {
            ent: 'company-entitled-panel',
            lea: 'company-leave-panel',
            pub: 'company-publicday-panel',
            mem: 'group-members-panel',
            gep: 'group-entitled-panel',
            glp: 'group-leave-panel',
            gpd: 'group-publicday-panel',
            mbs: 'user-membership-panel',
            uep: 'user-entitled-panel',
            ulp: 'user-leave-panel',
            upd: 'user-publicday-panel',
            adm: 'admins-panel'
        };

        AbsMan.util = {

            INFO: 0,
            WARNING: 1,
            ERROR: 2,
            CRITICAL: 3,
            alertOnSeverity: [false, true, true, true],
            messConfig: [
                {
                    iconCls: 'fa fa-thumbs-o-up',
                    title: 'Success.',
                    icon: Ext.MessageBox.INFO
                }, {
                    iconCls: 'fa fa-warning color-orange',
                    title: 'Warning.',
                    icon: Ext.MessageBox.WARNING
                }, {
                    iconCls: 'fa fa-thumbs-o-down color-red',
                    title: 'Failure!',
                    icon: Ext.MessageBox.ERROR
                }, {
                    iconCls: 'fa fa-close color-red',
                    title: 'Critical!',
                    icon: Ext.MessageBox.ERROR
                }

            ],

            mess: function (message, severity, doNotAlert) {

                severity = severity || AbsMan.util.INFO;

                Ext.Function.defer(function () {

                    Ext.toast({
                        html: message,
                        align: 'tr',
                        iconCls: AbsMan.util.messConfig[severity].iconCls,
                        title: AbsMan.util.messConfig[severity].title,
                        width: 360,
                        style: {
                            borderColor: 'grey'
                        }
                    });

                }, 10, this, [message, severity]);


                if (AbsMan.util.alertOnSeverity[severity] && !doNotAlert) {
                    Ext.MessageBox.show({
                        title: AbsMan.util.messConfig[severity].title,
                        msg: message,
                        buttons: Ext.MessageBox.OK,
                        icon: AbsMan.util.messConfig[severity].icon
                    });
                }

                var notificationStore = AbsMan.getApplication().getStore("Notification");

                notificationStore.add({
                    date: Ext.Date.format(new Date(), "Y-m-d H:i:s"),
                    severity: Ext.JSON.encode(AbsMan.util.messConfig[severity]),
                    text: message
                });

                //console.log(notificationStore.getData().items, new Date());

            },

            elapsed: function (date) {

                // console.log(date);

                var diff = Ext.Date.diff(Ext.Date.clearTime(date, true), new Date(), Ext.Date.DAY);

                return diff > 1 ? diff + " days ago" : diff == 0 ? "today" : "yesterday";
            },



            getUserPreference: function (preference) {

                console.log(preference);

            }
        }
    },

    onAppUpdate: function () {

        Ext.Msg.confirm('Application Update', 'This application has an update, reload?',
            function (choice) {
                if (choice === 'yes') {
                    window.location.reload();
                }
            }
        );
    },


});
