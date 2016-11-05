/**
 * EventsController
 *
 * @description :: Server-side logic for managing Events
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var scrapeIt = require('scrape-it');
var currentWeekNumber = require('current-week-number');
var uuid = require('uuid');

module.exports = {
	getEvents: function (req, res) {

		var weekNo = currentWeekNumber();
		var url = 'http://vbdh.vfu.edu.vn/qlvb/lichct.nsf/cld_Week?openform&week=' + weekNo + '&ngay=17/10/2016!18/10/2016!19/10/2016!20/10/2016!21/10/2016!22/10/2016!23/10/2016!24/10/2016';

		scrapeIt(url, {
			events: {
				listItem: "form div:nth-child(1)"
			}
		}).then(function (results) {

			var Monday = [],
				Tuesday = [],
				Wednesday = [],
				Thursday = [],
				Friday = [],
				Saturday = [],
				Sunday = [],
				UnknownTime = [];
			var event;

			var eventsArr = results.events[0].split(/\^|\s</g);
			for (var i = 0; i < eventsArr.length; i++) {
				eventsArr[i] = eventsArr[i].replace(/(\<font\scolor=\'blue\'\>)|(font\scolor=\'blue\'\>)/g, '');

				// Split string event into detailed information
				eventsArr[i] = eventsArr[i].split('~');
				event = {
					event: {
						eventId: uuid.v4(),
						time: eventsArr[i][2] + ' ' + eventsArr[i][8],
						content: eventsArr[i][3],
						participants: eventsArr[i][4],
						place: eventsArr[i][5],
						leader: eventsArr[i][7],
					}
				};

				switch (eventsArr[i][0]) {
					case 'Thứ Hai':
						Monday.push(event);
						break;
					case 'Thứ Ba':
						Tuesday.push(event);
						break;
					case 'Thứ Tư':
						Wednesday.push(event);
						break;
					case 'Thứ Năm':
						Thursday.push(event);
						break;
					case 'Thứ Sáu':
						Friday.push(event);
						break;
					case 'Thứ Bảy':
						Saturday.push(event);
						break;
					case 'Chủ Nhật':
						Sunday.push(event);
						break;
					default:
						UnknownTime.push(event);
				}
			}

			var events = {
				weekId: uuid.v4(),
				weekNo: weekNo,
				weekEvents: [
					{
						dayId: uuid.v4(),
						day: 'Thứ Hai',
						events: Monday
					},
					{
						dayId: uuid.v4(),
						day: 'Thứ Ba',
						events: Tuesday
					},
					{
						dayId: uuid.v4(),
						day: 'Thứ Tư',
						events: Wednesday
					},
					{
						dayId: uuid.v4(),
						day: 'Thứ Năm',
						events: Thursday
					},
					{
						dayId: uuid.v4(),
						day: 'Thứ Sáu',
						events: Friday
					},
					{
						dayId: uuid.v4(),
						day: 'Thứ Bảy',
						events: Saturday
					},
					{
						dayId: uuid.v4(),
						day: 'Chủ Nhật',
						events: Sunday
					},
				]
			};

			return res.send(events);
		});
	}
};
