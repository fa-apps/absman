
Ext.define('AbsMan.view.formpanel.MyHomeController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.my-home',


    init: function () {


        this.formTimestamp = null;

        var me = this.getView();

        this.formStore = me.getViewModel().getStore("formData");
        this.entitlementStore = me.getViewModel().getStore("entitlementData");
        this.hCalendarRequestsStore = me.getViewModel().getStore("hCalendarData");
        this.categoryComboStore = me.getViewModel().getStore("categoryComboData");

        this.selectedHCalendarItem = null;
        this.currentHCalDetailBox = null;
        this.hCalendarRequest = me.down("#hCalendarRequestId");
        this.hCalendar = me.down('#hcalendarId');
        this.hCalendarDetailTimeout = null;
        this.hCalendarStartDate = null;
        this.hCalendarEndDate = null;

        this.confirmPanel = me.down("#confirmPanelId");
        this.formTimestamp = null;


        this.loadForm();

        me.on("selectuser", function (userSelection) {

            var user = userSelection[0];

            if (this.currentTarget.itemId !== 'requestUser') {

                this.currentTarget.setValue(user.get("name"));
                console.log(this.currentTarget);
                this.getView().query("#" + this.currentTarget.itemId + "Id")[0].setValue(user.get("id"));

            } else {

                this.requestUser = user.get("name");
                this.requestUserId = user.get("id");
                this.resetRequestUser();
            }
        }, this);

    },


    loadForm: function (reloading) {

        this.resetProxy();
        this.formStore.load({
            scope: this,
            callback: function (records, operation, success) {

                if (success) {

                    var response = Ext.JSON.decode(operation.getResponse().responseText);

                    this.entitlementStore.loadData(response.data.entitlements);

                    this.setEntitlementsView();

                    this.hCalendarRequestsStore.setData(response.data.hcalendar.requests);

                    this.hCalendar.load(response.data.hcalendar);

                    Ext.Function.defer(this.loadRequestList, 500, this);

                    this.formTimestamp = response.data.lastupdate;

                    if (reloading) {

                        this.getViewModel().set('currentRecord', this.formStore.getAt(0));
                        this.getView().down("#substitute").setValue(response.data.substitute);
                        this.getView().down("#notified").setValue(response.data.notified);
                    }

                } else {

                    var response = operation.getError();

                    AbsMan.util.mess(response.statusText + " (" + response.status + ")", AbsMan.util.CRITICAL);
                }

            }
        });
    },


    checkNeedReload: function () {

        if (this.formStore.isLoaded()) {

            Ext.Ajax.request({
                scope: this,
                url: this.formStore.getProxy().baseUrl + 'checkform/' + userId,
                params: {
                    formTimestamp: this.formTimestamp
                },
                success: function (responseData) {

                    var response = Ext.JSON.decode(responseData.responseText);

                    if (response.success) {

                        if (response.data.outdated === true) {

                            AbsMan.util.mess("Reloading, the form values are out of date.", AbsMan.util.INFO);

                            this.onReloadForm();
                        }

                    } else {

                        AbsMan.util.mess(response.mess || "Error during check for need reload operation", AbsMan.util.ERROR);
                    }
                },
                failure: function (response) {

                    AbsMan.util.mess(response.statusText + " (" + response.status + ")", AbsMan.util.CRITICAL);
                }
            });
        }

    },


    loadRequestList: function () {

        var requestListView = this.getView().down("requestlist");

        if (requestListView) {

            requestListView.getController().loadFilterList();
        }
    },


    resetProxy: function () {

        this.formStore.getProxy().url = this.formStore.getProxy().baseUrl + userId;
    },


    onReloadForm: function () {


        //this.getView().reset(true);
        //this.formStore.rejectChanges();
        this.loadForm(true);

    },


    /*

     HCALENDAR

     */

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

            }

            else {

                this.selectedHCalendarItem = target;

                var targetDate = Ext.Date.parse(target.parent().getAttribute("hcdate").substr(2), 'Y-m-d');

                target.date = targetDate;


                if (!this.hCalendarStartDate) {

                    this.hCalendarStartDate = target;
                    this.hCalendarEndDate = target;


                } else {


                    var diffStart = Ext.Date.diff(this.hCalendarStartDate.date, targetDate, 'd');

                    if (diffStart < 0) {

                        if (this.hCalendarStartDate == this.hCalendarEndDate) {

                            this.hCalendarEndDate = target;
                        }

                        if (this.requestIsOverlapping(targetDate, this.hCalendarEndDate.date)) {

                            this.hCalendarStartDate = null;
                            this.hCalendarEndDate = null;

                        } else {

                            this.hCalendarStartDate = target;

                        }


                    } else if (diffStart == 0) {


                        if (this.hCalendarStartDate == this.hCalendarEndDate) {

                            this.resetRequest();


                        } else {

                            this.hCalendarStartDate = target;
                            this.hCalendarEndDate = target;
                        }

                    } else {


                        if (!this.hCalendarEndDate) {

                            this.hCalendarEndDate = target;
                        }

                        var diffEnd = Ext.Date.diff(this.hCalendarEndDate.date, target.date, 'd');

                        if (diffEnd < 0) {

                            this.hCalendarEndDate = target;

                        } else if (diffEnd > 0 && !this.requestIsOverlapping(this.hCalendarStartDate.date, targetDate)) {

                            this.hCalendarEndDate = target;

                        } else {


                            this.resetRequest();
                        }
                    }
                }

                this.getViewModel().set('leavedate', this.hCalendarStartDate ? this.hCalendarStartDate.date : null);
                this.getViewModel().set('returndate', this.hCalendarEndDate ? this.hCalendarEndDate.date : null);


            }

        }
    },


    resetRequest: function () {

        var vm = this.getViewModel();

        vm.set('totalRequest', 0);
        vm.set('requestIsValid', false);
        vm.set('usableCategories', []);
        vm.set('leavedate', null);
        vm.set('returndate', null);
        vm.set('suggestedCategory', null);
        vm.set('publicDays', []);
        vm.set('publicDaysCount', null);
        vm.set('totalEntitledDays', null);
        this.hCalendarStartDate = null;
        this.hCalendarEndDate = null;
        this.categoryComboStore.removeAll();


    },


    requestIsOverlapping: function (startDate, endDate) {

        var isOverlapping = this.hCalendarRequestsStore.findBy(function (request, id) {
                return (startDate < request.get("startDate") && endDate > request.get("endDate"));
            }, this) != -1;

        if (isOverlapping)  AbsMan.util.mess("New request is overlapping over an existing request!", AbsMan.util.ERROR);

        return isOverlapping;

    },


    checkForm: function (leaveDate, retrunDate) {


        var vm = this.getViewModel();


        if (leaveDate && retrunDate) {

            Ext.Ajax.request({
                scope: this,
                url: this.formStore.getProxy().baseUrl + 'check/' + userId,
                params: {
                    leavedate: leaveDate,
                    returndate: retrunDate,
                    category: this.getView().down("#selectedCategoryId").getValue()

                },
                success: function (response) {

                    var responseData = Ext.JSON.decode(response.responseText);

                    if (responseData.success) {

                        vm.set('totalRequest', responseData.data.totalCount);
                        vm.set('suggestedCategory', responseData.data.suggestedCategory);
                        vm.set('publicDaysCount', responseData.data.publicDaysCount);
                        vm.set('publicDays', responseData.data.publicDays);
                        vm.set('totalEntitledDays', responseData.data.totalEntitledDays);
                        vm.set('usableCategories', responseData.data.usableCategories);
                        this.categoryComboStore.loadData(responseData.data.usableCategories);

                    } else {

                        AbsMan.util.mess(responseData.mess || "Error during check operation", AbsMan.util.ERROR);

                        this.resetRequest();

                    }
                },
                failure: function (batch) {

                    var response = Ext.JSON.decode(batch.getOperations()[0].getResponse().responseText);

                    AbsMan.util.mess(response.mess || "Error checking request", AbsMan.util.CRITICAL);

                }
            });

        } else {


        }

    },


    onRender: function () {

        console.log('onRender')

        this.getViewModel().set('totalRequest', this.totalRequest);
        this.getViewModel().set('scrollBarWidth', Ext.getScrollbarSize().width);

    },


    removeHCalendarItemCls: function () {

        try {

            if (this.selectedHCalendarItem) this.selectedHCalendarItem.removeCls("hcalendar-selected-date");
        }
        catch (err) {
            console.log("Can't remove cls ", this.selectedHCalendarItem);
        }
    },


    onFormChange: function (field, a) {

        var vm = this.getViewModel(),
            targetDate = field.getValue(),
            target = Ext.get(Ext.query("#" + this.getView().id + " [hcdate=d-" + Ext.Date.format(targetDate, "Y-m-d") + "]")[0]);

        this.clearInterval();

        if (target) {

            if (field.itemId == 'startDateId') {

                this.hCalendarStartDate = target.down("DIV");
                this.hCalendarStartDate.date = targetDate;
                if (!this.hCalendarEndDate) {
                    this.hCalendarEndDate = this.hCalendarStartDate;
                    vm.set('returndate', targetDate);
                }

            } else {

                this.hCalendarEndDate = target.down("DIV");
                this.hCalendarEndDate.date = targetDate;
                if (!this.hCalendarStartDate) {
                    this.hCalendarStartDate = this.hCalendarEndDate;
                    vm.set('leavedate', targetDate);
                }

            }

            target.date = targetDate;

            this.renderInterval(field.itemId, field.getValue(), target);

            this.checkForm((this.hCalendarStartDate ? this.hCalendarStartDate.date : null ), (this.hCalendarEndDate ? this.hCalendarEndDate.date : null));

        }


    },


    clearInterval: function () {

        Ext.Array.map(this.hCalendar.el.query("TD.hcalendar-selected-period"),
            function (item) {
                Ext.get(item).removeCls("hcalendar-selected-period")
            },
            this
        );
    },


    renderInterval: function (id, value, target) {

        var startDate = Ext.get(Ext.query("#" + this.getView().id + " [hcdate=d-" + Ext.Date.format(this.getViewModel().get('leavedate'), "Y-m-d") + "]")[0]),
            endDate = Ext.get(Ext.query("#" + this.getView().id + " [hcdate=d-" + Ext.Date.format(this.getViewModel().get('returndate'), "Y-m-d") + "]")[0]),
            item;

        if (id == "startDateId") {

            if (endDate) {

                item = target;

                while (endDate.next() != item) {

                    item.addCls("hcalendar-selected-period");
                    item = item.next();
                }
            }

        } else {

            if (startDate) {

                item = target;

                while (startDate.prev() != item) {

                    item.addCls("hcalendar-selected-period");
                    item = item.prev();
                }
            }
        }

    },


    saveUserPreference: function (preference, value) {

        this.getView().up("#mainPanelId").getController().saveUserPreference("user." + preference, value);
    },


    setEntitledRowClass: function (record) {

        var expired = Ext.Date.diff(record.get("validto"), new Date(), Ext.Date.DAY) > 0,
            almostExpired = Ext.Date.diff(record.get("validto"), new Date(), Ext.Date.DAY) > -60;
        return record.get('enforcevalidity') ? expired ? 'expired-validity' : almostExpired ? 'almost-expired-validity' : '' : '';

    },


    toggleEntitledDetails: function (button) {


        var sum = this.getView().down("#myEntitlementSummaryId"),
            det = this.getView().down("#myEntitlementDetailsId");

        button.pressed ? this.togglePanel(sum, det) : this.togglePanel(det, sum);


    },


    togglePanel: function (toHide, toShow) {

        toShow.show('');
        toHide.hide();

    },


    showEntitlementDetails: function (a, b, c) {

        console.log(a, b, c)
    },


    setEntitlementsView: function () {

        var maxWidth = 0;

        Ext.Array.each(Ext.query('.sum .stay'), function (col) {
            maxWidth = col.clientWidth > maxWidth ? col.clientWidth + 1 : maxWidth;
        });

        Ext.Array.each(Ext.query('.sum .stay'), function (col) {
            Ext.get(col).setWidth(maxWidth);
        });

    },


    onNewRequestClick: function (event) {

        var contentPanels = this.getView().up('#tabpanels');

        contentPanels.fireEvent("newpanel", "absence-req", "new-req", true);

    },


    onDatePickerExpand: function (dateField) {

        var startDateField = dateField.up().up().down('#startDateId'),
            endDateField = dateField.up().up().down('#endDateId'),
            startDateValue = startDateField.getValue(),
            endDateValue = endDateField.getValue();

        if (dateField.itemId == 'startDateId') {

            dateField.picker.setMaxDate(Ext.isDate(endDateValue) ? endDateValue : null);

            if (!Ext.isDate(startDateValue)) {
                dateField.setValue(endDateValue);
            }

        } else {

            if (Ext.isDate(startDateValue)) {
                dateField.picker.setMinDate(startDateValue);
            }

            if (!Ext.isDate(endDateValue)) {
                dateField.setValue(startDateValue);
            }
        }

        var absDays = Array();
        this.hCalendarRequestsStore.each(function (request) {

            var requestStartDate = request.get('startDate'),
                requestEndDate = request.get('endDate'),
                requestDate = requestStartDate;

            while (Ext.Date.diff(requestDate, requestEndDate, Ext.Date.DAY) != -1) {

                absDays.push(requestDate);
                requestDate = Ext.Date.add(requestDate, Ext.Date.DAY, 1);
            }

        }, this);

        dateField.picker.setDisabledDates(absDays);
    },


    onSimpleRequestSubmit: function () {

        var vm = this.getViewModel(),
            leaveDate = vm.get('leavedate'),
            returnDate = vm.get('returndate'),
            category = this.getView().down("#selectedCategoryId").getValue(),
            totalRequest = vm.get('totalRequest'),
            publicDaysCount = vm.get('publicDaysCount'),
            publicDays = vm.get('publicDays'),
            totalEntitledDays = vm.get('totalEntitledDays'),
            record = this.formStore.getAt(0);

        if (leaveDate && returnDate && category && totalRequest && (totalRequest != publicDaysCount) && totalEntitledDays) {

            var entitleds = [{
                    "periodStart": leaveDate,
                    "periodEnd": returnDate,
                    "periodQuantity": totalEntitledDays,
                    "categoryId": category
                }],
                publicDaysIds = [];


            Ext.Array.each(publicDays, function (publicDay) {
                publicDaysIds.push(publicDay.id);
            }, this);


            Ext.Ajax.request({
                scope: this,
                url: this.formStore.getProxy().baseUrl + 'submit/' + userId,
                params: {
                    entitleds: Ext.JSON.encode(entitleds),
                    others: Ext.JSON.encode([]),
                    publicdaysids: Ext.JSON.encode(publicDaysIds),
                    leavedate: leaveDate,
                    returndate: returnDate,
                    leavetime: 0,
                    returntime: 0,
                    approverid: record.get('approverid'),
                    standinapproverid: record.get('standinapproverid'),
                    substituteid: record.get('substituteid'),
                    notifiedid: record.get('notifiedid'),
                    workflowid: record.get('workflowid'),
                    totalrequest: totalRequest
                },
                success: function (response) {

                    var responseData = Ext.JSON.decode(response.responseText);

                    if (responseData.success) {

                        this.getView().up("content-panels").fireEvent("newpanel", "request-details", "request-details-" + responseData.data.newRequestId);
                        this.resetRequest();

                        AbsMan.util.mess(responseData.mess || "Request sent successfully!", AbsMan.util.INFO);

                    } else {

                        AbsMan.util.mess(responseData.mess || responseData.code || responseData.reason || "Error during submit operation", AbsMan.util.ERROR);

                    }
                },
                failure: function (batch) {

                    var response = Ext.JSON.decode(batch.getOperations()[0].getResponse().responseText);

                    AbsMan.util.mess(response.mess || "Error submitting request", AbsMan.util.CRITICAL);
                }
            });
        }
    },


    onPendingPanelClick: function() {

       this.getView().up('#tabpanels').fireEvent("newpanel", "pending-req","pending-req", true);


    },

    onEditProfile : function(button) {

        var vm = this.getViewModel();

        vm.set('editingProfile', !vm.get('editingProfile'));

        switch (button.itemId) {

            case "cancelProfileId":
                this.formStore.rejectChanges();
                this.getView().down("#substitute").setValue(vm.get('currentRecord.substitute'));
                this.getView().down("#notified").setValue(vm.get('currentRecord.notified'));

                break;

            case "saveProfileId":
                this.saveUserProfile();
                break;
        }

    },

    saveUserProfile: function() {

        var vm = this.getViewModel();

        Ext.Ajax.request({
            scope: this,
            method: "PUT",
            url: this.formStore.getProxy().baseUrl + 'profile/' + userId,
            params: {
                notes: vm.get('currentRecord.notes'),
                substitute: vm.get('currentRecord.substituteid'),
                notified: vm.get('currentRecord.notifiedid')
            },
            success: function (responseData) {

                var response = Ext.JSON.decode(responseData.responseText);

                if (response.success) {

                    AbsMan.util.mess(response.mess || "Saved!", AbsMan.util.INFO);

                } else {

                    AbsMan.util.mess(response.mess || "Error during profile save operation", AbsMan.util.ERROR);
                }
            },
            failure: function (response) {

                AbsMan.util.mess(response.statusText + " (" + response.status + ")", AbsMan.util.CRITICAL);
            }
        });




    },


    selectUser: function (user) {

        var newTitle = user.itemId == 'requestUser' ? "Please select Employee for the new request: " : "Please select: " + user.getFieldLabel();

        this.currentTarget = user;

        var userSelection = new AbsMan.view.util.PickUser({
            allowMultiple: false,
            opener: this.getView(),
            openerEvent: "selectuser",
            title: newTitle
        });

        userSelection.show();

    }

});