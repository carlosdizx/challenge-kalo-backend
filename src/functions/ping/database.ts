import getConnect from "../../utils/DatabaseConnection";

export const handler = async (event, context) => {
    console.log(`HANDLER: Starting ${context.functionName}...`);
    try {
        const datasource = await getConnect();
        await datasource.manager.query(`SELECT 1`);
        return {
            statusCode: 200,
            body: JSON.stringify({message: 'Ping success!'})
        }
    }
    catch (e) {
        return {
            statusCode: 500,
            body: JSON.stringify({message: "Failed to establish a database connection."})
        }
    }
};
