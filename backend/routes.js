module.exports = function(app, dbConn) {
  // Retrieve all receipts
  app.get("/receipts", function(req, res) {
    dbConn.query("SELECT * FROM receipts", function(error, results, fields) {
      if (error) throw error;
      return res.send({
        error: false,
        success: true,
        data: results,
        message: "receipts list."
      });
    });
  });

  // // Retrieve receipts with id
  app.get("/receipts/:id", function(req, res) {
    let receipt_id = req.params.id;

    if (!receipt_id) {
      return res
        .status(400)
        .send({ error: true, message: "Please provide receipt_id" });
    }

    dbConn.query("SELECT * FROM receipts where id=?", receipt_id, function(
      error,
      results,
      fields
    ) {
      if (error) throw error;
      return res.send({
        error: false,
        success: true,
        data: results[0],
        message: "receipts list."
      });
    });
  });

  // Add a new receipt
  app.post("/receipts", function(req, res) {
    let receipt = req.body;

    if (!receipt) {
      return res
        .status(400)
        .send({ error: true, message: "Please provide receipt" });
    }
    if (!receipt.title) {
      return res
        .status(422)
        .send({ error: true, message: "Please provide receipt title" });
    }
    if (!receipt.description) {
      return res
        .status(422)
        .send({ error: true, message: "Please provide receipt description" });
    }

    dbConn.query("INSERT INTO receipts SET ? ", receipt, function(
      error,
      results,
      fields
    ) {
      if (error) throw error;

      dbConn.query(
        "SELECT * FROM receipts where id=?",
        results.insertId,
        function(error, results, fields) {
          if (error) throw error;
          return res.send({
            error: false,
            success: true,
            data: results[0],
            message: "inserted receipt"
          });
        }
      );
    });
  });

  //  Update receipt with id
  app.put("/receipts/:id", function(req, res) {
    let receipt_id = req.params.id;
    let receipt = req.body;

    if (!receipt_id || !receipt) {
      return res.status(400).send({
        error: receipt,
        message: "Please provide receipt and receipt_id"
      });
    }

    dbConn.query(
      `UPDATE receipts SET title="${receipt.title}", description="${receipt.description}" WHERE id =?`,
      receipt_id,
      function(error, results, fields) {
        if (error) throw error;

        dbConn.query("SELECT * FROM receipts where id=?", receipt_id, function(
          error,
          results,
          fields
        ) {
          if (error) throw error;
          return res.send({
            error: false,
            success: true,
            data: results[0],
            message: "receipt has been updated successfully."
          });
        });
      }
    );
  });

  // Delete user
  app.delete("/receipts/:id", function(req, res) {
    let receipt_id = req.params.id;

    if (!receipt_id) {
      return res
        .status(400)
        .send({ error: true, message: "Please provide receipt_id" });
    }
    dbConn.query("DELETE FROM receipts WHERE id = ?", [receipt_id], function(
      error,
      results,
      fields
    ) {
      if (error) throw error;
      return res.send({
        error: false,
        data: {
          id: receipt_id
        },
        message: "Receipt has been deleted successfully."
      });
    });
  });
};
