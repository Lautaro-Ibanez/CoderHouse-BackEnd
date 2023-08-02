import EErrors from "../../services/errors/EEnum.js";

export default (error, req, res, next) => {
  console.log(error)
  switch (error.code) {
    case EErrors.INCOMPLETE_VALUES_ERROR:
      res.status(error.status).send({ status: "error", error:error.message });
      break;
    case EErrors.DATABASE_ERROR:
      res.status(error.status).send({ status: "error", error:error.message });
      break;
  }
};
