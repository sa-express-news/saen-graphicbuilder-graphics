/* await/async requires node@7.6^ */

require('dotenv').config(); // store ure API key in .env under API_KEY key
const apiKey = process.env.API_KEY;

const rp 	= require('request-promise');
const fs 	= require('fs');

/*
 * Pull the sheets from data.world
 */

const getSQLQuery = () => encodeURIComponent(`SELECT * FROM yoy_increase_and_decrease_data`);

const setGETConfigObj = () => ({
	uri: `https://api.data.world/v0/sql/lukewhyte/border-patrol-sw-sector-monthly-apprehension-data-2000-2017?query=${getSQLQuery()}`,
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
	october: [],
	november: [],
	december: [],
	january: [],
	february: [],
	march: [],
	april: [],
	may: [],
	june: [],
	july: [],
	august: [],
	september: [],
};

const arrangeByMonth = (resHash, currHash) => {
	if (currHash.year !== '2014' && currHash.year !== '2015' && currHash.year !== '2016' && currHash.year !== '2017') {
		for (var key in currHash) {
			if (currHash.hasOwnProperty(key) && key !== 'year') {
				resHash[key].push(currHash[key]);
			}
		}
	}
	return resHash;
};

const averageMonths = month => {
	const sum = month.reduce((sum, num) => sum + num, 0)
	return sum / month.length;
};

const setStableYrsAvg = sheet => {
	const result = { year: 'average' };
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
		month: key,
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
		if (curr.year === 'average') {
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