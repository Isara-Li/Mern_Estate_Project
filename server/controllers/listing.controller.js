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
