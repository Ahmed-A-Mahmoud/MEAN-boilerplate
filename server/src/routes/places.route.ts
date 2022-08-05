import placesController from "@controllers/places.controller";
import authMiddleware from "@middlewares/auth.middleware";
import express from "express";

const router = express.Router();

router.get("/user/:uid", placesController.getPlacesByUserId);

router.get("/:pid", placesController.getPlaceById);

router.post("/", authMiddleware, placesController.createPlace);

router.patch("/:pid", authMiddleware, placesController.updatePlace);

router.delete("/:pid", authMiddleware, placesController.deletePlace);

export default router;
