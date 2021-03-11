import React, { useState, useContext, useEffect } from "react";
import { LayoutContentWrapper } from "../../components/utility/layoutWrapper.style";
import PageHeader from "../../components/utility/pageHeader";
import { Row, Col, Tooltip, Tag } from "antd";
import basicStyle from "../../assets/styles/constants";
import { TextCell } from "../../components/Tables/HelperCells";
import { TableViews } from "../Tables/AntTables/AntTables";
import IsoWidgetsWrapper from "../Widgets/WidgetsWrapper";
import IsoWidgetBox from "../Widgets/WidgetBox";
import Loader from "../../components/utility/loader";
import useCustomers, { useCustomersLazy } from "../../hooks/use-customers.hook";
import { CustomerAccountStatusEnum, ICustomerModel } from "../../interfaces/models/customer.model";
import { DateUtils } from "@silentium-apps/fill-smart-common";
import { ActionWrapper, ButtonWrapper, ButtonHolders, ActionBtn } from "../Stations/Stations.styles";
import { CustomerEdit } from "./CustomersEdit";
import CustomerDocument from "./CustomerDocument";
import { QueryCriteria, FilteredTable } from "../../core/FilteredTable";
import { IAndFilterCriteria, FilterTypesEnum } from "../../core/filters";
import { DateFilter, createTextFilter } from "../../components/Tables/Filters";
import { Link } from "react-router-dom";
import { PRIVATE_ROUTE } from "../../route.constants";
import { SecurityContext, RolesEnum } from "../../contexts/security.context";
import FileSaver from "file-saver";
import moment from "moment";
import Excel from "exceljs";


const { rowStyle, colStyle } = basicStyle;

type CustomerViewModel = Pick<
    ICustomerModel,
    | "id"
    | "firstName"
    | "lastName"
    | "created"
    | "documentNumber"
    | "born"
    | "phone"
    | "user"
    | "cbu"
    | "cbuAlias"
    | "mercadopagoAccount"
    | "status"
>;

const Customers = () => {
    const [security] = useContext(SecurityContext);
    const [modalOpened, setModalOpened] = useState(false);
    const [modalDocumentOpened, setModalDocumentOpened] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState<CustomerViewModel | undefined>();

    /*Criteria*/
    const [tableCriteria, setTableCriteria] = useState<QueryCriteria>({
        pagination: {
            current: 1,
            pageSize: 10
        },
        sort: [],
        filter: undefined
    })
    const { pagination, ...tableCriteriaWithoutPagination } = tableCriteria;
    const allCustomersHook = useCustomersLazy(tableCriteriaWithoutPagination);
    const [generateExcelClicked, setGenerateExcelClicked] = useState<boolean>(false);
    const [otherFiltersRaw, setOtherFiltersRaw] = useState<any>();
    const [otherFilters, setOtherFilters] = useState<IAndFilterCriteria | undefined>()
    /*End Criteria*/
    const { customers, loading, total } = useCustomers(tableCriteria);

    const onGenerateExcelClicked = () => {
        setGenerateExcelClicked(true);
        if (allCustomersHook.customers) {
            generateExcel()
        }
        else {
            allCustomersHook.execute();
        }
    }

    useEffect(() => {
        if (allCustomersHook.customers && generateExcelClicked) {
            generateExcel();
        }
    }, [allCustomersHook.customers]);

    const generateExcel = async () => {
        setGenerateExcelClicked(false);
        const workbook = new Excel.Workbook();
        const sheet = workbook.addWorksheet('Clientes');

        sheet.columns = [
            { header: 'Documento', key: 'documentNumber' },
            { header: 'Nombre', key: 'firstName' },
            { header: 'Apellido', key: 'lastName' },
            { header: 'Fecha de Nacimiento', key: 'born' },
            { header: 'Telefono', key: 'phone' },
            { header: 'Email', key: 'email' },
            { header: 'Fecha de Registro', key: 'created' },
            { header: 'CBU', key: 'cbu' },
            { header: 'Alias', key: 'cbuAlias' },
            { header: 'Mercado Pago', key: 'mercadopagoAccount' },
        ];

        sheet.addRows(allCustomersHook.customers!.map(c => [
            c.documentNumber,
            c.firstName,
            c.lastName,
            DateUtils.format(c?.born, "DD/MM/YYYY"),
            c?.phone,
            c?.user.username,
            DateUtils.format(c?.created, "DD/MM/YYYY hh:mm"),
            c.cbu,
            c.cbuAlias,
            c.mercadopagoAccount,
        ]));

        sheet.columns.forEach(function (column) {
            var dataMax = 0;
            column.eachCell!(function (cell) {
                if (cell.value) {
                    var columnLength = cell.value.toString().length;
                    if (columnLength > dataMax) {
                        dataMax = columnLength;
                    }
                }
            })
            column.width = dataMax + 5;
        });

        const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        await workbook.xlsx.writeBuffer().then(data => {
            const blob = new Blob([data], { type: fileType });
            FileSaver.saveAs(blob, "fillsmart_clientes_" + moment().format("DD-MM-YYYY") + ".xlsx");
        });;
    };

    const columns = [
        {
            title: "Fecha de Registro",
            key: "created",
            render: (c: CustomerViewModel) =>
                TextCell(DateUtils.format(c?.created, "DD/MM/YYYY hh:mm")),
            filterDropdown: DateFilter,
            sorter: true
        },
        {
            title: "Documento",
            key: "documentNumber",
            render: (c: CustomerViewModel) => TextCell(c?.documentNumber),
            filterDropdown: createTextFilter(FilterTypesEnum.Equals),
            sorter: true
        },
        {
            title: "Estado",
            key: "status",
            render: (c: CustomerViewModel) => TextCell(
                c?.status == CustomerAccountStatusEnum.Active ?
                    <Tag key={1} color="#389e0d"> Habilitado</Tag>
                    :
                    (c?.status == CustomerAccountStatusEnum.Inactive ?
                        <Tag key={1} color="#cf1322"> No Habilitado</Tag> :
                        ""
                    )
            ),
            filterDropdown: createTextFilter(FilterTypesEnum.Equals),
            sorter: true
        },

        {
            title: "Nombre",
            key: "firstName",
            filterDropdown: createTextFilter(FilterTypesEnum.Like),
            sorter: true,
            render: (c: CustomerViewModel) =>
                TextCell(c?.firstName)
        },
        {
            title: "Apellido",
            key: "lastName",
            filterDropdown: createTextFilter(FilterTypesEnum.Like),
            sorter: true,
            render: (c: CustomerViewModel) =>
                TextCell(c?.lastName)
        },
        {
            title: "Fecha de Nacimiento",
            key: "born",
            sorter: true,
            filterDropdown: DateFilter,
            render: (c: CustomerViewModel) =>
                TextCell(DateUtils.format(c?.born, "DD/MM/YYYY"))
        },
        {
            title: "Telefono",
            key: "phone",
            render: (c: CustomerViewModel) => TextCell(c?.phone),
            filterDropdown: createTextFilter(FilterTypesEnum.Like),
            sorter: true
        },
        {
            title: "Email",
            key: "user.username",
            render: (c: CustomerViewModel) => TextCell(c?.user.username),
            filterDropdown: createTextFilter(FilterTypesEnum.Like),
            sorter: true
        },
        {
            title: "CBU",
            key: "cbu",
            render: (c: CustomerViewModel) => TextCell(c?.cbu),
            filterDropdown: createTextFilter(FilterTypesEnum.Like),
            sorter: true
        },
        {
            title: "Alias",
            key: "cbuAlias",
            render: (c: CustomerViewModel) => TextCell(c?.cbuAlias),
            filterDropdown: createTextFilter(FilterTypesEnum.Like),
            sorter: true
        },
        {
            title: "MercadoPago",
            key: "mercadopagoAccount",
            render: (c: CustomerViewModel) => TextCell(c?.mercadopagoAccount),
            filterDropdown: createTextFilter(FilterTypesEnum.Like),
            sorter: true
        },
        {
            title: "",
            key: "viewDocument",
            width: "5%",
            className: "noWrapCell",
            render: (c: CustomerViewModel) => {
                return (
                    <ActionWrapper>

                    </ActionWrapper>
                );
            }
        },
        {
            title: "",
            key: "action",
            // width: "5%",
            fixed: "right",
            width: 100,
            className: "noWrapCell",
            render: (c: CustomerViewModel) => {
                return (
                    <ActionWrapper>
                        <Tooltip title="Ver Documento">
                            <a onClick={() => showDocument(c)} href="# ">
                                <i className="ion-eye" />
                            </a>
                        </Tooltip>
                        <Tooltip title="Editar">
                            <a onClick={() => editCustomer(c)} href="# ">
                                <i className="ion-android-create" />
                            </a>
                        </Tooltip>
                        <Tooltip title="Lista de Billeteras">
                            <Link
                                to={`/fillsmart/${PRIVATE_ROUTE.WALLETS.replace(
                                    ":customerId",
                                    c.id
                                )}`}
                            >
                                <i
                                    className="ion-archive"
                                />
                            </Link>
                        </Tooltip>

                        {
                            security.user?.roles.some(role => role.name === RolesEnum.Admin) &&
                            <Tooltip title="Movimientos del cliente">
                                <Link
                                    to={`/fillsmart/${PRIVATE_ROUTE.CUSTOMERS_MOVEMENTS.replace(
                                        ":documentNumber",
                                        c.documentNumber
                                    )}`}
                                >
                                    <i
                                        className="ion-ios-list-outline"
                                    />
                                </Link>
                            </Tooltip>
                        }
                    </ActionWrapper>
                );
            }
        },

    ];

    const showDocument = (c: CustomerViewModel) => {
        setEditingCustomer(c);
        setModalDocumentOpened(true);
    }

    const editCustomer = (c: CustomerViewModel) => {
        setEditingCustomer(c);
        setModalOpened(true);
    };

    return (
        <LayoutContentWrapper>
            <PageHeader>Clientes</PageHeader>
            <Row style={rowStyle} gutter={0} justify="start">
                <Col lg={24} md={24} sm={24} xs={24} style={colStyle}>
                    <IsoWidgetsWrapper>
                        <IsoWidgetBox>
                            <ButtonWrapper>
                                <div></div>
                                <ButtonHolders>
                                    <ActionBtn
                                        type="primary"
                                        onClick={onGenerateExcelClicked}
                                        loading={generateExcelClicked}
                                    >
                                        Descargar planilla
                                    </ActionBtn>
                                </ButtonHolders>
                            </ButtonWrapper>
                            {/* TABLE */}
                            <FilteredTable
                                columns={columns}
                                dataSource={customers}
                                loading={loading}
                                pagination={{ ...tableCriteria.pagination, ...{ total } }}
                                otherFilters={otherFilters}
                                onCriteriaChange={setTableCriteria}
                            />
                        </IsoWidgetBox>
                    </IsoWidgetsWrapper>
                </Col>
            </Row>
            <CustomerEdit
                editing={editingCustomer}
                opened={modalOpened}
                onClose={() => setModalOpened(false)}
                onFinished={() => setModalOpened(false)}
            />
            <CustomerDocument opened={modalDocumentOpened} customer={editingCustomer}
                onClose={() => setModalDocumentOpened(false)}
            />
        </LayoutContentWrapper>
    );
};

export default Customers;
