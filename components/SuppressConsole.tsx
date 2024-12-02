"use client";

import { useEffect } from "react";

const SuppressConsole = () => {
  useEffect(() => {
    const originalConsoleError = console.error;
    const originalConsoleWarn = console.warn;

    const suppressedErrors = [
      "UseCall must be used within StreamCall component",
      "Failed to getUserMedia",
      "Requested device not found",
      "[devices]: Failed to get video stream"
    ];

    const suppressedWarnings = [
      "params is now a Promise",
      "DialogContent requires a DialogTitle"
    ];

    // Перехват и подавление ошибок
    console.error = (...args) => {
      if (args.some(arg => typeof arg === "string" && suppressedErrors.some(err => arg.includes(err)))) {
        return; // Пропустить лог
      }
      originalConsoleError(...args); // Логировать другие ошибки
    };

    // Перехват и подавление предупреждений
    console.warn = (...args) => {
      if (args.some(arg => typeof arg === "string" && suppressedWarnings.some(warn => arg.includes(warn)))) {
        return; // Пропустить предупреждение
      }
      originalConsoleWarn(...args); // Логировать другие предупреждения
    };

    return () => {
      // Восстановить исходное поведение консоли
      console.error = originalConsoleError;
      console.warn = originalConsoleWarn;
    };
  }, []);

  return null;
};

export default SuppressConsole;
