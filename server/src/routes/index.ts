import express from "express";
import placesRoutes from "@routes/places.route";
import userRoutes from "@routes/users.route";
import notFoundMiddleware from "@middlewares/notFound.middleware";

const router = express.Router();

router.use("/api/places", placesRoutes);
router.use("/api/users", userRoutes);

router.use("*", notFoundMiddleware);

export default router;
