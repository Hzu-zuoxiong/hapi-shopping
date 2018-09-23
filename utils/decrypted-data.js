const crypto = require('crypto');

const  decryptData = (encryptedData, iv, sessionKey, appid) => {
	const encryptedDataNew = Buffer.from(encryptedData, 'base64');
	const sessionKeyNew = Buffer.from(sessionKey, 'base64');
	const ivNew = Buffer.from(iv, 'base64');

	let decoded = '';

	try {
		const decipher = crypto.createDecipheriv('aes-128-cbc', sessionKeyNew, ivNew);
		decipher.setAutoPadding(true);
		decoded = decipher.update(encryptedDataNew, 'binary', 'utf8');
		decoded += decipher.final('utf8');
		decoded = JSON.parse(decoded);
	} catch(err) {
		throw new Error('Illegal Buffer');
	}

	if(decoded.watermark.appid !== appid) {
		throw new Error('Illegal Buffer');
	}

	return decoded;
}

module.exports = decryptData;