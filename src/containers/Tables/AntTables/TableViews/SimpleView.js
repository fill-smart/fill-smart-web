import React from "react";
import TableWrapper from "../AntTables.styles";

export default function(props) {
  const dataSource = props.dataSource || props.dataList.getAll();
  const columns = props.columns || props.tableInfo.columns;
  const rowKey = props.rowKey ?? "key";
  const footer = props.footer;
  return (
    <TableWrapper
    table
      columns={columns}
      dataSource={dataSource}
      className="isoSimpleTable"
      rowKey={rowKey}
      footer={footer}
      locale={{
        emptyText: "No se encuentran elementos para la consulta especificada"
      }}
    />
  );
}
