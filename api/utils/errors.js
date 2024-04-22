const errorCodes = {
  NotExist: {
    errNum: 201,
    errCode: "NotExist",
    message: "Something parameter doesn't exist",
  },
  AlreadyExists: {
    errNum: 202,
    errCode: "OrderAlreadyExists",
    message: "Something parameter already exists",
  },
  Missing: {
    errNum: 203,
    errCode: "Missing",
    message: "Something parameter are missing",
  },
  Invalid: {
    errNum: 204,
    errCode: "Invalid",
    message: "Some parameter is invalid",
  },
};

const errorStatuses = {
  [errorCodes.NotExist.errNum]: 404,
  [errorCodes.AlreadyExists.errNum]: 409,
  [errorCodes.Missing.errNum]: 400,
  [errorCodes.Invalid.errNum]: 400,
};

// errors for application ui
class AppError extends Error {
  constructor(obj, status = null) {
    super(obj.message);

    this.errNum = obj.errNum;
    this.errCode = obj.errCode;
    this.field = obj.field;

    this.key = obj.key ?? "APP_ERROR";

    this.status = status ?? errorStatuses[obj.errNum] ?? 400;
  }

  toJSON() {
    return {
      errNum: this.errNum,
      errCode: this.errCode,
      message: this.message,
      field: this.field,
      key: this.key,
    };
  }
}

class AppErrorMissing extends AppError {
  constructor(parameter = "Some", status, key) {
    super(
      {
        ...errorCodes.Missing,
        message: `${parameter} parameter is missing`,

        key: key ?? `MISSING_${toSnakeCase(parameter).toUpperCase()}`,
      },
      status
    );
  }
}

class AppErrorInvalid extends AppError {
  constructor(parameter = "Some", status, key) {
    super(
      {
        ...errorCodes.Invalid,
        message: `${parameter} parameter is invalid`,

        key: key ?? `INVALID_${toSnakeCase(parameter).toUpperCase()}`,
      },
      status
    );
  }
}

class AppErrorAlreadyExists extends AppError {
  constructor(parameter = "Some", status, key) {
    super(
      {
        ...errorCodes.AlreadyExists,
        message: `${parameter} entity already exists`,

        key: key ?? `EXISTS_${toSnakeCase(parameter).toUpperCase()}`,
      },
      status
    );
  }
}

class AppErrorNotExist extends AppError {
  constructor(parameter = "Some", status, key) {
    super(
      {
        ...errorCodes.NotExist,
        message: `${parameter} entity not exist`,

        key: key ?? `DOES_NOT_EXIST_${toSnakeCase(parameter).toUpperCase()}`,
      },
      status
    );
  }
}

function asyncRoute(route) {
  return (req, res, next = console.error) => {
    return Promise.resolve(route(req, res, next)).catch((e) => next(e));
  };
}

export {
  asyncRoute,
  errorCodes,
  AppError,
  AppErrorMissing,
  AppErrorInvalid,
  AppErrorAlreadyExists,
  AppErrorNotExist,
};

function toSnakeCase(str = "") {
  if (!str) return "";

  return String(str)
    .replace(/^[^A-Za-z0-9]*|[^A-Za-z0-9]*$/g, "")
    .replace(/([a-z])([A-Z])/g, (m, a, b) => `${a}_${b.toLowerCase()}`)
    .replace(/[^A-Za-z0-9]+|_+/g, "_")
    .toLowerCase();
}
