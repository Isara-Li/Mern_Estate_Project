import Listing from "../models/listing.model.js";

export const createListing = async (req, res, next) => {
  try {
    console.log(req.body);
    const newListing = await Listing.create(req.body);
    console.log("Isara");
    console.log(newListing);
    return res.status(200).json(newListing);
  } catch (error) {
    next(error);
  }
};

export const deleteListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  if (req.user.id !== listing.userRef) {
    return next(
      new Error("You are not allowed to delete the listing of this user!")
    );
  }
  if (!listing) {
    return next(new Error("No listing found!"));
  }
  try {
    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json({
      message: "Listing has been deleted...",
    });
  } catch (error) {
    next(error);
  }
};
