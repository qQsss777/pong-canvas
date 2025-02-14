import { Direction } from "../components/layer/dynamicLayer";

/**
 * Calculate angle in cartesian plan
 * @param start mininum value for angle
 * @param end maximum value for angle
 * @returns angle in cartesian plan
 */
export const generateRandomNumber = (start: number, end: number): number => {
  return Math.floor(Math.random() * (start - end + 1) + end) - 90;
};

export const calculateOppositeAngle = (angle: number): number => {
  return -angle;
};

export const numberInInterval = (
  start: number,
  end: number,
  target: number,
): boolean => {
  return start <= target && target <= end;
};

/**
 * Get new coordinates
 * @param x x
 * @param y y
 * @param angle angle
 * @param direction forward | toward
 * @param speed speed
 * @returns x and y
 */
export const getCoordinates = (
  x: number,
  y: number,
  angle: number,
  direction: Direction,
  speed: number,
): { x: number; y: number } => {
  const rads = (angle * Math.PI) / 180;
  const deltaX = Math.cos(rads) * speed;
  const deltaY = Math.sin(rads) * speed;
  return {
    x: direction === "toward" ? x + deltaX : x - deltaX,
    y: direction === "toward" ? y + deltaY : y - deltaY,
  };
};
