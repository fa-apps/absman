
Ext.define('AbsMan.view.ux.HCalendar', {

    extend: 'Ext.Component',

    alias: 'widget.hcalendar',

    tpl: new Ext.XTemplate([
        '<table class="hcalendar"><tbody><tr>',
        '<tpl for=".">',
            '<td colspan="15" class="hcalendar-month left">{1}</td>',
            '<td colspan="{[values[2]-15]}" class="hcalendar-month right">{1}</td>',
        '</tpl>',
        '</tr><tr>',
        '<tpl for=".">',
            '<tpl for ="values[3]">',
                '<td class="hcalendar-day<tpl if="values[3]"> {3}</tpl>" hcdate="d-{2}"<tpl if="values[5]">{5}</tpl>>',
                    '<div title="{4}">',
                        '<div>{1}</div>',
                        '<div>{0}</div>',
                    '</div>',
                '</td>',
            '</tpl>',
        '</tpl>',
        '</tr></tbody></table>'
    ]),


    load: function (hcal) {

        var today = new Date(),
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

                    dayClass.push("hcalendar-non-working-day")
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

            currentDayClass.push("hcalendar-today");
            currentDay[3] = currentDayClass.join(" ");
        }

        // set publicDay class

        var publicDaysClasses = ["hcalendar-publicday-full", "hcalendar-publicday-morning", "hcalendar-publicday-afternoon"];

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

        var requestsClasses = ["hcalendar-request-submit", "hcalendar-request-pending", "hcalendar-request-approved"];

        Ext.Array.each(hcal.requests, function (request) {


            var requestStartDate = request.startDate,
                requestEndDate = request.endDate,
                requestDate = requestStartDate;


            while (Ext.Date.diff(requestDate, requestEndDate, Ext.Date.DAY) != -1) {

                var index = Ext.Date.diff(firstDate, requestDate, Ext.Date.MONTH);

                if (index >= 0 && index < months.length) {

                    var requestMonth = months[index],
                        requestDay = requestMonth[3][Ext.Date.format(requestDate, 'd') - 1],
                        dayClass = requestDay[3].split(" ");

                    dayClass.push(requestsClasses[request.requestStatusId - 1]);
                    requestDay[3] = dayClass.join(" ");
                    requestDay[5] = 'req-id="' + request.id + '"';

                }

                requestDate = Ext.Date.add(requestDate, Ext.Date.DAY, 1);
            }

        }, this);


        this.update(months);

        //scroll to current month

        var currentViewElement = this.ownerCt.getEl(),
            currentMonthElement = Ext.query("#" + currentViewElement.id + " [hcdate=d-" + Ext.Date.format(today, 'Y-m-01') + "]");

        if (currentMonthElement) {

            this.getEl().scrollTo("left", currentMonthElement[0].offsetLeft, false);
        }

        return true;

    }

});

