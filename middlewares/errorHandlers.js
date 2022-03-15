const errorHandler = (err, req, res, next) => {
  let errors;
  switch (err.name) {
    case "SequelizeValidationError":
      errors = err.errors.map((el) => el.message);
      res.status(400).json({ message: errors });
      break;
    case "SequelizeUniqueConstraintError":
      errors = err.errors.map((el) => el.message);
      res.status(400).json({ message: errors });
      break;
    case "NOT_FOUND":
      res.status(err.code).json({ message: err.message });
      break;
    case "UNAUTHORIZED":
      res.status(err.code).json({ message: err.message });
      break;
    case "INVALID_TOKEN":
      res.status(err.code).json({ message: err.message });
      break;
    case "FORBIDDEN":
      res.status(err.code).json({ message: err.message });
      break;
    case "JsonWebTokenError":
      res.status(400).json({ message: err.message });
      break;
    case "TokenExpiredError":
      res.status(400).json({ message: err.message });
      break;
    default:
      console.log(err);
      res.status(500).json({ message: "Internal Server Error" });
      break;
  }
};

//ganti jadi switch case

module.exports = errorHandler;
