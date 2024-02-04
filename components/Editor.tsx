"use client"

import { useLayoutEffect, useState } from "react"
import Editor from '@monaco-editor/react';

export function CodeEditor() {
  const queryParameters = new URLSearchParams(window.location.search)
  const urlString = queryParameters.get('text')

  const [input, setInput] = useState(urlString ? atob(urlString) : inputString)
  const [viewOutput, setViewOutput] = useState(false)
  const [width, setWidth] = useState(window.innerWidth)
  const text = render(convertToTree(input), false)
  useLayoutEffect(() => {
    const updateSize = () => {
      setWidth(window.innerWidth);
    };
    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);

  }, [])
  return <div className="flex flex-col w-full gap-2">
    <div className="flex gap-2 justify-center">
      <button className="p-2 border-solid-1 border-2 hover:bg-gray-800">
        <a href={"https://twitter.com/intent/tweet?text=" + encodeURIComponent(`There is no better way to code than using "use" for everything: https://${window.location.hostname}?text=${encodeURIComponent(btoa(input))}`)} >
          Share on 𝕏
        </a>
        </button>
      <button className="p-2 border-solid-1 border-2 hover:bg-gray-800" onClick={() => setViewOutput(!viewOutput)}>{viewOutput ? 'View html code' : 'Edit \"use\" code'}</button>
    </div>
    <div className="grid grid-rows-3 md:grid-rows-1 grid-cols-1 md:grid-cols-2 w-full">
    <Editor
      theme="vs-dark"
      height={width < 768 ? "40vh" : "80vh"}
      defaultValue={input}
      defaultLanguage="javascript"
      onChange={value => {
        setInput(value ?? "")
      }} />
      {viewOutput
        ? <pre className="p-2 text-xs">{text}</pre>
        : <iframe className="w-full h-full bg-white" srcDoc={text}></iframe>}
  </div>
    </div>
}

type Node = {
  children: Node[]
  content: string
  indent: number
  parent: Node
}

function convertToTree(input: string) {
  const lines = input.split('\n');
  const root: Node = { children: [] };
  let currentParent = root;

  lines.forEach(line => {
    const indent = line.search(/\S/);
    const content = line.trim().replaceAll('\\"', '"');

    if (indent === -1) {
      return;
    }

    const node = { content, children: [] };

    while (indent <= currentParent.indent) {
      currentParent = currentParent.parent;
    }

    currentParent.children.push(node);
    node.parent = currentParent;
    currentParent = node;
    node.indent = indent;
  });

  return root.children;
}

function render(children: Node[], asFunction: boolean) {
  let output = ''
  children.forEach(child => {
    const hasUse = child.content.indexOf('"use ') !== -1
    if (!hasUse) {
      if (child.content[0] !== '"' || child.content.at(-1) !== '"') {
        return
      }
      return output += " ".repeat(child.indent) + child.content.substring(1, child.content.length - 1) + '\n'
    }
    const value = child.content.substring('"use '.length, child.content.length - 1)
    if (asFunction) {
      output += `${' '.repeat(child.indent)}${value}\n`
    } else {
      output += `${' '.repeat(child.indent)}<${value}>\n`
    }
    output += render(child.children, asFunction === true ? true : value === 'script')
    if (!asFunction) {
      output += `${' '.repeat(child.indent)}</${value.split(' ')[0]}>\n`
    }
  })
  return output
}

const inputString = `
"use html"
   "use head"
    "use body"
        "use blockquote class=\\"twitter-tweet\\""
          "use p lang=\\"en\\" dir=\\"ltr\\""
            "I think I just invented a new JavaScript framework"
          "use a href=\\"https://t.co/aBL5GymUbt\\""
            "pic.twitter.com/aBL5GymUbt"
            "&mdash; nader dabit (@dabit3)"
          "use a href=\\"https://twitter.com/dabit3/status/1752143163546911036?ref_src=twsrc%5Etfw\\""
            "January 30, 2024"
      "use script async src=\\"https://platform.twitter.com/widgets.js\\" charset=\\"utf-8\\""
`;