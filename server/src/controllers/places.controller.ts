import HttpError from "@exceptions/httpError";
import { RequestWithUser } from "@interfaces/auth.interface";
import { Place } from "@models/place.model";
import { User } from "@models/user.model";
import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";

const getPlaceById = async (req: Request, res: Response, next: NextFunction) => {
  const placeId = req.params.pid;

  let place: any;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError("Something went wrong, could not find a place.", 500);
    return next(error);
  }

  if (!place) {
    const error = new HttpError("Could not find place for the provided id.", 404);
    return next(error);
  }

  res.json({ place });
};

const getPlacesByUserId = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.params.uid;

  // let places;
  let userWithPlaces: any;
  try {
    userWithPlaces = await User.findById(userId).populate("places");
  } catch (err) {
    const error = new HttpError("Fetching places failed, please try again later.", 500);
    return next(error);
  }

  // if (!places || places.length === 0) {
  if (!userWithPlaces || userWithPlaces.places.length === 0) {
    return next(new HttpError("Could not find places for the provided user id.", 404));
  }

  res.json({ places: userWithPlaces.places });
};

const createPlace = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  const { title, description, address } = req.body;

  const createdPlace = new Place({
    title,
    description,
    address,
    creator: "62b578247ac36c1def8454f8",
  });

  let user: any;
  try {
    user = await User.findById("62b578247ac36c1def8454f8");
  } catch (err) {
    const error = new HttpError("Creating place failed, please try again.", 500);
    return next(error);
  }

  if (!user) {
    const error = new HttpError("Could not find user for provided id.", 404);
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdPlace.save({ session: sess });
    user.places.push(createdPlace);
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError("Creating place failed, please try again.", 500);
    return next(error);
  }

  // try {
  //   await createdPlace.save();
  //   user.places.push(createdPlace);
  //   await user.save();
  // } catch (err) {
  //   const error = new HttpError("Creating place failed, please try again.", 500);
  //   return next(error);
  // }

  res.status(201).json({ place: createdPlace });
};

const updatePlace = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  const { title, description } = req.body;
  const placeId = req.params.pid;

  let place: any;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError("Something went wrong, could not update place.", 500);
    return next(error);
  }

  if (place.creator.toString() !== req.user.id) {
    const error = new HttpError("You are not allowed to edit this place.", 401);
    return next(error);
  }

  place.title = title;
  place.description = description;

  try {
    await place.save();
  } catch (err) {
    const error = new HttpError("Something went wrong, could not update place.", 500);
    return next(error);
  }

  res.status(200).json({ place });
};

const deletePlace = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  const placeId = req.params.pid;

  let place: any;
  try {
    place = await Place.findById(placeId).populate("creator");
  } catch (err) {
    const error = new HttpError("Something went wrong, could not delete place.", 500);
    return next(error);
  }

  if (!place) {
    const error = new HttpError("Could not find place for this id.", 404);
    return next(error);
  }

  if (place.creator.id !== req.user.id) {
    const error = new HttpError("You are not allowed to delete this place.", 401);
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await place.remove({ session: sess });
    place.creator.places.pull(place);
    await place.creator.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError("Something went wrong, could not delete place.", 500);
    return next(error);
  }

  res.status(200).json({ message: "Deleted place." });
};

export default {
  getPlaceById,
  getPlacesByUserId,
  createPlace,
  updatePlace,
  deletePlace,
};
