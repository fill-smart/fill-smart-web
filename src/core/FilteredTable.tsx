import React, { useState, useEffect } from "react";
import { TableWrapper } from "../containers/Users/UsersEdit.styles";
import {
  IFilterCriteria,
  FilterTypesEnum,
  IAndFilterCriteria,
  IPropertyFilterCriterion,
} from "./filters";
import { Tag, Icon } from "antd";
import moment from "moment";

/*import {
    FilterOutlined
} from '@ant-design/icons';*/
export type QueryCriteria = {
  pagination: { current: number; pageSize: number };
  sort: Array<{ property: string; descending: boolean }>;
  filter: IFilterCriteria | undefined;
};

export const formatFilters = (formValues: {
  [key: string]: { type: string; value: any };
}): IAndFilterCriteria => {
  return {
    and: Object.keys(formValues)
      .map(
        (key) =>
          [key, formValues[key].type, formValues[key].value] as [
            string,
            string,
            any
          ]
      )
      .map(
        ([property, type, value]) =>
          ({
            property,
            type,
            value,
          } as IPropertyFilterCriterion)
      ),
  };
};

export const formatTagValue = (expr: { from: any; to: any } | any): string => {
  if (expr?.from && !isNaN(parseFloat(expr.from))) {
    return `desde "${expr.from}" hasta "${expr.to}"`;
  } else if (expr?.from && moment(expr.from).isValid()) {
    return `desde "${moment(expr.from).format("DD-MM-YYYY")}" hasta "${moment(
      expr.to
    ).format("DD-MM-YYYY")}"`;
  } else {
    return expr;
  }
};

export const formatTagFilterType = (expr: FilterTypesEnum): string => {
  switch (expr) {
    case FilterTypesEnum.Between:
      return "";
      break;
    case FilterTypesEnum.Equals:
      return "igual a";
      break;
    case FilterTypesEnum.Like:
      return "contiene";
      break;
    default:
      return "indefinido";
  }
};

export const FilteredTable = ({
  columns,
  dataSource,
  loading,
  pagination,
  onCriteriaChange,
  otherFilters,
  expandedRowRender,
  defaultFilters = { and: [] },
  defaultSorter = [],
  showDeleted = false,
}: {
  columns: any;
  dataSource: any;
  loading: boolean;
  pagination: any;
  onCriteriaChange: (query: QueryCriteria) => void;
  otherFilters: IAndFilterCriteria | undefined;
  expandedRowRender?: any;
  defaultFilters?: IAndFilterCriteria;
  defaultSorter?: Array<{ property: string; descending: boolean }>;
  showDeleted?: boolean;
}) => {
  const [tableState, setTableState] = useState<{
    pagination: { current: number; pageSize: number };
    sort: Array<{ property: string; descending: boolean }>;
    filter: IFilterCriteria | undefined;
  }>({
    pagination: {
      current: 1,
      pageSize: 10,
    },
    sort: defaultSorter,
    filter: {
      and: defaultFilters.and.concat(
        showDeleted
          ? []
          : [
              {
                property: "deleted",
                type: FilterTypesEnum.Equals,
                value: false,
              },
            ]
      ),
    },
  });

  const filteredColumns = columns.map((col) => {
    const c = col;
    const isFiltered =
      col.filterDropdown &&
      (tableState?.filter as IAndFilterCriteria)?.and?.find((f) => {
        const filter = f as IPropertyFilterCriterion;
        return filter?.property === col.key;
      })
        ? true
        : false;

    c.filtered = isFiltered;

    c.filterIcon = () => {
      return (
        <Icon
          type="filter"
          style={{ color: isFiltered ? "#1890ff" : "#bfbfbf" }}
        />
      );
    };
    c.filterValue = !isFiltered ? undefined : c.filterValue;
    return c;
  });

  const removeFilter = (index: number) => {
    setTableState({
      ...tableState,
      ...{
        filter: {
          and: (tableState.filter as IAndFilterCriteria).and.filter(
            (c, i) => i !== index + 1
          ),
        },
      },
    });
  };

  const handleTableChange = (
    pagination,
    filters: { [key: string]: Array<any> },
    sorter
  ) => {
    let sort:
      | {
          property: string;
          descending: boolean;
        }
      | undefined = undefined;
    let page:
      | {
          current: number;
          max: number;
        }
      | undefined = undefined;
    if (sorter.order) {
      sort = {
        property: sorter.columnKey,
        descending: sorter.order !== "ascend",
      };
    }
    let filter: IFilterCriteria | undefined = tableState.filter
      ? { ...tableState.filter, ...otherFilters }
      : otherFilters;
    if (Object.keys(filters).length > 0) {
      Object.keys(filters)
        .map((p) => [p, filters[p]] as [string, Array<any>])
        .map(([prop, values]: [string, Array<any>]) => {
          if (!filter) {
            filter = { and: [] };
          }
          const condition = {
            property: prop,
            type: values[0],
            value:
              (values[0] as FilterTypesEnum) !== FilterTypesEnum.Between
                ? values[1]
                : {
                    from: values[1],
                    to: values[2],
                  },
          };
          if (condition && condition.type && condition.value) {
            filter = {
              and: [
                ...(filter as IAndFilterCriteria)?.and.filter(
                  (f) =>
                    (f as IPropertyFilterCriterion).property !=
                    condition.property
                ),
              ],
            };
            (filter as IAndFilterCriteria)?.and.push(condition);
          }
        });
    }
    setTableState({
      pagination: { ...pagination, ...{ current: pagination.current } },
      sort: sort ? [sort] : defaultSorter,
      filter: filter,
    });
  };

  useEffect(() => {
    const withOtherFiltersState = {
      ...tableState,
      filter: {
        and: [
          ...((tableState.filter as IAndFilterCriteria)?.and ?? []),
          ...(otherFilters && otherFilters.and ? otherFilters.and : []),
        ],
      },
    };
    onCriteriaChange(withOtherFiltersState);
  }, [tableState, otherFilters]);
  return (
    <>
      {(tableState.filter as IAndFilterCriteria)?.and.filter(
        (filter) => (filter as IPropertyFilterCriterion).property != "deleted"
      ).length > 0 && (
        <div style={{ marginBottom: "10px" }}>
          <h4 style={{ marginBottom: 16 }}>Filtros aplicados:</h4>
          {(tableState.filter as IAndFilterCriteria)?.and
            ?.filter(
              (filter) =>
                (filter as IPropertyFilterCriterion).property != "deleted"
            )
            .map((filter, i) => {
              return (
                <Tag
                  key={
                    (filter as IPropertyFilterCriterion).property +
                    (filter as IPropertyFilterCriterion).value
                  }
                  closable
                  onClose={() => removeFilter(i)}
                  color="#108ee9"
                >
                  {'"' +
                    columns.find(
                      (c) =>
                        c.key == (filter as IPropertyFilterCriterion).property
                    )?.title +
                    '"'}{" "}
                  {formatTagFilterType(
                    (filter as IPropertyFilterCriterion).type
                  )}{" "}
                  {formatTagValue((filter as IPropertyFilterCriterion).value)}
                </Tag>
              );
            })}
        </div>
      )}
      <TableWrapper
        columns={filteredColumns}
        dataSource={dataSource}
        className="isoSimpleTable"
        rowKey="id"
        locale={{
          emptyText: "No se encuentran elementos para la consulta especificada",
          filterConfirm: "Filtrar",
          filterReset: "Limpiar",
        }}
        loading={loading}
        onChange={handleTableChange}
        pagination={pagination}
        expandedRowRender={expandedRowRender}
      />
    </>
  );
};
