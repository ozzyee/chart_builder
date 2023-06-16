import pg from 'pg';

export default async function handler(req, res) {
    const {Pool} = pg;
    const pool = new Pool({
        connectionString: process.env.POSTGRES_URL + "?sslmode=require",
    })
    const client = await pool.connect();

    const config = req.query.v || 1

    console.log(config)

    switch (req.method) {
        case 'GET':
            const result = await client.query('SELECT * FROM config WHERE ID = $1', [Number(config)]);
            res.status(200).json({
                method: 'GET', data: {
                    value: JSON.parse(result.rows[0].value)
                }
            });
            break;
        case 'POST':
            await client.query('UPDATE config SET value = $1 WHERE ID = $2', [req.body.value, Number(config)]);
            res.status(200).json({method: 'POST', body: req.body});
    }
}