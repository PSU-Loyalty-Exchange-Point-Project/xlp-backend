const fs = require('fs');
const countryCodesObjectsList = JSON.parse(fs.readFileSync('./staticData/countryCodes.json'));

function countryCodeExists(countryCode) {
    console.log(`Checking if +${countryCode} exists`)
	return countryCodesObjectsList.some(country => country.dial_code === `+${countryCode}`);
}

module.exports = { countryCodeExists };