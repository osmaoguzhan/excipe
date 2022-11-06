import React from "react";
import { Controller } from "react-hook-form";
import TextField from "@mui/material/TextField";
import * as _ from "lodash";

const FormInput = (props) => {
  const { name, label, control, value, errors, validation, type, ...other } =
    props;

  const setError = () => {
    return errors && errors[name] && errors[name].message
      ? errors[name].message
      : undefined;
  };

  return (
    <Controller
      name={name}
      control={control}
      render={(props) => (
        <TextField
          margin='normal'
          fullWidth
          name={name}
          label={label}
          error={!!(errors && setError())}
          type={type ? type : "text"}
          onChange={(e) => {
            if (
              _.isNil(e.target.value) ||
              e.target.value.toString().substring(0, 1) !== " "
            ) {
              props.field.onChange(e.target.value);
            }
          }}
          helperText={errors && setError()}
          value={props.field.value}
          {...other}
        />
      )}
      defaultValue={value ? value : ""}
      rules={validation}
      error={!!(errors && setError())}
    />
  );
};
export default FormInput;
