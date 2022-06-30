import { config } from 'dotenv';
import { environemnt as prodEnvironment } from './environment';
import { environemnt as devEnvironment } from './environment.dev'
import { environemnt as testEnvironment } from './environment.tests'

config();

export const env =
    process.env.ENVIRONMENT == 'prod' ?
        prodEnvironment :
        process.env.ENVIRONMENT == 'dev' ? devEnvironment :
            testEnvironment;




