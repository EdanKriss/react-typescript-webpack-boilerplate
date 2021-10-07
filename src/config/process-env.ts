import { getTimestamp } from '@src/utils/date';

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            API_URL: string;
            ASSET_PATH: string;
            NODE_ENV: 'development' | 'production';
        }
    }
}

function validateENV(): void {
    console.log(`${getTimestamp()} Starting ENV validation script.`);
    const narrowedEnv: NodeJS.ProcessEnv = {
        API_URL: process.env.API_URL,
        ASSET_PATH: process.env.ASSET_PATH,
        NODE_ENV: process.env.NODE_ENV,
    }
    if (
        !narrowedEnv.API_URL ||
        !narrowedEnv.ASSET_PATH ||
        !narrowedEnv.NODE_ENV
    ) {
        console.error("**** CRITICAL ERROR **** Missing ENV variables. process.env:", narrowedEnv);
        throw "**** CRITICAL ERROR **** Missing ENV variables.";
    } else if (process.env.NODE_ENV === 'development') {
        console.log("ENV variables:", narrowedEnv);
    }
}

export {
    validateENV,
}