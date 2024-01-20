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

export const updateListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    return next(new Error("No listing found!"));
  }
  if (req.user.id !== listing.userRef) {
    return next(
      new Error("You are not allowed to update the listing of this user!")
    );
  }
  try {
    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true, // to get the new updated listing
        runValidators: true,
      }
    );
    res.status(200).json(updatedListing);
  } catch (error) {
    next(error);
  }
};

export const getListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return next(new Error("No listing found!"));
    }
    res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
};

export const getListings = async (req, res, next) => {
  // Query is the part of the url after the ? sign
  try {
    const limit = req.query.limit || 9; // items we get per page .
    const startIndex = req.query.startIndex || 0; // page number
    let offer = req.query.offer;

    if (offer === "false" || offer === undefined) {
      offer = { $in: [true, false] }; // if offer is not defined or false, we get all listings. 'in' is a mongoDB operator
    }

    let furnished = req.query.furnished;
    if (furnished === "false" || furnished === undefined) {
      furnished = { $in: [true, false] }; // if furnished is not defined or false, we get all listings. 'in' is a mongoDB operator
    }

    let parking = req.query.parking;
    if (parking === "false" || parking === undefined) {
      parking = { $in: [true, false] }; // if parking is not defined or false, we get all listings. 'in' is a mongoDB operator
    }

    let type = req.query.type;
    if (type === undefined || type === "all") {
      type = { $in: ["sale", "rent"] }; // if type is not defined, we get all listings. 'in' is a mongoDB operator
    }

    const searchterm = req.query.searchterm || "";
    const sort = req.query.sort || "createdAt"; // sort by date by default
    const order = req.query.order || "desc"; // descending order by default

    const listing = await Listing.find({
      name: { $regex: searchterm, $options: "i" }, // i means case insensitive and regex means search everywhere in the title
      offer,
      furnished,
      parking,
      type,
    })
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex); //

    return res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
};
