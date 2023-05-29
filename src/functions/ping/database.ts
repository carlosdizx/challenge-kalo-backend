import getConnect from "../../utils/DatabaseConnection";
import responseObject from "../../utils/Response";

export const handler = async (event, context) => {
    console.log(`HANDLER: Starting ${context.functionName}...`);
    try {
        const datasource = await getConnect();
        await datasource.manager.query(`SELECT 1`);
        return responseObject(200, {message: 'Ping success!'})
    }
    catch (e) {
        return responseObject(500, {message: 'Failed to establish a database connection.'})
    }
};
