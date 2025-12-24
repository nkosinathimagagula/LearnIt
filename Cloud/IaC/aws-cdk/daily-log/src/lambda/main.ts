import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log("Event: \n" + JSON.stringify(event, null, 2));

    const { httpMethod } = event;

    let responseBody;
    let statusCode = 200;
    let headers = {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
    };
    
    try {
        switch (httpMethod) {
            case "GET":
                responseBody = { message: "Get request received", data: "This is a placeholder for GET response" };
                break;
            default:
                statusCode = 405;
                responseBody = { message: "Unsupported HTTP method" };
        }
    } catch (error) {
        console.error("Error processing request:", error);
        responseBody = { message: "Internal Server Error" };
        statusCode = 500;
    }

    return {
        statusCode,
        headers,
        body: JSON.stringify(responseBody)
    }
}