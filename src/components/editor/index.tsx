"use client";

import { useMemo, type ForwardedRef } from "react";
import {
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  markdownShortcutPlugin,
  MDXEditor,
  type MDXEditorMethods,
  type MDXEditorProps,
  toolbarPlugin,
  BoldItalicUnderlineToggles,
  ChangeCodeMirrorLanguage,
  ConditionalContents,
  CreateLink,
  InsertCodeBlock,
  InsertImage,
  InsertTable,
  InsertThematicBreak,
  ListsToggle,
  Separator,
  UndoRedo,
  codeBlockPlugin,
  codeMirrorPlugin,
  diffSourcePlugin,
  imagePlugin,
  linkDialogPlugin,
  linkPlugin,
  tablePlugin,
} from "@mdxeditor/editor";

import { basicDark } from "cm6-theme-basic-dark";
import { useTheme } from "next-themes";

import "@mdxeditor/editor/style.css";
import "./dark-editor.css";

interface Props {
  value: string;
  fieldChange: (value: string) => void;
  editorRef: ForwardedRef<MDXEditorMethods> | null;
}

const Editor = ({ value, editorRef, fieldChange, ...props }: Props) => {
  const { resolvedTheme } = useTheme();

  const theme = useMemo(() => (resolvedTheme === "dark" ? [basicDark] : []), [resolvedTheme]);

  const plugins = useMemo(
    () => [
      headingsPlugin(),
      listsPlugin(),
      linkPlugin(),
      linkDialogPlugin(),
      quotePlugin(),
      thematicBreakPlugin(),
      markdownShortcutPlugin(),
      tablePlugin(),
      imagePlugin(),
      codeBlockPlugin({ defaultCodeBlockLanguage: "" }),
      codeMirrorPlugin({
        codeBlockLanguages: {
          css: "css",
          txt: "txt",
          sql: "sql",
          html: "html",
          saas: "saas",
          scss: "scss",
          bash: "bash",
          json: "json",
          js: "javascript",
          ts: "typescript",
          "": "unspecified",
          tsx: "TypeScript (React)",
          jsx: "JavaScript (React)",
        },
        autoLoadLanguageSupport: false,
        codeMirrorExtensions: theme,
      }),
      diffSourcePlugin({ viewMode: "rich-text", diffMarkdown: "" }),
      toolbarPlugin({
        toolbarContents: () => (
          <ConditionalContents
            options={[
              {
                when: (editor) => editor?.editorType === "codeblock",
                contents: () => <ChangeCodeMirrorLanguage />,
              },
              {
                fallback: () => (
                  <>
                    <UndoRedo />
                    <Separator />

                    <BoldItalicUnderlineToggles />
                    <Separator />

                    <ListsToggle />
                    <Separator />

                    <CreateLink />
                    <InsertImage />
                    <Separator />

                    <InsertTable />
                    <InsertThematicBreak />

                    <InsertCodeBlock />
                  </>
                ),
              },
            ]}
          />
        ),
      }),
    ],
    [theme]
  );

  return (
    <MDXEditor
      key={resolvedTheme}
      markdown={value}
      ref={editorRef}
      onChange={fieldChange}
      className="background-light800_dark200 light-border-2 markdown-editor dark-editor w-full border"
      plugins={plugins}
      {...props}
    />
  );
};

export default Editor;
