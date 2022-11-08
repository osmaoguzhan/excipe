import { useState } from "react";

const useArray = (defaultValue) => {
  const [value, setValue] = useState(defaultValue);

  const push = (element) => {
    setValue((a) => [...a, element]);
  };

  const remove = (index) => {
    setValue((a) => [...a.slice(0, index), ...a.slice(index + 1, a.length)]);
  };

  const clear = () => {
    setValue([]);
  };

  const length = () => {
    return value.length;
  };

  const isEmpty = () => {
    return value.length === 0;
  };

  const reset = (data) => {
    setValue([]);
    setValue(data);
  };

  return { value, push, remove, clear, length, isEmpty, reset };
};

export default useArray;
