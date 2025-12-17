//protect file
const protect = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};

export default protect;
