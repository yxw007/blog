const { glob } = require("fast-glob");
const fs = require("fs-extra");
const compressing = require("compressing");
const { getDraftDir, log } = require("./utils");

const draftDir = getDraftDir();

async function run() {
	try {
		const res = await glob(`${draftDir}/*.zip`);
		if (res.length == 0) {
			log.warn("not found any zip file in draftDir:", draftDir);
			return;
		}
		await compressing.zip.decompress(res[0], draftDir);
		await fs.rm(res[0]);
		log.info("mdzip to article success !");
	} catch (error) {
		log.error("mdzip to article failed ! ", error);
	}
}

run();
