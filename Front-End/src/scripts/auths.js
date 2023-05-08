const { UsuariosAPI } = require("./apiConn");

export const verifyUser = async () => {
  const token = localStorage.getItem("LC_api_Token");

  if (!token) return null;

  const res = await fetch(UsuariosAPI + "/auth", {
    method: "POST",
    headers: {
      "x-access-token": token,
    },
  });
  return await res.json();
};
