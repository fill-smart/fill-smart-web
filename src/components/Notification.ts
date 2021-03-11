import { notification } from "antd";

const createNotification = (
    type: "success" | "error" | "warn" | "warning" | "info",
    message: string,
    description: string
) => {
    (<any>notification)[type]({
        message,
        description
    });
};
export default createNotification;
