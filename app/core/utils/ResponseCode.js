class ResponseCode {
  successGet(req, res, message, data) {
    return res.status(200).json({
      status: true,
      message: message,
      data: data,
    });
  }
  successPost(req, res, message) {
    return res.status(201).json({
      status: true,
      message: message,
    });
  }
  errorPost(req, res, message) {
    return res.status(400).json({
      status: false,
      message: message,
    });
  }
}

module.exports = new ResponseCode();
