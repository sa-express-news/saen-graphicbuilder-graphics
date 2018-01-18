/* await/async requires node@7.6^ */

require('dotenv').config(); // store ure API key in .env under API_KEY key
const apiKey = process.env.API_KEY;

const rp 	= require('request-promise');
const fs 	= require('fs');

/*
 * Pull the sheets from data.world
 */

const getSQLQuery = () => encodeURIComponent(`SELECT * FROM all_sector_comparison`);

const setGETConfigObj = () => ({
	uri: `https://api.data.world/v0/sql/lukewhyte/border-patrol-apprehensions-mexico-vs-not-mexico-2000-2017?query=${getSQLQuery()}`,
	headers: {
		'Authorization': `Bearer ${apiKey}`,
		'Accept': 'application/json',
	},
	json: true,
});

const getSheet = () => rp(setGETConfigObj()).catch(err => console.error(err));

/*
 * parse to needed data structure
 */

const parseToSchema = sheet => {
	const regions = [
		{ key: 'mexico', val: 'Mexico' },
		{ key: 'not_mexico', val: 'Not Mexico' },
	];
	return regions.map(region => ({
		region: region.val,
		values: sheet.map(curr => ({
			year: curr.year,
			val: curr[region.key]
		})),
	}));
};

/*
 * Write to assets dir
 */

const writeToJSON = json => fs.writeFile('./app/assets/mx-or-not-data.json', json, 'utf8', () => console.log('Done!'));

/*
 * Fire it up!
 */

const runSync = async () => {
	const sheet = await getSheet();
	const data = parseToSchema(sheet.sort((a,b) => a.year - b.year));
	return writeToJSON(JSON.stringify(data));
};

runSync().catch(err => console.error(err)); 