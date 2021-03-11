import { Modal, Form } from "antd";
import React, { useEffect } from "react";
import { ICustomerModel } from "../../interfaces/models/customer.model";
import useCustomerByDocument from "../../hooks/use-customer-by-document";
import LoaderComponent from "../../components/utility/loader.style";

const centerContainer = {
    margin: "0 auto",
    textAlign: "center"
};

const padding20 = {
    padding: "10px"
};

export const CustomerDocument = ({
    opened,
    customer,
    onClose
}: {
    opened?: boolean;
    customer: Partial<ICustomerModel> | undefined;
    onClose: () => void;
}) => {
    const { execute, refetch, result, called, loading } = useCustomerByDocument(
        customer?.documentNumber!
    );
    useEffect(() => {
        execute();
    }, []);

    return (
        <Modal
            onCancel={onClose}
            visible={opened}
            title={`Cliente ${customer?.firstName}  ${customer?.lastName}  -  Documento Nro.: ${customer?.documentNumber}`}
            footer={null}
        >
            {loading ? (
                <LoaderComponent />
            ) : result?.customer ? (
                <>
                    <div style={centerContainer as any}>
                        <div style={padding20}>
                            <img
                                style={{ width: "100%" }}
                                src={`data:image/jpeg;base64,${result.customer.documents[0].image.base64}`}
                            />
                        </div>
                    </div>
                    <div style={centerContainer as any}>
                        <div style={padding20}>
                            <img
                                style={{ width: "100%" }}
                                src={`data:image/jpeg;base64,${result.customer.documents[1].image.base64}`}
                            />
                        </div>
                    </div>
                </>
            ) : null}
        </Modal>
    );
};

export default CustomerDocument;
