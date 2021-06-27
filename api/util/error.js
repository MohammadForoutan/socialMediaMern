exports.expressErrHandler = (error, next) => {
	const err = new Error(error);
	err.httpStatusCode = 500;
	return next(err);
};
