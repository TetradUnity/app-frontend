'use client';

import Foreground from "@/components/Foreground";
import Tiptap, { TiptapRef } from "@/components/Tiptap";
import BackButton from "@/components/subject/BackButton";
import { TestConstructor, TestConstructorRef } from "@/components/tests/TestConstructor";
import { DraftService } from "@/services/draft.service";
import { Drafts } from "@/types/api.types";
import { Button, DatePicker, Form, Input, InputNumber, Modal, Switch } from "antd";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import {useParams, useRouter} from "next/navigation";
import {useProfileStore} from "@/stores/profileStore";
import {useShallow} from "zustand/react/shallow";

const draftStore = DraftService.createStore<Drafts.TestMaterial>("test_material_create_draft");

export default function TestCreatePage() {
    const [form] = Form.useForm();
    const [modal, modalCtx] = Modal.useModal();

    const testRef = React.useRef<TestConstructorRef>();
    const isDraftModalVisible = React.useRef<boolean>();

    const onSubmit = () => {

    }

    const saveDraft = () => {
        draftStore.save({
            title: form.getFieldValue("title"),
            deadline: form.getFieldValue("deadline") && (form.getFieldValue("deadline").unix() * 1000) || undefined,
            max_attempts: form.getFieldValue("max_attempts"),
            test: testRef.current?.getDataAsDraft()
        })
    }

    const loadFromDraft = (draft: Drafts.TestMaterial) => {
        form.setFieldValue("title", draft.title);
        form.setFieldValue("max_attempts", draft.max_attempts);

        if (draft.deadline) {
            form.setFieldValue("deadline", dayjs(draft.deadline));
        }

        if (draft.test) {
            let id = setInterval(() => {
                if (!testRef.current) {
                    return;
                }
                if (draft.test) {
                    testRef.current.loadFromDraft(draft.test);
                }
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

    const { slug } = useParams();
    const { push } = useRouter();
    const role = useProfileStore(useShallow(state => state.role));

    if (role != "TEACHER") {
        push("/subject/" + slug + "/assigments");
        return null;
    }

    return (
        <Foreground>
            <BackButton navTo="assignments" />
            <h1 style={{marginTop: 10, marginBottom: 15}}>Створити тест</h1>

            <Form
                layout="vertical"
                form={form}
                onFinish={onSubmit}
            >
                <Form.Item name="title" label="Заголовок:" rules={[
                    { required: true, message: "Обов'язкове поле!" },
                    { min: 2, message: "Заголовок повина мати більше ніж 2 символа." },
                    { max: 25, message: "Заголовок не може мати більше аніж 25 символів." }
                ]}>
                    <Input />
                </Form.Item>

                <Form.Item name="deadline" label="До якої дати потрібно здати:" required>
                    <DatePicker />
                </Form.Item>

                <Form.Item label="Кількість спроб:" name="max_attempts" rules={[
                    { required: true, message: "Обов'язкове поле!" },
                    { type: "number", min: 1, max: 3, message: "Кількість спроб може бути від 1 до 3." }
                ]}>
                    <InputNumber />
                </Form.Item>

                <Form.Item label="Тест:" required>
                    <TestConstructor ref={testRef} />
                </Form.Item>

                <Button
                    style={{display: "block", margin: "auto"}}
                    htmlType="submit"
                    type="primary"
                >
                    Створити
                </Button>
            </Form>

            {modalCtx}
        </Foreground>
    )
}