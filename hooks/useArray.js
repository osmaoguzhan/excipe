import { useState } from "react";

export default function useArray(defaultValue) {
  const [value, setValue] = useState(defaultValue);

  function push(element) {
    setValue((a) => [...a, element]);
  }

  function remove(index) {
    setValue((a) => [...a.slice(0, index), ...a.slice(index + 1, a.length)]);
  }

  function clear() {
    setValue([]);
  }

  function length() {
    return value.length;
  }

  function isEmpty() {
    return value.length === 0;
  }

  function reset(data) {
    setValue([]);
    setValue(data);
  }

  return { value, push, remove, clear, length, isEmpty, reset };
}
