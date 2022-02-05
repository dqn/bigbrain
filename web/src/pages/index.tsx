import type { NextPage } from "next";
import clsx from "clsx";
import { ChangeEventHandler, useCallback, useState } from "react";
import { compile } from "../bigbrain";
import { run } from "../brainfuck/run";

const ExternalLink: React.FC<JSX.IntrinsicElements["a"]> = (props) => {
  return (
    <a
      {...props}
      className="text-blue-600 hover:underline"
      rel="noopener noreferrer"
      target="_blank"
    />
  );
};

const Label: React.FC = ({ children }) => {
  return <label className="text-lg font-bold">{children}</label>;
};

const Textarea: React.VFC<JSX.IntrinsicElements["textarea"]> = (props) => {
  return (
    <textarea
      {...props}
      className="border-border h-[480px] w-full resize-none rounded border p-4 font-mono"
    />
  );
};

const Button: React.FC<JSX.IntrinsicElements["button"]> = (props) => {
  return (
    <button
      {...props}
      className={clsx(
        "border-border bg-text w-full flex-none rounded border p-2 font-bold text-white",
        props.disabled && "cursor-not-allowed opacity-50",
      )}
    />
  );
};

type ErrorMessageProps = {
  message: string;
};

const ErrorMessage: React.VFC<ErrorMessageProps> = ({ message }) => {
  if (message === "") {
    return null;
  }

  return <p className="text-red-600">{message}</p>;
};

const defaultBigbrainCode = `x = input();

for (i = 1; i <= x; ++i) {
  if (i % 3 == 0 && i % 5 == 0) {
    putchar(102);
    putchar(105);
    putchar(122);
    putchar(122);
    putchar(98);
    putchar(117);
    putchar(122);
    putchar(122);
  } else if (i % 3 == 0) {
    putchar(102);
    putchar(105);
    putchar(122);
    putchar(122);
  } else if (i % 5 == 0) {
    putchar(98);
    putchar(117);
    putchar(122);
    putchar(122);
  } else {
    print(i);
  }
  putchar(10);
}
`;

const Top: NextPage = () => {
  const [bigbrainCode, setBigbrainCode] = useState(defaultBigbrainCode);
  const [bigbrainCodeError, setBigbrainCodeError] = useState("");
  const [brainfuckCode, setBrainfuckCode] = useState("");
  const [brainfuckCodeError, setBrainfuckCodeError] = useState("");
  const [output, setOutput] = useState("");

  const handleChange = useCallback<ChangeEventHandler<HTMLTextAreaElement>>(
    ({ target: { value } }) => {
      setBigbrainCode(value);
    },
    [],
  );

  const handleCompile = useCallback(() => {
    setOutput("");
    try {
      setBrainfuckCode(compile(bigbrainCode));
    } catch (err) {
      if (err instanceof Error) {
        setBigbrainCodeError(err.message);
      } else {
        throw err;
      }
    }
  }, [bigbrainCode]);

  const handleRun = useCallback(() => {
    try {
      setOutput(run(brainfuckCode));
    } catch (err) {
      if (err instanceof Error) {
        setBrainfuckCodeError(err.message);
      } else {
        throw err;
      }
    }
  }, [brainfuckCode]);

  const handleResetAll = useCallback(() => {
    setBigbrainCode("");
    setBrainfuckCode("");
    setOutput("");
  }, []);

  return (
    <main className="mx-auto max-w-screen-2xl py-5 md:px-2">
      <header className="py-12 px-4 text-center">
        <h1 className="text-5xl font-bold">🧠 Bigbrain</h1>
        <p className="mt-4">
          High-level programming language that can be compiled to Brainfuck.
        </p>
        <div className="mt-2">
          <ExternalLink href="https://github.com/dqn/bigbrain">
            GitHub
          </ExternalLink>
        </div>
      </header>

      <div className="flex flex-wrap space-y-8 md:space-y-0">
        <div className="w-full px-5 md:w-1/3 md:px-2">
          <Label>Bigbrain:</Label>
          <div className="space-y">
            <Textarea value={bigbrainCode} onChange={handleChange} />
            <Button onClick={handleCompile} disabled={bigbrainCode === ""}>
              Compile
            </Button>
            <ErrorMessage message={bigbrainCodeError} />
          </div>
        </div>
        <div className="w-full px-5 md:w-1/3 md:px-2">
          <Label>Brainfuck:</Label>
          <div className="space-y">
            <Textarea value={brainfuckCode} readOnly />
            <Button onClick={handleRun} disabled={brainfuckCode === ""}>
              Run
            </Button>
            <ErrorMessage message={brainfuckCodeError} />
          </div>
        </div>
        <div className="w-full px-5 md:w-1/3 md:px-2">
          <Label>Output:</Label>
          <div className="space-y">
            <Textarea readOnly value={output} />
            <Button
              onClick={handleResetAll}
              disabled={[bigbrainCode, brainfuckCode, output].join("") === ""}
            >
              Reset all
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Top;
