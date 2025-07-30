import React, { useEffect, useRef, useState } from "react";
import { useField } from "@unform/core";
import { Switch, FormControlLabel } from "@mui/material";

interface VSwitchProps {
  name: string;
  label?: string;
  defaultChecked?: boolean;
}

export const VSwitch: React.FC<VSwitchProps> = ({ name, label, defaultChecked = false, ...rest }) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { fieldName, registerField, defaultValue } = useField(name);
  const [checked, setChecked] = useState<boolean>(defaultValue ?? defaultChecked);

  useEffect(() => {
    setChecked(defaultValue ?? defaultChecked);
  }, [defaultValue, defaultChecked]);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef.current,
      getValue: () => checked,
      setValue: (_, value) => setChecked(!!value),
      clearValue: () => setChecked(false),
    });
  }, [fieldName, registerField, checked]);

  return (
    <FormControlLabel
      control={
        <Switch
          ref={(el) => {
            if (el) {
              const input = el.querySelector('input');
              if (input) inputRef.current = input;
            }
          }}
          checked={!!checked}
          onChange={(_, value) => setChecked(value)}
          color="primary"
          {...rest}
        />
      }
      label={label}
    />
  );
};