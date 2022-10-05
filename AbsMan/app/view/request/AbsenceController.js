Ext.define('AbsMan.view.request.AbsenceController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.abs-req',

    init: function () {

        var me = this.getView();

        this.entitledStore = me.getViewModel().getStore("entitledCategory");
        this.otherStore = me.getViewModel().getStore("otherCategory");
        this.formStore = me.getViewModel().getStore("formData");
        this.confirmStore = me.getViewModel().getStore("confirmStore");
        this.hCalendarRequestsStore = me.getViewModel().getStore("hCalendarRequests");
        this.totalRequest = 0;
        this.totalEntitled = 0;
        this.totalOther = 0;
        this.unusableCategories = [];
        this.confirmCategories = [];
        this.sortedConfirmCategories = [];
        this.currentConfirmCategory = [0, 0, 0, 0];
        this.currentGridEditorContextRecord = {};

        this.others = null;
        this.entitleds = null;
        this.publicDays = null;
        this.workingDays = null;
        this.context = null;

        this.currentTarget = null;
        this.requestUser = userDisplayName;
        this.requestUserId = userId;
        this.resetRequestUser();

        this.selectedHCalendarItem = null;
        this.hCalendarStartDate = null;
        this.hCalendarEndDate = null;
        this.currentHCalDetailBox = null;
        this.hCalendarTooltip = me.down("#hCalendarTooltipId");
        this.hCalendarRequest = me.down("#hCalendarRequestId");
        this.hCalendar = me.down('#hcalendarId');
        this.hCalendarDetailTimeout = null;

        this.confirmPanel = me.down("#confirmPanelId");

        me.on("selectuser", function (userSelection) {

            var user = userSelection[0];

            if (this.currentTarget.itemId !== 'requestUser') {

                this.currentTarget.setValue(user.get("name"));
                this.getView().query("#" + this.currentTarget.itemId + "Id")[0].setValue(user.get("id"));

            } else {

                this.requestUser = user.get("name");
                this.requestUserId = user.get("id");
                this.resetRequestUser();
            }
        }, this);

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

    },


    resetRequestUser: function () {

        this.getViewModel().set('requestUser', this.requestUser);
        this.getViewModel().set('requestUserId', this.requestUserId);
        this.getViewModel().set('totalRequest', 0);
        this.getViewModel().set('totalEntitled', 0);
        this.getViewModel().set('totalOther', 0);
        this.getViewModel().set('requestIsValid', false);

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

                    AbsMan.util.mess(response.mess || "Error during load operation.", AbsMan.util.ERROR);

                } else {

                    this.workingDays = response.data.workingDays;
                    this.context = response.data.context;

                    this.entitledStore.loadData(response.data.entitled);
                    this.otherStore.loadData(response.data.other);

                    this.getViewModel().set('currentRecord', record); //required for reset ?

                    this.getViewModel().getStore('leavingTime').setData(response.data.leavetimes);
                    this.getViewModel().getStore('returnTime').setData(response.data.returntimes);

                    this.hCalendarRequestsStore.setData(response.data.hcalendar.requests);

                    this.hCalendar.load(response.data.hcalendar);

                    this.loadRequestList();


                    //this.simulateRequest(record);
                }

                //console.log(response.data.hcalendar.requests,this.getViewModel().getStore('hCalendarRequests'));
            }
        });

    },


    simulateRequest: function (record) {

        this.entitledStore.getById('98764540BB0511E6B9B7150E5F069159').set("take", 2);
        this.otherStore.getById('606D33502E4D11E692D39D2A8DFDCCA3').set("justification", 'new baby ?');
        this.otherStore.getById('606D33502E4D11E692D39D2A8DFDCCA3').set("take", 1);
        this.formStore.getAt(0).set('leavetime', 0.5);
        this.formStore.getAt(0).set('returntime', 0.5);
        record.set("leavedate", "2017-11-13");
        record.set("returndate", "2017-11-17");
        Ext.Function.defer(this.onSubmitRequest, 2500, this);
    },


    OnEditorFocus: function (editor) {

        if (editor.xtype == "numberfield") {

            var max;

            if (editor.ownerCt.grid.itemId == "entitled") {

                max = this.currentGridEditorContextRecord.get(this.currentGridEditorContextRecord.get('useondemand') ? 'ondemandleft' : 'left');

                if (max >= 0) editor.setMaxValue(max);

            } else {

                max = this.currentGridEditorContextRecord.get('maxvalue');

                if (max > 0) editor.setMaxValue(max);
            }
        }
    },


    onGridBeforeEdit: function (editor, context) {

        this.currentGridEditorContextRecord = context.record;

    },


    resetOnDemand: function (checkBoxColumn, rowIndex, checked, record, eOpts) {

        var grid = checkBoxColumn.ownerCt.grid,
            cols = grid.getColumns(),
            onDemandLeft = cols[2],
            left = cols[3];

        left.setVisible(!checked);
        onDemandLeft.setVisible(checked);

        Ext.Array.each(this.entitledStore.getData().items, function (record) {
            record.set('useondemand', checked);
            if (checked && record.get('take') > record.get('ondemandleft')) record.set('take', record.get('ondemandleft'))
        }, this);

    },


    onFormChange: function (field) {

        if (field.xtype == "datefield") {

            var targetDate = field.getValue(),
                target = Ext.get(Ext.query("#" + this.getView().id + " [hcdate=d-" + Ext.Date.format(targetDate, "Y-m-d") + "]")[0]);


            this.clearInterval();

            if (target) {
                target.date = targetDate;

                this.renderInterval(field.itemId, field.getValue(), target);
            }
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

        var startDate = Ext.get(Ext.query("#" + this.getView().id + " [hcdate=d-" + Ext.Date.format(this.getViewModel().get('currentRecord.leavedate'), "Y-m-d") + "]")[0]),
            endDate = Ext.get(Ext.query("#" + this.getView().id + " [hcdate=d-" + Ext.Date.format(this.getViewModel().get('currentRecord.returndate'), "Y-m-d") + "]")[0]),
            item;

        //console.log(target,startDate,endDate,id,value);

        if (id == "startDateId") {

            if (endDate) {

                item = target;

                //console.log(item,endDate);

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


    reloadForm: function () {

        if (this.hCalendarDetailTimeout) clearTimeout(this.hCalendarDetailTimeout);
        this.currentTarget = null;
        this.requestUser = userDisplayName;
        this.requestUserId = userId;
        this.getViewModel().set('requestUser', this.requestUser);
        this.getViewModel().set('requestUserId', this.requestUserId);
        this.resetRequestUser();
    },


    onRender: function () {

        this.getViewModel().set('totalRequest', this.totalRequest);
        this.getViewModel().set('scrollBarWidth', Ext.getScrollbarSize().width);

    },


    removeHCalendarItemCls: function () {

        //console.log("removeCls", this.selectedHCalendarItem);

        if (this.selectedHCalendarItem && typeof this.selectedHCalendarItem === 'object' ) {

            //console.log(Ext.get(this.selectedHCalendarItem));

            if (this.selectedHCalendarItem.hasCls("hcalendar-selected-date")) this.selectedHCalendarItem.removeCls("hcalendar-selected-date");
        }
    },


    onHCalendarClose: function (panel) {

        panel.hide();
        this.removeHCalendarItemCls();
        return false;
    },


    hideHCalDetailBox: function () {

        if (this.currentHCalDetailBox) this.currentHCalDetailBox.hide(true);
        this.removeHCalendarItemCls();
    },


    showHCalDetailBox: function (panel, target) {

        if (this.currentHCalDetailBox) this.hideHCalDetailBox();

        this.currentHCalDetailBox = panel;

        this.selectedHCalendarItem.addCls("hcalendar-selected-date");
        this.currentHCalDetailBox.show();


        this.currentHCalDetailBox.alignTo(target.down("DIV"), 'b-t?', [0, -1], {duration: 300});
    },


    onHCalendarOver: function (event) {

        var isTarget = Ext.get(event.target).parent("TD");

        if (isTarget) {

            var target = isTarget.down("DIV");

            if (target != this.selectedHCalendarItem && this.selectedHCalendarItem) {

                if (this.hCalendarDetailTimeout) clearTimeout(this.hCalendarDetailTimeout);

                this.hCalendarDetailTimeout = Ext.Function.defer(this.hideHCalDetailBox, 3000, this);

            }
        }
    },


    onHCalendarClick: function (event) {

        if (this.hCalendarDetailTimeout) clearTimeout(this.hCalendarDetailTimeout);

        this.hCalendarDetailTimeout = Ext.Function.defer(this.hideHCalDetailBox, 3000, this);

        var isTarget = Ext.get(event.target).parent("TD");

        if (isTarget) {

            var target = isTarget.down("DIV");

            //console.log('click',target);

            this.removeHCalendarItemCls();

            if (isTarget.getAttribute("req-id")) {

                if (target == this.selectedHCalendarItem) {

                    this.hideHCalDetailBox();
                    this.selectedHCalendarItem = null;

                } else {

                    this.selectedHCalendarItem = target;

                    this.getViewModel().set("hCalSelectedRequest", this.hCalendarRequestsStore.getById(isTarget.getAttribute("req-id")).getData());

                    this.showHCalDetailBox(this.hCalendarRequest, target);
                }

            } else {

                this.selectedHCalendarItem = target;

                this.showHCalDetailBox(this.hCalendarTooltip, target);

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

                            this.hideHCalDetailBox();
                            this.hCalendarStartDate = null;
                            this.hCalendarEndDate = null;

                        } else {

                            this.hCalendarStartDate = target;

                        }


                    } else if (diffStart == 0) {


                        if (this.hCalendarStartDate == this.hCalendarEndDate) {

                            this.hideHCalDetailBox();
                            this.hCalendarStartDate = null;
                            this.hCalendarEndDate = null;

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

                            this.hideHCalDetailBox();
                            this.hCalendarStartDate = null;
                            this.hCalendarEndDate = null;
                        }
                    }
                }

                if (this.hCalendarStartDate == this.hCalendarEndDate) this.formStore.suspendEvent("update");

                this.getViewModel().set('currentRecord.leavedate', this.hCalendarStartDate ? this.hCalendarStartDate.date : null);

                if (this.hCalendarStartDate == this.hCalendarEndDate) this.formStore.resumeEvent("update");

                this.getViewModel().set('currentRecord.returndate', this.hCalendarEndDate ? this.hCalendarEndDate.date : null);

            }
        }
    },


    requestIsOverlapping: function (startDate, endDate) {


        return (this.hCalendarRequestsStore.findBy(function (request, id) {
            return (startDate < request.get("startDate") && endDate > request.get("endDate"));
        }, this) != -1);
    },


    onRequestDetailsClick: function (event) {

        var contentPanels = this.getView().up('#tabpanels');

        contentPanels.fireEvent("newpanel", "request-details", "request-details-" + this.getViewModel().get("hCalSelectedRequest").id);

    },


    checkNeedReload: function () {

        var formStore = this.formStore;

        if (formStore.isLoaded()) {
            Ext.Ajax.request({
                scope: this,
                url: formStore.getProxy().baseUrl + 'checkform/' + this.requestUserId,
                params: {
                    entitledlastupdate: this.getViewModel().get('currentRecord.entitledlastupdate'),
                    userlastupdate: this.getViewModel().get('currentRecord.lastupdate'),
                    requestListLastUpdate: this.getView().down("requestlist").getController().lastUpdate
                },
                success: function (response) {

                    var responseData = Ext.JSON.decode(response.responseText);

                    if (responseData.success) {

                        if (responseData.data.outdated === true) {

                            AbsMan.util.mess("Reloading, the form values are out of date.", AbsMan.util.INFO);
                            this.reloadForm();
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

            requestListView.getController().loadFilterList();

        }
    },


    checkForm: function () {

        this.setValidRequest(false);
        this.sortedConfirmCategories = [];

        var formStore = this.formStore,
            record = formStore.getAt(0),
            entitledTable = this.getView().down("#entitled").getView(),
            otherTable = this.getView().down("#other").getView();


        if (record.get('leavedate') && record.get('returndate')) {

            if (this.workingDays[Ext.Date.format(record.get('leavedate'), "w")] == "0") record.set("leavetime", 0);
            if (this.workingDays[Ext.Date.format(record.get('returndate'), "w")] == "0") record.set("returntime", 0);


            var others = [],
                entitleds = [];

            Ext.Array.each(this.otherStore.getData().items, function (record) {

                if (record.get('take') > 0) {
                    others.push([record.get('id'), record.get('take'), record.get('justification'), record.get('name')]);
                }
            }, this);

            Ext.Array.each(this.entitledStore.getData().items, function (record) {

                if (record.get('take') > 0) {
                    entitleds.push([record.get('id'), record.get('take'), record.get('useondemand'), record.get('name')]);
                }
            }, this);

            Ext.Ajax.request({
                scope: this,
                url: formStore.getProxy().baseUrl + 'check/' + this.requestUserId,
                params: {
                    others: Ext.JSON.encode(others),
                    entitleds: Ext.JSON.encode(entitleds),
                    leavedate: record.get('leavedate'),
                    returndate: record.get('returndate'),
                    leavetime: record.get('leavetime'),
                    returntime: record.get('returntime'),
                    requirestandinapprover: record.get('requirestandinapprover'),
                    standinapproverid: record.get('standinapproverid'),
                    requiresubstitute: record.get('requiresubstitute'),
                    substituteid: record.get('substituteid'),
                    workflowid: record.get('workflowid')
                },
                success: function (response) {

                    var responseData = Ext.JSON.decode(response.responseText);

                    if (responseData.success) {

                        var publicDayCount = 0,
                            publicDaysText = "",
                            publicDaysIds = [],
                            publicDaysRecord = this.otherStore.getById('publicDaysId'),
                            publicDays = [],
                            context = this.context;

                        Ext.Array.each(responseData.data.publicDays, function (publicDay) {
                            publicDaysText += publicDay.name + "\n";
                            publicDayCount += publicDay.publicDayLength === 0 ? 1 : 0.5;
                            publicDaysIds.push(publicDay.id);
                            publicDays.push(publicDay);
                        }, this);

                        if (context.unit == 1) publicDayCount *= context.hpd ;

                        if ( publicDayCount > 0) {

                            if ( Ext.Date.diff(Ext.Date.parse(publicDays[publicDays.length-1].publicDayDate.date.substr(0,10),"Y-m-d"), record.get('returndate'), Ext.Date.DAY ) == 0) {

                                record.set("returntime", 0)
                            }

                            if ( Ext.Date.diff(Ext.Date.parse(publicDays[0].publicDayDate.date.substr(0,10),"Y-m-d"), record.get('leavedate'), Ext.Date.DAY ) == 0) {

                                record.set("leavetime", 0)
                            }

                        }

                        if (publicDaysRecord) {

                            this.otherStore.suspendEvent("update");
                            publicDaysRecord.set('take', publicDayCount);
                            publicDaysRecord.set('justification', publicDaysText);
                            this.otherStore.resumeEvent("update");
                            otherTable.refresh();

                        }

                        //unusable categories

                        this.unusableCategories = responseData.data.unusableCategories;

                        Ext.Array.each(this.unusableCategories, function (userEntitlementId) {

                            var record = this.entitledStore.getById(userEntitlementId);

                            if (record && record.get('take') !== 0) {
                                record.set('take', 0);
                                AbsMan.util.mess(record.get("name") + " Category cannot be used for the requested period!", AbsMan.util.ERROR);
                            }
                        }, this);
                        entitledTable.refresh();


                        this.totalEntitled = responseData.data.entitledCount;
                        this.totalOther = responseData.data.otherCount;
                        this.totalRequest = responseData.data.totalCount;
                        this.getViewModel().set('totalEntitled', this.totalEntitled);
                        this.getViewModel().set('totalOther', this.totalOther);
                        this.getViewModel().set('totalRequest', this.totalRequest);

                        if (responseData.data.requestIsValid) {

                            this.setValidRequest(true);
                            this.others = others;
                            this.entitleds = entitleds;
                            this.publicDays = publicDays;

                        } else {

                            this.setValidRequest(false);
                            this.others = null;
                            this.entitleds = null;
                            this.publicDays = null;
                            Ext.Array.each(responseData.data.requestValidationMessages, function (message) {

                                AbsMan.util.mess(message, AbsMan.util.WARNING, true);

                            }, this);
                        }

                    } else {

                        AbsMan.util.mess(responseData.mess || responseData.code || responseData.reason || "Error during check operation", AbsMan.util.ERROR);

                        this.getViewModel().set('totalRequest', 0);
                        this.getViewModel().set('totalOther', this.getViewModel().get("totalOther") - this.otherStore.getById('publicDaysId').get("take"));
                        this.otherStore.getById('publicDaysId').set("take", 0);
                        this.otherStore.getById('publicDaysId').set("justification", "");
                        this.setValidRequest(false);
                        this.unusableCategories = [];
                        entitledTable.refresh();
                    }
                },
                failure: function (batch) {

                    var response = Ext.JSON.decode(batch.getOperations()[0].getResponse().responseText);

                    AbsMan.util.mess(response.mess || "Error checking request", AbsMan.util.CRITICAL);

                }
            });

        } else {

            this.getViewModel().set('totalRequest', 0);
            this.getViewModel().set('totalOther', this.getViewModel().get("totalOther") - this.otherStore.getById('publicDaysId').get("take"));
            this.otherStore.getById('publicDaysId').set("take", 0);
            this.otherStore.getById('publicDaysId').set("justification", "");
            this.setValidRequest(false);
            this.unusableCategories = [];
            entitledTable.refresh();

        }
    },


    buildConfirmStore: function (dayType, indexDate, quantity, options) {

        if (dayType == "nonWorkingDay") {

            this.confirmStore.add({
                name: "Non Working Day",
                date: indexDate,
                categoryId: "nonWorkingDayId",
                categoryType: dayType,
                justification: null,
                quantity: quantity
            });

        } else if (dayType == "publicDay") {

            if (options.halfPublicDay == "pm") this.buildConfirmStore("workingDay", indexDate, quantity, options);

            this.confirmStore.add({
                name: options.name,
                date: indexDate,
                categoryId: "publicDayId",
                categoryType: dayType,
                justification: null,
                quantity: quantity
            });

            if (options.halfPublicDay == "am") this.buildConfirmStore("workingDay", indexDate, quantity, options);

        } else if (dayType == "workingDay") {

            if (this.confirmCategories.length && this.currentConfirmCategory[1] === 0) {

                this.currentConfirmCategory = this.confirmCategories.shift();

                while (this.currentConfirmCategory[0] == "publicDaysId") {

                    this.currentConfirmCategory = this.confirmCategories.shift();
                }

            }

            if (this.currentConfirmCategory[1] < quantity) {

                this.confirmStore.add({
                    name: this.currentConfirmCategory[3],
                    date: indexDate,
                    categoryId: this.currentConfirmCategory[0],
                    categoryType: this.currentConfirmCategory[2] ? "other" : "entitled",
                    justification: this.currentConfirmCategory[2],
                    quantity: this.currentConfirmCategory[1]
                });

                quantity -= this.currentConfirmCategory[1];
                this.currentConfirmCategory[1] = 0;

                this.buildConfirmStore("workingDay", indexDate, quantity, options);

            } else {

                this.confirmStore.add({
                    name: this.currentConfirmCategory[3],
                    date: indexDate,
                    categoryId: this.currentConfirmCategory[0],
                    categoryType: this.currentConfirmCategory[2] ? "other" : "entitled",
                    justification: this.currentConfirmCategory[2],
                    quantity: quantity
                });

                this.currentConfirmCategory[1] -= quantity;
            }

        }
    },


    onSubmitRequest: function () {

        var vm = this.getViewModel(),
            startDate = vm.get('currentRecord.leavedate'),
            endDate = vm.get('currentRecord.returndate'),
            indexDate = startDate,
            startDateRatio = vm.get('currentRecord.leavetime'),
            endDateRatio = vm.get('currentRecord.returntime'),
            securedLoop = 0,
            defaultQuantity = this.context.unit == 1 ? this.context.hpd : 1;

        //stores 0=id 1=days 2=reason 3=name

        if (this.sortedConfirmCategories.length == 0) {

            this.confirmCategories =  Ext.clone(Ext.Array.merge(this.entitleds, this.others));
            this.sortedConfirmCategories = Ext.clone(this.confirmCategories);

        } else {

            this.confirmCategories =  Ext.clone(this.sortedConfirmCategories);
        }

        this.confirmStore.removeAll();

        while (Ext.Date.diff(indexDate, this.getViewModel().get('currentRecord.returndate'), Ext.Date.DAY) >= 0 || securedLoop++ == 100) {

            if (this.workingDays[Ext.Date.format(indexDate, "w")] == "0") {

                this.buildConfirmStore("nonWorkingDay", indexDate, defaultQuantity, {});

            } else {

                var publicDayFound = Ext.Array.findBy(this.publicDays, function (publicDay) {

                    return Ext.Date.diff(Ext.Date.parse(publicDay.publicDayDate.date.substr(0, 10), "Y-m-d"), indexDate, Ext.Date.DAY) === 0

                }, this);

                var quantity = defaultQuantity;


                if (publicDayFound) {

                    var halfSide = "";

                    if (publicDayFound.publicDayLength !== 0) {

                        quantity = defaultQuantity / 2 ;
                        halfSide = publicDayFound.publicDayLength == 1 ? "am" : "pm";
                    }

                    this.buildConfirmStore("publicDay", indexDate, quantity, { name: publicDayFound.name, halfPublicDay: halfSide });


                } else {

                    if (startDateRatio !== 0 && Ext.Date.diff(startDate, indexDate, Ext.Date.DAY) === 0) {

                        quantity = startDateRatio;

                    } else if (endDateRatio !== 0 && Ext.Date.diff(endDate, indexDate, Ext.Date.DAY) === 0) {

                        quantity = endDateRatio;
                    }

                    this.buildConfirmStore("workingDay", indexDate, quantity, {});


                }
            }

            indexDate = Ext.Date.add(indexDate, Ext.Date.DAY, 1);

        }

        /*
        this.confirmStore.each(function (item) {
            console.log(item.get("date"), item.get("quantity"), item.get("name"));
        });



        if (this.confirmCategories != 0 || this.currentConfirmCategory[1] != 0) {

            if (this.confirmCategories.length == 1 && this.confirmCategories[0][0] != "publicDaysId")
                console.log(this.confirmCategories , this.currentConfirmCategory);
        }

        */

        this.confirmPanel.setVisible(true);
        //Ext.ComponentQuery.query('#catDistributionId')[0].load(this.confirmStore);


        return true;

    },


    onConfirmPanelMoveCategory: function(button) {

        var selectedCategoryId = button.up("#confirmGridId").getSelection()[0].get('categoryId');

        if (selectedCategoryId != "publicDayId" && selectedCategoryId != "nonWorkingDayId") {

            var delta = button.itemId == "moveCategoryUp" ? -1 : 1,
                categories = this.sortedConfirmCategories,
                category = Ext.Array.findBy(categories, function (category) { return category[0] == selectedCategoryId; }, this),
                index = categories.indexOf(category),
                newIndex = index + delta;

            if (newIndex >= 0 && newIndex != categories.length) {

                if (categories[newIndex][0] == "publicDaysId") newIndex += delta;

                var indexes = [index, newIndex].sort();

                categories.splice(indexes[0], 2, categories[indexes[1]], categories[indexes[0]]);

                this.onSubmitRequest();
            }
        }
    },


    onConfirmPanelClose: function (panel) {

        panel.hide();
        return false;
    },


    onConfirmPanelCancel: function (button) {

        button.up("#confirmPanelId").close();
        return false;
    },


    submitRequest: function () {

        var formStore = this.formStore,
            record = formStore.getAt(0),
            entitleds = [],
            others = [],
            publicDaysIds = [],
            categories,
            periodStart = null,
            periodEnd = null,
            periodQuantity = 0,
            previousCategoryId = null,
            categoryId = null,
            previousCategoryType = null,
            previousJustification = null;


        this.confirmStore.each(function (catRecord) {

            var categoryId = catRecord.get("categoryId");

            if (categoryId != "nonWorkingDayId" && categoryId != "publicDayId") {

                if (categoryId != previousCategoryId) {

                    if (previousCategoryId) {

                        categories = previousCategoryType == "entitled" ? entitleds : others;

                        categories.push({
                            "periodStart": periodStart,
                            "periodEnd": periodEnd,
                            "periodQuantity": periodQuantity,
                            "categoryId": previousCategoryId,
                            "justification": previousJustification
                        });
                    }

                    periodStart = catRecord.get("date");
                    periodEnd = catRecord.get("date");
                    periodQuantity = catRecord.get("quantity");
                    previousCategoryId = categoryId;
                    previousCategoryType = catRecord.get("categoryType");
                    previousJustification = catRecord.get("justification");

                } else {

                    periodQuantity += catRecord.get("quantity");
                    periodEnd = catRecord.get("date");
                }
            }

        }, this);

        categories = previousCategoryType == "entitled" ? entitleds : others;

        categories.push({
            "periodStart": periodStart,
            "periodEnd": periodEnd,
            "periodQuantity": periodQuantity,
            "categoryId": previousCategoryId,
            "justification": previousJustification
        });

        Ext.Array.each(this.publicDays, function (publicDay) {
            publicDaysIds.push(publicDay.id);
        }, this);

        Ext.Ajax.request({
            scope: this,
            url: formStore.getProxy().baseUrl + 'submit/' + this.requestUserId,
            params: {
                entitleds: Ext.JSON.encode(entitleds),
                others: Ext.JSON.encode(others),
                publicdaysids: Ext.JSON.encode(publicDaysIds),
                leavedate: record.get('leavedate'),
                returndate: record.get('returndate'),
                leavetime: record.get('leavetime'),
                returntime: record.get('returntime'),
                approverid: record.get('approverid'),
                standinapproverid: record.get('standinapproverid'),
                substituteid: record.get('substituteid'),
                notifiedid: record.get('notifiedid'),
                workflowid: record.get('workflowid'),
                totalrequest: this.totalRequest,
                comments: record.get('comments')
            },
            success: function (response) {

                var responseData = Ext.JSON.decode(response.responseText);

                if (responseData.success) {

                    this.confirmPanel.close();

                    this.getView().up("content-panels").fireEvent("newpanel","request-details","request-details-" + responseData.data.newRequestId);

                    AbsMan.util.mess(responseData.mess || "Request sent successfully!", AbsMan.util.INFO);

                    this.getView().close();

                } else {

                    AbsMan.util.mess(responseData.mess || responseData.code || responseData.reason || "Error during submit operation", AbsMan.util.ERROR);

                }
            },
            failure: function (batch) {

                var response = Ext.JSON.decode(batch.getOperations()[0].getResponse().responseText);

                AbsMan.util.mess(response.mess || "Error submitting request", AbsMan.util.CRITICAL);
            }
        });


    },


    getOtherTip: function (record) {

        return "<b>" + record.get('name') + "</b></br>" + record.get('text') +
            (record.get('maxvalue') > 0 ? "<br>Maximum: " + record.get('maxvalue') : "") +
            (record.get('justificationnotrequired') ? "<br>No justification is required" : "") +
            (record.get('autoapprovable') ? "<br>No approval is required" : "");
        ;
    },


    setEntitledRowClass: function (record) {

        return this.unusableCategories.indexOf(record.id) != -1 ? "disabled-row" : "";
    },


    setOtherRowClass: function (record) {

        return (record.get('take') > 0 && Ext.String.trim(record.get('justification')) == "" && !record.get('justificationnotrequired')) ? "justification-required" : "";
    },


    setValidRequest: function (val) {

        this.getViewModel().set('requestIsValid', val);
    },


    onFormStoreUpdate: function (store, record, operation, modifiedFieldNames, details, eOpts) {

        if (modifiedFieldNames[0] != "comments") {

            this.checkForm();
        }
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
        this.hCalendarRequestsStore.each(function (request ) {

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


    takeRenderer: function (value) {

        return value == 0 ? "" : value;
    },


    justificationRenderer: function (value) {

        return value.replace(/\n/g, "<br/>");
    },


    onGridAfterLayout: function (grid) {

        var og = grid.getView().el.dom,
            ch = og.clientHeight,
            sh = og.scrollHeight,
            gridSummary = grid.itemId == 'entitled' ? 'entitledScrollBarIsVisible' : 'otherScrollBarIsVisible';

        this.getViewModel().set(gridSummary, (ch < sh));
    },


    resetProxy: function () {

        this.formStore.getProxy().url = this.formStore.getProxy().baseUrl + this.requestUserId;
    },


    saveUserPreference: function(preference,value) {

        //console.log(preference,value);

        this.getView().up("#mainPanelId").getController().saveUserPreference("user."+preference,value);
    }

});