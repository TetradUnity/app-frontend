'use client';

import Foreground from "@/components/Foreground";
import Tiptap, { TiptapRef } from "@/components/Tiptap";
import ImageUploadModal from "@/components/modals/ImageUploadModal";
import BackButton from "@/components/subject/BackButton";
import { DraftService } from "@/services/draft.service";
import { Drafts } from "@/types/api.types";
import { Button, DatePicker, Form, Input, Modal, Switch } from "antd";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";

const draftStore = DraftService.createStore<Drafts.Material>("material_create_draft");

export default function MaterialCreatePage() {
    const [form] = Form.useForm();
    const tiptapRef = React.useRef<TiptapRef>();

    const [isHomeworkEnabled, setIsHomeworkEnabled] = useState(false);
    const isDraftModalVisible = React.useRef<boolean>();

    const [modal, modalCtx] = Modal.useModal();

    const [uploadModalOpen, setUploadModalOpen] = useState(false);
    const [uploadModalCallback, setUploadModalCallback] = useState<(url: string) => void>(() => {});
    const openImageUploadModal = (callback: (url: string) => void) => {
        setUploadModalCallback(() => callback);
        setUploadModalOpen(true);
    }

    const onSubmit = () => {

    }

    const saveDraft = () => {
        let descEditor = tiptapRef.current?.getEditor();

        draftStore.save({
            title: form.getFieldValue("title"),
            homework: form.getFieldValue("homework"),
            homework_deadline: form.getFieldValue("homework_deadline") && (form.getFieldValue("homework_deadline").unix() * 1000) || undefined,
            material: descEditor?.getHTML()
        })
    }

    const loadFromDraft = (draft: Drafts.Material) => {
        form.setFieldValue("title", draft.title);
        form.setFieldValue("homework", draft.homework);
        setIsHomeworkEnabled(draft.homework || false);

        if (draft.homework_deadline) {
            form.setFieldValue("homework_deadline", dayjs(draft.homework_deadline));
        }

        if (draft.material) {
            let id = setInterval(() => {
                let editor = tiptapRef.current?.getEditor();
                
                if (!editor) {
                    return;
                }
    
                editor.commands.setContent(draft.material as string);
                clearInterval(id);
            }, 10);
        }
    }

    useEffect(() => {
        let modalInstance = null;
        if (draftStore.isExist()) {
            isDraftModalVisible.current = true;
            modalInstance = modal.confirm({
                title: "Чернетка",
                content: <p>Система виявила незбережені дані {dayjs(draftStore.getDraftDate()).format("DD/MM/YYYY о HH:mm")}. Завантажити їх?</p>,
                okText: "Так",
                cancelText: "Видалити",
                
                onOk: () => {
                    isDraftModalVisible.current = false;
                    let data = draftStore.load();
                    if (!data) {
                        modal.error({
                            title: "Помилка",
                            content: <p>Не вдалось загрузити чорновик. Пошкоджені дані.</p>
                        });
                        return;
                    }
                    loadFromDraft(data);
                },
                onCancel: () => {
                    isDraftModalVisible.current = false;
                    draftStore.remove();
                }
            })
        }

        const beforeUnload = (e: BeforeUnloadEvent) => {
            e.preventDefault();
            e.returnValue = true;
        }

        window.addEventListener("beforeunload", beforeUnload);
        window.addEventListener("unload", saveDraft);

        let intervalId = setInterval(() => {
            if (isDraftModalVisible.current) {
                return;
            }
            saveDraft();
        }, 60 * 1000);

        return () => {
            window.removeEventListener("beforeunload", beforeUnload);
            clearInterval(intervalId);
            modalInstance?.destroy();
        }
    }, [])

    return (
        <Foreground>
            <BackButton />
            <h1 style={{marginTop: 10, marginBottom: 15}}>Створити матеріал</h1>

            <Form
                layout="vertical"
                form={form}
                onFinish={onSubmit}
                onValuesChange={({homework}) => {
                    if (typeof homework == 'boolean') {
                        setIsHomeworkEnabled(homework);
                    }
                }}
            >
                <Form.Item name="title" label="Заголовок:" rules={[
                    { required: true, message: "Обов'язкове поле!" },
                    { min: 2, message: "Заголовок повина мати більше ніж 2 символа." },
                    { max: 25, message: "Заголовок не може мати більше аніж 25 символів." }
                ]}>
                    <Input />
                </Form.Item>

                <Form.Item name="homework" label="Домашнє завдання:" required>
                    <Switch />
                </Form.Item>

                {isHomeworkEnabled &&
                    <Form.Item name="homework_deadline" label="До якої дати потрібно здати:" required>
                        <DatePicker />
                    </Form.Item>
                }

                <Form.Item label="Матеріал:" required>
                    <p>Тут можна форматувати текст. Подробніше за посиланням <a href="/faq/text_formatting">тут.</a></p>
                    <Tiptap
                        ref={tiptapRef}
                        className="tiptap-text-area"
                        charsLimit={10000}
                        listsEnabled
                        openImageUploadModal={openImageUploadModal}
                        style={{
                            background: "var(--foreground-lighter)",
                            minHeight: 200,
                            padding: 10,
                            borderRadius: 15
                        }}
                    />
                </Form.Item>

                <Button
                    style={{display: "block", margin: "auto"}}
                    htmlType="submit"
                    type="primary"
                >
                    Створити
                </Button>
            </Form>

            <ImageUploadModal
                open={uploadModalOpen}
                setOpen={setUploadModalOpen}
                callback={uploadModalCallback}
            />
            {modalCtx}
        </Foreground>
    )
}