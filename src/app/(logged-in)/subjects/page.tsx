'use client'

import {
    AutoComplete,
    Button,
    Divider,
    Empty,
    Flex,
    GetRef,
    Input,
    Modal,
    Pagination,
    Radio,
    Select,
    Space,
    Spin,
    Tag
} from "antd";
import React, {useEffect, useState} from "react";

import {
    FilterOutlined,
    PlusCircleFilled,
    SearchOutlined
} from "@ant-design/icons";

import SubjectCard from "@/components/cards/AnouncedSubjectCard";
import Link from "next/link";
import {useProfileStore} from "@/stores/profileStore";
import {useShallow} from "zustand/react/shallow";
import {IAnnouncedSubjectShort} from "@/types/api.types";

import {LoadingOutlined} from '@ant-design/icons';
import {filterProps} from "@/services/announced_subject.service";
import translateRequestError from "@/utils/ErrorUtils";
import {TweenOneGroup} from "rc-tween-one";

import {PlusOutlined} from "@ant-design/icons";
import {TagsService} from "@/services/tags.service";
import {debounce} from "lodash";
import {AnnouncedSubjectService} from "@/services/announced_subject.service";
import styles from "./styles.module.css";
import Filters from "@/components/subjects/Filters";

export default function Subjects() {
    const profileRole = useProfileStore(useShallow(state => state.role));

    const [isFetching, setIsFetching] = useState(true);
    const [isError, setIsError] = useState<string | null>(null);
    const [subjects, setSubjects] = useState<IAnnouncedSubjectShort[]>([]);
    const [maximumPages, setMaximumPages] = useState(1);

    /* Filters */
    const [filterModalVisible, setFilterModalVisible] = useState(false);

    const [withExam, setWithExam] = useState<number | undefined>(undefined);
    const [teacherFirstName, setTeacherFirstName] = useState('');
    const [teacherLastName, setTeacherLastName] = useState('');
    const [titleSearch, setTitleSearch] = useState('');
    const [tags, setTags] = useState<string[]>([]);

    const getFilters = () => {
        let filters: filterProps = {};

        if (withExam != undefined) {
            filters.has_exam = (withExam == 1);
        }
        if (titleSearch) {
            filters.title = titleSearch;
        }
        if (teacherFirstName) {
            filters.first_name_teacher = teacherFirstName;
        }
        if (teacherLastName) {
            filters.last_name_teacher = teacherLastName;
        }
        if (tags.length > 0) {
            filters.tags = tags;
        }

        return filters;
    }

    const fetch = (page: number) => {
        setIsFetching(true);

        AnnouncedSubjectService.getAnnouncedSubjects(page, getFilters()).then(res => {
            setIsFetching(false);
            if (!res.success) {
                // @ts-ignore
                setIsError(res.error_code);
                setSubjects([]);
                return;
            }

            // @ts-ignore
            setSubjects(res.data);
            // @ts-ignore
            setMaximumPages(res.count_pages);
            setIsError(null);
        })
    }

    const [tagInputVisible, setTagInputVisible] = useState(false);
    const [tagInputValue, setTagInputValue] = useState('');
    const tagInputRef = React.useRef<GetRef<typeof Select>>(null);
    const [tagDropdownVisible, setTagDropdownVisible] = useState(false);
    const [tagOptions, setTagOptions] = useState<{ value: string }[]>([]);
    const [tagsLoading, setTagsLoading] = useState(false);

    useEffect(() => {
        if (tagInputVisible) {
            tagInputRef.current?.focus();
        }
    }, [tagInputVisible]);

    const removeTag = (tagToRemove: string) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    }

    const onInputConfirm = () => {
        let tag = tagInputValue.trim();
        if (tag.length > 0 && tags.indexOf(tag) === -1) {
            setTags([...tags, tag]);
        }

        setTagInputVisible(false);
        setTagInputValue('');
    }

    const onInputChange = (query: string) => {
        let value = query.substring(0, 20);
        setTagInputValue(value);
    }

    const showInput = () => {
        if (tags.length == 5) {
            return;
        }
        setTagInputVisible(true);
    }

    const searchTags = async (query: string) => {
        if (tagInputValue.length < 1) {
            setTagOptions([]);
            return;
        }
        if (tagsLoading) {
            return;
        }

        setTagsLoading(true);

        let response = await TagsService.search(query);

        setTagsLoading(false);

        if (!response.success) {
            setTagOptions([]);
            return;
        }

        // @ts-ignore
        setTagOptions(response.data?.map(tag => ({value: tag})));
    }

    useEffect(() => {
        document.title = `Предмети / Пошук`;

        fetch(1);
    }, [])

    const resetFilters = () => {
        setWithExam(undefined);
        setTeacherFirstName('');
        setTeacherLastName('');
        setTags([]);
        setMaximumPages(1);
        fetch(1);
        applyFilters()
    }

    const applyFilters = () => {
        setMaximumPages(1);
        fetch(1);
    }

    return (
        <Flex gap='var(--gap)'>
            <Flex vertical gap='var(--gap)' style={{
                background: 'var(--foreground)',
                padding: "12px 16px",
                borderRadius: 8,
                flexGrow: 1,
            }}>
                <Flex justify="space-between" align="flex-end">
                    <h2 style={{fontWeight: 350}}>Предмети</h2>
                    <Flex gap={16}>
                        {profileRole == "CHIEF_TEACHER" &&
                            <>
                                <div className={styles.createBtnLong}>
                                    <Button size="small" type="primary"
                                            icon={<PlusCircleFilled/>}>
                                        <Link href="/subject/create">Створити новий предмет</Link>
                                    </Button>
                                </div>
                                <div className={styles.createBtnShort}>
                                    <Button size="small" type="primary" style={{width: "100%"}}
                                            icon={<PlusCircleFilled/>} href="/subject/create"/>
                                </div>
                            </>
                        }
                    </Flex>
                </Flex>
                <div style={{display: "flex", gap: "var(--gap)"}}>
                    <Input
                        placeholder="Пошук по назві"
                        prefix={<SearchOutlined/>}
                        onPressEnter={applyFilters}
                        value={titleSearch}
                        onChange={e => setTitleSearch(e.target.value)}
                    />
                    <div className={styles.filterBtn}>
                        <Button style={{width:"100%"}} icon={<FilterOutlined/>}
                                onClick={() => setFilterModalVisible(true)}></Button>
                    </div>
                </div>

                {isFetching &&
                    <Spin
                        indicator={<LoadingOutlined style={{fontSize: 60}}/>}
                        spinning={true}
                    />}

                <p style={{textAlign: "center"}}>
                    {isError && translateRequestError(isError)}
                    {((isError == null && !isFetching) && subjects.length == 0) &&
                        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={"Поки що порожньо"}/>}
                </p>

                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
                    gap: "var(--gap)",
                    gridArea: "content",
                    minWidth: 0,
                    opacity: isFetching ? 0.4 : 1,
                }}>
                    {subjects.map(subject => (
                        <SubjectCard key={subject.id} subject={subject} filters={getFilters()}/>
                    ))}
                </div>

                <Pagination
                    simple
                    showSizeChanger={false}
                    defaultCurrent={1}
                    total={maximumPages * 12}
                    pageSize={12}
                    style={{display: "block", margin: "auto"}}
                    disabled={isFetching || (isError != null)}
                    onChange={page => {
                        fetch(page);
                    }}
                />
            </Flex>
            {/*@ts-ignore*/}
            <Filters
                withExam={withExam}
                setWithExam={setWithExam}
                teacherFirstName={teacherFirstName}
                setTeacherFirstName={setTeacherFirstName}
                teacherLastName={teacherLastName}
                setTeacherLastName={setTeacherLastName}
                tags={tags}
                setTags={setTags}
                resetFilters={resetFilters}
                applyFilters={applyFilters}
                searchTags={searchTags}
                removeTag={removeTag}
                showInput={showInput}
                onInputChange={onInputChange}
                onInputConfirm={onInputConfirm}
                tagInputVisible={tagInputVisible}
                tagInputValue={tagInputValue}
                tagOptions={tagOptions}
                tagInputRef={tagInputRef}
                tagDropdownVisible={tagDropdownVisible}
                tagsLoading={tagsLoading}
                setTagInputVisible={setTagInputVisible}
                setTagInputValue={setTagInputValue}
                setTagOptions={setTagOptions}
                setTagDropdownVisible={setTagDropdownVisible}
            />
            <Modal visible={filterModalVisible} onCancel={() => setFilterModalVisible(false)} footer={null} centered>
                <Filters
                    withExam={withExam}
                    setWithExam={setWithExam}
                    teacherFirstName={teacherFirstName}
                    setTeacherFirstName={setTeacherFirstName}
                    teacherLastName={teacherLastName}
                    setTeacherLastName={setTeacherLastName}
                    tags={tags}
                    setTags={setTags}
                    resetFilters={resetFilters}
                    applyFilters={applyFilters}
                    searchTags={searchTags}
                    removeTag={removeTag}
                    showInput={showInput}
                    onInputChange={onInputChange}
                    onInputConfirm={onInputConfirm}
                    tagInputVisible={tagInputVisible}
                    tagInputValue={tagInputValue}
                    tagOptions={tagOptions}
                    tagInputRef={tagInputRef}
                    tagDropdownVisible={tagDropdownVisible}
                    tagsLoading={tagsLoading}
                    setTagInputVisible={setTagInputVisible}
                    setTagInputValue={setTagInputValue}
                    setTagOptions={setTagOptions}
                    setTagDropdownVisible={setTagDropdownVisible}
                    style={{position: "static", width: "100%", background: 'none'}}
                />
            </Modal>
        </Flex>
    );
}