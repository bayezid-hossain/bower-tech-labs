import { Fragment } from "react";

type LineBreaksProps = { text: string; breakOn?: "lg" | "always" };

/** Renders "\n" as a line break. By default breaks only at lg+; on mobile the text wraps naturally. */
export function LineBreaks({ text, breakOn = "lg" }: LineBreaksProps) {
  return (
    <>
      {text.split("\n").map((line, i) => (
        <Fragment key={i}>
          {i > 0 && (
            <>
              {" "}
              <br className={breakOn === "lg" ? "hidden lg:inline" : undefined} />
            </>
          )}
          {line}
        </Fragment>
      ))}
    </>
  );
}
