import React from "react";
import { Form, Input, Select, InputNumber, Switch } from "antd";
import "../layout.css";

/**
 * DynamicFormEntry is an entry in DynamicForm. Each DynamicFormEntry is configured by a Form Entry Definition.
 */
export const DynamicFormEntry = ({ val: entryDefinition }) => {

    const { key, label, type, tooltip } = entryDefinition;

    const renderList = () => {
        // const inputItem = (index, type, style) => {
        //     const props = { key: index, style };
        //     if (type === "number") {
        //         return <InputNumber {...props} />;
        //     } else if (type === "text") {
        //         return <Input {...props} />;
        //     }
        // };

        const { listSize, itemType } = entryDefinition;

        const style = { width: `${String(100 / listSize)}%` };
        const formItems = [...Array(listSize)].map((_, i) => {
            const input = itemType === "number" 
                ? <InputNumber style={style} /> 
                : itemType === "text"
                ? <Input style={style} />
                : undefined;
            return (
                <Form.Item key={i} name={[key, i]} noStyle >
                    {input}
                </Form.Item>
            );
        });

        return <Input.Group>{formItems}</Input.Group>;
    };

    const renderSelect = () => {
        const { options } = entryDefinition;
        return (
            <Select>
                {options &&
                    Object.entries(options).map(([key, val], index) => (
                        <Select.Option key={index} value={key}>
                            {val}
                        </Select.Option>
                    ))}
            </Select>
        );
    };

    const getAdditionalProps = () => {
        /**
         * Validation rule for the entry. 
         * Needs special consideration for `list` types because we need to check result length and the 
         * validity of each element in the result.
         */
        const validationRule = entryDefinition.type !== "list"
            ? { required: true, message: "Cannot be empty" }
            : {
                  validator: (_, result) =>
                      result && result.length === entryDefinition.listSize && result.every(e => e !== null && e !== undefined)
                          ? Promise.resolve()
                          : Promise.reject("All entries must be filled"),
              };
        /**
         * This fixes a bug within antd. If this property is not provided for `switch` entries,
         * the form will fail to set them to their defined default values.
         */
        const maybeSwitchAddOn = entryDefinition.type === "switch" ? { valuePropName: "checked" } : {};
        return { rules: [validationRule], ...maybeSwitchAddOn };
    }

    // const maybeSwitchAddOn =
    //     val.type === "switch" ? { valuePropName: "checked" } : undefined;

    const input =
        type === "number" ? (
            <InputNumber min={entryDefinition.min} max={entryDefinition.max} />
        ) : type === "switch" ? (
            <Switch />
        ) : type === "text" ? (
            <Input addonAfter={entryDefinition.addonAfter} />
        ) : type === "select" ? (
            renderSelect()
        ) : type === "list" ? (
            renderList()
        ) : undefined;

    // const validationRule = val.type !== "list"
    //         ? { required: true, message: "Cannot be empty" }
    //         : {
    //               validator: (_, value) =>
    //                   value && value.length === val.listSize
    //                       ? Promise.resolve()
    //                       : Promise.reject("All entries must be filled"),
    //           };

    return (
        <Form.Item
            label={label}
            name={key}
            tooltip={tooltip}
            // rules={validationRule && [validationRule]}
            // {...maybeSwitchAddOn}
            {...getAdditionalProps()}
        >
            {input}
        </Form.Item>
    );
};