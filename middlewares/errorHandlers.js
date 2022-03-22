const errorHandler = (err, req, res, next) => {

  switch (err.name) {
    case "SequelizeValidationError":
      res.status(400).json({ message: err.errors[0].message });
      break;
    case "SequelizeUniqueConstraintError":
      res.status(400).json({ message: err.errors[0].message });
      break;
    case "NOT_FOUND":
      res.status(err.code).json({ message: err.message });
      break;
    case "UNAUTHORIZED":
      res.status(err.code).json({ message: err.message });
      break;
    case "FORBIDDEN":
      res.status(err.code).json({ message: err.message });
      break;
    case "INVALID_TOKEN":
      res.status(err.code).json({ message: err.message });
      break;
    case "JsonWebTokenError":
      res.status(400).json({ message: err.message });
      break;
    case "BAD_REQUEST":
      res.status(err.code).json({ message: err.message });
      break;
    case "MidtransError":
      res
        .status(+err.ApiResponse.status_code)
        .json({ message: err.ApiResponse.status_message });
      break;
    case "FORBIDDEN":
      res.status(err.code).json({ message: err.message });
      break;
    default:
      console.log(err)
      res.status(500).json({ message: "Internal Server Error" });
      break;
  }
};

module.exports = errorHandler;
