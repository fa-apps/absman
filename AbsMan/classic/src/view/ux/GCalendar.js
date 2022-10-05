
Ext.define('AbsMan.view.ux.GCalendar', {

    extend: 'Ext.view.View',

    alias: 'widget.gcalendar',

    tpl: new Ext.XTemplate([
        '<div class="gcalendar"><table class="gcalendar">',
        '<tpl for=".">',
            '<tpl if="xindex==1">',
            '<tr>',
                '<td class="gcalendar-name gcalendar-head-month"><div>&nbsp;</div></td>',
                '<tpl for ="values[2]">',
                    '<td colspan="15" class="gcalendar-month left">{1}</td>',
                    '<td colspan="{[values[2]-15]}" class="gcalendar-month right">{1}</td>',
                '</tpl>',
            '</tr>',
            '<tr>',
                '<td class="gcalendar-name gcalendar-head-day"><div>&nbsp;</div></td>',
                '<tpl for ="values[2]">',
                    '<tpl for ="values[3]">',
                        '<td class="gcalendar-day<tpl if="this.isToday(values[2])"> gcalendar-today</tpl>">',
                            '<div title="{4}">{1}</div>',
                        '</td>',
                    '</tpl>',
                '</tpl>',
            '</tr>',
            '</tpl>',
            '<tr>',
                '<td class="gcalendar-name" title="{0}"><div>{0}</div></td>',
                '<tpl for ="values[2]">',
                    '<tpl for ="values[3]">',
                        '<td class="gcalendar-day<tpl if="values[3]"> {3}</tpl>" hcdate="d-{2}">',
                            '<div title="{4}">{0}</div>',
                        '</td>',
                    '</tpl>',
                '</tpl>',
            '</tr>',
        '</tpl>',
        '</table></div>',
        {
            isToday: function (day) {

                return day === Ext.Date.format(new Date(), 'Y-m-d');
            }
        }

    ]),



    // months = [
    //   month->firstDay,
    //   month->format('monthName Year'),
    //   daysInMonth,
    //   [dayNumber,dayLetter,dayId,dayClass,dayTitle,requestIdProperty]
    // ]


    itemSelector: "div.gcalendar",

    load: function (gcal) {

        var hcals= [];  // [name,id,months]

        gcal.each(function(hcalItem) {

            var hcal = hcalItem.schedule().getData().items[0].getData(),
                today = new Date(),
                months = [],
                firstDate = Ext.Date.parse(hcal.begin, "Y-m-d"),
                lastDate = Ext.Date.parse(hcal.end, "Y-m-d"),
                month = firstDate,
                idx = 0;

            while (Ext.Date.diff(month, lastDate, Ext.Date.MONTH) != 0) {

                var daysInMonth = Ext.Date.getDaysInMonth(month),
                    days = [],
                    day = Ext.Date.add(Ext.Date.getFirstDateOfMonth(month));

                for (var dIndex = 0; dIndex < daysInMonth; dIndex++) {

                    var dayLetter = Ext.Date.format(day, 'D').substring(0, 1),
                        dayId = Ext.Date.format(day, 'Y-m-d'),
                        dayClass = [],
                        dayTitle = Ext.Date.format(day, 'D j F Y'),
                        nonWorkingDay = hcal.workingDays[Ext.Date.format(day, 'w')] == 0;

                    if (nonWorkingDay) {

                        dayClass.push("gcalendar-non-working-day")
                    }

                    days[dIndex] = [dIndex + 1, dayLetter, dayId, dayClass.join(" "), dayTitle];
                    day = Ext.Date.add(day, Ext.Date.DAY, 1);
                }

                months[idx++] = [month, Ext.Date.format(month, 'F Y'), daysInMonth, days];
                month = Ext.Date.add(month, Ext.Date.MONTH, 1);

            }


            // set today's class

            var index = Ext.Date.diff(firstDate, today, Ext.Date.MONTH);

            if (index >= 0 && index < months.length) {

                var currentMonth = months[index],
                    currentDay = currentMonth[3][Ext.Date.format(today, 'd') - 1],
                    currentDayClass = currentDay[3].split(" ");

                currentDayClass.push("gcalendar-today");
                currentDay[3] = currentDayClass.join(" ");
            }

            // set publicDay class

            var publicDaysClasses = ["gcalendar-publicday-full", "gcalendar-publicday-morning", "gcalendar-publicday-afternoon"];

            Ext.Array.each(hcal.publicDays, function (publicDayModel) {

                var publicDay = Ext.Date.parse(publicDayModel[0], "Y-m-d"),
                    index = Ext.Date.diff(firstDate, publicDay, Ext.Date.MONTH);

                if (index >= 0 && index < months.length) {

                    var publicDayMonth = months[index],
                        publicDayDate = publicDayMonth[3][Ext.Date.format(publicDay, 'd') - 1],
                        publicDayClass = publicDayDate[3].split(" ");

                    publicDayClass.push(publicDaysClasses[publicDayModel[2]]);
                    publicDayDate[3] = publicDayClass.join(" ");
                }

            }, this);


            //set requests


            var requestsClasses = ["gcalendar-request-submit", "gcalendar-request-pending", "gcalendar-request-approved"];

            Ext.Array.each(hcal.requests, function (request) {


                var requestStartDate = Ext.Date.parse(request.startDate, "Y-m-d"),
                    requestEndDate = Ext.Date.parse(request.endDate, "Y-m-d"),
                    requestDate = requestStartDate;

                while (Ext.Date.diff(requestDate, requestEndDate, Ext.Date.DAY) != -1) {

                    var index = Ext.Date.diff(firstDate, requestDate, Ext.Date.MONTH);

                    if (index >= 0 && index < months.length) {

                        var requestMonth = months[index],
                            requestDay = requestMonth[3][Ext.Date.format(requestDate, 'd') - 1],
                            dayClass = requestDay[3].split(" ");

                        dayClass.push(requestsClasses[request.requestStatusId - 1]);
                        requestDay[3] = dayClass.join(" ");
                    }

                    requestDate = Ext.Date.add(requestDate, Ext.Date.DAY, 1);
                }

            }, this);

            hcals.push([hcalItem.get("name"),hcalItem.get("id"),months]);


        }, this);

        this.update(hcals);


        //scroll to current month


        var currentViewElement = this.ownerCt.getEl(),
            currentMonthElement = Ext.query("#" + currentViewElement.id + " [hcdate=d-" + Ext.Date.format(new Date(), 'Y-m-01') + "]"),
            currentGCalendar = Ext.get(this.getEl().query("div.gcalendar")[0]);


        if (currentMonthElement) {

            currentGCalendar.scrollTo("left", currentMonthElement[0].offsetLeft, false);
        }


        return true;

    }


});

