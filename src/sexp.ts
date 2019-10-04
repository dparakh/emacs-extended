// What is an s-expression?
//   S-expressions were popularised by Lisp and
//   represent a recursive data structure.

//   In the usual parenthesized syntax of Lisp,
//   an s-expression is classically defined as:
//     1. an atom, or
//     2. an expression of the form (x y) where x and y are s-expressions.

export enum Expression {
  SExpression,
  Atom,
}

export function turnToSexp(text: string): string[][] {
  const start = new RegExp(/[\{\(\[\<]/);
  const end = new RegExp(/[\}\)\]\>]/);
  const isString = new RegExp(/[\"\']/);
  const isWhitespace = new RegExp(/\s+/);

  const sexp : any [][] = [];
  let word = "";
  let inStr = false;

  for (const char of text) {
    if (start.test(char) && !inStr) {
      sexp.push([]);
    } else if ((end.test(char) || isWhitespace.test(char)) && !inStr) {
      const last = sexp.length - 1;
      if (word.length > 0) {
        sexp[last].push(word);
        word = "";
      }

      if (end.test(char)) {
        const temp = sexp.pop();
        if (temp) {
          sexp[last - 1].push(temp);
        }
      }
    } else if (isString.test(char)) {
      inStr = !inStr;
    } else {
      word = word.concat(char);
    }
  }

  return sexp[0];
}

function isSexp(text: string): boolean {
  const regex = new RegExp('^[\[\{\(\"\']');
  return regex.test(text);
}

function isAtom(text: string): boolean {
  return !isSexp(text);
}

export function sExpressionOrAtom(text: string): Expression {
  return isSexp(text) ? Expression.SExpression : Expression.Atom;
}
