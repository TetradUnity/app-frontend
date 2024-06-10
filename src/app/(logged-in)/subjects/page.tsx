'use client'

import {AutoComplete, Button, Divider, Empty, Flex, GetRef, Input, InputRef, Pagination, Radio, Select, Spin, Tag} from "antd";
import React, {useEffect, useState} from "react";

import {
    PlusCircleFilled,
    SearchOutlined
} from "@ant-design/icons";

import SubjectCard from "@/components/cards/SubjectCard";
import Link from "next/link";
import {useProfileStore} from "@/stores/profileStore";
import {useShallow} from "zustand/react/shallow";
import {IAnnouncedSubjectShort} from "@/types/api.types";

import {LoadingOutlined} from '@ant-design/icons';
import {SubjectService, filterProps} from "@/services/subject.service";
import translateRequestError from "@/utils/ErrorUtils";
import { TweenOneGroup } from "rc-tween-one";

import { PlusOutlined } from "@ant-design/icons";
import { TagsService } from "@/services/tags.service";
import { debounce } from "lodash";

export default function Subjects() {
    const profileRole = useProfileStore(useShallow(state => state.role));

    const [isFetching, setIsFetching] = useState(true);
    const [isError, setIsError] = useState<string | null>(null);
    const [subjects, setSubjects] = useState<IAnnouncedSubjectShort[]>([]);
    const [maximumPages, setMaximumPages] = useState(1);

    /* Filters */
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
        
        SubjectService.getAnnouncedSubjects(page, getFilters()).then(res => {
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
        setWithExam(undefined); setTeacherFirstName(''); setTeacherLastName(''); setTags([]);
        setMaximumPages(1);
        fetch(1);
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
                    <Flex gap={15}>
                        {profileRole == "CHIEF_TEACHER" &&
                            <Button size="small" type="primary" style={{fontSize: 15}} icon={<PlusCircleFilled/>}>
                                <Link href="/subject/create">Створити новий предмет</Link>
                            </Button>
                        }
                    </Flex>
                </Flex>

                <Input
                    placeholder="Пошук по назві"
                    prefix={<SearchOutlined/>}
                    onPressEnter={applyFilters}
                    value={titleSearch}
                    onChange={e => setTitleSearch(e.target.value)}
                />


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
                    opacity: isFetching ? 0.4 : 1
                }}>
                    {subjects.map(subject => (
                        <SubjectCard key={subject.id} subject={subject} filters={getFilters()} />
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
            <div style={{
                background: 'var(--foreground)',
                padding: "12px 16px",
                borderRadius: 8,
                position: "sticky",
                top: 'calc(58px + var(--gap))',
                height: "fit-content",
                width: "270px",
            }}>
                <h2>Фільтри</h2>
                
                <Divider style={{margin: "10px 0"}} />

                <h4 style={{marginBottom: 5}}>Екзамен:</h4>
                <Radio.Group
                    value={withExam}
                    onChange={e => {
                        setWithExam(e.target.value);
                    }}
                >
                    <Radio value={1}>З</Radio>
                    <Radio value={2}>Без</Radio>
                </Radio.Group>

                <Divider style={{margin: "10px 0"}} />

                <h4 style={{marginBottom: 5}}>Вчитель:</h4>
                <div>
                    <Flex gap={38}>
                        <p>Ім'я:</p>
                        <Input
                            value={teacherFirstName}
                            onChange={e => setTeacherFirstName(e.target.value)}
                            size="small"
                        />
                    </Flex>

                    <Flex style={{marginTop: 10}} gap={10}>
                        <p>Фамілія:</p>
                        <Input
                            value={teacherLastName}
                            onChange={e => setTeacherLastName(e.target.value)}
                            size="small"
                        />
                    </Flex>
                </div>

                <Divider style={{margin: "10px 0"}} />

                <h4>Теги:</h4>
                <div>
                    <TweenOneGroup
                        appear={false}
                        enter={{ scale: 0.8, opacity: 0, type: 'from', duration: 100 }}
                        leave={{ opacity: 0, width: 0, scale: 0, duration: 200 }}
                        style={{display: "inline-block"}}
                        onEnd={(e) => {
                            if (e.type === 'appear' || e.type === 'enter') {
                            (e.target as any).style = 'display: inline-block';
                            }
                        }}
                    >
                        {tags.map(tag => 
                        <span key={tag} style={{display: "inline-block"}}>
                                <Tag
                                    style={{marginTop: 10}}
                                    closable
                                    onClose={(e) => {
                                        e.preventDefault();
                                        removeTag(tag)
                                    }}
                                >
                                    {tag}
                                </Tag>
                        </span>
                        )}
                    </TweenOneGroup>

                    {tagInputVisible
                        ? <AutoComplete
                            ref={tagInputRef}
                            style={{width: 140, height: 25, marginTop: 10}}
                            value={tagInputValue}
                            onChange={onInputChange}
                            onBlur={onInputConfirm}
                            backfill
                            options={tagOptions}
                            onSelect={tag => setTagInputValue(tag)}
                            onDropdownVisibleChange={open => setTagDropdownVisible(open)}
                            onSearch={debounce(searchTags, 400)}
                            onKeyDown={e => {
                                if (e.key == "Enter" && !tagDropdownVisible) {
                                    onInputConfirm();
                                }
                            }}
                            notFoundContent={tagsLoading && <Spin spinning style={{display: "block", margin: "auto"}} />}
                        />
                        :  <Tag
                                onClick={showInput}
                                style={{
                                    borderStyle: "dashed",
                                    cursor: "pointer",
                                    display: "inline-block",
                                    marginTop: 10
                                }}
                                color="cyan"
                            >
                                <PlusOutlined /> Добавити
                            </Tag>
                    }
                </div>

                <Divider style={{margin: "10px 0"}} />

                <div style={{width: "fit-content", display: "block", marginLeft: "auto"}}>
                    <Button onClick={resetFilters} size="small" style={{fontSize: 14, marginRight: 5}}>Скинути</Button>
                    <Button onClick={applyFilters} size="small" style={{fontSize: 14}} type="primary">Застосувати</Button>
                </div>
            </div>
        </Flex>
    );
}