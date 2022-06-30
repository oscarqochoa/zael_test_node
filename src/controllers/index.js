import { db } from "../database/connection"

export const createBingo = async (req, res) => {
    try {

        const response = await db.query('CALL sp_create_bingo(:name)',
            { replacements: { name: req.body.name } })

        res.json({
            code: response[0].last_code,
            message: "Bingo created"
        });

    } catch (error) {
        throw new Error(error);
    }
}

export const getNumber = async (req, res) => {
    try {

        const bingoId = parseInt(req.params.id);
        const number = Math.floor(Math.random() * (75 - 1 + 1)) + 1;

        const response = await db.query('CALL sp_validate_if_number_already_exists (:bingo_code, :number)',
            { replacements: { bingo_code: bingoId, number: number } })

        let data = {};

        if (response.length > 0) {
            if (response[0].cant_saved == 75) {
                return res.json({ message: "The bingo is complete", data: response[0] });
            }

            return getNumber(req, res);
        } else {
            const insert = await db.query('CALL sp_create_bingo_number (:bingo_code, :number)',
                { replacements: { bingo_code: bingoId, number: number } })

            data = { new_number: number, data: insert[0] };
        }

        res.json(data);

    } catch (error) {
        throw new Error(error);
    }
}

export const generateCard = async (req, res) => {
    try {

        const bingoId = parseInt(req.params.id);

        let template = [
            { start: 1, end: 15 },
            { start: 16, end: 30 },
            { start: 31, end: 45 },
            { start: 46, end: 60 },
            { start: 61, end: 75 },
        ];

        let data = [[], [], [], [], []]

        template.forEach((item, index) => {
            const letterNumbers = new Set();

            for (let cont = 0; cont < 15; cont++) {
                const number = Math.floor(Math.random() * (item.end - item.start + 1)) + item.start;

                if (letterNumbers.size < 5) {
                    letterNumbers.add(number);
                }
            }

            data[index].push(Array.from(letterNumbers));
        })

        data[2][0][2] = "Bingo";

        const response = await db.query('CALL sp_create_bingo_primer (:bingo_code, :first_letter, :second_letter, :third_letter, :fourth_letter, :fifth_letter)',
            {
                replacements: {
                    bingo_code: bingoId,
                    first_letter: data[0][0].toString(),
                    second_letter: data[1][0].toString(),
                    third_letter: data[2][0].toString(),
                    fourth_letter: data[3][0].toString(),
                    fifth_letter: data[4][0].toString()
                }
            }
        )

        res.json({
            code: response[0].last_code,
            bingo: {
                B: data[0][0],
                I: data[1][0],
                N: data[2][0],
                G: data[3][0],
                O: data[4][0]
            },
            bingo_string: {
                B: data[0][0].toString(),
                I: data[1][0].toString(),
                N: data[2][0].toString(),
                G: data[3][0].toString(),
                O: data[4][0].toString()
            }
        })

    } catch (error) {
        throw new Error(error);
    }
}

export const checkWinner = async (req, res) => {
    try {

        const bingoId = parseInt(req.params.id);

        const response = await db.query('select json_arrayagg(number) as numbers from bingo_numbers where bingo_id = (:bingo_code) group by bingo_id',
            {
                replacements: {
                    bingo_code: bingoId
                }
            }
        )

        const typeParam = typeof req.body.numbers;
        let arrNumbers = "";
        let success = true;

        if (typeParam == "string") {
            arrNumbers = req.body.numbers.split(",");
        } else {
            arrNumbers = req.body.numbers;
        }

        if (arrNumbers.length < 24) {
            return res.json({ message: "The card is not complete" })
        }

        arrNumbers.forEach((item, index) => {
            if (!response[0][0].numbers.includes(parseInt(item))) {
                success = false;
            }
        })

        if (!success) {
            return res.json({ message: "The numbers are not complete" })
        }

        return res.json({ message: "The user has won" })

    } catch (error) {
        throw new Error(error);
    }
}