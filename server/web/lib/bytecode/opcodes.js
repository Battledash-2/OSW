let e = 0;

// Basic
export const HALT  = e++;
export const CONST = e++;

// Math
export const ADD   = e++; // addition / concatenation
export const SUB   = e++; // subtraction
export const MUL   = e++; // multiplication
export const DIV   = e++; // division
export const EXP   = e++; // power

// Arbitrary
export const ARB   = e++; // arbitrary javascript code execution - unsafe / not recommended

// Applications
export const CAPP  = e++; // create application

export const XPOS  = e++; // modify current application x
export const YPOS  = e++; // modify current application y
export const GYP   = e++; // get current application y
export const GXP   = e++; // get current application x

// Elements
export const CELM  = e++; // create element
export const ELMP  = e++; // modify property
export const GELM  = e++; // get property
export const STYLE = e++; // modify style property (alias)