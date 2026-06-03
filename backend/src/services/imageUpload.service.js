const imagekit = require("../config/imagekit.config");

async function uploadFile(file, folder) {
	return await imagekit.upload({
		file: file.buffer,
		fileName: file.originalname,
		folder: `/${folder}`,
	});
}

module.exports = uploadFile;
