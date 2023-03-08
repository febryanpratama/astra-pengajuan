const { default: axios } = require("axios");
const jwt = require("jsonwebtoken");
const ResponseCode = require("../../../core/utils/ResponseCode");

exports.login = async (req, res) => {
  let data = req.body;

  const response = await axios.post(
    "https://asmokalbarmobile.com/api/auth/login",
    {
      email: data.email,
      password: data.password,
    }
  );

  const respAkun = {
    id: response.data.data.id,
    email: response.data.data.email,
    departemen: response.data.data.departemen,
    roles: response.data.data.roles,
  };

  const token = jwt.sign(respAkun, "SecretPharse", {
    expiresIn: "1d",
  });

  const respData = {
    token: token,
    id: response.data.data.id,
    email: response.data.data.email,
    nama: response.data.data.name,
    departemen: response.data.data.departemen,
    roles: response.data.data.roles,
  };

  return ResponseCode.successGet(req, res, "Login Success", respData);
};
