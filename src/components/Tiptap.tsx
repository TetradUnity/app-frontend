'use client';

import MathExtension from "@aarkue/tiptap-math-extension";
import CharacterCount from "@tiptap/extension-character-count";
import Color from "@tiptap/extension-color";
import Underline from "@tiptap/extension-underline";
import { BubbleMenu, Editor, EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Button } from "antd";

import { FileImageOutlined } from "@ant-design/icons";

import React, { useImperativeHandle, useState } from "react";

import "katex/dist/katex.min.css";
import ImageUploadModal from "./ImageUploadModal";
import Image from "@tiptap/extension-image";

export type TiptapRef = {
    getEditor: () => Editor | null
}

type TiptapProps = React.HTMLAttributes<HTMLDivElement> & {
    charsLimit?: number,
    openImageUploadModal?: (cb: (url: string) => void) => void
};

const BubbleMenuButton = ({editor, property, text, onClick} : {editor: Editor, property: string, text: string, onClick: () => void}) => {
    return (
        <Button
            onClick={onClick}
            type={editor.isActive(property) ? "dashed" : "default"}
            style={{color: editor.isActive(property) ? "var(--primary-light)" : ""}}
        >{text}</Button>
    )
}

const Tiptap = React.forwardRef((props : TiptapProps, ref) => {
    const [modalOpen, setModalOpen] = useState(true);

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                blockquote: false,
                bulletList: false,
                codeBlock: false,
                horizontalRule: false,
                listItem: false,
                orderedList: false,
                heading: false,
            }),
            Color.configure({
                types: ['textStyle']
            }),
            CharacterCount.configure({
                limit: props.charsLimit || 100
            }),
            Underline,
            Image,
            MathExtension
        ],
        content: ""
    });

    useImperativeHandle(ref, () => ({
        getEditor: () => editor
    } as TiptapRef));

    const callback = (url: string) => {
        editor?.commands.setImage({src: url, alt: "uploaded_img", title: "hack u!"});
    }

    return (
        <>
            {editor && <BubbleMenu editor={editor} tippyOptions={{duration: 50}}>
                <BubbleMenuButton
                    editor={editor}
                    property="bold"
                    text="Жирний"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                />

                <BubbleMenuButton
                    editor={editor}
                    property="italic"
                    text="Курсив"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                />

                <BubbleMenuButton
                    editor={editor}
                    property="strike"
                    text="Закреслити"
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                />

                <BubbleMenuButton
                    editor={editor}
                    property="underline"
                    text="Підчеркнути"
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                />
            </BubbleMenu>}

            <EditorContent
                {...props}
                editor={editor}
            />
            {props.openImageUploadModal && 
            <Button
                size="small"
                type="dashed"
                shape="round"
                icon={<FileImageOutlined />}
                style={{display: "block", marginLeft: "auto"}}

                //@ts-ignore
                onClick={() => props.openImageUploadModal(callback)}
            />}
        </>
    );
});

export default Tiptap;