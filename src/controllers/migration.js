import { db } from "../database/connection";

export const createTables = async (req, res) => {
    try {

        const tables = ` 
            create table if not exists bingos
            (
                id int auto_increment primary key not null,
                name varchar(40) not null,
                start datetime null,
                end datetime null,
                status boolean default true,
                created_at timestamp,
                updated_at datetime null,
                deleted_at datetime null
            );

            create table if not exists bingo_numbers
            (
                id int auto_increment primary key not null,
                bingo_id int not null,
                number int not null,
                status boolean default true,
                created_at timestamp,
                updated_at datetime null,
                deleted_at datetime null,
                constraint fk_bingo_id foreign key (bingo_id)
                references bingos(id)
            );

            create table if not exists bingo_primers
            (
                id int auto_increment primary key not null,
                bingo_id int not null,
                first_letter varchar(50) not null,
                second_letter varchar(50),
                third_letter varchar(50),
                fourth_letter varchar(50),
                fifth_letter varchar(50),
				status boolean default true,
                created_at timestamp,
                updated_at datetime null,
                deleted_at datetime null,
                constraint fk_bingo_primer_id foreign key (bingo_id)
                references bingos(id)
            );
        `;

        const response = await db.query(tables);

        return res.json(response)

    } catch (error) {
        throw new Error(error);
    }
}

export const spValidateIfNumberAlreadyExists = async () => {
    try {

        const procedure = `CREATE PROCEDURE sp_validate_if_number_already_exists(
            IN pInt_bingoCode INT,
            IN pInt_number INT
        )
        BEGIN
            
            DECLARE cant_saved INT DEFAULT 0;
            DECLARE numbers_saved JSON;
            
            SELECT COUNT(id) INTO cant_saved
            FROM bingo_numbers bn
            WHERE bn.bingo_id = pInt_bingoCode;
            
            SELECT 
                json_arrayagg(number) INTO numbers_saved 
            FROM bingo_numbers bn
            WHERE bn.bingo_id = pInt_bingoCode;
            
            SELECT
                bn.number,
                cant_saved,
                numbers_saved
            FROM bingo_numbers bn	
            WHERE bn.bingo_id = pInt_bingoCode
            AND bn.number = pInt_number;
        
        END`;

    } catch (error) {
        throw new Error(error);
    }
}

export const spCreateBingo = async () => {
    try {

        const procedure = `CREATE PROCEDURE sp_create_bingo(
            IN pVch_name VARCHAR(50)
        )
        BEGIN

        	INSERT INTO bingos
                    (
                        name,
                        start,
                        created_at
                    ) values
                        (
                            pVch_name,
                            NOW(),
                            NOW()
                        );

            SELECT LAST_INSERT_ID() AS last_code;

        END`;

    } catch (error) {
        throw new Error(error);
    }
}

export const spCreateBingoNumber = async () => {
    try {

        const procedure = `CREATE PROCEDURE sp_create_bingo_number(
            IN pInt_bingoCode INT,
            IN pInt_number INT
        )
        BEGIN

                    insert into bingo_numbers
            (
                bingo_id,
                number,
                created_at
            ) VALUES
                (
                    pInt_bingoCode,
                    pInt_number,
                    NOW()
                );

                    SELECT LAST_INSERT_ID AS last_code;
                
        END`;

    } catch (error) {
        throw new Error();
    }
}

export const spCreateBingoPrimer = async () => {
    try {

        const procedure = `CREATE PROCEDURE sp_create_bingo_primer(
            IN pInt_bingoCode INT,
            IN pVch_firstLetter VARCHAR(50),
            IN pVch_secondLetter VARCHAR(50),
            IN pVch_thirdLetter VARCHAR(50),
            IN pVch_fourthLetter VARCHAR(50),
            IN pVch_fifthLetter VARCHAR(50)
        )
        BEGIN
            
            INSERT INTO bingo_primers
            (
                bingo_id,
                first_letter,
                second_letter,
                third_letter,
                fourth_letter,
                fifth_letter,
                created_at
            ) values
            (
                pInt_bingoCode,
                pVch_firstLetter,
                pVch_secondLetter,
                pVch_thirdLetter,
                pVch_fourthLetter,
                pVch_fifthLetter,
                NOW()
            );
            
            SELECT LAST_INSERT_ID() AS last_code;
        
        END`;

    } catch (error) {
        throw new Error(error);
    }
}