Ext.define('AbsMan.view.request.RequestDetailsController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.request-details',


    init: function () {

        var me = this.getView();

        this.formStore = me.getViewModel().getStore("formData");
        this.entitledStore = me.getViewModel().getStore("entitledCategory");
        this.otherStore = me.getViewModel().getStore("otherCategory");
        this.requestId = me.itemId.substr(-32);
        this.usedCategoriesStore = me.getViewModel().getStore("usedCategories");
        this.hCalendarRequestsStore = me.getViewModel().getStore("hCalendarRequests");
        this.requestHistoryStore = me.getViewModel().getStore("requestHistory");

        this.selectedHCalendarItem = null;
        this.currentHCalDetailBox = null;
        this.hCalendarTooltip = me.down("#hCalendarTooltipId");
        this.hCalendarRequest = me.down("#hCalendarRequestId");
        this.hCalendar = me.down('#hcalendarId');
        this.hCalendarDetailTimeout = null;

        this.confirmPanel = me.down("#confirmPanelId");


        this.loadForm();


    },


    loadForm: function () {

        this.resetProxy();
        this.formStore.load({
            scope: this,
            callback: function (records, operation, success) {

                var response = Ext.JSON.decode(operation.getResponse().responseText),
                    record = records[0];

                if (!success) {

                    if (response.reason == "NOT_AUTHORIZED") {

                        this.getView().close();
                    }

                    AbsMan.util.mess(response.mess || "Error during load operation.", AbsMan.util.ERROR);

                } else {

                    this.entitledStore.loadData(response.data.entitleds);
                    var eTot = 0;
                    this.entitledStore.each(function (item) {
                        eTot += item.get("taken");
                    });
                    this.getViewModel().set("totalEntitled", eTot);


                    this.otherStore.loadData(response.data.others);
                    if (response.data.publicDays.count) {

                        var publicDaysText = "",
                            publicDayCount = 0;

                        Ext.Array.each(response.data.publicDays, function (publicDay) {
                            publicDaysText += publicDay.name + "\n";
                            publicDayCount += publicDay.length === 0 ? 1 : 0.5;
                        }, this);

                        this.otherStore.insert(0, {
                            id: "publicDayId",
                            name: "Public Days",
                            taken: publicDayCount,
                            justification: publicDaysText
                        });

                    }
                    var oTot = 0;
                    this.otherStore.each(function (item) {
                        oTot += item.get("taken");
                    });
                    this.getViewModel().set("totalOther", oTot);
                    this.getViewModel().set('currentRecord', record);
                    this.getViewModel().set('requesterId', record.get('userid'));

                    this.hCalendarRequestsStore.setData(response.data.hcalendar.requests);

                    this.hCalendar.load(response.data.hcalendar);

                    this.requestHistoryStore.loadData(response.data.history);
                    this.usedCategoriesStore.loadData(response.data.usedcategories);

                    this.loadRequestList()


                }

            }
        });

    },


    checkNeedReload: function () {

        var formStore = this.formStore;


        if (formStore.isLoaded()) {

            Ext.Ajax.request({
                scope: this,
                url: formStore.getProxy().baseUrl + 'checkform/' + this.getViewModel().get('currentRecord.userid'),
                params: {
                    entitledlastupdate: this.getViewModel().get('currentRecord.entitledlastupdate'),
                    requestlastupdate: this.getViewModel().get('currentRecord.lastupdate'),
                    absRequest: this.requestId,
                    requestListLastUpdate: this.getView().down("requestlist").getController().lastUpdate
                },
                success: function (response) {

                    var responseData = Ext.JSON.decode(response.responseText);

                    if (responseData.success) {

                        if (responseData.data.outdated === true) {


                            AbsMan.util.mess("Reloading, the form values are out of date.", AbsMan.util.INFO);
                            this.loadForm();
                            this.loadRequestList()


                        }

                    } else {

                        AbsMan.util.mess(responseData.mess || "Error during check for need reload operation", AbsMan.util.ERROR);

                    }
                },
                failure: function (batch) {

                    var response = Ext.JSON.decode(batch.getOperations()[0].getResponse().responseText);

                    AbsMan.util.mess(response.mess || "Error checking request", AbsMan.util.CRITICAL);

                }
            });
        }

    },


    loadRequestList: function() {

        var requestListView = this.getView().down("requestlist");
        if (requestListView) {

            //requestListView.getController().loadForm();

            requestListView.getController().loadFilterList();

            // console.log('load list');
        }
    },


    onActionClick: function (button, event) {

        //console.log(button.itemId);

        var vm = this.getViewModel();

        switch (button.itemId) {

            case "cancelButtonId":

                var startDate = this.getViewModel().get("currentRecord.leavedate"),
                    isPastRequest = Ext.Date.diff(new Date(), startDate, Ext.Date.DAY) < 0;

                vm.set("confirmCommentsRequired", isPastRequest);
                vm.set("confirmPanelTitle", "Please confirm request cancellation");
                vm.set("confirmLabel", (isPastRequest ? "[required]" : "[optional]") + " Comments");
                vm.set("confirmAction","cancelRequest");
                break;

            case "disapproveButtonId":

                vm.set("confirmCommentsRequired", true);
                vm.set("confirmPanelTitle", "Please comment and confirm request rejection");
                vm.set("confirmLabel", "[required] Comments");
                vm.set("confirmAction","rejectRequest");
                break;

            case "approveButtonId":

                vm.set("confirmCommentsRequired", false);
                vm.set("confirmPanelTitle", "Please comment and confirm request approval");
                vm.set("confirmLabel", "[optional] Comments");
                vm.set("confirmAction","approveRequest");
                break;

            case "ackButtonId":

                vm.set("confirmCommentsRequired", false);
                vm.set("confirmPanelTitle", "Please acknowledge your availability");
                vm.set("confirmLabel", "[optional] Comments");
                vm.set("confirmAction","ackRequest");
                break;

            case "nackButtonId":

                vm.set("confirmCommentsRequired", true);
                vm.set("confirmPanelTitle", "Please comment and confirm your unavailability");
                vm.set("confirmLabel", "[required] Comments");
                vm.set("confirmAction","nackRequest");
                break;

        }

        this.confirmPanel.show();

    },


    ackRequest: function () {


        var vm = this.getViewModel(),
            comments = vm.get("confirmComments");


        Ext.Ajax.request({
            scope: this,
            url: this.formStore.getProxy().baseUrl + 'ack/' + this.requestId,
            params: {
                confirmComments: comments
            },
            success: function (response) {

                var responseData = Ext.JSON.decode(response.responseText);

                if (responseData.success) {

                    AbsMan.util.mess(responseData.mess || "Now Acknowledged");
                    this.confirmPanel.hide();
                    this.loadForm();
                    this.loadRequestList();


                } else {

                    AbsMan.util.mess(responseData.mess || responseData.code || responseData.reason || "Error during ack operation", AbsMan.util.ERROR);

                }
            },
            failure: function (batch) {

                var response = Ext.JSON.decode(batch.getOperations()[0].getResponse().responseText);

                AbsMan.util.mess(response.mess || "Error ack request", AbsMan.util.CRITICAL);

            }
        });
    },


    nackRequest: function () {


        var vm = this.getViewModel(),
            comments = vm.get("confirmComments");


        Ext.Ajax.request({
            scope: this,
            url: this.formStore.getProxy().baseUrl + 'nack/' + this.requestId,
            params: {
                confirmComments: comments
            },
            success: function (response) {

                var responseData = Ext.JSON.decode(response.responseText);

                if (responseData.success) {

                    AbsMan.util.mess(responseData.mess || "Not Acknowledged");
                    this.confirmPanel.hide();
                    this.loadForm();
                    this.loadRequestList();


                } else {

                    AbsMan.util.mess(responseData.mess || "Error during nack operation", AbsMan.util.ERROR);

                }
            },
            failure: function (batch) {

                var response = Ext.JSON.decode(batch.getOperations()[0].getResponse().responseText);

                AbsMan.util.mess(response.mess || "Error nack request", AbsMan.util.CRITICAL);

            }
        });
    },


    rejectRequest: function () {


        var vm = this.getViewModel(),
            comments = vm.get("confirmComments");

        console.log(comments);

        Ext.Ajax.request({
            scope: this,
            url: this.formStore.getProxy().baseUrl + 'reject/' + this.requestId,
            params: {
                confirmComments: comments
            },
            success: function (response) {

                var responseData = Ext.JSON.decode(response.responseText);

                if (responseData.success) {

                    AbsMan.util.mess(responseData.mess || "Now Disapproved");
                    this.confirmPanel.hide();
                    this.loadForm();
                    this.loadRequestList();

                } else {

                    AbsMan.util.mess(responseData.mess || responseData.code || responseData.reason || "Error during reject operation", AbsMan.util.ERROR);

                }
            },
            failure: function (batch) {

                var response = Ext.JSON.decode(batch.getOperations()[0].getResponse().responseText);

                AbsMan.util.mess(response.mess || "Error rejecting request", AbsMan.util.CRITICAL);

            }
        });

        /*
         */

    },


    cancelRequest: function () {


        var vm = this.getViewModel(),
            comments = vm.get("confirmComments");

        Ext.Ajax.request({
            scope: this,
            url: this.formStore.getProxy().baseUrl + 'cancel/' + this.requestId,
            params: {
                confirmComments: comments
            },
            success: function (response) {

                var responseData = Ext.JSON.decode(response.responseText);

                if (responseData.success) {

                    AbsMan.util.mess(responseData.mess || "Now Canceled");
                    this.confirmPanel.hide();
                    this.loadForm();
                    this.loadRequestList();

                } else {

                    AbsMan.util.mess(responseData.mess || responseData.code || responseData.reason || "Error during cancel operation", AbsMan.util.ERROR);

                }
            },
            failure: function (batch) {

                var response = Ext.JSON.decode(batch.getOperations()[0].getResponse().responseText);

                AbsMan.util.mess(response.mess || "Error canceling request", AbsMan.util.CRITICAL);

            }
        });
    },


    approveRequest: function () {


        var vm = this.getViewModel(),
            comments = vm.get("confirmComments");


        Ext.Ajax.request({
            scope: this,
            url: this.formStore.getProxy().baseUrl + 'approve/' + this.requestId,
            params: {
                confirmComments: comments
            },
            success: function (response) {

                var responseData = Ext.JSON.decode(response.responseText);

                if (responseData.success) {

                    AbsMan.util.mess(responseData.mess || "Now Approved");
                    this.confirmPanel.hide();
                    this.loadForm();
                    this.loadRequestList();


                } else {

                    AbsMan.util.mess(responseData.mess || responseData.code || responseData.reason || "Error during approve operation", AbsMan.util.ERROR);

                }
            },
            failure: function (batch) {

                var response = Ext.JSON.decode(batch.getOperations()[0].getResponse().responseText);

                AbsMan.util.mess(response.mess || "Error approve request", AbsMan.util.CRITICAL);

            }
        });

        /*
         */

    },


    onHCalendarOver: function (event) {

        var isTarget = Ext.get(event.target).parent("TD");

        if (isTarget) {

            var target = isTarget.down("DIV");


            if (target != this.selectedHCalendarItem && this.selectedHCalendarItem) {

                // console.log('over',target);

                if (this.hCalendarDetailTimeout) clearTimeout(this.hCalendarDetailTimeout);

                this.hCalendarDetailTimeout = Ext.Function.defer(this.hideHCalDetailBox, 3000, this);

            }
        }
    },


    onHCalendarClose: function (panel) {

        panel.hide();
        this.removeHCalendarItemCls();
        return false;
    },


    showHCalDetailBox: function (panel, target) {

        if (this.currentHCalDetailBox) this.hideHCalDetailBox();

        this.currentHCalDetailBox = panel;

        this.selectedHCalendarItem.addCls("hcalendar-selected-date");
        this.currentHCalDetailBox.show();

        this.currentHCalDetailBox.alignTo(target.down("DIV"), 'b-t?', [0, -1], {duration: 300});
    },


    hideHCalDetailBox: function () {

        if (this.currentHCalDetailBox) this.currentHCalDetailBox.hide(true);
        this.removeHCalendarItemCls();
    },


    onRequestDetailsClick: function (event) {

        var contentPanels = this.getView().up('#tabpanels');

        contentPanels.fireEvent("newpanel", "request-details", "request-details-" + this.getViewModel().get("hCalSelectedRequest").id);

    },


    onHCalendarClick: function (event) {

        if (this.hCalendarDetailTimeout) clearTimeout(this.hCalendarDetailTimeout);

        var isTarget = Ext.get(event.target).parent("TD");

        if (isTarget) {

            var target = isTarget.down("DIV");

            //console.log('click',target);

            this.removeHCalendarItemCls();

            if (isTarget.getAttributes()["req-id"]) {

                if (target == this.selectedHCalendarItem) {

                    this.hideHCalDetailBox();
                    this.selectedHCalendarItem = null;

                } else {

                    this.selectedHCalendarItem = target;

                    this.getViewModel().set("hCalSelectedRequest", this.hCalendarRequestsStore.getById(isTarget.getAttributes()["req-id"]).getData());

                    this.showHCalDetailBox(this.hCalendarRequest, target);
                }

                //console.log(this.getViewModel().get("hCalSelectedRequest"));


            }

        }
    },


    removeHCalendarItemCls: function () {

        if (this.selectedHCalendarItem) this.selectedHCalendarItem.removeCls("hcalendar-selected-date");
    },


    justificationRenderer: function (value) {

        return value.replace(/\n/g, "<br/>");
    },


    resetProxy: function () {

        this.formStore.getProxy().url = this.formStore.getProxy().baseUrl + 'view/' + this.requestId;
    },


    showHistoryDetails: function (event, element) {


        if (event.target.className == "more-button") {

            var morePanel = Ext.get(event.target).up().next(),
                idType = morePanel.id.split("-"),
                type = idType[0],
                id = idType[1];

            morePanel.toggleCls("more-hidden");

            if (morePanel.getHtml() == "" && id !== "dummyId" ) {

                Ext.Ajax.request({
                    scope: this,
                    url: this.formStore.getProxy().baseUrl + 'history/' + id,
                    params: {
                        actionType: type
                    },
                    success: function (response) {

                        var responseData = Ext.JSON.decode(response.responseText);

                        if (responseData.success) {

                            var details = responseData.details;

                            if (Array.isArray(details)) {

                                var html = "<ul>";
                                Ext.Array.each(details, function (detail) {
                                    html += "<li>" + detail + "</li>";
                                });
                                morePanel.setHtml(html);

                            }
                            else {

                                morePanel.setHtml(responseData.details);
                            }

                        } else {

                            AbsMan.util.mess(responseData.mess || responseData.code || responseData.reason || "Error during history details load", AbsMan.util.ERROR);
                        }
                    },
                    failure: function (response) {


                        AbsMan.util.mess(response.mess || "Server error during history details load, STATUS: " + response.status, AbsMan.util.CRITICAL);

                    }
                });

            }
        }
    },


    onWorkflowActorOver: function (ev, el, c, d) {

        var target = Ext.get(el);
        if (target.hasCls('x-tool-img')) this.showWAdetails(Ext.getCmp(target.component.id).up().down("#toolTipId"), target);

    },


    onWorkflowActorOut: function (ev, el, c) {

        var target = Ext.get(el);
        if (target.hasCls('x-tool-img')) this.hideWAdetails(Ext.getCmp(target.component.id).up().down("#toolTipId"), target);

    },


    showWAdetails: function (panel, target) {

        target.addCls('watooltip-selected');
        panel.show();
        panel.alignTo(target, 'b-t?', [10, -6]);

    },


    hideWAdetails: function (panel, target) {

        target.removeCls('watooltip-selected');
        panel.hide();

    },


    closeConfirm: function () {

        this.confirmPanel.close();
    },


    saveUserPreference: function(preference,value) {

        this.getView().up("#mainPanelId").getController().saveUserPreference("user."+preference,value);
    }

});