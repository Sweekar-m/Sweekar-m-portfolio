import React from "react";
import { render, screen } from "@testing-library/react";
import FlappyBirdGame from "./FlappyBirdGame";

beforeEach(() => localStorage.clear());

test("loads and displays the saved best score", () => {
  localStorage.setItem("sweekar-neural-flight-best", "12");
  render(<FlappyBirdGame />);
  expect(screen.getByText("12")).toBeInTheDocument();
});

test("shows touch-friendly game instructions", () => {
  render(<FlappyBirdGame />);
  expect(screen.getByText(/tap, click, or press/i)).toBeInTheDocument();
});
