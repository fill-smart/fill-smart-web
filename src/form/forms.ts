import { FormComponentProps } from "antd/lib/form";

export interface FormProps<T> extends FormComponentProps {
    onSubmit: (value: Partial<T>) => void;
    initialValue?: T;
    [key: string]: any;
}
