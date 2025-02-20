const { sql } = require("../dbConnection.js");

// NOT FINISHED YET
exports.getAllExcursions = async () => {
  const excursions = await sql.begin(async () => {
    let excursions = await sql`
    SELECT excursions.*, categories.category AS category
    FROM excursions
    JOIN categories
    ON excursions.category_id = categories.id   
  `;

    excursions = await Promise.all(
      excursions.map(async (excursion) => {
        const dates = await sql`
        SELECT dates.date
        FROM dates
        JOIN excursions_dates
        ON dates.id = excursions_dates.date_id
        WHERE excursion_id = ${excursion.id}
        GROUP BY excursions_dates.excursion_id, dates.date
      `;

        excursion.dates = dates.map((date) => date.date);

        return excursion;
      })
    );

    return excursions;
  });

  return excursions;
};

exports.createExcursion = async (excursion) => {
  const { title, photo_url, duration, price, category_id, dates } = excursion;

  const newExcursion = await sql.begin(async () => {
    const [excursion] = await sql`
        INSERT INTO excursions (title, photo_url, duration, price, category_id)
        SELECT ${title}, ${photo_url}, ${duration}, ${price}, ${category_id}
        RETURNING *
      `;

    const availableDates = await Promise.all(
      dates.map(async (date) => {
        let [excursionDate] = await sql`
              INSERT INTO dates (date) 
              SELECT ${date}
              WHERE NOT EXISTS (
                SELECT id
                FROM dates
                WHERE date = ${date}
              )
              RETURNING *
            `;

        if (!excursionDate) {
          [excursionDate] = await sql`
                SELECT *
                FROM dates
                WHERE date = ${date}
                `;
        }

        return excursionDate;
      })
    );

    availableDates.forEach(async (date) => {
      await sql`
          INSERT INTO excursions_dates (excursion_id, date_id)
          SELECT ${excursion.id}, ${date.id}
          WHERE NOT EXISTS (
            SELECT id
            FROM excursions_dates
            WHERE excursion_id = ${excursion.id} AND date_id = ${date.id}
          )
        `;
    });

    excursion.dates = availableDates.map((date) => date.date);

    return excursion;
  });

  return newExcursion;
};
