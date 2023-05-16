import { Router } from "express";

const router = Router();

import DB from "../db.js";
import { QueryTypes } from "sequelize";

router.post("/nfc", async (req, res) => {
  const uid = req.body["?uid"];
  try {
    -console.log(req.body["?uid"]);

    await DB.conn.query("INSERT INTO nfc_tag (uid) VALUES (:nfc_uid)", {
      type: QueryTypes.INSERT,
      replacements: {
        nfc_uid: uid ?? 0,
      },
    });

    res.send({ Msg: "Se registro el dato: " + uid });
  } catch (error) {
    res.send({ Msg: "No se registro el dato: " + uid });
  }
});
router.get("/nfc", async (req, res) => {
  res.send({ Msg: "Esta en /test/nfc" });
});
export default router;
