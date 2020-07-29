import React from "react";
import { Input, Button, DatePicker, Select } from "antd";
import { FilterTypesEnum } from "../../core/filters";
import moment from "moment"
const { Option } = Select;
export const createTextFilter = (filterType: FilterTypesEnum) => {
    return ({ confirm, clearFilters, selectedKeys, setSelectedKeys }: { confirm: any, clearFilters: any, selectedKeys: any, setSelectedKeys: any }) => {

        return <div style={{ padding: 8 }}>
            <Input
                placeholder={`Filtrar`}
                value={selectedKeys[1]}
                onChange={e => setSelectedKeys([filterType, e.target.value])}
                onPressEnter={(e) => { confirm() }}
                style={{ marginBottom: 8, display: 'block' }}
            />
            <Button
                type="link"
                onClick={() => { confirm(); }}
                style={{ width: 90, marginRight: 8 }}
            >
                Filtrar
            </Button>
            <Button type="link" onClick={() => clearFilters()} style={{ width: 90 }}>
                Limpiar
            </Button>
        </div>
    }
}




export const DateFilter = ({ confirm, clearFilters, selectedKeys, setSelectedKeys }: { confirm: any, clearFilters: any, selectedKeys: any, setSelectedKeys: any }) => {
    return <div style={{ padding: 8 }}>
        <DatePicker
            placeholder={`Desde`}
            format="DD/MM/YYYY"
            value={selectedKeys[1] ? moment(selectedKeys[1]) : undefined}
            onChange={e => e ? setSelectedKeys([FilterTypesEnum.Between, e.startOf("day").subtract(1, "second").toDate(), selectedKeys[2]]) : undefined}
            style={{ marginBottom: 8, display: 'block' }}
        />
        <DatePicker
            placeholder={`Hasta`}
            format="DD/MM/YYYY"
            value={selectedKeys[2] ? moment(selectedKeys[2]) : undefined}
            onChange={e => e ? setSelectedKeys([FilterTypesEnum.Between, selectedKeys[1], e.endOf("day").add(1, "second").toDate()]) : undefined}
            style={{ marginBottom: 8, display: 'block' }}
        />

        <Button
            type="link"
            onClick={() => { confirm(); }}
            style={{ width: 90, marginRight: 8 }}
        >
            Filtrar
        </Button>
        <Button type="link" onClick={() => clearFilters()} style={{ width: 90 }}>
            Limpiar
        </Button>
    </div>
}

export const NumberFilter = ({ confirm, clearFilters, selectedKeys, setSelectedKeys }: { confirm: any, clearFilters: any, selectedKeys: any, setSelectedKeys: any }) => {
    return <div style={{ padding: 8 }}>
        <Input
            type="number"
            placeholder={`Desde`}
            value={selectedKeys[1]}
            onChange={e => e ? setSelectedKeys([FilterTypesEnum.Between, e.target.value, selectedKeys[2]]) : undefined}
            style={{ marginBottom: 8, display: 'block' }}
        />
        <Input
            placeholder={`Hasta`}
            type="number"
            value={selectedKeys[2]}
            onChange={e => e ? setSelectedKeys([FilterTypesEnum.Between, selectedKeys[1], e.target.value]) : undefined}
            style={{ marginBottom: 8, display: 'block' }}
        />

        <Button
            type="link"
            onClick={() => { confirm(); }}
            style={{ width: 90, marginRight: 8 }}
        >
            Filtrar
        </Button>
        <Button type="link" onClick={() => clearFilters()} style={{ width: 90 }}>
            Limpiar
        </Button>
    </div>
}

export const createSelectFilter = (options: { value: any, label: any }[]) => {
    return ({ confirm, clearFilters, selectedKeys, setSelectedKeys }: { confirm: any, clearFilters: any, selectedKeys: any, setSelectedKeys: any }) => {
        return <div style={{ padding: 8 }}>

            <Select
                placeholder={`Seleccione`}
                value={selectedKeys[1]}
                onChange={e => e ? setSelectedKeys([FilterTypesEnum.Equals, e]) : undefined}
                style={{ marginBottom: 8, display: 'block' }}
            >
                {options.map((o, i) => (<Option key={i} value={o.value}>{o.label}</Option>))}
            </Select>

            <Button
                type="link"
                onClick={() => { confirm(); }}
                style={{ width: 90, marginRight: 8 }}
            >
                Filtrar
            </Button>
            <Button type="link" onClick={() => clearFilters()} style={{ width: 90 }}>
                Limpiar
            </Button>
        </div>
    }
}  