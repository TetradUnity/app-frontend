'use client';

import MathExtension from "@aarkue/tiptap-math-extension";
import CharacterCount from "@tiptap/extension-character-count";
import Color from "@tiptap/extension-color";
import Underline from "@tiptap/extension-underline";
import { BubbleMenu, Editor, EditorContent, useEditor } from "@tiptap/react";
import StarterKit, { StarterKitOptions } from "@tiptap/starter-kit";
import { Button } from "antd";

import { FileImageOutlined } from "@ant-design/icons";

import React, { useEffect, useImperativeHandle, useState } from "react";

import "katex/dist/katex.min.css";
import Image from "@tiptap/extension-image";
import OrderedList from "@tiptap/extension-ordered-list";
import BulletList from "@tiptap/extension-bullet-list";
import ListItem from "@tiptap/extension-list-item";

export type TiptapRef = {
    getEditor: () => Editor | null
}

type TiptapProps = React.HTMLAttributes<HTMLDivElement> & {
    charsLimit?: number,
    content?: string,
    editable?: boolean,
    openImageUploadModal?: (cb: (url: string) => void) => void,
    listsEnabled?: boolean,
    dontAddMath?: boolean,
    showCharCounter?: boolean
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

const getStarterKitConfig = (props : TiptapProps) => {
    let starterKitConfig: Partial<StarterKitOptions> = {
        blockquote: false,
        codeBlock: false,
        horizontalRule: false,
        listItem: false,
        heading: false,
    };

    if (!props.listsEnabled) {
        starterKitConfig.bulletList = false;
        starterKitConfig.orderedList = false;
    }

    return starterKitConfig;
}

const getAdditionalExtensions = (props : TiptapProps) => {
    let arr = [];
    
    if (props.listsEnabled) {
        arr.push(OrderedList, BulletList, ListItem)
    }

    if (!props.dontAddMath) {
        arr.push(MathExtension);
    }

    return arr;
}

type ImageAttributes = {
    src: string
    alt?: string
    title?: string
    style?: string
};

const Tiptap = React.forwardRef((props : TiptapProps, ref) => {
    let isEditable = props.editable;
    if (props.editable == null || props.editable == undefined) {
        isEditable = true;
    }
    let charsLimit = props.charsLimit || 300

    const editor = useEditor({
        extensions: [
            StarterKit.configure(getStarterKitConfig(props)),
            Color.configure({
                types: ['textStyle']
            }),
            CharacterCount.configure({
                limit: charsLimit
            }),
            Underline,
            Image.extend({
                addAttributes() {
                    return {
                        src: {
                          default: '',
                        },
                        alt: {
                          default: undefined,
                        },
                        title: {
                          default: undefined,
                        },
                        style: {
                          default: undefined,
                        }
                      }
                },
            }).configure({
                inline: true
            }),
            ...getAdditionalExtensions(props)
        ],
        content: props.content || "",
        editable: isEditable
    });

    useImperativeHandle(ref, () => ({
        getEditor: () => editor
    }) as TiptapRef);

    const callback = (url: string) => {
        editor?.commands.setImage({
            src: url, alt: "uploaded_img",
            style: "max-width: 100%; height: 100px; max-height: 180px;"
        } as ImageAttributes);
    };

    useEffect(() => {
        if (!(editor && props.content)) return;

        editor.commands.setContent(props.content);
    }, [props.content]);


    let dontInclude = ['charsLimit', 'content', 'editable', 'openImageUploadModal', 'listsEnabled', 'dontAddMath'];
    const tiptapDivAttributes = (() => {
        let attribs = {};
        let keys = Object.keys(props);

        let key = null;
        for (let i = 0; i < keys.length; i++) {
            key = keys[i];
            if (!dontInclude.includes(key)) {
                // @ts-ignore
                attribs[key] = props[key];
            }
        }

        return attribs;
    })();

    //@ts-ignore
    const isTextSelected = (editor && !editor.state.selection.node);

    return (
        <>  
            {(editor && editor.isEditable) && <BubbleMenu editor={editor} tippyOptions={{duration: 10}} shouldShow={({from, to}) => from != to}>
                {isTextSelected
                ?     <>
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

                        {props.listsEnabled && <>
                                <BubbleMenuButton
                                    editor={editor}
                                    property="orderedList"
                                    text="Впорядкований список"
                                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                                />

                                <BubbleMenuButton
                                    editor={editor}
                                    property="bulletList"
                                    text="Маркований список"
                                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                                />
                            </>
                        }
                    </>

                    : <>
                        <Button
                            onClick={() => editor.commands.deleteSelection()}
                            type="default"
                            danger
                        >Видалити</Button>
                    </>
                }
            </BubbleMenu>}

            <EditorContent
                {...tiptapDivAttributes}
                editor={editor}
            />
            {props.showCharCounter &&
                <p>{editor ? (editor.storage.characterCount.characters()) : 0}/{charsLimit}</p>
            }

            {props.openImageUploadModal && 
            <Button
                size="small"
                type="dashed"
                shape="round"
                icon={<FileImageOutlined />}
                style={{display: "block", marginLeft: "auto", marginTop: 5}}

                //@ts-ignore
                onClick={() => props.openImageUploadModal(callback)}
            />}
        </>
    );
});

export default Tiptap;