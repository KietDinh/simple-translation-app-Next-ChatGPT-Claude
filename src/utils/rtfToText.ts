export function rtfToText(rtf: string): string {
  const rtfRegex = /\\([a-z]+)(-?\d+)? ?|[{}]|\\'([0-9a-fA-F]{2})|([^\\{}]+)/g;
  let match: RegExpExecArray | null;
  let output: string[] = [];
  let stack: number[] = [];

  while ((match = rtfRegex.exec(rtf)) !== null) {
    if (match[0] === "{") {
      stack.push(output.length);
    } else if (match[0] === "}") {
      stack.pop();
    } else if (match[0][0] === "\\") {
      if (match[1] === "par" || match[1] === "line") {
        output.push("\n");
      } else if (match[1] === "tab") {
        output.push("\t");
      } else if (match[1] === "uc") {
        // Unicode character count to skip
        const skipCount = match[2] ? parseInt(match[2], 10) : 0;
        rtfRegex.lastIndex += skipCount;
      } else if (match[1] === "'") {
        const charCode = parseInt(match[3], 16);
        output.push(String.fromCharCode(charCode));
      }
    } else {
      output.push(match[0]);
    }
  }
  return output.join("");
}
