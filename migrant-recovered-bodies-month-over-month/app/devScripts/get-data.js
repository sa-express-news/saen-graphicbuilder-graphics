/* await/async requires node@7.6^ */

require('dotenv').config(); // store ure API key in .env under API_KEY key
const apiKey = process.env.API_KEY;

const rp 	= require('request-promise');
const fs 	= require('fs');

/*
 * Pull the sheets from data.world
 */

const getSQLQuery = () => encodeURIComponent(`SELECT * FROM brooks_recovered_bodies_mom`);

const setGETConfigObj = () => ({
	uri: `https://api.data.world/v0/sql/expressnews/missing-migrant-data?query=${getSQLQuery()}`,
	headers: {
		'Authorization': `Bearer ${apiKey}`,
		'Accept': 'application/json',
	},
	json: true,
});

const getSheet = () => rp(setGETConfigObj()).catch(err => console.error(err));

/*
 * build hash of averages for all years before 2014
 */

const emptyYear = {
	january: [],
	february: [],
	march: [],
	april: [],
	may: [],
	june: [],
	july: [],
	august: [],
	september: [],
	october: [],
	november: [],
	december: [],
};

const arrangeByMonth = (resHash, currHash) => {
	for (var key in currHash) {
		if (currHash.hasOwnProperty(key) && key !== 'year') {
			resHash[key].push(currHash[key]);
		}
	}
	return resHash;
};

const averageMonths = month => {
	const sum = month.reduce((sum, num) => sum + num, 0)
	return sum / month.length;
};

const setStableYrsAvg = sheet => {
	const result = { year: '2009-2018' };
	const toAvg = sheet.reduce(arrangeByMonth, emptyYear);
	for (var key in toAvg) {
		if (toAvg.hasOwnProperty(key)) {
			result[key] = averageMonths(toAvg[key]);
		}
	}
	return result;
};

/*
 * parseToSchema: Set data structure to following schema:
 * [
 *		{
 *			year: number,
 *			values: {
 *				month: string,
 *				rate: number,
 *			},
 *		},
 * ]
 */

const mapToMonthKeys = month => {
	const map = {
		january: 'Jan',
		february: 'Feb',
		march: 'Mar',
		april: 'Apr',
		may: 'May',
		june: 'Jun',
		july: 'Jul',
		august: 'Aug',
		september: 'Sep',
		october: 'Oct',
		november: 'Nov',
		december: 'Dec',
	};
	return map[month];
};

const mapObject = (obj, cb) => {
	var res = [];
	for (var key in obj) {
		if (obj.hasOwnProperty(key) && key !== 'year') {
			res.push(cb(obj[key], key));
		}
	}
	return res;
};

const parseToSchema = sheet => sheet.map((curr) => ({
	year: curr.year,
	values: mapObject(curr, (val, key) => ({
		month: mapToMonthKeys(key),
		rate: val,
	})),
}));

/*
 * Group the data to the chart's needs
 */

const splitDataToGroups = data => {
	const res = {
		stable: [],
		stableAverage: [],
		unstable: [],
	};
	return data.reduce((res, curr) => {
		if (curr.year === '2000-2013') {
			res.stableAverage.push(curr);
		} else if (curr.year === '2014' || curr.year === '2015' || curr.year === '2016' || curr.year === '2017') {
			res.unstable.push(curr);
		} else {
			res.stable.push(curr);
		}
		return res;
	}, res);
};

/*
 * Write to assets dir
 */

const writeToJSON = json => fs.writeFile('./app/assets/yoy-data.json', json, 'utf8', () => console.log('Done!'));

/*
 * Fire it up!
 */

const runSync = async () => {
	const sheet = await getSheet();
	const stableYrsAvg = setStableYrsAvg(sheet);
	sheet.push(stableYrsAvg);
	const data = parseToSchema(sheet);
	//const groupedData = splitDataToGroups(data);
	return writeToJSON(JSON.stringify(data));
};

runSync().catch(err => console.error(err)); 