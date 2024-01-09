export const createListing = async (req, res, next) => {
  try {
    const newListing = new Listing.create(req.body);
  } catch (error) {
    next(error);
  }
};
