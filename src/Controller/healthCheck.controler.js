import { asyncHandler } from "../utils/AsynceHandler.js";

import { ApiResponce } from "../utils/ApiResponce.js";

const healthcheck = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .json(new ApiResponce(200, { message: "Everything is O.K" }, "Ok"));
});

export { healthcheck };   