import fs from "fs-extra";
import { log, getDraftDir } from "./utils.js";

fs.emptyDirSync(getDraftDir());
log.info("The draftDir has bean cleared !");

