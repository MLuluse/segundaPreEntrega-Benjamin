import logger from "../utils/logger.js"

export const loggerTestController = async (req, res) => {

    logger.debug("Debug")
    logger.http("Http")
    logger.info("Info")
    logger.warning("Warning")
    logger.error("Error")
    logger.fatal("Fatal")

  res.status(200).send('ok')

}
