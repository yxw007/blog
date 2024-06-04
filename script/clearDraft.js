const fs = require("fs-extra");
const { log, getDraftDir } = require("./utils");

fs.emptyDirSync(getDraftDir());
log.info("The draftDir has bean cleared !");
